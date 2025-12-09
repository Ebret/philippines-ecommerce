import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { calculateShippingFee, getEstimatedDeliveryDays } from "@/lib/cart-utils";
import { Decimal } from "@prisma/client/runtime/library";

/**
 * Shipping rates calculation schema
 */
const ShippingRatesSchema = z.object({
  region: z.string().min(1, "Region is required"),
  weight: z.number().min(0).default(1),
  length: z.number().min(0).default(20),
  width: z.number().min(0).default(15),
  height: z.number().min(0).default(10),
  subtotal: z.number().min(0).default(0),
});

/**
 * Shipping providers available in Philippines
 */
const SHIPPING_PROVIDERS = [
  { id: 'LBC', name: 'LBC Express', logo: '📦', isExpress: false },
  { id: 'TWO_GO', name: '2GO Express', logo: '🚢', isExpress: false },
  { id: 'JRS', name: 'JRS Express', logo: '📮', isExpress: false },
  { id: 'JT_EXPRESS', name: 'J&T Express', logo: '🚚', isExpress: false },
  { id: 'GRAB', name: 'Grab Express', logo: '🏍️', isExpress: true },
  { id: 'LALAMOVE', name: 'Lalamove', logo: '🛵', isExpress: true },
  { id: 'MOVEIT', name: 'MoveIt', logo: '📬', isExpress: true },
  { id: 'PICKUP', name: 'Store Pickup', logo: '🏪', isExpress: false },
];

/**
 * Calculate volumetric weight
 */
function calculateVolumetricWeight(length: number, width: number, height: number): number {
  return (length * width * height) / 5000;
}

/**
 * POST /api/shipments/rates
 * Calculate shipping rates for all providers
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = ShippingRatesSchema.parse(body);

    const { region, weight, length, width, height, subtotal } = validatedData;

    // Calculate volumetric weight
    const volumetricWeight = calculateVolumetricWeight(length, width, height);
    const chargeableWeight = Math.max(weight, volumetricWeight);

    // Calculate rates for each provider
    const rates = SHIPPING_PROVIDERS.map((provider) => {
      const baseFee = calculateShippingFee(region, provider.id, new Decimal(subtotal));
      const baseRate = baseFee.toNumber();

      // Weight surcharge (over 1kg)
      const weightSurcharge = chargeableWeight > 1 ? Math.round((chargeableWeight - 1) * 30) : 0;

      // Dimensional surcharge (oversized packages)
      const maxDimension = Math.max(length, width, height);
      const dimensionalSurcharge = maxDimension > 60 ? 50 : 0;

      // Remote area surcharge
      const remoteRegions = ['ARMM', 'CARAGA', 'SOCCSKSARGEN', 'EASTERN_VISAYAS'];
      const remoteSurcharge = remoteRegions.includes(region) ? 50 : 0;

      // Total cost
      let totalCost = baseRate + weightSurcharge + dimensionalSurcharge + remoteSurcharge;

      // Free shipping for orders over 1000 PHP (standard delivery only)
      const isFreeShipping = subtotal >= 1000 && !provider.isExpress && provider.id !== 'PICKUP';
      if (isFreeShipping) totalCost = 0;

      // Estimated delivery days (cart-utils version only takes provider)
      const estimatedDays = getEstimatedDeliveryDays(provider.id);

      // Calculate estimated delivery date
      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(estimatedDelivery.getDate() + estimatedDays);

      return {
        provider: provider.id,
        name: provider.name,
        logo: provider.logo,
        description: `${provider.name} - ${estimatedDays === 0 ? 'Same day' : estimatedDays === 1 ? 'Next day' : `${estimatedDays} days`} delivery`,
        baseRate: Math.round(baseRate),
        weightSurcharge,
        dimensionalSurcharge,
        remoteSurcharge,
        totalCost: Math.round(totalCost),
        estimatedDays,
        estimatedDelivery: estimatedDelivery.toISOString().split('T')[0],
        isExpress: provider.isExpress,
        isFreeShipping,
      };
    });

    // Sort by total cost (cheapest first)
    rates.sort((a, b) => a.totalCost - b.totalCost);

    return NextResponse.json({
      rates,
      calculation: {
        region,
        actualWeight: weight,
        volumetricWeight: Math.round(volumetricWeight * 100) / 100,
        chargeableWeight: Math.round(chargeableWeight * 100) / 100,
        dimensions: { length, width, height },
        subtotal,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error calculating shipping rates:", error);
    return NextResponse.json(
      { error: "Failed to calculate shipping rates" },
      { status: 500 }
    );
  }
}

