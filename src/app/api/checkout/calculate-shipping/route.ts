import { NextRequest, NextResponse } from "next/server";
import { ShippingCalculationSchema } from "@/lib/validations/cart";
import {
  calculateShippingFee,
  getShippingProviderName,
  getEstimatedDeliveryDays,
  calculateEstimatedDelivery,
} from "@/lib/cart-utils";
import { Decimal } from "@prisma/client/runtime/library";

/**
 * POST /api/checkout/calculate-shipping
 * Calculate shipping cost and options
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = ShippingCalculationSchema.parse(body);

    // Calculate shipping fee
    const subtotal = new Decimal(body.subtotal || 0);
    const shippingFee = calculateShippingFee(
      validatedData.region,
      validatedData.provider,
      subtotal
    );

    const estimatedDays = getEstimatedDeliveryDays(validatedData.provider);
    const estimatedDelivery = calculateEstimatedDelivery(estimatedDays);

    const shippingOption = {
      provider: validatedData.provider,
      providerName: getShippingProviderName(validatedData.provider),
      fee: shippingFee.toNumber(),
      estimatedDays,
      estimatedDelivery,
      region: validatedData.region,
      province: validatedData.province,
      cityMunicipality: validatedData.cityMunicipality,
      barangay: validatedData.barangay,
    };

    return NextResponse.json({
      shippingOption,
      message: "Shipping calculated successfully",
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json(
        { error: "Invalid shipping calculation data" },
        { status: 400 }
      );
    }

    console.error("Error calculating shipping:", error);
    return NextResponse.json(
      { error: "Failed to calculate shipping" },
      { status: 500 }
    );
  }
}

