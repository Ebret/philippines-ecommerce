/**
 * GET /api/admin/vendors
 * Get list of vendors with filtering and pagination
 */

import { NextRequest, NextResponse } from "next/server";
import { VendorFilterSchema } from "@/lib/validations/admin";
import {
  calculateVendorStats,
  calculateTopVendors,
  sortByField,
  paginate,
} from "@/lib/admin-utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const status = searchParams.get("status");
    const verificationStatus = searchParams.get("verificationStatus");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Validate filters
    const filterData = {
      status: (status as any) || undefined,
      verificationStatus: (verificationStatus as any) || undefined,
      sortBy: (sortBy as any) || "createdAt",
      sortOrder,
    };

    const validation = VendorFilterSchema.safeParse(filterData);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid filter parameters",
          details: validation.error.errors,
        },
        { status: 400 }
      );
    }

    // Mock data - in production, fetch from database
    const mockVendors = [
      {
        id: "VEND001",
        name: "Tech Store",
        email: "tech@example.com",
        status: "active",
        verificationStatus: "verified",
        rating: 4.8,
        sales: 500,
        revenue: 250000,
        orders: 150,
        responseTime: 2,
        returnRate: 2.5,
        createdAt: new Date("2024-01-01"),
      },
      {
        id: "VEND002",
        name: "Fashion Hub",
        email: "fashion@example.com",
        status: "active",
        verificationStatus: "verified",
        rating: 4.5,
        sales: 300,
        revenue: 150000,
        orders: 100,
        responseTime: 4,
        returnRate: 5,
        createdAt: new Date("2024-01-05"),
      },
      {
        id: "VEND003",
        name: "Home Goods",
        email: "home@example.com",
        status: "active",
        verificationStatus: "pending",
        rating: 4.2,
        sales: 200,
        revenue: 100000,
        orders: 80,
        responseTime: 6,
        returnRate: 8,
        createdAt: new Date("2024-01-10"),
      },
      {
        id: "VEND004",
        name: "Suspended Shop",
        email: "suspended@example.com",
        status: "suspended",
        verificationStatus: "verified",
        rating: 2.1,
        sales: 50,
        revenue: 25000,
        orders: 20,
        responseTime: 24,
        returnRate: 25,
        createdAt: new Date("2024-01-15"),
      },
      {
        id: "VEND005",
        name: "New Vendor",
        email: "new@example.com",
        status: "active",
        verificationStatus: "pending",
        rating: 0,
        sales: 10,
        revenue: 5000,
        orders: 5,
        responseTime: 1,
        returnRate: 0,
        createdAt: new Date("2024-01-20"),
      },
    ];

    // Apply filters
    let filtered = mockVendors;

    if (status) {
      filtered = filtered.filter((v) => v.status === status);
    }

    if (verificationStatus) {
      filtered = filtered.filter((v) => v.verificationStatus === verificationStatus);
    }

    // Sort
    const sorted = sortByField(filtered, sortBy, sortOrder);

    // Paginate
    const paginatedVendors = paginate(sorted, limit, offset);

    // Calculate stats
    const vendorStats = calculateVendorStats(mockVendors);
    const topVendors = calculateTopVendors(mockVendors, 5);

    return NextResponse.json(
      {
        success: true,
        data: paginatedVendors,
        pagination: {
          total: filtered.length,
          limit,
          offset,
          pages: Math.ceil(filtered.length / limit),
        },
        stats: vendorStats,
        topVendors,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch vendors",
      },
      { status: 500 }
    );
  }
}

