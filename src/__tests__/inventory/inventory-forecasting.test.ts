/**
 * Inventory Forecasting Unit Tests
 * Phase 26.1.5: Inventory Forecasting & Reorder Points
 * 
 * Tests for reorder suggestions and forecast calculations.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { calculateReorderQuantity, calculateSafetyStock, needsReorder } from '@/lib/inventory-utils';

// Mock dependencies
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    vendor: { findFirst: vi.fn() },
    inventoryItem: { findMany: vi.fn() },
    inventoryMovement: { findMany: vi.fn() },
    productVariant: { findUnique: vi.fn() },
  },
}));

vi.mock('@/lib/auth', () => ({
  authOptions: {},
}));

import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

describe('Phase 26.1.5: Inventory Forecasting', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('calculateSafetyStock', () => {
    it('should calculate safety stock based on z-score, std dev, and lead time', () => {
      // calculateSafetyStock(zScore, standardDeviation, leadTimeDays)
      const result = calculateSafetyStock(1.65, 10, 7);
      expect(result).toBeGreaterThan(0);
    });

    it('should return 0 for zero standard deviation', () => {
      const result = calculateSafetyStock(1.65, 0, 7);
      expect(result).toBe(0);
    });

    it('should increase with higher standard deviation', () => {
      const low = calculateSafetyStock(1.65, 5, 7);
      const high = calculateSafetyStock(1.65, 20, 7);
      expect(high).toBeGreaterThan(low);
    });
  });

  describe('calculateReorderQuantity', () => {
    it('should calculate reorder quantity', () => {
      // calculateReorderQuantity(averageDailyDemand, leadTimeDays, safetyStock)
      const result = calculateReorderQuantity(10, 7, 50);
      expect(result).toBeGreaterThan(0);
    });

    it('should return higher quantity with higher daily demand', () => {
      const lowDemand = calculateReorderQuantity(5, 7, 50);
      const highDemand = calculateReorderQuantity(20, 7, 50);
      expect(highDemand).toBeGreaterThan(lowDemand);
    });
  });

  describe('needsReorder', () => {
    it('should return true when stock is below reorder point', () => {
      expect(needsReorder(10, 50, 20)).toBe(true);
    });

    it('should return false when stock is above reorder point', () => {
      expect(needsReorder(100, 50, 20)).toBe(false);
    });

    it('should return true when stock equals reorder point', () => {
      expect(needsReorder(50, 50, 20)).toBe(true);
    });
  });

  describe('GET /api/inventory/reorder-suggestions', () => {
    it('should return 401 when not authenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const { GET } = await import('@/app/api/inventory/reorder-suggestions/route');
      const request = new NextRequest('http://localhost/api/inventory/reorder-suggestions');
      const response = await GET(request);

      expect(response.status).toBe(401);
    });

    it('should return suggestions for authenticated user', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: 'user-1', role: 'ADMIN' },
      } as any);

      vi.mocked(prisma.inventoryItem.findMany).mockResolvedValue([]);

      const { GET } = await import('@/app/api/inventory/reorder-suggestions/route');
      const request = new NextRequest('http://localhost/api/inventory/reorder-suggestions');
      const response = await GET(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.suggestions).toBeDefined();
    });
  });

  describe('GET /api/inventory/forecast', () => {
    it('should return 401 when not authenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const { GET } = await import('@/app/api/inventory/forecast/route');
      const request = new NextRequest('http://localhost/api/inventory/forecast?variantId=var-1');
      const response = await GET(request);

      expect(response.status).toBe(401);
    });

    it('should return 400 when variantId is missing', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: 'user-1', role: 'ADMIN' },
      } as any);

      const { GET } = await import('@/app/api/inventory/forecast/route');
      const request = new NextRequest('http://localhost/api/inventory/forecast');
      const response = await GET(request);

      expect(response.status).toBe(400);
    });

    it('should return 404 when variant not found', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: 'user-1', role: 'ADMIN' },
      } as any);

      vi.mocked(prisma.productVariant.findUnique).mockResolvedValue(null);

      const { GET } = await import('@/app/api/inventory/forecast/route');
      const request = new NextRequest('http://localhost/api/inventory/forecast?variantId=var-1');
      const response = await GET(request);

      expect(response.status).toBe(404);
    });
  });
});

