/**
 * Review Moderation API Routes
 * GET /api/reviews/moderation/pending - Get pending reviews for moderation
 * PATCH /api/reviews/moderation/[id]/approve - Approve review
 * PATCH /api/reviews/moderation/[id]/reject - Reject review
 * POST /api/reviews/[id]/flag - Flag review
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  ReviewModerationSchema,
  ReviewFlagSchema,
  ReviewModerationQuerySchema,
} from "@/lib/validations/reviews";

// Mock database - replace with Prisma in production
const reviews: Record<string, any> = {};
const flags: Record<string, any> = {};

// ============================================================================
// GET /api/reviews/moderation/pending - Get pending reviews
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is admin
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - admin access required" },
        { status: 403 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status") || "pending";
    const reason = searchParams.get("reason");
    const sortBy = searchParams.get("sortBy") || "recent";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Validate query parameters
    const queryValidation = ReviewModerationQuerySchema.safeParse({
      status,
      reason: reason || undefined,
      sortBy,
      page,
      limit,
    });

    if (!queryValidation.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: queryValidation.error },
        { status: 400 }
      );
    }

    // Filter reviews
    let filteredReviews = Object.values(reviews).filter((review) => {
      if (review.status !== status) return false;
      if (reason && review.flagReason !== reason) return false;
      return true;
    });

    // Sort reviews
    if (sortBy === "flagCount") {
      filteredReviews.sort((a, b) => b.flagCount - a.flagCount);
    } else {
      filteredReviews.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    // Paginate
    const skip = (page - 1) * limit;
    const paginatedReviews = filteredReviews.slice(skip, skip + limit);

    return NextResponse.json({
      success: true,
      data: paginatedReviews,
      pagination: {
        page,
        limit,
        total: filteredReviews.length,
        pages: Math.ceil(filteredReviews.length / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching pending reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch pending reviews" },
      { status: 500 }
    );
  }
}

// ============================================================================
// PATCH /api/reviews/moderation/[id]/approve - Approve review
// ============================================================================

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is admin
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const reviewId = body.reviewId;

    // Validate request body
    const validation = ReviewModerationSchema.safeParse({
      reviewId,
      action: body.action || "approve",
      reason: body.reason,
      notes: body.notes,
    });

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid moderation data", details: validation.error },
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

    // Update review status
    review.status = "approved";
    review.moderatedAt = new Date().toISOString();
    review.moderatedBy = session.user.id;
    review.moderationNotes = body.notes;

    return NextResponse.json({
      success: true,
      message: "Review approved successfully",
      data: review,
    });
  } catch (error) {
    console.error("Error approving review:", error);
    return NextResponse.json(
      { error: "Failed to approve review" },
      { status: 500 }
    );
  }
}


