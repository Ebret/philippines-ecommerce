import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LogisticsFactory } from "@/lib/logistics/factory";

/**
 * GET /api/shipments/[id]/track
 * Get real-time tracking information for shipment
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

    const shipment = await prisma.shipment.findUnique({
      where: { id: id },
      include: {
        order: {
          select: {
            id: true,
            userId: true,
          },
        },
      },
    });

    if (!shipment) {
      return NextResponse.json(
        { error: "Shipment not found" },
        { status: 404 }
      );
    }

    // Check authorization
    if (
      shipment.order.userId !== user.id &&
      user.role !== "ADMIN"
    ) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    if (!shipment.trackingNumber) {
      return NextResponse.json(
        {
          message: "No tracking number available",
          tracking: null,
        },
        { status: 200 }
      );
    }

    try {
      // Get tracking information from logistics provider
      const provider = LogisticsFactory.getProvider(shipment.provider);
      const trackingInfo = await provider.trackShipment(
        shipment.trackingNumber
      );

      return NextResponse.json(
        {
          shipment: {
            id: shipment.id,
            trackingNumber: shipment.trackingNumber,
            provider: shipment.provider,
            status: shipment.status,
            shippedAt: shipment.shippedAt,
            deliveredAt: shipment.deliveredAt,
            estimatedDelivery: shipment.estimatedDelivery,
          },
          tracking: trackingInfo,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error fetching tracking info:", error);

      // Return shipment info even if tracking fails
      return NextResponse.json(
        {
          shipment: {
            id: shipment.id,
            trackingNumber: shipment.trackingNumber,
            provider: shipment.provider,
            status: shipment.status,
            shippedAt: shipment.shippedAt,
            deliveredAt: shipment.deliveredAt,
            estimatedDelivery: shipment.estimatedDelivery,
          },
          tracking: null,
          error: "Unable to fetch real-time tracking information",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error fetching tracking:", error);
    return NextResponse.json(
      { error: "Failed to fetch tracking information" },
      { status: 500 }
    );
  }
}

