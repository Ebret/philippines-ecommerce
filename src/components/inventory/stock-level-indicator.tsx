'use client';

/**
 * Stock Level Indicator Component
 * Phase 26.1.1: Real-time Inventory Tracking & Low Stock Alerts
 * 
 * Visual progress bar indicator showing current stock level
 * relative to thresholds with color-coded status.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { InventoryStatusBadge, getInventoryStatus, InventoryStatus } from './inventory-status-badge';

interface StockLevelIndicatorProps {
  currentStock: number;
  lowStockThreshold: number;
  maxStock?: number;
  reservedStock?: number;
  showLabel?: boolean;
  showBadge?: boolean;
  showNumbers?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Size configurations for the progress bar
const sizeConfig = {
  sm: { height: 'h-1.5', text: 'text-xs' },
  md: { height: 'h-2.5', text: 'text-sm' },
  lg: { height: 'h-4', text: 'text-base' },
};

// Color configurations based on status
const colorConfig: Record<InventoryStatus, {
  bar: string;
  bg: string;
}> = {
  ACTIVE: {
    bar: 'bg-green-500 dark:bg-green-400',
    bg: 'bg-green-100 dark:bg-green-900/30',
  },
  LOW_STOCK: {
    bar: 'bg-yellow-500 dark:bg-yellow-400',
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
  },
  OUT_OF_STOCK: {
    bar: 'bg-red-500 dark:bg-red-400',
    bg: 'bg-red-100 dark:bg-red-900/30',
  },
  OVERSTOCK: {
    bar: 'bg-blue-500 dark:bg-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
  },
  DISCONTINUED: {
    bar: 'bg-gray-500 dark:bg-gray-400',
    bg: 'bg-gray-100 dark:bg-gray-800',
  },
};

export function StockLevelIndicator({
  currentStock,
  lowStockThreshold,
  maxStock = 100,
  reservedStock = 0,
  showLabel = true,
  showBadge = false,
  showNumbers = true,
  size = 'md',
  className,
}: StockLevelIndicatorProps) {
  // Calculate available stock and percentage
  const availableStock = Math.max(0, currentStock - reservedStock);
  const effectiveMax = Math.max(maxStock, currentStock, 1);
  const percentage = Math.min(100, (currentStock / effectiveMax) * 100);
  const reservedPercentage = Math.min(100, (reservedStock / effectiveMax) * 100);
  
  // Determine status based on stock levels
  const status = getInventoryStatus(currentStock, lowStockThreshold, maxStock);
  const colors = colorConfig[status];
  const sizeStyles = sizeConfig[size];

  return (
    <div className={cn('w-full', className)}>
      {/* Header with label and badge */}
      {(showLabel || showBadge) && (
        <div className="mb-2 flex items-center justify-between">
          {showLabel && (
            <span className={cn('font-medium text-foreground', sizeStyles.text)}>
              Stock Level
            </span>
          )}
          {showBadge && <InventoryStatusBadge status={status} size="sm" />}
        </div>
      )}

      {/* Progress bar container */}
      <div className={cn('relative w-full overflow-hidden rounded-full', colors.bg, sizeStyles.height)}>
        {/* Reserved stock indicator (darker shade) */}
        {reservedStock > 0 && (
          <div
            className={cn(
              'absolute left-0 top-0 h-full opacity-50',
              colors.bar
            )}
            style={{ width: `${reservedPercentage}%` }}
          />
        )}
        
        {/* Current stock bar */}
        <div
          className={cn(
            'absolute left-0 top-0 h-full transition-all duration-300',
            colors.bar
          )}
          style={{ width: `${percentage}%` }}
        />

        {/* Low stock threshold marker */}
        {lowStockThreshold > 0 && lowStockThreshold < effectiveMax && (
          <div
            className="absolute top-0 h-full w-0.5 bg-yellow-600 dark:bg-yellow-400"
            style={{ left: `${(lowStockThreshold / effectiveMax) * 100}%` }}
            title={`Low stock threshold: ${lowStockThreshold}`}
          />
        )}
      </div>

      {/* Stock numbers */}
      {showNumbers && (
        <div className={cn('mt-1.5 flex items-center justify-between', sizeStyles.text)}>
          <span className="text-muted-foreground">
            {availableStock} available
            {reservedStock > 0 && (
              <span className="ml-1 text-yellow-600 dark:text-yellow-400">
                ({reservedStock} reserved)
              </span>
            )}
          </span>
          <span className="text-muted-foreground">
            {currentStock} / {effectiveMax}
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Compact version for use in tables or lists
 */
export function StockLevelCompact({
  currentStock,
  lowStockThreshold,
  maxStock = 100,
  className,
}: Pick<StockLevelIndicatorProps, 'currentStock' | 'lowStockThreshold' | 'maxStock' | 'className'>) {
  const status = getInventoryStatus(currentStock, lowStockThreshold, maxStock);
  const colors = colorConfig[status];
  const effectiveMax = Math.max(maxStock, currentStock, 1);
  const percentage = Math.min(100, (currentStock / effectiveMax) * 100);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn('h-2 w-16 overflow-hidden rounded-full', colors.bg)}>
        <div
          className={cn('h-full transition-all duration-300', colors.bar)}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground">{currentStock}</span>
    </div>
  );
}

