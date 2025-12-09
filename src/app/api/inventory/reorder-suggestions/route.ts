/**
 * Reorder Suggestions API Route
 * Phase 26.1.5: Inventory Forecasting & Reorder Points
 * 
 * GET /api/inventory/reorder-suggestions - Get intelligent reorder suggestions
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { calculateReorderQuantity, calculateSafetyStock, needsReorder } from '@/lib/inventory-utils';

/**
 * GET /api/inventory/reorder-suggestions
 * Get reorder suggestions based on stock levels and sales velocity
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const vendorId = searchParams.get('vendorId') || undefined;
    const locationId = searchParams.get('locationId') || undefined;

    // Build where clause
    const where: any = {};
    if (locationId) where.locationId = locationId;

    // Filter by vendor for sellers
    if ((session.user.role as any) === 'SELLER') {
      const vendor = await prisma.vendor.findFirst({
        where: { userId: session.user.id },
        select: { id: true },
      });
      if (vendor) {
        where.location = { vendorId: vendor.id };
      }
    } else if (vendorId) {
      where.location = { vendorId };
    }

    // Get inventory items with low stock
    const inventoryItems = await prisma.inventoryItem.findMany({
      where,
      include: {
        variant: {
          select: {
            id: true,
            name: true,
            sku: true,
            costPrice: true,
            lowStockThreshold: true,
            product: { select: { name: true } },
          },
        },
        location: { select: { name: true } },
      },
    });

    // Get sales data for velocity calculation (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const suggestions = await Promise.all(
      inventoryItems.map(async (item) => {
        const threshold = item.variant?.lowStockThreshold || 10;
        const currentStock = item.quantity;

        // Get sales movements for this variant
        const salesMovements = await prisma.inventoryMovement.findMany({
          where: {
            variantId: item.variantId,
            movementType: 'OUT',
            createdAt: { gte: thirtyDaysAgo },
          },
          select: { quantity: true },
        });

        // Calculate average daily sales
        const totalSold = salesMovements.reduce((sum, m) => sum + Math.abs(m.quantity), 0);
        const averageDailySales = totalSold / 30;

        // Calculate days until stockout
        const daysUntilStockout = averageDailySales > 0 
          ? Math.floor(currentStock / averageDailySales) 
          : 999;

        // Calculate reorder point and suggested quantity
        const leadTimeDays = 7; // Default lead time
        const zScore = 1.65; // 95% service level
        const standardDeviation = averageDailySales * 0.3; // Assume 30% variability
        const safetyStock = calculateSafetyStock(zScore, standardDeviation, leadTimeDays);
        const reorderPoint = Math.ceil(averageDailySales * leadTimeDays + safetyStock);
        // calculateReorderQuantity(averageDailyDemand, leadTimeDays, safetyStock)
        const suggestedQuantity = calculateReorderQuantity(
          averageDailySales,
          leadTimeDays,
          safetyStock
        );

        // Determine priority
        let priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
        if (currentStock <= 0) priority = 'CRITICAL';
        else if (currentStock <= threshold / 2) priority = 'HIGH';
        else if (currentStock <= threshold) priority = 'MEDIUM';

        // Only include items that need reorder
        if (!needsReorder(currentStock, reorderPoint, safetyStock)) {
          return null;
        }

        return {
          id: item.id,
          variantId: item.variantId,
          productName: item.variant?.product?.name || 'Unknown',
          variantName: item.variant?.name,
          sku: item.variant?.sku || '',
          currentStock,
          reorderPoint,
          suggestedQuantity: Math.max(suggestedQuantity, threshold * 2),
          averageDailySales,
          daysUntilStockout,
          leadTimeDays,
          priority,
          estimatedCost: suggestedQuantity * (item.variant?.costPrice?.toNumber() || 0),
        };
      })
    );

    // Filter out nulls and sort by priority
    const priorityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
    const filteredSuggestions = suggestions
      .filter((s): s is NonNullable<typeof s> => s !== null)
      .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return NextResponse.json({ suggestions: filteredSuggestions });
  } catch (error) {
    console.error('Error fetching reorder suggestions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

