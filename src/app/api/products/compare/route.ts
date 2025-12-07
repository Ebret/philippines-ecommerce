/**
 * Product Comparison API
 * Phase 26.4.4: Product Comparison
 * 
 * Endpoints:
 * - GET: Get products for comparison
 * - POST: Save comparison
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schemas
const compareSchema = z.object({
  productIds: z.array(z.string()).min(2, 'At least 2 products required').max(4, 'Maximum 4 products'),
});

const saveComparisonSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  productIds: z.array(z.string()).min(2).max(4),
});

// GET - Get products for comparison
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productIds = searchParams.get('ids')?.split(',') || [];

    if (productIds.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 product IDs are required' },
        { status: 400 }
      );
    }

    // Mock response - in production, fetch from database
    const products = productIds.map((id, index) => ({
      id,
      name: `Product ${index + 1}`,
      slug: `product-${index + 1}`,
      image: `/images/product-${index + 1}.jpg`,
      price: 999 + (index * 100),
      compareAtPrice: 1299 + (index * 100),
      rating: 4.5 - (index * 0.2),
      reviewCount: 50 - (index * 10),
      inStock: index !== 2,
      attributes: {
        Brand: `Brand ${String.fromCharCode(65 + index)}`,
        Weight: `${100 + (index * 50)}g`,
        Origin: 'Philippines',
        Organic: index % 2 === 0,
      },
      features: [
        'Natural ingredients',
        index % 2 === 0 ? 'Organic certified' : null,
        'No preservatives',
        index === 0 ? 'Best seller' : null,
      ].filter(Boolean),
    }));

    return NextResponse.json({
      success: true,
      data: products,
      comparisonAttributes: ['Brand', 'Weight', 'Origin', 'Organic'],
    });
  } catch (error) {
    console.error('Error fetching comparison:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comparison data' },
      { status: 500 }
    );
  }
}

// POST - Save comparison
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = saveComparisonSchema.parse(body);

    // Mock response - in production, save to database
    const savedComparison = {
      id: `comp-${Date.now()}`,
      ...validated,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: savedComparison,
      message: 'Comparison saved successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error saving comparison:', error);
    return NextResponse.json(
      { error: 'Failed to save comparison' },
      { status: 500 }
    );
  }
}

