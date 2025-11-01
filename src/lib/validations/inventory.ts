/**
 * Inventory Management Validation Schemas
 * Zod schemas for inventory operations, stock tracking, and batch management
 */

import { z } from "zod";

// Enums
export const StockAdjustmentReasonEnum = z.enum([
  "INITIAL_STOCK",
  "PURCHASE",
  "RETURN",
  "DAMAGE",
  "LOSS",
  "EXPIRY",
  "CORRECTION",
  "TRANSFER_OUT",
  "TRANSFER_IN",
  "RECOUNT",
  "SAMPLE",
  "PROMOTION",
]);

export const InventoryStatusEnum = z.enum([
  "ACTIVE",
  "DISCONTINUED",
  "OUT_OF_STOCK",
  "LOW_STOCK",
  "OVERSTOCK",
]);

export const BatchStatusEnum = z.enum([
  "ACTIVE",
  "EXPIRING_SOON",
  "EXPIRED",
  "RECALLED",
]);

export const WarehouseTypeEnum = z.enum([
  "PRIMARY",
  "SECONDARY",
  "REGIONAL",
  "VENDOR_WAREHOUSE",
]);

export const AlertStatusEnum = z.enum([
  "ACTIVE",
  "ACKNOWLEDGED",
  "RESOLVED",
  "DISMISSED",
]);

// Stock Adjustment Schema
export const StockAdjustmentSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  variantId: z.string().optional(),
  warehouseId: z.string().min(1, "Warehouse ID is required"),
  quantity: z.number().int().min(-10000, "Quantity must be at least -10000").max(10000, "Quantity must be at most 10000"),
  reason: StockAdjustmentReasonEnum,
  notes: z.string().max(500).optional(),
  referenceId: z.string().optional(),
  adjustedBy: z.string().min(1, "Adjusted by user ID is required"),
});

// Inventory Creation Schema
export const InventoryCreationSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  variantId: z.string().optional(),
  warehouseId: z.string().min(1, "Warehouse ID is required"),
  currentStock: z.number().int().min(0, "Current stock must be non-negative"),
  reservedStock: z.number().int().min(0, "Reserved stock must be non-negative"),
  reorderPoint: z.number().int().min(0, "Reorder point must be non-negative"),
  reorderQuantity: z.number().int().min(1, "Reorder quantity must be at least 1"),
  sku: z.string().min(1, "SKU is required").max(50),
  barcode: z.string().optional(),
  status: InventoryStatusEnum.default("ACTIVE"),
});

// Inventory Update Schema
export const InventoryUpdateSchema = z.object({
  currentStock: z.number().int().min(0).optional(),
  reservedStock: z.number().int().min(0).optional(),
  reorderPoint: z.number().int().min(0).optional(),
  reorderQuantity: z.number().int().min(1).optional(),
  sku: z.string().min(1).max(50).optional(),
  barcode: z.string().optional(),
  status: InventoryStatusEnum.optional(),
});

// Batch/Lot Tracking Schema
export const BatchTrackingSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  variantId: z.string().optional(),
  warehouseId: z.string().min(1, "Warehouse ID is required"),
  batchNumber: z.string().min(1, "Batch number is required").max(50),
  lotNumber: z.string().max(50).optional(),
  manufacturingDate: z.string().datetime().optional(),
  expiryDate: z.string().datetime().optional(),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  status: BatchStatusEnum.default("ACTIVE"),
  notes: z.string().max(500).optional(),
});

// Batch Update Schema
export const BatchUpdateSchema = z.object({
  quantity: z.number().int().min(0).optional(),
  status: BatchStatusEnum.optional(),
  expiryDate: z.string().datetime().optional(),
  notes: z.string().max(500).optional(),
});

// Warehouse Schema
export const WarehouseSchema = z.object({
  name: z.string().min(1, "Warehouse name is required").max(100),
  type: WarehouseTypeEnum,
  vendorId: z.string().optional(),
  address: z.string().min(1, "Address is required").max(500),
  city: z.string().min(1, "City is required").max(100),
  province: z.string().min(1, "Province is required").max(100),
  postalCode: z.string().min(1, "Postal code is required").max(20),
  contactPerson: z.string().max(100).optional(),
  contactPhone: z.string().max(20).optional(),
  capacity: z.number().int().min(1, "Capacity must be at least 1").optional(),
  isActive: z.boolean().default(true),
});

