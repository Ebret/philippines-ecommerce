import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const SearchResultsSchema = z.object({
  query: z.string().optional(),
  categoryId: z.string().optional(),
  minPrice: z.number().nonnegative().optional(),
  maxPrice: z.number().nonnegative().optional(),
  minRating: z.number().min(0).max(5).optional(),
  condition: z.enum(['NEW', 'USED', 'REFURBISHED']).optional(),
  brand: z.string().optional(),
  inStock: z.boolean().optional(),
  sortBy: z.enum(['newest', 'price_asc', 'price_desc', 'rating', 'sales']).default('newest'),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const params = {
      query: searchParams.get('query') || undefined,
      categoryId: searchParams.get('categoryId') || undefined,
      minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
      minRating: searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : undefined,
      condition: searchParams.get('condition') as any,
      brand: searchParams.get('brand') || undefined,
      inStock: searchParams.get('inStock') === 'true',
      sortBy: (searchParams.get('sortBy') || 'newest') as any,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
    };

    const validated = SearchResultsSchema.parse(params);
    const skip = (validated.page - 1) * validated.limit;

    // Build where clause
    const where: any = {
      status: 'ACTIVE',
    };

    if (validated.query) {
      where.OR = [
        { name: { contains: validated.query, mode: 'insensitive' } },
        { description: { contains: validated.query, mode: 'insensitive' } },
        { tags: { hasSome: [validated.query] } },
      ];
    }

    if (validated.categoryId) {
      where.categoryId = validated.categoryId;
    }

    if (validated.brand) {
      where.brand = { contains: validated.brand, mode: 'insensitive' };
    }

    if (validated.condition) {
      where.condition = validated.condition;
    }

    if (validated.minRating) {
      where.rating = { gte: validated.minRating };
    }

    // Build order by
    const orderBy: any = {};
    switch (validated.sortBy) {
      case 'price_asc':
        orderBy.variants = { _min: { price: 'asc' } };
        break;
      case 'price_desc':
        orderBy.variants = { _max: { price: 'desc' } };
        break;
      case 'rating':
        orderBy.rating = 'desc';
        break;
      case 'sales':
        orderBy.totalSales = 'desc';
        break;
      default:
        orderBy.createdAt = 'desc';
    }

    // Get products
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          vendor: { select: { storeName: true, rating: true } },
          category: { select: { name: true } },
          images: { where: { isPrimary: true }, take: 1 },
          variants: { select: { price: true, stockQuantity: true }, take: 1 },
        },
        orderBy,
        skip,
        take: validated.limit,
      }),
      prisma.product.count({ where }),
    ]);

    // Filter by price range if variants exist
    let filtered = products;
    if (validated.minPrice || validated.maxPrice) {
      filtered = products.filter(p => {
        const price = p.variants[0]?.price ? Number(p.variants[0].price) : 0;
        if (validated.minPrice && price < validated.minPrice) return false;
        if (validated.maxPrice && price > validated.maxPrice) return false;
        return true;
      });
    }

    // Filter by stock if needed
    if (validated.inStock) {
      filtered = filtered.filter(p => p.variants[0]?.stockQuantity > 0);
    }

    return NextResponse.json({
      products: filtered.map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.variants[0]?.price ? Number(p.variants[0].price) : 0,
        image: p.images[0]?.url || '/placeholder.jpg',
        rating: Number(p.rating),
        reviewCount: p.reviewCount,
        vendor: p.vendor?.storeName,
        inStock: (p.variants[0]?.stockQuantity || 0) > 0,
      })),
      pagination: {
        page: validated.page,
        limit: validated.limit,
        total,
        pages: Math.ceil(total / validated.limit),
      },
    });
  } catch (error) {
    console.error('Search results error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch search results' },
      { status: 500 }
    );
  }
}

