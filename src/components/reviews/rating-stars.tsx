'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  value?: number;
  maxValue?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  readOnly?: boolean;
  onRatingChange?: (rating: number) => void;
  showLabel?: boolean;
  className?: string;
}

const RatingStars = React.forwardRef<HTMLDivElement, RatingStarsProps>(
  (
    {
      value = 0,
      maxValue = 5,
      size = 'md',
      interactive = false,
      readOnly = true,
      onRatingChange,
      showLabel = true,
      className,
    },
    ref
  ) => {
    const [hoverRating, setHoverRating] = React.useState<number | null>(null);
    const displayRating = hoverRating !== null ? hoverRating : value;

    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    const handleStarClick = (rating: number) => {
      if (interactive && !readOnly) {
        onRatingChange?.(rating);
      }
    };

    const handleStarHover = (rating: number) => {
      if (interactive && !readOnly) {
        setHoverRating(rating);
      }
    };

    const handleMouseLeave = () => {
      if (interactive && !readOnly) {
        setHoverRating(null);
      }
    };

    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-1', className)}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex gap-0.5">
          {Array.from({ length: maxValue }).map((_, i) => {
            const starValue = i + 1;
            const isFilled = starValue <= displayRating;

            return (
              <button
                key={i}
                onClick={() => handleStarClick(starValue)}
                onMouseEnter={() => handleStarHover(starValue)}
                disabled={readOnly || !interactive}
                className={cn(
                  sizeClasses[size],
                  'transition-colors',
                  interactive && !readOnly && 'cursor-pointer hover:text-yellow-400',
                  readOnly && 'cursor-default'
                )}
              >
                <svg
                  className={cn(
                    'w-full h-full',
                    isFilled ? 'fill-yellow-400 text-yellow-400' : 'fill-neutral-200 text-neutral-200'
                  )}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </button>
            );
          })}
        </div>

        {showLabel && (
          <span className="ml-2 text-sm font-medium text-neutral-700">
            {displayRating.toFixed(1)} / {maxValue}
          </span>
        )}
      </div>
    );
  }
);
RatingStars.displayName = 'RatingStars';

export { RatingStars };

