import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProductSchema } from "@/lib/validations/product";
import { isSlugUnique, generateSlug, getProductWithRelations } from "@/lib/product-utils";

/**
 * GET /api/products
 * Get all products with pagination and filtering
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const vendorId = searchParams.get("vendorId");
    const categoryId = searchParams.get("categoryId");
    const status = searchParams.get("status");
    const isFeatured = searchParams.get("isFeatured");

    const skip = (page - 1) * limit;

    const where: any = {};
    if (vendorId) where.vendorId = vendorId;
    if (categoryId) where.categoryId = categoryId;
    if (status) where.status = status;
    if (isFeatured) where.isFeatured = isFeatured === "true";

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          vendor: {
            select: {
              storeName: true,
              storeSlug: true,
            },
          },
          category: true,
          images: {
            where: { isPrimary: true },
            take: 1,
          },
          variants: {
            select: { price: true },
            take: 1,
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products
 * Create a new product (Seller/Admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !["SELLER", "ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = ProductSchema.parse(body);

    // Get vendor ID
    let vendorId: string;
    if (session.user.role === "SELLER") {
      const vendor = await prisma.vendor.findUnique({
        where: { userId: session.user.id },
      });

      if (!vendor) {
        return NextResponse.json(
          { error: "Vendor profile not found" },
          { status: 404 }
        );
      }

      vendorId = vendor.id;
    } else {
      // Admin can specify vendorId in body
      vendorId = body.vendorId;
      if (!vendorId) {
        return NextResponse.json(
          { error: "vendorId is required for admin" },
          { status: 400 }
        );
      }
    }

    // Check slug uniqueness
    const slug = validatedData.slug || generateSlug(validatedData.name);
    const isUnique = await isSlugUnique(slug);

    if (!isUnique) {
      return NextResponse.json(
        { error: "Product slug already exists" },
        { status: 400 }
      );
    }

    // Verify category exists if provided
    if (validatedData.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: validatedData.categoryId },
      });

      if (!category) {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 404 }
        );
      }
    }

    const product = await prisma.product.create({
      data: {
        ...validatedData,
        slug,
        vendorId,
      } as any,
      include: {
        vendor: {
          select: {
            storeName: true,
            storeSlug: true,
          },
        },
        category: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json(
        { error: "Invalid product data" },
        { status: 400 }
      );
    }

    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

