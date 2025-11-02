'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ReviewCard } from './review-card';
import { Pagination } from '@/components/ui/pagination';

interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    id: string;
  };
  createdAt: string;
  helpfulCount?: number;
  unhelpfulCount?: number;
  isVerifiedPurchase?: boolean;
}

interface ReviewListProps {
  reviews: Review[];
  isLoading?: boolean;
  sortBy?: 'recent' | 'helpful' | 'rating-high' | 'rating-low';
  onSortChange?: (sort: string) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onHelpful?: (reviewId: string) => void;
  onUnhelpful?: (reviewId: string) => void;
  onReport?: (reviewId: string) => void;
  className?: string;
}

const ReviewList = React.forwardRef<HTMLDivElement, ReviewListProps>(
  (
    {
      reviews,
      isLoading = false,
      sortBy = 'recent',
      onSortChange,
      currentPage = 1,
      totalPages = 1,
      onPageChange,
      onHelpful,
      onUnhelpful,
      onReport,
      className,
    },
    ref
  ) => {
    return (
      <div ref={ref} className={cn('space-y-4', className)}>
        {/* Header with Sort */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900">
            Reviews ({reviews.length})
          </h3>
          <select
            value={sortBy}
            onChange={(e) => onSortChange?.(e.target.value)}
            className="rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary-600 focus:outline-none"
          >
            <option value="recent">Most Recent</option>
            <option value="helpful">Most Helpful</option>
            <option value="rating-high">Highest Rating</option>
            <option value="rating-low">Lowest Rating</option>
          </select>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-primary-600" />
          </div>
        ) : reviews.length === 0 ? (
          /* Empty State */
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 py-8 text-center">
            <svg
              className="mx-auto mb-3 h-12 w-12 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
            <p className="text-neutral-600">No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          <>
            {/* Reviews */}
            <div className="space-y-3">
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  {...review}
                  onHelpful={onHelpful}
                  onUnhelpful={onUnhelpful}
                  onReport={onReport}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={onPageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    );
  }
);
ReviewList.displayName = 'ReviewList';

export { ReviewList };

