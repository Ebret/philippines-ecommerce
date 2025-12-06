/**
 * Inventory History & Audit Logs Unit Tests
 * Phase 26.1.3: Inventory History & Audit Logs
 * 
 * Tests for history viewer, audit logs, and API endpoints.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// Mock dependencies
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    inventoryMovement: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
    productVariant: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock('@/lib/auth', () => ({
  authOptions: {},
}));

import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

describe('Phase 26.1.3: Inventory History & Audit Logs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/inventory/history', () => {
    it('should return 401 when not authenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const { GET } = await import('@/app/api/inventory/history/route');
      const request = new NextRequest('http://localhost/api/inventory/history');
      const response = await GET(request);

      expect(response.status).toBe(401);
    });

    it('should return history entries for authenticated user', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: 'user-1', role: 'ADMIN' },
      } as any);

      vi.mocked(prisma.inventoryMovement.findMany).mockResolvedValue([
        {
          id: 'mov-1',
          variantId: 'var-1',
          locationId: 'loc-1',
          movementType: 'IN',
          quantity: 100,
          referenceType: 'PURCHASE',
          referenceId: 'PO-001',
          notes: 'Initial stock',
          createdById: 'user-1',
          createdAt: new Date('2024-01-15'),
          variant: { id: 'var-1', name: 'Red', sku: 'SKU-001', product: { name: 'Test Product' } },
          location: { id: 'loc-1', name: 'Main Warehouse' },
          createdBy: { id: 'user-1', name: 'Admin', email: 'admin@test.com' },
        },
      ] as any);

      const { GET } = await import('@/app/api/inventory/history/route');
      const request = new NextRequest('http://localhost/api/inventory/history');
      const response = await GET(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.entries).toHaveLength(1);
      expect(data.entries[0].action).toBe('CREATED');
      expect(data.entries[0].quantity).toBe(100);
    });

    it('should filter by date range', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: 'user-1', role: 'ADMIN' },
      } as any);

      vi.mocked(prisma.inventoryMovement.findMany).mockResolvedValue([]);

      const { GET } = await import('@/app/api/inventory/history/route');
      const request = new NextRequest(
        'http://localhost/api/inventory/history?startDate=2024-01-01&endDate=2024-01-31'
      );
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(prisma.inventoryMovement.findMany).toHaveBeenCalled();
    });
  });

  describe('GET /api/inventory/audit-logs', () => {
    it('should return 401 when not authenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const { GET } = await import('@/app/api/inventory/audit-logs/route');
      const request = new NextRequest('http://localhost/api/inventory/audit-logs');
      const response = await GET(request);

      expect(response.status).toBe(401);
    });

    it('should return 403 for non-admin users', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: 'user-1', role: 'SELLER' },
      } as any);

      const { GET } = await import('@/app/api/inventory/audit-logs/route');
      const request = new NextRequest('http://localhost/api/inventory/audit-logs');
      const response = await GET(request);

      expect(response.status).toBe(403);
    });

    it('should return audit logs for admin users', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: 'user-1', role: 'ADMIN' },
      } as any);

      vi.mocked(prisma.inventoryMovement.count).mockResolvedValue(1);
      vi.mocked(prisma.inventoryMovement.findMany).mockResolvedValue([
        {
          id: 'mov-1',
          variantId: 'var-1',
          locationId: 'loc-1',
          movementType: 'ADJUSTMENT',
          quantity: -5,
          referenceType: 'DAMAGE',
          referenceId: null,
          notes: 'Damaged in transit',
          createdById: 'user-1',
          createdAt: new Date('2024-01-15'),
          variant: { id: 'var-1', name: 'Red', sku: 'SKU-001', product: { name: 'Test Product' } },
          location: { id: 'loc-1', name: 'Main Warehouse' },
          createdBy: { id: 'user-1', name: 'Admin', email: 'admin@test.com', role: 'ADMIN' },
        },
      ] as any);

      const { GET } = await import('@/app/api/inventory/audit-logs/route');
      const request = new NextRequest('http://localhost/api/inventory/audit-logs');
      const response = await GET(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.logs).toHaveLength(1);
      expect(data.logs[0].action).toBe('ADJUSTMENT_STOCK');
      expect(data.pagination.total).toBe(1);
    });
  });
});

