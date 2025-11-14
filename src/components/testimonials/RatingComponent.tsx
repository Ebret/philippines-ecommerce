/**
 * RatingComponent
 * Star rating for testimonials
 */

'use client';

import { useState } from 'react';

interface RatingComponentProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  totalRatings?: number;
}

export function RatingComponent({
  rating,
  onRatingChange,
  readOnly = false,
  size = 'md',
  showLabel = true,
  totalRatings,
}: RatingComponentProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  const getRatingLabel = (rate: number) => {
    const labels: Record<number, string> = {
      1: 'Poor',
      2: 'Fair',
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent',
    };
    return labels[rate] || '';
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="space-y-2">
      {/* Stars */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => {
              if (!readOnly) {
                onRatingChange?.(star);
              }
            }}
            onMouseEnter={() => {
              if (!readOnly) {
                setHoverRating(star);
              }
            }}
            onMouseLeave={() => setHoverRating(0)}
            disabled={readOnly}
            className={`${sizeClasses[size]} transition-all ${
              star <= displayRating
                ? 'text-yellow-400 drop-shadow-md'
                : 'text-gray-300'
            } ${!readOnly ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
          >
            ★
          </button>
        ))}
      </div>

      {/* Label and Count */}
      <div className="flex items-center gap-2">
        {showLabel && (
          <span className="text-sm font-medium text-gray-700">
            {getRatingLabel(displayRating)}
          </span>
        )}
        <span className="text-sm text-gray-600">
          {displayRating}/5
        </span>
        {totalRatings !== undefined && (
          <span className="text-xs text-gray-500">
            ({totalRatings} rating{totalRatings !== 1 ? 's' : ''})
          </span>
        )}
      </div>

      {/* Rating Distribution (optional) */}
      {totalRatings && totalRatings > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-medium text-gray-700">Rating Distribution</p>
          {[5, 4, 3, 2, 1].map((rate) => (
            <div key={rate} className="flex items-center gap-2">
              <span className="text-xs text-gray-600 w-8">{rate}★</span>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 transition-all"
                  style={{ width: `${(Math.random() * 100).toFixed(0)}%` }}
                />
              </div>
              <span className="text-xs text-gray-600 w-12 text-right">
                {Math.floor(Math.random() * totalRatings)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