// Warehouse Update Schema
export const WarehouseUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  address: z.string().min(1).max(500).optional(),
  city: z.string().min(1).max(100).optional(),
  province: z.string().min(1).max(100).optional(),
  postalCode: z.string().min(1).max(20).optional(),
  contactPerson: z.string().max(100).optional(),
  contactPhone: z.string().max(20).optional(),
  capacity: z.number().int().min(1).optional(),
  isActive: z.boolean().optional(),
});

// Stock Transfer Schema
export const StockTransferSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  variantId: z.string().optional(),
  fromWarehouseId: z.string().min(1, "Source warehouse ID is required"),
  toWarehouseId: z.string().min(1, "Destination warehouse ID is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  notes: z.string().max(500).optional(),
});

// Stock Alert Schema
export const StockAlertSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  variantId: z.string().optional(),
  warehouseId: z.string().min(1, "Warehouse ID is required"),
  alertType: z.enum(["LOW_STOCK", "OUT_OF_STOCK", "OVERSTOCK", "EXPIRING_SOON"]),
  threshold: z.number().int().min(0, "Threshold must be non-negative"),
  status: AlertStatusEnum.default("ACTIVE"),
  notifyVendor: z.boolean().default(true),
  notifyAdmin: z.boolean().default(true),
});

// Stock Alert Update Schema
export const StockAlertUpdateSchema = z.object({
  status: AlertStatusEnum.optional(),
  threshold: z.number().int().min(0).optional(),
  notifyVendor: z.boolean().optional(),
  notifyAdmin: z.boolean().optional(),
});

// Bulk Import Schema
export const BulkImportSchema = z.object({
  items: z.array(
    z.object({
      sku: z.string().min(1),
      productId: z.string().min(1),
      variantId: z.string().optional(),
      warehouseId: z.string().min(1),
      currentStock: z.number().int().min(0),
      reorderPoint: z.number().int().min(0),
      reorderQuantity: z.number().int().min(1),
      barcode: z.string().optional(),
    })
  ).min(1, "At least one item is required"),
  overwrite: z.boolean().default(false),
});

// Inventory Query Schema
export const InventoryQuerySchema = z.object({
  productId: z.string().optional(),
  variantId: z.string().optional(),
  warehouseId: z.string().optional(),
  vendorId: z.string().optional(),
  status: InventoryStatusEnum.optional(),
  lowStockOnly: z.boolean().default(false),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  sortBy: z.enum(["sku", "currentStock", "reorderPoint", "createdAt"]).default("sku"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

// Batch Query Schema
export const BatchQuerySchema = z.object({
  productId: z.string().optional(),
  warehouseId: z.string().optional(),
  status: BatchStatusEnum.optional(),
  expiringWithin: z.number().int().min(1).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  sortBy: z.enum(["batchNumber", "expiryDate", "quantity", "createdAt"]).default("expiryDate"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

// Warehouse Query Schema
export const WarehouseQuerySchema = z.object({
  vendorId: z.string().optional(),
  type: WarehouseTypeEnum.optional(),
  isActive: z.boolean().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  sortBy: z.enum(["name", "type", "createdAt"]).default("name"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

// Inventory Report Query Schema
export const InventoryReportQuerySchema = z.object({
  warehouseId: z.string().optional(),
  vendorId: z.string().optional(),
  reportType: z.enum(["STOCK_SUMMARY", "TURNOVER", "DEAD_STOCK", "EXPIRING", "VARIANCE"]).default("STOCK_SUMMARY"),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  format: z.enum(["JSON", "CSV"]).default("JSON"),
});

// Type exports
export type StockAdjustmentReason = z.infer<typeof StockAdjustmentReasonEnum>;
export type InventoryStatus = z.infer<typeof InventoryStatusEnum>;
export type BatchStatus = z.infer<typeof BatchStatusEnum>;
export type WarehouseType = z.infer<typeof WarehouseTypeEnum>;
export type AlertStatus = z.infer<typeof AlertStatusEnum>;
export type StockAdjustment = z.infer<typeof StockAdjustmentSchema>;
export type InventoryCreation = z.infer<typeof InventoryCreationSchema>;
export type InventoryUpdate = z.infer<typeof InventoryUpdateSchema>;
export type BatchTracking = z.infer<typeof BatchTrackingSchema>;
export type Warehouse = z.infer<typeof WarehouseSchema>;
export type StockTransfer = z.infer<typeof StockTransferSchema>;
export type StockAlert = z.infer<typeof StockAlertSchema>;
export type BulkImport = z.infer<typeof BulkImportSchema>;

