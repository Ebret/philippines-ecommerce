/**
 * Stock Alerts API Routes
 * GET /api/inventory/alerts - List stock alerts
 * POST /api/inventory/alerts - Create stock alert
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StockAlertSchema } from "@/lib/validations/inventory";

/**
 * GET /api/inventory/alerts
 * List stock alerts
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status") || undefined;
    const alertType = searchParams.get("alertType") || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Build where clause
    const where: any = {};
    if (status) where.status = status;
    if (alertType) where.alertType = alertType;

    // Filter by vendor if user is vendor
    if ((session.user.role as any) === "SELLER") {
      where.location = {
        vendor: { userId: session.user.id },
      };
    }

    // Get total count
    const total = await prisma.stockAlert.count({ where });

    // Get paginated results
    const alerts = await prisma.stockAlert.findMany({
      where,
      include: {
        variant: {
          select: {
            id: true,
            name: true,
            sku: true,
            product: { select: { name: true } },
          },
        },
        location: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      alerts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching alerts:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/inventory/alerts
 * Create stock alert
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || ((session.user.role as any) !== "ADMIN" && (session.user.role as any) !== "SELLER")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const data = StockAlertSchema.parse(body);

    // Check if variant exists
    const variant = await prisma.productVariant.findUnique({
      where: { id: data.variantId || "" },
      include: { product: true },
    });

    if (!variant) {
      return NextResponse.json({ error: "Variant not found" }, { status: 404 });
    }

    // Check if location exists
    const location = await prisma.inventoryLocation.findUnique({
      where: { id: data.warehouseId },
      include: { vendor: true },
    });

    if (!location) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 });
    }

    // Check authorization for sellers
    if ((session.user.role as any) === "SELLER" && location.vendor?.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check for existing alert
    const existingAlert = await prisma.stockAlert.findFirst({
      where: {
        variantId: data.variantId || "",
        locationId: data.warehouseId,
      },
    });

    if (existingAlert) {
      return NextResponse.json(
        { error: "Alert already exists for this inventory item" },
        { status: 400 }
      );
    }

    // Create alert
    const alert = await prisma.stockAlert.create({
      data: {
        variantId: data.variantId || "",
        locationId: data.warehouseId,
        threshold: data.threshold,
        isActive: true,
      },
      include: {
        variant: {
          select: {
            id: true,
            name: true,
            sku: true,
            product: { select: { name: true } },
          },
        },
        location: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(alert, { status: 201 });
  } catch (error) {
    console.error("Error creating alert:", error);
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

