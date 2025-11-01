import { Decimal } from "@prisma/client/runtime/library";
import crypto from "crypto";

/**
 * Generate unique order number
 * Format: ORD-YYYYMMDD-XXXXXX (e.g., ORD-20251101-ABC123)
 */
export function generateOrderNumber(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const randomStr = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `ORD-${dateStr}-${randomStr}`;
}

/**
 * Generate tracking number for shipment
 * Format: TRK-PROVIDER-YYYYMMDD-XXXXXX
 */
export function generateTrackingNumber(provider: string): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const randomStr = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `TRK-${provider}-${dateStr}-${randomStr}`;
}

/**
 * Generate confirmation code for order
 * Format: CONF-XXXXXX (6 alphanumeric characters)
 */
export function generateConfirmationCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "CONF-";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Validate order status transition
 * Ensures valid state transitions
 */
export function isValidStatusTransition(
  currentStatus: string,
  newStatus: string
): boolean {
  const validTransitions: Record<string, string[]> = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["PROCESSING", "CANCELLED"],
    PROCESSING: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["DELIVERED", "FAILED_DELIVERY"],
    DELIVERED: ["RETURNED"],
    CANCELLED: [],
    RETURNED: [],
    FAILED_DELIVERY: ["SHIPPED"],
  };

  return validTransitions[currentStatus]?.includes(newStatus) ?? false;
}

/**
 * Calculate estimated delivery date
 * Based on shipping provider and region
 */
export function calculateEstimatedDelivery(
  provider: string,
  region: string,
  shippedDate: Date = new Date()
): Date {
  const estimatedDays = getEstimatedDeliveryDays(provider, region);
  const deliveryDate = new Date(shippedDate);
  deliveryDate.setDate(deliveryDate.getDate() + estimatedDays);
  return deliveryDate;
}

/**
 * Get estimated delivery days based on provider and region
 */
function getEstimatedDeliveryDays(provider: string, region: string): number {
  const deliveryDays: Record<string, Record<string, number>> = {
    LBC: {
      NCR: 1,
      CALABARZON: 2,
      MIMAROPA: 3,
      BICOL: 3,
      WESTERN_VISAYAS: 3,
      CENTRAL_VISAYAS: 3,
      EASTERN_VISAYAS: 4,
      ZAMBOANGA: 4,
      NORTHERN_MINDANAO: 4,
      DAVAO: 4,
      SOCCSKSARGEN: 5,
      CARAGA: 5,
      ARMM: 5,
      CAR: 3,
      ILOCOS: 2,
      CAGAYAN_VALLEY: 3,
      CENTRAL_LUZON: 2,
    },
    TWO_GO: {
      NCR: 1,
      CALABARZON: 2,
      MIMAROPA: 3,
      BICOL: 3,
      WESTERN_VISAYAS: 3,
      CENTRAL_VISAYAS: 3,
      EASTERN_VISAYAS: 4,
      ZAMBOANGA: 4,
      NORTHERN_MINDANAO: 4,
      DAVAO: 4,
      SOCCSKSARGEN: 5,
      CARAGA: 5,
      ARMM: 5,
      CAR: 3,
      ILOCOS: 2,
      CAGAYAN_VALLEY: 3,
      CENTRAL_LUZON: 2,
    },
    JRS: {
      NCR: 2,
      CALABARZON: 3,
      MIMAROPA: 4,
      BICOL: 4,
      WESTERN_VISAYAS: 4,
      CENTRAL_VISAYAS: 4,
      EASTERN_VISAYAS: 5,
      ZAMBOANGA: 5,
      NORTHERN_MINDANAO: 5,
      DAVAO: 5,
      SOCCSKSARGEN: 6,
      CARAGA: 6,
      ARMM: 6,
      CAR: 4,
      ILOCOS: 3,
      CAGAYAN_VALLEY: 4,
      CENTRAL_LUZON: 3,
    },
    GRAB: {
      NCR: 1,
      CALABARZON: 2,
      MIMAROPA: 3,
      BICOL: 3,
      WESTERN_VISAYAS: 3,
      CENTRAL_VISAYAS: 3,
      EASTERN_VISAYAS: 4,
      ZAMBOANGA: 4,
      NORTHERN_MINDANAO: 4,
      DAVAO: 4,
      SOCCSKSARGEN: 5,
      CARAGA: 5,
      ARMM: 5,
      CAR: 3,
      ILOCOS: 2,
      CAGAYAN_VALLEY: 3,
      CENTRAL_LUZON: 2,
    },
    LALAMOVE: {
      NCR: 1,
      CALABARZON: 2,
      MIMAROPA: 3,
      BICOL: 3,
      WESTERN_VISAYAS: 3,
      CENTRAL_VISAYAS: 3,
      EASTERN_VISAYAS: 4,
      ZAMBOANGA: 4,
      NORTHERN_MINDANAO: 4,
      DAVAO: 4,
      SOCCSKSARGEN: 5,
      CARAGA: 5,
      ARMM: 5,
      CAR: 3,
      ILOCOS: 2,
      CAGAYAN_VALLEY: 3,
      CENTRAL_LUZON: 2,
    },
    PICKUP: {
      NCR: 0,
      CALABARZON: 0,
      MIMAROPA: 0,
      BICOL: 0,
      WESTERN_VISAYAS: 0,
      CENTRAL_VISAYAS: 0,
      EASTERN_VISAYAS: 0,
      ZAMBOANGA: 0,
      NORTHERN_MINDANAO: 0,
      DAVAO: 0,
      SOCCSKSARGEN: 0,
      CARAGA: 0,
      ARMM: 0,
      CAR: 0,
      ILOCOS: 0,
      CAGAYAN_VALLEY: 0,
      CENTRAL_LUZON: 0,
    },
  };

  return deliveryDays[provider]?.[region] ?? 3;
}

