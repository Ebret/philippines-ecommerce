/**
 * Audit Logs API Route
 * Phase 26.1.3: Inventory History & Audit Logs
 * 
 * GET /api/inventory/audit-logs - Get audit logs for inventory operations
 * Provides detailed audit trail for compliance and tracking.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/inventory/audit-logs
 * Get audit logs with filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate user - only ADMIN can view audit logs
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can view full audit logs
    if ((session.user.role as any) !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const entityType = searchParams.get('entityType') || undefined;
    const entityId = searchParams.get('entityId') || undefined;
    const userId = searchParams.get('userId') || undefined;
    const search = searchParams.get('search') || undefined;

    // Build where clause for movements (as audit log proxy)
    const where: any = {};

    if (entityId) where.variantId = entityId;
    if (userId) where.createdById = userId;

    // Search by reference ID or notes
    if (search) {
      where.OR = [
        { referenceId: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } },
        { variantId: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get total count
    const total = await prisma.inventoryMovement.count({ where });

    // Get movements as audit log entries
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
        createdBy: { select: { id: true, name: true, email: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Transform to audit log format
    const logs = movements.map(m => ({
      id: m.id,
      entityType: 'INVENTORY' as const,
      entityId: m.variantId,
      action: `${m.movementType}_STOCK`,
      changes: {
        quantity: {
          old: null,
          new: m.quantity,
        },
      },
      metadata: {
        locationId: m.locationId,
        referenceType: m.referenceType,
        referenceId: m.referenceId,
        notes: m.notes,
      },
      userId: m.createdById || '',
      user: m.createdBy || { name: 'System', email: 'system@example.com', role: 'SYSTEM' },
      createdAt: m.createdAt.toISOString(),
    }));

    return NextResponse.json({
      logs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

