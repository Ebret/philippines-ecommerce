'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CartSummaryProps {
  subtotal: number;
  shippingCost?: number;
  taxRate?: number;
  discountAmount?: number;
  discountCode?: string;
  onApplyDiscount?: (code: string) => void;
  onCheckout?: () => void;
  onContinueShopping?: () => void;
  isLoading?: boolean;
  className?: string;
}

const CartSummary = React.forwardRef<HTMLDivElement, CartSummaryProps>(
  (
    {
      subtotal,
      shippingCost = 0,
      taxRate = 0.12, // 12% VAT in Philippines
      discountAmount = 0,
      discountCode,
      onApplyDiscount,
      onCheckout,
      onContinueShopping,
      isLoading = false,
      className,
    },
    ref
  ) => {
    const [promoCode, setPromoCode] = React.useState('');
    const [appliedCode, setAppliedCode] = React.useState(discountCode || '');

    const taxableAmount = subtotal - discountAmount;
    const tax = Math.round(taxableAmount * taxRate * 100) / 100;
    const total = subtotal + shippingCost + tax - discountAmount;

    const handleApplyDiscount = () => {
      if (promoCode.trim()) {
        setAppliedCode(promoCode);
        onApplyDiscount?.(promoCode);
        setPromoCode('');
      }
    };

    return (
      <Card ref={ref} className={cn('', className)}>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Subtotal */}
          <div className="flex justify-between text-sm">
            <span className="text-neutral-600">Subtotal</span>
            <span className="font-medium text-neutral-900">
              ₱{subtotal.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Shipping */}
          {shippingCost > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Shipping</span>
              <span className="font-medium text-neutral-900">
                ₱{shippingCost.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}

          {/* Tax */}
          {tax > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Tax (VAT)</span>
              <span className="font-medium text-neutral-900">
                ₱{tax.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}

          {/* Discount */}
          {discountAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">
                Discount {appliedCode && `(${appliedCode})`}
              </span>
              <span className="font-medium text-success-600">
                -₱{discountAmount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-neutral-200" />

          {/* Total */}
          <div className="flex justify-between">
            <span className="font-bold text-neutral-900">Total</span>
            <span className="text-2xl font-bold text-primary-600">
              ₱{total.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Promo Code */}
          {onApplyDiscount && (
            <div className="space-y-2 border-t border-neutral-200 pt-4">
              <label className="text-sm font-medium text-neutral-700">
                Promo Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="Enter promo code"
                  className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary-600 focus:outline-none"
                  disabled={isLoading}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleApplyDiscount}
                  disabled={!promoCode.trim() || isLoading}
                >
                  Apply
                </Button>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="space-y-2 border-t border-neutral-200 pt-4">
            <Button
              className="w-full"
              onClick={onCheckout}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Proceed to Checkout'}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={onContinueShopping}
              disabled={isLoading}
            >
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
);
CartSummary.displayName = 'CartSummary';

export { CartSummary };

