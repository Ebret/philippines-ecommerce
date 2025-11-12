/**
 * Batch Detail API Routes
 * GET /api/inventory/batches/[id] - Get batch details
 * PATCH /api/inventory/batches/[id] - Update batch
 * DELETE /api/inventory/batches/[id] - Delete batch
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BatchUpdateSchema } from "@/lib/validations/inventory";

/**
 * GET /api/inventory/batches/[id]
 * Get batch details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const batch = await prisma.batch.findUnique({
      where: { id },
      include: {
        product: { select: { id: true, name: true, sku: true } },
        warehouse: { select: { id: true, name: true, vendor: { select: { userId: true } } } },
      },
    });

    if (!batch) {
      return NextResponse.json({ error: "Batch not found" }, { status: 404 });
    }

    // Check authorization
    if ((session.user.role as any) === "SELLER" && batch.warehouse.vendor?.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(batch);
  } catch (error) {
    console.error("Error fetching batch:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PATCH /api/inventory/batches/[id]
 * Update batch
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || ((session.user.role as any) !== "ADMIN" && (session.user.role as any) !== "SELLER")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const data = BatchUpdateSchema.parse(body);

    // Check if batch exists
    const batch = await prisma.batch.findUnique({
      where: { id },
      include: { warehouse: { include: { vendor: true } } },
    });

    if (!batch) {
      return NextResponse.json({ error: "Batch not found" }, { status: 404 });
    }

    // Check authorization for vendors
    if ((session.user.role as any) === "SELLER" && batch.warehouse.vendor?.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update batch
    const updated = await prisma.batch.update({
      where: { id },
      data,
      include: {
        product: { select: { id: true, name: true } },
        warehouse: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating batch:", error);
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/inventory/batches/[id]
 * Delete batch
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role as any) !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    // Check if batch exists
    const batch = await prisma.batch.findUnique({
      where: { id },
    });

    if (!batch) {
      return NextResponse.json({ error: "Batch not found" }, { status: 404 });
    }

    // Delete batch
    await prisma.batch.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Batch deleted successfully" });
  } catch (error) {
    console.error("Error deleting batch:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

