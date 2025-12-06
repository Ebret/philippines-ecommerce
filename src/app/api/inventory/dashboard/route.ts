/**
 * Inventory Dashboard API Route
 * Phase 26.1.1: Real-time Inventory Tracking & Low Stock Alerts
 * 
 * GET /api/inventory/dashboard - Get inventory dashboard data with summary
 * Provides real-time inventory overview, stock levels, and alerts summary.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { InventoryQuerySchema } from '@/lib/validations/inventory';
import { determineInventoryStatus } from '@/lib/inventory-utils';

/**
 * GET /api/inventory/dashboard
 * Get inventory dashboard data with summary statistics
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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;
    const locationId = searchParams.get('locationId') || undefined;

    // Build where clause for filtering
    const where: any = {};

    // Filter by location if specified
    if (locationId) {
      where.locationId = locationId;
    }

    // Filter by vendor if user is a seller
    if ((session.user.role as any) === 'SELLER') {
      where.location = {
        vendor: { userId: session.user.id },
      };
    }

    // Search by product name or SKU
    if (search) {
      where.variant = {
        OR: [
          { sku: { contains: search, mode: 'insensitive' } },
          { name: { contains: search, mode: 'insensitive' } },
          { product: { name: { contains: search, mode: 'insensitive' } } },
        ],
      };
    }

    // Get total count for pagination
    const total = await prisma.inventoryItem.count({ where });

    // Get inventory items with related data
    const items = await prisma.inventoryItem.findMany({
      where,
      include: {
        variant: {
          select: {
            id: true,
            name: true,
            sku: true,
            price: true,
            lowStockThreshold: true,
            stockQuantity: true,
            product: { select: { id: true, name: true } },
          },
        },
        location: { select: { id: true, name: true, code: true } },
      },
      orderBy: { updatedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Calculate summary statistics
    const allItems = await prisma.inventoryItem.findMany({
      where: (session.user.role as any) === 'SELLER' 
        ? { location: { vendor: { userId: session.user.id } } }
        : {},
      include: {
        variant: { select: { price: true, lowStockThreshold: true } },
      },
    });

    // Calculate inventory summary
    let totalValue = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    let overstockCount = 0;

    allItems.forEach((item) => {
      const price = item.variant?.price ? Number(item.variant.price) : 0;
      totalValue += item.quantity * price;

      const threshold = item.variant?.lowStockThreshold || 10;
      const status = determineInventoryStatus(item.quantity, item.reservedQuantity, threshold);

      if (status === 'OUT_OF_STOCK') outOfStockCount++;
      else if (status === 'LOW_STOCK') lowStockCount++;
      else if (status === 'OVERSTOCK') overstockCount++;
    });

    // Get active alerts count
    const activeAlerts = await prisma.stockAlert.count({
      where: {
        isActive: true,
        ...(session.user.role as any) === 'SELLER' && {
          location: { vendor: { userId: session.user.id } },
        },
      },
    });

    // Return dashboard data
    return NextResponse.json({
      items,
      summary: {
        totalItems: allItems.length,
        totalValue: Math.round(totalValue * 100) / 100,
        lowStockCount,
        outOfStockCount,
        overstockCount,
        activeAlerts,
      },
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching inventory dashboard:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

