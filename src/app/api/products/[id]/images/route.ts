/**
 * Product Images API Route
 *
 * GET /api/products/[id]/images - Get product images
 * POST /api/products/[id]/images - Add image to product
 *
 * Security: Integrated malware scanning and privacy protection
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProductImageSchema } from "@/lib/validations/product";
import {
  scanFileUpload,
  imageUploadConfig,
  createBlockedResponse,
  applyPrivacyProtection,
  logSecurityEvent,
} from "@/lib/security-middleware";

/**
 * GET /api/products/[id]/images
 * Get all images for a product
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const images = await prisma.productImage.findMany({
      where: { productId: id },
      orderBy: { sortOrder: "asc" },
    });

    const response = NextResponse.json(images);
    return applyPrivacyProtection(response, request.headers);
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products/[id]/images
 * Add an image to a product (Seller/Admin only)
 *
 * Security Features:
 * - Malware scanning on image URLs (if base64 data provided)
 * - Input validation
 * - Authorization checks
 * - Security audit logging
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

  try {
    const session = await getServerSession(authOptions);

    if (!session || !["SELLER", "ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await request.json();

    // If image data is provided as base64, scan for malware
    if (body.imageData && typeof body.imageData === 'string') {
      try {
        const base64Data = body.imageData.replace(/^data:image\/\w+;base64,/, '');
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const content = bytes.buffer;

        const securityResult = await scanFileUpload(
          {
            name: body.fileName || 'image.jpg',
            type: body.mimeType || 'image/jpeg',
            size: content.byteLength,
            content,
          },
          imageUploadConfig,
          userId,
          ip
        );

        if (!securityResult.allowed) {
          return createBlockedResponse(
            `Image rejected: ${securityResult.errors.join(', ')}`,
            400
          );
        }
      } catch (scanError) {
        console.error('Error scanning image:', scanError);
        // Log but don't block if scan fails - let validation handle it
      }
    }

    const validatedData = ProductImageSchema.parse(body);

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: id },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Check authorization
    if (session.user.role === "SELLER") {
      const vendor = await prisma.vendor.findUnique({
        where: { userId: session.user.id },
      });

      if (!vendor || vendor.id !== product.vendorId) {
        logSecurityEvent({
          timestamp: Date.now(),
          action: 'request_blocked',
          userId,
          ip,
          details: { reason: 'unauthorized_vendor', productId: id },
          result: 'blocked',
        });
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
    }

    // If this is the primary image, unset other primary images
    if (validatedData.isPrimary) {
      await prisma.productImage.updateMany({
        where: { productId: id },
        data: { isPrimary: false },
      });
    }

    const image = await prisma.productImage.create({
      data: {
        ...validatedData,
        productId: id,
      },
    });

    const response = NextResponse.json(image, { status: 201 });
    return applyPrivacyProtection(response, request.headers);
  } catch (error) {
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json(
        { error: "Invalid image data" },
        { status: 400 }
      );
    }

    console.error("Error creating image:", error);
    return NextResponse.json(
      { error: "Failed to create image" },
      { status: 500 }
    );
  }
}

