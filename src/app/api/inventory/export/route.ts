/**
 * Inventory Export API Route
 * Phase 26.1.7: Inventory Import/Export
 * 
 * GET /api/inventory/export - Export inventory to CSV/Excel
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Generate CSV content
function generateCSV(data: Record<string, any>[], columns: string[]): string {
  const headers = columns.join(',');
  const rows = data.map(row => 
    columns.map(col => {
      const value = row[col];
      if (value === null || value === undefined) return '';
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return String(value);
    }).join(',')
  );
  return [headers, ...rows].join('\n');
}

/**
 * GET /api/inventory/export
 * Export inventory data to CSV
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get('format') || 'csv';
    const columns = (searchParams.get('columns') || 'sku,productName,quantity').split(',');
    const includeHistory = searchParams.get('includeHistory') === 'true';
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const locationId = searchParams.get('locationId');
    const status = searchParams.get('status');

    // Build where clause
    const where: any = {};
    
    if (locationId) {
      where.inventoryItems = { some: { locationId } };
    }

    // Filter by vendor for sellers
    if ((session.user.role as any) === 'SELLER') {
      const vendor = await prisma.vendor.findFirst({
        where: { userId: session.user.id },
        select: { id: true },
      });
      if (vendor) {
        where.product = { vendorId: vendor.id };
      }
    }

    // Fetch inventory data
    const variants = await prisma.productVariant.findMany({
      where,
      include: {
        product: { select: { name: true } },
        inventoryItems: {
          include: { location: { select: { name: true } } },
        },
      },
    });

    // Transform data for export
    const exportData = variants.map(variant => {
      const totalQuantity = variant.inventoryItems.reduce((sum, item) => sum + item.quantity, 0);
      const reservedQuantity = variant.inventoryItems.reduce((sum, item) => sum + item.reservedQuantity, 0);
      const location = variant.inventoryItems[0]?.location?.name || '';

      // Determine status
      let inventoryStatus = 'IN_STOCK';
      if (totalQuantity <= 0) inventoryStatus = 'OUT_OF_STOCK';
      else if (totalQuantity <= (variant.lowStockThreshold || 10)) inventoryStatus = 'LOW_STOCK';

      return {
        sku: variant.sku || '',
        barcode: variant.barcode || '',
        productName: variant.product?.name || '',
        variantName: variant.name || '',
        quantity: variant.stockQuantity || totalQuantity,
        reservedQuantity,
        availableQuantity: (variant.stockQuantity || totalQuantity) - reservedQuantity,
        location,
        lowStockThreshold: variant.lowStockThreshold || 10,
        status: inventoryStatus,
        lastUpdated: variant.updatedAt?.toISOString() || '',
        costPrice: variant.costPrice?.toNumber() || 0,
        totalValue: (variant.costPrice?.toNumber() || 0) * (variant.stockQuantity || totalQuantity),
      };
    });

    // Filter by status if specified
    const filteredData = status 
      ? exportData.filter(d => d.status === status)
      : exportData;

    // Generate CSV
    const csv = generateCSV(filteredData, columns);

    // Return as downloadable file
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="inventory-export-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error exporting inventory:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

