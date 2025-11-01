import { Decimal } from "@prisma/client/runtime/library";
import { CartItem, CartSummary } from "@/lib/validations/cart";

/**
 * Calculate subtotal from cart items
 */
export function calculateSubtotal(items: CartItem[]): Decimal {
  return items.reduce((total, item) => {
    if (item.productSnapshot?.price) {
      const itemTotal = new Decimal(item.productSnapshot.price).mul(item.quantity);
      return total.add(itemTotal);
    }
    return total;
  }, new Decimal(0));
}

/**
 * Calculate tax amount (12% VAT for Philippines)
 */
export function calculateTax(subtotal: Decimal | number): Decimal {
  const amount = typeof subtotal === "number" ? new Decimal(subtotal) : subtotal;
  const TAX_RATE = new Decimal(0.12); // 12% VAT
  return amount.mul(TAX_RATE);
}

/**
 * Calculate shipping fee based on location and provider
 * Simplified calculation - in production, integrate with actual shipping APIs
 */
export function calculateShippingFee(
  region: string,
  provider: string,
  subtotal: Decimal | number
): Decimal {
  const amount = typeof subtotal === "number" ? new Decimal(subtotal) : subtotal;

  // Base shipping rates by region (in PHP)
  const baseRates: Record<string, number> = {
    "NCR": 50,
    "CALABARZON": 75,
    "MIMAROPA": 100,
    "BICOL": 100,
    "WESTERN_VISAYAS": 125,
    "CENTRAL_VISAYAS": 125,
    "EASTERN_VISAYAS": 150,
    "ZAMBOANGA": 150,
    "NORTHERN_MINDANAO": 150,
    "DAVAO": 150,
    "SOCCSKSARGEN": 175,
    "CARAGA": 175,
    "ARMM": 200,
    "CAR": 150,
    "ILOCOS": 100,
    "CAGAYAN_VALLEY": 125,
    "CENTRAL_LUZON": 75,
  };

  let baseFee = baseRates[region] || 150; // Default to 150 if region not found

  // Handle PICKUP provider separately (always free)
  if (provider === "PICKUP") {
    return new Decimal(0);
  }

  // Provider multipliers
  const providerMultipliers: Record<string, number> = {
    "LBC": 1.0,
    "TWO_GO": 0.95,
    "JRS": 0.9,
    "GRAB": 1.2,
    "LALAMOVE": 1.3,
  };

  const multiplier = providerMultipliers[provider] || 1.0;
  let fee = new Decimal(baseFee).mul(multiplier);

  // Free shipping for orders over 1000 PHP (except express services)
  if (amount.greaterThanOrEqualTo(1000) && !["GRAB", "LALAMOVE"].includes(provider)) {
    fee = new Decimal(0);
  }

  return fee;
}

/**
 * Calculate total amount with all fees and taxes
 */
export function calculateTotal(
  subtotal: Decimal | number,
  taxAmount: Decimal | number,
  shippingFee: Decimal | number,
  discountAmount: Decimal | number = 0
): Decimal {
  const sub = typeof subtotal === "number" ? new Decimal(subtotal) : subtotal;
  const tax = typeof taxAmount === "number" ? new Decimal(taxAmount) : taxAmount;
  const shipping = typeof shippingFee === "number" ? new Decimal(shippingFee) : shippingFee;
  const discount = typeof discountAmount === "number" ? new Decimal(discountAmount) : discountAmount;

  return sub.add(tax).add(shipping).sub(discount);
}

/**
 * Calculate cart summary
 */
export function calculateCartSummary(items: CartItem[]): CartSummary {
  const subtotal = calculateSubtotal(items);
  const taxAmount = calculateTax(subtotal);
  const shippingFee = new Decimal(0); // Will be calculated during checkout
  const discountAmount = new Decimal(0); // Will be applied with coupon
  const totalAmount = calculateTotal(subtotal, taxAmount, shippingFee, discountAmount);

  // Count unique vendors
  const vendorIds = new Set(items.map((item) => item.productSnapshot?.vendorId).filter(Boolean));

  return {
    subtotal: subtotal.toNumber(),
    taxAmount: taxAmount.toNumber(),
    shippingFee: shippingFee.toNumber(),
    discountAmount: discountAmount.toNumber(),
    totalAmount: totalAmount.toNumber(),
    itemCount: items.reduce((count, item) => count + item.quantity, 0),
    vendorCount: vendorIds.size,
  };
}

