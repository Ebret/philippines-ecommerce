'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ProductCard } from './product-card';
import { Pagination } from '@/components/ui/pagination';
import { Loading } from '@/components/ui/spinner';

interface Product {
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
}

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  columns?: 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  onAddToCart?: (productId: string) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  emptyMessage?: string;
  className?: string;
}

const columnClasses = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
};

const gapClasses = {
  sm: 'gap-3 sm:gap-4',
  md: 'gap-4 sm:gap-6',
  lg: 'gap-6 sm:gap-8',
};

const ProductGrid = React.forwardRef<HTMLDivElement, ProductGridProps>(
  (
    {
      products,
      isLoading = false,
      columns = 3,
      gap = 'md',
      onAddToCart,
      currentPage = 1,
      totalPages = 1,
      onPageChange,
      emptyMessage = 'No products found',
      className,
    },
    ref
  ) => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-12">
          <Loading size="lg" text="Loading products..." />
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <svg
            className="mb-4 h-12 w-12 text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p className="text-neutral-600">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div ref={ref} className={className}>
        {/* Product Grid */}
        <div
          className={cn(
            'grid',
            columnClasses[columns],
            gapClasses[gap]
          )}
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              onAddToCart={() => onAddToCart?.(product.id)}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && onPageChange && (
          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>
    );
  }
);
ProductGrid.displayName = 'ProductGrid';

export { ProductGrid };

