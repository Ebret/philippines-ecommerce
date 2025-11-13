/**
 * POST /api/notifications/send
 * Send notification to user
 * Week 8: Notifications System
 */

import { NextRequest, NextResponse } from 'next/server';
import { notificationService } from '@/lib/notification-service';
import { SendNotificationSchema } from '@/lib/notification-schemas';
import { getServerSession } from 'next-auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validated = SendNotificationSchema.parse(body);

    // Verify user can only send to themselves or is admin
    if (validated.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const result = await notificationService.sendNotification(validated);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        notificationId: result.notificationId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}

