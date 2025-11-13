import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LogisticsFactory } from "@/lib/logistics/factory";

/**
 * GET /api/orders/[id]/tracking
 * Get shipment tracking information
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: id },
      include: {
        shipment: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Check authorization
    if (order.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    if (!order.shipment) {
      return NextResponse.json(
        {
          message: "No shipment information available",
          shipment: null,
        },
        { status: 200 }
      );
    }

    // Get tracking information from logistics provider
    try {
      const provider = LogisticsFactory.getProvider(
        order.shipment.provider
      );

      if (order.shipment.trackingNumber) {
        const trackingInfo = await provider.trackShipment(
          order.shipment.trackingNumber
        );

        return NextResponse.json(
          {
            shipment: {
              id: order.shipment.id,
              trackingNumber: order.shipment.trackingNumber,
              provider: order.shipment.provider,
              status: order.shipment.status,
              shippedAt: order.shipment.shippedAt,
              deliveredAt: order.shipment.deliveredAt,
              estimatedDelivery: order.shipment.estimatedDelivery,
            },
            tracking: trackingInfo,
          },
          { status: 200 }
        );
      }
    } catch (error) {
      console.error("Error fetching tracking info:", error);
      // Return shipment info even if tracking fails
    }

    return NextResponse.json(
      {
        shipment: {
          id: order.shipment.id,
          trackingNumber: order.shipment.trackingNumber,
          provider: order.shipment.provider,
          status: order.shipment.status,
          shippedAt: order.shipment.shippedAt,
          deliveredAt: order.shipment.deliveredAt,
          estimatedDelivery: order.shipment.estimatedDelivery,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching tracking:", error);
    return NextResponse.json(
      { error: "Failed to fetch tracking information" },
      { status: 500 }
    );
  }
}

