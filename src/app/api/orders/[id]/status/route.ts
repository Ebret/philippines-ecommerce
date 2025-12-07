import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Status update schema
const statusUpdateSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED']),
  notes: z.string().optional(),
  notifyCustomer: z.boolean().default(true),
});

// Valid status transitions
const VALID_TRANSITIONS: Record<string, string[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED', 'RETURNED'],
  DELIVERED: ['RETURNED'],
  CANCELLED: [],
  RETURNED: [],
};

/**
 * PATCH /api/orders/[id]/status
 * Update order status
 */
export async function PATCH(
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

    // Parse and validate request body
    const body = await request.json();
    const validatedData = statusUpdateSchema.parse(body);

    // Get current order
    const order = await prisma.order.findUnique({
      where: { id },
      include: { vendor: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check authorization (admin, vendor owner, or order owner)
    const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';
    const isVendorOwner = user.vendor?.id === order.vendorId;
    const isOrderOwner = user.id === order.userId;

    if (!isAdmin && !isVendorOwner && !isOrderOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Buyers can only cancel their own orders
    if (isOrderOwner && !isAdmin && !isVendorOwner) {
      if (validatedData.status !== 'CANCELLED') {
        return NextResponse.json({ error: 'Buyers can only cancel orders' }, { status: 403 });
      }
    }

    // Check valid status transition
    const validTransitions = VALID_TRANSITIONS[order.status];
    if (!validTransitions.includes(validatedData.status)) {
      return NextResponse.json(
        { error: `Cannot transition from ${order.status} to ${validatedData.status}` },
        { status: 400 }
      );
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: validatedData.status,
        notes: validatedData.notes ? `${order.notes || ''}\n[${new Date().toISOString()}] ${validatedData.status}: ${validatedData.notes}` : order.notes,
      },
      include: {
        items: { include: { product: true, variant: true } },
        payments: true,
        shipment: true,
        vendor: { select: { id: true, storeName: true } },
      },
    });

    // Create notification if enabled (placeholder for actual notification system)
    if (validatedData.notifyCustomer) {
      console.log(`Notification: Order ${order.orderNumber} status updated to ${validatedData.status}`);
    }

    return NextResponse.json({
      message: 'Order status updated successfully',
      order: updatedOrder,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 });
    }
    console.error('Error updating order status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * GET /api/orders/[id]/status
 * Get order status history
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const order = await prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        paymentStatus: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
        shipment: {
          select: { status: true, trackingNumber: true, shippedAt: true, deliveredAt: true },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Parse notes to extract status history
    const statusHistory = order.notes
      ? order.notes.split('\n').filter(Boolean).map((note) => {
          const match = note.match(/\[(.+?)\] (\w+): (.+)/);
          if (match) {
            return { timestamp: match[1], status: match[2], note: match[3] };
          }
          return null;
        }).filter(Boolean)
      : [];

    return NextResponse.json({
      currentStatus: order.status,
      paymentStatus: order.paymentStatus,
      shipmentStatus: order.shipment?.status || null,
      statusHistory,
      timestamps: {
        created: order.createdAt,
        updated: order.updatedAt,
        shipped: order.shipment?.shippedAt,
        delivered: order.shipment?.deliveredAt,
      },
    });
  } catch (error) {
    console.error('Error getting order status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

