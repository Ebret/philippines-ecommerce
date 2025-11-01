import { z } from "zod";
import { AddressSchema } from "./cart";

/**
 * Order Status Enum
 */
export const OrderStatusEnum = z.enum([
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
]);

export type OrderStatus = z.infer<typeof OrderStatusEnum>;

/**
 * Shipment Status Enum
 */
export const ShipmentStatusEnum = z.enum([
  "PREPARING",
  "SHIPPED",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "FAILED_DELIVERY",
]);

export type ShipmentStatus = z.infer<typeof ShipmentStatusEnum>;

/**
 * Shipping Provider Enum
 */
export const ShippingProviderEnum = z.enum([
  "LBC",
  "TWO_GO",
  "JRS",
  "GRAB",
  "LALAMOVE",
  "PICKUP",
]);

export type ShippingProvider = z.infer<typeof ShippingProviderEnum>;

/**
 * Order Status Update Schema
 * Validates order status transition
 */
export const OrderStatusUpdateSchema = z.object({
  status: OrderStatusEnum,
  notes: z.string().max(500).optional(),
});

export type OrderStatusUpdate = z.infer<typeof OrderStatusUpdateSchema>;

/**
 * Order Cancellation Request Schema
 * Validates order cancellation with reason
 */
export const OrderCancellationSchema = z.object({
  reason: z.string().min(10, "Reason must be at least 10 characters").max(500),
  refundMethod: z.enum(["ORIGINAL_PAYMENT", "STORE_CREDIT"]).optional(),
});

export type OrderCancellation = z.infer<typeof OrderCancellationSchema>;

/**
 * Order Return Request Schema
 * Validates return request with reason and items
 */
export const OrderReturnSchema = z.object({
  reason: z.string().min(10, "Reason must be at least 10 characters").max(500),
  items: z.array(
    z.object({
      orderItemId: z.string(),
      quantity: z.number().int().positive("Quantity must be positive"),
      condition: z.enum(["UNOPENED", "OPENED", "DAMAGED", "DEFECTIVE"]),
    })
  ).min(1, "At least one item must be returned"),
  refundMethod: z.enum(["ORIGINAL_PAYMENT", "STORE_CREDIT"]).optional(),
});

export type OrderReturn = z.infer<typeof OrderReturnSchema>;

/**
 * Shipment Update Schema
 * Validates shipment status update
 */
export const ShipmentUpdateSchema = z.object({
  status: ShipmentStatusEnum,
  trackingNumber: z.string().optional(),
  estimatedDelivery: z.string().datetime().optional(),
  notes: z.string().max(500).optional(),
});

export type ShipmentUpdate = z.infer<typeof ShipmentUpdateSchema>;

/**
 * Shipment Creation Schema
 * Validates shipment creation
 */
export const ShipmentCreationSchema = z.object({
  orderId: z.string(),
  provider: ShippingProviderEnum,
  trackingNumber: z.string().optional(),
  estimatedDelivery: z.string().datetime().optional(),
  shippingFee: z.number().nonnegative().optional(),
  notes: z.string().max(500).optional(),
});

export type ShipmentCreation = z.infer<typeof ShipmentCreationSchema>;

/**
 * Tracking Query Schema
 * Validates tracking information query
 */
export const TrackingQuerySchema = z.object({
  trackingNumber: z.string().min(1, "Tracking number is required"),
  provider: ShippingProviderEnum.optional(),
});

export type TrackingQuery = z.infer<typeof TrackingQuerySchema>;

/**
 * Order Query Schema
 * Validates order list query parameters
 */
export const OrderQuerySchema = z.object({
  status: OrderStatusEnum.optional(),
  paymentStatus: z.enum(["PENDING", "PAID", "FAILED", "REFUNDED", "PARTIALLY_REFUNDED"]).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  sortBy: z.enum(["createdAt", "totalAmount", "status"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type OrderQuery = z.infer<typeof OrderQuerySchema>;

/**
 * Shipment Query Schema
 * Validates shipment list query parameters
 */
export const ShipmentQuerySchema = z.object({
  status: ShipmentStatusEnum.optional(),
  provider: ShippingProviderEnum.optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  sortBy: z.enum(["createdAt", "shippedAt", "status"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ShipmentQuery = z.infer<typeof ShipmentQuerySchema>;

/**
 * Logistics Webhook Payload Schema
 * Validates webhook payloads from logistics providers
 */
export const LogisticsWebhookSchema = z.object({
  provider: ShippingProviderEnum,
  trackingNumber: z.string(),
  status: ShipmentStatusEnum,
  timestamp: z.string().datetime(),
  location: z.string().optional(),
  notes: z.string().optional(),
  signature: z.string(), // For webhook verification
});

export type LogisticsWebhook = z.infer<typeof LogisticsWebhookSchema>;

/**
 * Order Confirmation Schema
 * Validates order confirmation data
 */
export const OrderConfirmationSchema = z.object({
  orderId: z.string(),
  confirmationCode: z.string(),
  estimatedDelivery: z.string().datetime(),
});

export type OrderConfirmation = z.infer<typeof OrderConfirmationSchema>;

/**
 * Bulk Order Status Update Schema
 * Validates bulk status updates for admin
 */
export const BulkOrderStatusUpdateSchema = z.object({
  orderIds: z.array(z.string()).min(1, "At least one order ID is required"),
  status: OrderStatusEnum,
  notes: z.string().max(500).optional(),
});

export type BulkOrderStatusUpdate = z.infer<typeof BulkOrderStatusUpdateSchema>;

