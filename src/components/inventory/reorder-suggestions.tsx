'use client';

/**
 * Reorder Suggestions Component
 * Phase 26.1.5: Inventory Forecasting & Reorder Points
 * 
 * Displays intelligent reorder suggestions based on:
 * - Current stock levels vs reorder points
 * - Historical sales velocity
 * - Lead time considerations
 * - Safety stock requirements
 */

import React, { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ShoppingCart, AlertTriangle, TrendingUp, Clock, 
  Package, RefreshCw, ChevronRight, Check
} from 'lucide-react';

// Types for reorder suggestions
export interface ReorderSuggestion {
  id: string;
  variantId: string;
  productName: string;
  variantName?: string;
  sku: string;
  currentStock: number;
  reorderPoint: number;
  suggestedQuantity: number;
  averageDailySales: number;
  daysUntilStockout: number;
  leadTimeDays: number;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  estimatedCost?: number;
  supplier?: string;
}

interface ReorderSuggestionsProps {
  vendorId?: string;
  locationId?: string;
  className?: string;
  onCreateOrder?: (suggestions: ReorderSuggestion[]) => void;
}

export function ReorderSuggestions({
  vendorId,
  locationId,
  className,
  onCreateOrder,
}: ReorderSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<ReorderSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Fetch reorder suggestions
  const fetchSuggestions = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        ...(vendorId && { vendorId }),
        ...(locationId && { locationId }),
      });

      const response = await fetch(`/api/inventory/reorder-suggestions?${params}`);
      if (!response.ok) throw new Error('Failed to fetch suggestions');
      
      const data = await response.json();
      setSuggestions(data.suggestions || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load suggestions');
    } finally {
      setLoading(false);
    }
  }, [vendorId, locationId]);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  // Toggle selection
  const toggleSelection = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Select all
  const selectAll = () => {
    if (selectedIds.size === suggestions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(suggestions.map(s => s.id)));
    }
  };

  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, 'destructive' | 'warning' | 'default' | 'secondary'> = {
      CRITICAL: 'destructive',
      HIGH: 'warning',
      MEDIUM: 'default',
      LOW: 'secondary',
    };
    return <Badge variant={variants[priority] || 'secondary'}>{priority}</Badge>;
  };

  // Handle create order
  const handleCreateOrder = () => {
    const selected = suggestions.filter(s => selectedIds.has(s.id));
    onCreateOrder?.(selected);
  };

  // Calculate totals
  const selectedSuggestions = suggestions.filter(s => selectedIds.has(s.id));
  const totalQuantity = selectedSuggestions.reduce((sum, s) => sum + s.suggestedQuantity, 0);
  const totalCost = selectedSuggestions.reduce((sum, s) => sum + (s.estimatedCost || 0), 0);

  return (
    <Card className={cn('overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Reorder Suggestions</h3>
          {suggestions.length > 0 && (
            <Badge variant="secondary">{suggestions.length}</Badge>
          )}
        </div>
        <div className="flex gap-2">
          {selectedIds.size > 0 && (
            <Button variant="default" size="sm" onClick={handleCreateOrder}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Create Order ({selectedIds.size})
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={fetchSuggestions} disabled={loading}>
            <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
          </Button>
        </div>
      </div>

      {/* Select All */}
      {suggestions.length > 0 && (
        <div className="flex items-center justify-between border-b border-border bg-muted/20 px-4 py-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={selectedIds.size === suggestions.length}
              onChange={selectAll}
              className="rounded border-input"
            />
            Select All
          </label>
          {selectedIds.size > 0 && (
            <span className="text-sm text-muted-foreground">
              {totalQuantity} units • ₱{totalCost.toLocaleString()}
            </span>
          )}
        </div>
      )}

      {/* Suggestions List */}
      <div className="divide-y divide-border">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="p-4 text-center text-destructive">{error}</div>
        ) : suggestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Check className="mb-2 h-8 w-8 text-green-600" />
            <p>All inventory levels are healthy!</p>
          </div>
        ) : (
          suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className={cn(
                'flex items-center gap-3 p-4 transition-colors cursor-pointer hover:bg-muted/50',
                selectedIds.has(suggestion.id) && 'bg-primary/10'
              )}
              onClick={() => toggleSelection(suggestion.id)}
            >
              <input
                type="checkbox"
                checked={selectedIds.has(suggestion.id)}
                onChange={() => toggleSelection(suggestion.id)}
                className="rounded border-input"
                onClick={(e) => e.stopPropagation()}
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {getPriorityBadge(suggestion.priority)}
                  <span className="font-medium text-foreground">
                    {suggestion.productName}
                    {suggestion.variantName && ` - ${suggestion.variantName}`}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{suggestion.sku}</p>

                <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Package className="h-3 w-3" />
                    {suggestion.currentStock} in stock
                  </span>
                  <span className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Reorder at {suggestion.reorderPoint}
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {suggestion.averageDailySales.toFixed(1)}/day
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {suggestion.daysUntilStockout} days left
                  </span>
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold text-foreground">
                  Order {suggestion.suggestedQuantity}
                </p>
                {suggestion.estimatedCost && (
                  <p className="text-xs text-muted-foreground">
                    ₱{suggestion.estimatedCost.toLocaleString()}
                  </p>
                )}
              </div>

              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

