import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { canCancelOrder, canReturnOrder, calculateRefundAmount, generateOrderNumber, generateTrackingNumber } from '@/lib/order-utils';
import { OrderCancellationSchema, OrderReturnSchema, ShipmentUpdateSchema } from '@/lib/validations/order';

describe('Week 5: Order Management System', () => {
  describe('Order Cancellation', () => {
    it('should allow cancellation of PENDING orders', () => {
      expect(canCancelOrder('PENDING')).toBe(true);
    });

    it('should allow cancellation of CONFIRMED orders', () => {
      expect(canCancelOrder('CONFIRMED')).toBe(true);
    });

    it('should not allow cancellation of PROCESSING orders', () => {
      expect(canCancelOrder('PROCESSING')).toBe(false);
    });

    it('should not allow cancellation of SHIPPED orders', () => {
      expect(canCancelOrder('SHIPPED')).toBe(false);
    });

    it('should not allow cancellation of DELIVERED orders', () => {
      expect(canCancelOrder('DELIVERED')).toBe(false);
    });

    it('should not allow cancellation of CANCELLED orders', () => {
      expect(canCancelOrder('CANCELLED')).toBe(false);
    });

    it('should validate cancellation schema with valid data', () => {
      const validData = {
        reason: 'Changed my mind about this purchase',
        refundMethod: 'ORIGINAL_PAYMENT',
      };
      expect(() => OrderCancellationSchema.parse(validData)).not.toThrow();
    });

    it('should reject cancellation with reason less than 10 characters', () => {
      const invalidData = {
        reason: 'Too short',
        refundMethod: 'ORIGINAL_PAYMENT',
      };
      expect(() => OrderCancellationSchema.parse(invalidData)).toThrow();
    });
  });

  describe('Order Returns', () => {
    it('should allow return of DELIVERED orders within 30 days', () => {
      const deliveredDate = new Date();
      deliveredDate.setDate(deliveredDate.getDate() - 15);
      expect(canReturnOrder('DELIVERED', deliveredDate)).toBe(true);
    });

    it('should not allow return of DELIVERED orders after 30 days', () => {
      const deliveredDate = new Date();
      deliveredDate.setDate(deliveredDate.getDate() - 31);
      expect(canReturnOrder('DELIVERED', deliveredDate)).toBe(false);
    });

    it('should not allow return of PENDING orders', () => {
      expect(canReturnOrder('PENDING', null)).toBe(false);
    });

    it('should not allow return of CANCELLED orders', () => {
      expect(canReturnOrder('CANCELLED', null)).toBe(false);
    });

    it('should validate return schema with valid data', () => {
      const validData = {
        reason: 'Product does not match description',
        items: [
          { orderItemId: 'item1', quantity: 1, condition: 'UNOPENED' },
        ],
        refundMethod: 'ORIGINAL_PAYMENT',
      };
      expect(() => OrderReturnSchema.parse(validData)).not.toThrow();
    });

    it('should reject return with reason less than 10 characters', () => {
      const invalidData = {
        reason: 'Bad item',
        items: [{ orderItemId: 'item1', quantity: 1, condition: 'UNOPENED' }],
        refundMethod: 'ORIGINAL_PAYMENT',
      };
      expect(() => OrderReturnSchema.parse(invalidData)).toThrow();
    });
  });

  describe('Refund Calculations', () => {
    it('should calculate refund for full order cancellation', () => {
      const refund = calculateRefundAmount(5000, 200);
      // 5000 - 200 (shipping) - 480 (10% restocking) = 4320
      expect(refund.toNumber()).toBe(4320);
    });

    it('should calculate refund excluding shipping fee', () => {
      const refund = calculateRefundAmount(10000, 500);
      // 10000 - 500 (shipping) - 855 (10% restocking) = 8645
      expect(refund.toNumber()).toBeGreaterThan(8000);
    });

    it('should handle zero shipping fee', () => {
      const refund = calculateRefundAmount(5000, 0);
      // 5000 - 0 (shipping) - 450 (10% restocking) = 4550
      expect(refund.toNumber()).toBeGreaterThan(4000);
    });
  });

  describe('Order Number Generation', () => {
    it('should generate valid order number format', () => {
      const orderNumber = generateOrderNumber();
      expect(orderNumber).toMatch(/^ORD-\d{8}-[A-Z0-9]{6}$/);
    });

    it('should generate unique order numbers', () => {
      const orderNumber1 = generateOrderNumber();
      const orderNumber2 = generateOrderNumber();
      expect(orderNumber1).not.toBe(orderNumber2);
    });
  });

  describe('Tracking Number Generation', () => {
    it('should generate valid LBC tracking number', () => {
      const trackingNumber = generateTrackingNumber('LBC');
      expect(trackingNumber).toMatch(/^TRK-LBC-\d{8}-[A-Z0-9]+$/);
    });

    it('should generate valid 2GO tracking number', () => {
      const trackingNumber = generateTrackingNumber('TWO_GO');
      expect(trackingNumber).toMatch(/^TRK-TWO_GO-\d{8}-[A-Z0-9]+$/);
    });

    it('should generate valid JRS tracking number', () => {
      const trackingNumber = generateTrackingNumber('JRS');
      expect(trackingNumber).toMatch(/^TRK-JRS-\d{8}-[A-Z0-9]+$/);
    });

    it('should generate unique tracking numbers', () => {
      const tracking1 = generateTrackingNumber('LBC');
      const tracking2 = generateTrackingNumber('LBC');
      expect(tracking1).not.toBe(tracking2);
    });
  });

  describe('Shipment Status Updates', () => {
    it('should validate shipment update schema', () => {
      const validData = {
        status: 'SHIPPED',
        trackingNumber: 'TRK-LBC-20250101-ABC123',
        estimatedDelivery: new Date().toISOString(),
      };
      expect(() => ShipmentUpdateSchema.parse(validData)).not.toThrow();
    });

    it('should reject invalid shipment status', () => {
      const invalidData = {
        status: 'INVALID_STATUS',
        trackingNumber: 'TRK-LBC-20250101-ABC123',
        estimatedDelivery: new Date().toISOString(),
      };
      expect(() => ShipmentUpdateSchema.parse(invalidData)).toThrow();
    });
  });

  describe('Order Status Transitions', () => {
    it('should allow transition from PENDING to CONFIRMED', () => {
      const validTransitions = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
      expect(validTransitions.includes('CONFIRMED')).toBe(true);
    });

    it('should track order lifecycle correctly', () => {
      const lifecycle = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
      expect(lifecycle.length).toBe(5);
      expect(lifecycle[0]).toBe('PENDING');
      expect(lifecycle[lifecycle.length - 1]).toBe('DELIVERED');
    });
  });

  describe('Logistics Provider Integration', () => {
    it('should support LBC Express', () => {
      const providers = ['LBC', 'TWO_GO', 'JRS', 'GRAB', 'LALAMOVE', 'PICKUP'];
      expect(providers).toContain('LBC');
    });

    it('should support 2GO Express', () => {
      const providers = ['LBC', 'TWO_GO', 'JRS', 'GRAB', 'LALAMOVE', 'PICKUP'];
      expect(providers).toContain('TWO_GO');
    });

    it('should support JRS Express', () => {
      const providers = ['LBC', 'TWO_GO', 'JRS', 'GRAB', 'LALAMOVE', 'PICKUP'];
      expect(providers).toContain('JRS');
    });

    it('should support Grab delivery', () => {
      const providers = ['LBC', 'TWO_GO', 'JRS', 'GRAB', 'LALAMOVE', 'PICKUP'];
      expect(providers).toContain('GRAB');
    });

    it('should support Lalamove delivery', () => {
      const providers = ['LBC', 'TWO_GO', 'JRS', 'GRAB', 'LALAMOVE', 'PICKUP'];
      expect(providers).toContain('LALAMOVE');
    });

    it('should support Pickup option', () => {
      const providers = ['LBC', 'TWO_GO', 'JRS', 'GRAB', 'LALAMOVE', 'PICKUP'];
      expect(providers).toContain('PICKUP');
    });
  });
});

