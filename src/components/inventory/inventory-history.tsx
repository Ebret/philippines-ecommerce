'use client';

/**
 * Inventory History Component
 * Phase 26.1.3: Inventory History & Audit Logs
 * 
 * Comprehensive view of inventory changes over time with
 * timeline visualization, filtering, and export capabilities.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  History, Calendar, Download, Filter, Search, 
  ChevronDown, ChevronUp, Package, User, Clock,
  TrendingUp, TrendingDown, ArrowRightLeft, RefreshCw
} from 'lucide-react';

// Types for inventory history
export interface HistoryEntry {
  id: string;
  timestamp: string;
  action: 'CREATED' | 'UPDATED' | 'ADJUSTED' | 'TRANSFERRED' | 'DELETED';
  field?: string;
  oldValue?: string | number | null;
  newValue?: string | number | null;
  quantity?: number;
  movementType?: 'IN' | 'OUT' | 'ADJUSTMENT' | 'TRANSFER';
  reason?: string;
  notes?: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  variant?: {
    name: string | null;
    sku: string;
    product: { name: string };
  };
  location?: { name: string };
}

interface InventoryHistoryProps {
  inventoryId?: string;
  variantId?: string;
  productId?: string;
  className?: string;
  showTimeline?: boolean;
  maxItems?: number;
}

export function InventoryHistory({
  inventoryId,
  variantId,
  productId,
  className,
  showTimeline = true,
  maxItems = 50,
}: InventoryHistoryProps) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [filterAction, setFilterAction] = useState<string>('all');

  // Fetch history data
  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: maxItems.toString(),
        ...(inventoryId && { inventoryId }),
        ...(variantId && { variantId }),
        ...(productId && { productId }),
        ...(filterAction !== 'all' && { action: filterAction }),
        ...(dateRange.start && { startDate: dateRange.start }),
        ...(dateRange.end && { endDate: dateRange.end }),
      });

      const response = await fetch(`/api/inventory/history?${params}`);
      if (!response.ok) throw new Error('Failed to fetch history');
      
      const data = await response.json();
      setEntries(data.entries || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load history');
    } finally {
      setLoading(false);
    }
  }, [inventoryId, variantId, productId, maxItems, filterAction, dateRange]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Toggle entry expansion
  const toggleExpand = (id: string) => {
    setExpandedEntries(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Get action icon
  const getActionIcon = (action: string, movementType?: string) => {
    if (movementType === 'IN') return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (movementType === 'OUT') return <TrendingDown className="h-4 w-4 text-red-600" />;
    if (movementType === 'TRANSFER') return <ArrowRightLeft className="h-4 w-4 text-blue-600" />;
    if (action === 'CREATED') return <Package className="h-4 w-4 text-green-600" />;
    if (action === 'DELETED') return <Package className="h-4 w-4 text-red-600" />;
    return <History className="h-4 w-4 text-gray-600" />;
  };

  // Get action badge
  const getActionBadge = (entry: HistoryEntry) => {
    const variants: Record<string, 'default' | 'success' | 'warning' | 'error' | 'secondary'> = {
      CREATED: 'success',
      UPDATED: 'secondary',
      ADJUSTED: 'warning',
      TRANSFERRED: 'default',
      DELETED: 'error',
    };
    return (
      <Badge variant={variants[entry.action] || 'secondary'}>
        {entry.action}
      </Badge>
    );
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: date.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  // Export history
  const handleExport = () => {
    const csv = [
      ['Timestamp', 'Action', 'Product', 'SKU', 'Quantity', 'Reason', 'User', 'Notes'].join(','),
      ...entries.map(e => [
        e.timestamp,
        e.action,
        e.variant?.product?.name || '',
        e.variant?.sku || '',
        e.quantity || '',
        e.reason || '',
        e.user?.name || e.user?.email || '',
        e.notes || '',
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <Card className={cn('overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Inventory History</h3>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button variant="ghost" size="sm" onClick={fetchHistory} disabled={loading}>
            <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 border-b border-border p-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            className="w-36"
          />
          <span className="text-muted-foreground">to</span>
          <Input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            className="w-36"
          />
        </div>
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="all">All Actions</option>
          <option value="CREATED">Created</option>
          <option value="UPDATED">Updated</option>
          <option value="ADJUSTED">Adjusted</option>
          <option value="TRANSFERRED">Transferred</option>
        </select>
      </div>

      {/* Timeline */}
      <div className="relative">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="p-4 text-center text-destructive">{error}</div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <History className="mb-2 h-8 w-8" />
            <p>No history records</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {entries.map((entry, index) => {
              const { date, time } = formatTimestamp(entry.timestamp);
              const isExpanded = expandedEntries.has(entry.id);

              return (
                <div key={entry.id} className="relative">
                  {/* Timeline line */}
                  {showTimeline && index < entries.length - 1 && (
                    <div className="absolute left-6 top-12 h-full w-0.5 bg-border" />
                  )}

                  <div
                    className="flex cursor-pointer items-start gap-3 p-4 transition-colors hover:bg-muted/50"
                    onClick={() => toggleExpand(entry.id)}
                  >
                    {/* Timeline dot */}
                    {showTimeline && (
                      <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background border-2 border-border">
                        {getActionIcon(entry.action, entry.movementType)}
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {getActionBadge(entry)}
                        {entry.quantity !== undefined && (
                          <Badge variant={entry.movementType === 'IN' ? 'success' : 'error'}>
                            {entry.movementType === 'IN' ? '+' : '-'}{Math.abs(entry.quantity)}
                          </Badge>
                        )}
                        <span className="text-sm text-muted-foreground">
                          {entry.variant?.product?.name}
                          {entry.variant?.name && ` - ${entry.variant.name}`}
                        </span>
                      </div>

                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {date} {time}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {entry.user?.name || entry.user?.email}
                        </span>
                      </div>

                      {/* Expanded details */}
                      {isExpanded && (
                        <div className="mt-3 rounded-lg bg-muted/50 p-3 text-sm">
                          {entry.reason && (
                            <p><strong>Reason:</strong> {entry.reason}</p>
                          )}
                          {entry.notes && (
                            <p className="mt-1"><strong>Notes:</strong> {entry.notes}</p>
                          )}
                          {entry.location && (
                            <p className="mt-1"><strong>Location:</strong> {entry.location.name}</p>
                          )}
                          {entry.oldValue !== undefined && entry.newValue !== undefined && (
                            <p className="mt-1">
                              <strong>{entry.field}:</strong> {entry.oldValue} → {entry.newValue}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Expand indicator */}
                    <div className="text-muted-foreground">
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}

