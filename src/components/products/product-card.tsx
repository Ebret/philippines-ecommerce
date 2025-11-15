'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Rating } from '@/components/ui/rating';
import { Heart, ShoppingCart, Check } from 'lucide-react';

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
          'group flex flex-col overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-2xl hover:border-emerald-300 dark:hover:border-emerald-600',
          className
        )}
      >
        {/* Image Container */}
        <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 sm:h-56">
          <Image
            src={image}
            alt={imageAlt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Overlay on Hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {badge && (
              <Badge variant={badge.variant || 'default'} size="sm">
                {badge.label}
              </Badge>
            )}
            {discount > 0 && (
              <div className="px-2.5 py-1 bg-red-500 text-white rounded-full text-xs font-bold shadow-lg">
                -{discount}%
              </div>
            )}
            {!inStock && (
              <Badge variant="neutral" size="sm">
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            className="absolute right-3 top-3 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
            aria-label="Add to wishlist"
          >
            <Heart className="w-5 h-5 text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors" />
          </button>

          {/* Add to Cart Button */}
          {inStock && onAddToCart && (
            <button
              onClick={onAddToCart}
              className="absolute bottom-0 left-0 right-0 translate-y-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 dark:from-emerald-500 dark:to-emerald-600 dark:hover:from-emerald-600 dark:hover:to-emerald-700 py-3 text-sm font-semibold text-white transition-all duration-300 group-hover:translate-y-0 flex items-center justify-center gap-2"
              aria-label={`Add ${title} to cart`}
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
          )}

          {/* In Stock Badge */}
          {inStock && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 bg-emerald-500 text-white rounded-full text-xs font-semibold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Check className="w-3 h-3" />
              In Stock
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-3 p-4">
          {/* Vendor */}
          {vendor && (
            <Link
              href={`/vendors/${vendor.id}`}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 transition-colors hover:text-emerald-700 dark:hover:text-emerald-300 uppercase tracking-wide"
            >
              {vendor.name}
            </Link>
          )}

          {/* Title */}
          <Link
            href={`/products/${id}`}
            className="line-clamp-2 font-bold text-gray-900 dark:text-white transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 text-base"
          >
            {title}
          </Link>

          {/* Rating */}
          {rating > 0 && (
            <div className="flex items-center gap-2">
              <Rating value={rating} maxValue={5} readOnly size="sm" showLabel={false} />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              ₱{price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 line-through">
                ₱{originalPrice.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
              </span>
            )}
          </div>

          {/* Stock Status */}
          {!inStock && (
            <p className="text-xs font-semibold text-red-600 dark:text-red-400 mt-2">Currently unavailable</p>
          )}
        </div>
      </div>
    );
  }
);
ProductCard.displayName = 'ProductCard';

export { ProductCard };

