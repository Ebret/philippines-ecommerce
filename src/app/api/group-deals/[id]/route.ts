/**
 * Group Deal Detail API Routes
 * GET /api/group-deals/[id] - Get group deal details
 * PATCH /api/group-deals/[id] - Update group deal
 * DELETE /api/group-deals/[id] - Delete group deal
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GroupDealUpdateSchema } from "@/lib/validations/group-pricing";
import { getGroupDealStatus } from "@/lib/group-pricing-utils";

// Mock database
const groupDeals: any[] = [];

/**
 * GET /api/group-deals/[id]
 * Get group deal details with participants and analytics
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deal = groupDeals.find((d) => d.id === params.id);

    if (!deal) {
      return NextResponse.json(
        { success: false, error: "Group deal not found" },
        { status: 404 }
      );
    }

    // Calculate current status
    const status = getGroupDealStatus(
      deal.startTime,
      deal.endTime,
      deal.currentParticipants,
      deal.targetQuantity,
      deal.status
    );

    const progressPercent = Math.round(
      (deal.currentParticipants / deal.targetQuantity) * 100
    );

    return NextResponse.json(
      {
        success: true,
        data: {
          ...deal,
          status,
          progressPercent,
          timeRemaining: Math.max(0, deal.endTime.getTime() - Date.now()),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching group deal:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch group deal" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/group-deals/[id]
 * Update group deal (vendor only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "vendor") {
      return NextResponse.json(
        { success: false, error: "Unauthorized - vendor access required" },
        { status: 401 }
      );
    }

    const deal = groupDeals.find((d) => d.id === params.id);

    if (!deal) {
      return NextResponse.json(
        { success: false, error: "Group deal not found" },
        { status: 404 }
      );
    }

    // Check ownership
    if (deal.vendorId !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized - not deal owner" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate update data
    const validation = GroupDealUpdateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validation.error.errors },
        { status: 400 }
      );
    }

    // Update deal
    const updatedDeal = {
      ...deal,
      ...validation.data,
      updatedAt: new Date(),
    };

    const index = groupDeals.findIndex((d) => d.id === params.id);
    groupDeals[index] = updatedDeal;

    return NextResponse.json(
      {
        success: true,
        data: updatedDeal,
        message: "Group deal updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating group deal:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update group deal" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/group-deals/[id]
 * Delete group deal (vendor only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "vendor") {
      return NextResponse.json(
        { success: false, error: "Unauthorized - vendor access required" },
        { status: 401 }
      );
    }

    const deal = groupDeals.find((d) => d.id === params.id);

    if (!deal) {
      return NextResponse.json(
        { success: false, error: "Group deal not found" },
        { status: 404 }
      );
    }

    // Check ownership
    if (deal.vendorId !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized - not deal owner" },
        { status: 403 }
      );
    }

    // Soft delete
    const index = groupDeals.findIndex((d) => d.id === params.id);
    groupDeals[index].status = "cancelled";
    groupDeals[index].deletedAt = new Date();

    return NextResponse.json(
      {
        success: true,
        message: "Group deal deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting group deal:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete group deal" },
      { status: 500 }
    );
  }
}

