/**
 * Bulk Discounts API Routes
 * GET /api/bulk-discounts - List bulk discounts
 * POST /api/bulk-discounts - Create bulk discount
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BulkDiscountCreationSchema } from "@/lib/validations/group-pricing";
import { generateBulkDiscountId } from "@/lib/group-pricing-utils";

// Mock database
const bulkDiscounts: any[] = [];

/**
 * GET /api/bulk-discounts
 * List bulk discounts with filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get("productId");
    const isActive = searchParams.get("isActive");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    let filtered = [...bulkDiscounts];

    // Filter by product
    if (productId) {
      filtered = filtered.filter((d) => d.productId === productId);
    }

    // Filter by active status
    if (isActive !== null) {
      const active = isActive === "true";
      filtered = filtered.filter((d) => d.isActive === active);
    }

    // Pagination
    const total = filtered.length;
    const start = (page - 1) * limit;
    const discounts = filtered.slice(start, start + limit);

    return NextResponse.json(
      {
        success: true,
        data: discounts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching bulk discounts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch bulk discounts" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/bulk-discounts
 * Create bulk discount (vendor only)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "SELLER") {
      return NextResponse.json(
        { success: false, error: "Unauthorized - vendor access required" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate request body
    const validation = BulkDiscountCreationSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validation.error.issues },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Validate tiers are in ascending order
    const sortedTiers = [...data.tiers].sort((a, b) => a.minQuantity - b.minQuantity);
    for (let i = 0; i < sortedTiers.length - 1; i++) {
      if (sortedTiers[i].maxQuantity && sortedTiers[i].maxQuantity! >= sortedTiers[i + 1].minQuantity) {
        return NextResponse.json(
          { success: false, error: "Tier ranges overlap" },
          { status: 400 }
        );
      }
    }

    // Validate discount percentages are decreasing
    for (let i = 0; i < sortedTiers.length - 1; i++) {
      if (sortedTiers[i].discountPercent < sortedTiers[i + 1].discountPercent) {
        return NextResponse.json(
          { success: false, error: "Discount percentages should increase with quantity" },
          { status: 400 }
        );
      }
    }

    // Create bulk discount
    const bulkDiscount = {
      id: generateBulkDiscountId(),
      vendorId: session.user.id,
      ...data,
      tiers: sortedTiers,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    bulkDiscounts.push(bulkDiscount);

    return NextResponse.json(
      {
        success: true,
        data: bulkDiscount,
        message: "Bulk discount created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating bulk discount:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create bulk discount" },
      { status: 500 }
    );
  }
}


