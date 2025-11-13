import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const SuggestionsSchema = z.object({
  query: z.string().min(1).max(100),
  limit: z.number().int().positive().max(10).default(5),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || '';
    const limit = parseInt(searchParams.get('limit') || '5');

    const validated = SuggestionsSchema.parse({ query, limit });

    // Get product suggestions
    const products = await prisma.product.findMany({
      where: {
        AND: [
          { status: 'ACTIVE' },
          {
            OR: [
              { name: { contains: validated.query, mode: 'insensitive' } },
              { description: { contains: validated.query, mode: 'insensitive' } },
              { tags: { hasSome: [validated.query] } },
            ],
          },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
      take: validated.limit,
      orderBy: { totalSales: 'desc' },
    });

    // Get category suggestions
    const categories = await prisma.category.findMany({
      where: {
        AND: [
          { isActive: true },
          { name: { contains: validated.query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
      take: 3,
    });

    // Get brand suggestions
    const brands = await prisma.product.findMany({
      where: {
        AND: [
          { status: 'ACTIVE' },
          { brand: { contains: validated.query, mode: 'insensitive' } },
        ],
      },
      select: { brand: true },
      distinct: ['brand'],
      take: 3,
    });

    return NextResponse.json({
      products: products.map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        type: 'product',
      })),
      categories: categories.map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        type: 'category',
      })),
      brands: brands
        .filter(b => b.brand)
        .map(b => ({
          name: b.brand,
          type: 'brand',
        })),
    });
  } catch (error) {
    console.error('Search suggestions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch suggestions' },
      { status: 500 }
    );
  }
}

