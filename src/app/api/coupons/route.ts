/**
 * Coupons API Route
 * Phase 26.2.2: Coupon Code System
 * 
 * GET /api/coupons - List coupons
 * POST /api/coupons - Create coupon
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema
const CouponSchema = z.object({
  code: z.string().min(3).max(20).toUpperCase(),
  discountType: z.enum(['PERCENTAGE', 'FIXED']),
  discountValue: z.number().positive(),
  minOrderValue: z.number().nonnegative().optional(),
  maxDiscount: z.number().positive().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  usageLimit: z.number().int().positive().optional(),
  perCustomerLimit: z.number().int().positive().optional(),
  description: z.string().max(500).optional(),
});

// Generate random coupon code
function generateCouponCode(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * GET /api/coupons
 * List coupons with filtering
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');

    // Build where clause
    const where: any = {};

    // Filter by vendor for sellers
    if ((session.user.role as any) === 'SELLER') {
      const vendor = await prisma.vendor.findFirst({
        where: { userId: session.user.id },
        select: { id: true },
      });
      if (vendor) {
        where.vendorId = vendor.id;
      }
    }

    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Return mock data for now
    const coupons = [
      {
        id: 'coup-1',
        code: 'WELCOME10',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        minOrderValue: 500,
        maxDiscount: 200,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
        usageLimit: 100,
        usageCount: 45,
        perCustomerLimit: 1,
        description: 'Welcome discount for new customers',
      },
      {
        id: 'coup-2',
        code: 'SAVE20',
        discountType: 'FIXED',
        discountValue: 200,
        minOrderValue: 1000,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
        usageLimit: 50,
        usageCount: 12,
        description: 'Save ₱200 on orders over ₱1000',
      },
    ];

    return NextResponse.json({ coupons });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/coupons
 * Create a new coupon
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
    
    // Auto-generate code if not provided
    if (!body.code) {
      body.code = generateCouponCode();
    }

    const validation = CouponSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      );
    }

    // Create coupon (mock response)
    const coupon = {
      id: `coup-${Date.now()}`,
      ...validation.data,
      isActive: true,
      usageCount: 0,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ coupon }, { status: 201 });
  } catch (error) {
    console.error('Error creating coupon:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

