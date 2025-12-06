/**
 * Inventory Components Unit Tests
 * Phase 26.1.1: Real-time Inventory Tracking & Low Stock Alerts
 *
 * Tests for component helper functions and status utilities.
 * Note: React component rendering tests require @testing-library/react.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getInventoryStatus,
  getStatusLabel,
  getStatusColorClass
} from '@/components/inventory/inventory-status-badge';

describe('Phase 26.1.1: Inventory Component Helpers', () => {
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

    it('should handle edge case where threshold is 0', () => {
      expect(getInventoryStatus(0, 0)).toBe('OUT_OF_STOCK');
      expect(getInventoryStatus(1, 0)).toBe('ACTIVE');
    });

    it('should handle large stock values', () => {
      expect(getInventoryStatus(10000, 100)).toBe('ACTIVE');
      expect(getInventoryStatus(10000, 100, 5000)).toBe('OVERSTOCK');
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

  describe('getStatusColorClass', () => {
    it('should return green color class for ACTIVE status', () => {
      const colorClass = getStatusColorClass('ACTIVE');
      expect(colorClass).toContain('green');
    });

    it('should return yellow color class for LOW_STOCK status', () => {
      const colorClass = getStatusColorClass('LOW_STOCK');
      expect(colorClass).toContain('yellow');
    });

    it('should return red color class for OUT_OF_STOCK status', () => {
      const colorClass = getStatusColorClass('OUT_OF_STOCK');
      expect(colorClass).toContain('red');
    });

    it('should return blue color class for OVERSTOCK status', () => {
      const colorClass = getStatusColorClass('OVERSTOCK');
      expect(colorClass).toContain('blue');
    });

    it('should return gray color class for DISCONTINUED status', () => {
      const colorClass = getStatusColorClass('DISCONTINUED');
      expect(colorClass).toContain('gray');
    });
  });

  describe('Stock Level Calculations', () => {
    it('should calculate percentage correctly', () => {
      // Test percentage calculation logic
      const currentStock = 50;
      const maxStock = 100;
      const percentage = Math.min(100, (currentStock / maxStock) * 100);
      expect(percentage).toBe(50);
    });

    it('should cap percentage at 100', () => {
      const currentStock = 150;
      const maxStock = 100;
      const percentage = Math.min(100, (currentStock / maxStock) * 100);
      expect(percentage).toBe(100);
    });

    it('should calculate available stock correctly', () => {
      const currentStock = 50;
      const reservedStock = 10;
      const availableStock = Math.max(0, currentStock - reservedStock);
      expect(availableStock).toBe(40);
    });

    it('should not return negative available stock', () => {
      const currentStock = 10;
      const reservedStock = 20;
      const availableStock = Math.max(0, currentStock - reservedStock);
      expect(availableStock).toBe(0);
    });

    it('should use currentStock as effectiveMax when it exceeds maxStock', () => {
      const currentStock = 150;
      const maxStock = 100;
      const effectiveMax = Math.max(maxStock, currentStock, 1);
      expect(effectiveMax).toBe(150);
    });

    it('should use at least 1 as effectiveMax to avoid division by zero', () => {
      const currentStock = 0;
      const maxStock = 0;
      const effectiveMax = Math.max(maxStock, currentStock, 1);
      expect(effectiveMax).toBe(1);
    });
  });

  describe('Alert Severity Calculations', () => {
    const getSeverity = (quantity: number, threshold: number): 'critical' | 'warning' | 'low' => {
      if (quantity <= 0) return 'critical';
      if (quantity <= threshold * 0.5) return 'critical';
      if (quantity <= threshold) return 'warning';
      return 'low';
    };

    it('should return critical when quantity is 0', () => {
      expect(getSeverity(0, 10)).toBe('critical');
    });

    it('should return critical when quantity is below half threshold', () => {
      expect(getSeverity(4, 10)).toBe('critical');
    });

    it('should return warning when quantity is at threshold', () => {
      expect(getSeverity(10, 10)).toBe('warning');
    });

    it('should return warning when quantity is between half and full threshold', () => {
      expect(getSeverity(7, 10)).toBe('warning');
    });

    it('should return low when quantity is above threshold', () => {
      expect(getSeverity(50, 10)).toBe('low');
    });
  });
});

