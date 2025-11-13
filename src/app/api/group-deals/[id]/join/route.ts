/**
 * Join Group Deal API Route
 * POST /api/group-deals/[id]/join - Join a group deal
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GroupDealJoinSchema } from "@/lib/validations/group-pricing";
import { isGroupDealActive, calculateGroupSavings } from "@/lib/group-pricing-utils";

// Mock database
const groupDeals: any[] = [];
const participations: any[] = [];

/**
 * POST /api/group-deals/[id]/join
 * Join a group deal with specified quantity
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - login required" },
        { status: 401 }
      );
    }

    const deal = groupDeals.find((d) => d.id === id);

    if (!deal) {
      return NextResponse.json(
        { success: false, error: "Group deal not found" },
        { status: 404 }
      );
    }

    // Check if deal is active
    if (!isGroupDealActive(deal.startTime, deal.endTime)) {
      return NextResponse.json(
        { success: false, error: "Group deal is not active" },
        { status: 400 }
      );
    }

    // Check if deal is completed
    if (deal.currentParticipants >= deal.targetQuantity) {
      return NextResponse.json(
        { success: false, error: "Group deal target reached" },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate request body
    const validation = GroupDealJoinSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { quantity, notes } = validation.data;

    // Check minimum quantity
    if (quantity < deal.minimumQuantity) {
      return NextResponse.json(
        {
          success: false,
          error: `Minimum quantity is ${deal.minimumQuantity}`,
        },
        { status: 400 }
      );
    }

    // Check maximum quantity
    if (deal.maximumQuantity && quantity > deal.maximumQuantity) {
      return NextResponse.json(
        {
          success: false,
          error: `Maximum quantity is ${deal.maximumQuantity}`,
        },
        { status: 400 }
      );
    }

    // Check if user already joined
    const existingParticipation = participations.find(
      (p) => p.dealId === id && p.userId === session.user.id
    );

    if (existingParticipation) {
      return NextResponse.json(
        { success: false, error: "You have already joined this deal" },
        { status: 400 }
      );
    }

    // Calculate savings
    const savings = calculateGroupSavings(deal.basePrice, deal.groupPrice, quantity);

    // Create participation record
    const participation = {
      id: `part_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      dealId: id,
      userId: session.user.id,
      quantity,
      notes,
      savings,
      totalPrice: deal.groupPrice * quantity,
      status: "confirmed",
      joinedAt: new Date(),
    };

    participations.push(participation);

    // Update deal statistics
    deal.currentParticipants += 1;
    deal.totalQuantity += quantity;
    deal.totalRevenue += deal.groupPrice * quantity;

    return NextResponse.json(
      {
        success: true,
        data: participation,
        dealStats: {
          currentParticipants: deal.currentParticipants,
          totalQuantity: deal.totalQuantity,
          progressPercent: Math.round(
            (deal.currentParticipants / deal.targetQuantity) * 100
          ),
        },
        message: "Successfully joined group deal",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error joining group deal:", error);
    return NextResponse.json(
      { success: false, error: "Failed to join group deal" },
      { status: 500 }
    );
  }
}

