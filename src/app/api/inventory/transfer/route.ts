/**
 * Stock Transfer API Route
 * Phase 26.1.4: Multi-location Inventory Management
 * 
 * POST /api/inventory/transfer - Transfer stock between locations
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema for transfer request
const TransferSchema = z.object({
  sourceLocationId: z.string().min(1, 'Source location is required'),
  targetLocationId: z.string().min(1, 'Target location is required'),
  items: z.array(z.object({
    inventoryId: z.string().min(1),
    quantity: z.number().int().positive(),
  })).min(1, 'At least one item is required'),
  notes: z.string().optional(),
  referenceId: z.string().optional(),
});

/**
 * POST /api/inventory/transfer
 * Transfer stock between locations
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if ((session.user.role as any) !== 'ADMIN' && (session.user.role as any) !== 'SELLER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const data = TransferSchema.parse(body);

    if (data.sourceLocationId === data.targetLocationId) {
      return NextResponse.json(
        { error: 'Source and target locations must be different' },
        { status: 400 }
      );
    }

    // Verify locations exist
    const [sourceLocation, targetLocation] = await Promise.all([
      prisma.inventoryLocation.findUnique({ where: { id: data.sourceLocationId } }),
      prisma.inventoryLocation.findUnique({ where: { id: data.targetLocationId } }),
    ]);

    if (!sourceLocation || !targetLocation) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    }

    // Process transfer in transaction
    const result = await prisma.$transaction(async (tx) => {
      const transfers = [];

      for (const item of data.items) {
        // Get source inventory
        const sourceInventory = await tx.inventoryItem.findUnique({
          where: { id: item.inventoryId },
          include: { variant: { select: { id: true, sku: true } } },
        });

        if (!sourceInventory) {
          throw new Error(`Inventory item ${item.inventoryId} not found`);
        }

        if (sourceInventory.quantity < item.quantity) {
          throw new Error(`Insufficient stock for ${sourceInventory.variant?.sku}`);
        }

        // Decrease source inventory
        await tx.inventoryItem.update({
          where: { id: item.inventoryId },
          data: { quantity: { decrement: item.quantity } },
        });

        // Find or create target inventory
        let targetInventory = await tx.inventoryItem.findFirst({
          where: {
            variantId: sourceInventory.variantId,
            locationId: data.targetLocationId,
          },
        });

        if (targetInventory) {
          await tx.inventoryItem.update({
            where: { id: targetInventory.id },
            data: { quantity: { increment: item.quantity } },
          });
        } else {
          targetInventory = await tx.inventoryItem.create({
            data: {
              variantId: sourceInventory.variantId,
              locationId: data.targetLocationId,
              quantity: item.quantity,
              reservedQuantity: 0,
            },
          });
        }

        // Create movement records for audit trail
        const referenceId = data.referenceId || `TR-${Date.now()}`;

        // Source movement (OUT)
        await tx.inventoryMovement.create({
          data: {
            variantId: sourceInventory.variantId,
            locationId: data.sourceLocationId,
            movementType: 'TRANSFER',
            quantity: -item.quantity,
            referenceType: 'TRANSFER_OUT',
            referenceId,
            notes: data.notes || `Transfer to ${targetLocation.name}`,
            createdById: session.user.id,
          },
        });

        // Target movement (IN)
        await tx.inventoryMovement.create({
          data: {
            variantId: sourceInventory.variantId,
            locationId: data.targetLocationId,
            movementType: 'TRANSFER',
            quantity: item.quantity,
            referenceType: 'TRANSFER_IN',
            referenceId,
            notes: data.notes || `Transfer from ${sourceLocation.name}`,
            createdById: session.user.id,
          },
        });

        transfers.push({
          variantId: sourceInventory.variantId,
          sku: sourceInventory.variant?.sku,
          quantity: item.quantity,
          sourceLocationId: data.sourceLocationId,
          targetLocationId: data.targetLocationId,
        });
      }

      return transfers;
    });

    return NextResponse.json({
      message: 'Stock transferred successfully',
      transfers: result,
    });
  } catch (error) {
    console.error('Error transferring stock:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 });
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

