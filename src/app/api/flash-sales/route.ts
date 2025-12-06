/**
 * Flash Sales API Route
 * Phase 26.2.3: Flash Sale System
 * 
 * GET /api/flash-sales - List flash sales
 * POST /api/flash-sales - Create flash sale
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema
const FlashSaleSchema = z.object({
  productId: z.string().cuid(),
  salePrice: z.number().positive(),
  discountPercent: z.number().min(1).max(99),
  stockLimit: z.number().int().positive(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
});

/**
 * GET /api/flash-sales
 * List flash sales with filtering
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');

    // Build where clause
    const where: any = {};

    // Filter by vendor for sellers
    if ((session.user.role as any) === 'SELLER') {
      const vendor = await prisma.vendor.findFirst({
        where: { userId: session.user.id },
        select: { id: true },
      });
      if (vendor) {
        where.product = { vendorId: vendor.id };
      }
    }

    const now = new Date();
    if (status === 'SCHEDULED') {
      where.startTime = { gt: now };
    } else if (status === 'ACTIVE') {
      where.startTime = { lte: now };
      where.endTime = { gt: now };
    } else if (status === 'ENDED') {
      where.endTime = { lte: now };
    }

    // Return mock data for now
    const sales = [
      {
        id: 'flash-1',
        productId: 'prod-1',
        productName: 'Herbal Tea Collection',
        productImage: null,
        originalPrice: 1500,
        salePrice: 999,
        discountPercent: 33,
        stockLimit: 50,
        soldCount: 23,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
        status: 'ACTIVE',
      },
      {
        id: 'flash-2',
        productId: 'prod-2',
        productName: 'Wellness Bundle',
        productImage: null,
        originalPrice: 2500,
        salePrice: 1750,
        discountPercent: 30,
        stockLimit: 30,
        soldCount: 0,
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        status: 'SCHEDULED',
      },
    ];

    return NextResponse.json({ sales });
  } catch (error) {
    console.error('Error fetching flash sales:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/flash-sales
 * Create a new flash sale
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const role = session.user.role as any;
    if (!['ADMIN', 'SELLER'].includes(role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validation = FlashSaleSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      );
    }

    // Get product details
    const product = await prisma.product.findUnique({
      where: { id: validation.data.productId },
      select: { name: true, vendorId: true },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Create flash sale (mock response)
    const sale = {
      id: `flash-${Date.now()}`,
      ...validation.data,
      productName: product.name,
      soldCount: 0,
      status: new Date(validation.data.startTime) > new Date() ? 'SCHEDULED' : 'ACTIVE',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ sale }, { status: 201 });
  } catch (error) {
    console.error('Error creating flash sale:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