/**
 * Group cart items by vendor for multi-vendor order splitting
 */
export function groupItemsByVendor(items: CartItem[]): Record<string, CartItem[]> {
  return items.reduce(
    (grouped, item) => {
      const vendorId = item.productSnapshot?.vendorId || "unknown";
      if (!grouped[vendorId]) {
        grouped[vendorId] = [];
      }
      grouped[vendorId].push(item);
      return grouped;
    },
    {} as Record<string, CartItem[]>
  );
}

/**
 * Calculate subtotal for specific vendor items
 */
export function calculateVendorSubtotal(items: CartItem[]): Decimal {
  return items.reduce((total, item) => {
    if (item.productSnapshot?.price) {
      const itemTotal = new Decimal(item.productSnapshot.price).mul(item.quantity);
      return total.add(itemTotal);
    }
    return total;
  }, new Decimal(0));
}

/**
 * Apply discount/coupon to cart
 */
export function applyDiscount(
  subtotal: Decimal | number,
  discountPercent: number,
  maxDiscount?: number
): Decimal {
  const amount = typeof subtotal === "number" ? new Decimal(subtotal) : subtotal;
  const discountRate = new Decimal(discountPercent).div(100);
  let discount = amount.mul(discountRate);

  if (maxDiscount) {
    const max = new Decimal(maxDiscount);
    discount = discount.greaterThan(max) ? max : discount;
  }

  return discount;
}

/**
 * Validate cart items have sufficient stock
 * In production, check against actual inventory
 */
export function validateCartItemsStock(items: CartItem[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  items.forEach((item) => {
    if (item.quantity < 1) {
      errors.push(`Item ${item.variantId} has invalid quantity`);
    }
    if (item.quantity > 999) {
      errors.push(`Item ${item.variantId} exceeds maximum quantity`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Format price for display (PHP currency)
 */
export function formatPrice(amount: Decimal | number): string {
  const num = typeof amount === "number" ? amount : amount.toNumber();
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(num);
}

/**
 * Calculate estimated delivery date
 */
export function calculateEstimatedDelivery(estimatedDays: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + estimatedDays);
  return date;
}

/**
 * Get shipping provider display name
 */
export function getShippingProviderName(provider: string): string {
  const names: Record<string, string> = {
    "LBC": "LBC Express",
    "TWO_GO": "2GO Express",
    "JRS": "JRS Express",
    "GRAB": "Grab",
    "LALAMOVE": "Lalamove",
    "PICKUP": "Pickup at Store",
  };
  return names[provider] || provider;
}

/**
 * Get estimated delivery days by provider
 */
export function getEstimatedDeliveryDays(provider: string): number {
  switch (provider) {
    case "LBC":
      return 3;
    case "TWO_GO":
      return 3;
    case "JRS":
      return 3;
    case "GRAB":
      return 1;
    case "LALAMOVE":
      return 1;
    case "PICKUP":
      return 0;
    default:
      return 3;
  }
}

/**
 * Check if address is valid for shipping
 */
export function isValidShippingAddress(address: {
  region?: string;
  province?: string;
  cityMunicipality?: string;
  barangay?: string;
  streetAddress?: string;
}): boolean {
  return !!(
    address.region &&
    address.province &&
    address.cityMunicipality &&
    address.barangay &&
    address.streetAddress
  );
}

/**
 * Generate order number
 */
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

/**
 * Calculate commission for vendor from order
 */
export function calculateVendorCommission(
  orderTotal: Decimal | number,
  commissionRate: Decimal | number
): Decimal {
  const total = typeof orderTotal === "number" ? new Decimal(orderTotal) : orderTotal;
  const rate = typeof commissionRate === "number" ? new Decimal(commissionRate) : commissionRate;
  return total.mul(rate).div(100);
}

/**
 * Calculate vendor earnings from order
 */
export function calculateVendorEarnings(
  orderTotal: Decimal | number,
  commissionRate: Decimal | number
): Decimal {
  const total = typeof orderTotal === "number" ? new Decimal(orderTotal) : orderTotal;
  const commission = calculateVendorCommission(total, commissionRate);
  return total.sub(commission);
}

