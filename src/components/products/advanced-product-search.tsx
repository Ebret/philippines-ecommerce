/**
 * AdvancedProductSearch Component
 * Phase 26.4.7: Advanced Search & Filtering
 * 
 * Features:
 * - Multi-criteria search
 * - Saved filters
 * - Quick filters
 * - Sort options
 */

'use client';

import { useState, useCallback, useMemo } from 'react';
import { 
  Search, Filter, X, Save, Clock, SlidersHorizontal,
  ChevronDown, ChevronUp, Star, Tag, Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface SearchFilters {
  query: string;
  categories: string[];
  tags: string[];
  priceMin?: number;
  priceMax?: number;
  stockMin?: number;
  stockMax?: number;
  status: string[];
  rating?: number;
  dateFrom?: string;
  dateTo?: string;
  hasImages: boolean | null;
  hasVariants: boolean | null;
}

export interface SavedFilter {
  id: string;
  name: string;
  filters: SearchFilters;
  createdAt: string;
}

interface AdvancedProductSearchProps {
  categories: { id: string; name: string }[];
  tags: { id: string; name: string }[];
  onSearch: (filters: SearchFilters) => void;
  savedFilters?: SavedFilter[];
  onSaveFilter?: (name: string, filters: SearchFilters) => void;
  onDeleteSavedFilter?: (id: string) => void;
  className?: string;
}

const DEFAULT_FILTERS: SearchFilters = {
  query: '',
  categories: [],
  tags: [],
  status: [],
  hasImages: null,
  hasVariants: null,
};

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'OUT_OF_STOCK', label: 'Out of Stock' },
];

