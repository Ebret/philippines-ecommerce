/**
 * Stock Alert Acknowledge API Route
 * Phase 26.1.1: Real-time Inventory Tracking & Low Stock Alerts
 * 
 * PATCH /api/inventory/alerts/[id]/acknowledge - Acknowledge a stock alert
 * Marks an alert as acknowledged by the user.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * PATCH /api/inventory/alerts/[id]/acknowledge
 * Acknowledge a stock alert
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

    // Update alert - mark as acknowledged by setting lastTriggered
    // Note: The StockAlert model doesn't have a status field, so we use lastTriggered
    // to track acknowledgement. In a full implementation, you might want to add
    // an acknowledgedAt field or status enum to the model.
    const updatedAlert = await prisma.stockAlert.update({
      where: { id },
      data: {
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

    // Log the acknowledgement action
    console.log(`Alert ${id} acknowledged by user ${session.user.id}`);

    return NextResponse.json({
      message: 'Alert acknowledged successfully',
      alert: updatedAlert,
    });
  } catch (error) {
    console.error('Error acknowledging alert:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

