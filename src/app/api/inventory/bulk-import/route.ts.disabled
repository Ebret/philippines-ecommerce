/**
 * Bulk Import API Route
 * POST /api/inventory/bulk-import - Import inventory from CSV/JSON
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BulkImportSchema } from "@/lib/validations/inventory";

/**
 * POST /api/inventory/bulk-import
 * Import inventory items in bulk
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const data = BulkImportSchema.parse(body);

    const results = {
      successful: 0,
      failed: 0,
      errors: [] as Array<{ index: number; sku: string; error: string }>,
      created: [] as any[],
    };

    // Process each item
    for (let i = 0; i < data.items.length; i++) {
      const item = data.items[i];

      try {
        // Check if product exists
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          results.failed++;
          results.errors.push({
            index: i,
            sku: item.sku,
            error: "Product not found",
          });
          continue;
        }

        // Check if warehouse exists
        const warehouse = await prisma.warehouse.findUnique({
          where: { id: item.warehouseId },
        });

        if (!warehouse) {
          results.failed++;
          results.errors.push({
            index: i,
            sku: item.sku,
            error: "Warehouse not found",
          });
          continue;
        }

        // Check for duplicate SKU
        const existingSKU = await prisma.inventory.findFirst({
          where: { sku: item.sku },
        });

        if (existingSKU && !data.overwrite) {
          results.failed++;
          results.errors.push({
            index: i,
            sku: item.sku,
            error: "SKU already exists",
          });
          continue;
        }

        // Create or update inventory
        let inventory;
        if (existingSKU && data.overwrite) {
          inventory = await prisma.inventory.update({
            where: { id: existingSKU.id },
            data: {
              currentStock: item.currentStock,
              reorderPoint: item.reorderPoint,
              reorderQuantity: item.reorderQuantity,
              barcode: item.barcode,
            },
          });
        } else {
          inventory = await prisma.inventory.create({
            data: {
              productId: item.productId,
              variantId: item.variantId,
              warehouseId: item.warehouseId,
              currentStock: item.currentStock,
              reservedStock: 0,
              reorderPoint: item.reorderPoint,
              reorderQuantity: item.reorderQuantity,
              sku: item.sku,
              barcode: item.barcode,
              status: "ACTIVE",
            },
          });
        }

        results.successful++;
        results.created.push(inventory);
      } catch (error) {
        results.failed++;
        results.errors.push({
          index: i,
          sku: item.sku,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return NextResponse.json(results, { status: 201 });
  } catch (error) {
    console.error("Error bulk importing inventory:", error);
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

