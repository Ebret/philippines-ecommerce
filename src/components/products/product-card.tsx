'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
          'group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-350 ease-out hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30 hover:-translate-y-1',
          className
        )}
      >
        {/* Image Container - Herb and Water style */}
        <div className="relative h-52 w-full overflow-hidden bg-muted sm:h-60">
          <Image
            src={image}
            alt={imageAlt}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Soft gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges - Organic styling */}
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {badge && (
              <Badge variant={badge.variant || 'default'} size="sm" className="rounded-full shadow-sm">
                {badge.label}
              </Badge>
            )}
            {discount > 0 && (
              <div className="px-3 py-1.5 bg-gradient-to-r from-error to-error/90 text-white rounded-full text-xs font-semibold shadow-md">
                -{discount}% OFF
              </div>
            )}
            {!inStock && (
              <Badge variant="neutral" size="sm" className="rounded-full">
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Wishlist Button - Softer styling */}
          <button
            className="absolute right-3 top-3 p-2.5 bg-card/95 rounded-full shadow-md hover:bg-card transition-all duration-250 opacity-0 group-hover:opacity-100 backdrop-blur-sm border border-border/50"
            aria-label="Add to wishlist"
          >
            <Heart className="w-4 h-4 text-muted-foreground hover:text-rose transition-colors" />
          </button>

          {/* Add to Cart Button - Elegant slide up */}
          {inStock && onAddToCart && (
            <button
              onClick={onAddToCart}
              className="absolute bottom-0 left-0 right-0 translate-y-full md:translate-y-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary py-3.5 text-sm font-medium text-primary-foreground transition-all duration-300 group-hover:translate-y-0 flex items-center justify-center gap-2 max-md:translate-y-0"
              aria-label={`Add ${title} to cart`}
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
          )}

          {/* In Stock Badge - Subtle */}
          {inStock && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-success/90 text-success-foreground rounded-full text-xs font-medium shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-md:hidden backdrop-blur-sm">
              <Check className="w-3 h-3" />
              In Stock
            </div>
          )}
        </div>

        {/* Content - Refined spacing */}
        <div className="flex flex-1 flex-col gap-2.5 p-5">
          {/* Vendor */}
          {vendor && (
            <Link
              href={`/vendors/${vendor.id}`}
              className="text-xs font-medium text-primary/80 transition-colors hover:text-primary uppercase tracking-wider"
            >
              {vendor.name}
            </Link>
          )}

          {/* Title - Serif font for elegance */}
          <Link
            href={`/products/${id}`}
            className="line-clamp-2 font-serif font-medium text-foreground transition-colors hover:text-primary text-lg leading-tight"
          >
            {title}
          </Link>

          {/* Rating */}
          {rating > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <Rating value={rating} maxValue={5} readOnly size="sm" showLabel={false} />
              <span className="text-xs text-muted-foreground">
                ({reviewCount})
              </span>
            </div>
          )}

          {/* Price - Gold accent */}
          <div className="flex items-baseline gap-2.5 pt-3 mt-auto border-t border-border/60">
            <span className="text-xl font-semibold text-foreground">
              ₱{price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-sm text-muted-foreground line-through">
                ₱{originalPrice.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
              </span>
            )}
          </div>

          {/* Stock Status */}
          {!inStock && (
            <p className="text-xs font-medium text-error/90 mt-2">Currently unavailable</p>
          )}
        </div>
      </div>
    );
  }
);
ProductCard.displayName = 'ProductCard';

export { ProductCard };

