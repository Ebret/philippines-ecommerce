import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AddToCartSchema } from "@/lib/validations/cart";

/**
 * POST /api/cart/items
 * Add item to cart
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
    const validatedData = AddToCartSchema.parse(body);

    // In production, fetch product variant details and add to cart
    const cartItem = {
      id: `cart-item-${Date.now()}`,
      variantId: validatedData.variantId,
      quantity: validatedData.quantity,
      addedAt: new Date(),
    };

    return NextResponse.json(
      {
        message: "Item added to cart",
        item: cartItem,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json(
        { error: "Invalid cart item data" },
        { status: 400 }
      );
    }

    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Failed to add item to cart" },
      { status: 500 }
    );
  }
}

