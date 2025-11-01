/**
 * Inventory Management System Tests
 * Comprehensive unit tests for inventory operations, stock tracking, and batch management
 */

import { describe, it, expect } from "vitest";
import {
  generateSKU,
  generateBatchNumber,
  calculateAvailableStock,
  isLowStock,
  isOutOfStock,
  isExpiringsoon,
  isExpired,
  daysUntilExpiry,
  calculateTurnoverRate,
  calculateDaysInventoryOutstanding,
  determineInventoryStatus,
  calculateReorderQuantity,
  calculateSafetyStock,
  formatInventoryStatus,
  formatBatchStatus,
  formatWarehouseType,
  isValidSKU,
  isValidBarcode,
  calculateInventoryValue,
  calculateWeightedAverageCost,
  calculateVariance,
  needsReorder,
  calculateStockReservation,
  parseCSVLine,
} from "@/lib/inventory-utils";
import {
  StockAdjustmentSchema,
  InventoryCreationSchema,
  BatchTrackingSchema,
  WarehouseSchema,
  StockAlertSchema,
  BulkImportSchema,
  InventoryQuerySchema,
  BatchQuerySchema,
  WarehouseQuerySchema,
  InventoryReportQuerySchema,
} from "@/lib/validations/inventory";
import { Decimal } from "@prisma/client/runtime/library";

