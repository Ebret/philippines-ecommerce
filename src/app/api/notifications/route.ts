/**
 * GET /api/notifications
 * Get user notifications
 * Week 8: Notifications System
 */

import { NextRequest, NextResponse } from 'next/server';
import { notificationService } from '@/lib/notification-service';
import { GetNotificationsSchema } from '@/lib/notification-schemas';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const validated = GetNotificationsSchema.parse({ limit, offset });

    const result = await notificationService.getUserNotifications(
      session.user.id,
      validated.limit,
      validated.offset
    );

    return NextResponse.json(
      {
        success: true,
        data: result.notifications,
        pagination: {
          total: result.total,
          limit: result.limit,
          offset: result.offset,
          pages: Math.ceil(result.total / result.limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

