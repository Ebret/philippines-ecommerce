'use client';

/**
 * Inventory Status Badge Component
 * Phase 26.1.1: Real-time Inventory Tracking & Low Stock Alerts
 * 
 * Visual indicator for inventory status with color-coded badges
 * for different stock levels (Active, Low Stock, Out of Stock, Overstock).
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, AlertTriangle, XCircle, TrendingUp, Package 
} from 'lucide-react';

// Inventory status types
export type InventoryStatus = 
  | 'ACTIVE' 
  | 'LOW_STOCK' 
  | 'OUT_OF_STOCK' 
  | 'OVERSTOCK' 
  | 'DISCONTINUED';

interface InventoryStatusBadgeProps {
  status: InventoryStatus;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Status configuration with colors and icons
const statusConfig: Record<InventoryStatus, {
  label: string;
  variant: 'default' | 'success' | 'warning' | 'destructive' | 'secondary';
  icon: React.ComponentType<{ className?: string }>;
  bgClass: string;
  textClass: string;
}> = {
  ACTIVE: {
    label: 'In Stock',
    variant: 'success',
    icon: CheckCircle,
    bgClass: 'bg-green-100 dark:bg-green-900/30',
    textClass: 'text-green-700 dark:text-green-400',
  },
  LOW_STOCK: {
    label: 'Low Stock',
    variant: 'warning',
    icon: AlertTriangle,
    bgClass: 'bg-yellow-100 dark:bg-yellow-900/30',
    textClass: 'text-yellow-700 dark:text-yellow-400',
  },
  OUT_OF_STOCK: {
    label: 'Out of Stock',
    variant: 'destructive',
    icon: XCircle,
    bgClass: 'bg-red-100 dark:bg-red-900/30',
    textClass: 'text-red-700 dark:text-red-400',
  },
  OVERSTOCK: {
    label: 'Overstock',
    variant: 'secondary',
    icon: TrendingUp,
    bgClass: 'bg-blue-100 dark:bg-blue-900/30',
    textClass: 'text-blue-700 dark:text-blue-400',
  },
  DISCONTINUED: {
    label: 'Discontinued',
    variant: 'secondary',
    icon: Package,
    bgClass: 'bg-gray-100 dark:bg-gray-800',
    textClass: 'text-gray-700 dark:text-gray-400',
  },
};

// Size classes for the badge
const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
};

// Icon size classes
const iconSizeClasses = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

export function InventoryStatusBadge({
  status,
  showIcon = true,
  size = 'md',
  className,
}: InventoryStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.ACTIVE;
  const Icon = config.icon;

  return (
    <Badge
      variant={config.variant}
      className={cn(
        'inline-flex items-center gap-1.5 font-medium',
        config.bgClass,
        config.textClass,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <Icon className={iconSizeClasses[size]} />}
      {config.label}
    </Badge>
  );
}

/**
 * Helper function to determine inventory status from stock levels
 * Can be used to calculate status before rendering the badge
 */
export function getInventoryStatus(
  currentStock: number,
  lowStockThreshold: number,
  maxStock?: number
): InventoryStatus {
  if (currentStock <= 0) return 'OUT_OF_STOCK';
  if (currentStock <= lowStockThreshold) return 'LOW_STOCK';
  if (maxStock && currentStock > maxStock) return 'OVERSTOCK';
  return 'ACTIVE';
}

/**
 * Get status label for display
 */
export function getStatusLabel(status: InventoryStatus): string {
  return statusConfig[status]?.label || status;
}

/**
 * Get status color class for custom styling
 */
export function getStatusColorClass(status: InventoryStatus): string {
  return statusConfig[status]?.textClass || '';
}

