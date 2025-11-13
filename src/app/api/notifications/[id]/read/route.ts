/**
 * PUT /api/notifications/[id]/read
 * Mark notification as read
 * Week 8: Notifications System
 */

import { NextRequest, NextResponse } from 'next/server';
import { NotificationService } from '@/lib/notification-service';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Verify notification belongs to user
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    if (notification.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const success = await NotificationService.markAsRead(id);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to mark notification as read' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark notification as read' },
      { status: 500 }
    );
  }
}

