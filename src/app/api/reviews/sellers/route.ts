/**
 * Seller Review API Routes
 * GET /api/reviews/sellers - List seller reviews
 * POST /api/reviews/sellers - Create seller review
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SellerReviewCreationSchema } from "@/lib/validations/reviews";
import { generateReviewId } from "@/lib/review-utils";

// Mock database - replace with Prisma in production
const reviews: Record<string, any> = {};

// ============================================================================
// GET /api/reviews/sellers - List seller reviews
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sellerId = searchParams.get("sellerId");
    const rating = searchParams.get("rating");
    const status = searchParams.get("status") || "approved";
    const sortBy = searchParams.get("sortBy") || "recent";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Filter reviews
    let filteredReviews = Object.values(reviews).filter((review) => {
      if (review.type !== "seller") return false;
      if (sellerId && review.sellerId !== sellerId) return false;
      if (rating && review.rating !== parseInt(rating)) return false;
      if (review.status !== status) return false;
      return true;
    });

    // Sort reviews
    if (sortBy === "helpful") {
      filteredReviews.sort(
        (a, b) =>
          (b.helpfulCount - b.notHelpfulCount) -
          (a.helpfulCount - a.notHelpfulCount)
      );
    } else if (sortBy === "rating") {
      filteredReviews.sort((a, b) => b.rating - a.rating);
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
    console.error("Error fetching seller reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch seller reviews" },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST /api/reviews/sellers - Create seller review
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized - please login" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate request body
    const validation = SellerReviewCreationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid review data", details: validation.error },
        { status: 400 }
      );
    }

    const reviewData = validation.data;

    // Check if user already reviewed this seller
    const existingReview = Object.values(reviews).find(
      (review) =>
        review.type === "seller" &&
        review.sellerId === reviewData.sellerId &&
        review.userId === session.user.id
    );

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this seller" },
        { status: 409 }
      );
    }

    // Create review
    const reviewId = generateReviewId();
    const newReview = {
      id: reviewId,
      type: "seller",
      sellerId: reviewData.sellerId,
      orderId: reviewData.orderId,
      userId: session.user.id,
      userName: session.user.name || "Anonymous",
      rating: parseInt(reviewData.rating),
      title: reviewData.title,
      content: reviewData.content,
      communicationRating: reviewData.communicationRating
        ? parseInt(reviewData.communicationRating)
        : null,
      shippingRating: reviewData.shippingRating
        ? parseInt(reviewData.shippingRating)
        : null,
      packagingRating: reviewData.packagingRating
        ? parseInt(reviewData.packagingRating)
        : null,
      isAnonymous: reviewData.isAnonymous,
      status: "pending",
      isVerified: true,
      helpfulCount: 0,
      notHelpfulCount: 0,
      flagCount: 0,
      responses: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    reviews[reviewId] = newReview;

    return NextResponse.json(
      {
        success: true,
        message: "Seller review created successfully",
        data: newReview,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating seller review:", error);
    return NextResponse.json(
      { error: "Failed to create seller review" },
      { status: 500 }
    );
  }
}

