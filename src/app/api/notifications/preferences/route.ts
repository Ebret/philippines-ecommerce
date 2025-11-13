/**
 * GET/PUT /api/notifications/preferences
 * Get and update notification preferences
 * Week 8: Notifications System
 */

import { NextRequest, NextResponse } from 'next/server';
import { NotificationPreferenceSchema } from '@/lib/notification-schemas';
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

    const preferences = await prisma.notificationPreference.findUnique({
      where: { userId: session.user.id },
    });

    if (!preferences) {
      // Create default preferences
      const defaultPreferences = await prisma.notificationPreference.create({
        data: {
          userId: session.user.id,
          emailNotifications: true,
          smsNotifications: true,
          inAppNotifications: true,
          pushNotifications: true,
          orderUpdates: true,
          promotions: true,
          accountAlerts: true,
          vendorUpdates: false,
          frequency: 'immediate',
        },
      });
      return NextResponse.json({ success: true, data: defaultPreferences }, { status: 200 });
    }

    return NextResponse.json({ success: true, data: preferences }, { status: 200 });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preferences' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validated = NotificationPreferenceSchema.parse(body);

    const preferences = await prisma.notificationPreference.upsert({
      where: { userId: session.user.id },
      update: validated,
      create: {
        userId: session.user.id,
        ...validated,
      },
    });

    return NextResponse.json(
      { success: true, data: preferences },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    );
  }
}

