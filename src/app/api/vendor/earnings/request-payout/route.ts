import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
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
    const { amount } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // In production, this would create a Payout record in the database
    // For now, we'll return a mock response
    const payoutId = `payout_${Date.now()}`;

    return NextResponse.json({
      success: true,
      payout: {
        id: payoutId,
        amount,
        status: 'PENDING',
        createdAt: new Date(),
        message: 'Payout request submitted. You will receive the funds within 3-5 business days.',
      },
    });
  } catch (error) {
    console.error('Request payout error:', error);
    return NextResponse.json(
      { error: 'Failed to request payout' },
      { status: 500 }
    );
  }
}

