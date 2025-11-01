/**
 * Review & Rating System Unit Tests
 * Comprehensive tests for all review functionality
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  generateReviewId,
  calculateAverageRating,
  calculateRatingPercentage,
  getRatingDistribution,
  calculateHelpfulnessScore,
  getHelpfulnessLevel,
  isVerifiedPurchase,
  getVerificationBadgeText,
  shouldFlagReview,
  calculateSpamScore,
  getModerationPriority,
  analyzeSentiment,
  calculateReviewQualityScore,
  calculateTrendingScore,
  getPerformanceLevel,
  sortReviewsByHelpfulness,
  filterReviewsByRating,
  canVendorRespond,
  getResponseCount,
  calculateReviewStats,
  isPhilippinesReview,
  getLocalLanguageSupport,
} from "@/lib/review-utils";
import {
  ProductReviewCreationSchema,
  SellerReviewCreationSchema,
  ReviewResponseSchema,
  ReviewFlagSchema,
  ReviewModerationSchema,
  HelpfulnessVoteSchema,
  ReviewAnalyticsSchema,
  RatingDistributionSchema,
  VerifiedPurchaseSchema,
  ReviewFilterSchema,
} from "@/lib/validations/reviews";

describe("Review & Rating System Utilities", () => {
  // ========================================================================
  // Review ID Generation Tests
  // ========================================================================

  describe("Review ID Generation", () => {
    it("should generate unique review IDs", () => {
      const id1 = generateReviewId();
      const id2 = generateReviewId();
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^rev_/);
      expect(id2).toMatch(/^rev_/);
    });

    it("should generate alphanumeric review IDs", () => {
      const id = generateReviewId();
      expect(id).toMatch(/^rev_[a-z0-9_]+$/);
    });
  });

  // ========================================================================
  // Rating Calculation Tests
  // ========================================================================

  describe("Rating Calculations", () => {
    it("should calculate average rating correctly", () => {
      const ratings = [5, 4, 3, 4, 5];
      const average = calculateAverageRating(ratings);
      expect(average).toBe(4.2);
    });

    it("should handle empty ratings array", () => {
      const average = calculateAverageRating([]);
      expect(average).toBe(0);
    });

    it("should calculate rating percentage", () => {
      const percentage = calculateRatingPercentage(25, 100);
      expect(percentage).toBe(25);
    });

    it("should handle zero total for percentage", () => {
      const percentage = calculateRatingPercentage(10, 0);
      expect(percentage).toBe(0);
    });

    it("should get rating distribution", () => {
      const ratings = [5, 5, 4, 4, 4, 3, 2, 1];
      const distribution = getRatingDistribution(ratings);
      expect(distribution.fiveStar).toBe(2);
      expect(distribution.fourStar).toBe(3);
      expect(distribution.threeStar).toBe(1);
      expect(distribution.twoStar).toBe(1);
      expect(distribution.oneStar).toBe(1);
    });
  });

  // ========================================================================
  // Helpfulness Tests
  // ========================================================================

  describe("Helpfulness Calculations", () => {
    it("should calculate helpfulness score", () => {
      const score = calculateHelpfulnessScore(80, 20);
      expect(score).toBe(80);
    });

    it("should handle zero votes", () => {
      const score = calculateHelpfulnessScore(0, 0);
      expect(score).toBe(0);
    });

    it("should get helpfulness level", () => {
      expect(getHelpfulnessLevel(85)).toBe("very_helpful");
      expect(getHelpfulnessLevel(70)).toBe("helpful");
      expect(getHelpfulnessLevel(50)).toBe("somewhat_helpful");
      expect(getHelpfulnessLevel(30)).toBe("not_helpful");
    });
  });

  // ========================================================================
  // Verified Purchase Tests
  // ========================================================================

  describe("Verified Purchase Detection", () => {
    it("should detect verified purchase", () => {
      const isVerified = isVerifiedPurchase("order-123", "delivered");
      expect(isVerified).toBe(true);
    });

    it("should detect unverified purchase", () => {
      const isVerified = isVerifiedPurchase("order-123", "pending");
      expect(isVerified).toBe(false);
    });

    it("should get verification badge text", () => {
      expect(getVerificationBadgeText(true)).toBe("Verified Purchase");
      expect(getVerificationBadgeText(false)).toBe("Unverified");
    });
  });

  // ========================================================================
  // Review Moderation Tests
  // ========================================================================

  describe("Review Moderation", () => {
    it("should flag reviews with inappropriate content", () => {
      const shouldFlag = shouldFlagReview("This is spam content");
      expect(shouldFlag).toBe(true);
    });

    it("should not flag normal reviews", () => {
      const shouldFlag = shouldFlagReview("Great product, highly recommend!");
      expect(shouldFlag).toBe(false);
    });

    it("should calculate spam score", () => {
      const score1 = calculateSpamScore(10, 1); // 10 reviews per hour
      expect(score1).toBe(100);

      const score2 = calculateSpamScore(2, 1); // 2 reviews per hour
      expect(score2).toBe(50);

      const score3 = calculateSpamScore(1, 2); // 0.5 reviews per hour
      expect(score3).toBe(0);
    });

    it("should get moderation priority", () => {
      expect(getModerationPriority(5, 80)).toBe("high");
      expect(getModerationPriority(2, 60)).toBe("medium");
      expect(getModerationPriority(0, 30)).toBe("low");
    });
  });

  // ========================================================================
  // Sentiment Analysis Tests
  // ========================================================================

  describe("Sentiment Analysis", () => {
    it("should analyze positive sentiment", () => {
      const sentiment = analyzeSentiment("This product is excellent and amazing!");
      expect(sentiment.positive).toBeGreaterThan(0);
    });

    it("should analyze negative sentiment", () => {
      const sentiment = analyzeSentiment("This is terrible and awful!");
      expect(sentiment.negative).toBeGreaterThan(0);
    });

    it("should analyze neutral sentiment", () => {
      const sentiment = analyzeSentiment("This is a product");
      expect(sentiment.neutral).toBeGreaterThan(0);
    });
  });

  // ========================================================================
  // Review Quality Scoring Tests
  // ========================================================================

  describe("Review Quality Scoring", () => {
    it("should calculate review quality score", () => {
      const score = calculateReviewQualityScore(5, 500, true, true, 85);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it("should score high-quality reviews higher", () => {
      const highQuality = calculateReviewQualityScore(5, 500, true, true, 90);
      const lowQuality = calculateReviewQualityScore(1, 50, false, false, 10);
      expect(highQuality).toBeGreaterThan(lowQuality);
    });
  });

  // ========================================================================
  // Analytics Tests
  // ========================================================================

  describe("Analytics Calculations", () => {
    it("should calculate trending score", () => {
      const score = calculateTrendingScore(100, 4.5, 20, 85);
      expect(score).toBeGreaterThan(0);
    });

    it("should get performance level", () => {
      expect(getPerformanceLevel(4.7)).toBe("excellent");
      expect(getPerformanceLevel(3.8)).toBe("good");
      expect(getPerformanceLevel(3.0)).toBe("average");
      expect(getPerformanceLevel(2.0)).toBe("poor");
    });
  });

  // ========================================================================
  // Review Filtering & Sorting Tests
  // ========================================================================

  describe("Review Filtering & Sorting", () => {
    it("should sort reviews by helpfulness", () => {
      const reviews = [
        { helpfulCount: 10, notHelpfulCount: 5 },
        { helpfulCount: 20, notHelpfulCount: 5 },
        { helpfulCount: 5, notHelpfulCount: 10 },
      ];
      const sorted = sortReviewsByHelpfulness(reviews);
      expect(sorted[0].helpfulCount).toBe(20);
    });

    it("should filter reviews by rating", () => {
      const reviews = [
        { rating: 5 },
        { rating: 4 },
        { rating: 5 },
        { rating: 3 },
      ];
      const filtered = filterReviewsByRating(reviews, 5);
      expect(filtered.length).toBe(2);
      expect(filtered.every((r) => r.rating === 5)).toBe(true);
    });
  });

  // ========================================================================
  // Response Management Tests
  // ========================================================================

  describe("Response Management", () => {
    it("should check vendor response permission", () => {
      const canRespond = canVendorRespond("vendor-123", "vendor-123");
      expect(canRespond).toBe(true);
    });

    it("should deny non-vendor response", () => {
      const canRespond = canVendorRespond("vendor-123", "vendor-456");
      expect(canRespond).toBe(false);
    });

    it("should get response count", () => {
      const responses = [{ id: "1" }, { id: "2" }, { id: "3" }];
      const count = getResponseCount(responses);
      expect(count).toBe(3);
    });
  });

  // ========================================================================
  // Review Statistics Tests
  // ========================================================================

  describe("Review Statistics", () => {
    it("should calculate review stats", () => {
      const reviews = [
        {
          rating: 5,
          isVerified: true,
          helpfulCount: 10,
          notHelpfulCount: 2,
          responses: [{ id: "1" }],
        },
        {
          rating: 4,
          isVerified: true,
          helpfulCount: 8,
          notHelpfulCount: 1,
          responses: [],
        },
      ];
      const stats = calculateReviewStats(reviews);
      expect(stats.totalReviews).toBe(2);
      expect(stats.verifiedCount).toBe(2);
      expect(stats.totalResponses).toBe(1);
    });
  });

  // ========================================================================
  // Philippines-Specific Features Tests
  // ========================================================================

  describe("Philippines-Specific Features", () => {
    it("should detect Philippines reviews", () => {
      expect(isPhilippinesReview("Metro Manila")).toBe(true);
      expect(isPhilippinesReview("Cebu")).toBe(true);
      expect(isPhilippinesReview("New York")).toBe(false);
    });

    it("should support local languages", () => {
      expect(getLocalLanguageSupport("en")).toBe(true);
      expect(getLocalLanguageSupport("tl")).toBe(true);
      expect(getLocalLanguageSupport("fil")).toBe(true);
      expect(getLocalLanguageSupport("es")).toBe(false);
    });
  });

  // ========================================================================
  // Validation Schema Tests
  // ========================================================================

  describe("Validation Schemas", () => {
    it("should validate product review creation", () => {
      const data = {
        productId: "prod-123",
        orderId: "order-123",
        rating: "5",
        title: "Excellent product",
        content: "This product exceeded my expectations",
      };
      const result = ProductReviewCreationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should validate seller review creation", () => {
      const data = {
        sellerId: "seller-123",
        orderId: "order-123",
        rating: "5",
        title: "Great seller",
        content: "Fast shipping and excellent service",
      };
      const result = SellerReviewCreationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should validate review response", () => {
      const data = {
        reviewId: "rev-123",
        content: "Thank you for your feedback",
      };
      const result = ReviewResponseSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should validate review flag", () => {
      const data = {
        reviewId: "rev-123",
        reason: "spam",
      };
      const result = ReviewFlagSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should validate helpfulness vote", () => {
      const data = {
        reviewId: "rev-123",
        isHelpful: true,
      };
      const result = HelpfulnessVoteSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });
});

