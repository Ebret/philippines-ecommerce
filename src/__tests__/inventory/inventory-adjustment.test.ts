/**
 * Inventory Adjustment Unit Tests
 * Phase 26.1.2: Inventory Adjustment Workflow
 * 
 * Tests for adjustment form, history, and API endpoints.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// Mock dependencies
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    inventoryItem: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    inventoryMovement: {
      count: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
    },
    productVariant: {
      findUnique: vi.fn(),
    },
    stockAlert: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

vi.mock('@/lib/auth', () => ({
  authOptions: {},
}));

import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { ADJUSTMENT_REASONS } from '@/components/inventory/inventory-adjustment-form';

describe('Phase 26.1.2: Inventory Adjustment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ADJUSTMENT_REASONS', () => {
    it('should have all required adjustment reasons', () => {
      const reasons = ADJUSTMENT_REASONS.map(r => r.value);
      expect(reasons).toContain('INITIAL_STOCK');
      expect(reasons).toContain('PURCHASE');
      expect(reasons).toContain('RETURN');
      expect(reasons).toContain('DAMAGE');
      expect(reasons).toContain('LOSS');
      expect(reasons).toContain('EXPIRY');
      expect(reasons).toContain('CORRECTION');
      expect(reasons).toContain('TRANSFER_OUT');
      expect(reasons).toContain('TRANSFER_IN');
      expect(reasons).toContain('RECOUNT');
      expect(reasons).toContain('SAMPLE');
      expect(reasons).toContain('PROMOTION');
    });

    it('should have labels for all reasons', () => {
      ADJUSTMENT_REASONS.forEach(reason => {
        expect(reason.label).toBeDefined();
        expect(reason.label.length).toBeGreaterThan(0);
      });
    });
  });

  describe('POST /api/inventory/adjust', () => {
    it('should return 401 when not authenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const { POST } = await import('@/app/api/inventory/adjust/route');
      const request = new NextRequest('http://localhost/api/inventory/adjust', {
        method: 'POST',
        body: JSON.stringify({
          inventoryId: 'inv-1',
          type: 'ADD',
          quantity: 10,
          reason: 'PURCHASE',
        }),
      });
      const response = await POST(request);

      expect(response.status).toBe(401);
    });

    it('should return 403 for non-admin/seller users', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: 'user-1', role: 'BUYER' },
      } as any);

      const { POST } = await import('@/app/api/inventory/adjust/route');
      const request = new NextRequest('http://localhost/api/inventory/adjust', {
        method: 'POST',
        body: JSON.stringify({
          inventoryId: 'inv-1',
          type: 'ADD',
          quantity: 10,
          reason: 'PURCHASE',
        }),
      });
      const response = await POST(request);

      expect(response.status).toBe(403);
    });

    it('should return 404 when inventory not found', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: 'user-1', role: 'ADMIN' },
      } as any);

      vi.mocked(prisma.inventoryItem.findUnique).mockResolvedValue(null);

      const { POST } = await import('@/app/api/inventory/adjust/route');
      const request = new NextRequest('http://localhost/api/inventory/adjust', {
        method: 'POST',
        body: JSON.stringify({
          inventoryId: 'inv-1',
          type: 'ADD',
          quantity: 10,
          reason: 'PURCHASE',
        }),
      });
      const response = await POST(request);

      expect(response.status).toBe(404);
    });

    it('should return 400 when removing more than current stock', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: 'user-1', role: 'ADMIN' },
      } as any);

      vi.mocked(prisma.inventoryItem.findUnique).mockResolvedValue({
        id: 'inv-1',
        variantId: 'var-1',
        locationId: 'loc-1',
        quantity: 10,
        reservedQuantity: 0,
        location: { vendor: null },
      } as any);

      const { POST } = await import('@/app/api/inventory/adjust/route');
      const request = new NextRequest('http://localhost/api/inventory/adjust', {
        method: 'POST',
        body: JSON.stringify({
          inventoryId: 'inv-1',
          type: 'REMOVE',
          quantity: 20,
          reason: 'DAMAGE',
        }),
      });
      const response = await POST(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain('Cannot remove more than current stock');
    });
  });

  describe('GET /api/inventory/movements', () => {
    it('should return 401 when not authenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const { GET } = await import('@/app/api/inventory/movements/route');
      const request = new NextRequest('http://localhost/api/inventory/movements');
      const response = await GET(request);

      expect(response.status).toBe(401);
    });
  });
});

