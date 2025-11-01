import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OrderCreationSchema } from "@/lib/validations/cart";
import {
  calculateSubtotal,
  calculateTax,
  calculateShippingFee,
  calculateTotal,
  groupItemsByVendor,
  generateOrderNumber,
} from "@/lib/cart-utils";
import { Decimal } from "@prisma/client/runtime/library";

/**
 * POST /api/checkout/create-order
 * Create order from cart
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
    const validatedData = OrderCreationSchema.parse(body);

    // Calculate totals
    const subtotal = calculateSubtotal(validatedData.items);
    const taxAmount = calculateTax(subtotal);
    const shippingFee = calculateShippingFee(
      validatedData.shippingAddress.region,
      validatedData.shippingProvider,
      subtotal
    );
    const totalAmount = calculateTotal(subtotal, taxAmount, shippingFee);

    // Group items by vendor for multi-vendor order splitting
    const itemsByVendor = groupItemsByVendor(validatedData.items);

    // Create orders for each vendor
    const createdOrders = [];

    for (const [vendorId, vendorItems] of Object.entries(itemsByVendor)) {
      const vendorSubtotal = vendorItems.reduce((total, item) => {
        if (item.productSnapshot?.price) {
          return total.add(new Decimal(item.productSnapshot.price).mul(item.quantity));
        }
        return total;
      }, new Decimal(0));

      const vendorTax = calculateTax(vendorSubtotal);
      const vendorShipping = calculateShippingFee(
        validatedData.shippingAddress.region,
        validatedData.shippingProvider,
        vendorSubtotal
      );
      const vendorTotal = calculateTotal(vendorSubtotal, vendorTax, vendorShipping);

      const orderNumber = generateOrderNumber();

      const order = await prisma.order.create({
        data: {
          orderNumber,
          userId: user.id,
          vendorId,
          status: "PENDING",
          paymentStatus: "PENDING",
          subtotal: vendorSubtotal,
          taxAmount: vendorTax,
          shippingFee: vendorShipping,
          discountAmount: new Decimal(0),
          totalAmount: vendorTotal,
          currency: "PHP",
          notes: validatedData.notes,
          shippingAddress: validatedData.shippingAddress,
          billingAddress: validatedData.billingAddress || validatedData.shippingAddress,
          items: {
            create: vendorItems.map((item) => ({
              productId: item.productSnapshot?.productId || "",
              variantId: item.variantId,
              quantity: item.quantity,
              unitPrice: new Decimal(item.productSnapshot?.price || 0),
              totalPrice: new Decimal(item.productSnapshot?.price || 0).mul(item.quantity),
              productSnapshot: item.productSnapshot,
            })),
          },
          payments: {
            create: {
              paymentMethod: validatedData.paymentMethod,
              amount: vendorTotal,
              currency: "PHP",
              status: "PENDING",
            },
          },
        },
        include: {
          items: true,
          payments: true,
        },
      });

      createdOrders.push(order);
    }

    return NextResponse.json(
      {
        message: "Order created successfully",
        orders: createdOrders,
        totalOrders: createdOrders.length,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json(
        { error: "Invalid order data" },
        { status: 400 }
      );
    }

    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

