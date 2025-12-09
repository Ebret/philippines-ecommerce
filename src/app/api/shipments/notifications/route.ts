import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

/**
 * Shipping notification preferences schema
 */
const NotificationPreferencesSchema = z.object({
  channels: z.array(z.enum(['EMAIL', 'SMS', 'PUSH', 'IN_APP'])).min(1),
  events: z.array(z.enum([
    'ORDER_CONFIRMED',
    'PREPARING_SHIPMENT',
    'SHIPPED',
    'IN_TRANSIT',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'DELIVERY_FAILED',
    'DELIVERY_RESCHEDULED',
  ])).min(1),
  quietHoursEnabled: z.boolean().default(false),
  quietHoursStart: z.string().optional(),
  quietHoursEnd: z.string().optional(),
});

/**
 * Default notification preferences
 */
const DEFAULT_PREFERENCES = {
  channels: ['EMAIL', 'IN_APP'],
  events: ['ORDER_CONFIRMED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'DELIVERY_FAILED'],
  quietHoursEnabled: false,
};

/**
 * GET /api/shipments/notifications
 * Get user's shipping notification preferences
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        phone: true,
        preferences: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get shipping notification preferences from user preferences
    const userPrefs = user.preferences as any || {};
    const shippingPrefs = userPrefs.shippingNotifications || DEFAULT_PREFERENCES;

    return NextResponse.json({
      preferences: shippingPrefs,
      contactInfo: {
        email: user.email,
        phone: user.phone,
        hasEmail: !!user.email,
        hasPhone: !!user.phone,
      },
    });
  } catch (error) {
    console.error("Error getting notification preferences:", error);
    return NextResponse.json(
      { error: "Failed to get notification preferences" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/shipments/notifications
 * Update user's shipping notification preferences
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = NotificationPreferencesSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Validate SMS channel requires phone number
    if (validatedData.channels.includes('SMS') && !user.phone) {
      return NextResponse.json(
        { error: "Phone number required for SMS notifications" },
        { status: 400 }
      );
    }

    // Update user preferences
    const currentPrefs = user.preferences as any || {};
    const updatedPrefs = {
      ...currentPrefs,
      shippingNotifications: validatedData,
    };

    await prisma.user.update({
      where: { id: user.id },
      data: { preferences: updatedPrefs },
    });

    return NextResponse.json({
      message: "Notification preferences updated successfully",
      preferences: validatedData,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error updating notification preferences:", error);
    return NextResponse.json(
      { error: "Failed to update notification preferences" },
      { status: 500 }
    );
  }
}

