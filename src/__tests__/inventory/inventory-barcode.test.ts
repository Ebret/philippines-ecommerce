/**
 * Barcode/SKU Scanning Unit Tests
 * Phase 26.1.6: Barcode/SKU Scanning
 * 
 * Tests for barcode scanning and SKU lookup functionality.
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
    productVariant: { findMany: vi.fn() },
  },
}));

vi.mock('@/lib/auth', () => ({
  authOptions: {},
}));

import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

describe('Phase 26.1.6: Barcode/SKU Scanning', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Barcode Format Detection', () => {
    const detectBarcodeFormat = (barcode: string): string => {
      if (/^\d{13}$/.test(barcode)) return 'EAN-13';
      if (/^\d{12}$/.test(barcode)) return 'UPC-A';
      if (/^\d{8}$/.test(barcode)) return 'EAN-8';
      if (/^[A-Z0-9]{1,20}$/.test(barcode)) return 'CODE-39';
      return 'UNKNOWN';
    };

    it('should detect EAN-13 format', () => {
      expect(detectBarcodeFormat('1234567890123')).toBe('EAN-13');
    });

    it('should detect UPC-A format', () => {
      expect(detectBarcodeFormat('123456789012')).toBe('UPC-A');
    });

    it('should detect EAN-8 format', () => {
      expect(detectBarcodeFormat('12345678')).toBe('EAN-8');
    });

    it('should detect CODE-39 format', () => {
      expect(detectBarcodeFormat('ABC123')).toBe('CODE-39');
    });

    it('should return UNKNOWN for invalid format', () => {
      expect(detectBarcodeFormat('abc-123')).toBe('UNKNOWN');
    });
  });

  describe('GET /api/inventory/lookup', () => {
    it('should return 401 when not authenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const { GET } = await import('@/app/api/inventory/lookup/route');
      const request = new NextRequest('http://localhost/api/inventory/lookup?barcode=123');
      const response = await GET(request);

      expect(response.status).toBe(401);
    });

    it('should return 400 when no search parameter provided', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: 'user-1', role: 'ADMIN' },
      } as any);

      const { GET } = await import('@/app/api/inventory/lookup/route');
      const request = new NextRequest('http://localhost/api/inventory/lookup');
      const response = await GET(request);

      expect(response.status).toBe(400);
    });

    it('should search by barcode', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: 'user-1', role: 'ADMIN' },
      } as any);

      vi.mocked(prisma.productVariant.findMany).mockResolvedValue([
        {
          id: 'var-1',
          name: 'Test Variant',
          sku: 'SKU001',
          barcode: '1234567890123',
          price: { toNumber: () => 100 },
          stockQuantity: 50,
          lowStockThreshold: 10,
          product: { id: 'prod-1', name: 'Test Product' },
          inventoryItems: [],
        },
      ] as any);

      const { GET } = await import('@/app/api/inventory/lookup/route');
      const request = new NextRequest('http://localhost/api/inventory/lookup?barcode=1234567890123');
      const response = await GET(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.product).toBeDefined();
      expect(data.product.barcode).toBe('1234567890123');
    });

    it('should search by query string', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: 'user-1', role: 'ADMIN' },
      } as any);

      vi.mocked(prisma.productVariant.findMany).mockResolvedValue([
        {
          id: 'var-1',
          name: 'Test Variant',
          sku: 'SKU001',
          barcode: null,
          price: { toNumber: () => 100 },
          stockQuantity: 50,
          lowStockThreshold: 10,
          product: { id: 'prod-1', name: 'Test Product' },
          inventoryItems: [],
        },
      ] as any);

      const { GET } = await import('@/app/api/inventory/lookup/route');
      const request = new NextRequest('http://localhost/api/inventory/lookup?q=SKU001');
      const response = await GET(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.results).toBeDefined();
      expect(data.results.length).toBeGreaterThan(0);
    });

    it('should return empty results when no match found', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: 'user-1', role: 'ADMIN' },
      } as any);

      vi.mocked(prisma.productVariant.findMany).mockResolvedValue([]);

      const { GET } = await import('@/app/api/inventory/lookup/route');
      const request = new NextRequest('http://localhost/api/inventory/lookup?q=NONEXISTENT');
      const response = await GET(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.results).toEqual([]);
    });
  });
});

