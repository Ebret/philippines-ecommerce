import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Decimal } from "@prisma/client/runtime/library";
import {
  generateOrderNumber,
  generateTrackingNumber,
  generateConfirmationCode,
  isValidStatusTransition,
  calculateEstimatedDelivery,
  canCancelOrder,
  canReturnOrder,
  calculateRefundAmount,
  formatOrderStatus,
  formatShipmentStatus,
} from "@/lib/order-utils";
import {
  OrderStatusUpdateSchema,
  OrderCancellationSchema,
  OrderReturnSchema,
  ShipmentUpdateSchema,
  ShipmentCreationSchema,
  TrackingQuerySchema,
  OrderQuerySchema,
  ShipmentQuerySchema,
  LogisticsWebhookSchema,
} from "@/lib/validations/order";
import { LBCExpressProvider } from "@/lib/logistics/lbc";
import { TwoGoExpressProvider } from "@/lib/logistics/twogo";
import { JRSExpressProvider } from "@/lib/logistics/jrs";
import { LogisticsFactory } from "@/lib/logistics/factory";

describe("Order Management System", () => {
  // ============================================================================
  // ORDER UTILITY FUNCTIONS TESTS
  // ============================================================================

  describe("Order Utility Functions", () => {
    it("should generate unique order numbers", () => {
      const orderNum1 = generateOrderNumber();
      const orderNum2 = generateOrderNumber();

      expect(orderNum1).toMatch(/^ORD-\d{8}-[A-F0-9]{6}$/);
      expect(orderNum2).toMatch(/^ORD-\d{8}-[A-F0-9]{6}$/);
      expect(orderNum1).not.toBe(orderNum2);
    });

    it("should generate unique tracking numbers", () => {
      const trackingNum1 = generateTrackingNumber("LBC");
      const trackingNum2 = generateTrackingNumber("2GO");

      expect(trackingNum1).toMatch(/^TRK-LBC-\d{8}-[A-F0-9]{8}$/);
      expect(trackingNum2).toMatch(/^TRK-2GO-\d{8}-[A-F0-9]{8}$/);
      expect(trackingNum1).not.toBe(trackingNum2);
    });

    it("should generate confirmation codes", () => {
      const code1 = generateConfirmationCode();
      const code2 = generateConfirmationCode();

      expect(code1).toMatch(/^CONF-[A-Z0-9]{6}$/);
      expect(code2).toMatch(/^CONF-[A-Z0-9]{6}$/);
      expect(code1).not.toBe(code2);
    });

    it("should validate order status transitions", () => {
      expect(isValidStatusTransition("PENDING", "CONFIRMED")).toBe(true);
      expect(isValidStatusTransition("PENDING", "CANCELLED")).toBe(true);
      expect(isValidStatusTransition("CONFIRMED", "PROCESSING")).toBe(true);
      expect(isValidStatusTransition("PROCESSING", "SHIPPED")).toBe(true);
      expect(isValidStatusTransition("SHIPPED", "DELIVERED")).toBe(true);
      expect(isValidStatusTransition("DELIVERED", "RETURNED")).toBe(true);

      // Invalid transitions
      expect(isValidStatusTransition("PENDING", "SHIPPED")).toBe(false);
      expect(isValidStatusTransition("DELIVERED", "PENDING")).toBe(false);
      expect(isValidStatusTransition("CANCELLED", "PENDING")).toBe(false);
    });

    it("should calculate estimated delivery dates", () => {
      const shippedDate = new Date("2025-11-01");
      const deliveryDate = calculateEstimatedDelivery("LBC", "NCR", shippedDate);

      expect(deliveryDate.getTime()).toBeGreaterThan(shippedDate.getTime());
      expect(deliveryDate.getDate()).toBe(2); // 1 day for NCR
    });

    it("should check if order can be cancelled", () => {
      expect(canCancelOrder("PENDING")).toBe(true);
      expect(canCancelOrder("CONFIRMED")).toBe(true);
      expect(canCancelOrder("PROCESSING")).toBe(false);
      expect(canCancelOrder("SHIPPED")).toBe(false);
      expect(canCancelOrder("DELIVERED")).toBe(false);
      expect(canCancelOrder("CANCELLED")).toBe(false);
    });

    it("should check if order can be returned", () => {
      const deliveredDate = new Date();
      deliveredDate.setDate(deliveredDate.getDate() - 10); // 10 days ago

      expect(canReturnOrder("DELIVERED", deliveredDate)).toBe(true);

      const oldDeliveredDate = new Date();
      oldDeliveredDate.setDate(oldDeliveredDate.getDate() - 40); // 40 days ago

      expect(canReturnOrder("DELIVERED", oldDeliveredDate)).toBe(false);
      expect(canReturnOrder("PENDING", deliveredDate)).toBe(false);
    });

    it("should calculate refund amounts correctly", () => {
      const totalAmount = new Decimal(1000);
      const shippingFee = new Decimal(100);

      const refund = calculateRefundAmount(totalAmount, shippingFee);

      // Should deduct shipping (100) and restocking fee (10% of 900 = 90)
      expect(refund.toNumber()).toBe(810);
    });

    it("should format order status for display", () => {
      expect(formatOrderStatus("PENDING")).toBe("Pending");
      expect(formatOrderStatus("CONFIRMED")).toBe("Confirmed");
      expect(formatOrderStatus("PROCESSING")).toBe("Processing");
      expect(formatOrderStatus("SHIPPED")).toBe("Shipped");
      expect(formatOrderStatus("DELIVERED")).toBe("Delivered");
      expect(formatOrderStatus("CANCELLED")).toBe("Cancelled");
      expect(formatOrderStatus("RETURNED")).toBe("Returned");
    });

    it("should format shipment status for display", () => {
      expect(formatShipmentStatus("PREPARING")).toBe("Preparing");
      expect(formatShipmentStatus("SHIPPED")).toBe("Shipped");
      expect(formatShipmentStatus("IN_TRANSIT")).toBe("In Transit");
      expect(formatShipmentStatus("OUT_FOR_DELIVERY")).toBe("Out for Delivery");
      expect(formatShipmentStatus("DELIVERED")).toBe("Delivered");
      expect(formatShipmentStatus("FAILED_DELIVERY")).toBe("Failed Delivery");
    });
  });

  // ============================================================================
  // VALIDATION SCHEMAS TESTS
  // ============================================================================

  describe("Order Validation Schemas", () => {
    it("should validate order status update", () => {
      const validData = {
        status: "CONFIRMED",
        notes: "Order confirmed by admin",
      };

      const result = OrderStatusUpdateSchema.parse(validData);
      expect(result.status).toBe("CONFIRMED");
      expect(result.notes).toBe("Order confirmed by admin");
    });

    it("should validate order cancellation", () => {
      const validData = {
        reason: "Customer requested cancellation due to change of mind",
        refundMethod: "ORIGINAL_PAYMENT",
      };

      const result = OrderCancellationSchema.parse(validData);
      expect(result.reason).toBeDefined();
      expect(result.refundMethod).toBe("ORIGINAL_PAYMENT");
    });

    it("should reject cancellation with short reason", () => {
      const invalidData = {
        reason: "Too short",
      };

      expect(() => OrderCancellationSchema.parse(invalidData)).toThrow();
    });

    it("should validate order return request", () => {
      const validData = {
        reason: "Product arrived damaged and does not match description",
        items: [
          {
            orderItemId: "item-123",
            quantity: 1,
            condition: "DAMAGED",
          },
        ],
        refundMethod: "ORIGINAL_PAYMENT",
      };

      const result = OrderReturnSchema.parse(validData);
      expect(result.items).toHaveLength(1);
      expect(result.items[0].condition).toBe("DAMAGED");
    });

    it("should validate shipment update", () => {
      const validData = {
        status: "SHIPPED",
        trackingNumber: "TRK-LBC-20251101-ABC123",
        notes: "Package shipped",
      };

      const result = ShipmentUpdateSchema.parse(validData);
      expect(result.status).toBe("SHIPPED");
      expect(result.trackingNumber).toBe("TRK-LBC-20251101-ABC123");
    });

    it("should validate shipment creation", () => {
      const validData = {
        orderId: "order-123",
        provider: "LBC",
        trackingNumber: "TRK-LBC-20251101-ABC123",
        notes: "Shipment created",
      };

      const result = ShipmentCreationSchema.parse(validData);
      expect(result.orderId).toBe("order-123");
      expect(result.provider).toBe("LBC");
    });

    it("should validate tracking query", () => {
      const validData = {
        trackingNumber: "TRK-LBC-20251101-ABC123",
        provider: "LBC",
      };

      const result = TrackingQuerySchema.parse(validData);
      expect(result.trackingNumber).toBeDefined();
    });

    it("should validate order query with pagination", () => {
      const validData = {
        status: "PENDING",
        page: 1,
        limit: 10,
        sortBy: "createdAt",
        sortOrder: "desc",
      };

      const result = OrderQuerySchema.parse(validData);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it("should validate logistics webhook", () => {
      const validData = {
        provider: "LBC",
        trackingNumber: "TRK-LBC-20251101-ABC123",
        status: "IN_TRANSIT",
        timestamp: new Date().toISOString(),
        location: "Manila Hub",
        signature: "webhook-signature-hash",
      };

      const result = LogisticsWebhookSchema.parse(validData);
      expect(result.provider).toBe("LBC");
      expect(result.status).toBe("IN_TRANSIT");
    });
  });

  // ============================================================================
  // LOGISTICS PROVIDER TESTS
  // ============================================================================

  describe("Logistics Providers", () => {
    it("should get LBC shipping rates", async () => {
      const provider = new LBCExpressProvider(
        "test-key",
        "test-secret",
        "test-webhook"
      );

      const rates = await provider.getShippingRates("Manila", "Cebu");
      expect(rates).toHaveLength(3);
      expect(rates[0].provider).toBe("LBC");
      expect(rates[0].baseRate).toBeGreaterThan(0);
    });

    it("should create LBC shipment", async () => {
      const provider = new LBCExpressProvider(
        "test-key",
        "test-secret",
        "test-webhook"
      );

      const label = await provider.createShipment(
        "John Doe",
        "09123456789",
        "123 Main St, Manila",
        1,
        "Test Item"
      );

      expect(label.trackingNumber).toBeDefined();
      expect(label.provider).toBe("LBC");
      expect(label.labelUrl).toBeDefined();
    });

    it("should track LBC shipment", async () => {
      const provider = new LBCExpressProvider(
        "test-key",
        "test-secret",
        "test-webhook"
      );

      const tracking = await provider.trackShipment("TRK-LBC-20251101-ABC123");
      expect(tracking.trackingNumber).toBeDefined();
      expect(tracking.provider).toBe("LBC");
      expect(tracking.status).toBeDefined();
      expect(tracking.events).toHaveLength(2);
    });

    it("should get 2GO shipping rates", async () => {
      const provider = new TwoGoExpressProvider(
        "test-key",
        "test-secret",
        "test-webhook"
      );

      const rates = await provider.getShippingRates("Manila", "Davao");
      expect(rates).toHaveLength(3);
      expect(rates[0].provider).toBe("2GO");
    });

    it("should get JRS shipping rates", async () => {
      const provider = new JRSExpressProvider(
        "test-key",
        "test-secret",
        "test-webhook"
      );

      const rates = await provider.getShippingRates("Manila", "Iloilo");
      expect(rates).toHaveLength(3);
      expect(rates[0].provider).toBe("JRS");
    });

    it("should cancel shipment", async () => {
      const provider = new LBCExpressProvider(
        "test-key",
        "test-secret",
        "test-webhook"
      );

      const result = await provider.cancelShipment("TRK-LBC-20251101-ABC123");
      expect(result).toBe(true);
    });
  });

  // ============================================================================
  // LOGISTICS FACTORY TESTS
  // ============================================================================

  describe("Logistics Factory", () => {
    it("should get LBC provider", () => {
      const provider = LogisticsFactory.getProvider("LBC");
      expect(provider).toBeDefined();
      expect(provider).toBeInstanceOf(LBCExpressProvider);
    });

    it("should get 2GO provider", () => {
      const provider = LogisticsFactory.getProvider("TWO_GO");
      expect(provider).toBeDefined();
      expect(provider).toBeInstanceOf(TwoGoExpressProvider);
    });

    it("should get JRS provider", () => {
      const provider = LogisticsFactory.getProvider("JRS");
      expect(provider).toBeDefined();
      expect(provider).toBeInstanceOf(JRSExpressProvider);
    });

    it("should throw error for unknown provider", () => {
      expect(() => LogisticsFactory.getProvider("UNKNOWN")).toThrow();
    });

    it("should check if provider exists", () => {
      expect(LogisticsFactory.hasProvider("LBC")).toBe(true);
      expect(LogisticsFactory.hasProvider("TWO_GO")).toBe(true);
      expect(LogisticsFactory.hasProvider("JRS")).toBe(true);
      expect(LogisticsFactory.hasProvider("UNKNOWN")).toBe(false);
    });

    it("should get all providers", () => {
      const providers = LogisticsFactory.getAllProviders();
      expect(providers.size).toBeGreaterThan(0);
      expect(providers.has("LBC")).toBe(true);
      expect(providers.has("TWO_GO")).toBe(true);
      expect(providers.has("JRS")).toBe(true);
    });
  });
});

