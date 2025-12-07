'use client';

import React from 'react';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Package,
  Truck,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Copy,
  Download,
  MessageSquare,
  XCircle,
  RotateCcw,
  Printer,
} from 'lucide-react';
import {
  OrderStatusBadge,
  PaymentStatusBadge,
  ShipmentStatusBadge,
  OrderStatus,
  PaymentStatus,
  ShipmentStatus,
} from './order-status-badge';
import { OrderTrackingTimeline, TimelineEvent } from './order-tracking-timeline';

// Address interface
export interface Address {
  fullName: string;
  phone: string;
  email?: string;
  addressLine1: string;
  addressLine2?: string;
  barangay?: string;
  city: string;
  province: string;
  region: string;
  postalCode: string;
  country: string;
}

// Order item interface
export interface OrderDetailItem {
  id: string;
  productId: string;
  productName: string;
  variantId?: string;
  variantName?: string;
  sku?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  imageUrl?: string;
}

// Payment interface
export interface PaymentInfo {
  id: string;
  method: string;
  gateway?: string;
  transactionId?: string;
  amount: number;
  status: PaymentStatus;
  processedAt?: string;
}

// Shipment interface
export interface ShipmentInfo {
  id: string;
  provider: string;
  trackingNumber?: string;
  status: ShipmentStatus;
  shippedAt?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
}

// Order detail interface
export interface OrderDetail {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: number;
  taxAmount: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  notes?: string;
  items: OrderDetailItem[];
  shippingAddress: Address;
  billingAddress?: Address;
  payments: PaymentInfo[];
  shipment?: ShipmentInfo;
  vendorName: string;
  vendorId: string;
  timelineEvents: TimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderDetailViewProps {
  order: OrderDetail;
  onBack?: () => void;
  onCancel?: (orderId: string) => void;
  onReturn?: (orderId: string) => void;
  onContactSupport?: (orderId: string) => void;
  onPrint?: (orderId: string) => void;
  className?: string;
}

/**
 * OrderDetailView - Detailed view of a single order
 */
export function OrderDetailView({
  order,
  onBack,
  onCancel,
  onReturn,
  onContactSupport,
  onPrint,
  className = '',
}: OrderDetailViewProps) {
  // Format currency
  const formatCurrency = (amount: number, currency: string = 'PHP') => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Check if order can be cancelled
  const canCancel = ['PENDING', 'CONFIRMED'].includes(order.status);
  const canReturn = order.status === 'DELIVERED';

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          {onBack && (
            <button onClick={onBack} className="p-2 rounded-lg border border-border hover:bg-muted transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">{order.orderNumber}</h1>
              <button onClick={() => copyToClipboard(order.orderNumber)} className="p-1 rounded hover:bg-muted" title="Copy order number">
                <Copy className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground">
              Placed on {format(new Date(order.createdAt), 'MMMM d, yyyy at h:mm a')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <OrderStatusBadge status={order.status} size="lg" />
          <PaymentStatusBadge status={order.paymentStatus} size="lg" />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        {onPrint && (
          <button onClick={() => onPrint(order.id)} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors">
            <Printer className="w-4 h-4" />
            Print
          </button>
        )}
        {onContactSupport && (
          <button onClick={() => onContactSupport(order.id)} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors">
            <MessageSquare className="w-4 h-4" />
            Contact Support
          </button>
        )}
        {canCancel && onCancel && (
          <button onClick={() => onCancel(order.id)} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950 transition-colors">
            <XCircle className="w-4 h-4" />
            Cancel Order
          </button>
        )}
        {canReturn && onReturn && (
          <button onClick={() => onReturn(order.id)} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-orange-300 text-orange-600 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-950 transition-colors">
            <RotateCcw className="w-4 h-4" />
            Request Return
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Items & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Items
            </h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 p-3 rounded-lg bg-muted/50">
                  <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Package className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{item.productName}</p>
                    {item.variantName && <p className="text-sm text-muted-foreground">{item.variantName}</p>}
                    {item.sku && <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>}
                    <div className="flex justify-between items-end mt-2">
                      <span className="text-sm text-muted-foreground">Qty: {item.quantity} × {formatCurrency(item.unitPrice, order.currency)}</span>
                      <span className="font-semibold text-foreground">{formatCurrency(item.totalPrice, order.currency)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Timeline */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Order Timeline
            </h2>
            <OrderTrackingTimeline events={order.timelineEvents} currentStatus={order.status} />
          </div>
        </div>

        {/* Right Column - Summary & Addresses */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatCurrency(order.subtotal, order.currency)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>{formatCurrency(order.taxAmount, order.currency)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{formatCurrency(order.shippingFee, order.currency)}</span></div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatCurrency(order.discountAmount, order.currency)}</span></div>
              )}
              <hr className="my-2 border-border" />
              <div className="flex justify-between font-semibold text-lg"><span>Total</span><span>{formatCurrency(order.totalAmount, order.currency)}</span></div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Shipping Address
            </h2>
            <div className="space-y-1 text-sm">
              <p className="font-medium">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>{order.shippingAddress.barangay && `${order.shippingAddress.barangay}, `}{order.shippingAddress.city}, {order.shippingAddress.province}</p>
              <p>{order.shippingAddress.region}, {order.shippingAddress.postalCode}</p>
              <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                {order.shippingAddress.phone}
              </div>
              {order.shippingAddress.email && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  {order.shippingAddress.email}
                </div>
              )}
            </div>
          </div>

          {/* Payment Info */}
          {order.payments.length > 0 && (
            <div className="rounded-lg border border-border bg-card p-4">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Info
              </h2>
              {order.payments.map((payment) => (
                <div key={payment.id} className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Method</span><span>{payment.method}</span></div>
                  {payment.transactionId && (
                    <div className="flex justify-between"><span className="text-muted-foreground">Transaction ID</span><span className="font-mono text-xs">{payment.transactionId}</span></div>
                  )}
                  <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span>{formatCurrency(payment.amount, order.currency)}</span></div>
                  <div className="flex justify-between items-center"><span className="text-muted-foreground">Status</span><PaymentStatusBadge status={payment.status} size="sm" /></div>
                </div>
              ))}
            </div>
          )}

          {/* Shipment Info */}
          {order.shipment && (
            <div className="rounded-lg border border-border bg-card p-4">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Shipment Info
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Provider</span><span>{order.shipment.provider}</span></div>
                {order.shipment.trackingNumber && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Tracking #</span>
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-xs">{order.shipment.trackingNumber}</span>
                      <button onClick={() => copyToClipboard(order.shipment!.trackingNumber!)} className="p-1 rounded hover:bg-muted">
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
                <div className="flex justify-between items-center"><span className="text-muted-foreground">Status</span><ShipmentStatusBadge status={order.shipment.status} size="sm" /></div>
                {order.shipment.estimatedDelivery && (
                  <div className="flex justify-between"><span className="text-muted-foreground">Est. Delivery</span><span>{format(new Date(order.shipment.estimatedDelivery), 'MMM d, yyyy')}</span></div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

