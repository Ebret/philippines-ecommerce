/**
 * Image Gallery API Route
 * Phase 26.3.3: Image Gallery Management
 * 
 * GET /api/images/gallery - Get gallery images for a product
 * PATCH /api/images/gallery - Update gallery (reorder, set primary, update alt text)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

// Validation schema for gallery update
const GalleryUpdateSchema = z.object({
  productId: z.string().cuid(),
  images: z.array(z.object({
    id: z.string(),
    sortOrder: z.number().int().min(0),
    isPrimary: z.boolean().optional(),
    altText: z.string().optional(),
  })),
});

/**
 * GET /api/images/gallery
 * Get gallery images for a product
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    // Mock gallery data
    const images = [
      {
        id: 'img-1',
        url: '/images/product-1.jpg',
        thumbnailUrl: '/images/thumb-product-1.jpg',
        altText: 'Product front view',
        isPrimary: true,
        sortOrder: 0,
      },
      {
        id: 'img-2',
        url: '/images/product-2.jpg',
        thumbnailUrl: '/images/thumb-product-2.jpg',
        altText: 'Product side view',
        isPrimary: false,
        sortOrder: 1,
      },
      {
        id: 'img-3',
        url: '/images/product-3.jpg',
        thumbnailUrl: '/images/thumb-product-3.jpg',
        altText: 'Product detail',
        isPrimary: false,
        sortOrder: 2,
      },
    ];

    return NextResponse.json({ images, productId });
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PATCH /api/images/gallery
 * Update gallery (reorder, set primary, update alt text)
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = GalleryUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { productId, images } = validation.data;

    // Mock update result
    const updatedImages = images.map(img => ({
      ...img,
      url: `/images/product-${img.id}.jpg`,
      thumbnailUrl: `/images/thumb-product-${img.id}.jpg`,
    }));

    return NextResponse.json({
      success: true,
      images: updatedImages,
      productId,
    });
  } catch (error) {
    console.error('Error updating gallery:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

