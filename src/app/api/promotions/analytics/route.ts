/**
 * Promotions Analytics API Route
 * Phase 26.2.6: Promotion Analytics Dashboard
 * 
 * GET /api/promotions/analytics - Get promotion performance metrics
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/promotions/analytics
 * Get promotion performance analytics
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build where clause for vendor filtering
    const where: any = {};
    if ((session.user.role as any) === 'SELLER') {
      const vendor = await prisma.vendor.findFirst({
        where: { userId: session.user.id },
        select: { id: true },
      });
      if (vendor) {
        where.vendorId = vendor.id;
      }
    }

    // Add date range filter
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    // Return mock analytics data (would aggregate from actual orders/promotions)
    const metrics = {
      totalRevenue: 125000,
      totalDiscountGiven: 18500,
      totalOrders: 342,
      averageOrderValue: 365.5,
      conversionRate: 4.2,
      newCustomers: 89,
      repeatCustomers: 156,
    };

    const topPromotions = [
      {
        id: '1',
        name: 'Summer Sale',
        type: 'DISCOUNT',
        revenue: 45000,
        discountGiven: 6750,
        orders: 123,
        roi: 5.67,
        status: 'ACTIVE',
      },
      {
        id: '2',
        name: 'WELCOME10',
        type: 'COUPON',
        revenue: 32000,
        discountGiven: 4800,
        orders: 87,
        roi: 5.67,
        status: 'ACTIVE',
      },
      {
        id: '3',
        name: 'Flash Friday',
        type: 'FLASH_SALE',
        revenue: 28000,
        discountGiven: 5600,
        orders: 76,
        roi: 4.0,
        status: 'ENDED',
      },
      {
        id: '4',
        name: 'Bulk Order Discount',
        type: 'DISCOUNT',
        revenue: 20000,
        discountGiven: 3350,
        orders: 56,
        roi: 4.97,
        status: 'ACTIVE',
      },
    ];

    // Calculate trends (mock data)
    const trends = {
      revenueChange: 12.5,
      ordersChange: 8.3,
      newCustomersChange: 15.2,
      conversionChange: 0.5,
    };

    return NextResponse.json({
      metrics,
      topPromotions,
      trends,
      dateRange: {
        start: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        end: endDate || new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching promotion analytics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

