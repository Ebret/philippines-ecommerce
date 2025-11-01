/**
 * Review Analytics API Routes
 * GET /api/reviews/analytics/products/[id] - Get product review analytics
 * GET /api/reviews/analytics/sellers/[id] - Get seller review analytics
 * GET /api/reviews/analytics/trending - Get trending reviews
 * GET /api/reviews/analytics/insights - Get review insights
 */

import { NextRequest, NextResponse } from "next/server";
import {
  calculateAverageRating,
  getRatingDistribution,
  calculateTrendingScore,
  analyzeSentiment,
  getPerformanceLevel,
} from "@/lib/review-utils";

// Mock database - replace with Prisma in production
const reviews: Record<string, any> = {};

// ============================================================================
// GET /api/reviews/analytics/products/[id] - Product analytics
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const entityId = searchParams.get("entityId");
    const entityType = searchParams.get("entityType") || "product";
    const period = searchParams.get("period") || "month";

    if (!entityId) {
      return NextResponse.json(
        { error: "Entity ID is required" },
        { status: 400 }
      );
    }

    // Filter reviews for entity
    const entityReviews = Object.values(reviews).filter(
      (review) =>
        review.status === "approved" &&
        ((entityType === "product" && review.productId === entityId) ||
          (entityType === "seller" && review.sellerId === entityId))
    );

    if (entityReviews.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          entityId,
          entityType,
          totalReviews: 0,
          averageRating: 0,
          ratingDistribution: {
            fiveStar: 0,
            fourStar: 0,
            threeStar: 0,
            twoStar: 0,
            oneStar: 0,
          },
          verifiedPurchaseCount: 0,
          averageHelpfulness: 0,
          recentReviews: 0,
          performanceLevel: "poor",
        },
      });
    }

    // Calculate analytics
    const ratings = entityReviews.map((r) => r.rating);
    const averageRating = calculateAverageRating(ratings);
    const ratingDistribution = getRatingDistribution(ratings);
    const verifiedCount = entityReviews.filter((r) => r.isVerified).length;
    const averageHelpfulness = Math.round(
      entityReviews.reduce(
        (sum, r) => sum + (r.helpfulCount / (r.helpfulCount + r.notHelpfulCount || 1)) * 100,
        0
      ) / entityReviews.length
    );

    // Get recent reviews (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentReviews = entityReviews.filter(
      (r) => new Date(r.createdAt) > sevenDaysAgo
    ).length;

    return NextResponse.json({
      success: true,
      data: {
        entityId,
        entityType,
        totalReviews: entityReviews.length,
        averageRating,
        ratingDistribution,
        verifiedPurchaseCount: verifiedCount,
        averageHelpfulness,
        recentReviews,
        performanceLevel: getPerformanceLevel(averageRating),
        sentimentAnalysis: analyzeSentiment(
          entityReviews.map((r) => r.content).join(" ")
        ),
      },
    });
  } catch (error) {
    console.error("Error fetching review analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch review analytics" },
      { status: 500 }
    );
  }
}

// ============================================================================
// GET /api/reviews/analytics/trending - Trending reviews
// ============================================================================

export async function GET_TRENDING(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get("period") || "week";
    const limit = parseInt(searchParams.get("limit") || "10");

    // Filter reviews by period
    let dateFilter = new Date();
    if (period === "day") {
      dateFilter = new Date(Date.now() - 24 * 60 * 60 * 1000);
    } else if (period === "week") {
      dateFilter = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    } else if (period === "month") {
      dateFilter = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    const trendingReviews = Object.values(reviews)
      .filter(
        (review) =>
          review.status === "approved" &&
          new Date(review.createdAt) > dateFilter
      )
      .map((review) => ({
        ...review,
        trendingScore: calculateTrendingScore(
          1,
          review.rating,
          1,
          (review.helpfulCount / (review.helpfulCount + review.notHelpfulCount || 1)) * 100
        ),
      }))
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, limit);

    return NextResponse.json({
      success: true,
      data: trendingReviews,
      period,
      count: trendingReviews.length,
    });
  } catch (error) {
    console.error("Error fetching trending reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending reviews" },
      { status: 500 }
    );
  }
}

