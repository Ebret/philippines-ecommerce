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

    // Get all orders
    const orders = await prisma.order.findMany({
      where: { vendorId },
      include: { payments: true },
    });

    // Calculate earnings
    const totalEarnings = orders.reduce((sum, order) => {
      const amount = typeof order.totalAmount === 'string'
        ? parseFloat(order.totalAmount)
        : Number(order.totalAmount);
      return sum + amount;
    }, 0);

    // Commission is typically 10-15% of sales
    const commissionRate = 0.12; // 12% commission
    const totalCommission = totalEarnings * commissionRate;
    const netEarnings = totalEarnings - totalCommission;

    // Mock payout history (in production, this would come from a Payout model)
    const payoutHistory = [
      {
        id: '1',
        amount: Math.floor(netEarnings * 0.5),
        status: 'COMPLETED',
        requestDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        payoutDate: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
      },
    ];

    const completedPayouts = payoutHistory.filter(p => p.status === 'COMPLETED');
    const totalPaidOut = completedPayouts.reduce((sum, p) => sum + p.amount, 0);
    const pendingPayout = netEarnings - totalPaidOut;
    const lastPayout = completedPayouts[0];

    return NextResponse.json({
      totalEarnings,
      totalCommission,
      pendingPayout: Math.max(0, pendingPayout),
      lastPayoutDate: lastPayout?.payoutDate || null,
      payoutHistory,
    });
  } catch (error) {
    console.error('Earnings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch earnings' },
      { status: 500 }
    );
  }
}

