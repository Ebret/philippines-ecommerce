/**
 * Order Management Components
 * Phase 25.1: Order Management Enhancements
 *
 * Components for order tracking, history, detail view, cancellation, and admin dashboard.
 */

// Status badges for orders, payments, and shipments
export {
  OrderStatusBadge,
  PaymentStatusBadge,
  ShipmentStatusBadge,
  ORDER_STATUS_CONFIG,
  PAYMENT_STATUS_CONFIG,
  SHIPMENT_STATUS_CONFIG,
} from './order-status-badge';
export type {
  OrderStatus,
  PaymentStatus,
  ShipmentStatus,
  OrderStatusBadgeProps,
  PaymentStatusBadgeProps,
  ShipmentStatusBadgeProps,
} from './order-status-badge';

// Order tracking timeline
export {
  OrderTrackingTimeline,
  ORDER_FLOW_STEPS,
  STATUS_ORDER,
  STATUS_ICONS,
} from './order-tracking-timeline';
export type {
  TimelineEvent,
  OrderTrackingTimelineProps,
} from './order-tracking-timeline';

// Order history list with filtering
export { OrderHistory } from './order-history';
export type {
  Order,
  OrderItem,
  OrderHistoryProps,
} from './order-history';

// Order detail view
export { OrderDetailView } from './order-detail-view';
export type {
  Address,
  OrderDetailItem,
  PaymentInfo,
  ShipmentInfo,
  OrderDetail,
  OrderDetailViewProps,
} from './order-detail-view';

// Order cancellation
export { OrderCancellation, CANCELLATION_REASONS } from './order-cancellation';
export type {
  OrderCancellationProps,
  CancellationData,
} from './order-cancellation';

// Admin order dashboard
export { AdminOrderDashboard } from './admin-order-dashboard';
export type {
  AdminOrder,
  OrderStats,
  AdminOrderDashboardProps,
} from './admin-order-dashboard';

