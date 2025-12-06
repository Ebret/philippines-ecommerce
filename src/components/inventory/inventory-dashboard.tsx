'use client';

/**
 * Inventory Dashboard Component
 * Phase 26.1.1: Real-time Inventory Tracking & Low Stock Alerts
 * 
 * Main dashboard for monitoring inventory levels, stock alerts,
 * and overall inventory health with real-time updates.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { KPIWidget } from '@/components/dashboard/kpi-widget';
import { LowStockAlerts } from './low-stock-alerts';
import { StockLevelIndicator } from './stock-level-indicator';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Package, AlertTriangle, TrendingUp, TrendingDown, 
  RefreshCw, Search, Filter, Download
} from 'lucide-react';

// Types for inventory dashboard
interface InventoryItem {
  id: string;
  variantId: string;
  locationId: string;
  quantity: number;
  reservedQuantity: number;
  lastCountedAt: string | null;
  updatedAt: string;
  variant: {
    id: string;
    name: string | null;
    sku: string;
    price: number;
    lowStockThreshold: number;
    product: { name: string };
  };
  location: { id: string; name: string; code: string };
}

interface InventorySummary {
  totalItems: number;
  totalValue: number;
  lowStockCount: number;
  outOfStockCount: number;
  overstockCount: number;
  activeAlerts: number;
}

interface InventoryDashboardProps {
  className?: string;
  refreshInterval?: number; // in milliseconds, default 30 seconds
  onItemClick?: (item: InventoryItem) => void;
  showExport?: boolean;
}

export function InventoryDashboard({
  className,
  refreshInterval = 30000,
  onItemClick,
  showExport = true,
}: InventoryDashboardProps) {
  // State for inventory data
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [summary, setSummary] = useState<InventorySummary>({
    totalItems: 0,
    totalValue: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    overstockCount: 0,
    activeAlerts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Fetch inventory data
  const fetchInventory = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: '1',
        limit: '100',
        ...(filterStatus !== 'all' && { status: filterStatus }),
        ...(searchQuery && { search: searchQuery }),
      });

      const response = await fetch(`/api/inventory/dashboard?${params}`);
      if (!response.ok) throw new Error('Failed to fetch inventory');
      
      const data = await response.json();
      setItems(data.items || []);
      setSummary(data.summary || summary);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load inventory');
    } finally {
      setLoading(false);
    }
  }, [filterStatus, searchQuery, summary]);

  // Initial fetch and auto-refresh
  useEffect(() => {
    fetchInventory();
    const interval = setInterval(fetchInventory, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchInventory, refreshInterval]);

  // Get status color based on stock level
  const getStatusColor = (quantity: number, threshold: number): 'success' | 'warning' | 'error' => {
    if (quantity <= 0) return 'error';
    if (quantity <= threshold) return 'warning';
    return 'success';
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inventory Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchInventory} disabled={loading}>
            <RefreshCw className={cn('mr-2 h-4 w-4', loading && 'animate-spin')} />
            Refresh
          </Button>
          {showExport && (
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          )}
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPIWidget
          title="Total Items"
          value={summary.totalItems}
          icon={<Package />}
          color="primary"
          trend={{ value: 5, direction: 'up', label: 'vs last month' }}
        />
        <KPIWidget
          title="Total Value"
          value={`₱${summary.totalValue.toLocaleString()}`}
          icon={<TrendingUp />}
          color="success"
        />
        <KPIWidget
          title="Low Stock"
          value={summary.lowStockCount}
          icon={<TrendingDown />}
          color="warning"
          onClick={() => setFilterStatus('LOW_STOCK')}
        />
        <KPIWidget
          title="Out of Stock"
          value={summary.outOfStockCount}
          icon={<AlertTriangle />}
          color="error"
          onClick={() => setFilterStatus('OUT_OF_STOCK')}
        />
      </div>

      {/* Low Stock Alerts Section */}
      <LowStockAlerts maxItems={5} onViewAll={() => setFilterStatus('LOW_STOCK')} />
    </div>
  );
}

