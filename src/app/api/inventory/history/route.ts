/**
 * Inventory History API Route
 * Phase 26.1.3: Inventory History & Audit Logs
 * 
 * GET /api/inventory/history - Get inventory change history
 * Provides detailed history of inventory changes with filtering.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/inventory/history
 * Get inventory change history
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    const inventoryId = searchParams.get('inventoryId') || undefined;
    const variantId = searchParams.get('variantId') || undefined;
    const productId = searchParams.get('productId') || undefined;
    const action = searchParams.get('action') || undefined;
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;

    // Build where clause for movements
    const where: any = {};

    if (variantId) where.variantId = variantId;
    if (action && action !== 'all') {
      // Map action to movement type
      const actionMap: Record<string, string> = {
        CREATED: 'IN',
        ADJUSTED: 'ADJUSTMENT',
        TRANSFERRED: 'TRANSFER',
      };
      where.movementType = actionMap[action] || action;
    }

    // Date range filter
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    // Filter by vendor if user is a seller
    if ((session.user.role as any) === 'SELLER') {
      where.location = {
        vendor: { userId: session.user.id },
      };
    }

    // If productId is provided, get all variants for that product
    if (productId) {
      const variants = await prisma.productVariant.findMany({
        where: { productId },
        select: { id: true },
      });
      where.variantId = { in: variants.map(v => v.id) };
    }

    // Get movements as history entries
    const movements = await prisma.inventoryMovement.findMany({
      where,
      include: {
        variant: {
          select: {
            id: true,
            name: true,
            sku: true,
            product: { select: { name: true } },
          },
        },
        location: { select: { id: true, name: true } },
        createdBy: {
          select: {
            id: true,
            email: true,
            profile: { select: { firstName: true, lastName: true } }
          }
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    // Transform movements to history entries
    const entries = movements.map(m => {
      const userName = m.createdBy?.profile
        ? `${m.createdBy.profile.firstName || ''} ${m.createdBy.profile.lastName || ''}`.trim() || 'Unknown'
        : 'System';

      return {
        id: m.id,
        timestamp: m.createdAt.toISOString(),
        action: m.movementType === 'IN' ? 'CREATED'
          : m.movementType === 'OUT' ? 'ADJUSTED'
          : m.movementType === 'TRANSFER' ? 'TRANSFERRED'
          : 'UPDATED',
        movementType: m.movementType,
        quantity: m.quantity,
        reason: m.referenceType,
        notes: m.notes,
        user: {
          id: m.createdBy?.id || '',
          name: userName,
          email: m.createdBy?.email || 'system@example.com'
        },
        variant: m.variant,
        location: m.location,
      };
    });

    return NextResponse.json({
      entries,
      total: entries.length,
    });
  } catch (error) {
    console.error('Error fetching inventory history:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

