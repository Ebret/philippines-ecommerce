'use client';

import React, { useState } from 'react';
import {
  RefreshCw,
  AlertCircle,
  CheckCircle,
  X,
  Loader2,
  Info,
} from 'lucide-react';
import { PaymentMethodType, PaymentMethodBadge } from './payment-status-tracker';

// Refund reason options
const REFUND_REASONS = [
  { value: 'DEFECTIVE_PRODUCT', label: 'Defective or damaged product' },
  { value: 'WRONG_ITEM', label: 'Wrong item received' },
  { value: 'NOT_AS_DESCRIBED', label: 'Item not as described' },
  { value: 'CHANGED_MIND', label: 'Changed my mind' },
  { value: 'DUPLICATE_ORDER', label: 'Duplicate order' },
  { value: 'DELIVERY_ISSUE', label: 'Delivery issue' },
  { value: 'OTHER', label: 'Other reason' },
];

// Refund request interface
export interface RefundRequestData {
  transactionId: string;
  orderId: string;
  orderNumber: string;
  amount: number;
  method: PaymentMethodType;
  reason: string;
  description: string;
  requestPartialRefund: boolean;
  partialAmount?: number;
}

export interface RefundRequestProps {
  transactionId: string;
  orderId: string;
  orderNumber: string;
  amount: number;
  method: PaymentMethodType;
  onSubmit: (data: RefundRequestData) => Promise<void>;
  onCancel: () => void;
  isOpen?: boolean;
  className?: string;
}

/**
 * RefundRequest - Request a refund for a payment
 */
export function RefundRequest({
  transactionId,
  orderId,
  orderNumber,
  amount,
  method,
  onSubmit,
  onCancel,
  isOpen = true,
  className = '',
}: RefundRequestProps) {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [requestPartialRefund, setRequestPartialRefund] = useState(false);
  const [partialAmount, setPartialAmount] = useState<number>(amount);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!reason) {
      setError('Please select a reason for the refund');
      return;
    }

    if (requestPartialRefund && (!partialAmount || partialAmount <= 0 || partialAmount > amount)) {
      setError('Please enter a valid refund amount');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        transactionId,
        orderId,
        orderNumber,
        amount: requestPartialRefund ? partialAmount! : amount,
        method,
        reason,
        description,
        requestPartialRefund,
        partialAmount: requestPartialRefund ? partialAmount : undefined,
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit refund request');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Success state
  if (success) {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 ${className}`}>
        <div className="w-full max-w-md mx-4 rounded-lg bg-card p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Refund Request Submitted</h3>
          <p className="text-muted-foreground mb-4">
            Your refund request for ₱{(requestPartialRefund ? partialAmount : amount)?.toLocaleString()} has been submitted.
            We'll process it within 3-5 business days.
          </p>
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 ${className}`}>
      <div className="w-full max-w-lg mx-4 rounded-lg bg-card max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Request Refund</h3>
              <p className="text-sm text-muted-foreground">Order #{orderNumber}</p>
            </div>
          </div>
          <button onClick={onCancel} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Payment Info */}
          <div className="p-3 rounded-lg bg-muted/30 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Original Amount</p>
              <p className="font-semibold text-foreground">₱{amount.toLocaleString()}</p>
            </div>
            <PaymentMethodBadge method={method} />
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Reason for Refund <span className="text-red-500">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select a reason</option>
              {REFUND_REASONS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Additional Details
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide more details about your refund request..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Partial Refund */}
          <div className="p-3 rounded-lg border border-border">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={requestPartialRefund}
                onChange={(e) => setRequestPartialRefund(e.target.checked)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-foreground">Request partial refund</span>
            </label>
            {requestPartialRefund && (
              <div className="mt-3">
                <label className="block text-sm text-muted-foreground mb-1">Refund Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₱</span>
                  <input
                    type="number"
                    value={partialAmount}
                    onChange={(e) => setPartialAmount(Number(e.target.value))}
                    min={1}
                    max={amount}
                    className="w-full pl-8 pr-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Maximum: ₱{amount.toLocaleString()}</p>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-medium">Refund Policy</p>
                <p className="text-blue-600 dark:text-blue-400 mt-1">
                  Refunds are processed within 3-5 business days. The amount will be credited back to your original payment method.
                </p>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                <span className="text-sm text-red-800 dark:text-red-200">{error}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Request'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export { REFUND_REASONS };

