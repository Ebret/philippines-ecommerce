/**
 * Multi-location Inventory Management Unit Tests
 * Phase 26.1.4: Multi-location Inventory Management
 * 
 * Tests for location management and stock transfers.
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
    inventoryLocation: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      updateMany: vi.fn(),
    },
    inventoryItem: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
    },
    inventoryMovement: { create: vi.fn() },
    $transaction: vi.fn(),
  },
}));

vi.mock('@/lib/auth', () => ({
  authOptions: {},
}));

import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

describe('Phase 26.1.4: Multi-location Inventory Management', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/inventory/locations', () => {
    it('should return 401 when not authenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const { GET } = await import('@/app/api/inventory/locations/route');
      const request = new NextRequest('http://localhost/api/inventory/locations');
      const response = await GET(request);

      expect(response.status).toBe(401);
    });

    it('should return locations for authenticated user', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: 'user-1', role: 'ADMIN' },
      } as any);

      vi.mocked(prisma.inventoryLocation.findMany).mockResolvedValue([
        {
          id: 'loc-1',
          name: 'Main Warehouse',
          address: '123 Main St',
          city: 'Manila',
          province: 'Metro Manila',
          postalCode: '1000',
          country: 'Philippines',
          isActive: true,
          isDefault: true,
          vendorId: 'vendor-1',
          createdAt: new Date(),
          _count: { inventoryItems: 10 },
        },
      ] as any);

      vi.mocked(prisma.inventoryItem.findMany).mockResolvedValue([]);

      const { GET } = await import('@/app/api/inventory/locations/route');
      const request = new NextRequest('http://localhost/api/inventory/locations');
      const response = await GET(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.locations).toHaveLength(1);
      expect(data.locations[0].name).toBe('Main Warehouse');
    });
  });

  describe('POST /api/inventory/locations', () => {
    it('should return 401 when not authenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const { POST } = await import('@/app/api/inventory/locations/route');
      const request = new NextRequest('http://localhost/api/inventory/locations', {
        method: 'POST',
        body: JSON.stringify({ name: 'New Location' }),
      });
      const response = await POST(request);

      expect(response.status).toBe(401);
    });

    it('should return 403 for non-admin/seller users', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: 'user-1', role: 'BUYER' },
      } as any);

      const { POST } = await import('@/app/api/inventory/locations/route');
      const request = new NextRequest('http://localhost/api/inventory/locations', {
        method: 'POST',
        body: JSON.stringify({ name: 'New Location' }),
      });
      const response = await POST(request);

      expect(response.status).toBe(403);
    });
  });

  describe('POST /api/inventory/transfer', () => {
    it('should return 401 when not authenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const { POST } = await import('@/app/api/inventory/transfer/route');
      const request = new NextRequest('http://localhost/api/inventory/transfer', {
        method: 'POST',
        body: JSON.stringify({
          sourceLocationId: 'loc-1',
          targetLocationId: 'loc-2',
          items: [{ inventoryId: 'inv-1', quantity: 10 }],
        }),
      });
      const response = await POST(request);

      expect(response.status).toBe(401);
    });

    it('should return 400 when source and target are same', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: 'user-1', role: 'ADMIN' },
      } as any);

      const { POST } = await import('@/app/api/inventory/transfer/route');
      const request = new NextRequest('http://localhost/api/inventory/transfer', {
        method: 'POST',
        body: JSON.stringify({
          sourceLocationId: 'loc-1',
          targetLocationId: 'loc-1',
          items: [{ inventoryId: 'inv-1', quantity: 10 }],
        }),
      });
      const response = await POST(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain('different');
    });
  });
});

