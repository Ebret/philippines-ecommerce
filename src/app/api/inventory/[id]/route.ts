/**
 * Inventory Detail API Routes
 * GET /api/inventory/[id] - Get inventory details
 * PATCH /api/inventory/[id] - Update inventory
 * DELETE /api/inventory/[id] - Delete inventory
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { InventoryUpdateSchema } from "@/lib/validations/inventory";

/**
 * GET /api/inventory/[id]
 * Get inventory details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const inventory = await prisma.inventoryItem.findUnique({
      where: { id },
      include: {
        variant: { select: { id: true, name: true, sku: true, price: true } },
        location: { select: { id: true, name: true, code: true } },
      },
    });

    // Get recent movements for this inventory item
    let movements: any[] = [];
    if (inventory) {
      movements = await prisma.inventoryMovement.findMany({
        where: {
          variantId: inventory.variantId,
          locationId: inventory.locationId,
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      });
    }

    if (!inventory) {
      return NextResponse.json({ error: "Inventory not found" }, { status: 404 });
    }

    // Check authorization
    if ((session.user.role as any) === "SELLER") {
      const location = await prisma.inventoryLocation.findUnique({
        where: { id: inventory.locationId },
        include: { vendor: { select: { userId: true } } },
      });

      if (location?.vendor?.userId !== session.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    return NextResponse.json({ ...inventory, movements });
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PATCH /api/inventory/[id]
 * Update inventory
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.role as any) !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const data = InventoryUpdateSchema.parse(body);

    // Check if inventory exists
    const inventory = await prisma.inventoryItem.findUnique({
      where: { id },
    });

    if (!inventory) {
      return NextResponse.json({ error: "Inventory not found" }, { status: 404 });
    }

    // Map schema fields to model fields
    const updateData: any = {};
    if (data.currentStock !== undefined) updateData.quantity = data.currentStock;
    if (data.reservedStock !== undefined) updateData.reservedQuantity = data.reservedStock;
    // Note: reorderPoint, reorderQuantity, sku, barcode, status are not in InventoryItem model
    // They would need to be stored in a separate model or the ProductVariant model

    // Update inventory
    const updated = await prisma.inventoryItem.update({
      where: { id },
      data: updateData,
      include: {
        variant: { select: { id: true, name: true } },
        location: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating inventory:", error);
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/inventory/[id]
 * Delete inventory
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.role as any) !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if inventory exists
    const inventory = await prisma.inventoryItem.findUnique({
      where: { id },
    });

    if (!inventory) {
      return NextResponse.json({ error: "Inventory not found" }, { status: 404 });
    }

    // Delete inventory
    await prisma.inventoryItem.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Inventory deleted successfully" });
  } catch (error) {
    console.error("Error deleting inventory:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

