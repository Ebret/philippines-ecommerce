import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { vendor: true },
    });

    if (!user?.vendor) {
      return NextResponse.json({ error: 'Not a vendor' }, { status: 403 });
    }

    const vendorId = user.vendor.id;
    const sortBy = request.nextUrl.searchParams.get('sortBy') || 'revenue';

    // Get products with sales data
    const products = await prisma.product.findMany({
      where: { vendorId },
      include: {
        orderItems: {
          include: { order: true },
        },
        reviews: true,
        variants: true,
      },
    });

    const productPerformance = products.map(product => {
      const sales = product.orderItems.reduce((sum, item) => sum + item.quantity, 0);
      const revenue = product.orderItems.reduce((sum, item) => {
        const price = typeof item.unitPrice === 'string' ? parseFloat(item.unitPrice) : Number(item.unitPrice);
        return sum + (price * item.quantity);
      }, 0);
      const rating = product.reviews.length > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
        : 0;
      const totalStock = product.variants.reduce((sum, v) => sum + v.stockQuantity, 0);

      return {
        id: product.id,
        name: product.name,
        sku: product.variants[0]?.sku || 'N/A',
        sales,
        revenue,
        rating: Number(rating),
        stock: totalStock,
        status: product.status,
      };
    });

    // Sort
    let sorted = [...productPerformance];
    if (sortBy === 'revenue') {
      sorted.sort((a, b) => b.revenue - a.revenue);
    } else if (sortBy === 'sales') {
      sorted.sort((a, b) => b.sales - a.sales);
    } else if (sortBy === 'rating') {
      sorted.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'stock') {
      sorted.sort((a, b) => a.stock - b.stock);
    }

    return NextResponse.json({
      products: sorted,
    });
  } catch (error) {
    console.error('Product performance error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product performance' },
      { status: 500 }
    );
  }
}

