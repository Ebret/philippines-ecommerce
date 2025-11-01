import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CategoryUpdateSchema } from "@/lib/validations/product";
import { isCategorySlugUnique, generateSlug } from "@/lib/product-utils";

/**
 * GET /api/categories/[id]
 * Get a specific category with its hierarchy
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        parent: true,
        children: true,
        translations: true,
        products: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
          take: 10,
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/categories/[id]
 * Update a category (Admin only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(auth);

    if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = CategoryUpdateSchema.parse(body);

    // Check if category exists
    const existing = await prisma.category.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Check slug uniqueness if slug is being updated
    if (validatedData.slug && validatedData.slug !== existing.slug) {
      const isUnique = await isCategorySlugUnique(validatedData.slug, params.id);
      if (!isUnique) {
        return NextResponse.json(
          { error: "Category slug already exists" },
          { status: 400 }
        );
      }
    }

    // Verify parent category exists if provided
    if (validatedData.parentId && validatedData.parentId !== existing.parentId) {
      const parent = await prisma.category.findUnique({
        where: { id: validatedData.parentId },
      });

      if (!parent) {
        return NextResponse.json(
          { error: "Parent category not found" },
          { status: 404 }
        );
      }

      // Prevent circular hierarchy
      if (parent.parentId === params.id) {
        return NextResponse.json(
          { error: "Cannot create circular category hierarchy" },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.category.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        children: true,
        translations: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json(
        { error: "Invalid category data" },
        { status: 400 }
      );
    }

    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/categories/[id]
 * Delete a category (Admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(auth);

    if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        children: true,
        products: true,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Check if category has children or products
    if (category.children.length > 0 || category.products.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete category with subcategories or products" },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}

