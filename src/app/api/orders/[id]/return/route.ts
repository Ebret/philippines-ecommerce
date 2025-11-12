import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OrderReturnSchema } from "@/lib/validations/order";
import { canReturnOrder, calculateRefundAmount } from "@/lib/order-utils";

/**
 * POST /api/orders/[id]/return
 * Request return for delivered order
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const body = await request.json();
    const validatedData = OrderReturnSchema.parse(body);

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
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

    // Check if order can be returned
    const deliveredDate = order.shipment?.deliveredAt || null;
    if (!canReturnOrder(order.status, deliveredDate)) {
      return NextResponse.json(
        {
          error: "Order cannot be returned. Must be delivered within 30 days.",
        },
        { status: 400 }
      );
    }

    // Validate return items exist in order
    const returnItemIds = validatedData.items.map((item) => item.orderItemId);
    const validItems = order.items.filter((item) =>
      returnItemIds.includes(item.id)
    );

    if (validItems.length !== validatedData.items.length) {
      return NextResponse.json(
        { error: "Some return items not found in order" },
        { status: 400 }
      );
    }

    // Calculate refund amount based on returned items
    const returnedItemsTotal = validItems.reduce(
      (sum, item) => sum + Number(item.totalPrice),
      0
    );

    const refundAmount = calculateRefundAmount(returnedItemsTotal, 0);

    // Update order status to RETURNED
    const returnedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: "RETURNED",
        notes: `Return requested: ${validatedData.reason}`,
      },
      include: {
        items: true,
        payments: true,
      },
    });

    // Update payment status to REFUNDED
    if (returnedOrder.payments.length > 0) {
      await prisma.payment.update({
        where: { id: returnedOrder.payments[0].id },
        data: {
          status: "REFUNDED",
        },
      });
    }

    return NextResponse.json(
      {
        message: "Return request submitted successfully",
        order: returnedOrder,
        returnDetails: {
          items: validatedData.items,
          reason: validatedData.reason,
          refundAmount,
          refundMethod: validatedData.refundMethod || "ORIGINAL_PAYMENT",
          status: "PENDING_APPROVAL",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json(
        { error: "Invalid return data" },
        { status: 400 }
      );
    }

    console.error("Error processing return:", error);
    return NextResponse.json(
      { error: "Failed to process return" },
      { status: 500 }
    );
  }
}

