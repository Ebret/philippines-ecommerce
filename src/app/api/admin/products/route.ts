/**
 * GET /api/admin/products
 * Get list of products with filtering and pagination
 */

import { NextRequest, NextResponse } from "next/server";
import { ProductFilterSchema } from "@/lib/validations/admin";
import {
  calculateProductStats,
  calculateTopProducts,
  calculateLowStockProducts,
  sortByField,
  paginate,
} from "@/lib/admin-utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const status = searchParams.get("status");
    const vendor = searchParams.get("vendor");
    const category = searchParams.get("category");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Validate filters
    const filterData = {
      status: status || undefined,
      vendor: vendor || undefined,
      category: category || undefined,
      sortBy: (sortBy as any) || "createdAt",
      sortOrder,
    };

    const validation = ProductFilterSchema.safeParse(filterData);
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
    const mockProducts = [
      {
        id: "PROD001",
        name: "Laptop",
        vendor: "Vendor A",
        category: "Electronics",
        price: 45000,
        status: "active",
        sales: 150,
        rating: 4.5,
        stock: 25,
        createdAt: new Date("2024-01-01"),
      },
      {
        id: "PROD002",
        name: "Smartphone",
        vendor: "Vendor B",
        category: "Electronics",
        price: 25000,
        status: "active",
        sales: 200,
        rating: 4.8,
        stock: 50,
        createdAt: new Date("2024-01-05"),
      },
      {
        id: "PROD003",
        name: "Headphones",
        vendor: "Vendor A",
        category: "Electronics",
        price: 5000,
        status: "active",
        sales: 300,
        rating: 4.2,
        stock: 5,
        createdAt: new Date("2024-01-10"),
      },
      {
        id: "PROD004",
        name: "Tablet",
        vendor: "Vendor C",
        category: "Electronics",
        price: 15000,
        status: "inactive",
        sales: 50,
        rating: 3.9,
        stock: 0,
        createdAt: new Date("2024-01-15"),
      },
      {
        id: "PROD005",
        name: "Monitor",
        vendor: "Vendor B",
        category: "Electronics",
        price: 12000,
        status: "active",
        sales: 80,
        rating: 4.3,
        stock: 15,
        createdAt: new Date("2024-01-20"),
      },
    ];

    // Apply filters
    let filtered = mockProducts;

    if (status) {
      filtered = filtered.filter((p) => p.status === status);
    }

    if (vendor) {
      filtered = filtered.filter((p) => p.vendor === vendor);
    }

    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }

    // Sort
    const sorted = sortByField(filtered, sortBy, sortOrder);

    // Paginate
    const paginatedProducts = paginate(sorted, limit, offset);

    // Calculate stats
    const productStats = calculateProductStats(mockProducts);
    const topProducts = calculateTopProducts(mockProducts, 5);
    const lowStockProducts = calculateLowStockProducts(mockProducts, 10);

    return NextResponse.json(
      {
        success: true,
        data: paginatedProducts,
        pagination: {
          total: filtered.length,
          limit,
          offset,
          pages: Math.ceil(filtered.length / limit),
        },
        stats: productStats,
        topProducts,
        lowStockProducts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch products",
      },
      { status: 500 }
    );
  }
}

