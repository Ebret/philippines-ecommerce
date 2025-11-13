/**
 * Referral Program API Routes
 * GET /api/referrals - List referrals
 * POST /api/referrals/generate-code - Generate referral code
 * GET /api/referrals/[code] - Get referral details
 * POST /api/referrals/[code]/redeem - Redeem referral code
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  ReferralCodeGenerationSchema,
  ReferralRedeemSchema,
} from "@/lib/validations/group-pricing";
import {
  generateReferralCode,
  calculateReferralCommission,
  isReferralCodeValid,
} from "@/lib/group-pricing-utils";

// Mock database
const referrals: any[] = [];
const referralRedemptions: any[] = [];

/**
 * GET /api/referrals
 * List user's referrals with statistics
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - login required" },
        { status: 401 }
      );
    }

    const userReferrals = referrals.filter((r) => r.referrerId === session.user.id);

    const referralStats = userReferrals.map((ref) => {
      const redemptions = referralRedemptions.filter(
        (r) => r.referralId === ref.id
      );
      const totalCommissions = redemptions.reduce(
        (sum, r) => sum + (r.commission || 0),
        0
      );

      return {
        ...ref,
        redemptionCount: redemptions.length,
        totalCommissions,
        redemptions: redemptions.slice(0, 5), // Last 5 redemptions
      };
    });

    return NextResponse.json(
      {
        success: true,
        data: referralStats,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching referrals:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch referrals" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/referrals/generate-code
 * Generate new referral code
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
    const validation = ReferralCodeGenerationSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validation.error.issues },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Generate unique code
    let code = generateReferralCode();
    while (referrals.some((r) => r.code === code)) {
      code = generateReferralCode();
    }

    // Create referral
    const referral = {
      id: `ref_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      referrerId: session.user.id,
      code,
      ...data,
      createdAt: new Date(),
      expiryDate: new Date(Date.now() + data.expiryDays * 24 * 60 * 60 * 1000),
      redemptionCount: 0,
      totalCommissions: 0,
    };

    referrals.push(referral);

    return NextResponse.json(
      {
        success: true,
        data: referral,
        message: "Referral code generated successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error generating referral code:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate referral code" },
      { status: 500 }
    );
  }
}


