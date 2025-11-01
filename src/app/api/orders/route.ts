import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OrderQuerySchema } from "@/lib/validations/order";

/**
 * GET /api/orders
 * Get user's orders with filtering and pagination
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

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const queryData = {
      status: searchParams.get("status") || undefined,
      paymentStatus: searchParams.get("paymentStatus") || undefined,
      startDate: searchParams.get("startDate") || undefined,
      endDate: searchParams.get("endDate") || undefined,
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "10"),
      sortBy: searchParams.get("sortBy") || "createdAt",
      sortOrder: searchParams.get("sortOrder") || "desc",
    };

    const validatedQuery = OrderQuerySchema.parse(queryData);

    // Build where clause
    const where: any = { userId: user.id };

    if (validatedQuery.status) {
      where.status = validatedQuery.status;
    }

    if (validatedQuery.paymentStatus) {
      where.paymentStatus = validatedQuery.paymentStatus;
    }

    if (validatedQuery.startDate) {
      where.createdAt = { gte: new Date(validatedQuery.startDate) };
    }

    if (validatedQuery.endDate) {
      if (where.createdAt) {
        where.createdAt.lte = new Date(validatedQuery.endDate);
      } else {
        where.createdAt = { lte: new Date(validatedQuery.endDate) };
      }
    }

    // Get total count
    const total = await prisma.order.count({ where });

    // Get orders
    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        payments: true,
        shipment: true,
        vendor: {
          select: {
            id: true,
            storeName: true,
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
        orders,
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

    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

