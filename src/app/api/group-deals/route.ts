/**
 * Group Deals API Routes
 * GET /api/group-deals - List group deals with filtering
 * POST /api/group-deals - Create new group deal
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GroupDealCreationSchema } from "@/lib/validations/group-pricing";
import { generateGroupDealId, getGroupDealStatus } from "@/lib/group-pricing-utils";

// Mock database - replace with Prisma in production
const groupDeals: any[] = [];

/**
 * GET /api/group-deals
 * List group deals with filtering, pagination, and sorting
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const barangay = searchParams.get("barangay");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sort = searchParams.get("sort") || "createdAt";

    let filtered = [...groupDeals];

    // Filter by status
    if (status) {
      filtered = filtered.filter((deal) => deal.status === status);
    }

    // Filter by barangay
    if (barangay) {
      filtered = filtered.filter((deal) => deal.barangay === barangay);
    }

    // Search by title or description
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (deal) =>
          deal.title.toLowerCase().includes(searchLower) ||
          deal.description.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      if (sort === "createdAt") return b.createdAt - a.createdAt;
      if (sort === "endTime") return a.endTime - b.endTime;
      if (sort === "discount") return b.discountPercent - a.discountPercent;
      return 0;
    });

    // Pagination
    const total = filtered.length;
    const start = (page - 1) * limit;
    const deals = filtered.slice(start, start + limit);

    return NextResponse.json(
      {
        success: true,
        data: deals,
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
    console.error("Error fetching group deals:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch group deals" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/group-deals
 * Create new group deal (vendor only)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "vendor") {
      return NextResponse.json(
        { success: false, error: "Unauthorized - vendor access required" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate request body
    const validation = GroupDealCreationSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validation.error.errors },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Validate dates
    if (data.endTime <= data.startTime) {
      return NextResponse.json(
        { success: false, error: "End time must be after start time" },
        { status: 400 }
      );
    }

    // Validate prices
    if (data.groupPrice >= data.basePrice) {
      return NextResponse.json(
        { success: false, error: "Group price must be less than base price" },
        { status: 400 }
      );
    }

    // Create group deal
    const groupDeal = {
      id: generateGroupDealId(),
      vendorId: session.user.id,
      ...data,
      status: "active",
      currentParticipants: 0,
      totalQuantity: 0,
      totalRevenue: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    groupDeals.push(groupDeal);

    return NextResponse.json(
      {
        success: true,
        data: groupDeal,
        message: "Group deal created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating group deal:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create group deal" },
      { status: 500 }
    );
  }
}

