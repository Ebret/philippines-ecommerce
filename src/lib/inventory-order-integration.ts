/**
 * Inventory Order Integration
 * Handles automatic stock deduction, restoration, and reservations based on order status
 */

import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";

/**
 * Reserve inventory for an order during payment processing
 */
export async function reserveInventoryForOrder(
  orderId: string,
  orderItems: Array<{ productId: string; variantId?: string; quantity: number; warehouseId: string }>
) {
  try {
    for (const item of orderItems) {
      // Find inventory
      const inventory = await prisma.inventory.findFirst({
        where: {
          productId: item.productId,
          variantId: item.variantId,
          warehouseId: item.warehouseId,
        },
      });

      if (!inventory) {
        throw new Error(`Inventory not found for product ${item.productId}`);
      }

      // Check available stock
      const availableStock = inventory.currentStock.toNumber() - inventory.reservedStock.toNumber();
      if (availableStock < item.quantity) {
        throw new Error(
          `Insufficient stock for product ${item.productId}. Available: ${availableStock}, Requested: ${item.quantity}`
        );
      }

      // Reserve stock
      await prisma.inventory.update({
        where: { id: inventory.id },
        data: {
          reservedStock: inventory.reservedStock.plus(item.quantity),
        },
      });

      // Create stock adjustment record
      await prisma.stockAdjustment.create({
        data: {
          inventoryId: inventory.id,
          quantity: -item.quantity,
          reason: "ORDER_RESERVED",
          previousStock: inventory.currentStock,
          newStock: inventory.currentStock.minus(item.quantity),
          adjustedBy: "SYSTEM",
          notes: `Order ${orderId} reserved`,
        },
      });
    }

    return { success: true, message: "Inventory reserved successfully" };
  } catch (error) {
    console.error("Error reserving inventory:", error);
    throw error;
  }
}

/**
 * Deduct inventory when order is confirmed
 */
export async function deductInventoryForOrder(
  orderId: string,
  orderItems: Array<{ productId: string; variantId?: string; quantity: number; warehouseId: string }>
) {
  try {
    for (const item of orderItems) {
      // Find inventory
      const inventory = await prisma.inventory.findFirst({
        where: {
          productId: item.productId,
          variantId: item.variantId,
          warehouseId: item.warehouseId,
        },
      });

      if (!inventory) {
        throw new Error(`Inventory not found for product ${item.productId}`);
      }

      // Deduct from current stock
      const newStock = inventory.currentStock.minus(item.quantity);
      if (newStock.toNumber() < 0) {
        throw new Error(`Insufficient stock for product ${item.productId}`);
      }

      await prisma.inventory.update({
        where: { id: inventory.id },
        data: {
          currentStock: newStock,
          reservedStock: inventory.reservedStock.minus(item.quantity),
        },
      });

      // Create stock adjustment record
      await prisma.stockAdjustment.create({
        data: {
          inventoryId: inventory.id,
          quantity: -item.quantity,
          reason: "ORDER_CONFIRMED",
          previousStock: inventory.currentStock,
          newStock,
          adjustedBy: "SYSTEM",
          notes: `Order ${orderId} confirmed`,
        },
      });

      // Check if stock is low
      if (newStock.toNumber() <= inventory.reorderPoint.toNumber()) {
        // Create low stock alert
        await prisma.stockAlert.upsert({
          where: {
            inventoryId_alertType: {
              inventoryId: inventory.id,
              alertType: "LOW_STOCK",
            },
          },
          update: { status: "ACTIVE" },
          create: {
            inventoryId: inventory.id,
            alertType: "LOW_STOCK",
            threshold: inventory.reorderPoint,
            status: "ACTIVE",
            notifyVendor: true,
            notifyAdmin: true,
          },
        });
      }
    }

    return { success: true, message: "Inventory deducted successfully" };
  } catch (error) {
    console.error("Error deducting inventory:", error);
    throw error;
  }
}

/**
 * Restore inventory when order is cancelled
 */