describe("Inventory Utility Functions", () => {
  describe("SKU Generation", () => {
    it("should generate unique SKU", () => {
      const sku1 = generateSKU("product-123");
      const sku2 = generateSKU("product-123");
      expect(sku1).toMatch(/^SKU-STD-/);
      expect(sku2).toMatch(/^SKU-STD-/);
      expect(sku1).not.toBe(sku2);
    });

    it("should include variant in SKU", () => {
      const sku = generateSKU("product-123", "variant-456");
      expect(sku).toMatch(/^SKU-VAR-/);
    });

    it("should validate SKU format", () => {
      expect(isValidSKU("SKU-ABC-123456")).toBe(true);
      expect(isValidSKU("PROD-001")).toBe(true);
      expect(isValidSKU("invalid sku")).toBe(false);
    });
  });

  describe("Batch Number Generation", () => {
    it("should generate batch number", () => {
      const batch = generateBatchNumber("product-123");
      expect(batch).toMatch(/^BATCH-\d{6}-[A-Z0-9]{4}$/);
    });
  });

  describe("Stock Calculations", () => {
    it("should calculate available stock", () => {
      expect(calculateAvailableStock(100, 30)).toBe(70);
      expect(calculateAvailableStock(50, 50)).toBe(0);
      expect(calculateAvailableStock(new Decimal(100), new Decimal(30))).toBe(70);
    });

    it("should check low stock", () => {
      expect(isLowStock(50, 100)).toBe(true);
      expect(isLowStock(150, 100)).toBe(false);
      expect(isLowStock(100, 100)).toBe(true);
    });

    it("should check out of stock", () => {
      expect(isOutOfStock(0)).toBe(true);
      expect(isOutOfStock(-5)).toBe(true);
      expect(isOutOfStock(1)).toBe(false);
    });

    it("should calculate inventory value", () => {
      expect(calculateInventoryValue(100, 50)).toBe(5000);
      expect(calculateInventoryValue(new Decimal(100), new Decimal(50))).toBe(5000);
    });

    it("should calculate weighted average cost", () => {
      const wac = calculateWeightedAverageCost(100, 50, 100, 60);
      expect(wac).toBe(55);
    });

    it("should calculate variance", () => {
      const variance = calculateVariance(100, 95);
      expect(variance.variance).toBe(-5);
      expect(variance.variancePercent).toBe(-5);
    });
  });

  describe("Batch Expiry Tracking", () => {
    it("should check if batch is expiring soon", () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 15);
      expect(isExpiringsoon(futureDate)).toBe(true);

      const farFutureDate = new Date();
      farFutureDate.setDate(farFutureDate.getDate() + 60);
      expect(isExpiringsoon(farFutureDate)).toBe(false);
    });

    it("should check if batch is expired", () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      expect(isExpired(pastDate)).toBe(true);

      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      expect(isExpired(futureDate)).toBe(false);
    });

    it("should calculate days until expiry", () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 10);
      const days = daysUntilExpiry(futureDate);
      expect(days).toBe(10);
    });
  });

  describe("Inventory Status Determination", () => {
    it("should determine inventory status", () => {
      expect(determineInventoryStatus(0, 0, 10)).toBe("OUT_OF_STOCK");
      expect(determineInventoryStatus(5, 0, 10)).toBe("LOW_STOCK");
      expect(determineInventoryStatus(100, 0, 10)).toBe("ACTIVE");
      expect(determineInventoryStatus(1000, 0, 10, 500)).toBe("OVERSTOCK");
    });
  });

  describe("Reorder Calculations", () => {
    it("should calculate reorder quantity", () => {
      const quantity = calculateReorderQuantity(10, 5, 20);
      expect(quantity).toBe(70); // ceil(10*5 + 20) = 70
    });

    it("should calculate safety stock", () => {
      const safetyStock = calculateSafetyStock(1.65, 10, 5);
      expect(safetyStock).toBeGreaterThan(0);
    });

    it("should check if reorder is needed", () => {
      expect(needsReorder(50, 100)).toBe(true);
      expect(needsReorder(150, 100)).toBe(false);
      expect(needsReorder(100, 100, 10)).toBe(true);
    });
  });

  describe("Stock Reservation", () => {
    it("should calculate stock reservation", () => {
      const result = calculateStockReservation(100, 30, 50);
      expect(result.canReserve).toBe(true);
      expect(result.availableToReserve).toBe(70);

      const result2 = calculateStockReservation(100, 30, 100);
      expect(result2.canReserve).toBe(false);
      expect(result2.availableToReserve).toBe(70);
    });
  });

  describe("Turnover Calculations", () => {
    it("should calculate turnover rate", () => {
      const rate = calculateTurnoverRate(10000, 2000);
      expect(rate).toBe(5);
    });

    it("should calculate days inventory outstanding", () => {
      const dio = calculateDaysInventoryOutstanding(5);
      expect(dio).toBe(73);
    });
  });

  describe("Formatting Functions", () => {
    it("should format inventory status", () => {
      expect(formatInventoryStatus("ACTIVE")).toBe("Active");
      expect(formatInventoryStatus("OUT_OF_STOCK")).toBe("Out of Stock");
      expect(formatInventoryStatus("LOW_STOCK")).toBe("Low Stock");
    });

    it("should format batch status", () => {
      expect(formatBatchStatus("ACTIVE")).toBe("Active");
      expect(formatBatchStatus("EXPIRING_SOON")).toBe("Expiring Soon");
      expect(formatBatchStatus("EXPIRED")).toBe("Expired");
    });

    it("should format warehouse type", () => {
      expect(formatWarehouseType("PRIMARY")).toBe("Primary Warehouse");
      expect(formatWarehouseType("VENDOR_WAREHOUSE")).toBe("Vendor Warehouse");
    });
  });

  describe("Barcode Validation", () => {
    it("should validate barcode format", () => {
      expect(isValidBarcode("1234567890123")).toBe(true);
      expect(isValidBarcode("CODE-ABC-123")).toBe(true);
      expect(isValidBarcode("invalid")).toBe(false);
    });
  });

  describe("CSV Parsing", () => {
    it("should parse CSV line", () => {
      const line = 'SKU-001,"Product Name",100,50';
      const result = parseCSVLine(line);
      expect(result).toEqual(["SKU-001", "Product Name", "100", "50"]);
    });

    it("should handle quoted values with commas", () => {
      const line = '"SKU-001","Product, Inc.",100';
      const result = parseCSVLine(line);
      expect(result).toEqual(["SKU-001", "Product, Inc.", "100"]);
    });
  });
});

