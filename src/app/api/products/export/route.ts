/**
 * Product Export API
 * Phase 26.4.5: Product Import/Export
 * 
 * Endpoints:
 * - GET: Export products to CSV/JSON
 */

import { NextRequest, NextResponse } from 'next/server';

// GET - Export products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';
    const categoryId = searchParams.get('categoryId');
    const status = searchParams.get('status');

    // Mock products - in production, fetch from database with filters
    const products = [
      {
        id: 'prod-1',
        name: 'Herbal Tea Blend',
        sku: 'HTB-001',
        price: 299,
        description: 'Premium herbal tea blend',
        category: 'Teas',
        stock: 100,
        status: 'ACTIVE',
        images: ['/images/tea-1.jpg'],
        createdAt: new Date().toISOString(),
      },
      {
        id: 'prod-2',
        name: 'Essential Oil Set',
        sku: 'EOS-001',
        price: 599,
        description: 'Set of 5 essential oils',
        category: 'Essential Oils',
        stock: 50,
        status: 'ACTIVE',
        images: ['/images/oil-1.jpg'],
        createdAt: new Date().toISOString(),
      },
      {
        id: 'prod-3',
        name: 'Herbal Capsules',
        sku: 'HC-001',
        price: 499,
        description: 'Natural herbal capsules',
        category: 'Supplements',
        stock: 75,
        status: 'ACTIVE',
        images: ['/images/capsule-1.jpg'],
        createdAt: new Date().toISOString(),
      },
    ];

    // Apply filters
    let filtered = products;
    if (categoryId) {
      filtered = filtered.filter(p => p.category === categoryId);
    }
    if (status) {
      filtered = filtered.filter(p => p.status === status);
    }

    if (format === 'csv') {
      // Generate CSV
      const headers = ['id', 'name', 'sku', 'price', 'description', 'category', 'stock', 'status'];
      const csvRows = [
        headers.join(','),
        ...filtered.map(p => 
          headers.map(h => {
            const value = p[h as keyof typeof p];
            // Escape commas and quotes in values
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          }).join(',')
        ),
      ];
      const csv = csvRows.join('\n');

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="products-export-${Date.now()}.csv"`,
        },
      });
    }

    // Return JSON
    return NextResponse.json({
      success: true,
      data: {
        products: filtered,
        exportedAt: new Date().toISOString(),
        total: filtered.length,
        format: 'json',
      },
    });
  } catch (error) {
    console.error('Error exporting products:', error);
    return NextResponse.json(
      { error: 'Failed to export products' },
      { status: 500 }
    );
  }
}

