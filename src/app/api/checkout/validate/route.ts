import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CheckoutValidationSchema } from "@/lib/validations/cart";
import { validateCartItemsStock, isValidShippingAddress } from "@/lib/cart-utils";

/**
 * POST /api/checkout/validate
 * Validate checkout data before proceeding to payment
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
    const validatedData = CheckoutValidationSchema.parse(body);

    // Validate cart items have stock
    const stockValidation = validateCartItemsStock(validatedData.items);
    if (!stockValidation.valid) {
      return NextResponse.json(
        {
          error: "Cart validation failed",
          details: stockValidation.errors,
        },
        { status: 400 }
      );
    }

    // Validate shipping address
    if (!isValidShippingAddress(validatedData.shippingAddress)) {
      return NextResponse.json(
        { error: "Invalid shipping address" },
        { status: 400 }
      );
    }

    // Validate billing address if provided
    if (validatedData.billingAddress && !isValidShippingAddress(validatedData.billingAddress)) {
      return NextResponse.json(
        { error: "Invalid billing address" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      message: "Checkout data is valid",
      data: validatedData,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json(
        { error: "Invalid checkout data" },
        { status: 400 }
      );
    }

    console.error("Error validating checkout:", error);
    return NextResponse.json(
      { error: "Failed to validate checkout" },
      { status: 500 }
    );
  }
}

