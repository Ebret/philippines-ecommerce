import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OrderCancellationSchema } from "@/lib/validations/order";
import { canCancelOrder, calculateRefundAmount } from "@/lib/order-utils";

/**
 * POST /api/orders/[id]/cancel
 * Cancel an order and process refund
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
    const validatedData = OrderCancellationSchema.parse(body);

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        payments: true,
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

    // Check if order can be cancelled
    if (!canCancelOrder(order.status)) {
      return NextResponse.json(
        {
          error: `Cannot cancel order with status: ${order.status}`,
        },
        { status: 400 }
      );
    }

    // Calculate refund amount
    const refundAmount = calculateRefundAmount(
      order.totalAmount,
      order.shippingFee
    );

    // Update order status
    const cancelledOrder = await prisma.order.update({
      where: { id: id },
      data: {
        status: "CANCELLED",
        notes: `Cancelled: ${validatedData.reason}`,
      },
      include: {
        items: true,
        payments: true,
      },
    });

    // Create refund record if payment was made
    if (order.paymentStatus === "PAID" && order.payments.length > 0) {
      const payment = order.payments[0];

      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "REFUNDED",
        },
      });
    }

    return NextResponse.json(
      {
        message: "Order cancelled successfully",
        order: cancelledOrder,
        refund: {
          amount: refundAmount,
          method: validatedData.refundMethod || "ORIGINAL_PAYMENT",
          status: "PENDING",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json(
        { error: "Invalid cancellation data" },
        { status: 400 }
      );
    }

    console.error("Error cancelling order:", error);
    return NextResponse.json(
      { error: "Failed to cancel order" },
      { status: 500 }
    );
  }
}