/**
 * Check if order can be cancelled
 * Orders can be cancelled if in PENDING or CONFIRMED status
 */
export function canCancelOrder(status: string): boolean {
  return ["PENDING", "CONFIRMED"].includes(status);
}

/**
 * Check if order can be returned
 * Orders can be returned if DELIVERED and within 30 days
 */
export function canReturnOrder(
  status: string,
  deliveredDate: Date | null
): boolean {
  if (status !== "DELIVERED" || !deliveredDate) {
    return false;
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return deliveredDate >= thirtyDaysAgo;
}

/**
 * Calculate refund amount
 * Deducts shipping fee and restocking fee if applicable
 */
export function calculateRefundAmount(
  totalAmount: Decimal | number,
  shippingFee: Decimal | number,
  restockingFeePercent: number = 10
): Decimal {
  const total = typeof totalAmount === "number" ? new Decimal(totalAmount) : totalAmount;
  const shipping = typeof shippingFee === "number" ? new Decimal(shippingFee) : shippingFee;

  // Deduct shipping fee
  let refundAmount = total.minus(shipping);

  // Deduct restocking fee (10% by default)
  const restockingFee = refundAmount.mul(restockingFeePercent).div(100);
  refundAmount = refundAmount.minus(restockingFee);

  // Ensure non-negative
  return refundAmount.isNegative() ? new Decimal(0) : refundAmount;
}

/**
 * Format order status for display
 */
export function formatOrderStatus(status: string): string {
  const statusMap: Record<string, string> = {
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    PROCESSING: "Processing",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
    RETURNED: "Returned",
  };

  return statusMap[status] ?? status;
}

/**
 * Format shipment status for display
 */
export function formatShipmentStatus(status: string): string {
  const statusMap: Record<string, string> = {
    PREPARING: "Preparing",
    SHIPPED: "Shipped",
    IN_TRANSIT: "In Transit",
    OUT_FOR_DELIVERY: "Out for Delivery",
    DELIVERED: "Delivered",
    FAILED_DELIVERY: "Failed Delivery",
  };

  return statusMap[status] ?? status;
}

/**
 * Generate webhook signature for logistics providers
 */
export function generateLogisticsWebhookSignature(
  payload: Record<string, unknown>,
  secret: string
): string {
  const payloadStr = JSON.stringify(payload);
  return crypto
    .createHmac("sha256", secret)
    .update(payloadStr)
    .digest("hex");
}

/**
 * Verify logistics webhook signature
 */
export function verifyLogisticsWebhookSignature(
  payload: Record<string, unknown>,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = generateLogisticsWebhookSignature(payload, secret);
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

