/**
 * Inventory Movements API Route
 * Phase 26.1.2: Inventory Adjustment Workflow
 * 
 * GET /api/inventory/movements - List inventory movements (audit log)
 * Provides history of all inventory adjustments with filtering and pagination.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/inventory/movements
 * List inventory movements with filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const variantId = searchParams.get('variantId') || undefined;
    const locationId = searchParams.get('locationId') || undefined;
    const movementType = searchParams.get('movementType') || undefined;
    const search = searchParams.get('search') || undefined;
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;

    // Build where clause
    const where: any = {};

    if (variantId) where.variantId = variantId;
    if (locationId) where.locationId = locationId;
    if (movementType && movementType !== 'all') where.movementType = movementType;

    // Search by reference ID
    if (search) {
      where.OR = [
        { referenceId: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Date range filter
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    // Filter by vendor if user is a seller
    if ((session.user.role as any) === 'SELLER') {
      where.location = {
        vendor: { userId: session.user.id },
      };
    }

    // Get total count
    const total = await prisma.inventoryMovement.count({ where });

    // Get movements with related data
    const movements = await prisma.inventoryMovement.findMany({
      where,
      include: {
        variant: {
          select: {
            id: true,
            name: true,
            sku: true,
            product: { select: { name: true } },
          },
        },
        location: { select: { id: true, name: true } },
        createdBy: {
          select: {
            id: true,
            email: true,
            profile: { select: { firstName: true, lastName: true } }
          }
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Transform to include user name from profile
    const transformedMovements = movements.map(m => {
      const userName = m.createdBy?.profile
        ? `${m.createdBy.profile.firstName || ''} ${m.createdBy.profile.lastName || ''}`.trim() || 'Unknown'
        : 'System';
      return {
        ...m,
        createdBy: m.createdBy ? {
          id: m.createdBy.id,
          name: userName,
          email: m.createdBy.email,
        } : null,
      };
    });

    return NextResponse.json({
      movements: transformedMovements,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching movements:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

