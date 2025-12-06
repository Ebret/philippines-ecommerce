/**
 * Stock Alert Dismiss API Route
 * Phase 26.1.1: Real-time Inventory Tracking & Low Stock Alerts
 * 
 * PATCH /api/inventory/alerts/[id]/dismiss - Dismiss a stock alert
 * Deactivates an alert so it no longer appears in the active alerts list.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * PATCH /api/inventory/alerts/[id]/dismiss
 * Dismiss a stock alert (deactivate it)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if alert exists
    const alert = await prisma.stockAlert.findUnique({
      where: { id },
      include: {
        location: {
          include: { vendor: { select: { userId: true } } },
        },
      },
    });

    if (!alert) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }

    // Check authorization for sellers
    if (
      (session.user.role as any) === 'SELLER' &&
      alert.location?.vendor?.userId !== session.user.id
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update alert - deactivate it
    const updatedAlert = await prisma.stockAlert.update({
      where: { id },
      data: {
        isActive: false,
        lastTriggered: new Date(),
      },
      include: {
        variant: {
          select: {
            id: true,
            name: true,
            sku: true,
            product: { select: { name: true } },
          },
        },
        location: { select: { id: true, name: true } },
      },
    });

    // Log the dismissal action
    console.log(`Alert ${id} dismissed by user ${session.user.id}`);

    return NextResponse.json({
      message: 'Alert dismissed successfully',
      alert: updatedAlert,
    });
  } catch (error) {
    console.error('Error dismissing alert:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

