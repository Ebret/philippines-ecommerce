/**
 * GET /api/admin/orders
 * Get list of orders with filtering and pagination
 */

import { NextRequest, NextResponse } from "next/server";
import { OrderFilterSchema } from "@/lib/validations/admin";
import {
  calculateOrderStats,
  calculateOrdersByPaymentStatus,
  sortByField,
  paginate,
} from "@/lib/admin-utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const status = searchParams.get("status");
    const paymentStatus = searchParams.get("paymentStatus");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Validate filters
    const filterData = {
      status: status || undefined,
      paymentStatus: (paymentStatus as any) || undefined,
    };

    const validation = OrderFilterSchema.safeParse(filterData);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid filter parameters",
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    // Mock data - in production, fetch from database
    const mockOrders = [
      {
        id: "ORD001",
        customerId: "1",
        vendor: "Vendor A",
        total: 5000,
        status: "delivered",
        paymentStatus: "completed",
        createdAt: new Date("2024-01-15"),
        items: 3,
      },
      {
        id: "ORD002",
        customerId: "2",
        vendor: "Vendor B",
        total: 3500,
        status: "shipped",
        paymentStatus: "completed",
        createdAt: new Date("2024-01-16"),
        items: 2,
      },
      {
        id: "ORD003",
        customerId: "1",
        vendor: "Vendor A",
        total: 2000,
        status: "pending",
        paymentStatus: "pending",
        createdAt: new Date("2024-01-17"),
        items: 1,
      },
      {
        id: "ORD004",
        customerId: "3",
        vendor: "Vendor C",
        total: 4500,
        status: "processing",
        paymentStatus: "completed",
        createdAt: new Date("2024-01-18"),
        items: 4,
      },
      {
        id: "ORD005",
        customerId: "4",
        vendor: "Vendor B",
        total: 3000,
        status: "cancelled",
        paymentStatus: "failed",
        createdAt: new Date("2024-01-19"),
        items: 2,
      },
    ];

    // Apply filters
    let filtered = mockOrders;

    if (status) {
      filtered = filtered.filter((o) => o.status === status);
    }

    if (paymentStatus) {
      filtered = filtered.filter((o) => o.paymentStatus === paymentStatus);
    }

    // Sort
    const sorted = sortByField(filtered, sortBy, sortOrder);

    // Paginate
    const paginatedOrders = paginate(sorted, limit, offset);

    // Calculate stats
    const orderStats = calculateOrderStats(mockOrders);
    const paymentStats = calculateOrdersByPaymentStatus(mockOrders);

    return NextResponse.json(
      {
        success: true,
        data: paginatedOrders,
        pagination: {
          total: filtered.length,
          limit,
          offset,
          pages: Math.ceil(filtered.length / limit),
        },
        stats: orderStats,
        paymentStats,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch orders",
      },
      { status: 500 }
    );
  }
}

