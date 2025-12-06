/**
 * Inventory Adjustment API Route
 * Phase 26.1.2: Inventory Adjustment Workflow
 * 
 * POST /api/inventory/adjust - Create inventory adjustment
 * Handles stock additions, removals, and transfers with audit logging.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema for adjustment request
const AdjustmentRequestSchema = z.object({
  inventoryId: z.string().min(1, 'Inventory ID is required'),
  type: z.enum(['ADD', 'REMOVE', 'TRANSFER']),
  quantity: z.number().int().positive('Quantity must be positive'),
  reason: z.enum([
    'INITIAL_STOCK', 'PURCHASE', 'RETURN', 'DAMAGE', 'LOSS', 'EXPIRY',
    'CORRECTION', 'TRANSFER_OUT', 'TRANSFER_IN', 'RECOUNT', 'SAMPLE', 'PROMOTION',
  ]),
  notes: z.string().optional(),
  referenceId: z.string().optional(),
  targetLocationId: z.string().optional(),
});

/**
 * POST /api/inventory/adjust
 * Create inventory adjustment
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only ADMIN and SELLER can adjust inventory
    if ((session.user.role as any) !== 'ADMIN' && (session.user.role as any) !== 'SELLER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Parse and validate request body
    const body = await request.json();
    const data = AdjustmentRequestSchema.parse(body);

    // Get inventory item
    const inventory = await prisma.inventoryItem.findUnique({
      where: { id: data.inventoryId },
      include: {
        variant: { select: { id: true, name: true, sku: true } },
        location: { 
          select: { id: true, name: true },
          include: { vendor: { select: { userId: true } } },
        },
      },
    });

    if (!inventory) {
      return NextResponse.json({ error: 'Inventory item not found' }, { status: 404 });
    }

    // Check authorization for sellers
    if (
      (session.user.role as any) === 'SELLER' &&
      inventory.location?.vendor?.userId !== session.user.id
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Validate removal doesn't exceed current stock
    if (data.type === 'REMOVE' && data.quantity > inventory.quantity) {
      return NextResponse.json(
        { error: 'Cannot remove more than current stock' },
        { status: 400 }
      );
    }

    // Calculate new quantity
    const newQuantity = data.type === 'ADD'
      ? inventory.quantity + data.quantity
      : inventory.quantity - data.quantity;

    // Determine movement type for audit log
    const movementType = data.type === 'ADD' ? 'IN' 
      : data.type === 'REMOVE' ? 'OUT' 
      : 'TRANSFER';

    // Use transaction to update inventory and create movement record
    const result = await prisma.$transaction(async (tx) => {
      // Update inventory quantity
      const updatedInventory = await tx.inventoryItem.update({
        where: { id: data.inventoryId },
        data: { quantity: newQuantity },
        include: {
          variant: { select: { id: true, name: true, sku: true } },
          location: { select: { id: true, name: true } },
        },
      });

      // Create movement record for audit trail
      const movement = await tx.inventoryMovement.create({
        data: {
          variantId: inventory.variantId,
          locationId: inventory.locationId,
          movementType,
          quantity: data.type === 'ADD' ? data.quantity : -data.quantity,
          referenceType: data.reason,
          referenceId: data.referenceId || null,
          notes: data.notes || null,
          createdById: session.user.id,
        },
      });

      // Check if stock is now low and trigger alert if needed
      const variant = await tx.productVariant.findUnique({
        where: { id: inventory.variantId },
        select: { lowStockThreshold: true },
      });

      const threshold = variant?.lowStockThreshold || 10;
      if (newQuantity <= threshold && newQuantity > 0) {
        // Check if alert already exists
        const existingAlert = await tx.stockAlert.findFirst({
          where: {
            variantId: inventory.variantId,
            locationId: inventory.locationId,
            isActive: true,
          },
        });

        if (!existingAlert) {
          await tx.stockAlert.create({
            data: {
              variantId: inventory.variantId,
              locationId: inventory.locationId,
              threshold,
              isActive: true,
            },
          });
        }
      }

      return { inventory: updatedInventory, movement };
    });

    return NextResponse.json({
      message: 'Inventory adjusted successfully',
      inventory: result.inventory,
      movement: result.movement,
      previousQuantity: inventory.quantity,
      newQuantity,
    });
  } catch (error) {
    console.error('Error adjusting inventory:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

