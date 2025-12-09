/**
 * Inventory Forecast API Route
 * Phase 26.1.5: Inventory Forecasting & Reorder Points
 * 
 * GET /api/inventory/forecast - Get inventory forecast for a variant
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { calculateSafetyStock } from '@/lib/inventory-utils';

/**
 * GET /api/inventory/forecast
 * Get inventory forecast with historical and projected data
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const variantId = searchParams.get('variantId');
    const days = parseInt(searchParams.get('days') || '30');

    if (!variantId) {
      return NextResponse.json({ error: 'variantId is required' }, { status: 400 });
    }

    // Get variant info
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      select: {
        id: true,
        name: true,
        sku: true,
        stockQuantity: true,
        lowStockThreshold: true,
        product: { select: { name: true } },
      },
    });

    if (!variant) {
      return NextResponse.json({ error: 'Variant not found' }, { status: 404 });
    }

    // Get historical movements
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const movements = await prisma.inventoryMovement.findMany({
      where: {
        variantId,
        createdAt: { gte: startDate },
      },
      orderBy: { createdAt: 'asc' },
      select: { quantity: true, createdAt: true, movementType: true },
    });

    // Calculate daily sales
    const dailySales: Record<string, number> = {};
    movements.forEach(m => {
      if (m.movementType === 'OUT') {
        const date = m.createdAt.toISOString().split('T')[0];
        dailySales[date] = (dailySales[date] || 0) + Math.abs(m.quantity);
      }
    });

    // Calculate average daily sales
    const salesValues = Object.values(dailySales);
    const averageDailySales = salesValues.length > 0
      ? salesValues.reduce((a, b) => a + b, 0) / salesValues.length
      : 0;

    // Calculate trend (compare last 7 days to previous 7 days)
    const recentDays = salesValues.slice(-7);
    const previousDays = salesValues.slice(-14, -7);
    const recentAvg = recentDays.length > 0 ? recentDays.reduce((a, b) => a + b, 0) / recentDays.length : 0;
    const previousAvg = previousDays.length > 0 ? previousDays.reduce((a, b) => a + b, 0) / previousDays.length : 0;
    
    let trend: 'UP' | 'DOWN' | 'STABLE' = 'STABLE';
    let trendPercentage = 0;
    if (previousAvg > 0) {
      trendPercentage = Math.round(((recentAvg - previousAvg) / previousAvg) * 100);
      if (trendPercentage > 10) trend = 'UP';
      else if (trendPercentage < -10) trend = 'DOWN';
    }

    // Calculate reorder metrics
    const leadTimeDays = 7;
    const zScore = 1.65; // 95% service level
    const standardDeviation = averageDailySales * 0.3; // Assume 30% variability
    const safetyStock = calculateSafetyStock(zScore, standardDeviation, leadTimeDays);
    const reorderPoint = Math.ceil(averageDailySales * leadTimeDays + safetyStock);
    const currentStock = variant.stockQuantity || 0;
    const daysUntilReorder = averageDailySales > 0
      ? Math.floor((currentStock - reorderPoint) / averageDailySales)
      : 999;
    const daysUntilStockout = averageDailySales > 0
      ? Math.floor(currentStock / averageDailySales)
      : 999;

    // Generate data points (historical + projected)
    const dataPoints = [];
    const today = new Date();
    
    // Historical data (past 14 days)
    for (let i = 14; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      dataPoints.push({
        date: dateStr,
        actual: i === 0 ? currentStock : undefined,
        reorderPoint,
        safetyStock,
      });
    }

    // Projected data (next 14 days)
    let projectedStock = currentStock;
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      projectedStock = Math.max(0, projectedStock - averageDailySales);
      
      dataPoints.push({
        date: dateStr,
        projected: Math.round(projectedStock),
        reorderPoint,
        safetyStock,
      });
    }

    return NextResponse.json({
      forecast: {
        variantId,
        productName: variant.product?.name || 'Unknown',
        sku: variant.sku,
        currentStock,
        reorderPoint,
        safetyStock,
        averageDailySales,
        trend,
        trendPercentage,
        daysUntilReorder: Math.max(0, daysUntilReorder),
        daysUntilStockout: Math.max(0, daysUntilStockout),
        dataPoints,
      },
    });
  } catch (error) {
    console.error('Error fetching forecast:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

