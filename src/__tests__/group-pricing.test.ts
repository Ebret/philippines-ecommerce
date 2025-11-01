/**
 * Group Pricing & Social Commerce Tests
 * Comprehensive unit tests for group deals, bulk discounts, referrals, and social sharing
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  generateGroupDealId,
  calculateGroupDiscount,
  calculateGroupSavings,
  getGroupDealStatus,
  isGroupDealActive,
  getGroupDealTimeRemaining,
  calculateGroupProgress,
  isMinimumQuantityReached,
  generateBulkDiscountId,
  calculateBulkDiscountPrice,
  getApplicableDiscountTier,
  calculateBulkOrderTotal,
  generateReferralCode,
  calculateReferralCommission,
  isReferralCodeValid,
  calculateReferralEarnings,
  calculateReferralConversionRate,
  generateShareTrackingId,
  generateSocialShareUrl,
  calculateSocialProofScore,
  formatSocialProofMessage,
  generateCommunityId,
  calculateCommunityEngagementRate,
  calculateCommunitySavings,
  calculateParticipationRate,
  getUrgencyLevel,
  formatCountdownTimer,
  calculateGroupDealConversionRate,
  calculateGroupDealAOV,
  calculateEngagementScore,
  determineDealPerformanceLevel,
} from "@/lib/group-pricing-utils";
import {
  GroupDealCreationSchema,
  BulkDiscountCreationSchema,
  ReferralCodeGenerationSchema,
  SocialShareSchema,
  CommunityCreationSchema,
} from "@/lib/validations/group-pricing";
import { Decimal } from "@prisma/client/runtime/library";

describe("Group Pricing & Social Commerce Utilities", () => {
  // ============================================================================
  // GROUP DEAL UTILITIES
  // ============================================================================

  describe("Group Deal ID Generation", () => {
    it("should generate unique group deal IDs", () => {
      const id1 = generateGroupDealId();
      const id2 = generateGroupDealId();
      expect(id1).toMatch(/^deal_/);
      expect(id2).toMatch(/^deal_/);
      expect(id1).not.toBe(id2);
    });
  });

  describe("Group Discount Calculations", () => {
    it("should calculate group discount correctly", () => {
      const discount = calculateGroupDiscount(1000, 20);
      expect(discount).toBe(800);
    });

    it("should handle Decimal prices", () => {
      const discount = calculateGroupDiscount(new Decimal("1000.50"), 10);
      expect(discount).toBe(900.45);
    });

    it("should calculate group savings correctly", () => {
      const savings = calculateGroupSavings(1000, 800, 5);
      expect(savings).toBe(1000);
    });
  });

  describe("Group Deal Status", () => {
    it("should return scheduled for future deals", () => {
      const future = new Date(Date.now() + 3600000);
      const status = getGroupDealStatus(future, future, 0, 100, "active");
      expect(status).toBe("scheduled");
    });

    it("should return active for current deals", () => {
      const past = new Date(Date.now() - 1000);
      const future = new Date(Date.now() + 3600000);
      const status = getGroupDealStatus(past, future, 50, 100, "active");
      expect(status).toBe("active");
    });

    it("should return completed when target reached", () => {
      const past = new Date(Date.now() - 1000);
      const future = new Date(Date.now() + 3600000);
      const status = getGroupDealStatus(past, future, 100, 100, "active");
      expect(status).toBe("completed");
    });

    it("should check if deal is active", () => {
      const past = new Date(Date.now() - 1000);
      const future = new Date(Date.now() + 3600000);
      expect(isGroupDealActive(past, future)).toBe(true);
    });
  });

  describe("Group Progress Tracking", () => {
    it("should calculate progress percentage", () => {
      const progress = calculateGroupProgress(50, 100);
      expect(progress).toBe(50);
    });

    it("should cap progress at 100%", () => {
      const progress = calculateGroupProgress(150, 100);
      expect(progress).toBe(100);
    });

    it("should check minimum quantity reached", () => {
      expect(isMinimumQuantityReached(10, 5)).toBe(true);
      expect(isMinimumQuantityReached(3, 5)).toBe(false);
    });
  });

  // ============================================================================
  // BULK DISCOUNT UTILITIES
  // ============================================================================

  describe("Bulk Discount Calculations", () => {
    it("should generate unique bulk discount IDs", () => {
      const id1 = generateBulkDiscountId();
      const id2 = generateBulkDiscountId();
      expect(id1).toMatch(/^bulk_/);
      expect(id2).toMatch(/^bulk_/);
      expect(id1).not.toBe(id2);
    });

    it("should calculate bulk discount price", () => {
      const price = calculateBulkDiscountPrice(1000, 15);
      expect(price).toBe(850);
    });

    it("should get applicable discount tier", () => {
      const tiers = [
        { minQuantity: 1, maxQuantity: 10, discountPercent: 5 },
        { minQuantity: 11, maxQuantity: 50, discountPercent: 10 },
        { minQuantity: 51, discountPercent: 15 },
      ];

      const tier1 = getApplicableDiscountTier(5, tiers);
      expect(tier1?.discountPercent).toBe(5);

      const tier2 = getApplicableDiscountTier(25, tiers);
      expect(tier2?.discountPercent).toBe(10);

      const tier3 = getApplicableDiscountTier(100, tiers);
      expect(tier3?.discountPercent).toBe(15);
    });

    it("should calculate bulk order total", () => {
      const total = calculateBulkOrderTotal(100, 50, 10);
      expect(total).toBe(4500);
    });
  });

  // ============================================================================
  // REFERRAL UTILITIES
  // ============================================================================

  describe("Referral Code Generation", () => {
    it("should generate unique referral codes", () => {
      const code1 = generateReferralCode();
      const code2 = generateReferralCode();
      expect(code1).toHaveLength(8);
      expect(code2).toHaveLength(8);
      expect(code1).not.toBe(code2);
    });

    it("should generate alphanumeric codes", () => {
      const code = generateReferralCode();
      expect(code).toMatch(/^[A-Z0-9]{8}$/);
    });
  });

  describe("Referral Commission Calculations", () => {
    it("should calculate referral commission", () => {
      const commission = calculateReferralCommission(1000, 5);
      expect(commission).toBe(50);
    });

    it("should handle Decimal amounts", () => {
      const commission = calculateReferralCommission(new Decimal("1000.50"), 10);
      expect(commission).toBe(100.05);
    });

    it("should check referral code validity", () => {
      const future = new Date(Date.now() + 86400000);
      expect(isReferralCodeValid(future, 5, 10)).toBe(true);

      const past = new Date(Date.now() - 1000);
      expect(isReferralCodeValid(past, 5, 10)).toBe(false);
    });

    it("should calculate referral earnings", () => {
      const commissions = [
        { amount: 50 },
        { amount: 75 },
        { amount: new Decimal("100.50") },
      ];
      const earnings = calculateReferralEarnings(commissions);
      expect(earnings).toBe(225.5);
    });

    it("should calculate referral conversion rate", () => {
      const rate = calculateReferralConversionRate(10, 100);
      expect(rate).toBe(10);
    });
  });

  // ============================================================================
  // SOCIAL SHARING UTILITIES
  // ============================================================================

  describe("Social Sharing", () => {
    it("should generate unique share tracking IDs", () => {
      const id1 = generateShareTrackingId();
      const id2 = generateShareTrackingId();
      expect(id1).toMatch(/^share_/);
      expect(id2).toMatch(/^share_/);
      expect(id1).not.toBe(id2);
    });

    it("should generate social share URLs", () => {
      const url = generateSocialShareUrl("deal-123", "facebook");
      expect(url).toContain("facebook.com");
      expect(url).toContain("deal-123");
    });

    it("should calculate social proof score", () => {
      const score = calculateSocialProofScore(50, 500, 75);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it("should format social proof message", () => {
      expect(formatSocialProofMessage(0, 0)).toBe("Be the first to join!");
      expect(formatSocialProofMessage(1, 5)).toBe("1 person joined this deal");
      expect(formatSocialProofMessage(10, 50)).toContain("10 people");
    });
  });

  // ============================================================================
  // COMMUNITY UTILITIES
  // ============================================================================

  describe("Community Management", () => {
    it("should generate unique community IDs", () => {
      const id1 = generateCommunityId();
      const id2 = generateCommunityId();
      expect(id1).toMatch(/^comm_/);
      expect(id2).toMatch(/^comm_/);
      expect(id1).not.toBe(id2);
    });

    it("should calculate community engagement rate", () => {
      const rate = calculateCommunityEngagementRate(50, 100);
      expect(rate).toBe(50);
    });

    it("should calculate community savings", () => {
      const deals = [
        { savings: 100 },
        { savings: 200 },
        { savings: new Decimal("150.50") },
      ];
      const savings = calculateCommunitySavings(deals);
      expect(savings).toBe(450.5);
    });
  });

  // ============================================================================
  // PARTICIPATION TRACKING
  // ============================================================================

  describe("Participation Tracking", () => {
    it("should calculate participation rate", () => {
      const rate = calculateParticipationRate(50, 200);
      expect(rate).toBe(25);
    });

    it("should get urgency level", () => {
      expect(getUrgencyLevel(1800)).toBe("high"); // 30 minutes
      expect(getUrgencyLevel(43200)).toBe("medium"); // 12 hours
      expect(getUrgencyLevel(172800)).toBe("low"); // 2 days
    });

    it("should format countdown timer", () => {
      expect(formatCountdownTimer(0)).toBe("Expired");
      expect(formatCountdownTimer(30)).toContain("s");
      expect(formatCountdownTimer(3600)).toContain("h");
      expect(formatCountdownTimer(86400)).toContain("d");
    });
  });

  // ============================================================================
  // ANALYTICS
  // ============================================================================

  describe("Analytics Calculations", () => {
    it("should calculate group deal conversion rate", () => {
      const rate = calculateGroupDealConversionRate(50, 1000);
      expect(rate).toBe(5);
    });

    it("should calculate average order value", () => {
      const aov = calculateGroupDealAOV(5000, 50);
      expect(aov).toBe(100);
    });

    it("should calculate engagement score", () => {
      const score = calculateEngagementScore(50, 500, 75, 20);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it("should determine deal performance level", () => {
      expect(determineDealPerformanceLevel(12, 75)).toBe("excellent");
      expect(determineDealPerformanceLevel(6, 55)).toBe("good");
      expect(determineDealPerformanceLevel(3, 35)).toBe("average");
      expect(determineDealPerformanceLevel(1, 20)).toBe("poor");
    });
  });

  // ============================================================================
  // VALIDATION SCHEMAS
  // ============================================================================

  describe("Validation Schemas", () => {
    it("should validate group deal creation", () => {
      const data = {
        productId: "prod-123",
        title: "Amazing Group Deal",
        description: "Join our group buying event",
        minimumQuantity: 5,
        basePrice: 1000,
        groupPrice: 800,
        discountPercent: 20,
        startTime: new Date(),
        endTime: new Date(Date.now() + 86400000),
        targetQuantity: 100,
      };
      const result = GroupDealCreationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should validate bulk discount creation", () => {
      const data = {
        productId: "prod-123",
        name: "Bulk Discount",
        tiers: [
          { minQuantity: 1, maxQuantity: 10, discountPercent: 5 },
          { minQuantity: 11, discountPercent: 10 },
        ],
      };
      const result = BulkDiscountCreationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should validate referral code generation", () => {
      const data = {
        referrerName: "John Doe",
        referrerEmail: "john@example.com",
        commissionPercent: 5,
        expiryDays: 90,
      };
      const result = ReferralCodeGenerationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should validate social share", () => {
      const data = {
        dealId: "deal-123",
        platform: "facebook",
        message: "Check out this amazing deal!",
      };
      const result = SocialShareSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should validate community creation", () => {
      const data = {
        name: "Barangay Buyers Club",
        description: "Community for group buying in our barangay",
        type: "barangay",
        barangay: "Barangay 1",
      };
      const result = CommunityCreationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });
});

