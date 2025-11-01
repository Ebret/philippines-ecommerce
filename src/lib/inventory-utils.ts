/**
 * Inventory Management Utility Functions
 * Handles stock calculations, SKU generation, batch tracking, and inventory analytics
 */

import { Decimal } from "@prisma/client/runtime/library";

/**
 * Generate unique SKU for product
 */
export function generateSKU(productId: string, variantId?: string): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  const variant = variantId ? variantId.substring(0, 3).toUpperCase() : "STD";
  return `SKU-${variant}-${timestamp}-${random}`;
}

/**
 * Generate batch number
 */
export function generateBatchNumber(productId: string): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BATCH-${year}${month}${day}-${random}`;
}

/**
 * Calculate available stock (current - reserved)
 */
export function calculateAvailableStock(
  currentStock: number | Decimal,
  reservedStock: number | Decimal
): number {
  const current = typeof currentStock === "number" ? currentStock : currentStock.toNumber();
  const reserved = typeof reservedStock === "number" ? reservedStock : reservedStock.toNumber();
  return Math.max(0, current - reserved);
}

/**
 * Check if stock is low
 */
export function isLowStock(
  currentStock: number | Decimal,
  reorderPoint: number | Decimal
): boolean {
  const current = typeof currentStock === "number" ? currentStock : currentStock.toNumber();
  const reorder = typeof reorderPoint === "number" ? reorderPoint : reorderPoint.toNumber();
  return current <= reorder;
}

/**
 * Check if stock is out
 */
export function isOutOfStock(currentStock: number | Decimal): boolean {
  const current = typeof currentStock === "number" ? currentStock : currentStock.toNumber();
  return current <= 0;
}

/**
 * Check if batch is expiring soon (within 30 days)
 */
export function isExpiringsoon(expiryDate: Date | string): boolean {
  const expiry = typeof expiryDate === "string" ? new Date(expiryDate) : expiryDate;
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  return expiry <= thirtyDaysFromNow && expiry > now;
}

/**
 * Check if batch is expired
 */
export function isExpired(expiryDate: Date | string): boolean {
  const expiry = typeof expiryDate === "string" ? new Date(expiryDate) : expiryDate;
  return expiry <= new Date();
}

/**
 * Calculate days until expiry
 */
export function daysUntilExpiry(expiryDate: Date | string): number {
  const expiry = typeof expiryDate === "string" ? new Date(expiryDate) : expiryDate;
  const now = new Date();
  const diffTime = expiry.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Calculate inventory turnover rate
 * Turnover = Cost of Goods Sold / Average Inventory Value
 */
export function calculateTurnoverRate(
  costOfGoodsSold: number,
  averageInventoryValue: number
): number {
  if (averageInventoryValue === 0) return 0;
  return Number((costOfGoodsSold / averageInventoryValue).toFixed(2));
}

/**
 * Calculate days inventory outstanding (DIO)
 * DIO = 365 / Turnover Rate
 */
export function calculateDaysInventoryOutstanding(turnoverRate: number): number {
  if (turnoverRate === 0) return 0;
  return Math.round(365 / turnoverRate);
}

/**
 * Determine inventory status based on stock levels
 */
export function determineInventoryStatus(
  currentStock: number | Decimal,
  reservedStock: number | Decimal,
  reorderPoint: number | Decimal,
  maxStock?: number | Decimal
): "ACTIVE" | "OUT_OF_STOCK" | "LOW_STOCK" | "OVERSTOCK" {
  const current = typeof currentStock === "number" ? currentStock : currentStock.toNumber();
  const reserved = typeof reservedStock === "number" ? reservedStock : reservedStock.toNumber();
  const reorder = typeof reorderPoint === "number" ? reorderPoint : reorderPoint.toNumber();

  if (current <= 0) return "OUT_OF_STOCK";
  if (current <= reorder) return "LOW_STOCK";

  if (maxStock) {
    const max = typeof maxStock === "number" ? maxStock : maxStock.toNumber();
    if (current > max) return "OVERSTOCK";
  }

  return "ACTIVE";
}

/**
 * Calculate reorder quantity based on demand
 */
export function calculateReorderQuantity(
  averageDailyDemand: number,
  leadTimeDays: number,
  safetyStock: number
): number {
  const reorderPoint = averageDailyDemand * leadTimeDays + safetyStock;
  return Math.ceil(reorderPoint);
}

/**
 * Calculate safety stock
 * Safety Stock = Z-score * Standard Deviation * sqrt(Lead Time)
 */
export function calculateSafetyStock(
  zScore: number = 1.65, // 95% service level
  standardDeviation: number,
  leadTimeDays: number
): number {
  return Math.ceil(zScore * standardDeviation * Math.sqrt(leadTimeDays));
}

/**
 * Format inventory status for display
 */
export function formatInventoryStatus(status: string): string {
  const statusMap: Record<string, string> = {
    ACTIVE: "Active",
    OUT_OF_STOCK: "Out of Stock",
    LOW_STOCK: "Low Stock",
    OVERSTOCK: "Overstock",
    DISCONTINUED: "Discontinued",
  };
  return statusMap[status] || status;
}

/**
 * Format batch status for display
 */
export function formatBatchStatus(status: string): string {
  const statusMap: Record<string, string> = {
    ACTIVE: "Active",
    EXPIRING_SOON: "Expiring Soon",
    EXPIRED: "Expired",
    RECALLED: "Recalled",
  };
  return statusMap[status] || status;
}

/**
 * Format warehouse type for display
 */
export function formatWarehouseType(type: string): string {
  const typeMap: Record<string, string> = {
    PRIMARY: "Primary Warehouse",
    SECONDARY: "Secondary Warehouse",
    REGIONAL: "Regional Hub",
    VENDOR_WAREHOUSE: "Vendor Warehouse",
  };
  return typeMap[type] || type;
}

/**
 * Validate SKU format
 */
export function isValidSKU(sku: string): boolean {
  return /^[A-Z0-9\-]{3,50}$/.test(sku);
}

/**
 * Validate barcode format (EAN-13, UPC-A, Code128)
 */
export function isValidBarcode(barcode: string): boolean {
  return /^[0-9]{8,14}$/.test(barcode) || /^[A-Z0-9\-]{5,50}$/.test(barcode);
}

/**
 * Calculate inventory value
 */
export function calculateInventoryValue(
  quantity: number | Decimal,
  unitCost: number | Decimal
): number {
  const qty = typeof quantity === "number" ? quantity : quantity.toNumber();
  const cost = typeof unitCost === "number" ? unitCost : unitCost.toNumber();
  return Number((qty * cost).toFixed(2));
}

/**
 * Calculate weighted average cost
 */
export function calculateWeightedAverageCost(
  previousQuantity: number,
  previousCost: number,
  newQuantity: number,
  newCost: number
): number {
  const totalQuantity = previousQuantity + newQuantity;
  if (totalQuantity === 0) return 0;
  const totalCost = previousQuantity * previousCost + newQuantity * newCost;
  return Number((totalCost / totalQuantity).toFixed(2));
}

/**
 * Generate inventory variance report
 */
export function calculateVariance(
  expectedQuantity: number | Decimal,
  actualQuantity: number | Decimal
): { variance: number; variancePercent: number } {
  const expected = typeof expectedQuantity === "number" ? expectedQuantity : expectedQuantity.toNumber();
  const actual = typeof actualQuantity === "number" ? actualQuantity : actualQuantity.toNumber();
  const variance = actual - expected;
  const variancePercent = expected === 0 ? 0 : Number(((variance / expected) * 100).toFixed(2));
  return { variance, variancePercent };
}

/**
 * Check if inventory needs reorder
 */
export function needsReorder(
  currentStock: number | Decimal,
  reorderPoint: number | Decimal,
  pendingOrders: number = 0
): boolean {
  const current = typeof currentStock === "number" ? currentStock : currentStock.toNumber();
  const reorder = typeof reorderPoint === "number" ? reorderPoint : reorderPoint.toNumber();
  return current - pendingOrders <= reorder;
}

/**
 * Calculate stock reservation
 */
export function calculateStockReservation(
  currentStock: number | Decimal,
  reservedStock: number | Decimal,
  requestedQuantity: number
): { canReserve: boolean; availableToReserve: number } {
  const current = typeof currentStock === "number" ? currentStock : currentStock.toNumber();
  const reserved = typeof reservedStock === "number" ? reservedStock : reservedStock.toNumber();
  const available = current - reserved;
  const canReserve = available >= requestedQuantity;
  const availableToReserve = Math.max(0, available);
  return { canReserve, availableToReserve };
}

/**
 * Format quantity with unit
 */
export function formatQuantityWithUnit(quantity: number, unit: string = "pcs"): string {
  return `${quantity} ${unit}`;
}

/**
 * Parse CSV line for bulk import
 */
export function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === "," && !insideQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

