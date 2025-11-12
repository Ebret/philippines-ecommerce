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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user || ((session.user.role as any) !== "ADMIN" && (session.user.role as any) !== "SELLER")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const data = StockAdjustmentSchema.parse(body);

    // Check if inventory exists
    const inventory = await prisma.inventoryItem.findUnique({
      where: { id },
      include: { location: { include: { vendor: true } } },
    });

    if (!inventory) {
      return NextResponse.json({ error: "Inventory not found" }, { status: 404 });
    }

    // Check authorization for vendors
    if ((session.user.role as any) === "SELLER") {
      if (inventory.location.vendor?.userId !== session.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    // Calculate new stock
    const newStock = Math.max(0, inventory.quantity + data.quantity);

    // Create adjustment record and update inventory in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create inventory movement record
      const movement = await tx.inventoryMovement.create({
        data: {
          variantId: inventory.variantId,
          locationId: inventory.locationId,
          movementType: data.quantity > 0 ? "IN" : "OUT",
          quantity: Math.abs(data.quantity),
          referenceType: data.reason,
          referenceId: data.referenceId,
          notes: data.notes,
          createdById: session.user.id,
        },
      });

      // Update inventory
      const updated = await tx.inventoryItem.update({
        where: { id },
        data: { quantity: newStock },
        include: {
          variant: { select: { id: true, name: true } },
          location: { select: { id: true, name: true } },
        },
      });

      return { movement, inventory: updated };
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
