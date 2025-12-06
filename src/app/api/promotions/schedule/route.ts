/**
 * Promotions Schedule API Route
 * Phase 26.2.4: Promotion Campaign Scheduler
 * 
 * GET /api/promotions/schedule - Get scheduled promotions for a month
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/promotions/schedule
 * Get scheduled promotions for a specific month
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());
    const month = parseInt(searchParams.get('month') || (new Date().getMonth() + 1).toString());

    // Calculate date range for the month
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);

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

    // Return mock data for now (would query actual promotions table)
    const promotions = [
      {
        id: 'promo-1',
        name: 'Holiday Sale',
        type: 'CAMPAIGN',
        startDate: new Date(year, month - 1, 15).toISOString(),
        endDate: new Date(year, month - 1, 25).toISOString(),
        status: 'SCHEDULED',
        description: 'Holiday season promotion',
      },
      {
        id: 'promo-2',
        name: 'Flash Friday',
        type: 'FLASH_SALE',
        startDate: new Date(year, month - 1, 20).toISOString(),
        endDate: new Date(year, month - 1, 20).toISOString(),
        status: 'SCHEDULED',
        description: 'Weekly flash sale event',
      },
      {
        id: 'promo-3',
        name: 'New Customer Discount',
        type: 'COUPON',
        startDate: new Date(year, month - 1, 1).toISOString(),
        endDate: new Date(year, month - 1, 28).toISOString(),
        status: 'ACTIVE',
        description: 'Welcome discount for new customers',
      },
    ];

    return NextResponse.json({ 
      promotions,
      month,
      year,
    });
  } catch (error) {
    console.error('Error fetching promotion schedule:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

