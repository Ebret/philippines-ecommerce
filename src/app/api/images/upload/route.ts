/**
 * Bulk Image Upload API Route
 * Phase 26.3.1: Bulk Image Upload
 *
 * POST /api/images/upload - Upload multiple images
 *
 * Security: Integrated malware scanning via security-middleware
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import {
  scanFileUpload,
  imageUploadConfig,
  createBlockedResponse,
  applyPrivacyProtection,
} from '@/lib/security-middleware';

// Validation schema for upload request
const UploadSchema = z.object({
  productId: z.string().cuid().optional(),
  images: z.array(z.object({
    data: z.string(), // Base64 encoded image
    fileName: z.string(),
    mimeType: z.string(),
    altText: z.string().optional(),
  })).min(1).max(20),
});

/**
 * POST /api/images/upload
 * Upload multiple images for a product
 *
 * Security Features:
 * - Malware scanning on all uploaded files
 * - File type and extension validation
 * - File size limits
 * - Magic bytes verification
 * - Filename sanitization
 * - Security audit logging
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = UploadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { productId, images } = validation.data;
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userId = session.user?.id;

    // Security: Scan each image for malware before processing
    const uploadedImages = [];
    const securityErrors = [];

    for (let index = 0; index < images.length; index++) {
      const image = images[index];

      // Convert base64 to ArrayBuffer for scanning
      const base64Data = image.data.replace(/^data:image\/\w+;base64,/, '');
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const content = bytes.buffer;

      // Perform malware scan
      const securityResult = await scanFileUpload(
        {
          name: image.fileName,
          type: image.mimeType,
          size: content.byteLength,
          content,
        },
        imageUploadConfig,
        userId,
        ip
      );

      // Block upload if malware detected
      if (!securityResult.allowed) {
        securityErrors.push({
          fileName: image.fileName,
          errors: securityResult.errors,
          warnings: securityResult.warnings,
        });
        continue; // Skip this file
      }

      // File passed security checks - process upload
      uploadedImages.push({
        id: `img-${Date.now()}-${index}`,
        url: `/uploads/${securityResult.sanitizedFilename}`,
        thumbnailUrl: `/uploads/thumb-${securityResult.sanitizedFilename}`,
        fileName: securityResult.sanitizedFilename,
        mimeType: image.mimeType,
        altText: image.altText,
        productId,
        sortOrder: index,
        isPrimary: index === 0 && uploadedImages.length === 0,
        uploadedAt: new Date().toISOString(),
        securityHash: securityResult.scanResult?.fileHash,
      });
    }

    // If all files were rejected, return error
    if (uploadedImages.length === 0 && securityErrors.length > 0) {
      return createBlockedResponse(
        `All files rejected due to security violations: ${securityErrors.map(e => e.errors.join(', ')).join('; ')}`,
        400
      );
    }

    const response = NextResponse.json({
      success: true,
      images: uploadedImages,
      count: uploadedImages.length,
      securityWarnings: securityErrors.length > 0 ? securityErrors : undefined,
    });

    // Apply privacy protection headers
    return applyPrivacyProtection(response, request.headers);
  } catch (error) {
    console.error('Error uploading images:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

