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
    const status = request.nextUrl.searchParams.get('status') || 'all';
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
    const limit = 20;
    const skip = (page - 1) * limit;

    // Build filter
    const filter: any = { vendorId };
    if (status !== 'all') {
      filter.status = status;
    }

    // Get orders
    const orders = await prisma.order.findMany({
      where: filter,
      include: {
        items: true,
        user: {
          include: { profile: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    const vendorOrders = orders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.user?.profile?.firstName || order.user?.email || 'Unknown',
      status: order.status,
      totalAmount: typeof order.totalAmount === 'string'
        ? parseFloat(order.totalAmount)
        : Number(order.totalAmount),
      itemCount: order.items.length,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));

    return NextResponse.json({
      orders: vendorOrders,
      page,
      limit,
    });
  } catch (error) {
    console.error('Vendor orders error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vendor orders' },
      { status: 500 }
    );
  }
}

