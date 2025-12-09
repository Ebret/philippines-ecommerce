/**
 * Product Variants API
 * Phase 26.4.1: Product Variant Management
 * 
 * Endpoints:
 * - GET: List variants for a product
 * - POST: Create new variant
 * - PATCH: Update variant
 * - DELETE: Delete variant
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schemas
const variantSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  sku: z.string().min(1, 'SKU is required'),
  barcode: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  price: z.number().min(0, 'Price must be positive'),
  compareAtPrice: z.number().min(0).optional(),
  stock: z.number().int().min(0, 'Stock must be non-negative'),
  attributes: z.record(z.string(), z.string()), // Zod v4: record(keyType, valueType)
  isActive: z.boolean().default(true),
});

const updateVariantSchema = variantSchema.partial().extend({
  id: z.string().min(1, 'Variant ID is required'),
});

// GET - List variants for a product
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Mock response - in production, fetch from database
    const variants = [
      {
        id: 'var-1',
        productId,
        sku: `${productId}-S-RED`,
        name: 'Small / Red',
        price: 999,
        stock: 50,
        attributes: { Size: 'S', Color: 'Red' },
        isActive: true,
      },
      {
        id: 'var-2',
        productId,
        sku: `${productId}-M-BLUE`,
        name: 'Medium / Blue',
        price: 1099,
        stock: 30,
        attributes: { Size: 'M', Color: 'Blue' },
        isActive: true,
      },
    ];

    return NextResponse.json({
      success: true,
      data: variants,
      total: variants.length,
    });
  } catch (error) {
    console.error('Error fetching variants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch variants' },
      { status: 500 }
    );
  }
}

// POST - Create new variant
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = variantSchema.parse(body);

    // Mock response - in production, save to database
    const newVariant = {
      id: `var-${Date.now()}`,
      ...validated,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: newVariant,
      message: 'Variant created successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Error creating variant:', error);
    return NextResponse.json(
      { error: 'Failed to create variant' },
      { status: 500 }
    );
  }
}

// PATCH - Update variant
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = updateVariantSchema.parse(body);

    // Mock response - in production, update in database
    const updatedVariant = {
      ...validated,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: updatedVariant,
      message: 'Variant updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Error updating variant:', error);
    return NextResponse.json(
      { error: 'Failed to update variant' },
      { status: 500 }
    );
  }
}

