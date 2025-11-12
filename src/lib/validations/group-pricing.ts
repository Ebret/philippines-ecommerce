/**
 * Group Pricing & Social Commerce Validation Schemas
 * Comprehensive Zod schemas for group buying, bulk discounts, referrals, and social sharing
 */

import { z } from "zod";

// ============================================================================
// ENUMS
// ============================================================================

export const GroupDealStatusEnum = z.enum([
  "draft",
  "active",
  "paused",
  "completed",
  "cancelled",
  "expired",
]);

export const ReferralStatusEnum = z.enum([
  "pending",
  "active",
  "used",
  "expired",
  "revoked",
]);

export const CommunityTypeEnum = z.enum([
  "barangay",
  "neighborhood",
  "workplace",
  "school",
  "custom",
]);

export const SocialPlatformEnum = z.enum([
  "facebook",
  "tiktok",
  "instagram",
  "whatsapp",
  "viber",
  "telegram",
]);

// ============================================================================
// GROUP DEAL SCHEMAS
// ============================================================================

export const GroupDealCreationSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  minimumQuantity: z.number().int().min(2, "Minimum quantity must be at least 2"),
  maximumQuantity: z.number().int().optional(),
  basePrice: z.number().positive("Base price must be positive"),
  groupPrice: z.number().positive("Group price must be positive"),
  discountPercent: z.number().min(0).max(100, "Discount must be between 0-100"),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  targetQuantity: z.number().int().positive("Target quantity must be positive"),
  barangayLevel: z.boolean().default(false),
  barangay: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const GroupDealUpdateSchema = GroupDealCreationSchema.partial();

export const GroupDealJoinSchema = z.object({
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  notes: z.string().optional(),
});

// ============================================================================
// BULK DISCOUNT SCHEMAS
// ============================================================================

export const BulkDiscountTierSchema = z.object({
  minQuantity: z.number().int().min(1),
  maxQuantity: z.number().int().optional(),
  discountPercent: z.number().min(0).max(100),
  discountAmount: z.number().optional(),
});

export const BulkDiscountCreationSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  tiers: z.array(BulkDiscountTierSchema).min(1, "At least one tier is required"),
  isActive: z.boolean().default(true),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export const BulkDiscountUpdateSchema = BulkDiscountCreationSchema.partial();

export const BulkDiscountCalculateSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1),
  basePrice: z.number().positive(),
});

// ============================================================================
// REFERRAL SCHEMAS
// ============================================================================

export const ReferralCodeGenerationSchema = z.object({
  referrerName: z.string().min(2, "Name must be at least 2 characters"),
  referrerEmail: z.string().email("Invalid email"),
  commissionPercent: z.number().min(0).max(100).default(5),
  maxRedemptions: z.number().int().positive().optional(),
  expiryDays: z.number().int().positive().default(90),
});

export const ReferralRedeemSchema = z.object({
  referralCode: z.string().min(1, "Referral code is required"),
  refereeEmail: z.string().email("Invalid email"),
  referreeName: z.string().min(2, "Name must be at least 2 characters"),
  initialPurchaseAmount: z.number().positive().optional(),
});

export const ReferralCommissionSchema = z.object({
  referralId: z.string().min(1),
  orderId: z.string().min(1),
  orderAmount: z.number().positive(),
  commissionPercent: z.number().min(0).max(100),
});

// ============================================================================
// SOCIAL SHARING SCHEMAS
// ============================================================================

export const SocialShareSchema = z.object({
  dealId: z.string().min(1, "Deal ID is required"),
  platform: SocialPlatformEnum,
  message: z.string().min(5, "Message must be at least 5 characters"),
  includeLink: z.boolean().default(true),
  includeImage: z.boolean().default(true),
});

export const SocialShareTrackingSchema = z.object({
  shareId: z.string().min(1),
  platform: SocialPlatformEnum,
  action: z.enum(["view", "click", "share", "purchase"]),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const SocialProofSchema = z.object({
  dealId: z.string().min(1),
  participantCount: z.number().int().min(0),
  totalQuantity: z.number().int().min(0),
  progressPercent: z.number().min(0).max(100),
  recentParticipants: z.array(z.string()).optional(),
});

// ============================================================================
// COMMUNITY SCHEMAS
// ============================================================================

export const CommunityCreationSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  type: CommunityTypeEnum,
  barangay: z.string().optional(),
  location: z.string().optional(),
  maxMembers: z.number().int().positive().optional(),
  isPublic: z.boolean().default(true),
  tags: z.array(z.string()).optional(),
});

export const CommunityUpdateSchema = CommunityCreationSchema.partial();

export const CommunityMemberSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(["member", "moderator", "admin"]).default("member"),
  joinedAt: z.coerce.date().optional(),
});

export const CommunityDealSchema = z.object({
  communityId: z.string().min(1),
  dealId: z.string().min(1),
  isExclusive: z.boolean().default(false),
  specialDiscount: z.number().min(0).max(100).optional(),
});

// ============================================================================
// PARTICIPATION TRACKING SCHEMAS
// ============================================================================

export const ParticipationSchema = z.object({
  dealId: z.string().min(1),
  userId: z.string().min(1),
  quantity: z.number().int().min(1),
  joinedAt: z.coerce.date().optional(),
  status: z.enum(["pending", "confirmed", "cancelled"]).default("pending"),
});

export const CountdownTimerSchema = z.object({
  dealId: z.string().min(1),
  endTime: z.coerce.date(),
  urgencyLevel: z.enum(["low", "medium", "high"]).optional(),
});

// ============================================================================
// ANALYTICS SCHEMAS
// ============================================================================

export const GroupDealAnalyticsSchema = z.object({
  dealId: z.string().min(1),
  totalParticipants: z.number().int().min(0),
  totalQuantity: z.number().int().min(0),
  totalRevenue: z.number().min(0),
  conversionRate: z.number().min(0).max(100),
  averageOrderValue: z.number().min(0),
  engagementScore: z.number().min(0).max(100),
});

export const ReferralAnalyticsSchema = z.object({
  referralId: z.string().min(1),
  totalRedemptions: z.number().int().min(0),
  totalCommissions: z.number().min(0),
  activeReferees: z.number().int().min(0),
  conversionRate: z.number().min(0).max(100),
});

export const CommunityAnalyticsSchema = z.object({
  communityId: z.string().min(1),
  totalMembers: z.number().int().min(0),
  activeDeals: z.number().int().min(0),
  totalSavings: z.number().min(0),
  engagementRate: z.number().min(0).max(100),
});

