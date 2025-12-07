'use client';

import React from 'react';
import {
  Clock,
  CheckCircle,
  Truck,
  Package,
  XCircle,
  RotateCcw,
  Loader2,
  AlertCircle,
} from 'lucide-react';

// Order status type matching Prisma enum
export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED';

// Payment status type matching Prisma enum
export type PaymentStatus =
  | 'PENDING'
  | 'PAID'
  | 'FAILED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED';

// Shipment status type matching Prisma enum
export type ShipmentStatus =
  | 'PREPARING'
  | 'SHIPPED'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'FAILED_DELIVERY';

// Status configuration with colors and icons
const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bgColor: string; icon: React.ElementType }> = {
  PENDING: { label: 'Pending', color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-100 dark:bg-amber-900/30', icon: Clock },
  CONFIRMED: { label: 'Confirmed', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30', icon: CheckCircle },
  PROCESSING: { label: 'Processing', color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-100 dark:bg-purple-900/30', icon: Loader2 },
  SHIPPED: { label: 'Shipped', color: 'text-cyan-600 dark:text-cyan-400', bgColor: 'bg-cyan-100 dark:bg-cyan-900/30', icon: Truck },
  DELIVERED: { label: 'Delivered', color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900/30', icon: Package },
  CANCELLED: { label: 'Cancelled', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900/30', icon: XCircle },
  RETURNED: { label: 'Returned', color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-100 dark:bg-orange-900/30', icon: RotateCcw },
};

const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, { label: string; color: string; bgColor: string; icon: React.ElementType }> = {
  PENDING: { label: 'Pending', color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-100 dark:bg-amber-900/30', icon: Clock },
  PAID: { label: 'Paid', color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900/30', icon: CheckCircle },
  FAILED: { label: 'Failed', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900/30', icon: XCircle },
  REFUNDED: { label: 'Refunded', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30', icon: RotateCcw },
  PARTIALLY_REFUNDED: { label: 'Partial Refund', color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-100 dark:bg-orange-900/30', icon: AlertCircle },
};

const SHIPMENT_STATUS_CONFIG: Record<ShipmentStatus, { label: string; color: string; bgColor: string; icon: React.ElementType }> = {
  PREPARING: { label: 'Preparing', color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-100 dark:bg-amber-900/30', icon: Package },
  SHIPPED: { label: 'Shipped', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30', icon: Truck },
  IN_TRANSIT: { label: 'In Transit', color: 'text-cyan-600 dark:text-cyan-400', bgColor: 'bg-cyan-100 dark:bg-cyan-900/30', icon: Truck },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery', color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-100 dark:bg-purple-900/30', icon: Truck },
  DELIVERED: { label: 'Delivered', color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900/30', icon: CheckCircle },
  FAILED_DELIVERY: { label: 'Failed Delivery', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900/30', icon: XCircle },
};

// Props interfaces
export interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export interface ShipmentStatusBadgeProps {
  status: ShipmentStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

// Size configuration
const SIZE_CONFIG = {
  sm: { badge: 'px-2 py-0.5 text-xs', icon: 'w-3 h-3' },
  md: { badge: 'px-2.5 py-1 text-sm', icon: 'w-4 h-4' },
  lg: { badge: 'px-3 py-1.5 text-base', icon: 'w-5 h-5' },
};

/**
 * OrderStatusBadge - Display order status with color and icon
 */
export function OrderStatusBadge({ status, size = 'md', showIcon = true, className = '' }: OrderStatusBadgeProps) {
  const config = ORDER_STATUS_CONFIG[status] || ORDER_STATUS_CONFIG.PENDING;
  const sizeConfig = SIZE_CONFIG[size];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.bgColor} ${config.color} ${sizeConfig.badge} ${className}`}>
      {showIcon && <Icon className={`${sizeConfig.icon} ${status === 'PROCESSING' ? 'animate-spin' : ''}`} />}
      {config.label}
    </span>
  );
}

/**
 * PaymentStatusBadge - Display payment status with color and icon
 */
export function PaymentStatusBadge({ status, size = 'md', showIcon = true, className = '' }: PaymentStatusBadgeProps) {
  const config = PAYMENT_STATUS_CONFIG[status] || PAYMENT_STATUS_CONFIG.PENDING;
  const sizeConfig = SIZE_CONFIG[size];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.bgColor} ${config.color} ${sizeConfig.badge} ${className}`}>
      {showIcon && <Icon className={sizeConfig.icon} />}
      {config.label}
    </span>
  );
}

/**
 * ShipmentStatusBadge - Display shipment status with color and icon
 */
export function ShipmentStatusBadge({ status, size = 'md', showIcon = true, className = '' }: ShipmentStatusBadgeProps) {
  const config = SHIPMENT_STATUS_CONFIG[status] || SHIPMENT_STATUS_CONFIG.PREPARING;
  const sizeConfig = SIZE_CONFIG[size];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.bgColor} ${config.color} ${sizeConfig.badge} ${className}`}>
      {showIcon && <Icon className={sizeConfig.icon} />}
      {config.label}
    </span>
  );
}

export { ORDER_STATUS_CONFIG, PAYMENT_STATUS_CONFIG, SHIPMENT_STATUS_CONFIG };

