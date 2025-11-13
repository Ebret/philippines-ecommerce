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

    // Get vendor ID from user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { vendor: true },
    });

    if (!user?.vendor) {
      return NextResponse.json({ error: 'Not a vendor' }, { status: 403 });
    }

    const vendorId = user.vendor.id;

    // Get KPIs
    const orders = await prisma.order.findMany({
      where: { vendorId },
      include: { items: true, payments: true },
    });

    const products = await prisma.product.findMany({
      where: { vendorId },
      include: { variants: true },
    });

    const totalSales = orders.length;
    const totalRevenue = orders.reduce((sum, order) => {
      const amount = typeof order.totalAmount === 'string'
        ? parseFloat(order.totalAmount)
        : Number(order.totalAmount);
      return sum + amount;
    }, 0);

    const pendingOrders = orders.filter(o => o.status === 'PENDING' || o.status === 'CONFIRMED').length;
    const completedOrders = orders.filter(o => o.status === 'DELIVERED').length;
    const lowStockProducts = products.filter(p =>
      p.variants.some(v => v.stockQuantity < 10)
    ).length;

    const kpis = {
      totalSales,
      totalOrders: orders.length,
      totalRevenue,
      averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
      pendingOrders,
      completedOrders,
      totalProducts: products.length,
      lowStockProducts,
      totalCustomers: new Set(orders.map(o => o.userId)).size,
      returnRate: 0, // Calculate based on returns
    };

    // Get recent orders
    const recentOrders = orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        totalAmount: typeof order.totalAmount === 'string' ? parseFloat(order.totalAmount) : order.totalAmount,
        createdAt: order.createdAt,
        itemCount: order.items.length,
      }));

    return NextResponse.json({
      kpis,
      recentOrders,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}