export function AdvancedProductSearch({
  categories,
  tags,
  onSearch,
  savedFilters = [],
  onSaveFilter,
  onDeleteSavedFilter,
  className,
}: AdvancedProductSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [filterName, setFilterName] = useState('');

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.query) count++;
    if (filters.categories.length) count++;
    if (filters.tags.length) count++;
    if (filters.priceMin !== undefined || filters.priceMax !== undefined) count++;
    if (filters.stockMin !== undefined || filters.stockMax !== undefined) count++;
    if (filters.status.length) count++;
    if (filters.rating !== undefined) count++;
    if (filters.dateFrom || filters.dateTo) count++;
    if (filters.hasImages !== null) count++;
    if (filters.hasVariants !== null) count++;
    return count;
  }, [filters]);

  // Update filter
  const updateFilter = <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Toggle array filter
  const toggleArrayFilter = (key: 'categories' | 'tags' | 'status', value: string) => {
    setFilters(prev => {
      const arr = prev[key];
      const newArr = arr.includes(value)
        ? arr.filter(v => v !== value)
        : [...arr, value];
      return { ...prev, [key]: newArr };
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  // Apply filters
  const applyFilters = () => {
    onSearch(filters);
  };

  // Save filter
  const handleSaveFilter = () => {
    if (!filterName.trim() || !onSaveFilter) return;
    onSaveFilter(filterName.trim(), filters);
    setFilterName('');
    setShowSaveDialog(false);
  };

  // Load saved filter
  const loadSavedFilter = (saved: SavedFilter) => {
    setFilters(saved.filters);
    onSearch(saved.filters);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Main Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={filters.query}
            onChange={(e) => updateFilter('query', e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            placeholder="Search products by name, SKU, or description..."
            className="w-full pl-10 pr-4 py-2 rounded-md border border-border bg-background"
          />
        </div>
        <Button onClick={applyFilters}>
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={cn(activeFilterCount > 0 && 'border-primary')}
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-2 px-1.5 py-0.5 bg-primary text-primary-foreground rounded-full text-xs">
              {activeFilterCount}
            </span>
          )}
          {showAdvanced ? (
            <ChevronUp className="w-4 h-4 ml-2" />
          ) : (
            <ChevronDown className="w-4 h-4 ml-2" />
          )}
        </Button>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map(status => (
          <button
            key={status.value}
            onClick={() => toggleArrayFilter('status', status.value)}
            className={cn(
              'px-3 py-1 rounded-full text-sm transition-colors',
              filters.status.includes(status.value)
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            )}
          >
            {status.label}
          </button>
        ))}
      </div>

      {/* Advanced Filters Panel */}
      {showAdvanced && (
        <div className="p-4 border border-border rounded-lg bg-card space-y-6">
          {/* Categories & Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Categories */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Package className="w-4 h-4" />
                Categories
              </label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => toggleArrayFilter('categories', cat.id)}
                    className={cn(
                      'px-2 py-1 rounded text-sm transition-colors',
                      filters.categories.includes(cat.id)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    )}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tags
              </label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {tags.map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => toggleArrayFilter('tags', tag.id)}
                    className={cn(
                      'px-2 py-1 rounded text-sm transition-colors',
                      filters.tags.includes(tag.id)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    )}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Price & Stock Range */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Min Price</label>
              <input
                type="number"
                value={filters.priceMin || ''}
                onChange={(e) => updateFilter('priceMin', e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="₱0"
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Max Price</label>
              <input
                type="number"
                value={filters.priceMax || ''}
                onChange={(e) => updateFilter('priceMax', e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="₱∞"
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Min Stock</label>
              <input
                type="number"
                value={filters.stockMin || ''}
                onChange={(e) => updateFilter('stockMin', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="0"
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Max Stock</label>
              <input
                type="number"
                value={filters.stockMax || ''}
                onChange={(e) => updateFilter('stockMax', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="∞"
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm"
              />
            </div>
          </div>

          {/* Rating & Boolean Filters */}
          <div className="flex flex-wrap gap-6">
            {/* Rating */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Min Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => updateFilter('rating', filters.rating === star ? undefined : star)}
                    className="p-1"
                  >
                    <Star
                      className={cn(
                        'w-5 h-5',
                        filters.rating && star <= filters.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-300'
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Has Images */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Has Images</label>
              <div className="flex gap-2">
                {[
                  { value: true, label: 'Yes' },
                  { value: false, label: 'No' },
                  { value: null, label: 'Any' },
                ].map(opt => (
                  <button
                    key={String(opt.value)}
                    onClick={() => updateFilter('hasImages', opt.value)}
                    className={cn(
                      'px-3 py-1 rounded text-sm',
                      filters.hasImages === opt.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Has Variants */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Has Variants</label>
              <div className="flex gap-2">
                {[
                  { value: true, label: 'Yes' },
                  { value: false, label: 'No' },
                  { value: null, label: 'Any' },
                ].map(opt => (
                  <button
                    key={String(opt.value)}
                    onClick={() => updateFilter('hasVariants', opt.value)}
                    className={cn(
                      'px-3 py-1 rounded text-sm',
                      filters.hasVariants === opt.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button variant="ghost" onClick={clearFilters}>
              <X className="w-4 h-4 mr-2" />
              Clear All
            </Button>
            <div className="flex gap-2">
              {onSaveFilter && (
                <Button variant="outline" onClick={() => setShowSaveDialog(true)}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Filter
                </Button>
              )}
              <Button onClick={applyFilters}>
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Saved Filters */}
      {savedFilters.length > 0 && (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Saved:</span>
          {savedFilters.map(saved => (
            <button
              key={saved.id}
              onClick={() => loadSavedFilter(saved)}
              className="px-3 py-1 bg-muted hover:bg-muted/80 rounded text-sm flex items-center gap-2"
            >
              {saved.name}
              {onDeleteSavedFilter && (
                <X
                  className="w-3 h-3 hover:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSavedFilter(saved.id);
                  }}
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Save Filter Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
            <h4 className="font-semibold mb-4">Save Filter</h4>
            <input
              type="text"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              placeholder="Filter name..."
              className="w-full px-3 py-2 rounded-md border border-border bg-background mb-4"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveFilter} disabled={!filterName.trim()}>
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

