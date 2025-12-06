/**
 * Inventory Import API Route
 * Phase 26.1.7: Inventory Import/Export
 * 
 * POST /api/inventory/import - Import inventory from CSV/Excel
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// CSV parsing helper
function parseCSV(content: string): Record<string, string>[] {
  const lines = content.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    rows.push(row);
  }

  return rows;
}

// Validate import row
function validateRow(row: Record<string, string>, rowNumber: number) {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!row.SKU && !row.sku) {
    errors.push('SKU is required');
  }

  const quantity = parseInt(row.Quantity || row.quantity || '0');
  if (isNaN(quantity)) {
    errors.push('Invalid quantity');
  } else if (quantity < 0) {
    errors.push('Quantity cannot be negative');
  }

  const adjustmentType = row.AdjustmentType || row.adjustmentType;
  const validTypes = ['INITIAL_STOCK', 'PURCHASE', 'RETURN', 'DAMAGE', 'LOSS', 'CORRECTION', 'RECOUNT'];
  if (adjustmentType && !validTypes.includes(adjustmentType)) {
    warnings.push(`Unknown adjustment type: ${adjustmentType}`);
  }

  return {
    rowNumber,
    sku: row.SKU || row.sku || '',
    barcode: row.Barcode || row.barcode,
    quantity,
    location: row.Location || row.location,
    adjustmentType: adjustmentType || 'INITIAL_STOCK',
    reason: row.Reason || row.reason || 'Bulk import',
    errors,
    warnings,
  };
}

/**
 * POST /api/inventory/import
 * Import inventory data from CSV file
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permissions
    const role = session.user.role as any;
    if (!['ADMIN', 'SELLER'].includes(role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const validateOnly = formData.get('validateOnly') === 'true';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Read file content
    const content = await file.text();
    const parsedRows = parseCSV(content);

    if (parsedRows.length === 0) {
      return NextResponse.json({ error: 'No data found in file' }, { status: 400 });
    }

    // Validate all rows
    const validatedRows = parsedRows.map((row, index) => validateRow(row, index + 2));

    // If validation only, return preview
    if (validateOnly) {
      return NextResponse.json({ rows: validatedRows });
    }

    // Check for errors
    const hasErrors = validatedRows.some(r => r.errors.length > 0);
    if (hasErrors) {
      return NextResponse.json({
        success: false,
        totalRows: validatedRows.length,
        successCount: 0,
        errorCount: validatedRows.filter(r => r.errors.length > 0).length,
        warningCount: validatedRows.filter(r => r.warnings.length > 0).length,
        rows: validatedRows,
      });
    }

    // Process import
    let successCount = 0;
    for (const row of validatedRows) {
      try {
        // Find variant by SKU
        const variant = await prisma.productVariant.findFirst({
          where: { sku: row.sku },
        });

        if (variant) {
          // Update stock quantity
          await prisma.productVariant.update({
            where: { id: variant.id },
            data: { stockQuantity: { increment: row.quantity } },
          });

          // Create movement record
          await prisma.inventoryMovement.create({
            data: {
              variantId: variant.id,
              movementType: 'IN',
              quantity: row.quantity,
              referenceType: 'IMPORT',
              notes: row.reason,
              createdById: session.user.id,
            },
          });

          successCount++;
        }
      } catch (err) {
        console.error(`Error importing row ${row.rowNumber}:`, err);
      }
    }

    return NextResponse.json({
      success: successCount > 0,
      totalRows: validatedRows.length,
      successCount,
      errorCount: validatedRows.length - successCount,
      warningCount: validatedRows.filter(r => r.warnings.length > 0).length,
      rows: validatedRows,
    });
  } catch (error) {
    console.error('Error importing inventory:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

