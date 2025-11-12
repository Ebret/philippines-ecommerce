import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProductVariantUpdateSchema } from "@/lib/validations/product";
import { isSkuUnique, updateProductStatus } from "@/lib/product-utils";

/**
 * GET /api/products/[id]/variants/[variantId]
 * Get a specific variant
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; variantId: string }> }
) {
  try {
    const { id, variantId } = await params;
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    if (!variant || variant.productId !== id) {
      return NextResponse.json(
        { error: "Variant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(variant);
  } catch (error) {
    console.error("Error fetching variant:", error);
    return NextResponse.json(
      { error: "Failed to fetch variant" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/products/[id]/variants/[variantId]
 * Update a variant (Seller/Admin only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; variantId: string }> }
) {
  try {
    const { id, variantId } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !["SELLER", "ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = ProductVariantUpdateSchema.parse(body);

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

    // Get existing variant
    const existing = await prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!existing || existing.productId !== id) {
      return NextResponse.json(
        { error: "Variant not found" },
        { status: 404 }
      );
    }

    // Check SKU uniqueness if SKU is being updated
    if (validatedData.sku && validatedData.sku !== existing.sku) {
      const isUnique = await isSkuUnique(validatedData.sku, variantId);
      if (!isUnique) {
        return NextResponse.json(
          { error: "SKU already exists" },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.productVariant.update({
      where: { id: variantId },
      data: validatedData as any,
      include: {
        images: true,
      },
    });

    // Update product status if needed
    await updateProductStatus(id);

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json(
        { error: "Invalid variant data" },
        { status: 400 }
      );
    }

    console.error("Error updating variant:", error);
    return NextResponse.json(
      { error: "Failed to update variant" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/products/[id]/variants/[variantId]
 * Delete a variant (Seller/Admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; variantId: string }> }
) {
  try {
    const { id, variantId } = await params;
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

    // Get existing variant
    const existing = await prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!existing || existing.productId !== id) {
      return NextResponse.json(
        { error: "Variant not found" },
        { status: 404 }
      );
    }

    await prisma.productVariant.delete({
      where: { id: variantId },
    });

    // Update product status if needed
    await updateProductStatus(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting variant:", error);
    return NextResponse.json(
      { error: "Failed to delete variant" },
      { status: 500 }
    );
  }
}

