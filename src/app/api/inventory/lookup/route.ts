/**
 * Inventory Lookup API Route
 * Phase 26.1.6: Barcode/SKU Scanning
 * 
 * GET /api/inventory/lookup - Lookup products by barcode, SKU, or name
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/inventory/lookup
 * Search for products by barcode, SKU, or name
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const barcode = searchParams.get('barcode');
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build where clause
    let where: any = {};

    if (barcode) {
      // Exact barcode match
      where = {
        OR: [
          { barcode: barcode },
          { sku: barcode },
        ],
      };
    } else if (query) {
      // Search by name, SKU, or barcode
      where = {
        OR: [
          { sku: { contains: query, mode: 'insensitive' } },
          { barcode: { contains: query, mode: 'insensitive' } },
          { name: { contains: query, mode: 'insensitive' } },
          { product: { name: { contains: query, mode: 'insensitive' } } },
        ],
      };
    } else {
      return NextResponse.json({ error: 'barcode or q parameter required' }, { status: 400 });
    }

    // Filter by vendor for sellers
    if ((session.user.role as any) === 'SELLER') {
      const vendor = await prisma.vendor.findFirst({
        where: { userId: session.user.id },
        select: { id: true },
      });
      if (vendor) {
        where.product = { ...where.product, vendorId: vendor.id };
      }
    }

    // Search variants
    const variants = await prisma.productVariant.findMany({
      where,
      take: limit,
      include: {
        product: {
          select: {
            id: true,
            name: true,
          },
        },
        inventoryItems: {
          select: {
            quantity: true,
            location: { select: { name: true } },
          },
        },
      },
    });

    // Format results
    const results = variants.map((variant) => {
      const totalStock = variant.inventoryItems.reduce((sum, item) => sum + item.quantity, 0);
      const location = variant.inventoryItems[0]?.location?.name;

      return {
        id: variant.id,
        variantId: variant.id,
        productName: variant.product?.name || 'Unknown',
        variantName: variant.name,
        sku: variant.sku || '',
        barcode: variant.barcode,
        currentStock: variant.stockQuantity || totalStock,
        price: variant.price?.toNumber() || 0,
        lowStockThreshold: variant.lowStockThreshold || 10,
        location,
      };
    });

    // For barcode lookup, return single product
    if (barcode) {
      const product = results[0] || null;
      return NextResponse.json({ product });
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error in inventory lookup:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

