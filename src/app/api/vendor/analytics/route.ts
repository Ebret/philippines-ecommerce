import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { vendor: true },
    });

    if (!user?.vendor) {
      return NextResponse.json({ error: 'Not a vendor' }, { status: 403 });
    }

    const vendorId = user.vendor.id;
    const range = request.nextUrl.searchParams.get('range') || '30days';

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    if (range === '7days') startDate.setDate(now.getDate() - 7);
    else if (range === '30days') startDate.setDate(now.getDate() - 30);
    else if (range === '90days') startDate.setDate(now.getDate() - 90);
    else if (range === '1year') startDate.setFullYear(now.getFullYear() - 1);

    // Get orders in range
    const orders = await prisma.order.findMany({
      where: {
        vendorId,
        createdAt: { gte: startDate },
      },
      include: { items: { include: { product: true } } },
    });

    // Sales trend
    const salesTrend = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dayOrders = orders.filter(o => 
        new Date(o.createdAt).toDateString() === date.toDateString()
      );
      salesTrend.push({
        date: date.toISOString().split('T')[0],
        sales: dayOrders.length,
        orders: dayOrders.length,
      });
    }

    // Top products
    const productSales: Record<string, { name: string; sales: number; revenue: number }> = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = {
            name: item.product.name,
            sales: 0,
            revenue: 0,
          };
        }
        productSales[item.productId].sales += item.quantity;
        const price = typeof item.unitPrice === 'string' ? parseFloat(item.unitPrice) : item.unitPrice;
        productSales[item.productId].revenue += Number(price) * item.quantity;
      });
    });

    const topProducts = Object.entries(productSales)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Revenue breakdown
    const totalRevenue = orders.reduce((sum, order) => {
      const amount = typeof order.totalAmount === 'string'
        ? parseFloat(order.totalAmount)
        : Number(order.totalAmount);
      return sum + amount;
    }, 0);

    const revenueBreakdown = [
      { category: 'Product Sales', revenue: totalRevenue * 0.85, percentage: 85 },
      { category: 'Shipping', revenue: totalRevenue * 0.10, percentage: 10 },
      { category: 'Other', revenue: totalRevenue * 0.05, percentage: 5 },
    ];

    // Customer insights
    const uniqueCustomers = new Set(orders.map(o => o.userId)).size;
    const newCustomers = new Set(
      orders.filter(o => new Date(o.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
        .map(o => o.userId)
    ).size;

    const customerInsights = {
      totalCustomers: uniqueCustomers,
      newCustomers,
      repeatCustomers: uniqueCustomers - newCustomers,
      averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
    };

    return NextResponse.json({
      salesTrend,
      revenueBreakdown,
      topProducts,
      customerInsights,
      trafficSources: [],
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

