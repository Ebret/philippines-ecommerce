/**
 * Referral Code Detail API Route
 * GET /api/referrals/[code] - Get referral code details
 */

import { NextRequest, NextResponse } from "next/server";
import { isReferralCodeValid } from "@/lib/group-pricing-utils";

// Mock database
const referrals: any[] = [];
const referralRedemptions: any[] = [];

/**
 * GET /api/referrals/[code]
 * Get referral code details and validity
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  try {
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

    const redemptions = referralRedemptions.filter(
      (r) => r.referralId === referral.id
    );

    return NextResponse.json(
      {
        success: true,
        data: {
          code: referral.code,
          referrerName: referral.referrerName,
          commissionPercent: referral.commissionPercent,
          isValid,
          redemptionCount: referral.redemptionCount,
          maxRedemptions: referral.maxRedemptions,
          expiryDate: referral.expiryDate,
          totalCommissions: referral.totalCommissions,
          recentRedemptions: redemptions.slice(-3),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching referral code:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch referral code" },
      { status: 500 }
    );
  }
}

