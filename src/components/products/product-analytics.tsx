/**
 * ProductAnalytics Component
 * Phase 26.4.8: Product Analytics
 * 
 * Features:
 * - Sales performance metrics
 * - View/conversion tracking
 * - Top products dashboard
 * - Revenue analytics
 */

'use client';

import { useState, useMemo } from 'react';
import { 
  BarChart3, TrendingUp, TrendingDown, Eye, ShoppingCart,
  DollarSign, Package, Star, ArrowUpRight, ArrowDownRight,
  Calendar, Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ProductMetrics {
  id: string;
  name: string;
  image?: string;
  views: number;
  addToCart: number;
  purchases: number;
  revenue: number;
  rating: number;
  reviewCount: number;
  conversionRate: number;
  trend: number; // percentage change
}

export interface AnalyticsSummary {
  totalViews: number;
  totalRevenue: number;
  totalOrders: number;
  avgConversionRate: number;
  viewsTrend: number;
  revenueTrend: number;
  ordersTrend: number;
  conversionTrend: number;
}

interface ProductAnalyticsProps {
  products: ProductMetrics[];
  summary: AnalyticsSummary;
  dateRange: { from: string; to: string };
  onDateRangeChange: (range: { from: string; to: string }) => void;
  onExport: () => void;
  className?: string;
}

type SortField = 'views' | 'revenue' | 'purchases' | 'conversionRate' | 'rating';
type SortOrder = 'asc' | 'desc';

export function ProductAnalytics({
  products,
  summary,
  dateRange,
  onDateRangeChange,
  onExport,
  className,
}: ProductAnalyticsProps) {
  const [sortField, setSortField] = useState<SortField>('revenue');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Sort products
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
    });
  }, [products, sortField, sortOrder]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format number
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Render trend indicator
  const renderTrend = (value: number) => {
    const isPositive = value >= 0;
    return (
      <span className={cn(
        'flex items-center text-sm',
        isPositive ? 'text-green-600' : 'text-red-600'
      )}>
        {isPositive ? (
          <ArrowUpRight className="w-4 h-4" />
        ) : (
          <ArrowDownRight className="w-4 h-4" />
        )}
        {Math.abs(value).toFixed(1)}%
      </span>
    );
  };

  // Handle sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Product Analytics
          </h3>
          <p className="text-sm text-muted-foreground">
            Performance metrics for {products.length} products
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-muted rounded-md p-1">
            <Calendar className="w-4 h-4 ml-2 text-muted-foreground" />
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => onDateRangeChange({ ...dateRange, from: e.target.value })}
              className="bg-transparent text-sm border-none focus:outline-none"
            />
            <span className="text-muted-foreground">-</span>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => onDateRangeChange({ ...dateRange, to: e.target.value })}
              className="bg-transparent text-sm border-none focus:outline-none"
            />
          </div>
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Eye className="w-5 h-5 text-blue-500" />
            {renderTrend(summary.viewsTrend)}
          </div>
          <p className="text-2xl font-bold">{formatNumber(summary.totalViews)}</p>
          <p className="text-sm text-muted-foreground">Total Views</p>
        </div>
        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            {renderTrend(summary.revenueTrend)}
          </div>
          <p className="text-2xl font-bold">{formatCurrency(summary.totalRevenue)}</p>
          <p className="text-sm text-muted-foreground">Total Revenue</p>
        </div>
        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <ShoppingCart className="w-5 h-5 text-purple-500" />
            {renderTrend(summary.ordersTrend)}
          </div>
          <p className="text-2xl font-bold">{formatNumber(summary.totalOrders)}</p>
          <p className="text-sm text-muted-foreground">Total Orders</p>
        </div>
        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-amber-500" />
            {renderTrend(summary.conversionTrend)}
          </div>
          <p className="text-2xl font-bold">{summary.avgConversionRate.toFixed(1)}%</p>
          <p className="text-sm text-muted-foreground">Avg Conversion</p>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {(['table', 'cards'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={cn(
                'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                viewMode === mode
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              )}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          Sort by:
          {(['revenue', 'views', 'purchases', 'conversionRate', 'rating'] as const).map(field => (
            <button
              key={field}
              onClick={() => handleSort(field)}
              className={cn(
                'px-2 py-1 rounded',
                sortField === field ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
              )}
            >
              {field === 'conversionRate' ? 'Conv.' : field.charAt(0).toUpperCase() + field.slice(1)}
              {sortField === field && (sortOrder === 'desc' ? ' ↓' : ' ↑')}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      {viewMode === 'table' && (
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Product</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Views</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Add to Cart</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Purchases</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Revenue</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Conv. Rate</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Rating</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sortedProducts.map(product => (
                <tr key={product.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.image && (
                        <img src={product.image} alt="" className="w-10 h-10 rounded object-cover" />
                      )}
                      <span className="font-medium truncate max-w-[200px]">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">{formatNumber(product.views)}</td>
                  <td className="px-4 py-3 text-right">{formatNumber(product.addToCart)}</td>
                  <td className="px-4 py-3 text-right">{formatNumber(product.purchases)}</td>
                  <td className="px-4 py-3 text-right font-medium">{formatCurrency(product.revenue)}</td>
                  <td className="px-4 py-3 text-right">{product.conversionRate.toFixed(1)}%</td>
                  <td className="px-4 py-3 text-right">
                    <span className="flex items-center justify-end gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      {product.rating.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">{renderTrend(product.trend)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Products Cards */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedProducts.map(product => (
            <div key={product.id} className="p-4 border border-border rounded-lg bg-card">
              <div className="flex items-start gap-3 mb-4">
                {product.image && (
                  <img src={product.image} alt="" className="w-16 h-16 rounded object-cover" />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{product.name}</h4>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {product.rating.toFixed(1)} ({product.reviewCount})
                  </div>
                </div>
                {renderTrend(product.trend)}
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Views</p>
                  <p className="font-medium">{formatNumber(product.views)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Revenue</p>
                  <p className="font-medium">{formatCurrency(product.revenue)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Purchases</p>
                  <p className="font-medium">{formatNumber(product.purchases)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Conversion</p>
                  <p className="font-medium">{product.conversionRate.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {products.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No analytics data available</p>
          <p className="text-sm text-muted-foreground">Data will appear once products have activity</p>
        </div>
      )}
    </div>
  );
}

