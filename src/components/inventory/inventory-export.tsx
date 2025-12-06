'use client';

/**
 * Inventory Export Component
 * Phase 26.1.7: Inventory Import/Export
 * 
 * Export inventory data to CSV/Excel with filtering options.
 */

import React, { useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Download, FileSpreadsheet, Filter, RefreshCw,
  Check, Calendar, Package
} from 'lucide-react';

// Types for export
export interface ExportOptions {
  format: 'csv' | 'xlsx';
  includeHistory: boolean;
  dateFrom?: string;
  dateTo?: string;
  locationId?: string;
  status?: string;
  columns: string[];
}

interface InventoryExportProps {
  className?: string;
  defaultOptions?: Partial<ExportOptions>;
}

const AVAILABLE_COLUMNS = [
  { id: 'sku', label: 'SKU', default: true },
  { id: 'barcode', label: 'Barcode', default: true },
  { id: 'productName', label: 'Product Name', default: true },
  { id: 'variantName', label: 'Variant Name', default: true },
  { id: 'quantity', label: 'Quantity', default: true },
  { id: 'reservedQuantity', label: 'Reserved', default: false },
  { id: 'availableQuantity', label: 'Available', default: true },
  { id: 'location', label: 'Location', default: true },
  { id: 'lowStockThreshold', label: 'Low Stock Threshold', default: false },
  { id: 'status', label: 'Status', default: true },
  { id: 'lastUpdated', label: 'Last Updated', default: false },
  { id: 'costPrice', label: 'Cost Price', default: false },
  { id: 'totalValue', label: 'Total Value', default: false },
];

export function InventoryExport({
  className,
  defaultOptions,
}: InventoryExportProps) {
  const [options, setOptions] = useState<ExportOptions>({
    format: 'csv',
    includeHistory: false,
    columns: AVAILABLE_COLUMNS.filter(c => c.default).map(c => c.id),
    ...defaultOptions,
  });
  const [exporting, setExporting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Toggle column selection
  const toggleColumn = (columnId: string) => {
    setOptions(prev => ({
      ...prev,
      columns: prev.columns.includes(columnId)
        ? prev.columns.filter(c => c !== columnId)
        : [...prev.columns, columnId],
    }));
  };

  // Handle export
  const handleExport = useCallback(async () => {
    setExporting(true);

    try {
      const params = new URLSearchParams({
        format: options.format,
        columns: options.columns.join(','),
        includeHistory: options.includeHistory.toString(),
      });

      if (options.dateFrom) params.append('dateFrom', options.dateFrom);
      if (options.dateTo) params.append('dateTo', options.dateTo);
      if (options.locationId) params.append('locationId', options.locationId);
      if (options.status) params.append('status', options.status);

      const response = await fetch(`/api/inventory/export?${params}`);
      
      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inventory-export-${new Date().toISOString().split('T')[0]}.${options.format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  }, [options]);

  return (
    <Card className={cn('overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3">
        <div className="flex items-center gap-2">
          <Download className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Export Inventory</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Format Selection */}
        <div>
          <label className="text-sm font-medium mb-2 block">Format</label>
          <div className="flex gap-2">
            <Button
              variant={options.format === 'csv' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setOptions(prev => ({ ...prev, format: 'csv' }))}
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              CSV
            </Button>
            <Button
              variant={options.format === 'xlsx' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setOptions(prev => ({ ...prev, format: 'xlsx' }))}
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Excel
            </Button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="space-y-3 rounded-lg border border-border p-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">From Date</label>
                <Input
                  type="date"
                  value={options.dateFrom || ''}
                  onChange={(e) => setOptions(prev => ({ ...prev, dateFrom: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">To Date</label>
                <Input
                  type="date"
                  value={options.dateTo || ''}
                  onChange={(e) => setOptions(prev => ({ ...prev, dateTo: e.target.value }))}
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={options.includeHistory}
                onChange={(e) => setOptions(prev => ({ ...prev, includeHistory: e.target.checked }))}
                className="rounded"
              />
              Include movement history
            </label>
          </div>
        )}

        {/* Column Selection */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Columns ({options.columns.length} selected)
          </label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_COLUMNS.map((column) => (
              <button
                key={column.id}
                onClick={() => toggleColumn(column.id)}
                className={cn(
                  'rounded-full px-3 py-1 text-xs transition-colors',
                  options.columns.includes(column.id)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                {options.columns.includes(column.id) && (
                  <Check className="mr-1 inline h-3 w-3" />
                )}
                {column.label}
              </button>
            ))}
          </div>
        </div>

        {/* Export Button */}
        <Button
          onClick={handleExport}
          disabled={exporting || options.columns.length === 0}
          className="w-full"
        >
          {exporting ? (
            <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Exporting...</>
          ) : (
            <><Download className="mr-2 h-4 w-4" /> Export Inventory</>
          )}
        </Button>
      </div>
    </Card>
  );
}

