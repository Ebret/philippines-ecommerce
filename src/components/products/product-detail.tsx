'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Rating } from '@/components/ui/rating';
import { Tabs } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ProductImageGallery } from './product-image-gallery';

interface ProductDetailProps {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: Array<{
    id: string;
    url: string;
    alt?: string;
  }>;
  rating?: number;
  reviewCount?: number;
  vendor?: {
    name: string;
    id: string;
  };
  inStock?: boolean;
  sku?: string;
  category?: string;
  specifications?: Array<{
    label: string;
    value: string;
  }>;
  reviews?: Array<{
    id: string;
    author: string;
    rating: number;
    comment: string;
    date: string;
  }>;
  onAddToCart?: () => void;
  onBuyNow?: () => void;
  className?: string;
}

const ProductDetail = React.forwardRef<HTMLDivElement, ProductDetailProps>(
  (
    {
      id,
      title,
      description,
      price,
      originalPrice,
      images,
      rating = 0,
      reviewCount = 0,
      vendor,
      inStock = true,
      sku,
      category,
      specifications = [],
      reviews = [],
      onAddToCart,
      onBuyNow,
      className,
    },
    ref
  ) => {
    const [quantity, setQuantity] = React.useState(1);

    const discount = originalPrice
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

    const tabItems = [
      {
        id: 'description',
        label: 'Description',
        content: (
          <div className="prose prose-sm max-w-none">
            <p>{description}</p>
          </div>
        ),
      },
      ...(specifications.length > 0
        ? [
            {
              id: 'specifications',
              label: 'Specifications',
              content: (
                <div className="space-y-3">
                  {specifications.map((spec, index) => (
                    <div key={index} className="flex border-b border-neutral-200 py-2">
                      <span className="w-1/3 font-medium text-neutral-700">{spec.label}</span>
                      <span className="w-2/3 text-neutral-600">{spec.value}</span>
                    </div>
                  ))}
                </div>
              ),
            },
          ]
        : []),
      ...(reviews.length > 0
        ? [
            {
              id: 'reviews',
              label: `Reviews (${reviews.length})`,
              content: (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-neutral-200 pb-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium text-neutral-900">{review.author}</span>
                        <span className="text-sm text-neutral-500">{review.date}</span>
                      </div>
                      <Rating value={review.rating} maxValue={5} readOnly size="sm" showLabel={false} />
                      <p className="mt-2 text-neutral-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ),
            },
          ]
        : []),
    ];

    return (
      <div ref={ref} className={cn('grid gap-8 lg:grid-cols-2', className)}>
        {/* Image Gallery */}
        <div>
          <ProductImageGallery images={images} title={title} />
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div>
            {category && (
              <Link
                href={`/products?category=${category}`}
                className="text-sm text-neutral-500 transition-colors hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400"
              >
                {category}
              </Link>
            )}
            <h1 className="mt-2 text-3xl font-bold text-neutral-900 dark:text-white">{title}</h1>

            {/* Rating */}
            {rating > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <Rating value={rating} maxValue={5} readOnly size="md" showLabel={false} />
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  {rating.toFixed(1)} ({reviewCount} reviews)
                </span>
              </div>
            )}
          </div>

          {/* Vendor */}
          {vendor && (
            <Link
              href={`/vendors/${vendor.id}`}
              className="inline-flex w-fit items-center gap-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 px-3 py-2 text-sm transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700"
            >
              <span className="text-neutral-600 dark:text-neutral-400">Sold by:</span>
              <span className="font-medium text-primary-600 dark:text-primary-400">{vendor.name}</span>
            </Link>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-primary-600 dark:text-primary-400">
              ₱{price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </span>
            {originalPrice && originalPrice > price && (
              <>
                <span className="text-lg text-neutral-500 dark:text-neutral-400 line-through">
                  ₱{originalPrice.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </span>
                <Badge variant="error">-{discount}%</Badge>
              </>
            )}
          </div>

          {/* Stock Status */}
          <div>
            {inStock ? (
              <Badge variant="success">In Stock</Badge>
            ) : (
              <Badge variant="error">Out of Stock</Badge>
            )}
          </div>

          {/* SKU */}
          {sku && (
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              <span className="font-medium">SKU:</span> {sku}
            </div>
          )}

          {/* Quantity & Actions */}
          {inStock && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-neutral-900 dark:text-white">Quantity:</span>
                <div className="flex items-center gap-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-neutral-900 dark:text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={() => onAddToCart?.()}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="accent"
                  size="lg"
                  className="flex-1"
                  onClick={() => onBuyNow?.()}
                >
                  Buy Now
                </Button>
              </div>
            </div>
          )}

          {/* Tabs */}
          {tabItems.length > 0 && (
            <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
              <Tabs items={tabItems} defaultTab={tabItems[0].id} />
            </div>
          )}
        </div>
      </div>
    );
  }
);
ProductDetail.displayName = 'ProductDetail';

export { ProductDetail };

