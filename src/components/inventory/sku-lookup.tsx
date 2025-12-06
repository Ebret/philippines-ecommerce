'use client';

/**
 * SKU Lookup Component
 * Phase 26.1.6: Barcode/SKU Scanning
 * 
 * Quick lookup for products by SKU, barcode, or name.
 * Supports autocomplete and recent searches.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, Package, Clock, X, ChevronRight, 
  RefreshCw, AlertTriangle
} from 'lucide-react';

// Types for SKU lookup
export interface LookupResult {
  id: string;
  variantId: string;
  productName: string;
  variantName?: string;
  sku: string;
  barcode?: string;
  currentStock: number;
  price: number;
  lowStockThreshold: number;
  location?: string;
}

interface SKULookupProps {
  onSelect: (result: LookupResult) => void;
  className?: string;
  placeholder?: string;
  showRecentSearches?: boolean;
}

export function SKULookup({
  onSelect,
  className,
  placeholder = 'Search by SKU, barcode, or name...',
  showRecentSearches = true,
}: SKULookupProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LookupResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sku-recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save recent search
  const saveRecentSearch = (search: string) => {
    const updated = [search, ...recentSearches.filter(s => s !== search)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('sku-recent-searches', JSON.stringify(updated));
  };

  // Search for products
  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/inventory/lookup?q=${encodeURIComponent(searchQuery)}`
      );
      
      if (!response.ok) throw new Error('Search failed');
      
      const data = await response.json();
      setResults(data.results || []);
      setShowResults(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, handleSearch]);

  // Handle selection
  const handleSelect = (result: LookupResult) => {
    saveRecentSearch(result.sku);
    onSelect(result);
    setQuery('');
    setShowResults(false);
  };

  // Handle recent search click
  const handleRecentClick = (search: string) => {
    setQuery(search);
    handleSearch(search);
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('sku-recent-searches');
  };

  return (
    <Card className={cn('overflow-hidden', className)}>
      {/* Search Input */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowResults(true)}
            className="pl-9 pr-9"
          />
          {query && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
              onClick={() => { setQuery(''); setResults([]); }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Searching...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-2 flex items-center gap-2 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4" />
            {error}
          </div>
        )}

        {/* Results */}
        {showResults && results.length > 0 && (
          <div className="mt-2 max-h-64 overflow-y-auto rounded-lg border border-border">
            {results.map((result) => (
              <button
                key={result.id}
                onClick={() => handleSelect(result)}
                className="flex w-full items-center gap-3 border-b border-border p-3 text-left hover:bg-muted/50 last:border-0"
              >
                <Package className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{result.productName}</p>
                  <p className="text-sm text-muted-foreground">
                    SKU: {result.sku} • Stock: {result.currentStock}
                  </p>
                </div>
                <Badge variant={result.currentStock <= result.lowStockThreshold ? 'destructive' : 'secondary'}>
                  {result.currentStock <= 0 ? 'Out of Stock' :
                   result.currentStock <= result.lowStockThreshold ? 'Low Stock' : 'In Stock'}
                </Badge>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        )}

        {/* No Results */}
        {showResults && query.length >= 2 && !loading && results.length === 0 && (
          <div className="mt-2 rounded-lg border border-border p-4 text-center text-muted-foreground">
            <Package className="mx-auto mb-2 h-8 w-8" />
            <p>No products found for "{query}"</p>
          </div>
        )}

        {/* Recent Searches */}
        {showRecentSearches && !query && recentSearches.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Recent Searches</span>
              <Button variant="ghost" size="sm" onClick={clearRecentSearches}>
                Clear
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleRecentClick(search)}
                  className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm hover:bg-muted/80"
                >
                  <Clock className="h-3 w-3" />
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

