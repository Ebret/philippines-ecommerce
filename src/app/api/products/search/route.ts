import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildProductSearchQuery } from "@/lib/product-utils";
import { ProductSearchSchema } from "@/lib/validations/product";

/**
 * GET /api/products/search
 * Search and filter products
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse search parameters
    const query = searchParams.get("query") || undefined;
    const categoryId = searchParams.get("categoryId") || undefined;
    const vendorId = searchParams.get("vendorId") || undefined;
    const minPrice = searchParams.get("minPrice")
      ? parseFloat(searchParams.get("minPrice")!)
      : undefined;
    const maxPrice = searchParams.get("maxPrice")
      ? parseFloat(searchParams.get("maxPrice")!)
      : undefined;
    const minRating = searchParams.get("minRating")
      ? parseFloat(searchParams.get("minRating")!)
      : undefined;
    const condition = searchParams.get("condition") || undefined;
    const isFeatured = searchParams.get("isFeatured")
      ? searchParams.get("isFeatured") === "true"
      : undefined;
    const status = searchParams.get("status") || "ACTIVE";
    const sortBy = (searchParams.get("sortBy") || "newest") as
      | "newest"
      | "price_asc"
      | "price_desc"
      | "rating"
      | "sales";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);

    // Validate search parameters
    const validatedParams = ProductSearchSchema.parse({
      query,
      categoryId,
      vendorId,
      minPrice,
      maxPrice,
      minRating,
      condition,
      isFeatured,
      status,
      sortBy,
      page,
      limit,
    });

    const skip = (validatedParams.page - 1) * validatedParams.limit;

    // Build search query
    const searchQuery = buildProductSearchQuery({
      query: validatedParams.query,
      categoryId: validatedParams.categoryId,
      vendorId: validatedParams.vendorId,
      minPrice: validatedParams.minPrice,
      maxPrice: validatedParams.maxPrice,
      minRating: validatedParams.minRating,
      condition: validatedParams.condition,
      isFeatured: validatedParams.isFeatured,
      status: validatedParams.status,
    });

    // Determine sort order
    let orderBy: any = { createdAt: "desc" };
    switch (validatedParams.sortBy) {
      case "price_asc":
        orderBy = { variants: { _min: { price: "asc" } } };
        break;
      case "price_desc":
        orderBy = { variants: { _max: { price: "desc" } } };
        break;
      case "rating":
        orderBy = { rating: "desc" };
        break;
      case "sales":
        orderBy = { totalSales: "desc" };
        break;
      default:
        orderBy = { createdAt: "desc" };
    }

    // Execute search
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        ...searchQuery,
        include: {
          vendor: {
            select: {
              storeName: true,
              storeSlug: true,
              rating: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
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
        take: validatedParams.limit,
        orderBy,
      }),
      prisma.product.count({
        where: searchQuery.where,
      }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page: validatedParams.page,
        limit: validatedParams.limit,
        total,
        pages: Math.ceil(total / validatedParams.limit),
      },
      filters: {
        query: validatedParams.query,
        categoryId: validatedParams.categoryId,
        vendorId: validatedParams.vendorId,
        priceRange: {
          min: validatedParams.minPrice,
          max: validatedParams.maxPrice,
        },
        minRating: validatedParams.minRating,
        condition: validatedParams.condition,
        isFeatured: validatedParams.isFeatured,
        sortBy: validatedParams.sortBy,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json(
        { error: "Invalid search parameters" },
        { status: 400 }
      );
    }

    console.error("Error searching products:", error);
    return NextResponse.json(
      { error: "Failed to search products" },
      { status: 500 }
    );
  }
}

