'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AddressForm, type AddressData } from './address-form';
import { PaymentMethod, type PaymentMethodType } from './payment-method';
import { OrderSummary } from './order-summary';

interface CheckoutFormProps {
  items: Array<{
    id: string;
    title: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  subtotal: number;
  shippingCost?: number;
  tax?: number;
  discountAmount?: number;
  discountCode?: string;
  total: number;
  onSubmit?: (data: CheckoutData) => void;
  isLoading?: boolean;
  className?: string;
}

export interface CheckoutData {
  address: AddressData;
  paymentMethod: PaymentMethodType;
}

const CheckoutForm = React.forwardRef<HTMLDivElement, CheckoutFormProps>(
  (
    {
      items,
      subtotal,
      shippingCost = 0,
      tax = 0,
      discountAmount = 0,
      discountCode,
      total,
      onSubmit,
      isLoading = false,
      className,
    },
    ref
  ) => {
    const [currentStep, setCurrentStep] = React.useState<'address' | 'payment' | 'review'>(
      'address'
    );
    const [address, setAddress] = React.useState<AddressData | null>(null);
    const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethodType | null>(null);

    const handleAddressSubmit = (addressData: AddressData) => {
      setAddress(addressData);
      setCurrentStep('payment');
    };

    const handlePaymentSelect = (method: PaymentMethodType) => {
      setPaymentMethod(method);
      setCurrentStep('review');
    };

    const handleSubmit = () => {
      if (address && paymentMethod) {
        onSubmit?.({
          address,
          paymentMethod,
        });
      }
    };

    const handleBack = () => {
      if (currentStep === 'payment') {
        setCurrentStep('address');
      } else if (currentStep === 'review') {
        setCurrentStep('payment');
      }
    };

    return (
      <div ref={ref} className={cn('space-y-6', className)}>
        {/* Step Indicator */}
        <div className="flex items-center justify-between">
          {['address', 'payment', 'review'].map((step, index) => (
            <React.Fragment key={step}>
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full font-medium',
                  currentStep === step
                    ? 'bg-primary-600 text-white'
                    : index < ['address', 'payment', 'review'].indexOf(currentStep)
                      ? 'bg-success-600 text-white'
                      : 'bg-neutral-200 text-neutral-600'
                )}
              >
                {index < ['address', 'payment', 'review'].indexOf(currentStep) ? '✓' : index + 1}
              </div>
              {index < 2 && (
                <div
                  className={cn(
                    'flex-1 h-1 mx-2',
                    index < ['address', 'payment', 'review'].indexOf(currentStep)
                      ? 'bg-success-600'
                      : 'bg-neutral-200'
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step Labels */}
        <div className="flex justify-between text-xs font-medium text-neutral-600">
          <span>Delivery Address</span>
          <span>Payment Method</span>
          <span>Review Order</span>
        </div>

        {/* Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 'address' && (
              <AddressForm onSubmit={handleAddressSubmit} />
            )}

            {currentStep === 'payment' && (
              <PaymentMethod onSelect={handlePaymentSelect} />
            )}

            {currentStep === 'review' && address && paymentMethod && (
              <Card>
                <div className="p-6 space-y-6">
                  {/* Address Review */}
                  <div>
                    <h3 className="font-bold text-neutral-900 mb-3">Delivery Address</h3>
                    <div className="bg-neutral-50 p-4 rounded-lg text-sm text-neutral-700 space-y-1">
                      <p className="font-medium">{address.fullName}</p>
                      <p>{address.street}</p>
                      <p>{address.barangay}, {address.municipality}</p>
                      <p>{address.province} {address.postalCode}</p>
                      <p className="text-neutral-600">{address.phoneNumber}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentStep('address')}
                      className="mt-3"
                    >
                      Change Address
                    </Button>
                  </div>

                  {/* Payment Review */}
                  <div>
                    <h3 className="font-bold text-neutral-900 mb-3">Payment Method</h3>
                    <div className="bg-neutral-50 p-4 rounded-lg text-sm text-neutral-700">
                      <p className="font-medium capitalize">
                        {paymentMethod.replace('_', ' ')}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentStep('payment')}
                      className="mt-3"
                    >
                      Change Payment Method
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <OrderSummary
              items={items}
              subtotal={subtotal}
              shippingCost={shippingCost}
              tax={tax}
              discountAmount={discountAmount}
              discountCode={discountCode}
              total={total}
            />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3">
          {currentStep !== 'address' && (
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={isLoading}
            >
              Back
            </Button>
          )}
          {currentStep !== 'review' && (
            <Button
              className="flex-1"
              disabled={isLoading}
            >
              Continue
            </Button>
          )}
          {currentStep === 'review' && (
            <Button
              className="flex-1"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Place Order'}
            </Button>
          )}
        </div>
      </div>
    );
  }
);
CheckoutForm.displayName = 'CheckoutForm';

export { CheckoutForm };

