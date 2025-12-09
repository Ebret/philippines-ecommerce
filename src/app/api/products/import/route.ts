/**
 * Product Import API
 * Phase 26.4.5: Product Import/Export
 * 
 * Endpoints:
 * - POST: Import products from CSV/JSON
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schemas
const importProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  sku: z.string().min(1, 'SKU is required'),
  price: z.number().min(0, 'Price must be positive'),
  description: z.string().optional(),
  category: z.string().optional(),
  stock: z.number().int().min(0).optional(),
  images: z.array(z.string()).optional(),
});

const importRequestSchema = z.object({
  products: z.array(importProductSchema).min(1, 'At least one product is required'),
  options: z.object({
    skipDuplicates: z.boolean().default(true),
    updateExisting: z.boolean().default(false),
  }).optional(),
});

// POST - Import products
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = importRequestSchema.parse(body);

    const results = {
      total: validated.products.length,
      created: 0,
      updated: 0,
      skipped: 0,
      errors: [] as { row: number; sku: string; error: string }[],
    };

    // Process each product
    for (let i = 0; i < validated.products.length; i++) {
      const product = validated.products[i];
      
      try {
        // Mock validation - in production, check database for duplicates
        const isDuplicate = product.sku.startsWith('DUP-');
        
        if (isDuplicate) {
          if (validated.options?.updateExisting) {
            results.updated++;
          } else if (validated.options?.skipDuplicates) {
            results.skipped++;
          } else {
            results.errors.push({
              row: i + 1,
              sku: product.sku,
              error: 'Duplicate SKU',
            });
          }
        } else {
          results.created++;
        }
      } catch (err) {
        results.errors.push({
          row: i + 1,
          sku: product.sku,
          error: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json({
      success: results.errors.length === 0,
      data: results,
      message: `Import completed: ${results.created} created, ${results.updated} updated, ${results.skipped} skipped, ${results.errors.length} errors`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Error importing products:', error);
    return NextResponse.json(
      { error: 'Failed to import products' },
      { status: 500 }
    );
  }
}

