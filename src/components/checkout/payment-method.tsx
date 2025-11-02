'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PaymentMethodProps {
  onSelect?: (method: PaymentMethodType) => void;
  selectedMethod?: PaymentMethodType;
  className?: string;
}

export type PaymentMethodType = 'gcash' | 'paymaya' | 'cod' | 'bank_transfer' | 'credit_card';

interface PaymentOption {
  id: PaymentMethodType;
  name: string;
  description: string;
  icon: string;
  badge?: string;
  isAvailable: boolean;
}

const PAYMENT_METHODS: PaymentOption[] = [
  {
    id: 'gcash',
    name: 'GCash',
    description: 'Pay using GCash mobile wallet',
    icon: '📱',
    badge: 'Popular',
    isAvailable: true,
  },
  {
    id: 'paymaya',
    name: 'PayMaya',
    description: 'Pay using PayMaya digital wallet',
    icon: '💳',
    isAvailable: true,
  },
  {
    id: 'credit_card',
    name: 'Credit/Debit Card',
    description: 'Visa, Mastercard, or other cards',
    icon: '🏦',
    isAvailable: true,
  },
  {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    description: 'Direct bank transfer (1-2 business days)',
    icon: '🏧',
    isAvailable: true,
  },
  {
    id: 'cod',
    name: 'Cash on Delivery',
    description: 'Pay when your order arrives',
    icon: '💵',
    isAvailable: true,
  },
];

const PaymentMethod = React.forwardRef<HTMLDivElement, PaymentMethodProps>(
  ({ onSelect, selectedMethod, className }, ref) => {
    return (
      <Card ref={ref} className={className}>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.id}
                onClick={() => onSelect?.(method.id)}
                disabled={!method.isAvailable}
                className={cn(
                  'w-full rounded-lg border-2 p-4 text-left transition-all',
                  selectedMethod === method.id
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-neutral-200 hover:border-neutral-300',
                  !method.isAvailable && 'cursor-not-allowed opacity-50'
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {/* Radio Button */}
                    <div
                      className={cn(
                        'mt-1 h-5 w-5 rounded-full border-2 flex-shrink-0',
                        selectedMethod === method.id
                          ? 'border-primary-600 bg-primary-600'
                          : 'border-neutral-300'
                      )}
                    >
                      {selectedMethod === method.id && (
                        <div className="flex h-full w-full items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-white" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{method.icon}</span>
                        <h3 className="font-medium text-neutral-900">{method.name}</h3>
                        {method.badge && (
                          <Badge variant="success" size="sm">
                            {method.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-neutral-600">{method.description}</p>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Payment Info */}
          {selectedMethod && (
            <div className="mt-6 rounded-lg bg-neutral-50 p-4">
              <h4 className="mb-2 font-medium text-neutral-900">Payment Information</h4>
              <ul className="space-y-1 text-sm text-neutral-600">
                {selectedMethod === 'gcash' && (
                  <>
                    <li>• You will be redirected to GCash to complete payment</li>
                    <li>• Your transaction is secure and encrypted</li>
                    <li>• You will receive a confirmation SMS</li>
                  </>
                )}
                {selectedMethod === 'paymaya' && (
                  <>
                    <li>• You will be redirected to PayMaya to complete payment</li>
                    <li>• Your transaction is secure and encrypted</li>
                    <li>• You will receive a confirmation email</li>
                  </>
                )}
                {selectedMethod === 'credit_card' && (
                  <>
                    <li>• Your card details are secure and encrypted</li>
                    <li>• We accept Visa, Mastercard, and other major cards</li>
                    <li>• You will receive a confirmation email</li>
                  </>
                )}
                {selectedMethod === 'bank_transfer' && (
                  <>
                    <li>• Bank details will be provided after order confirmation</li>
                    <li>• Please include your order number in the transfer reference</li>
                    <li>• Order will be processed after payment verification (1-2 days)</li>
                  </>
                )}
                {selectedMethod === 'cod' && (
                  <>
                    <li>• Pay the exact amount to the delivery driver</li>
                    <li>• Please have the exact change ready</li>
                    <li>• A receipt will be provided upon payment</li>
                  </>
                )}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
);
PaymentMethod.displayName = 'PaymentMethod';

export { PaymentMethod };

