'use client';

import React from 'react';
import { format } from 'date-fns';
import {
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  AlertCircle,
  Wallet,
  Smartphone,
  Banknote,
  Truck,
} from 'lucide-react';

// Payment status type
export type PaymentStatusType = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED' | 'CANCELLED';

// Payment method type
export type PaymentMethodType = 'GCASH' | 'PAYMAYA' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER' | 'COD';

// Status configuration
const STATUS_CONFIG: Record<PaymentStatusType, { label: string; color: string; bgColor: string; icon: React.ElementType }> = {
  PENDING: { label: 'Pending', color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-100 dark:bg-amber-900/30', icon: Clock },
  PROCESSING: { label: 'Processing', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30', icon: RefreshCw },
  COMPLETED: { label: 'Completed', color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900/30', icon: CheckCircle },
  FAILED: { label: 'Failed', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900/30', icon: XCircle },
  REFUNDED: { label: 'Refunded', color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-100 dark:bg-purple-900/30', icon: RefreshCw },
  PARTIALLY_REFUNDED: { label: 'Partial Refund', color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-100 dark:bg-orange-900/30', icon: AlertCircle },
  CANCELLED: { label: 'Cancelled', color: 'text-gray-600 dark:text-gray-400', bgColor: 'bg-gray-100 dark:bg-gray-900/30', icon: XCircle },
};

// Payment method icons
const METHOD_ICONS: Record<PaymentMethodType, React.ElementType> = {
  GCASH: Wallet,
  PAYMAYA: Wallet,
  CREDIT_CARD: CreditCard,
  DEBIT_CARD: CreditCard,
  BANK_TRANSFER: Banknote,
  COD: Truck,
};

// Payment method labels
const METHOD_LABELS: Record<PaymentMethodType, string> = {
  GCASH: 'GCash',
  PAYMAYA: 'PayMaya',
  CREDIT_CARD: 'Credit Card',
  DEBIT_CARD: 'Debit Card',
  BANK_TRANSFER: 'Bank Transfer',
  COD: 'Cash on Delivery',
};

// Payment transaction interface
export interface PaymentTransaction {
  id: string;
  transactionId: string;
  referenceCode: string;
  orderId: string;
  orderNumber: string;
  method: PaymentMethodType;
  status: PaymentStatusType;
  amount: number;
  processingFee: number;
  totalAmount: number;
  currency: string;
  createdAt: string;
  processedAt?: string;
  failureReason?: string;
  refundAmount?: number;
  refundedAt?: string;
}

export interface PaymentStatusBadgeProps {
  status: PaymentStatusType;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

/**
 * PaymentStatusBadge - Display payment status with color and icon
 */
export function PaymentStatusBadge({
  status,
  size = 'md',
  showIcon = true,
  className = '',
}: PaymentStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  const sizeConfig = {
    sm: { badge: 'px-2 py-0.5 text-xs', icon: 'w-3 h-3' },
    md: { badge: 'px-2.5 py-1 text-sm', icon: 'w-4 h-4' },
    lg: { badge: 'px-3 py-1.5 text-base', icon: 'w-5 h-5' },
  }[size];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.bgColor} ${config.color} ${sizeConfig.badge} ${className}`}>
      {showIcon && <Icon className={`${sizeConfig.icon} ${status === 'PROCESSING' ? 'animate-spin' : ''}`} />}
      {config.label}
    </span>
  );
}

export interface PaymentMethodBadgeProps {
  method: PaymentMethodType;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

/**
 * PaymentMethodBadge - Display payment method with icon
 */
export function PaymentMethodBadge({
  method,
  size = 'md',
  showIcon = true,
  className = '',
}: PaymentMethodBadgeProps) {
  const Icon = METHOD_ICONS[method];
  const label = METHOD_LABELS[method];
  const sizeConfig = {
    sm: { badge: 'px-2 py-0.5 text-xs', icon: 'w-3 h-3' },
    md: { badge: 'px-2.5 py-1 text-sm', icon: 'w-4 h-4' },
    lg: { badge: 'px-3 py-1.5 text-base', icon: 'w-5 h-5' },
  }[size];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-muted text-foreground ${sizeConfig.badge} ${className}`}>
      {showIcon && <Icon className={sizeConfig.icon} />}
      {label}
    </span>
  );
}

export interface PaymentStatusTrackerProps {
  transaction: PaymentTransaction;
  onRefresh?: () => void;
  onRequestRefund?: (transactionId: string) => void;
  isLoading?: boolean;
  className?: string;
}

/**
 * PaymentStatusTracker - Track payment status with details
 */
export function PaymentStatusTracker({
  transaction,
  onRefresh,
  onRequestRefund,
  isLoading = false,
  className = '',
}: PaymentStatusTrackerProps) {
  const canRefund = transaction.status === 'COMPLETED' && !transaction.refundAmount;

  return (
    <div className={`rounded-lg border border-border bg-card ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Payment Details</h3>
            <p className="text-sm text-muted-foreground">Transaction #{transaction.transactionId}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <PaymentStatusBadge status={transaction.status} />
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              title="Refresh status"
            >
              <RefreshCw className={`w-4 h-4 text-muted-foreground ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Payment Info */}
      <div className="p-4 space-y-4">
        {/* Amount */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Amount</span>
          <span className="font-semibold text-foreground">₱{transaction.amount.toLocaleString()}</span>
        </div>
        {transaction.processingFee > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Processing Fee</span>
            <span className="text-foreground">₱{transaction.processingFee.toLocaleString()}</span>
          </div>
        )}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="font-medium text-foreground">Total</span>
          <span className="font-bold text-lg text-primary">₱{transaction.totalAmount.toLocaleString()}</span>
        </div>

        {/* Method */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Payment Method</span>
          <PaymentMethodBadge method={transaction.method} />
        </div>

        {/* Reference */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Reference Code</span>
          <span className="font-mono text-sm text-foreground">{transaction.referenceCode}</span>
        </div>

        {/* Order */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Order</span>
          <span className="text-foreground">#{transaction.orderNumber}</span>
        </div>

        {/* Timestamps */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Created</span>
          <span className="text-foreground">{format(new Date(transaction.createdAt), 'MMM d, yyyy h:mm a')}</span>
        </div>
        {transaction.processedAt && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Processed</span>
            <span className="text-foreground">{format(new Date(transaction.processedAt), 'MMM d, yyyy h:mm a')}</span>
          </div>
        )}

        {/* Failure Reason */}
        {transaction.status === 'FAILED' && transaction.failureReason && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-200">Payment Failed</p>
                <p className="text-sm text-red-600 dark:text-red-400">{transaction.failureReason}</p>
              </div>
            </div>
          </div>
        )}

        {/* Refund Info */}
        {transaction.refundAmount && transaction.refundAmount > 0 && (
          <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
            <div className="flex items-start gap-2">
              <RefreshCw className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-purple-800 dark:text-purple-200">Refund Processed</p>
                <p className="text-sm text-purple-600 dark:text-purple-400">
                  ₱{transaction.refundAmount.toLocaleString()} refunded
                  {transaction.refundedAt && ` on ${format(new Date(transaction.refundedAt), 'MMM d, yyyy')}`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      {canRefund && onRequestRefund && (
        <div className="p-4 border-t border-border">
          <button
            onClick={() => onRequestRefund(transaction.transactionId)}
            className="w-full px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
          >
            Request Refund
          </button>
        </div>
      )}
    </div>
  );
}

export { STATUS_CONFIG, METHOD_ICONS, METHOD_LABELS };

