/**
 * Product Categories API
 * Phase 26.4.2: Category & Tag Management
 * 
 * Endpoints:
 * - GET: List categories
 * - POST: Create category
 * - PATCH: Update category
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schemas
const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: z.string().min(1, 'Slug is required').max(100),
  parentId: z.string().nullable().optional(),
  description: z.string().max(500).optional(),
});

const updateCategorySchema = categorySchema.partial().extend({
  id: z.string().min(1, 'Category ID is required'),
});

// GET - List categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get('parentId');
    const includeChildren = searchParams.get('includeChildren') === 'true';

    // Mock response - in production, fetch from database
    const categories = [
      {
        id: 'cat-1',
        name: 'Herbal Supplements',
        slug: 'herbal-supplements',
        parentId: null,
        description: 'Natural herbal supplements',
        productCount: 45,
        children: includeChildren ? [
          {
            id: 'cat-1-1',
            name: 'Capsules',
            slug: 'capsules',
            parentId: 'cat-1',
            productCount: 20,
          },
          {
            id: 'cat-1-2',
            name: 'Teas',
            slug: 'teas',
            parentId: 'cat-1',
            productCount: 15,
          },
        ] : undefined,
      },
      {
        id: 'cat-2',
        name: 'Essential Oils',
        slug: 'essential-oils',
        parentId: null,
        description: 'Pure essential oils',
        productCount: 30,
      },
    ];

    const filtered = parentId
      ? categories.filter(c => c.parentId === parentId)
      : categories.filter(c => c.parentId === null);

    return NextResponse.json({
      success: true,
      data: filtered,
      total: filtered.length,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST - Create category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = categorySchema.parse(body);

    // Mock response - in production, save to database
    const newCategory = {
      id: `cat-${Date.now()}`,
      ...validated,
      productCount: 0,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: newCategory,
      message: 'Category created successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}

// PATCH - Update category
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = updateCategorySchema.parse(body);

    // Mock response - in production, update in database
    const updatedCategory = {
      ...validated,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: updatedCategory,
      message: 'Category updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