describe("Inventory Validation Schemas", () => {
  describe("Stock Adjustment Schema", () => {
    it("should validate stock adjustment", () => {
      const data = {
        productId: "prod-123",
        warehouseId: "warehouse-123",
        quantity: 50,
        reason: "PURCHASE",
        adjustedBy: "user-123",
      };
      expect(() => StockAdjustmentSchema.parse(data)).not.toThrow();
    });

    it("should reject invalid quantity", () => {
      const data = {
        productId: "prod-123",
        warehouseId: "warehouse-123",
        quantity: 50000,
        reason: "PURCHASE",
        adjustedBy: "user-123",
      };
      expect(() => StockAdjustmentSchema.parse(data)).toThrow();
    });
  });

  describe("Inventory Creation Schema", () => {
    it("should validate inventory creation", () => {
      const data = {
        productId: "prod-123",
        warehouseId: "warehouse-123",
        currentStock: 100,
        reservedStock: 0,
        reorderPoint: 20,
        reorderQuantity: 50,
        sku: "SKU-001",
      };
      expect(() => InventoryCreationSchema.parse(data)).not.toThrow();
    });

    it("should reject negative stock", () => {
      const data = {
        productId: "prod-123",
        warehouseId: "warehouse-123",
        currentStock: -10,
        reorderPoint: 20,
        reorderQuantity: 50,
        sku: "SKU-001",
      };
      expect(() => InventoryCreationSchema.parse(data)).toThrow();
    });
  });

  describe("Batch Tracking Schema", () => {
    it("should validate batch tracking", () => {
      const data = {
        productId: "prod-123",
        warehouseId: "warehouse-123",
        batchNumber: "BATCH-001",
        quantity: 100,
      };
      expect(() => BatchTrackingSchema.parse(data)).not.toThrow();
    });
  });

  describe("Warehouse Schema", () => {
    it("should validate warehouse", () => {
      const data = {
        name: "Main Warehouse",
        type: "PRIMARY",
        address: "123 Main St",
        city: "Manila",
        province: "NCR",
        postalCode: "1000",
      };
      expect(() => WarehouseSchema.parse(data)).not.toThrow();
    });
  });

  describe("Stock Alert Schema", () => {
    it("should validate stock alert", () => {
      const data = {
        productId: "prod-123",
        warehouseId: "warehouse-123",
        alertType: "LOW_STOCK",
        threshold: 50,
      };
      expect(() => StockAlertSchema.parse(data)).not.toThrow();
    });
  });

  describe("Bulk Import Schema", () => {
    it("should validate bulk import", () => {
      const data = {
        items: [
          {
            sku: "SKU-001",
            productId: "prod-123",
            warehouseId: "warehouse-123",
            currentStock: 100,
            reorderPoint: 20,
            reorderQuantity: 50,
          },
        ],
      };
      expect(() => BulkImportSchema.parse(data)).not.toThrow();
    });

    it("should reject empty items", () => {
      const data = { items: [] };
      expect(() => BulkImportSchema.parse(data)).toThrow();
    });
  });

  describe("Query Schemas", () => {
    it("should validate inventory query", () => {
      const data = {
        page: 1,
        limit: 10,
        sortBy: "sku",
        sortOrder: "asc",
      };
      expect(() => InventoryQuerySchema.parse(data)).not.toThrow();
    });

    it("should validate batch query", () => {
      const data = {
        page: 1,
        limit: 10,
        sortBy: "expiryDate",
        sortOrder: "asc",
      };
      expect(() => BatchQuerySchema.parse(data)).not.toThrow();
    });

    it("should validate warehouse query", () => {
      const data = {
        page: 1,
        limit: 10,
        sortBy: "name",
        sortOrder: "asc",
      };
      expect(() => WarehouseQuerySchema.parse(data)).not.toThrow();
    });

    it("should validate inventory report query", () => {
      const data = {
        reportType: "STOCK_SUMMARY",
        format: "JSON",
      };
      expect(() => InventoryReportQuerySchema.parse(data)).not.toThrow();
    });
  });
});

