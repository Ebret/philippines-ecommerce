/**
 * Discount Management Unit Tests
 * Phase 26.2: Discount & Promotion Management
 * 
 * Tests for discounts, coupons, and flash sales.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// Mock dependencies
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    vendor: { findFirst: vi.fn() },
    product: { findUnique: vi.fn() },
  },
}));

vi.mock('@/lib/auth', () => ({
  authOptions: {},
}));

import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

describe('Phase 26.2: Discount & Promotion Management', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/discounts', () => {
    it('should return 401 when not authenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const { GET } = await import('@/app/api/discounts/route');
      const request = new NextRequest('http://localhost/api/discounts');
      const response = await GET(request);

      expect(response.status).toBe(401);
    });

    it('should return discounts for authenticated user', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: 'user-1', role: 'ADMIN' },
      } as any);

      const { GET } = await import('@/app/api/discounts/route');
      const request = new NextRequest('http://localhost/api/discounts');
      const response = await GET(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.discounts).toBeDefined();
    });
  });

  describe('POST /api/discounts', () => {
    it('should return 401 when not authenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const { POST } = await import('@/app/api/discounts/route');
      const request = new NextRequest('http://localhost/api/discounts', {
        method: 'POST',
        body: JSON.stringify({}),
      });
      const response = await POST(request);

      expect(response.status).toBe(401);
    });

    it('should return 400 for invalid data', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: 'user-1', role: 'ADMIN' },
      } as any);

      const { POST } = await import('@/app/api/discounts/route');
      const request = new NextRequest('http://localhost/api/discounts', {
        method: 'POST',
        body: JSON.stringify({ name: '' }),
      });
      const response = await POST(request);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/coupons', () => {
    it('should return 401 when not authenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const { GET } = await import('@/app/api/coupons/route');
      const request = new NextRequest('http://localhost/api/coupons');
      const response = await GET(request);

      expect(response.status).toBe(401);
    });

    it('should return coupons for authenticated user', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: 'user-1', role: 'ADMIN' },
      } as any);

      const { GET } = await import('@/app/api/coupons/route');
      const request = new NextRequest('http://localhost/api/coupons');
      const response = await GET(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.coupons).toBeDefined();
    });
  });

  describe('GET /api/flash-sales', () => {
    it('should return 401 when not authenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const { GET } = await import('@/app/api/flash-sales/route');
      const request = new NextRequest('http://localhost/api/flash-sales');
      const response = await GET(request);

      expect(response.status).toBe(401);
    });

    it('should return flash sales for authenticated user', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: 'user-1', role: 'ADMIN' },
      } as any);

      const { GET } = await import('@/app/api/flash-sales/route');
      const request = new NextRequest('http://localhost/api/flash-sales');
      const response = await GET(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.sales).toBeDefined();
    });
  });

  describe('GET /api/promotions/schedule', () => {
    it('should return 401 when not authenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const { GET } = await import('@/app/api/promotions/schedule/route');
      const request = new NextRequest('http://localhost/api/promotions/schedule');
      const response = await GET(request);

      expect(response.status).toBe(401);
    });

    it('should return scheduled promotions for authenticated user', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: 'user-1', role: 'ADMIN' },
      } as any);

      const { GET } = await import('@/app/api/promotions/schedule/route');
      const request = new NextRequest('http://localhost/api/promotions/schedule?year=2025&month=12');
      const response = await GET(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.promotions).toBeDefined();
      expect(data.year).toBe(2025);
      expect(data.month).toBe(12);
    });
  });

  describe('GET /api/promotions/analytics', () => {
    it('should return 401 when not authenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const { GET } = await import('@/app/api/promotions/analytics/route');
      const request = new NextRequest('http://localhost/api/promotions/analytics');
      const response = await GET(request);

      expect(response.status).toBe(401);
    });

    it('should return analytics for authenticated user', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: 'user-1', role: 'ADMIN' },
      } as any);

      const { GET } = await import('@/app/api/promotions/analytics/route');
      const request = new NextRequest('http://localhost/api/promotions/analytics');
      const response = await GET(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.metrics).toBeDefined();
      expect(data.topPromotions).toBeDefined();
    });
  });
});

