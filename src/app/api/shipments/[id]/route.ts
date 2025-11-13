import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ShipmentUpdateSchema } from "@/lib/validations/order";

/**
 * GET /api/shipments/[id]
 * Get shipment details
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
            orderNumber: true,
            userId: true,
            vendorId: true,
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

    return NextResponse.json(shipment, { status: 200 });
  } catch (error) {
    console.error("Error fetching shipment:", error);
    return NextResponse.json(
      { error: "Failed to fetch shipment" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/shipments/[id]
 * Update shipment status (admin only)
 */
export async function PATCH(
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

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin only" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = ShipmentUpdateSchema.parse(body);

    const shipment = await prisma.shipment.findUnique({
      where: { id: id },
    });

    if (!shipment) {
      return NextResponse.json(
        { error: "Shipment not found" },
        { status: 404 }
      );
    }

    // Update shipment
    const updateData: any = {
      status: validatedData.status,
    };

    if (validatedData.trackingNumber) {
      updateData.trackingNumber = validatedData.trackingNumber;
    }

    if (validatedData.estimatedDelivery) {
      updateData.estimatedDelivery = new Date(validatedData.estimatedDelivery);
    }

    if (validatedData.notes) {
      updateData.notes = validatedData.notes;
    }

    // Set shipped/delivered timestamps
    if (validatedData.status === "SHIPPED" && !shipment.shippedAt) {
      updateData.shippedAt = new Date();
    }

    if (validatedData.status === "DELIVERED" && !shipment.deliveredAt) {
      updateData.deliveredAt = new Date();
    }

    const updatedShipment = await prisma.shipment.update({
      where: { id: id },
      data: updateData,
      include: {
        order: true,
      },
    });

    // Update order status if shipment is delivered
    if (validatedData.status === "DELIVERED") {
      await prisma.order.update({
        where: { id: updatedShipment.orderId },
        data: { status: "DELIVERED" },
      });
    }

    return NextResponse.json(
      {
        message: "Shipment updated successfully",
        shipment: updatedShipment,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json(
        { error: "Invalid shipment data" },
        { status: 400 }
      );
    }

    console.error("Error updating shipment:", error);
    return NextResponse.json(
      { error: "Failed to update shipment" },
      { status: 500 }
    );
  }
}

