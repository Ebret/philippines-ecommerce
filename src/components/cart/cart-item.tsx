'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface CartItemProps {
  id: string;
  productId: string;
  title: string;
  price: number;
  image: string;
  imageAlt?: string;
  quantity: number;
  maxQuantity?: number;
  vendor?: {
    name: string;
    id: string;
  };
  onQuantityChange?: (quantity: number) => void;
  onRemove?: () => void;
  className?: string;
}

const CartItem = React.forwardRef<HTMLDivElement, CartItemProps>(
  (
    {
      id,
      productId,
      title,
      price,
      image,
      imageAlt = title,
      quantity,
      maxQuantity = 999,
      vendor,
      onQuantityChange,
      onRemove,
      className,
    },
    ref
  ) => {
    const subtotal = price * quantity;

    const handleQuantityChange = (newQuantity: number) => {
      if (newQuantity >= 1 && newQuantity <= maxQuantity) {
        onQuantityChange?.(newQuantity);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex gap-4 rounded-lg border border-neutral-200 bg-white p-4 transition-all hover:shadow-md',
          className
        )}
      >
        {/* Product Image */}
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100 sm:h-28 sm:w-28">
          <Image
            src={image}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 96px, 112px"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-1 flex-col gap-2">
          {/* Title and Vendor */}
          <div>
            <Link
              href={`/products/${productId}`}
              className="font-medium text-neutral-900 transition-colors hover:text-primary-600"
            >
              {title}
            </Link>
            {vendor && (
              <Link
                href={`/vendors/${vendor.id}`}
                className="text-xs text-neutral-500 transition-colors hover:text-primary-600"
              >
                {vendor.name}
              </Link>
            )}
          </div>

          {/* Price and Subtotal */}
          <div className="flex items-center gap-2">
            <span className="font-medium text-primary-600">
              ₱{price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-sm text-neutral-500">×</span>
            <span className="text-sm text-neutral-600">{quantity}</span>
            <span className="text-sm text-neutral-500">=</span>
            <span className="font-bold text-neutral-900">
              ₱{subtotal.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Quantity Controls and Remove */}
          <div className="flex items-center gap-3">
            {/* Quantity Selector */}
            <div className="flex items-center gap-2 rounded-lg border border-neutral-200">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                className="px-2 py-1 text-neutral-600 hover:bg-neutral-100"
                aria-label="Decrease quantity"
                disabled={quantity <= 1}
              >
                −
              </button>
              <span className="w-6 text-center text-sm">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className="px-2 py-1 text-neutral-600 hover:bg-neutral-100"
                aria-label="Increase quantity"
                disabled={quantity >= maxQuantity}
              >
                +
              </button>
            </div>

            {/* Remove Button */}
            <button
              onClick={onRemove}
              className="ml-auto text-sm text-error-600 transition-colors hover:text-error-700"
              aria-label={`Remove ${title} from cart`}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    );
  }
);
CartItem.displayName = 'CartItem';

export { CartItem };

