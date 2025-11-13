import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get price range
    const priceStats = await prisma.productVariant.aggregate({
      _min: { price: true },
      _max: { price: true },
    });

    // Get categories
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        _count: { select: { products: true } },
      },
      orderBy: { sortOrder: 'asc' },
    });

    // Get brands
    const brands = await prisma.product.findMany({
      where: { status: 'ACTIVE', brand: { not: null } },
      select: { brand: true },
      distinct: ['brand'],
      orderBy: { brand: 'asc' },
    });

    // Get conditions
    const conditions = ['NEW', 'USED', 'REFURBISHED'];

    // Get rating distribution
    const ratings = [
      { stars: 5, count: 0 },
      { stars: 4, count: 0 },
      { stars: 3, count: 0 },
      { stars: 2, count: 0 },
      { stars: 1, count: 0 },
    ];

    for (let i = 0; i < ratings.length; i++) {
      const minRating = ratings[i].stars;
      const maxRating = ratings[i].stars + 1;
      const count = await prisma.product.count({
        where: {
          status: 'ACTIVE',
          rating: {
            gte: minRating,
            lt: maxRating,
          },
        },
      });
      ratings[i].count = count;
    }

    const minPrice = priceStats._min.price ? Number(priceStats._min.price) : 0;
    const maxPrice = priceStats._max.price ? Number(priceStats._max.price) : 100000;

    return NextResponse.json({
      priceRange: {
        min: minPrice,
        max: maxPrice,
      },
      categories: categories.map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        count: c._count.products,
      })),
      brands: brands
        .filter(b => b.brand)
        .map(b => ({
          name: b.brand,
        })),
      conditions,
      ratings,
    });
  } catch (error) {
    console.error('Search filters error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch filters' },
      { status: 500 }
    );
  }
}

