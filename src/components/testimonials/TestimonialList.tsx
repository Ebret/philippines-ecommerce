/**
 * TestimonialList Component
 * List view with pagination and filtering
 */

'use client';

import { useState, useEffect } from 'react';
import { TestimonialCard } from './TestimonialCard';
import { Button } from '@/components/ui/button';

interface Testimonial {
  id: string;
  title: string;
  content: string;
  rating: number;
  authorName: string;
  authorRole?: string;
  companyName?: string;
  thumbnailUrl?: string;
  mediaType?: 'video' | 'photo';
  createdAt: Date | string;
  featured?: boolean;
}

interface TestimonialListProps {
  testimonials: Testimonial[];
  isLoading?: boolean;
  onLoadMore?: () => Promise<void>;
  hasMore?: boolean;
  filterByRating?: number;
  filterByMediaType?: 'video' | 'photo' | 'all';
  sortBy?: 'newest' | 'oldest' | 'rating';
}

export function TestimonialList({
  testimonials,
  isLoading = false,
  onLoadMore,
  hasMore = false,
  filterByRating,
  filterByMediaType = 'all',
  sortBy = 'newest',
}: TestimonialListProps) {
  const [displayedTestimonials, setDisplayedTestimonials] = useState<Testimonial[]>(testimonials);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    let filtered = [...testimonials];

    // Filter by rating
    if (filterByRating) {
      filtered = filtered.filter((t) => t.rating >= filterByRating);
    }

    // Filter by media type
    if (filterByMediaType !== 'all') {
      filtered = filtered.filter((t) => t.mediaType === filterByMediaType);
    }

    // Sort
    switch (sortBy) {
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    setDisplayedTestimonials(filtered);
  }, [testimonials, filterByRating, filterByMediaType, sortBy]);

  const handleLoadMore = async () => {
    if (onLoadMore && !isLoadingMore) {
      setIsLoadingMore(true);
      try {
        await onLoadMore();
      } finally {
        setIsLoadingMore(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-96 animate-pulse" />
        ))}
      </div>
    );
  }

  if (displayedTestimonials.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No testimonials found</p>
        <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedTestimonials.map((testimonial) => (
          <TestimonialCard
            key={testimonial.id}
            {...testimonial}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center">
          <Button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoadingMore ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}

      {/* Summary */}
      <div className="text-center text-sm text-gray-600">
        Showing {displayedTestimonials.length} testimonial{displayedTestimonials.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}

