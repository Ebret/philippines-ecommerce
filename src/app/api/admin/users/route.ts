/**
 * GET /api/admin/users
 * Get list of users with filtering and pagination
 */

import { NextRequest, NextResponse } from "next/server";
import { UserFilterSchema } from "@/lib/validations/admin";
import {
  calculateUserStats,
  calculateUsersByRole,
  sortByField,
  paginate,
} from "@/lib/admin-utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const role = searchParams.get("role");
    const status = searchParams.get("status");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Validate filters
    const filterData = {
      role: role || undefined,
      status: status || undefined,
      sortBy: (sortBy as any) || "createdAt",
      sortOrder,
    };

    const validation = UserFilterSchema.safeParse(filterData);
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
    const mockUsers = [
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        role: "customer",
        status: "active",
        createdAt: new Date("2024-01-15"),
        orders: 5,
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        role: "vendor",
        status: "active",
        createdAt: new Date("2024-02-20"),
        orders: 0,
      },
      {
        id: "3",
        name: "Admin User",
        email: "admin@example.com",
        role: "admin",
        status: "active",
        createdAt: new Date("2024-01-01"),
        orders: 0,
      },
      {
        id: "4",
        name: "Inactive User",
        email: "inactive@example.com",
        role: "customer",
        status: "inactive",
        createdAt: new Date("2023-12-01"),
        orders: 2,
      },
      {
        id: "5",
        name: "Suspended User",
        email: "suspended@example.com",
        role: "vendor",
        status: "suspended",
        createdAt: new Date("2024-01-10"),
        orders: 0,
      },
    ];

    // Apply filters
    let filtered = mockUsers;

    if (role) {
      filtered = filtered.filter((u) => u.role === role);
    }

    if (status) {
      filtered = filtered.filter((u) => u.status === status);
    }

    // Sort
    const sorted = sortByField(filtered, sortBy, sortOrder);

    // Paginate
    const paginatedUsers = paginate(sorted, limit, offset);

    // Calculate stats
    const stats = calculateUserStats(mockUsers);
    const byRole = calculateUsersByRole(mockUsers);

    return NextResponse.json(
      {
        success: true,
        data: paginatedUsers,
        pagination: {
          total: filtered.length,
          limit,
          offset,
          pages: Math.ceil(filtered.length / limit),
        },
        stats,
        byRole,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch users",
      },
      { status: 500 }
    );
  }
}

