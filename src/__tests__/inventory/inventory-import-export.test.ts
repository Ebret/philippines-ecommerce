/**
 * Inventory Import/Export Unit Tests
 * Phase 26.1.7: Inventory Import/Export
 * 
 * Tests for bulk import and export functionality.
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
    productVariant: { findFirst: vi.fn(), findMany: vi.fn(), update: vi.fn() },
    inventoryMovement: { create: vi.fn() },
  },
}));

vi.mock('@/lib/auth', () => ({
  authOptions: {},
}));

import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

describe('Phase 26.1.7: Inventory Import/Export', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('CSV Parsing', () => {
    const parseCSV = (content: string): Record<string, string>[] => {
      const lines = content.trim().split('\n');
      if (lines.length < 2) return [];
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const rows: Record<string, string>[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        const row: Record<string, string> = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        rows.push(row);
      }
      return rows;
    };

    it('should parse valid CSV content', () => {
      const csv = 'SKU,Quantity,Location\nSKU001,100,Warehouse A\nSKU002,50,Warehouse B';
      const result = parseCSV(csv);
      expect(result).toHaveLength(2);
      expect(result[0].SKU).toBe('SKU001');
      expect(result[0].Quantity).toBe('100');
    });

    it('should handle empty CSV', () => {
      const result = parseCSV('');
      expect(result).toHaveLength(0);
    });

    it('should handle CSV with only headers', () => {
      const result = parseCSV('SKU,Quantity');
      expect(result).toHaveLength(0);
    });
  });

  describe('CSV Generation', () => {
    const generateCSV = (data: Record<string, any>[], columns: string[]): string => {
      const headers = columns.join(',');
      const rows = data.map(row => 
        columns.map(col => {
          const value = row[col];
          if (value === null || value === undefined) return '';
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return String(value);
        }).join(',')
      );
      return [headers, ...rows].join('\n');
    };

    it('should generate valid CSV', () => {
      const data = [{ sku: 'SKU001', quantity: 100 }];
      const result = generateCSV(data, ['sku', 'quantity']);
      expect(result).toContain('sku,quantity');
      expect(result).toContain('SKU001,100');
    });

    it('should escape commas in values', () => {
      const data = [{ name: 'Product, with comma' }];
      const result = generateCSV(data, ['name']);
      expect(result).toContain('"Product, with comma"');
    });

    it('should handle null values', () => {
      const data = [{ sku: 'SKU001', barcode: null }];
      const result = generateCSV(data, ['sku', 'barcode']);
      expect(result).toContain('SKU001,');
    });
  });

  describe('POST /api/inventory/import', () => {
    it('should return 401 when not authenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const { POST } = await import('@/app/api/inventory/import/route');
      const formData = new FormData();
      formData.append('file', new Blob(['SKU,Quantity\nSKU001,100'], { type: 'text/csv' }), 'test.csv');
      
      const request = new NextRequest('http://localhost/api/inventory/import', {
        method: 'POST',
        body: formData,
      });
      const response = await POST(request);

      expect(response.status).toBe(401);
    });

    it('should return 400 when no file provided', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: 'user-1', role: 'ADMIN' },
      } as any);

      const { POST } = await import('@/app/api/inventory/import/route');
      const formData = new FormData();
      
      const request = new NextRequest('http://localhost/api/inventory/import', {
        method: 'POST',
        body: formData,
      });
      const response = await POST(request);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/inventory/export', () => {
    it('should return 401 when not authenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const { GET } = await import('@/app/api/inventory/export/route');
      const request = new NextRequest('http://localhost/api/inventory/export');
      const response = await GET(request);

      expect(response.status).toBe(401);
    });

    it('should export inventory as CSV', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: 'user-1', role: 'ADMIN' },
      } as any);

      vi.mocked(prisma.productVariant.findMany).mockResolvedValue([
        {
          id: 'var-1',
          sku: 'SKU001',
          barcode: '123',
          name: 'Variant 1',
          stockQuantity: 100,
          lowStockThreshold: 10,
          costPrice: { toNumber: () => 50 },
          updatedAt: new Date(),
          product: { name: 'Product 1' },
          inventoryItems: [],
        },
      ] as any);

      const { GET } = await import('@/app/api/inventory/export/route');
      const request = new NextRequest('http://localhost/api/inventory/export?columns=sku,quantity');
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('text/csv');
    });
  });
});

