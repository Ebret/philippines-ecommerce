/**
 * FilterBar Component
 * Filter testimonials by rating, date, media type
 */

'use client';

import { useState } from 'react';

interface FilterBarProps {
  onFilterChange?: (filters: FilterOptions) => void;
  onSortChange?: (sortBy: SortOption) => void;
}

export interface FilterOptions {
  minRating?: number;
  mediaType?: 'all' | 'video' | 'photo';
  dateRange?: 'all' | 'week' | 'month' | 'year';
  searchQuery?: string;
}

export type SortOption = 'newest' | 'oldest' | 'rating' | 'popular';

export function FilterBar({
  onFilterChange,
  onSortChange,
}: FilterBarProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    minRating: undefined,
    mediaType: 'all',
    dateRange: 'all',
    searchQuery: '',
  });
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange?.(updated);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    onSortChange?.(newSort);
  };

  const handleReset = () => {
    const defaultFilters: FilterOptions = {
      minRating: undefined,
      mediaType: 'all',
      dateRange: 'all',
      searchQuery: '',
    };
    setFilters(defaultFilters);
    setSortBy('newest');
    onFilterChange?.(defaultFilters);
    onSortChange?.('newest');
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search testimonials..."
          value={filters.searchQuery || ''}
          onChange={(e) => handleFilterChange({ searchQuery: e.target.value })}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
        >
          {isExpanded ? '▲ Filters' : '▼ Filters'}
        </button>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="p-4 bg-gray-50 rounded-lg space-y-4 border border-gray-200">
          {/* Rating Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleFilterChange({ minRating: rating })}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    filters.minRating === rating
                      ? 'bg-yellow-400 text-white'
                      : 'bg-white border border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {rating}★
                </button>
              ))}
              <button
                onClick={() => handleFilterChange({ minRating: undefined })}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  filters.minRating === undefined
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-300 hover:border-gray-400'
                }`}
              >
                All
              </button>
            </div>
          </div>

          {/* Media Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Media Type
            </label>
            <div className="flex gap-2">
              {['all', 'video', 'photo'].map((type) => (
                <button
                  key={type}
                  onClick={() => handleFilterChange({ mediaType: type as any })}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    filters.mediaType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {type === 'all' ? 'All' : type === 'video' ? '🎥 Video' : '📷 Photo'}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <select
              value={filters.dateRange || 'all'}
              onChange={(e) => handleFilterChange({ dateRange: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="w-full px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-lg font-medium transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Sort Options */}
      <div className="flex gap-2 flex-wrap">
        <span className="text-sm font-medium text-gray-700 self-center">Sort by:</span>
        {['newest', 'oldest', 'rating', 'popular'].map((option) => (
          <button
            key={option}
            onClick={() => handleSortChange(option as SortOption)}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              sortBy === option
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 hover:border-gray-400'
            }`}
          >
            {option === 'newest' && '📅 Newest'}
            {option === 'oldest' && '📅 Oldest'}
            {option === 'rating' && '⭐ Rating'}
            {option === 'popular' && '🔥 Popular'}
          </button>
        ))}
      </div>
    </div>
  );
}

