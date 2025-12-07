/**
 * Review Moderation API
 * Phase 26.4.3: Product Review Moderation
 * 
 * Endpoints:
 * - GET: List reviews for moderation
 * - POST: Moderate review (approve/reject/flag)
 * - PATCH: Bulk moderate reviews
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schemas
const moderateSchema = z.object({
  reviewId: z.string().min(1, 'Review ID is required'),
  action: z.enum(['approve', 'reject', 'flag', 'delete']),
  reason: z.string().optional(),
  note: z.string().max(500).optional(),
});

const bulkModerateSchema = z.object({
  reviewIds: z.array(z.string()).min(1, 'At least one review ID is required'),
  action: z.enum(['approve', 'reject', 'flag', 'delete']),
  reason: z.string().optional(),
});

// GET - List reviews for moderation
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Mock response - in production, fetch from database
    const reviews = [
      {
        id: 'rev-1',
        productId: 'prod-1',
        productName: 'Herbal Tea Blend',
        userId: 'user-1',
        userName: 'Juan Dela Cruz',
        rating: 5,
        title: 'Excellent product!',
        content: 'This herbal tea is amazing. Helped me sleep better.',
        status: 'pending',
        isVerifiedPurchase: true,
        helpfulCount: 12,
        reportCount: 0,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'rev-2',
        productId: 'prod-2',
        productName: 'Essential Oil Set',
        userId: 'user-2',
        userName: 'Maria Santos',
        rating: 4,
        title: 'Good quality',
        content: 'Nice oils but packaging could be better.',
        status: 'pending',
        isVerifiedPurchase: true,
        helpfulCount: 5,
        reportCount: 0,
        createdAt: new Date().toISOString(),
      },
    ];

    const filtered = status === 'all' 
      ? reviews 
      : reviews.filter(r => r.status === status);

    return NextResponse.json({
      success: true,
      data: filtered,
      pagination: {
        page,
        limit,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / limit),
      },
      stats: {
        total: reviews.length,
        pending: reviews.filter(r => r.status === 'pending').length,
        approved: reviews.filter(r => r.status === 'approved').length,
        rejected: reviews.filter(r => r.status === 'rejected').length,
        flagged: reviews.filter(r => r.status === 'flagged').length,
      },
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST - Moderate single review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = moderateSchema.parse(body);

    // Mock response - in production, update in database
    const statusMap = {
      approve: 'approved',
      reject: 'rejected',
      flag: 'flagged',
      delete: 'deleted',
    };

    return NextResponse.json({
      success: true,
      data: {
        reviewId: validated.reviewId,
        newStatus: statusMap[validated.action],
        moderatedAt: new Date().toISOString(),
      },
      message: `Review ${validated.action}d successfully`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error moderating review:', error);
    return NextResponse.json(
      { error: 'Failed to moderate review' },
      { status: 500 }
    );
  }
}

// PATCH - Bulk moderate reviews
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = bulkModerateSchema.parse(body);

    // Mock response - in production, update in database
    const statusMap = {
      approve: 'approved',
      reject: 'rejected',
      flag: 'flagged',
      delete: 'deleted',
    };

    return NextResponse.json({
      success: true,
      data: {
        reviewIds: validated.reviewIds,
        newStatus: statusMap[validated.action],
        count: validated.reviewIds.length,
        moderatedAt: new Date().toISOString(),
      },
      message: `${validated.reviewIds.length} reviews ${validated.action}d successfully`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error bulk moderating reviews:', error);
    return NextResponse.json(
      { error: 'Failed to bulk moderate reviews' },
      { status: 500 }
    );
  }
}

