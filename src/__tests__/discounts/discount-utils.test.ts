/**
 * Discount Utility Functions Tests
 * Phase 26.2: Discount & Promotion Management
 * 
 * Tests for discount calculation and validation utilities.
 */

import { describe, it, expect } from 'vitest';

// Discount calculation utilities
function calculatePercentageDiscount(price: number, percent: number): number {
  return Math.round(price * (percent / 100) * 100) / 100;
}

function calculateFixedDiscount(price: number, amount: number): number {
  return Math.max(0, price - amount);
}

function applyMaxDiscount(discount: number, maxDiscount?: number): number {
  if (maxDiscount === undefined) return discount;
  return Math.min(discount, maxDiscount);
}

function isDiscountValid(
  startDate: Date,
  endDate: Date,
  isActive: boolean
): boolean {
  const now = new Date();
  return isActive && startDate <= now && endDate >= now;
}

function isCouponExhausted(usageCount: number, usageLimit?: number): boolean {
  if (usageLimit === undefined) return false;
  return usageCount >= usageLimit;
}

function calculateFinalPrice(
  originalPrice: number,
  discountType: 'PERCENTAGE' | 'FIXED',
  discountValue: number,
  maxDiscount?: number
): number {
  let discount: number;
  
  if (discountType === 'PERCENTAGE') {
    discount = calculatePercentageDiscount(originalPrice, discountValue);
  } else {
    discount = discountValue;
  }
  
  discount = applyMaxDiscount(discount, maxDiscount);
  return Math.max(0, originalPrice - discount);
}

function generateCouponCode(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

describe('Discount Calculation Utilities', () => {
  describe('calculatePercentageDiscount', () => {
    it('should calculate 10% discount correctly', () => {
      expect(calculatePercentageDiscount(1000, 10)).toBe(100);
    });

    it('should calculate 25% discount correctly', () => {
      expect(calculatePercentageDiscount(1000, 25)).toBe(250);
    });

    it('should handle decimal prices', () => {
      expect(calculatePercentageDiscount(99.99, 10)).toBe(10);
    });

    it('should return 0 for 0% discount', () => {
      expect(calculatePercentageDiscount(1000, 0)).toBe(0);
    });
  });

  describe('calculateFixedDiscount', () => {
    it('should subtract fixed amount from price', () => {
      expect(calculateFixedDiscount(1000, 200)).toBe(800);
    });

    it('should not go below 0', () => {
      expect(calculateFixedDiscount(100, 200)).toBe(0);
    });

    it('should handle exact amount', () => {
      expect(calculateFixedDiscount(500, 500)).toBe(0);
    });
  });

  describe('applyMaxDiscount', () => {
    it('should cap discount at max', () => {
      expect(applyMaxDiscount(500, 200)).toBe(200);
    });

    it('should return original if below max', () => {
      expect(applyMaxDiscount(100, 200)).toBe(100);
    });

    it('should return original if no max', () => {
      expect(applyMaxDiscount(500, undefined)).toBe(500);
    });
  });

  describe('isDiscountValid', () => {
    it('should return true for active discount within date range', () => {
      const start = new Date(Date.now() - 86400000);
      const end = new Date(Date.now() + 86400000);
      expect(isDiscountValid(start, end, true)).toBe(true);
    });

    it('should return false for inactive discount', () => {
      const start = new Date(Date.now() - 86400000);
      const end = new Date(Date.now() + 86400000);
      expect(isDiscountValid(start, end, false)).toBe(false);
    });

    it('should return false for expired discount', () => {
      const start = new Date(Date.now() - 86400000 * 2);
      const end = new Date(Date.now() - 86400000);
      expect(isDiscountValid(start, end, true)).toBe(false);
    });

    it('should return false for future discount', () => {
      const start = new Date(Date.now() + 86400000);
      const end = new Date(Date.now() + 86400000 * 2);
      expect(isDiscountValid(start, end, true)).toBe(false);
    });
  });

  describe('isCouponExhausted', () => {
    it('should return true when usage equals limit', () => {
      expect(isCouponExhausted(100, 100)).toBe(true);
    });

    it('should return true when usage exceeds limit', () => {
      expect(isCouponExhausted(101, 100)).toBe(true);
    });

    it('should return false when usage below limit', () => {
      expect(isCouponExhausted(50, 100)).toBe(false);
    });

    it('should return false when no limit', () => {
      expect(isCouponExhausted(1000, undefined)).toBe(false);
    });
  });

  describe('calculateFinalPrice', () => {
    it('should apply percentage discount', () => {
      expect(calculateFinalPrice(1000, 'PERCENTAGE', 20)).toBe(800);
    });

    it('should apply fixed discount', () => {
      expect(calculateFinalPrice(1000, 'FIXED', 200)).toBe(800);
    });

    it('should respect max discount for percentage', () => {
      expect(calculateFinalPrice(1000, 'PERCENTAGE', 50, 200)).toBe(800);
    });
  });

  describe('generateCouponCode', () => {
    it('should generate code of specified length', () => {
      expect(generateCouponCode(8).length).toBe(8);
      expect(generateCouponCode(12).length).toBe(12);
    });

    it('should only contain uppercase letters and numbers', () => {
      const code = generateCouponCode(100);
      expect(/^[A-Z0-9]+$/.test(code)).toBe(true);
    });
  });
});

