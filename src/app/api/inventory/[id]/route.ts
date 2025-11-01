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
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const inventory = await prisma.inventory.findUnique({
      where: { id: params.id },
      include: {
        product: { select: { id: true, name: true, sku: true, price: true } },
        variant: { select: { id: true, name: true } },
        warehouse: { select: { id: true, name: true, type: true } },
        adjustments: { orderBy: { createdAt: "desc" }, take: 20 },
        batches: { where: { status: "ACTIVE" }, orderBy: { expiryDate: "asc" } },
      },
    });

    if (!inventory) {
      return NextResponse.json({ error: "Inventory not found" }, { status: 404 });
    }

    // Check authorization
    if (session.user.role === "VENDOR") {
      const warehouse = await prisma.warehouse.findUnique({
        where: { id: inventory.warehouseId },
        include: { vendor: { select: { userId: true } } },
      });

      if (warehouse?.vendor?.userId !== session.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    return NextResponse.json(inventory);
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
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const data = InventoryUpdateSchema.parse(body);

    // Check if inventory exists
    const inventory = await prisma.inventory.findUnique({
      where: { id: params.id },
    });

    if (!inventory) {
      return NextResponse.json({ error: "Inventory not found" }, { status: 404 });
    }

    // Update inventory
    const updated = await prisma.inventory.update({
      where: { id: params.id },
      data,
      include: {
        product: { select: { id: true, name: true } },
        warehouse: { select: { id: true, name: true } },
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
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if inventory exists
    const inventory = await prisma.inventory.findUnique({
      where: { id: params.id },
    });

    if (!inventory) {
      return NextResponse.json({ error: "Inventory not found" }, { status: 404 });
    }

    // Delete inventory
    await prisma.inventory.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Inventory deleted successfully" });
  } catch (error) {
    console.error("Error deleting inventory:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

