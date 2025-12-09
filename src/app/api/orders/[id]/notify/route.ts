import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Notification schema
const orderNotificationSchema = z.object({
  type: z.enum([
    'ORDER_CONFIRMATION',
    'ORDER_STATUS_UPDATE',
    'PAYMENT_CONFIRMATION',
    'PAYMENT_FAILED',
    'SHIPMENT_UPDATE',
    'DELIVERY_CONFIRMATION',
    'REFUND_PROCESSED',
    'ORDER_CANCELLED',
  ]),
  channels: z.array(z.enum(['EMAIL', 'SMS', 'IN_APP', 'PUSH'])).min(1),
  customMessage: z.string().optional(),
});

// Notification templates
const NOTIFICATION_TEMPLATES: Record<string, { title: string; message: (order: any) => string }> = {
  ORDER_CONFIRMATION: {
    title: 'Order Confirmed',
    message: (order) => `Your order #${order.orderNumber} has been confirmed. Total: ₱${order.totalAmount}`,
  },
  ORDER_STATUS_UPDATE: {
    title: 'Order Status Updated',
    message: (order) => `Your order #${order.orderNumber} status has been updated to ${order.status}`,
  },
  PAYMENT_CONFIRMATION: {
    title: 'Payment Received',
    message: (order) => `Payment for order #${order.orderNumber} has been received. Amount: ₱${order.totalAmount}`,
  },
  PAYMENT_FAILED: {
    title: 'Payment Failed',
    message: (order) => `Payment for order #${order.orderNumber} has failed. Please try again.`,
  },
  SHIPMENT_UPDATE: {
    title: 'Shipment Update',
    message: (order) => `Your order #${order.orderNumber} has been shipped. Track your delivery.`,
  },
  DELIVERY_CONFIRMATION: {
    title: 'Order Delivered',
    message: (order) => `Your order #${order.orderNumber} has been delivered. Thank you for shopping!`,
  },
  REFUND_PROCESSED: {
    title: 'Refund Processed',
    message: (order) => `Refund for order #${order.orderNumber} has been processed. Amount: ₱${order.totalAmount}`,
  },
  ORDER_CANCELLED: {
    title: 'Order Cancelled',
    message: (order) => `Your order #${order.orderNumber} has been cancelled.`,
  },
};

/**
 * POST /api/orders/[id]/notify
 * Send notification for an order
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user with role
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { vendor: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check authorization (admin or vendor)
    const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';
    const isVendor = !!user.vendor;

    if (!isAdmin && !isVendor) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = orderNotificationSchema.parse(body);

    // Get order with user info
    // Note: User model doesn't have 'name' field, use profile.firstName/lastName instead
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
            profile: { select: { firstName: true, lastName: true } }
          }
        },
        vendor: { select: { id: true, storeName: true } },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check vendor authorization
    if (isVendor && user.vendor!.id !== order.vendorId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get notification template
    const template = NOTIFICATION_TEMPLATES[validatedData.type];
    const title = template.title;
    const message = validatedData.customMessage || template.message(order);

    // Create notifications for each channel
    const notifications = [];
    for (const channel of validatedData.channels) {
      const notification = await prisma.notification.create({
        data: {
          userId: order.userId,
          type: validatedData.type,
          title,
          message,
          channel,
          data: JSON.stringify({
            orderId: order.id,
            orderNumber: order.orderNumber,
            status: order.status,
            totalAmount: Number(order.totalAmount),
          }),
          isRead: false,
        },
      });
      notifications.push(notification);

      // Queue notification for processing
      await prisma.notificationQueue.create({
        data: {
          notificationId: notification.id,
          channel,
          recipient: channel === 'EMAIL' ? order.user.email : (order.user.phone || order.user.email),
          status: 'PENDING',
          retryCount: 0,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Notification sent via ${validatedData.channels.join(', ')}`,
      notifications: notifications.map((n) => ({ id: n.id, channel: n.channel })),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 });
    }
    console.error('Error sending order notification:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

