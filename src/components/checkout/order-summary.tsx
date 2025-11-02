'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

interface OrderSummaryProps {
  items: OrderItem[];
  subtotal: number;
  shippingCost?: number;
  tax?: number;
  discountAmount?: number;
  discountCode?: string;
  total: number;
  className?: string;
}

const OrderSummary = React.forwardRef<HTMLDivElement, OrderSummaryProps>(
  (
    {
      items,
      subtotal,
      shippingCost = 0,
      tax = 0,
      discountAmount = 0,
      discountCode,
      total,
      className,
    },
    ref
  ) => {
    return (
      <Card ref={ref} className={className}>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Items */}
          <div className="space-y-3 border-b border-neutral-200 pb-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3">
                {/* Item Image */}
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded bg-neutral-100">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>

                {/* Item Info */}
                <div className="flex-1">
                  <p className="line-clamp-2 text-sm font-medium text-neutral-900">
                    {item.title}
                  </p>
                  <p className="text-xs text-neutral-600">
                    ₱{item.price.toLocaleString('en-PH', { minimumFractionDigits: 2 })} × {item.quantity}
                  </p>
                </div>

                {/* Item Total */}
                <div className="text-right">
                  <p className="font-medium text-neutral-900">
                    ₱{(item.price * item.quantity).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Breakdown */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-600">Subtotal</span>
              <span className="font-medium text-neutral-900">
                ₱{subtotal.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
              </span>
            </div>

            {shippingCost > 0 && (
              <div className="flex justify-between">
                <span className="text-neutral-600">Shipping</span>
                <span className="font-medium text-neutral-900">
                  ₱{shippingCost.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}

            {tax > 0 && (
              <div className="flex justify-between">
                <span className="text-neutral-600">Tax (VAT)</span>
                <span className="font-medium text-neutral-900">
                  ₱{tax.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}

            {discountAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-neutral-600">
                  Discount {discountCode && `(${discountCode})`}
                </span>
                <span className="font-medium text-success-600">
                  -₱{discountAmount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-neutral-200" />

          {/* Total */}
          <div className="flex justify-between">
            <span className="font-bold text-neutral-900">Total Amount</span>
            <span className="text-2xl font-bold text-primary-600">
              ₱{total.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Info Box */}
          <div className="rounded-lg bg-neutral-50 p-3 text-xs text-neutral-600">
            <p>
              ✓ Your order is protected by our buyer protection policy
            </p>
            <p className="mt-1">
              ✓ Free returns within 30 days
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
);
OrderSummary.displayName = 'OrderSummary';

export { OrderSummary };

