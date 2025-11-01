import { prisma } from "./prisma";
import { Prisma } from "@prisma/client";

/**
 * Generate a unique slug from a name
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Check if a slug is unique
 */
export async function isSlugUnique(
  slug: string,
  excludeId?: string
): Promise<boolean> {
  const existing = await prisma.product.findFirst({
    where: {
      slug,
      ...(excludeId && { NOT: { id: excludeId } }),
    },
  });
  return !existing;
}

/**
 * Check if a category slug is unique
 */
export async function isCategorySlugUnique(
  slug: string,
  excludeId?: string
): Promise<boolean> {
  const existing = await prisma.category.findFirst({
    where: {
      slug,
      ...(excludeId && { NOT: { id: excludeId } }),
    },
  });
  return !existing;
}

/**
 * Check if a SKU is unique
 */
export async function isSkuUnique(
  sku: string,
  excludeId?: string
): Promise<boolean> {
  const existing = await prisma.productVariant.findFirst({
    where: {
      sku,
      ...(excludeId && { NOT: { id: excludeId } }),
    },
  });
  return !existing;
}

/**
 * Get product with all relations
 */
export async function getProductWithRelations(productId: string) {
  return prisma.product.findUnique({
    where: { id: productId },
    include: {
      vendor: {
        select: {
          id: true,
          storeName: true,
          storeSlug: true,
          rating: true,
          reviewCount: true,
        },
      },
      category: true,
      variants: {
        include: {
          images: true,
        },
      },
      images: {
        orderBy: { sortOrder: "asc" },
      },
      translations: true,
      reviews: {
        take: 5,
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

/**
 * Get category with hierarchy
 */
export async function getCategoryWithHierarchy(categoryId: string) {
  return prisma.category.findUnique({
    where: { id: categoryId },
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
        take: 5,
      },
    },
  });
}

/**
 * Build product search query
 */
export function buildProductSearchQuery(filters: {
  query?: string;
  categoryId?: string;
  vendorId?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  condition?: string;
  isFeatured?: boolean;
  status?: string;
}): Prisma.ProductFindManyArgs {
  const where: Prisma.ProductWhereInput = {
    status: filters.status || "ACTIVE",
  };

  if (filters.query) {
    where.OR = [
      { name: { contains: filters.query, mode: "insensitive" } },
      { description: { contains: filters.query, mode: "insensitive" } },
      { tags: { hasSome: [filters.query] } },
    ];
  }

  if (filters.categoryId) {
    where.categoryId = filters.categoryId;
  }

  if (filters.vendorId) {
    where.vendorId = filters.vendorId;
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.variants = {
      some: {
        price: {
          ...(filters.minPrice !== undefined && { gte: filters.minPrice }),
          ...(filters.maxPrice !== undefined && { lte: filters.maxPrice }),
        },
      },
    };
  }

  if (filters.minRating !== undefined) {
    where.rating = { gte: filters.minRating };
  }

  if (filters.condition) {
    where.condition = filters.condition as any;
  }

  if (filters.isFeatured !== undefined) {
    where.isFeatured = filters.isFeatured;
  }

  return { where };
}

/**
 * Calculate product statistics
 */
export async function calculateProductStats(productId: string) {
  const [totalSales, reviewCount, avgRating] = await Promise.all([
    prisma.orderItem.count({
      where: { productId },
    }),
    prisma.review.count({
      where: { productId },
    }),
    prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
    }),
  ]);

  return {
    totalSales,
    reviewCount,
    avgRating: avgRating._avg.rating || 0,
  };
}

/**
 * Update product status based on stock
 */
export async function updateProductStatus(productId: string) {
  const variants = await prisma.productVariant.findMany({
    where: { productId },
    select: { stockQuantity: true },
  });

  const totalStock = variants.reduce((sum, v) => sum + v.stockQuantity, 0);

  const newStatus = totalStock === 0 ? "OUT_OF_STOCK" : "ACTIVE";

  return prisma.product.update({
    where: { id: productId },
    data: { status: newStatus as any },
  });
}

/**
 * Get low stock products for a vendor
 */
export async function getLowStockProducts(vendorId: string) {
  return prisma.productVariant.findMany({
    where: {
      product: { vendorId },
      stockQuantity: {
        lte: prisma.productVariant.fields.lowStockThreshold,
      },
    },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(limit: number = 10) {
  return prisma.product.findMany({
    where: {
      isFeatured: true,
      status: "ACTIVE",
    },
    include: {
      vendor: {
        select: {
          storeName: true,
          storeSlug: true,
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
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}

