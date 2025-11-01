/**
 * Warehouse Detail API Routes
 * GET /api/warehouses/[id] - Get warehouse details
 * PATCH /api/warehouses/[id] - Update warehouse
 * DELETE /api/warehouses/[id] - Delete warehouse
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { WarehouseUpdateSchema } from "@/lib/validations/inventory";

/**
 * GET /api/warehouses/[id]
 * Get warehouse details
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

    const warehouse = await prisma.warehouse.findUnique({
      where: { id: params.id },
      include: {
        vendor: { select: { id: true, storeName: true, userId: true } },
        inventory: {
          select: {
            id: true,
            sku: true,
            currentStock: true,
            reservedStock: true,
            status: true,
            product: { select: { name: true } },
          },
        },
      },
    });

    if (!warehouse) {
      return NextResponse.json({ error: "Warehouse not found" }, { status: 404 });
    }

    // Check authorization
    if (session.user.role === "VENDOR" && warehouse.vendor?.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(warehouse);
  } catch (error) {
    console.error("Error fetching warehouse:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PATCH /api/warehouses/[id]
 * Update warehouse
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "VENDOR")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const data = WarehouseUpdateSchema.parse(body);

    // Check if warehouse exists
    const warehouse = await prisma.warehouse.findUnique({
      where: { id: params.id },
      include: { vendor: true },
    });

    if (!warehouse) {
      return NextResponse.json({ error: "Warehouse not found" }, { status: 404 });
    }

    // Check authorization for vendors
    if (session.user.role === "VENDOR" && warehouse.vendor?.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update warehouse
    const updated = await prisma.warehouse.update({
      where: { id: params.id },
      data,
      include: {
        vendor: { select: { id: true, storeName: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating warehouse:", error);
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/warehouses/[id]
 * Delete warehouse (soft delete by setting isActive to false)
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

    // Check if warehouse exists
    const warehouse = await prisma.warehouse.findUnique({
      where: { id: params.id },
    });

    if (!warehouse) {
      return NextResponse.json({ error: "Warehouse not found" }, { status: 404 });
    }

    // Soft delete warehouse
    await prisma.warehouse.update({
      where: { id: params.id },
      data: { isActive: false },
    });

    return NextResponse.json({ message: "Warehouse deleted successfully" });
  } catch (error) {
    console.error("Error deleting warehouse:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

