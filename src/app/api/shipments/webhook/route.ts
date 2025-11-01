import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { LogisticsFactory } from "@/lib/logistics/factory";
import { LogisticsWebhookSchema } from "@/lib/validations/order";

/**
 * POST /api/shipments/webhook
 * Handle webhook updates from logistics providers
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate webhook payload
    const validatedPayload = LogisticsWebhookSchema.parse(body);

    // Get provider and verify signature
    const provider = LogisticsFactory.getProvider(validatedPayload.provider);

    const isValid = provider.verifyWebhookSignature(
      body,
      validatedPayload.signature
    );

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 401 }
      );
    }

    // Find shipment by tracking number
    const shipment = await prisma.shipment.findFirst({
      where: {
        trackingNumber: validatedPayload.trackingNumber,
        provider: validatedPayload.provider,
      },
      include: {
        order: true,
      },
    });

    if (!shipment) {
      return NextResponse.json(
        { error: "Shipment not found" },
        { status: 404 }
      );
    }

    // Update shipment status
    const updateData: any = {
      status: validatedPayload.status,
    };

    // Set timestamps based on status
    if (validatedPayload.status === "SHIPPED" && !shipment.shippedAt) {
      updateData.shippedAt = new Date();
    }

    if (validatedPayload.status === "DELIVERED" && !shipment.deliveredAt) {
      updateData.deliveredAt = new Date();
    }

    if (validatedPayload.notes) {
      updateData.notes = validatedPayload.notes;
    }

    const updatedShipment = await prisma.shipment.update({
      where: { id: shipment.id },
      data: updateData,
    });

    // Update order status if shipment is delivered
    if (validatedPayload.status === "DELIVERED") {
      await prisma.order.update({
        where: { id: shipment.orderId },
        data: { status: "DELIVERED" },
      });
    }

    // Update order status if shipment is shipped
    if (validatedPayload.status === "SHIPPED") {
      await prisma.order.update({
        where: { id: shipment.orderId },
        data: { status: "SHIPPED" },
      });
    }

    return NextResponse.json(
      {
        message: "Webhook processed successfully",
        shipment: updatedShipment,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json(
        { error: "Invalid webhook payload" },
        { status: 400 }
      );
    }

    console.error("Error processing shipment webhook:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}

