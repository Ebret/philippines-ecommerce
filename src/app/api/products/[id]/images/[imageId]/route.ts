import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProductImageUpdateSchema } from "@/lib/validations/product";

/**
 * GET /api/products/[id]/images/[imageId]
 * Get a specific image
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const { id, imageId } = await params;
    const image = await prisma.productImage.findUnique({
      where: { id: imageId },
    });

    if (!image || image.productId !== id) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(image);
  } catch (error) {
    console.error("Error fetching image:", error);
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/products/[id]/images/[imageId]
 * Update an image (Seller/Admin only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const { id, imageId } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !["SELLER", "ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = ProductImageUpdateSchema.parse(body);

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id },
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
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
    }

    // Get existing image
    const existing = await prisma.productImage.findUnique({
      where: { id: imageId },
    });

    if (!existing || existing.productId !== id) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: 404 }
      );
    }

    // If this is the primary image, unset other primary images
    if (validatedData.isPrimary) {
      await prisma.productImage.updateMany({
        where: {
          productId: id,
          NOT: { id: imageId },
        },
        data: { isPrimary: false },
      });
    }

    const updated = await prisma.productImage.update({
      where: { id: imageId },
      data: validatedData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json(
        { error: "Invalid image data" },
        { status: 400 }
      );
    }

    console.error("Error updating image:", error);
    return NextResponse.json(
      { error: "Failed to update image" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/products/[id]/images/[imageId]
 * Delete an image (Seller/Admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const { id, imageId } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !["SELLER", "ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id },
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
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
    }

    // Get existing image
    const existing = await prisma.productImage.findUnique({
      where: { id: imageId },
    });

    if (!existing || existing.productId !== id) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: 404 }
      );
    }

    await prisma.productImage.delete({
      where: { id: imageId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}