export async function restoreInventoryForCancelledOrder(
  orderId: string,
  orderItems: Array<{ productId: string; variantId?: string; quantity: number; warehouseId: string }>
) {
  try {
    for (const item of orderItems) {
      // Find inventory
      const inventory = await prisma.inventory.findFirst({
        where: {
          productId: item.productId,
          variantId: item.variantId,
          warehouseId: item.warehouseId,
        },
      });

      if (!inventory) {
        throw new Error(`Inventory not found for product ${item.productId}`);
      }

      // Restore stock
      const newStock = inventory.currentStock.plus(item.quantity);
      await prisma.inventory.update({
        where: { id: inventory.id },
        data: {
          currentStock: newStock,
          reservedStock: Math.max(0, inventory.reservedStock.toNumber() - item.quantity),
        },
      });

      // Create stock adjustment record
      await prisma.stockAdjustment.create({
        data: {
          inventoryId: inventory.id,
          quantity: item.quantity,
          reason: "ORDER_CANCELLED",
          previousStock: inventory.currentStock,
          newStock,
          adjustedBy: "SYSTEM",
          notes: `Order ${orderId} cancelled`,
        },
      });
    }

    return { success: true, message: "Inventory restored successfully" };
  } catch (error) {
    console.error("Error restoring inventory:", error);
    throw error;
  }
}

/**
 * Restore inventory when order is returned
 */
export async function restoreInventoryForReturnedOrder(
  orderId: string,
  orderItems: Array<{ productId: string; variantId?: string; quantity: number; warehouseId: string }>
) {
  try {
    for (const item of orderItems) {
      // Find inventory
      const inventory = await prisma.inventory.findFirst({
        where: {
          productId: item.productId,
          variantId: item.variantId,
          warehouseId: item.warehouseId,
        },
      });

      if (!inventory) {
        throw new Error(`Inventory not found for product ${item.productId}`);
      }

      // Restore stock
      const newStock = inventory.currentStock.plus(item.quantity);
      await prisma.inventory.update({
        where: { id: inventory.id },
        data: {
          currentStock: newStock,
        },
      });

      // Create stock adjustment record
      await prisma.stockAdjustment.create({
        data: {
          inventoryId: inventory.id,
          quantity: item.quantity,
          reason: "ORDER_RETURNED",
          previousStock: inventory.currentStock,
          newStock,
          adjustedBy: "SYSTEM",
          notes: `Order ${orderId} returned`,
        },
      });
    }

    return { success: true, message: "Inventory restored for return successfully" };
  } catch (error) {
    console.error("Error restoring inventory for return:", error);
    throw error;
  }
}

/**
 * Release reserved inventory (when payment fails)
 */
export async function releaseReservedInventory(
  orderId: string,
  orderItems: Array<{ productId: string; variantId?: string; quantity: number; warehouseId: string }>
) {
  try {
    for (const item of orderItems) {
      // Find inventory
      const inventory = await prisma.inventory.findFirst({
        where: {
          productId: item.productId,
          variantId: item.variantId,
          warehouseId: item.warehouseId,
        },
      });

      if (!inventory) {
        throw new Error(`Inventory not found for product ${item.productId}`);
      }

      // Release reserved stock
      await prisma.inventory.update({
        where: { id: inventory.id },
        data: {
          reservedStock: Math.max(0, inventory.reservedStock.toNumber() - item.quantity),
        },
      });

      // Create stock adjustment record
      await prisma.stockAdjustment.create({
        data: {
          inventoryId: inventory.id,
          quantity: 0,
          reason: "RESERVATION_RELEASED",
          previousStock: inventory.currentStock,
          newStock: inventory.currentStock,
          adjustedBy: "SYSTEM",
          notes: `Order ${orderId} payment failed - reservation released`,
        },
      });
    }

    return { success: true, message: "Reserved inventory released successfully" };
  } catch (error) {
    console.error("Error releasing reserved inventory:", error);
    throw error;
  }
}

/**
 * Get inventory status for order items
 */
export async function getInventoryStatusForOrder(
  orderItems: Array<{ productId: string; variantId?: string; warehouseId: string }>
) {
  try {
    const status = await Promise.all(
      orderItems.map(async (item) => {
        const inventory = await prisma.inventory.findFirst({
          where: {
            productId: item.productId,
            variantId: item.variantId,
            warehouseId: item.warehouseId,
          },
        });

        if (!inventory) {
          return {
            productId: item.productId,
            available: false,
            currentStock: 0,
            reservedStock: 0,
          };
        }

        return {
          productId: item.productId,
          available: inventory.currentStock.toNumber() > 0,
          currentStock: inventory.currentStock.toNumber(),
          reservedStock: inventory.reservedStock.toNumber(),
          availableToReserve: inventory.currentStock.toNumber() - inventory.reservedStock.toNumber(),
        };
      })
    );

    return status;
  } catch (error) {
    console.error("Error getting inventory status:", error);
    throw error;
  }
}

