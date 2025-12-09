'use client';

/**
 * Inventory Import Component
 * Phase 26.1.7: Inventory Import/Export
 * 
 * Bulk import inventory data from CSV/Excel files.
 * Supports validation, preview, and error handling.
 */

import React, { useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Upload, FileSpreadsheet, AlertTriangle, Check, X,
  RefreshCw, Download, ChevronDown, ChevronUp
} from 'lucide-react';

// Types for import
export interface ImportRow {
  rowNumber: number;
  sku: string;
  barcode?: string;
  quantity: number;
  location?: string;
  adjustmentType?: string;
  reason?: string;
  errors: string[];
  warnings: string[];
}

export interface ImportResult {
  success: boolean;
  totalRows: number;
  successCount: number;
  errorCount: number;
  warningCount: number;
  rows: ImportRow[];
}

interface InventoryImportProps {
  onImportComplete?: (result: ImportResult) => void;
  className?: string;
}

export function InventoryImport({
  onImportComplete,
  className,
}: InventoryImportProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ImportRow[]>([]);
  const [importing, setImporting] = useState(false);
  const [validating, setValidating] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showErrors, setShowErrors] = useState(true);

  // Handle file selection
  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError(null);
    setResult(null);
    setValidating(true);

    try {
      // Parse and validate file
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('validateOnly', 'true');

      const response = await fetch('/api/inventory/import', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Validation failed');

      const data = await response.json();
      setPreview(data.rows || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to validate file');
    } finally {
      setValidating(false);
    }
  }, []);

  // Handle import
  const handleImport = useCallback(async () => {
    if (!file) return;

    setImporting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/inventory/import', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Import failed');

      const data = await response.json();
      setResult(data);
      onImportComplete?.(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed');
    } finally {
      setImporting(false);
    }
  }, [file, onImportComplete]);

  // Download template
  const handleDownloadTemplate = () => {
    const template = 'SKU,Barcode,Quantity,Location,AdjustmentType,Reason\nSKU001,1234567890123,100,Main Warehouse,INITIAL_STOCK,Initial inventory\n';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory-import-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Count errors and warnings
  const errorCount = preview.filter(r => r.errors.length > 0).length;
  const warningCount = preview.filter(r => r.warnings.length > 0).length;

  return (
    <Card className={cn('overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3">
        <div className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Import Inventory</h3>
        </div>
        <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
          <Download className="mr-2 h-4 w-4" />
          Template
        </Button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* File Upload */}
        <div className="mb-4">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-8 hover:border-primary/50 hover:bg-muted/30">
            <FileSpreadsheet className="mb-2 h-10 w-10 text-muted-foreground" />
            <span className="text-sm font-medium">
              {file ? file.name : 'Click to upload CSV or Excel file'}
            </span>
            <span className="text-xs text-muted-foreground">
              Supports .csv, .xlsx, .xls
            </span>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </div>

        {/* Validation Status */}
        {validating && (
          <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Validating file...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4" />
            {error}
          </div>
        )}

        {/* Preview Summary */}
        {preview.length > 0 && !result && (
          <div className="mb-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Preview ({preview.length} rows)</span>
              <div className="flex gap-2">
                {errorCount > 0 && (
                  <Badge variant="error">{errorCount} errors</Badge>
                )}
                {warningCount > 0 && (
                  <Badge variant="secondary">{warningCount} warnings</Badge>
                )}
              </div>
            </div>

            {/* Error/Warning Toggle */}
            {(errorCount > 0 || warningCount > 0) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowErrors(!showErrors)}
                className="w-full justify-between"
              >
                <span>Show issues</span>
                {showErrors ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            )}

            {/* Error List */}
            {showErrors && preview.filter(r => r.errors.length > 0 || r.warnings.length > 0).slice(0, 5).map((row) => (
              <div key={row.rowNumber} className="rounded-lg border border-border p-2 text-sm">
                <span className="font-medium">Row {row.rowNumber}: {row.sku}</span>
                {row.errors.map((err, i) => (
                  <p key={i} className="text-destructive">• {err}</p>
                ))}
                {row.warnings.map((warn, i) => (
                  <p key={i} className="text-amber-600">• {warn}</p>
                ))}
              </div>
            ))}

            {/* Import Button */}
            <Button
              onClick={handleImport}
              disabled={importing || errorCount > 0}
              className="w-full"
            >
              {importing ? (
                <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Importing...</>
              ) : (
                <><Check className="mr-2 h-4 w-4" /> Import {preview.length} rows</>
              )}
            </Button>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className={cn(
            'rounded-lg p-4',
            result.success ? 'bg-green-500/10' : 'bg-destructive/10'
          )}>
            <div className="flex items-center gap-2 mb-2">
              {result.success ? (
                <Check className="h-5 w-5 text-green-600" />
              ) : (
                <X className="h-5 w-5 text-destructive" />
              )}
              <span className="font-medium">
                {result.success ? 'Import Complete' : 'Import Failed'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {result.successCount} of {result.totalRows} rows imported successfully
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

