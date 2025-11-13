/**
 * Review Response API Routes
 * GET /api/reviews/[id]/responses - Get review responses
 * POST /api/reviews/[id]/responses - Create review response
 * PATCH /api/reviews/[id]/responses/[responseId] - Update response
 * DELETE /api/reviews/[id]/responses/[responseId] - Delete response
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ReviewResponseSchema, ReviewResponseUpdateSchema } from "@/lib/validations/reviews";

// Mock database - replace with Prisma in production
const reviews: Record<string, any> = {};
const responses: Record<string, any> = {};

// ============================================================================
// GET /api/reviews/[id]/responses - Get review responses
// ============================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const reviewId = id;

    // Get responses for this review
    const reviewResponses = Object.values(responses).filter(
      (response) => response.reviewId === reviewId
    );

    return NextResponse.json({
      success: true,
      data: reviewResponses,
      count: reviewResponses.length,
    });
  } catch (error) {
    console.error("Error fetching review responses:", error);
    return NextResponse.json(
      { error: "Failed to fetch review responses" },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST /api/reviews/[id]/responses - Create review response
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
    const validation = ReviewResponseSchema.safeParse({
      reviewId,
      ...body,
    });

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid response data", details: validation.error },
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

    // Check if user is the seller/vendor
    if (review.type === "seller" && review.sellerId !== session.user.id) {
      return NextResponse.json(
        { error: "Only the seller can respond to this review" },
        { status: 403 }
      );
    }

    // Create response
    const responseId = `resp_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const newResponse = {
      id: responseId,
      reviewId,
      userId: session.user.id,
      userName: session.user.name || "Seller",
      content: body.content,
      isOfficial: body.isOfficial || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    responses[responseId] = newResponse;

    // Update review with response
    if (!review.responses) review.responses = [];
    review.responses.push(responseId);

    return NextResponse.json(
      {
        success: true,
        message: "Response created successfully",
        data: newResponse,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating review response:", error);
    return NextResponse.json(
      { error: "Failed to create review response" },
      { status: 500 }
    );
  }
}

