'use client';

import React from 'react';

interface RatingFilterProps {
  ratings: Array<{ stars: number; count: number }>;
  selectedRating: number;
  onRatingChange: (rating: number) => void;
}

export const RatingFilter: React.FC<RatingFilterProps> = ({
  ratings,
  selectedRating,
  onRatingChange,
}) => {
  const renderStars = (count: number) => {
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${
              i < count ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold">Rating</label>
      
      <div className="space-y-2">
        {/* All Ratings Option */}
        <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded">
          <input
            type="radio"
            name="rating"
            value={0}
            checked={selectedRating === 0}
            onChange={() => onRatingChange(0)}
            className="w-4 h-4"
          />
          <span className="text-sm">All Ratings</span>
        </label>

        {/* Star Ratings */}
        {ratings.map((rating) => (
          <label
            key={rating.stars}
            className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded"
          >
            <input
              type="radio"
              name="rating"
              value={rating.stars}
              checked={selectedRating === rating.stars}
              onChange={() => onRatingChange(rating.stars)}
              className="w-4 h-4"
            />
            <div className="flex items-center gap-2 flex-1">
              {renderStars(rating.stars)}
              <span className="text-xs text-gray-600">
                {rating.stars} star{rating.stars !== 1 ? 's' : ''} ({rating.count})
              </span>
            </div>
          </label>
        ))}
      </div>

      {/* Rating Info */}
      {selectedRating > 0 && (
        <div className="bg-blue-50 p-2 rounded text-xs text-blue-900">
          Showing products with {selectedRating}+ star rating
        </div>
      )}
    </div>
  );
};

