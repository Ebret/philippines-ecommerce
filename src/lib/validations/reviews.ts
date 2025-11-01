/**
 * Review & Rating System Validation Schemas
 * Comprehensive Zod schemas for product reviews, seller reviews, moderation, and analytics
 */

import { z } from "zod";

// ============================================================================
// ENUMS
// ============================================================================

export const RatingEnum = z.enum(["1", "2", "3", "4", "5"]);

export const ReviewStatusEnum = z.enum([
  "pending",
  "approved",
  "rejected",
  "flagged",
  "archived",
]);

export const ReviewTypeEnum = z.enum(["product", "seller"]);

export const ModerationActionEnum = z.enum([
  "approve",
  "reject",
  "flag",
  "remove",
  "warn",
]);

export const FlagReasonEnum = z.enum([
  "inappropriate",
  "spam",
  "fake",
  "offensive",
  "misleading",
  "duplicate",
  "other",
]);

// ============================================================================
// PRODUCT REVIEW SCHEMAS
// ============================================================================

export const ProductReviewCreationSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  orderId: z.string().min(1, "Order ID is required"),
  rating: RatingEnum,
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  content: z.string().min(10, "Content must be at least 10 characters").max(5000),
  photos: z.array(z.string().url()).optional(),
  videos: z.array(z.string().url()).optional(),
  tags: z.array(z.string()).optional(),
  isAnonymous: z.boolean().default(false),
});

export const ProductReviewUpdateSchema = ProductReviewCreationSchema.partial();

export const ProductReviewQuerySchema = z.object({
  productId: z.string().optional(),
  rating: RatingEnum.optional(),
  status: ReviewStatusEnum.optional(),
  sortBy: z.enum(["recent", "helpful", "rating"]).default("recent"),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
});

// ============================================================================
// SELLER REVIEW SCHEMAS
// ============================================================================

export const SellerReviewCreationSchema = z.object({
  sellerId: z.string().min(1, "Seller ID is required"),
  orderId: z.string().min(1, "Order ID is required"),
  rating: RatingEnum,
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  content: z.string().min(10, "Content must be at least 10 characters").max(5000),
  communicationRating: RatingEnum.optional(),
  shippingRating: RatingEnum.optional(),
  packagingRating: RatingEnum.optional(),
  isAnonymous: z.boolean().default(false),
});

export const SellerReviewUpdateSchema = SellerReviewCreationSchema.partial();

// ============================================================================
// REVIEW RESPONSE SCHEMAS
// ============================================================================

export const ReviewResponseSchema = z.object({
  reviewId: z.string().min(1, "Review ID is required"),
  content: z.string().min(10, "Response must be at least 10 characters").max(2000),
  isOfficial: z.boolean().default(false),
});

export const ReviewResponseUpdateSchema = ReviewResponseSchema.partial();

// ============================================================================
// REVIEW MODERATION SCHEMAS
// ============================================================================

export const ReviewFlagSchema = z.object({
  reviewId: z.string().min(1, "Review ID is required"),
  reason: FlagReasonEnum,
  description: z.string().optional(),
});

export const ReviewModerationSchema = z.object({
  reviewId: z.string().min(1, "Review ID is required"),
  action: ModerationActionEnum,
  reason: z.string().optional(),
  notes: z.string().optional(),
});

export const ReviewModerationQuerySchema = z.object({
  status: ReviewStatusEnum.optional(),
  reason: FlagReasonEnum.optional(),
  sortBy: z.enum(["recent", "flagCount"]).default("recent"),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
});

// ============================================================================
// HELPFULNESS SCHEMAS
// ============================================================================

export const HelpfulnessVoteSchema = z.object({
  reviewId: z.string().min(1, "Review ID is required"),
  isHelpful: z.boolean(),
});

export const HelpfulnessStatsSchema = z.object({
  reviewId: z.string().min(1),
  helpfulCount: z.number().int().min(0),
  notHelpfulCount: z.number().int().min(0),
  helpfulnessScore: z.number().min(0).max(100),
});

// ============================================================================
// ANALYTICS SCHEMAS
// ============================================================================

export const ReviewAnalyticsSchema = z.object({
  entityId: z.string().min(1),
  entityType: ReviewTypeEnum,
  totalReviews: z.number().int().min(0),
  averageRating: z.number().min(1).max(5),
  ratingDistribution: z.object({
    fiveStar: z.number().int().min(0),
    fourStar: z.number().int().min(0),
    threeStar: z.number().int().min(0),
    twoStar: z.number().int().min(0),
    oneStar: z.number().int().min(0),
  }),
  verifiedPurchaseCount: z.number().int().min(0),
  averageHelpfulness: z.number().min(0).max(100),
  recentReviews: z.number().int().min(0),
});

export const ReviewInsightsSchema = z.object({
  entityId: z.string().min(1),
  entityType: ReviewTypeEnum,
  sentimentAnalysis: z.object({
    positive: z.number().min(0).max(100),
    neutral: z.number().min(0).max(100),
    negative: z.number().min(0).max(100),
  }),
  commonTopics: z.array(z.string()).optional(),
  improvementAreas: z.array(z.string()).optional(),
  strengths: z.array(z.string()).optional(),
});

export const TrendingReviewsSchema = z.object({
  period: z.enum(["day", "week", "month"]).default("week"),
  limit: z.number().int().positive().max(50).default(10),
});

// ============================================================================
// RATING DISTRIBUTION SCHEMAS
// ============================================================================

export const RatingDistributionSchema = z.object({
  entityId: z.string().min(1),
  entityType: ReviewTypeEnum,
  fiveStar: z.number().int().min(0),
  fourStar: z.number().int().min(0),
  threeStar: z.number().int().min(0),
  twoStar: z.number().int().min(0),
  oneStar: z.number().int().min(0),
});

// ============================================================================
// VERIFIED PURCHASE SCHEMAS
// ============================================================================

export const VerifiedPurchaseSchema = z.object({
  reviewId: z.string().min(1),
  orderId: z.string().min(1),
  isVerified: z.boolean(),
  purchaseDate: z.coerce.date().optional(),
});

// ============================================================================
// REVIEW FILTER SCHEMAS
// ============================================================================

export const ReviewFilterSchema = z.object({
  entityId: z.string().optional(),
  entityType: ReviewTypeEnum.optional(),
  rating: RatingEnum.optional(),
  status: ReviewStatusEnum.optional(),
  verifiedOnly: z.boolean().default(false),
  hasPhotos: z.boolean().default(false),
  hasResponses: z.boolean().default(false),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
  searchText: z.string().optional(),
});

