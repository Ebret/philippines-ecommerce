/**
 * Inventory Locations API Route
 * Phase 26.1.4: Multi-location Inventory Management
 * 
 * GET /api/inventory/locations - List inventory locations
 * POST /api/inventory/locations - Create new location
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema for location creation
// Note: InventoryLocation model has: id, vendorId, name, code, addressId, isActive, createdAt
const LocationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().optional(),
  addressId: z.string().optional(),
});

/**
 * GET /api/inventory/locations
 * List inventory locations
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const vendorId = searchParams.get('vendorId') || undefined;
    const search = searchParams.get('search') || undefined;

    // Build where clause
    const where: any = {};

    // Filter by vendor for sellers
    if ((session.user.role as any) === 'SELLER') {
      const vendor = await prisma.vendor.findFirst({
        where: { userId: session.user.id },
        select: { id: true },
      });
      if (vendor) where.vendorId = vendor.id;
    } else if (vendorId) {
      where.vendorId = vendorId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
      ];
    }

    const locations = await prisma.inventoryLocation.findMany({
      where,
      include: {
        _count: { select: { inventoryItems: true } },
        address: true,
      },
      orderBy: [{ createdAt: 'desc' }, { name: 'asc' }],
    });

    // Get stats for each location
    const locationsWithStats = await Promise.all(
      locations.map(async (location) => {
        const items = await prisma.inventoryItem.findMany({
          where: { locationId: location.id },
          include: {
            variant: { select: { price: true, lowStockThreshold: true } },
          },
        });

        const stats = {
          totalItems: items.length,
          totalValue: items.reduce((sum, item) => 
            sum + (item.quantity * (item.variant?.price?.toNumber() || 0)), 0),
          lowStockCount: items.filter(item => 
            item.quantity <= (item.variant?.lowStockThreshold || 10) && item.quantity > 0).length,
          outOfStockCount: items.filter(item => item.quantity <= 0).length,
        };

        return { ...location, stats };
      })
    );

    return NextResponse.json({ locations: locationsWithStats });
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/inventory/locations
 * Create new inventory location
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if ((session.user.role as any) !== 'ADMIN' && (session.user.role as any) !== 'SELLER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const data = LocationSchema.parse(body);

    // Get vendor ID for seller
    let vendorId: string | undefined;
    if ((session.user.role as any) === 'SELLER') {
      const vendor = await prisma.vendor.findFirst({
        where: { userId: session.user.id },
        select: { id: true },
      });
      if (!vendor) {
        return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
      }
      vendorId = vendor.id;
    }

    const location = await prisma.inventoryLocation.create({
      data: {
        name: data.name,
        code: data.code,
        addressId: data.addressId,
        vendorId: vendorId || '',
        isActive: true,
      },
    });

    return NextResponse.json({ location }, { status: 201 });
  } catch (error) {
    console.error('Error creating location:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

