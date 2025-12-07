import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/orders/stats
 * Get order statistics for admin dashboard
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user with role
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { vendor: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check authorization (admin or vendor)
    const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';
    const isVendor = !!user.vendor;

    if (!isAdmin && !isVendor) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Build where clause based on role
    const whereClause = isAdmin ? {} : { vendorId: user.vendor!.id };

    // Get date range from query params
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (startDate) {
      Object.assign(whereClause, { createdAt: { gte: new Date(startDate) } });
    }
    if (endDate) {
      Object.assign(whereClause, {
        createdAt: { ...((whereClause as Record<string, unknown>).createdAt || {}), lte: new Date(endDate) },
      });
    }

    // Get order counts by status
    const [
      totalOrders,
      pendingOrders,
      confirmedOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      returnedOrders,
    ] = await Promise.all([
      prisma.order.count({ where: whereClause }),
      prisma.order.count({ where: { ...whereClause, status: 'PENDING' } }),
      prisma.order.count({ where: { ...whereClause, status: 'CONFIRMED' } }),
      prisma.order.count({ where: { ...whereClause, status: 'PROCESSING' } }),
      prisma.order.count({ where: { ...whereClause, status: 'SHIPPED' } }),
      prisma.order.count({ where: { ...whereClause, status: 'DELIVERED' } }),
      prisma.order.count({ where: { ...whereClause, status: 'CANCELLED' } }),
      prisma.order.count({ where: { ...whereClause, status: 'RETURNED' } }),
    ]);

    // Get revenue statistics
    const revenueStats = await prisma.order.aggregate({
      where: {
        ...whereClause,
        status: { notIn: ['CANCELLED', 'RETURNED'] },
        paymentStatus: 'PAID',
      },
      _sum: { totalAmount: true },
      _avg: { totalAmount: true },
      _count: true,
    });

    // Get payment status counts
    const [paidOrders, pendingPayments, failedPayments, refundedOrders] = await Promise.all([
      prisma.order.count({ where: { ...whereClause, paymentStatus: 'PAID' } }),
      prisma.order.count({ where: { ...whereClause, paymentStatus: 'PENDING' } }),
      prisma.order.count({ where: { ...whereClause, paymentStatus: 'FAILED' } }),
      prisma.order.count({ where: { ...whereClause, paymentStatus: { in: ['REFUNDED', 'PARTIALLY_REFUNDED'] } } }),
    ]);

    // Get recent orders trend (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentOrders = await prisma.order.groupBy({
      by: ['status'],
      where: { ...whereClause, createdAt: { gte: sevenDaysAgo } },
      _count: true,
    });

    return NextResponse.json({
      orderStats: {
        totalOrders,
        pendingOrders,
        confirmedOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        returnedOrders,
      },
      revenueStats: {
        totalRevenue: Number(revenueStats._sum.totalAmount || 0),
        averageOrderValue: Number(revenueStats._avg.totalAmount || 0),
        paidOrdersCount: revenueStats._count,
      },
      paymentStats: {
        paidOrders,
        pendingPayments,
        failedPayments,
        refundedOrders,
      },
      recentTrend: recentOrders.reduce((acc, item) => {
        acc[item.status] = item._count;
        return acc;
      }, {} as Record<string, number>),
    });
  } catch (error) {
    console.error('Error getting order stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

