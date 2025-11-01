/**
 * Group Pricing & Social Commerce Utility Functions
 * Comprehensive utilities for group deals, bulk discounts, referrals, and social sharing
 */

import { Decimal } from "@prisma/client/runtime/library";

// ============================================================================
// GROUP DEAL UTILITIES
// ============================================================================

/**
 * Generate unique group deal ID
 */
export function generateGroupDealId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `deal_${timestamp}_${random}`;
}

/**
 * Calculate group deal discount
 */
export function calculateGroupDiscount(
  basePrice: number | Decimal,
  discountPercent: number
): number {
  const price = typeof basePrice === "object" ? basePrice.toNumber() : basePrice;
  return Math.round((price * (100 - discountPercent)) / 100 * 100) / 100;
}

/**
 * Calculate total savings for group deal
 */
export function calculateGroupSavings(
  basePrice: number | Decimal,
  groupPrice: number | Decimal,
  quantity: number
): number {
  const base = typeof basePrice === "object" ? basePrice.toNumber() : basePrice;
  const group = typeof groupPrice === "object" ? groupPrice.toNumber() : groupPrice;
  return Math.round((base - group) * quantity * 100) / 100;
}

/**
 * Get group deal status
 */
export function getGroupDealStatus(
  startTime: Date,
  endTime: Date,
  currentParticipants: number,
  targetQuantity: number,
  status: string
): string {
  if (status === "cancelled") return "cancelled";
  if (status === "completed") return "completed";

  const now = new Date();
  if (now < startTime) return "scheduled";
  if (now > endTime) return "expired";
  if (currentParticipants >= targetQuantity) return "completed";
  return "active";
}

/**
 * Check if group deal is active
 */
export function isGroupDealActive(startTime: Date, endTime: Date): boolean {
  const now = new Date();
  return now >= startTime && now <= endTime;
}

/**
 * Calculate time remaining for group deal
 */
export function getGroupDealTimeRemaining(endTime: Date): number {
  const now = new Date();
  const remaining = endTime.getTime() - now.getTime();
  return Math.max(0, Math.floor(remaining / 1000)); // seconds
}

/**
 * Calculate progress percentage
 */
export function calculateGroupProgress(
  currentParticipants: number,
  targetQuantity: number
): number {
  if (targetQuantity === 0) return 0;
  return Math.min(100, Math.round((currentParticipants / targetQuantity) * 100));
}

/**
 * Check if minimum quantity reached
 */
export function isMinimumQuantityReached(
  currentQuantity: number,
  minimumQuantity: number
): boolean {
  return currentQuantity >= minimumQuantity;
}

// ============================================================================
// BULK DISCOUNT UTILITIES
// ============================================================================

/**
 * Generate bulk discount ID
 */
export function generateBulkDiscountId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `bulk_${timestamp}_${random}`;
}

/**
 * Calculate bulk discount price
 */
export function calculateBulkDiscountPrice(
  basePrice: number | Decimal,
  discountPercent: number
): number {
  const price = typeof basePrice === "object" ? basePrice.toNumber() : basePrice;
  return Math.round((price * (100 - discountPercent)) / 100 * 100) / 100;
}

/**
 * Get applicable discount tier
 */
export function getApplicableDiscountTier(
  quantity: number,
  tiers: Array<{ minQuantity: number; maxQuantity?: number; discountPercent: number }>
): { minQuantity: number; maxQuantity?: number; discountPercent: number } | null {
  for (const tier of tiers.sort((a, b) => b.minQuantity - a.minQuantity)) {
    if (quantity >= tier.minQuantity) {
      if (!tier.maxQuantity || quantity <= tier.maxQuantity) {
        return tier;
      }
    }
  }
  return null;
}

/**
 * Calculate bulk order total
 */
export function calculateBulkOrderTotal(
  basePrice: number | Decimal,
  quantity: number,
  discountPercent: number
): number {
  const price = typeof basePrice === "object" ? basePrice.toNumber() : basePrice;
  const discountedPrice = calculateBulkDiscountPrice(price, discountPercent);
  return Math.round(discountedPrice * quantity * 100) / 100;
}

// ============================================================================
// REFERRAL UTILITIES
// ============================================================================

/**
 * Generate unique referral code
 */
export function generateReferralCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Calculate referral commission
 */
export function calculateReferralCommission(
  orderAmount: number | Decimal,
  commissionPercent: number
): number {
  const amount = typeof orderAmount === "object" ? orderAmount.toNumber() : orderAmount;
  return Math.round((amount * commissionPercent) / 100 * 100) / 100;
}

/**
 * Check if referral code is valid
 */
export function isReferralCodeValid(
  expiryDate: Date,
  redemptionCount: number,
  maxRedemptions?: number
): boolean {
  const now = new Date();
  if (now > expiryDate) return false;
  if (maxRedemptions && redemptionCount >= maxRedemptions) return false;
  return true;
}

/**
 * Calculate referral earnings
 */
export function calculateReferralEarnings(
  commissions: Array<{ amount: number | Decimal }>
): number {
  return commissions.reduce((total, commission) => {
    const amount = typeof commission.amount === "object" 
      ? commission.amount.toNumber() 
      : commission.amount;
    return total + amount;
  }, 0);
}

/**
 * Calculate referral conversion rate
 */
