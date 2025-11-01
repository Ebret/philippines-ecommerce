/**
 * Batch/Lot Tracking API Routes
 * GET /api/inventory/batches - List batches
 * POST /api/inventory/batches - Create batch
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BatchQuerySchema, BatchTrackingSchema } from "@/lib/validations/inventory";
import { generateBatchNumber, isExpired, isExpiringsoon } from "@/lib/inventory-utils";

/**
 * GET /api/inventory/batches
 * List batches with filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const queryData = {
      productId: searchParams.get("productId") || undefined,
      warehouseId: searchParams.get("warehouseId") || undefined,
      status: searchParams.get("status") || undefined,
      expiringWithin: searchParams.get("expiringWithin") ? parseInt(searchParams.get("expiringWithin")!) : undefined,
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "10"),
      sortBy: searchParams.get("sortBy") || "expiryDate",
      sortOrder: searchParams.get("sortOrder") || "asc",
    };

    const query = BatchQuerySchema.parse(queryData);

    // Build where clause
    const where: any = {};
    if (query.productId) where.productId = query.productId;
    if (query.warehouseId) where.warehouseId = query.warehouseId;
    if (query.status) where.status = query.status;

    // Get total count
    const total = await prisma.batch.count({ where });

    // Get paginated results
    let batches = await prisma.batch.findMany({
      where,
      include: {
        product: { select: { id: true, name: true } },
        warehouse: { select: { id: true, name: true } },
      },
      orderBy: { [query.sortBy]: query.sortOrder },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });

    // Filter by expiring within if specified
    if (query.expiringWithin) {
      batches = batches.filter((batch) => {
        if (!batch.expiryDate) return false;
        const daysUntilExpiry = Math.ceil(
          (batch.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );
        return daysUntilExpiry > 0 && daysUntilExpiry <= query.expiringWithin;
      });
    }

    return NextResponse.json({
      batches,
      pagination: {
        total,
        page: query.page,
        limit: query.limit,
        pages: Math.ceil(total / query.limit),
      },
    });
  } catch (error) {
    console.error("Error fetching batches:", error);
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/inventory/batches
 * Create new batch
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "VENDOR")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const data = BatchTrackingSchema.parse(body);

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check if warehouse exists
    const warehouse = await prisma.warehouse.findUnique({
      where: { id: data.warehouseId },
    });

    if (!warehouse) {
      return NextResponse.json({ error: "Warehouse not found" }, { status: 404 });
    }

    // Check authorization for vendors
    if (session.user.role === "VENDOR" && warehouse.vendor?.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Create batch
    const batch = await prisma.batch.create({
      data: {
        productId: data.productId,
        variantId: data.variantId,
        warehouseId: data.warehouseId,
        batchNumber: data.batchNumber || generateBatchNumber(data.productId),
        lotNumber: data.lotNumber,
        manufacturingDate: data.manufacturingDate,
        expiryDate: data.expiryDate,
        quantity: data.quantity,
        status: data.status,
        notes: data.notes,
      },
      include: {
        product: { select: { id: true, name: true } },
        warehouse: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(batch, { status: 201 });
  } catch (error) {
    console.error("Error creating batch:", error);
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

