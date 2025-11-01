import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CartSummarySchema } from "@/lib/validations/cart";

/**
 * POST /api/checkout/summary
 * Get checkout summary with all calculations
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = CartSummarySchema.parse(body);

    // Return the summary as-is (already calculated on client)
    const summary = {
      ...validatedData,
      currency: "PHP",
      timestamp: new Date(),
    };

    return NextResponse.json({
      summary,
      message: "Checkout summary retrieved",
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json(
        { error: "Invalid summary data" },
        { status: 400 }
      );
    }

    console.error("Error getting checkout summary:", error);
    return NextResponse.json(
      { error: "Failed to get checkout summary" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/checkout/summary
 * Get checkout summary for current user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Return empty summary structure
    const summary = {
      subtotal: 0,
      taxAmount: 0,
      shippingFee: 0,
      discountAmount: 0,
      totalAmount: 0,
      itemCount: 0,
      vendorCount: 0,
      currency: "PHP",
      timestamp: new Date(),
    };

    return NextResponse.json({
      summary,
      message: "Checkout summary retrieved",
    });
  } catch (error) {
    console.error("Error getting checkout summary:", error);
    return NextResponse.json(
      { error: "Failed to get checkout summary" },
      { status: 500 }
    );
  }
}