export function calculateReferralConversionRate(
  redemptions: number,
  totalShares: number
): number {
  if (totalShares === 0) return 0;
  return Math.round((redemptions / totalShares) * 100 * 100) / 100;
}

// ============================================================================
// SOCIAL SHARING UTILITIES
// ============================================================================

/**
 * Generate share tracking ID
 */
export function generateShareTrackingId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `share_${timestamp}_${random}`;
}

/**
 * Generate social share URL
 */
export function generateSocialShareUrl(
  dealId: string,
  platform: string,
  baseUrl: string = "https://ecommerce.ph"
): string {
  const shareUrl = `${baseUrl}/group-deals/${dealId}`;
  const encodedUrl = encodeURIComponent(shareUrl);

  switch (platform.toLowerCase()) {
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case "tiktok":
      return `https://www.tiktok.com/share?url=${encodedUrl}`;
    case "instagram":
      return `https://www.instagram.com/?url=${encodedUrl}`;
    case "whatsapp":
      return `https://wa.me/?text=${encodedUrl}`;
    case "telegram":
      return `https://t.me/share/url?url=${encodedUrl}`;
    default:
      return shareUrl;
  }
}

/**
 * Calculate social proof score
 */
export function calculateSocialProofScore(
  participantCount: number,
  totalQuantity: number,
  progressPercent: number
): number {
  const participantScore = Math.min(participantCount / 10, 30);
  const quantityScore = Math.min(totalQuantity / 100, 30);
  const progressScore = progressPercent / 100 * 40;
  return Math.round((participantScore + quantityScore + progressScore) * 100) / 100;
}

/**
 * Format social proof message
 */
export function formatSocialProofMessage(
  participantCount: number,
  totalQuantity: number
): string {
  if (participantCount === 0) return "Be the first to join!";
  if (participantCount === 1) return "1 person joined this deal";
  return `${participantCount} people joined this deal - ${totalQuantity} items ordered`;
}

// ============================================================================
// COMMUNITY UTILITIES
// ============================================================================

/**
 * Generate community ID
 */
export function generateCommunityId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `comm_${timestamp}_${random}`;
}

/**
 * Calculate community engagement rate
 */
export function calculateCommunityEngagementRate(
  activeMembers: number,
  totalMembers: number
): number {
  if (totalMembers === 0) return 0;
  return Math.round((activeMembers / totalMembers) * 100 * 100) / 100;
}

/**
 * Calculate community savings
 */
export function calculateCommunitySavings(
  deals: Array<{ savings: number | Decimal }>
): number {
  return deals.reduce((total, deal) => {
    const savings = typeof deal.savings === "object" 
      ? deal.savings.toNumber() 
      : deal.savings;
    return total + savings;
  }, 0);
}

// ============================================================================
// PARTICIPATION TRACKING UTILITIES
// ============================================================================

/**
 * Calculate participation rate
 */
export function calculateParticipationRate(
  participants: number,
  targetAudience: number
): number {
  if (targetAudience === 0) return 0;
  return Math.round((participants / targetAudience) * 100 * 100) / 100;
}

/**
 * Get urgency level based on time remaining
 */
export function getUrgencyLevel(secondsRemaining: number): string {
  if (secondsRemaining <= 3600) return "high"; // 1 hour
  if (secondsRemaining <= 86400) return "medium"; // 24 hours
  return "low";
}

/**
 * Format countdown timer
 */
export function formatCountdownTimer(secondsRemaining: number): string {
  if (secondsRemaining <= 0) return "Expired";

  const days = Math.floor(secondsRemaining / 86400);
  const hours = Math.floor((secondsRemaining % 86400) / 3600);
  const minutes = Math.floor((secondsRemaining % 3600) / 60);
  const seconds = secondsRemaining % 60;

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

// ============================================================================
// ANALYTICS UTILITIES
// ============================================================================

/**
 * Calculate group deal conversion rate
 */
export function calculateGroupDealConversionRate(
  participants: number,
  views: number
): number {
  if (views === 0) return 0;
  return Math.round((participants / views) * 100 * 100) / 100;
}

/**
 * Calculate average order value for group deal
 */
export function calculateGroupDealAOV(
  totalRevenue: number | Decimal,
  totalOrders: number
): number {
  if (totalOrders === 0) return 0;
  const revenue = typeof totalRevenue === "object" 
    ? totalRevenue.toNumber() 
    : totalRevenue;
  return Math.round((revenue / totalOrders) * 100) / 100;
}

/**
 * Calculate engagement score
 */
export function calculateEngagementScore(
  participantCount: number,
  totalQuantity: number,
  progressPercent: number,
  socialShares: number
): number {
  const participantScore = Math.min(participantCount / 5, 25);
  const quantityScore = Math.min(totalQuantity / 50, 25);
  const progressScore = progressPercent / 100 * 30;
  const shareScore = Math.min(socialShares / 10, 20);
  return Math.round((participantScore + quantityScore + progressScore + shareScore) * 100) / 100;
}

/**
 * Determine deal performance level
 */
export function determineDealPerformanceLevel(
  conversionRate: number,
  engagementScore: number
): string {
  if (conversionRate >= 10 && engagementScore >= 70) return "excellent";
  if (conversionRate >= 5 && engagementScore >= 50) return "good";
  if (conversionRate >= 2 && engagementScore >= 30) return "average";
  return "poor";
}

