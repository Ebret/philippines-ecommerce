/**
 * Product Duplication API
 * Phase 26.4.6: Product Duplication
 * 
 * Endpoints:
 * - POST: Duplicate products
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schemas
const duplicationOptionsSchema = z.object({
  copyImages: z.boolean().default(true),
  copyVariants: z.boolean().default(true),
  copyCategories: z.boolean().default(true),
  copyTags: z.boolean().default(true),
  copyInventory: z.boolean().default(false),
  skuPrefix: z.string().default('COPY-'),
  nameSuffix: z.string().default(' (Copy)'),
  setAsDraft: z.boolean().default(true),
});

const duplicateRequestSchema = z.object({
  productIds: z.array(z.string()).min(1, 'At least one product ID is required'),
  options: duplicationOptionsSchema.optional(),
});

// POST - Duplicate products
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = duplicateRequestSchema.parse(body);
    const options = validated.options || duplicationOptionsSchema.parse({});

    const duplicatedProducts = [];

    for (const productId of validated.productIds) {
      // Mock original product - in production, fetch from database
      const originalProduct = {
        id: productId,
        name: `Product ${productId}`,
        sku: `SKU-${productId}`,
        price: 999,
        description: 'Original product description',
        status: 'ACTIVE',
        images: ['/images/product.jpg'],
        variants: [{ id: 'var-1', name: 'Default' }],
        categories: ['cat-1'],
        tags: ['tag-1'],
        stock: 100,
      };

      // Create duplicate
      const newId = `${productId}-copy-${Date.now()}`;
      const duplicated = {
        id: newId,
        name: `${originalProduct.name}${options.nameSuffix}`,
        sku: `${options.skuPrefix}${originalProduct.sku}`,
        price: originalProduct.price,
        description: originalProduct.description,
        status: options.setAsDraft ? 'DRAFT' : originalProduct.status,
        images: options.copyImages ? originalProduct.images : [],
        variants: options.copyVariants ? originalProduct.variants.map(v => ({
          ...v,
          id: `${v.id}-copy`,
        })) : [],
        categories: options.copyCategories ? originalProduct.categories : [],
        tags: options.copyTags ? originalProduct.tags : [],
        stock: options.copyInventory ? originalProduct.stock : 0,
        createdAt: new Date().toISOString(),
        duplicatedFrom: productId,
      };

      duplicatedProducts.push(duplicated);
    }

    return NextResponse.json({
      success: true,
      data: {
        products: duplicatedProducts,
        count: duplicatedProducts.length,
      },
      message: `Successfully duplicated ${duplicatedProducts.length} product(s)`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Error duplicating products:', error);
    return NextResponse.json(
      { error: 'Failed to duplicate products' },
      { status: 500 }
    );
  }
}

