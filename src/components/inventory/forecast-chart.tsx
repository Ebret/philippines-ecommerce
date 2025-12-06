'use client';

/**
 * Forecast Chart Component
 * Phase 26.1.5: Inventory Forecasting & Reorder Points
 * 
 * Visualizes inventory forecasting with:
 * - Historical stock levels
 * - Projected stock depletion
 * - Reorder point indicators
 * - Safety stock levels
 */

import React, { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, Calendar, RefreshCw, AlertTriangle,
  ArrowDown, ArrowUp, Minus
} from 'lucide-react';

// Types for forecast data
export interface ForecastDataPoint {
  date: string;
  actual?: number;
  projected?: number;
  reorderPoint: number;
  safetyStock: number;
}

export interface ForecastData {
  variantId: string;
  productName: string;
  sku: string;
  currentStock: number;
  reorderPoint: number;
  safetyStock: number;
  averageDailySales: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
  trendPercentage: number;
  daysUntilReorder: number;
  daysUntilStockout: number;
  dataPoints: ForecastDataPoint[];
}

interface ForecastChartProps {
  variantId: string;
  className?: string;
  days?: number;
}

export function ForecastChart({
  variantId,
  className,
  days = 30,
}: ForecastChartProps) {
  const [data, setData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch forecast data
  const fetchForecast = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/inventory/forecast?variantId=${variantId}&days=${days}`
      );
      if (!response.ok) throw new Error('Failed to fetch forecast');
      
      const result = await response.json();
      setData(result.forecast);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load forecast');
    } finally {
      setLoading(false);
    }
  }, [variantId, days]);

  useEffect(() => {
    fetchForecast();
  }, [fetchForecast]);

  // Get trend icon
  const getTrendIcon = (trend: string) => {
    if (trend === 'UP') return <ArrowUp className="h-4 w-4 text-green-600" />;
    if (trend === 'DOWN') return <ArrowDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  // Calculate chart dimensions
  const chartHeight = 200;
  const chartWidth = 100; // percentage

  // Render simple bar chart
  const renderChart = () => {
    if (!data || data.dataPoints.length === 0) return null;

    const maxValue = Math.max(
      ...data.dataPoints.map(d => Math.max(d.actual || 0, d.projected || 0, d.reorderPoint))
    );

    return (
      <div className="relative h-[200px] w-full">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full w-12 flex flex-col justify-between text-xs text-muted-foreground">
          <span>{maxValue}</span>
          <span>{Math.round(maxValue / 2)}</span>
          <span>0</span>
        </div>
        
        {/* Chart area */}
        <div className="ml-14 h-full flex items-end gap-1">
          {data.dataPoints.map((point, index) => {
            const actualHeight = ((point.actual || 0) / maxValue) * 100;
            const projectedHeight = ((point.projected || 0) / maxValue) * 100;
            const reorderHeight = (point.reorderPoint / maxValue) * 100;
            
            return (
              <div key={index} className="flex-1 relative h-full flex flex-col justify-end">
                {/* Reorder point line */}
                <div 
                  className="absolute w-full border-t-2 border-dashed border-amber-500"
                  style={{ bottom: `${reorderHeight}%` }}
                />
                
                {/* Bar */}
                <div
                  className={cn(
                    'w-full rounded-t transition-all',
                    point.actual !== undefined ? 'bg-primary' : 'bg-primary/40'
                  )}
                  style={{ height: `${point.actual !== undefined ? actualHeight : projectedHeight}%` }}
                  title={`${point.date}: ${point.actual ?? point.projected}`}
                />
              </div>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="mt-2 flex gap-4 text-xs">
          <span className="flex items-center gap-1">
            <div className="h-3 w-3 rounded bg-primary" /> Actual
          </span>
          <span className="flex items-center gap-1">
            <div className="h-3 w-3 rounded bg-primary/40" /> Projected
          </span>
          <span className="flex items-center gap-1">
            <div className="h-0.5 w-3 border-t-2 border-dashed border-amber-500" /> Reorder Point
          </span>
        </div>
      </div>
    );
  };

  return (
    <Card className={cn('overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Inventory Forecast</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={fetchForecast} disabled={loading}>
          <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
        </Button>
      </div>

      {/* Content */}
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="p-4 text-center text-destructive">{error}</div>
        ) : !data ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <TrendingUp className="mb-2 h-8 w-8" />
            <p>No forecast data available</p>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">Current Stock</p>
                <p className="text-lg font-semibold">{data.currentStock}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">Daily Sales</p>
                <p className="text-lg font-semibold">{data.averageDailySales.toFixed(1)}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">Days to Reorder</p>
                <p className={cn(
                  'text-lg font-semibold',
                  data.daysUntilReorder <= 7 && 'text-amber-600',
                  data.daysUntilReorder <= 3 && 'text-red-600'
                )}>
                  {data.daysUntilReorder}
                </p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">Trend</p>
                <div className="flex items-center gap-1">
                  {getTrendIcon(data.trend)}
                  <span className={cn(
                    'text-lg font-semibold',
                    data.trend === 'UP' && 'text-green-600',
                    data.trend === 'DOWN' && 'text-red-600'
                  )}>
                    {data.trendPercentage > 0 ? '+' : ''}{data.trendPercentage}%
                  </span>
                </div>
              </div>
            </div>

            {/* Alerts */}
            {data.daysUntilReorder <= 7 && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400">
                <AlertTriangle className="h-4 w-4" />
                {data.daysUntilReorder <= 0
                  ? 'Stock is below reorder point! Order now.'
                  : `Reorder needed in ${data.daysUntilReorder} days`}
              </div>
            )}

            {/* Chart */}
            {renderChart()}
          </>
        )}
      </div>
    </Card>
  );
}

