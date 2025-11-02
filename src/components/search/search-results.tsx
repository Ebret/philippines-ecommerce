'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ProductGrid } from '@/components/products/product-grid';
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

interface SearchResultsProps {
  products: Product[];
  isLoading?: boolean;
  totalResults?: number;
  currentPage?: number;
  totalPages?: number;
  sortBy?: 'relevance' | 'price-low' | 'price-high' | 'newest' | 'rating';
  onSortChange?: (sort: string) => void;
  onPageChange?: (page: number) => void;
  onAddToCart?: (productId: string) => void;
  searchQuery?: string;
  className?: string;
}

const SearchResults = React.forwardRef<HTMLDivElement, SearchResultsProps>(
  (
    {
      products,
      isLoading = false,
      totalResults = 0,
      currentPage = 1,
      totalPages = 1,
      sortBy = 'relevance',
      onSortChange,
      onPageChange,
      onAddToCart,
      searchQuery,
      className,
    },
    ref
  ) => {
    return (
      <div ref={ref} className={cn('space-y-6', className)}>
        {/* Results Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Products'}
            </h2>
            <p className="mt-1 text-sm text-neutral-600">
              {isLoading ? 'Loading...' : `${totalResults} products found`}
            </p>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm font-medium text-neutral-700">
              Sort by:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => onSortChange?.(e.target.value)}
              className="rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary-600 focus:outline-none"
            >
              <option value="relevance">Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loading size="lg" text="Searching products..." />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 py-12 text-center">
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="mb-2 text-lg font-medium text-neutral-900">No products found</h3>
            <p className="text-neutral-600">
              {searchQuery
                ? `No products match "${searchQuery}". Try different keywords.`
                : 'Try adjusting your filters or search terms.'}
            </p>
          </div>
        ) : (
          <>
            {/* Product Grid */}
            <ProductGrid
              products={products}
              columns={3}
              gap="md"
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              onAddToCart={onAddToCart}
            />

            {/* Results Info */}
            <div className="text-center text-sm text-neutral-600">
              Showing {(currentPage - 1) * 12 + 1} to{' '}
              {Math.min(currentPage * 12, totalResults)} of {totalResults} results
            </div>
          </>
        )}
      </div>
    );
  }
);
SearchResults.displayName = 'SearchResults';

export { SearchResults };

