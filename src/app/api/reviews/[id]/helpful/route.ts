/**
 * Review Helpfulness API Routes
 * POST /api/reviews/[id]/helpful - Mark review as helpful
 * POST /api/reviews/[id]/not-helpful - Mark review as not helpful
 * GET /api/reviews/[id]/helpfulness-stats - Get helpfulness statistics
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  HelpfulnessVoteSchema,
  HelpfulnessStatsSchema,
} from "@/lib/validations/reviews";
import { calculateHelpfulnessScore } from "@/lib/review-utils";

// Mock database - replace with Prisma in production
const reviews: Record<string, any> = {};
const helpfulnessVotes: Record<string, any> = {};

// ============================================================================
// POST /api/reviews/[id]/helpful - Mark as helpful
// ============================================================================

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized - please login" },
        { status: 401 }
      );
    }

    const reviewId = id;
    const body = await request.json();

    // Validate request body
    const validation = HelpfulnessVoteSchema.safeParse({
      reviewId,
      isHelpful: body.isHelpful !== false,
    });

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid vote data", details: validation.error },
        { status: 400 }
      );
    }

    // Check if review exists
    const review = reviews[reviewId];
    if (!review) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }

    // Check if user already voted
    const voteKey = `${reviewId}_${session.user.id}`;
    const existingVote = helpfulnessVotes[voteKey];

    if (existingVote) {
      // Update existing vote
      if (existingVote.isHelpful && !body.isHelpful) {
        review.helpfulCount--;
        review.notHelpfulCount++;
      } else if (!existingVote.isHelpful && body.isHelpful) {
        review.helpfulCount++;
        review.notHelpfulCount--;
      }
      existingVote.isHelpful = body.isHelpful;
    } else {
      // Create new vote
      if (body.isHelpful) {
        review.helpfulCount++;
      } else {
        review.notHelpfulCount++;
      }
      helpfulnessVotes[voteKey] = {
        reviewId,
        userId: session.user.id,
        isHelpful: body.isHelpful,
        createdAt: new Date().toISOString(),
      };
    }

    const helpfulnessScore = calculateHelpfulnessScore(
      review.helpfulCount,
      review.notHelpfulCount
    );

    return NextResponse.json({
      success: true,
      message: "Vote recorded successfully",
      data: {
        reviewId,
        helpfulCount: review.helpfulCount,
        notHelpfulCount: review.notHelpfulCount,
        helpfulnessScore,
      },
    });
  } catch (error) {
    console.error("Error recording helpfulness vote:", error);
    return NextResponse.json(
      { error: "Failed to record vote" },
      { status: 500 }
    );
  }
}

// ============================================================================
// GET /api/reviews/[id]/helpfulness-stats - Get helpfulness stats
// ============================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const reviewId = id;

    // Check if review exists
    const review = reviews[reviewId];
    if (!review) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }

    const helpfulnessScore = calculateHelpfulnessScore(
      review.helpfulCount,
      review.notHelpfulCount
    );

    const stats = {
      reviewId,
      helpfulCount: review.helpfulCount,
      notHelpfulCount: review.notHelpfulCount,
      helpfulnessScore,
      totalVotes: review.helpfulCount + review.notHelpfulCount,
    };

    // Validate stats
    const validation = HelpfulnessStatsSchema.safeParse(stats);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid stats data", details: validation.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching helpfulness stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch helpfulness stats" },
      { status: 500 }
    );
  }
}

