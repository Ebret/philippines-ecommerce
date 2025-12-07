/**
 * ProductImportExport Component
 * Phase 26.4.5: Product Import/Export
 * 
 * Features:
 * - CSV/JSON import
 * - Bulk export
 * - Field mapping
 * - Validation preview
 */

'use client';

import { useState, useCallback } from 'react';
import { 
  Upload, Download, FileSpreadsheet, FileJson, 
  AlertCircle, Check, X, Loader2, Eye 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ImportProduct {
  name: string;
  sku: string;
  price: number;
  description?: string;
  category?: string;
  stock?: number;
  images?: string[];
  [key: string]: unknown;
}

export interface ImportResult {
  success: boolean;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  errors: { row: number; field: string; message: string }[];
  products: ImportProduct[];
}

interface ProductImportExportProps {
  onImport: (products: ImportProduct[]) => Promise<void>;
  onExport: (format: 'csv' | 'json') => Promise<void>;
  productCount: number;
  className?: string;
}

export function ProductImportExport({
  onImport,
  onExport,
  productCount,
  className,
}: ProductImportExportProps) {
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<ImportProduct[]>([]);

  // Parse CSV
  const parseCSV = useCallback((content: string): ImportProduct[] => {
    const lines = content.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const products: ImportProduct[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const product: ImportProduct = { name: '', sku: '', price: 0 };

      headers.forEach((header, index) => {
        const value = values[index] || '';
        if (header === 'price' || header === 'stock') {
          product[header] = parseFloat(value) || 0;
        } else if (header === 'images') {
          product[header] = value.split(';').filter(Boolean);
        } else {
          product[header] = value;
        }
      });

      products.push(product);
    }

    return products;
  }, []);

  // Parse JSON
  const parseJSON = useCallback((content: string): ImportProduct[] => {
    try {
      const data = JSON.parse(content);
      return Array.isArray(data) ? data : data.products || [];
    } catch {
      return [];
    }
  }, []);

  // Validate products
  const validateProducts = useCallback((products: ImportProduct[]): ImportResult => {
    const errors: ImportResult['errors'] = [];
    let validRows = 0;

    products.forEach((product, index) => {
      const row = index + 2; // Account for header row
      let isValid = true;

      if (!product.name) {
        errors.push({ row, field: 'name', message: 'Name is required' });
        isValid = false;
      }
      if (!product.sku) {
        errors.push({ row, field: 'sku', message: 'SKU is required' });
        isValid = false;
      }
      if (product.price < 0) {
        errors.push({ row, field: 'price', message: 'Price must be positive' });
        isValid = false;
      }

      if (isValid) validRows++;
    });

    return {
      success: errors.length === 0,
      totalRows: products.length,
      validRows,
      invalidRows: products.length - validRows,
      errors,
      products,
    };
  }, []);

  // Handle file select
  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setIsProcessing(true);

    try {
      const content = await file.text();
      const isJSON = file.name.endsWith('.json');
      const products = isJSON ? parseJSON(content) : parseCSV(content);
      const result = validateProducts(products);

      setImportResult(result);
      setPreviewData(products.slice(0, 5));
    } catch (error) {
      setImportResult({
        success: false,
        totalRows: 0,
        validRows: 0,
        invalidRows: 0,
        errors: [{ row: 0, field: 'file', message: 'Failed to parse file' }],
        products: [],
      });
    } finally {
      setIsProcessing(false);
    }
  }, [parseCSV, parseJSON, validateProducts]);

  // Handle import
  const handleImport = async () => {
    if (!importResult || importResult.validRows === 0) return;

    setIsProcessing(true);
    try {
      await onImport(importResult.products.filter((_, i) => {
        const row = i + 2;
        return !importResult.errors.some(e => e.row === row);
      }));
      setImportResult(null);
      setSelectedFile(null);
      setPreviewData([]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle export
  const handleExport = async (format: 'csv' | 'json') => {
    setIsProcessing(true);
    try {
      await onExport(format);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('import')}
          className={cn(
            'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
            activeTab === 'import'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          <Upload className="w-4 h-4 inline mr-2" />
          Import Products
        </button>
        <button
          onClick={() => setActiveTab('export')}
          className={cn(
            'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
            activeTab === 'export'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          <Download className="w-4 h-4 inline mr-2" />
          Export Products
        </button>
      </div>

      {/* Import Tab */}
      {activeTab === 'import' && (
        <div className="space-y-6">
          {/* File Upload */}
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <input
              type="file"
              accept=".csv,.json"
              onChange={handleFileSelect}
              className="hidden"
              id="import-file"
            />
            <label htmlFor="import-file" className="cursor-pointer">
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="font-medium">Drop file here or click to upload</p>
              <p className="text-sm text-muted-foreground mt-1">
                Supports CSV and JSON formats
              </p>
            </label>
          </div>

          {/* Selected File */}
          {selectedFile && (
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              {selectedFile.name.endsWith('.json') ? (
                <FileJson className="w-8 h-8 text-amber-500" />
              ) : (
                <FileSpreadsheet className="w-8 h-8 text-green-500" />
              )}
              <div className="flex-1">
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button onClick={() => { setSelectedFile(null); setImportResult(null); }}>
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          )}

          {/* Validation Result */}
          {importResult && (
            <div className="space-y-4">
              <div className={cn(
                'p-4 rounded-lg',
                importResult.success ? 'bg-green-50 dark:bg-green-900/20' : 'bg-amber-50 dark:bg-amber-900/20'
              )}>
                <div className="flex items-center gap-2 mb-2">
                  {importResult.success ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                  )}
                  <span className="font-medium">
                    {importResult.success ? 'Validation Passed' : 'Validation Issues Found'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Total Rows:</span>
                    <span className="ml-2 font-medium">{importResult.totalRows}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Valid:</span>
                    <span className="ml-2 font-medium text-green-600">{importResult.validRows}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Invalid:</span>
                    <span className="ml-2 font-medium text-red-600">{importResult.invalidRows}</span>
                  </div>
                </div>
              </div>

              {/* Errors */}
              {importResult.errors.length > 0 && (
                <div className="border border-red-200 dark:border-red-800 rounded-lg overflow-hidden">
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 font-medium text-sm">
                    Errors ({importResult.errors.length})
                  </div>
                  <div className="max-h-40 overflow-y-auto">
                    {importResult.errors.slice(0, 10).map((error, i) => (
                      <div key={i} className="px-3 py-2 text-sm border-t border-red-100 dark:border-red-800">
                        Row {error.row}: {error.field} - {error.message}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preview */}
              {previewData.length > 0 && (
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="p-3 bg-muted/50 font-medium text-sm flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Preview (first 5 rows)
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/30">
                        <tr>
                          <th className="px-3 py-2 text-left">Name</th>
                          <th className="px-3 py-2 text-left">SKU</th>
                          <th className="px-3 py-2 text-right">Price</th>
                          <th className="px-3 py-2 text-right">Stock</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.map((product, i) => (
                          <tr key={i} className="border-t border-border">
                            <td className="px-3 py-2">{product.name}</td>
                            <td className="px-3 py-2 font-mono">{product.sku}</td>
                            <td className="px-3 py-2 text-right">₱{product.price}</td>
                            <td className="px-3 py-2 text-right">{product.stock || 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Import Button */}
              <Button onClick={handleImport} disabled={isProcessing || importResult.validRows === 0}>
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                Import {importResult.validRows} Products
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Export Tab */}
      {activeTab === 'export' && (
        <div className="space-y-6">
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Export all {productCount} products from your catalog
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleExport('csv')}
              disabled={isProcessing}
              className="p-6 border border-border rounded-lg hover:bg-muted/50 transition-colors text-center"
            >
              <FileSpreadsheet className="w-12 h-12 mx-auto mb-3 text-green-500" />
              <p className="font-medium">Export as CSV</p>
              <p className="text-sm text-muted-foreground">Spreadsheet format</p>
            </button>
            <button
              onClick={() => handleExport('json')}
              disabled={isProcessing}
              className="p-6 border border-border rounded-lg hover:bg-muted/50 transition-colors text-center"
            >
              <FileJson className="w-12 h-12 mx-auto mb-3 text-amber-500" />
              <p className="font-medium">Export as JSON</p>
              <p className="text-sm text-muted-foreground">Developer format</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

