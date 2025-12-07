/**
 * Payment Components Index
 * Phase 25.2: Payment System Enhancements
 * 
 * Exports all payment-related components for the Philippines E-Commerce Platform
 */

// Payment Status Tracker
export {
  PaymentStatusBadge,
  PaymentMethodBadge,
  PaymentStatusTracker,
  STATUS_CONFIG,
  METHOD_ICONS,
  METHOD_LABELS,
} from './payment-status-tracker';
export type {
  PaymentStatusType,
  PaymentMethodType,
  PaymentTransaction,
  PaymentStatusBadgeProps,
  PaymentMethodBadgeProps,
  PaymentStatusTrackerProps,
} from './payment-status-tracker';

// Payment Method Manager
export {
  PaymentMethodManager,
  METHOD_ICONS as PAYMENT_METHOD_ICONS,
  METHOD_COLORS,
  METHOD_LABELS as PAYMENT_METHOD_LABELS,
} from './payment-method-manager';
export type {
  SavedPaymentMethod,
  PaymentMethodManagerProps,
} from './payment-method-manager';

// Payment Receipt
export { PaymentReceipt } from './payment-receipt';
export type {
  PaymentReceiptData,
  PaymentReceiptProps,
} from './payment-receipt';

// Refund Request
export { RefundRequest, REFUND_REASONS } from './refund-request';
export type {
  RefundRequestData,
  RefundRequestProps,
} from './refund-request';

// Payment History
export {
  PaymentHistory,
  STATUS_OPTIONS,
  METHOD_OPTIONS,
} from './payment-history';
export type { PaymentHistoryProps } from './payment-history';

