import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CategorySchema } from "@/lib/validations/product";
import { isCategorySlugUnique, generateSlug } from "@/lib/product-utils";

/**
 * GET /api/categories
 * Get all categories with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const parentId = searchParams.get("parentId");
    const isActive = searchParams.get("isActive");

    const categories = await prisma.category.findMany({
      where: {
        ...(parentId && { parentId }),
        ...(isActive !== null && { isActive: isActive === "true" }),
      },
      include: {
        children: true,
        translations: true,
        _count: {
          select: { products: true },
        },
      },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/categories
 * Create a new category (Admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = CategorySchema.parse(body);

    // Check slug uniqueness
    const slug = validatedData.slug || generateSlug(validatedData.name);
    const isUnique = await isCategorySlugUnique(slug);

    if (!isUnique) {
      return NextResponse.json(
        { error: "Category slug already exists" },
        { status: 400 }
      );
    }

    // Verify parent category exists if provided
    if (validatedData.parentId) {
      const parent = await prisma.category.findUnique({
        where: { id: validatedData.parentId },
      });

      if (!parent) {
        return NextResponse.json(
          { error: "Parent category not found" },
          { status: 404 }
        );
      }
    }

    const category = await prisma.category.create({
      data: {
        ...validatedData,
        slug,
      },
      include: {
        children: true,
        translations: true,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json(
        { error: "Invalid category data" },
        { status: 400 }
      );
    }

    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}

