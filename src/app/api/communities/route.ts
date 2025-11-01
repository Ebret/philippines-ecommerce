/**
 * Community Features API Routes
 * GET /api/communities - List communities
 * POST /api/communities - Create community
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CommunityCreationSchema } from "@/lib/validations/group-pricing";
import { generateCommunityId } from "@/lib/group-pricing-utils";

// Mock database
const communities: any[] = [];

/**
 * GET /api/communities
 * List communities with filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type");
    const barangay = searchParams.get("barangay");
    const isPublic = searchParams.get("isPublic");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    let filtered = [...communities];

    // Filter by type
    if (type) {
      filtered = filtered.filter((c) => c.type === type);
    }

    // Filter by barangay
    if (barangay) {
      filtered = filtered.filter((c) => c.barangay === barangay);
    }

    // Filter by public status
    if (isPublic !== null) {
      const pub = isPublic === "true";
      filtered = filtered.filter((c) => c.isPublic === pub);
    }

    // Search by name or description
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(searchLower) ||
          c.description.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const total = filtered.length;
    const start = (page - 1) * limit;
    const communitiesList = filtered.slice(start, start + limit);

    return NextResponse.json(
      {
        success: true,
        data: communitiesList,
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
    console.error("Error fetching communities:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch communities" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/communities
 * Create new community
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - login required" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate request body
    const validation = CommunityCreationSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validation.error.errors },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Create community
    const community = {
      id: generateCommunityId(),
      creatorId: session.user.id,
      ...data,
      memberCount: 1,
      activeDeals: 0,
      totalSavings: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    communities.push(community);

    return NextResponse.json(
      {
        success: true,
        data: community,
        message: "Community created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating community:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create community" },
      { status: 500 }
    );
  }
}

