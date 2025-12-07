/**
 * ProductDuplicator Component
 * Phase 26.4.6: Product Duplication
 * 
 * Features:
 * - Duplicate single or multiple products
 * - Customize duplicated fields
 * - SKU generation
 * - Batch duplication
 */

'use client';

import { useState, useCallback } from 'react';
import { Copy, Check, Loader2, Settings, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface DuplicateProduct {
  id: string;
  name: string;
  sku: string;
  price: number;
  image?: string;
}

export interface DuplicationOptions {
  copyImages: boolean;
  copyVariants: boolean;
  copyCategories: boolean;
  copyTags: boolean;
  copyInventory: boolean;
  skuPrefix: string;
  nameSuffix: string;
  setAsDraft: boolean;
}

interface ProductDuplicatorProps {
  products: DuplicateProduct[];
  onDuplicate: (productIds: string[], options: DuplicationOptions) => Promise<DuplicateProduct[]>;
  className?: string;
}

const DEFAULT_OPTIONS: DuplicationOptions = {
  copyImages: true,
  copyVariants: true,
  copyCategories: true,
  copyTags: true,
  copyInventory: false,
  skuPrefix: 'COPY-',
  nameSuffix: ' (Copy)',
  setAsDraft: true,
};

export function ProductDuplicator({
  products,
  onDuplicate,
  className,
}: ProductDuplicatorProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [options, setOptions] = useState<DuplicationOptions>(DEFAULT_OPTIONS);
  const [showOptions, setShowOptions] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [duplicatedProducts, setDuplicatedProducts] = useState<DuplicateProduct[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Toggle selection
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Select all
  const selectAll = () => {
    if (selectedIds.size === products.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(products.map(p => p.id)));
    }
  };

  // Handle duplicate
  const handleDuplicate = async () => {
    if (selectedIds.size === 0) return;

    setIsDuplicating(true);
    setError(null);

    try {
      const result = await onDuplicate(Array.from(selectedIds), options);
      setDuplicatedProducts(result);
      setSelectedIds(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Duplication failed');
    } finally {
      setIsDuplicating(false);
    }
  };

  // Update option
  const updateOption = <K extends keyof DuplicationOptions>(
    key: K,
    value: DuplicationOptions[K]
  ) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold flex items-center gap-2">
            <Copy className="w-5 h-5 text-primary" />
            Duplicate Products
          </h3>
          <p className="text-sm text-muted-foreground">
            {selectedIds.size} of {products.length} selected
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowOptions(!showOptions)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Options
          </Button>
          <Button
            onClick={handleDuplicate}
            disabled={selectedIds.size === 0 || isDuplicating}
          >
            {isDuplicating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Copy className="w-4 h-4 mr-2" />
            )}
            Duplicate ({selectedIds.size})
          </Button>
        </div>
      </div>

      {/* Options Panel */}
      {showOptions && (
        <div className="p-4 border border-border rounded-lg bg-card space-y-4">
          <h4 className="font-medium">Duplication Options</h4>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Checkboxes */}
            {[
              { key: 'copyImages', label: 'Copy Images' },
              { key: 'copyVariants', label: 'Copy Variants' },
              { key: 'copyCategories', label: 'Copy Categories' },
              { key: 'copyTags', label: 'Copy Tags' },
              { key: 'copyInventory', label: 'Copy Inventory' },
              { key: 'setAsDraft', label: 'Set as Draft' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options[key as keyof DuplicationOptions] as boolean}
                  onChange={(e) => updateOption(key as keyof DuplicationOptions, e.target.checked)}
                  className="rounded border-border"
                />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">SKU Prefix</label>
              <input
                type="text"
                value={options.skuPrefix}
                onChange={(e) => updateOption('skuPrefix', e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Name Suffix</label>
              <input
                type="text"
                value={options.nameSuffix}
                onChange={(e) => updateOption('nameSuffix', e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Success */}
      {duplicatedProducts.length > 0 && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Check className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-700 dark:text-green-400">
              Successfully duplicated {duplicatedProducts.length} products
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {duplicatedProducts.map(p => (
              <span key={p.id} className="px-2 py-1 bg-green-100 dark:bg-green-800/30 rounded text-sm">
                {p.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Products List */}
      <div className="border border-border rounded-lg overflow-hidden">
        {/* Select All */}
        <div className="p-3 bg-muted/50 border-b border-border">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedIds.size === products.length && products.length > 0}
              onChange={selectAll}
              className="rounded border-border"
            />
            <span className="text-sm font-medium">Select All</span>
          </label>
        </div>

        {/* Products */}
        <div className="divide-y divide-border max-h-96 overflow-y-auto">
          {products.map(product => (
            <div
              key={product.id}
              className={cn(
                'flex items-center gap-4 p-4 hover:bg-muted/30 cursor-pointer',
                selectedIds.has(product.id) && 'bg-primary/5'
              )}
              onClick={() => toggleSelect(product.id)}
            >
              <input
                type="checkbox"
                checked={selectedIds.has(product.id)}
                onChange={() => toggleSelect(product.id)}
                onClick={(e) => e.stopPropagation()}
                className="rounded border-border"
              />
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{product.name}</p>
                <p className="text-sm text-muted-foreground font-mono">{product.sku}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">₱{product.price.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview */}
      {selectedIds.size > 0 && (
        <div className="p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">Preview</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>New SKU format: <span className="font-mono">{options.skuPrefix}[original-sku]</span></p>
            <p>New name format: <span className="font-mono">[original-name]{options.nameSuffix}</span></p>
          </div>
        </div>
      )}
    </div>
  );
}

