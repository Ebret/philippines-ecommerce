/**
 * Referral Redeem API Route
 * POST /api/referrals/[code]/redeem - Redeem referral code
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ReferralRedeemSchema } from "@/lib/validations/group-pricing";
import { isReferralCodeValid } from "@/lib/group-pricing-utils";

// Mock database
const referrals: any[] = [];
const referralRedemptions: any[] = [];

/**
 * POST /api/referrals/[code]/redeem
 * Redeem referral code for new user
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - login required" },
        { status: 401 }
      );
    }

    const referral = referrals.find((r) => r.code === code);

    if (!referral) {
      return NextResponse.json(
        { success: false, error: "Referral code not found" },
        { status: 404 }
      );
    }

    // Check validity
    const isValid = isReferralCodeValid(
      referral.expiryDate,
      referral.redemptionCount,
      referral.maxRedemptions
    );

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Referral code is no longer valid" },
        { status: 400 }
      );
    }

    // Check if already redeemed by this user
    const alreadyRedeemed = referralRedemptions.some(
      (r) => r.referralId === referral.id && r.refereeId === session.user.id
    );

    if (alreadyRedeemed) {
      return NextResponse.json(
        { success: false, error: "You have already redeemed this referral code" },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate request body
    const validation = ReferralRedeemSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validation.error.issues },
        { status: 400 }
      );
    }

    // Create redemption record
    const redemption = {
      id: `redemp_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      referralId: referral.id,
      refereeId: session.user.id,
      refereeName: validation.data.referreeName,
      refereeEmail: validation.data.refereeEmail,
      initialPurchaseAmount: validation.data.initialPurchaseAmount || 0,
      commission: 0, // Will be calculated on first purchase
      status: "pending",
      redeemedAt: new Date(),
    };

    referralRedemptions.push(redemption);

    // Update referral count
    referral.redemptionCount += 1;

    return NextResponse.json(
      {
        success: true,
        data: redemption,
        referralInfo: {
          code: referral.code,
          commissionPercent: referral.commissionPercent,
          referrerName: referral.referrerName,
        },
        message: "Referral code redeemed successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error redeeming referral code:", error);
    return NextResponse.json(
      { success: false, error: "Failed to redeem referral code" },
      { status: 500 }
    );
  }
}

