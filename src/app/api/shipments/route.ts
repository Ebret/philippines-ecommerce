import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ShipmentCreationSchema, ShipmentQuerySchema } from "@/lib/validations/order";
import { generateTrackingNumber, calculateEstimatedDelivery } from "@/lib/order-utils";
import { LogisticsFactory } from "@/lib/logistics/factory";

/**
 * GET /api/shipments
 * Get shipments with filtering and pagination (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin only" },
        { status: 403 }
      );
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const queryData = {
      status: searchParams.get("status") || undefined,
      provider: searchParams.get("provider") || undefined,
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "10"),
      sortBy: searchParams.get("sortBy") || "createdAt",
      sortOrder: searchParams.get("sortOrder") || "desc",
    };

    const validatedQuery = ShipmentQuerySchema.parse(queryData);

    // Build where clause
    const where: any = {};

    if (validatedQuery.status) {
      where.status = validatedQuery.status;
    }

    if (validatedQuery.provider) {
      where.provider = validatedQuery.provider;
    }

    // Get total count
    const total = await prisma.shipment.count({ where });

    // Get shipments
    const shipments = await prisma.shipment.findMany({
      where,
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            userId: true,
            vendorId: true,
          },
        },
      },
      orderBy: {
        [validatedQuery.sortBy]: validatedQuery.sortOrder,
      },
      skip: (validatedQuery.page - 1) * validatedQuery.limit,
      take: validatedQuery.limit,
    });

    return NextResponse.json(
      {
        shipments,
        pagination: {
          total,
          page: validatedQuery.page,
          limit: validatedQuery.limit,
          pages: Math.ceil(total / validatedQuery.limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json(
        { error: "Invalid query parameters" },
        { status: 400 }
      );
    }

    console.error("Error fetching shipments:", error);
    return NextResponse.json(
      { error: "Failed to fetch shipments" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/shipments
 * Create new shipment (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin only" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = ShipmentCreationSchema.parse(body);

    // Check if order exists
    const order = await prisma.order.findUnique({
      where: { id: validatedData.orderId },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Check if shipment already exists
    const existingShipment = await prisma.shipment.findUnique({
      where: { orderId: validatedData.orderId },
    });

    if (existingShipment) {
      return NextResponse.json(
        { error: "Shipment already exists for this order" },
        { status: 400 }
      );
    }

    // Generate tracking number if not provided
    const trackingNumber =
      validatedData.trackingNumber ||
      generateTrackingNumber(validatedData.provider);

    // Calculate estimated delivery
    const estimatedDelivery =
      validatedData.estimatedDelivery ||
      calculateEstimatedDelivery(
        validatedData.provider,
        (order.shippingAddress as any)?.region || "NCR"
      );

    // Create shipment
    const shipment = await prisma.shipment.create({
      data: {
        orderId: validatedData.orderId,
        provider: validatedData.provider,
        trackingNumber,
        estimatedDelivery,
        shippingFee: validatedData.shippingFee,
        notes: validatedData.notes,
        status: "PREPARING",
      },
      include: {
        order: true,
      },
    });

    return NextResponse.json(
      {
        message: "Shipment created successfully",
        shipment,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json(
        { error: "Invalid shipment data" },
        { status: 400 }
      );
    }

    console.error("Error creating shipment:", error);
    return NextResponse.json(
      { error: "Failed to create shipment" },
      { status: 500 }
    );
  }
}

