/**
 * Discount & Promotion Components
 * Phase 26.2: Discount & Promotion Management
 *
 * Components for managing discounts, coupons, and flash sales.
 */

// Phase 26.2.1: Discount Management System
export { DiscountManager } from './discount-manager';

// Phase 26.2.2: Coupon Code System
export { CouponManager } from './coupon-manager';

// Phase 26.2.3: Flash Sale System
export { FlashSaleManager } from './flash-sale-manager';

// Phase 26.2.4: Promotion Campaign Scheduler
export { PromotionScheduler } from './promotion-scheduler';

// Phase 26.2.5: Discount Rules Engine
export { DiscountRulesEngine } from './discount-rules-engine';

// Phase 26.2.6: Promotion Analytics Dashboard
export { PromotionAnalytics } from './promotion-analytics';

// Re-export types
export type { Discount } from './discount-manager';
export type { Coupon } from './coupon-manager';
export type { FlashSale } from './flash-sale-manager';
export type { ScheduledPromotion } from './promotion-scheduler';
export type { DiscountRule, DiscountCondition, DiscountAction } from './discount-rules-engine';
export type { PromotionMetrics, PromotionPerformance } from './promotion-analytics';

