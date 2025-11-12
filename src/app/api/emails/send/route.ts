/**
 * POST /api/emails/send
 * Send email directly
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { emailService } from '@/lib/email-service';
import { EmailSendSchema } from '@/lib/validations/email';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Only admins can send emails directly
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validated = EmailSendSchema.parse(body);

    const result = await emailService.sendEmail({
      to: validated.to,
      subject: validated.subject,
      html: validated.html,
      text: validated.text,
      from: validated.from,
      replyTo: validated.replyTo,
      cc: validated.cc,
      bcc: validated.bcc,
      attachments: validated.attachments,
      headers: validated.headers as Record<string, string> | undefined,
      tags: validated.tags,
      metadata: validated.metadata,
      trackingId: validated.trackingId,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        messageId: result.messageId,
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

    console.error('Email send error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}

