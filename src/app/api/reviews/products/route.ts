/**
 * Product Review API Routes
 * GET /api/reviews/products - List product reviews
 * POST /api/reviews/products - Create product review
 *
 * Security: Integrated content sanitization for XSS/injection prevention
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  ProductReviewCreationSchema,
  ProductReviewQuerySchema,
  ReviewStatusEnum,
} from "@/lib/validations/reviews";
import { generateReviewId } from "@/lib/review-utils";
import {
  scanAndSanitizeContent,
  applyPrivacyProtection,
} from "@/lib/security-middleware";

// Mock database - replace with Prisma in production
const reviews: Record<string, any> = {};

// ============================================================================
// GET /api/reviews/products - List product reviews
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get("productId");
    const rating = searchParams.get("rating");
    const status = searchParams.get("status") || "approved";
    const sortBy = searchParams.get("sortBy") || "recent";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Validate query parameters
    const queryValidation = ProductReviewQuerySchema.safeParse({
      productId: productId || undefined,
      rating: rating || undefined,
      status,
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
      if (review.type !== "product") return false;
      if (productId && review.productId !== productId) return false;
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

    const response = NextResponse.json({
      success: true,
      data: paginatedReviews,
      pagination: {
        page,
        limit,
        total: filteredReviews.length,
        pages: Math.ceil(filteredReviews.length / limit),
      },
    });
    return applyPrivacyProtection(response, request.headers);
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch product reviews" },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST /api/reviews/products - Create product review
// ============================================================================

/**
 * POST /api/reviews/products - Create product review
 *
 * Security Features:
 * - Content sanitization (XSS, SQL injection, script injection)
 * - Input validation
 * - Security audit logging
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized - please login" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate request body
    const validation = ProductReviewCreationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid review data", details: validation.error },
        { status: 400 }
      );
    }

    const reviewData = validation.data;

    // Security: Sanitize review title for malicious content
    const titleScan = scanAndSanitizeContent(
      reviewData.title,
      session.user.id,
      ip,
      'review'
    );

    // Security: Sanitize review content for malicious content
    const contentScan = scanAndSanitizeContent(
      reviewData.content,
      session.user.id,
      ip,
      'review'
    );

    // Check if user already reviewed this product
    const existingReview = Object.values(reviews).find(
      (review) =>
        review.type === "product" &&
        review.productId === reviewData.productId &&
        review.userId === session.user.id
    );

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this product" },
        { status: 409 }
      );
    }

    // Create review with sanitized content
    const reviewId = generateReviewId();
    const newReview = {
      id: reviewId,
      type: "product",
      productId: reviewData.productId,
      orderId: reviewData.orderId,
      userId: session.user.id,
      userName: session.user.name || "Anonymous",
      rating: parseInt(reviewData.rating),
      title: titleScan.sanitizedContent, // Use sanitized title
      content: contentScan.sanitizedContent, // Use sanitized content
      photos: reviewData.photos || [],
      videos: reviewData.videos || [],
      tags: reviewData.tags || [],
      isAnonymous: reviewData.isAnonymous,
      status: "pending",
      isVerified: true,
      helpfulCount: 0,
      notHelpfulCount: 0,
      flagCount: 0,
      responses: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Include security metadata
      securityScanned: true,
      threatsDetected: titleScan.threats.length + contentScan.threats.length,
    };

    reviews[reviewId] = newReview;

    const response = NextResponse.json(
      {
        success: true,
        message: "Review created successfully",
        data: newReview,
        securityInfo: {
          contentSanitized: !titleScan.allowed || !contentScan.allowed ||
                           titleScan.threats.length > 0 || contentScan.threats.length > 0,
          threatsRemoved: titleScan.threats.length + contentScan.threats.length,
        },
      },
      { status: 201 }
    );
    return applyPrivacyProtection(response, request.headers);
  } catch (error) {
    console.error("Error creating product review:", error);
    return NextResponse.json(
      { error: "Failed to create product review" },
      { status: 500 }
    );
  }
}

