/**
 * Stock Adjustment API Route
 * POST /api/inventory/[id]/adjust - Adjust stock levels
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StockAdjustmentSchema } from "@/lib/validations/inventory";

/**
 * POST /api/inventory/[id]/adjust
 * Adjust stock levels with reason tracking
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "VENDOR")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const data = StockAdjustmentSchema.parse(body);

    // Check if inventory exists
    const inventory = await prisma.inventory.findUnique({
      where: { id: params.id },
      include: { warehouse: { include: { vendor: true } } },
    });

    if (!inventory) {
      return NextResponse.json({ error: "Inventory not found" }, { status: 404 });
    }

    // Check authorization for vendors
    if (session.user.role === "VENDOR") {
      if (inventory.warehouse.vendor?.userId !== session.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    // Calculate new stock
    const newStock = Math.max(0, inventory.currentStock.toNumber() + data.quantity);

    // Create adjustment record and update inventory in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create adjustment record
      const adjustment = await tx.stockAdjustment.create({
        data: {
          inventoryId: params.id,
          quantity: data.quantity,
          reason: data.reason,
          notes: data.notes,
          referenceId: data.referenceId,
          adjustedBy: data.adjustedBy,
          previousStock: inventory.currentStock.toNumber(),
          newStock,
        },
      });

      // Update inventory
      const updated = await tx.inventory.update({
        where: { id: params.id },
        data: { currentStock: newStock },
        include: {
          product: { select: { id: true, name: true } },
          warehouse: { select: { id: true, name: true } },
        },
      });

      return { adjustment, inventory: updated };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error adjusting stock:", error);
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
