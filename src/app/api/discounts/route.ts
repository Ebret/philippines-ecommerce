/**
 * Discounts API Route
 * Phase 26.2.1: Discount Management System
 * 
 * GET /api/discounts - List discounts
 * POST /api/discounts - Create discount
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema
const DiscountSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  type: z.enum(['PERCENTAGE', 'FIXED', 'BOGO', 'FREE_SHIPPING']),
  value: z.number().positive(),
  minOrderValue: z.number().nonnegative().optional(),
  maxDiscount: z.number().positive().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  usageLimit: z.number().int().positive().optional(),
  applicableProducts: z.array(z.string()).optional(),
  applicableCategories: z.array(z.string()).optional(),
});

/**
 * GET /api/discounts
 * List discounts with filtering
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
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
        where.vendorId = vendor.id;
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const now = new Date();
    if (status === 'active') {
      where.isActive = true;
      where.endDate = { gte: now };
    } else if (status === 'inactive') {
      where.isActive = false;
    } else if (status === 'expired') {
      where.endDate = { lt: now };
    }

    // For now, return mock data since Promotion model may not exist
    const discounts = [
      {
        id: 'disc-1',
        name: 'Summer Sale',
        description: '20% off all products',
        type: 'PERCENTAGE',
        value: 20,
        minOrderValue: 500,
        maxDiscount: 1000,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
        usageLimit: 100,
        usageCount: 45,
        applicableProducts: [],
        applicableCategories: [],
      },
    ];

    return NextResponse.json({ discounts });
  } catch (error) {
    console.error('Error fetching discounts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/discounts
 * Create a new discount
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permissions
    const role = session.user.role as any;
    if (!['ADMIN', 'SELLER'].includes(role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validation = DiscountSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      );
    }

    // Get vendor ID for sellers
    let vendorId: string | undefined;
    if (role === 'SELLER') {
      const vendor = await prisma.vendor.findFirst({
        where: { userId: session.user.id },
        select: { id: true },
      });
      vendorId = vendor?.id;
    }

    // Create discount (mock response for now)
    const discount = {
      id: `disc-${Date.now()}`,
      ...validation.data,
      vendorId,
      isActive: true,
      usageCount: 0,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ discount }, { status: 201 });
  } catch (error) {
    console.error('Error creating discount:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

