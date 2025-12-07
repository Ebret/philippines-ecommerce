'use client';

import React, { useRef } from 'react';
import { format } from 'date-fns';
import {
  Receipt,
  Download,
  Printer,
  Share2,
  CheckCircle,
  Store,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';
import { PaymentMethodType, PaymentStatusType, PaymentStatusBadge, PaymentMethodBadge } from './payment-status-tracker';

// Receipt data interface
export interface PaymentReceiptData {
  // Transaction info
  transactionId: string;
  referenceCode: string;
  orderId: string;
  orderNumber: string;
  // Payment info
  method: PaymentMethodType;
  status: PaymentStatusType;
  amount: number;
  processingFee: number;
  totalAmount: number;
  currency: string;
  // Timestamps
  createdAt: string;
  processedAt?: string;
  // Customer info
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  // Vendor info
  vendorName: string;
  vendorAddress?: string;
  vendorPhone?: string;
  vendorEmail?: string;
  // Items
  items: {
    name: string;
    quantity: number;
    price: number;
    total: number;
  }[];
  // Totals
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
}

export interface PaymentReceiptProps {
  receipt: PaymentReceiptData;
  onDownload?: () => void;
  onPrint?: () => void;
  onShare?: () => void;
  showActions?: boolean;
  className?: string;
}

/**
 * PaymentReceipt - Display and print payment receipt
 */
export function PaymentReceipt({
  receipt,
  onDownload,
  onPrint,
  onShare,
  showActions = true,
  className = '',
}: PaymentReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  // Handle print
  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  return (
    <div className={`rounded-lg border border-border bg-card ${className}`}>
      {/* Actions */}
      {showActions && (
        <div className="flex items-center justify-end gap-2 p-4 border-b border-border print:hidden">
          {onDownload && (
            <button
              onClick={onDownload}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          )}
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          {onShare && (
            <button
              onClick={onShare}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          )}
        </div>
      )}

      {/* Receipt Content */}
      <div ref={receiptRef} className="p-6 print:p-0">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Payment Receipt</h2>
          <p className="text-muted-foreground">Thank you for your purchase!</p>
        </div>

        {/* Transaction Info */}
        <div className="mb-6 p-4 rounded-lg bg-muted/30">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Transaction ID</span>
              <p className="font-mono font-medium text-foreground">{receipt.transactionId}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Reference Code</span>
              <p className="font-mono font-medium text-foreground">{receipt.referenceCode}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Order Number</span>
              <p className="font-medium text-foreground">#{receipt.orderNumber}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Date</span>
              <p className="font-medium text-foreground">{format(new Date(receipt.createdAt), 'MMM d, yyyy h:mm a')}</p>
            </div>
          </div>
        </div>

        {/* Status & Method */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-sm text-muted-foreground">Status</span>
            <div className="mt-1"><PaymentStatusBadge status={receipt.status} /></div>
          </div>
          <div className="text-right">
            <span className="text-sm text-muted-foreground">Payment Method</span>
            <div className="mt-1"><PaymentMethodBadge method={receipt.method} /></div>
          </div>
        </div>

        {/* Items */}
        <div className="mb-6">
          <h3 className="font-semibold text-foreground mb-3">Items</h3>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium text-foreground">Item</th>
                  <th className="text-center p-3 font-medium text-foreground">Qty</th>
                  <th className="text-right p-3 font-medium text-foreground">Price</th>
                  <th className="text-right p-3 font-medium text-foreground">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {receipt.items.map((item, index) => (
                  <tr key={index}>
                    <td className="p-3 text-foreground">{item.name}</td>
                    <td className="p-3 text-center text-muted-foreground">{item.quantity}</td>
                    <td className="p-3 text-right text-muted-foreground">₱{item.price.toLocaleString()}</td>
                    <td className="p-3 text-right font-medium text-foreground">₱{item.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="mb-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-foreground">₱{receipt.subtotal.toLocaleString()}</span>
          </div>
          {receipt.tax > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax</span>
              <span className="text-foreground">₱{receipt.tax.toLocaleString()}</span>
            </div>
          )}
          {receipt.shipping > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-foreground">₱{receipt.shipping.toLocaleString()}</span>
            </div>
          )}
          {receipt.discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Discount</span>
              <span className="text-green-600 dark:text-green-400">-₱{receipt.discount.toLocaleString()}</span>
            </div>
          )}
          {receipt.processingFee > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Processing Fee</span>
              <span className="text-foreground">₱{receipt.processingFee.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t border-border">
            <span className="font-semibold text-foreground">Total Paid</span>
            <span className="font-bold text-lg text-primary">₱{receipt.totalAmount.toLocaleString()}</span>
          </div>
        </div>

        {/* Customer & Vendor Info */}
        <div className="grid grid-cols-2 gap-6 text-sm">
          {/* Customer */}
          <div>
            <h4 className="font-semibold text-foreground mb-2">Customer</h4>
            <p className="text-foreground">{receipt.customerName}</p>
            <div className="flex items-center gap-1 text-muted-foreground mt-1">
              <Mail className="w-3 h-3" />
              <span>{receipt.customerEmail}</span>
            </div>
            {receipt.customerPhone && (
              <div className="flex items-center gap-1 text-muted-foreground mt-1">
                <Phone className="w-3 h-3" />
                <span>{receipt.customerPhone}</span>
              </div>
            )}
          </div>

          {/* Vendor */}
          <div>
            <h4 className="font-semibold text-foreground mb-2">Vendor</h4>
            <div className="flex items-center gap-1 text-foreground">
              <Store className="w-3 h-3" />
              <span>{receipt.vendorName}</span>
            </div>
            {receipt.vendorAddress && (
              <div className="flex items-start gap-1 text-muted-foreground mt-1">
                <MapPin className="w-3 h-3 mt-0.5" />
                <span>{receipt.vendorAddress}</span>
              </div>
            )}
            {receipt.vendorEmail && (
              <div className="flex items-center gap-1 text-muted-foreground mt-1">
                <Mail className="w-3 h-3" />
                <span>{receipt.vendorEmail}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-border text-center text-xs text-muted-foreground">
          <p>This is an official receipt for your records.</p>
          <p className="mt-1">For questions, contact support@extremelifeherbal.com</p>
        </div>
      </div>
    </div>
  );
}

