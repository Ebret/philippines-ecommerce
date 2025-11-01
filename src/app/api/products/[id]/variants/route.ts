import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProductVariantSchema } from "@/lib/validations/product";
import { isSkuUnique, updateProductStatus } from "@/lib/product-utils";

/**
 * GET /api/products/[id]/variants
 * Get all variants for a product
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const variants = await prisma.productVariant.findMany({
      where: { productId: params.id },
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(variants);
  } catch (error) {
    console.error("Error fetching variants:", error);
    return NextResponse.json(
      { error: "Failed to fetch variants" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products/[id]/variants
 * Create a new product variant (Seller/Admin only)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(auth);

    if (!session || !["SELLER", "ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = ProductVariantSchema.parse(body);

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: params.id },
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

    // Check SKU uniqueness
    const isUnique = await isSkuUnique(validatedData.sku);
    if (!isUnique) {
      return NextResponse.json(
        { error: "SKU already exists" },
        { status: 400 }
      );
    }

    const variant = await prisma.productVariant.create({
      data: {
        ...validatedData,
        productId: params.id,
      },
      include: {
        images: true,
      },
    });

    // Update product status if needed
    await updateProductStatus(params.id);

    return NextResponse.json(variant, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json(
        { error: "Invalid variant data" },
        { status: 400 }
      );
    }

    console.error("Error creating variant:", error);
    return NextResponse.json(
      { error: "Failed to create variant" },
      { status: 500 }
    );
  }
}

