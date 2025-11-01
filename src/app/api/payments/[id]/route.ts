import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * GET /api/payments/[id]
 * Get payment details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Payment ID is required" },
        { status: 400 }
      );
    }

    // In production, fetch payment from database
    // For now, return mock payment data
    const mockPayment = {
      id,
      transactionId: `TXN-${id}`,
      orderId: `ORD-${id}`,
      amount: 1500,
      method: "GCASH",
      status: "COMPLETED",
      timestamp: new Date().toISOString(),
      receipt: {
        receiptNumber: `RCP-20251101-${id}`,
        items: [
          {
            name: "Product 1",
            quantity: 2,
            price: 500,
            subtotal: 1000,
          },
        ],
        subtotal: 1000,
        tax: 120,
        shipping: 50,
        total: 1170,
      },
    };

    return NextResponse.json(
      {
        success: true,
        payment: mockPayment,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching payment:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch payment",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/payments/[id]
 * Update payment status (admin only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check admin role (in production, verify from database)
    if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const { status, notes } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    // In production, update payment in database
    console.log("Payment updated:", {
      id,
      status,
      notes,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Payment updated successfully",
        payment: {
          id,
          status,
          notes,
          updatedAt: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating payment:", error);
    return NextResponse.json(
      {
        error: "Failed to update payment",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

