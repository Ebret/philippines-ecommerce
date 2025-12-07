'use client';

import React, { useState } from 'react';
import { XCircle, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

// Cancellation reason options
const CANCELLATION_REASONS = [
  { value: 'CHANGED_MIND', label: 'Changed my mind' },
  { value: 'FOUND_BETTER_PRICE', label: 'Found a better price elsewhere' },
  { value: 'ORDERED_BY_MISTAKE', label: 'Ordered by mistake' },
  { value: 'DELIVERY_TOO_LONG', label: 'Delivery time is too long' },
  { value: 'PAYMENT_ISSUES', label: 'Payment issues' },
  { value: 'PRODUCT_NOT_NEEDED', label: 'Product no longer needed' },
  { value: 'OTHER', label: 'Other reason' },
];

export interface OrderCancellationProps {
  orderId: string;
  orderNumber: string;
  orderAmount: number;
  currency?: string;
  canRefund?: boolean;
  onCancel: (data: CancellationData) => Promise<void>;
  onClose: () => void;
  className?: string;
}

export interface CancellationData {
  orderId: string;
  reason: string;
  additionalComments?: string;
  requestRefund: boolean;
}

/**
 * OrderCancellation - Modal/form for cancelling orders
 */
export function OrderCancellation({
  orderId,
  orderNumber,
  orderAmount,
  currency = 'PHP',
  canRefund = true,
  onCancel,
  onClose,
  className = '',
}: OrderCancellationProps) {
  const [reason, setReason] = useState('');
  const [additionalComments, setAdditionalComments] = useState('');
  const [requestRefund, setRequestRefund] = useState(canRefund);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  // Handle submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      setError('Please select a cancellation reason');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onCancel({
        orderId,
        reason,
        additionalComments: additionalComments || undefined,
        requestRefund,
      });
      setIsSuccess(true);
      setTimeout(() => onClose(), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel order');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (isSuccess) {
    return (
      <div className={`p-6 text-center ${className}`}>
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Order Cancelled</h3>
        <p className="text-muted-foreground">
          Your order {orderNumber} has been cancelled successfully.
          {requestRefund && ' Your refund request has been submitted.'}
        </p>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Cancel Order</h2>
          <p className="text-sm text-muted-foreground">Order: {orderNumber}</p>
        </div>
      </div>

      {/* Warning */}
      <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800 dark:text-amber-200">
            <p className="font-medium">Are you sure you want to cancel this order?</p>
            <p className="mt-1">This action cannot be undone. If you&apos;ve already paid, you can request a refund.</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Reason Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Cancellation Reason <span className="text-red-500">*</span>
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            required
          >
            <option value="">Select a reason...</option>
            {CANCELLATION_REASONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Additional Comments */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Additional Comments (Optional)
          </label>
          <textarea
            value={additionalComments}
            onChange={(e) => setAdditionalComments(e.target.value)}
            rows={3}
            placeholder="Please provide any additional details..."
            className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          />
        </div>

        {/* Refund Request */}
        {canRefund && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <input
              type="checkbox"
              id="requestRefund"
              checked={requestRefund}
              onChange={(e) => setRequestRefund(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded border-border"
            />
            <label htmlFor="requestRefund" className="text-sm">
              <span className="font-medium text-foreground">Request a refund</span>
              <p className="text-muted-foreground mt-0.5">
                Amount to be refunded: <span className="font-semibold">{formatCurrency(orderAmount)}</span>
              </p>
            </label>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-border hover:bg-muted transition-colors"
            disabled={isSubmitting}
          >
            Keep Order
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !reason}
            className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Cancelling...
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4" />
                Cancel Order
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export { CANCELLATION_REASONS };

