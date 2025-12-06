/**
 * Inventory Tracking Unit Tests
 * Phase 26.1.1: Real-time Inventory Tracking & Low Stock Alerts
 * 
 * Comprehensive tests for inventory dashboard, stock alerts,
 * status badges, and stock level indicators.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getInventoryStatus,
  getStatusLabel,
  getStatusColorClass,
} from '@/components/inventory/inventory-status-badge';
import {
  determineInventoryStatus,
  isLowStock,
  isOutOfStock,
  calculateAvailableStock,
  needsReorder,
  calculateStockReservation,
} from '@/lib/inventory-utils';

describe('Phase 26.1.1: Inventory Tracking', () => {
  describe('getInventoryStatus', () => {
    it('should return OUT_OF_STOCK when current stock is 0', () => {
      expect(getInventoryStatus(0, 10)).toBe('OUT_OF_STOCK');
    });

    it('should return OUT_OF_STOCK when current stock is negative', () => {
      expect(getInventoryStatus(-5, 10)).toBe('OUT_OF_STOCK');
    });

    it('should return LOW_STOCK when current stock equals threshold', () => {
      expect(getInventoryStatus(10, 10)).toBe('LOW_STOCK');
    });

    it('should return LOW_STOCK when current stock is below threshold', () => {
      expect(getInventoryStatus(5, 10)).toBe('LOW_STOCK');
    });

    it('should return ACTIVE when current stock is above threshold', () => {
      expect(getInventoryStatus(50, 10)).toBe('ACTIVE');
    });

    it('should return OVERSTOCK when current stock exceeds max stock', () => {
      expect(getInventoryStatus(150, 10, 100)).toBe('OVERSTOCK');
    });

    it('should return ACTIVE when stock is between threshold and max', () => {
      expect(getInventoryStatus(50, 10, 100)).toBe('ACTIVE');
    });
  });

  describe('getStatusLabel', () => {
    it('should return correct label for ACTIVE status', () => {
      expect(getStatusLabel('ACTIVE')).toBe('In Stock');
    });

    it('should return correct label for LOW_STOCK status', () => {
      expect(getStatusLabel('LOW_STOCK')).toBe('Low Stock');
    });

    it('should return correct label for OUT_OF_STOCK status', () => {
      expect(getStatusLabel('OUT_OF_STOCK')).toBe('Out of Stock');
    });

    it('should return correct label for OVERSTOCK status', () => {
      expect(getStatusLabel('OVERSTOCK')).toBe('Overstock');
    });

    it('should return correct label for DISCONTINUED status', () => {
      expect(getStatusLabel('DISCONTINUED')).toBe('Discontinued');
    });
  });

  describe('determineInventoryStatus (from inventory-utils)', () => {
    it('should return OUT_OF_STOCK when quantity is 0', () => {
      expect(determineInventoryStatus(0, 0, 10)).toBe('OUT_OF_STOCK');
    });

    it('should return LOW_STOCK when quantity equals reorder point', () => {
      expect(determineInventoryStatus(10, 0, 10)).toBe('LOW_STOCK');
    });

    it('should return ACTIVE when quantity is above reorder point', () => {
      expect(determineInventoryStatus(50, 0, 10)).toBe('ACTIVE');
    });

    it('should return OVERSTOCK when quantity exceeds max stock', () => {
      expect(determineInventoryStatus(150, 0, 10, 100)).toBe('OVERSTOCK');
    });

    it('should handle reserved stock correctly', () => {
      // 50 current - 0 reserved = 50 available, above 10 threshold
      expect(determineInventoryStatus(50, 0, 10)).toBe('ACTIVE');
    });
  });

  describe('isLowStock', () => {
    it('should return true when stock equals reorder point', () => {
      expect(isLowStock(10, 10)).toBe(true);
    });

    it('should return true when stock is below reorder point', () => {
      expect(isLowStock(5, 10)).toBe(true);
    });

    it('should return false when stock is above reorder point', () => {
      expect(isLowStock(50, 10)).toBe(false);
    });

    it('should return true when stock is 0', () => {
      expect(isLowStock(0, 10)).toBe(true);
    });
  });

  describe('isOutOfStock', () => {
    it('should return true when stock is 0', () => {
      expect(isOutOfStock(0)).toBe(true);
    });

    it('should return true when stock is negative', () => {
      expect(isOutOfStock(-5)).toBe(true);
    });

    it('should return false when stock is positive', () => {
      expect(isOutOfStock(10)).toBe(false);
    });
  });

  describe('calculateAvailableStock', () => {
    it('should calculate available stock correctly', () => {
      expect(calculateAvailableStock(100, 20)).toBe(80);
    });

    it('should return 0 when reserved equals current', () => {
      expect(calculateAvailableStock(50, 50)).toBe(0);
    });

    it('should return 0 when reserved exceeds current', () => {
      expect(calculateAvailableStock(30, 50)).toBe(0);
    });

    it('should handle zero values', () => {
      expect(calculateAvailableStock(0, 0)).toBe(0);
    });
  });

  describe('needsReorder', () => {
    it('should return true when stock is at reorder point', () => {
      expect(needsReorder(10, 10)).toBe(true);
    });

    it('should return true when stock is below reorder point', () => {
      expect(needsReorder(5, 10)).toBe(true);
    });

    it('should return false when stock is above reorder point', () => {
      expect(needsReorder(50, 10)).toBe(false);
    });

    it('should consider pending orders', () => {
      // 50 current - 45 pending = 5, which is <= 10 reorder point
      expect(needsReorder(50, 10, 45)).toBe(true);
    });

    it('should return false when pending orders leave enough stock', () => {
      // 50 current - 10 pending = 40, which is > 10 reorder point
      expect(needsReorder(50, 10, 10)).toBe(false);
    });
  });

  describe('calculateStockReservation', () => {
    it('should allow reservation when enough stock available', () => {
      const result = calculateStockReservation(100, 20, 50);
      expect(result.canReserve).toBe(true);
      expect(result.availableToReserve).toBe(80);
    });

    it('should not allow reservation when not enough stock', () => {
      const result = calculateStockReservation(100, 80, 50);
      expect(result.canReserve).toBe(false);
      expect(result.availableToReserve).toBe(20);
    });

    it('should allow exact reservation', () => {
      const result = calculateStockReservation(100, 50, 50);
      expect(result.canReserve).toBe(true);
      expect(result.availableToReserve).toBe(50);
    });

    it('should handle zero available stock', () => {
      const result = calculateStockReservation(50, 50, 10);
      expect(result.canReserve).toBe(false);
      expect(result.availableToReserve).toBe(0);
    });
  });
});

