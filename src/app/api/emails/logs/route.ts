/**
 * GET /api/emails/logs
 * Get email logs for user
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { emailService } from '@/lib/email-service';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    const where: any = { userId: user.id };
    if (type) where.type = type;
    if (status) where.status = status;

    const logs = await prisma.emailLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    const stats = await emailService.getEmailStats(user.id);

    return NextResponse.json(
      {
        success: true,
        logs,
        stats,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get email logs error:', error);
    return NextResponse.json(
      { error: 'Failed to get email logs' },
      { status: 500 }
    );
  }
}

