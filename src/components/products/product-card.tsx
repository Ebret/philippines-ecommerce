'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Rating } from '@/components/ui/rating';

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  imageAlt?: string;
  rating?: number;
  reviewCount?: number;
  vendor?: {
    name: string;
    id: string;
  };
  badge?: {
    label: string;
    variant?: 'default' | 'secondary' | 'success' | 'error' | 'warning' | 'neutral' | 'outline';
  };
  inStock?: boolean;
  onAddToCart?: () => void;
  className?: string;
}

const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  (
    {
      id,
      title,
      price,
      originalPrice,
      image,
      imageAlt = title,
      rating = 0,
      reviewCount = 0,
      vendor,
      badge,
      inStock = true,
      onAddToCart,
      className,
    },
    ref
  ) => {
    const discount = originalPrice
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

    return (
      <div
        ref={ref}
        className={cn(
          'group flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white transition-all hover:shadow-lg',
          className
        )}
      >
        {/* Image Container */}
        <div className="relative h-48 w-full overflow-hidden bg-neutral-100 sm:h-56">
          <Image
            src={image}
            alt={imageAlt}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Badges */}
          <div className="absolute left-2 top-2 flex flex-col gap-2">
            {badge && (
              <Badge variant={badge.variant || 'default'} size="sm">
                {badge.label}
              </Badge>
            )}
            {discount > 0 && (
              <Badge variant="error" size="sm">
                -{discount}%
              </Badge>
            )}
            {!inStock && (
              <Badge variant="neutral" size="sm">
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Add to Cart Button */}
          {inStock && onAddToCart && (
            <button
              onClick={onAddToCart}
              className="absolute bottom-0 left-0 right-0 translate-y-full bg-primary-600 py-2 text-sm font-medium text-white transition-transform group-hover:translate-y-0"
              aria-label={`Add ${title} to cart`}
            >
              Add to Cart
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
          {/* Vendor */}
          {vendor && (
            <Link
              href={`/vendors/${vendor.id}`}
              className="text-xs text-neutral-500 transition-colors hover:text-primary-600"
            >
              {vendor.name}
            </Link>
          )}

          {/* Title */}
          <Link
            href={`/products/${id}`}
            className="line-clamp-2 font-medium text-neutral-900 transition-colors hover:text-primary-600"
          >
            {title}
          </Link>

          {/* Rating */}
          {rating > 0 && (
            <div className="flex items-center gap-1">
              <Rating value={rating} maxValue={5} readOnly size="sm" showLabel={false} />
              <span className="text-xs text-neutral-500">({reviewCount})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-primary-600">
              ₱{price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-sm text-neutral-500 line-through">
                ₱{originalPrice.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
              </span>
            )}
          </div>

          {/* Stock Status */}
          {!inStock && (
            <p className="text-xs text-error-600 font-medium">Currently unavailable</p>
          )}
        </div>
      </div>
    );
  }
);
ProductCard.displayName = 'ProductCard';

export { ProductCard };

