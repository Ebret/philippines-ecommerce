/**
 * Warehouse Management API Routes
 * GET /api/warehouses - List warehouses
 * POST /api/warehouses - Create warehouse
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { WarehouseQuerySchema, WarehouseSchema } from "@/lib/validations/inventory";

/**
 * GET /api/warehouses
 * List warehouses with filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const queryData = {
      vendorId: searchParams.get("vendorId") || undefined,
      type: searchParams.get("type") || undefined,
      isActive: searchParams.get("isActive") === "true" ? true : undefined,
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "10"),
      sortBy: searchParams.get("sortBy") || "name",
      sortOrder: searchParams.get("sortOrder") || "asc",
    };

    const query = WarehouseQuerySchema.parse(queryData);

    // Build where clause
    const where: any = { isActive: true };
    if (query.type) where.type = query.type;

    // Filter by vendor if user is vendor
    if (session.user.role === "VENDOR") {
      where.vendor = { userId: session.user.id };
    } else if (query.vendorId) {
      where.vendor = { id: query.vendorId };
    }

    // Get total count
    const total = await prisma.warehouse.count({ where });

    // Get paginated results
    const warehouses = await prisma.warehouse.findMany({
      where,
      include: {
        vendor: { select: { id: true, storeName: true } },
        inventory: { select: { id: true, currentStock: true } },
      },
      orderBy: { [query.sortBy]: query.sortOrder },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });

    return NextResponse.json({
      warehouses,
      pagination: {
        total,
        page: query.page,
        limit: query.limit,
        pages: Math.ceil(total / query.limit),
      },
    });
  } catch (error) {
    console.error("Error fetching warehouses:", error);
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/warehouses
 * Create new warehouse
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "VENDOR")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const data = WarehouseSchema.parse(body);

    // For vendors, set their own ID
    let vendorId = data.vendorId;
    if (session.user.role === "VENDOR") {
      const vendor = await prisma.vendor.findUnique({
        where: { userId: session.user.id },
      });
      if (!vendor) {
        return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
      }
      vendorId = vendor.id;
    }

    // Create warehouse
    const warehouse = await prisma.warehouse.create({
      data: {
        name: data.name,
        type: data.type,
        vendorId,
        address: data.address,
        city: data.city,
        province: data.province,
        postalCode: data.postalCode,
        contactPerson: data.contactPerson,
        contactPhone: data.contactPhone,
        capacity: data.capacity,
        isActive: data.isActive,
      },
      include: {
        vendor: { select: { id: true, storeName: true } },
      },
    });

    return NextResponse.json(warehouse, { status: 201 });
  } catch (error) {
    console.error("Error creating warehouse:", error);
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

