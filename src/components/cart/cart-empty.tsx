'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface CartEmptyProps {
  title?: string;
  description?: string;
  onContinueShopping?: () => void;
  className?: string;
}

const CartEmpty = React.forwardRef<HTMLDivElement, CartEmptyProps>(
  (
    {
      title = 'Your cart is empty',
      description = 'Start shopping to add items to your cart',
      onContinueShopping,
      className,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 py-12 text-center',
          className
        )}
      >
        {/* Empty Cart Icon */}
        <div className="mb-4 rounded-full bg-neutral-200 p-4">
          <svg
            className="h-12 w-12 text-neutral-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>

        {/* Title */}
        <h2 className="mb-2 text-2xl font-bold text-neutral-900">{title}</h2>

        {/* Description */}
        <p className="mb-6 max-w-sm text-neutral-600">{description}</p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/products">
            <Button>Browse Products</Button>
          </Link>
          {onContinueShopping && (
            <Button variant="outline" onClick={onContinueShopping}>
              Continue Shopping
            </Button>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-8 max-w-sm rounded-lg bg-white p-4 text-left">
          <h3 className="mb-3 font-medium text-neutral-900">Need help?</h3>
          <ul className="space-y-2 text-sm text-neutral-600">
            <li>
              <Link href="/help/shipping" className="text-primary-600 hover:underline">
                Learn about shipping
              </Link>
            </li>
            <li>
              <Link href="/help/returns" className="text-primary-600 hover:underline">
                View return policy
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-primary-600 hover:underline">
                Contact support
              </Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }
);
CartEmpty.displayName = 'CartEmpty';

export { CartEmpty };

