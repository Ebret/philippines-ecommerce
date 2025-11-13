/**
 * POST /api/emails/unsubscribe
 * Unsubscribe user from emails
 * GET /api/emails/unsubscribe
 * Unsubscribe via token (for email links)
 */

import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email-service';
import { UnsubscribeSchema } from '@/lib/validations/email';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = UnsubscribeSchema.parse(body);

    const result = await emailService.unsubscribeUser(validated.unsubscribeToken);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully unsubscribed from emails',
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to unsubscribe' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Unsubscribe token is required' },
        { status: 400 }
      );
    }

    const result = await emailService.unsubscribeUser(token);

    if (!result.success) {
      return NextResponse.redirect(
        new URL('/email/unsubscribe-error', request.url)
      );
    }

    return NextResponse.redirect(
      new URL('/email/unsubscribe-success', request.url)
    );
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.redirect(
      new URL('/email/unsubscribe-error', request.url)
    );
  }
}

