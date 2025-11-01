/**
 * Inventory Management API Routes
 * GET /api/inventory - List inventory items
 * POST /api/inventory - Create inventory item
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { InventoryQuerySchema, InventoryCreationSchema } from "@/lib/validations/inventory";
import { generateSKU } from "@/lib/inventory-utils";

/**
 * GET /api/inventory
 * List inventory items with filtering and pagination
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
      variantId: searchParams.get("variantId") || undefined,
      warehouseId: searchParams.get("warehouseId") || undefined,
      vendorId: searchParams.get("vendorId") || undefined,
      status: searchParams.get("status") || undefined,
      lowStockOnly: searchParams.get("lowStockOnly") === "true",
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "10"),
      sortBy: searchParams.get("sortBy") || "sku",
      sortOrder: searchParams.get("sortOrder") || "asc",
    };

    const query = InventoryQuerySchema.parse(queryData);

    // Build where clause
    const where: any = {};
    if (query.productId) where.productId = query.productId;
    if (query.variantId) where.variantId = query.variantId;
    if (query.warehouseId) where.warehouseId = query.warehouseId;
    if (query.status) where.status = query.status;

    // Filter by vendor if user is vendor
    if (session.user.role === "VENDOR") {
      where.warehouse = { vendor: { userId: session.user.id } };
    } else if (query.vendorId) {
      where.warehouse = { vendor: { id: query.vendorId } };
    }

    // Low stock filter
    if (query.lowStockOnly) {
      where.OR = [
        { currentStock: { lte: prisma.inventory.fields.reorderPoint } },
        { status: "LOW_STOCK" },
      ];
    }

    // Get total count
    const total = await prisma.inventory.count({ where });

    // Get paginated results
    const inventory = await prisma.inventory.findMany({
      where,
      include: {
        product: { select: { id: true, name: true, sku: true } },
        variant: { select: { id: true, name: true } },
        warehouse: { select: { id: true, name: true, type: true } },
        adjustments: { take: 5, orderBy: { createdAt: "desc" } },
      },
      orderBy: { [query.sortBy]: query.sortOrder },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });

    return NextResponse.json({
      inventory,
      pagination: {
        total,
        page: query.page,
        limit: query.limit,
        pages: Math.ceil(total / query.limit),
      },
    });
  } catch (error) {
    console.error("Error fetching inventory:", error);
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/inventory
 * Create new inventory item
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const data = InventoryCreationSchema.parse(body);

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

    // Check for duplicate SKU
    const existingSKU = await prisma.inventory.findFirst({
      where: { sku: data.sku },
    });

    if (existingSKU) {
      return NextResponse.json({ error: "SKU already exists" }, { status: 400 });
    }

    // Create inventory
    const inventory = await prisma.inventory.create({
      data: {
        productId: data.productId,
        variantId: data.variantId,
        warehouseId: data.warehouseId,
        currentStock: data.currentStock,
        reservedStock: data.reservedStock,
        reorderPoint: data.reorderPoint,
        reorderQuantity: data.reorderQuantity,
        sku: data.sku,
        barcode: data.barcode,
        status: data.status,
      },
      include: {
        product: { select: { id: true, name: true } },
        warehouse: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(inventory, { status: 201 });
  } catch (error) {
    console.error("Error creating inventory:", error);
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

