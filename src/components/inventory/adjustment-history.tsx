'use client';

/**
 * Adjustment History Component
 * Phase 26.1.2: Inventory Adjustment Workflow
 * 
 * Displays history of inventory adjustments with filtering,
 * pagination, and detailed view of each adjustment.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, Minus, ArrowRightLeft, Clock, User, Package,
  ChevronLeft, ChevronRight, RefreshCw, Search, Filter
} from 'lucide-react';

// Types for adjustment history
export interface AdjustmentRecord {
  id: string;
  variantId: string;
  locationId: string;
  movementType: 'IN' | 'OUT' | 'ADJUSTMENT' | 'TRANSFER';
  quantity: number;
  referenceType: string | null;
  referenceId: string | null;
  notes: string | null;
  createdById: string | null;
  createdAt: string;
  variant?: {
    name: string | null;
    sku: string;
    product: { name: string };
  };
  location?: { name: string };
  createdBy?: { name: string | null; email: string };
}

interface AdjustmentHistoryProps {
  inventoryId?: string;
  variantId?: string;
  locationId?: string;
  className?: string;
  compact?: boolean;
  maxItems?: number;
}

export function AdjustmentHistory({
  inventoryId,
  variantId,
  locationId,
  className,
  compact = false,
  maxItems = 10,
}: AdjustmentHistoryProps) {
  const [records, setRecords] = useState<AdjustmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  // Fetch adjustment history
  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: maxItems.toString(),
        ...(variantId && { variantId }),
        ...(locationId && { locationId }),
        ...(filterType !== 'all' && { movementType: filterType }),
        ...(searchQuery && { search: searchQuery }),
      });

      const response = await fetch(`/api/inventory/movements?${params}`);
      if (!response.ok) throw new Error('Failed to fetch history');
      
      const data = await response.json();
      setRecords(data.movements || []);
      setTotalPages(data.pagination?.pages || 1);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load history');
    } finally {
      setLoading(false);
    }
  }, [page, maxItems, variantId, locationId, filterType, searchQuery]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Get icon for movement type
  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'IN': return <Plus className="h-4 w-4 text-green-600" />;
      case 'OUT': return <Minus className="h-4 w-4 text-red-600" />;
      case 'TRANSFER': return <ArrowRightLeft className="h-4 w-4 text-blue-600" />;
      default: return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  // Get badge variant for movement type
  const getMovementBadge = (type: string, quantity: number) => {
    const isPositive = type === 'IN' || (type === 'ADJUSTMENT' && quantity > 0);
    return (
      <Badge variant={isPositive ? 'success' : 'error'}>
        {isPositive ? '+' : '-'}{Math.abs(quantity)}
      </Badge>
    );
  };

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading && records.length === 0) {
    return (
      <Card className={cn('p-6', className)}>
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Adjustment History</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={fetchHistory} disabled={loading}>
          <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
        </Button>
      </div>

      {/* Filters (non-compact mode) */}
      {!compact && (
        <div className="flex gap-2 border-b border-border p-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="all">All Types</option>
            <option value="IN">Stock In</option>
            <option value="OUT">Stock Out</option>
            <option value="ADJUSTMENT">Adjustments</option>
            <option value="TRANSFER">Transfers</option>
          </select>
        </div>
      )}

      {/* Records List */}
      <div className="divide-y divide-border">
        {error ? (
          <div className="p-4 text-center text-destructive">{error}</div>
        ) : records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Clock className="mb-2 h-8 w-8" />
            <p>No adjustment history</p>
          </div>
        ) : (
          records.map((record) => (
            <div
              key={record.id}
              className="flex items-center justify-between p-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  {getMovementIcon(record.movementType)}
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {record.variant?.product?.name || 'Unknown Product'}
                    {record.variant?.name && ` - ${record.variant.name}`}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{record.location?.name}</span>
                    {record.referenceId && (
                      <>
                        <span>•</span>
                        <span>Ref: {record.referenceId}</span>
                      </>
                    )}
                  </div>
                  {record.notes && !compact && (
                    <p className="mt-1 text-xs text-muted-foreground italic">
                      {record.notes}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                {getMovementBadge(record.movementType, record.quantity)}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatDate(record.createdAt)}
                </div>
                {record.createdBy && !compact && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    {record.createdBy.name || record.createdBy.email}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border bg-muted/30 px-4 py-3">
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || loading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

