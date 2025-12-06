/**
 * Inventory API Unit Tests
 * Phase 26.1.1: Real-time Inventory Tracking & Low Stock Alerts
 * 
 * Tests for API endpoints: dashboard, alerts, acknowledge, dismiss.
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
      count: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    stockAlert: {
      count: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('@/lib/auth', () => ({
  authOptions: {},
}));

import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

describe('Phase 26.1.1: Inventory API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/inventory/dashboard', () => {
    it('should return 401 when not authenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const { GET } = await import('@/app/api/inventory/dashboard/route');
      const request = new NextRequest('http://localhost/api/inventory/dashboard');
      const response = await GET(request);

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });

    it('should return inventory data when authenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: 'user-1', role: 'ADMIN' },
      } as any);

      vi.mocked(prisma.inventoryItem.count).mockResolvedValue(10);
      vi.mocked(prisma.inventoryItem.findMany).mockResolvedValue([
        {
          id: 'inv-1',
          variantId: 'var-1',
          locationId: 'loc-1',
          quantity: 50,
          reservedQuantity: 5,
          lastCountedAt: null,
          updatedAt: new Date(),
          variant: {
            id: 'var-1',
            name: 'Test Variant',
            sku: 'SKU-001',
            price: 100,
            lowStockThreshold: 10,
            stockQuantity: 50,
            product: { id: 'prod-1', name: 'Test Product' },
          },
          location: { id: 'loc-1', name: 'Main Warehouse', code: 'MW' },
        },
      ] as any);

      vi.mocked(prisma.stockAlert.count).mockResolvedValue(2);

      const { GET } = await import('@/app/api/inventory/dashboard/route');
      const request = new NextRequest('http://localhost/api/inventory/dashboard');
      const response = await GET(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.items).toBeDefined();
      expect(data.summary).toBeDefined();
      expect(data.pagination).toBeDefined();
    });

    it('should filter by location when locationId is provided', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: 'user-1', role: 'ADMIN' },
      } as any);

      vi.mocked(prisma.inventoryItem.count).mockResolvedValue(5);
      vi.mocked(prisma.inventoryItem.findMany).mockResolvedValue([]);
      vi.mocked(prisma.stockAlert.count).mockResolvedValue(0);

      const { GET } = await import('@/app/api/inventory/dashboard/route');
      const request = new NextRequest('http://localhost/api/inventory/dashboard?locationId=loc-1');
      await GET(request);

      expect(prisma.inventoryItem.count).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ locationId: 'loc-1' }),
        })
      );
    });
  });

  describe('PATCH /api/inventory/alerts/[id]/acknowledge', () => {
    it('should return 401 when not authenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const { PATCH } = await import('@/app/api/inventory/alerts/[id]/acknowledge/route');
      const request = new NextRequest('http://localhost/api/inventory/alerts/alert-1/acknowledge', {
        method: 'PATCH',
      });
      const response = await PATCH(request, { params: Promise.resolve({ id: 'alert-1' }) });

      expect(response.status).toBe(401);
    });

    it('should return 404 when alert not found', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: 'user-1', role: 'ADMIN' },
      } as any);

      vi.mocked(prisma.stockAlert.findUnique).mockResolvedValue(null);

      const { PATCH } = await import('@/app/api/inventory/alerts/[id]/acknowledge/route');
      const request = new NextRequest('http://localhost/api/inventory/alerts/alert-1/acknowledge', {
        method: 'PATCH',
      });
      const response = await PATCH(request, { params: Promise.resolve({ id: 'alert-1' }) });

      expect(response.status).toBe(404);
    });

    it('should acknowledge alert successfully', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: 'user-1', role: 'ADMIN' },
      } as any);

      vi.mocked(prisma.stockAlert.findUnique).mockResolvedValue({
        id: 'alert-1',
        variantId: 'var-1',
        locationId: 'loc-1',
        threshold: 10,
        isActive: true,
        location: { vendor: { userId: 'user-1' } },
      } as any);

      vi.mocked(prisma.stockAlert.update).mockResolvedValue({
        id: 'alert-1',
        lastTriggered: new Date(),
      } as any);

      const { PATCH } = await import('@/app/api/inventory/alerts/[id]/acknowledge/route');
      const request = new NextRequest('http://localhost/api/inventory/alerts/alert-1/acknowledge', {
        method: 'PATCH',
      });
      const response = await PATCH(request, { params: Promise.resolve({ id: 'alert-1' }) });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.message).toBe('Alert acknowledged successfully');
    });
  });

  describe('PATCH /api/inventory/alerts/[id]/dismiss', () => {
    it('should dismiss alert successfully', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: 'user-1', role: 'ADMIN' },
      } as any);

      vi.mocked(prisma.stockAlert.findUnique).mockResolvedValue({
        id: 'alert-1',
        isActive: true,
        location: { vendor: { userId: 'user-1' } },
      } as any);

      vi.mocked(prisma.stockAlert.update).mockResolvedValue({
        id: 'alert-1',
        isActive: false,
      } as any);

      const { PATCH } = await import('@/app/api/inventory/alerts/[id]/dismiss/route');
      const request = new NextRequest('http://localhost/api/inventory/alerts/alert-1/dismiss', {
        method: 'PATCH',
      });
      const response = await PATCH(request, { params: Promise.resolve({ id: 'alert-1' }) });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.message).toBe('Alert dismissed successfully');
    });
  });
});

