'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TestimonialList } from '@/components/testimonials/TestimonialList';
import { FilterBar, FilterOptions, SortOption } from '@/components/testimonials/FilterBar';

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
  createdAt: string;
  featured?: boolean;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    minRating: undefined,
    mediaType: 'all',
    dateRange: 'all',
    searchQuery: '',
  });
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Fetch testimonials
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams({
          page: pagination.page.toString(),
          limit: pagination.limit.toString(),
          sortBy: sortBy === 'newest' ? 'createdAt' : sortBy === 'rating' ? 'rating' : 'helpfulCount',
          sortOrder: 'desc',
        });

        if (filters.minRating) {
          params.append('minRating', filters.minRating.toString());
        }

        const response = await fetch(`/api/testimonials?${params}`);
        if (!response.ok) {
          throw new Error('Failed to fetch testimonials');
        }

        const data = await response.json();
        setTestimonials(data.data || []);
        setPagination(data.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          pages: 0,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, [pagination.page, filters, sortBy]);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Testimonials</h1>
            <p className="text-gray-600 mt-2">Read what our customers say about our products</p>
          </div>
          <Link
            href="/testimonials/create"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            + Share Your Story
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <FilterBar onFilterChange={handleFilterChange} onSortChange={handleSortChange} />
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            <p className="text-gray-600 mt-4">Loading testimonials...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && testimonials.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No testimonials found</p>
            <Link
              href="/testimonials/create"
              className="inline-block mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Be the first to share
            </Link>
          </div>
        )}

        {/* Testimonials List */}
        {!isLoading && testimonials.length > 0 && (
          <>
            <TestimonialList testimonials={testimonials} />

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      page === pagination.page
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:border-blue-600'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

