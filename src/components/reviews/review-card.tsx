'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { RatingStars } from './rating-stars';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface ReviewCardProps {
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
  onHelpful?: (reviewId: string) => void;
  onUnhelpful?: (reviewId: string) => void;
  onReport?: (reviewId: string) => void;
  className?: string;
}

const ReviewCard = React.forwardRef<HTMLDivElement, ReviewCardProps>(
  (
    {
      id,
      rating,
      title,
      content,
      author,
      createdAt,
      helpfulCount = 0,
      unhelpfulCount = 0,
      isVerifiedPurchase = false,
      onHelpful,
      onUnhelpful,
      onReport,
      className,
    },
    ref
  ) => {
    const [hasVoted, setHasVoted] = React.useState<'helpful' | 'unhelpful' | null>(null);

    const handleHelpful = () => {
      if (hasVoted !== 'helpful') {
        onHelpful?.(id);
        setHasVoted('helpful');
      }
    };

    const handleUnhelpful = () => {
      if (hasVoted !== 'unhelpful') {
        onUnhelpful?.(id);
        setHasVoted('unhelpful');
      }
    };

    const formatDate = (date: string) => {
      return new Date(date).toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border border-neutral-200 bg-white p-4 transition-shadow hover:shadow-md',
          className
        )}
      >
        {/* Header */}
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar
              src={author.avatar}
              initials={author.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
              size="md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-neutral-900">{author.name}</h3>
                {isVerifiedPurchase && (
                  <Badge variant="success" className="text-xs">
                    Verified Purchase
                  </Badge>
                )}
              </div>
              <p className="text-xs text-neutral-500">{formatDate(createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Rating and Title */}
        <div className="mb-3">
          <RatingStars value={rating} readOnly showLabel={false} size="sm" />
          <h4 className="mt-2 font-semibold text-neutral-900">{title}</h4>
        </div>

        {/* Content */}
        <p className="mb-4 text-sm text-neutral-700 leading-relaxed">{content}</p>

        {/* Footer - Helpful/Unhelpful */}
        <div className="flex items-center gap-4 border-t border-neutral-100 pt-3">
          <span className="text-xs text-neutral-500">Was this helpful?</span>
          <button
            onClick={handleHelpful}
            className={cn(
              'flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors',
              hasVoted === 'helpful'
                ? 'bg-green-100 text-green-700'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            )}
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14 10h-4v7h4v-7zm4-7H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 13H6V5h12v11z" />
            </svg>
            <span>{helpfulCount}</span>
          </button>
          <button
            onClick={handleUnhelpful}
            className={cn(
              'flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors',
              hasVoted === 'unhelpful'
                ? 'bg-red-100 text-red-700'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            )}
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 14H6v-4h4v4zm4-7H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm0 13H6V9h12v11z" />
            </svg>
            <span>{unhelpfulCount}</span>
          </button>
          {onReport && (
            <button
              onClick={() => onReport(id)}
              className="ml-auto text-xs text-neutral-500 hover:text-neutral-700"
            >
              Report
            </button>
          )}
        </div>
      </div>
    );
  }
);
ReviewCard.displayName = 'ReviewCard';

export { ReviewCard };

