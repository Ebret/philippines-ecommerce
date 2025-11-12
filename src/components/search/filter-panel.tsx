'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterGroup {
  id: string;
  title: string;
  type: 'checkbox' | 'range' | 'radio';
  options?: FilterOption[];
  min?: number;
  max?: number;
  step?: number;
}

interface FilterPanelProps {
  filters: FilterGroup[];
  selectedFilters?: Record<string, string[] | { min: number; max: number }>;
  onFilterChange?: (filterId: string, value: string[] | { min: number; max: number }) => void;
  onClearFilters?: () => void;
  className?: string;
}

const FilterPanel = React.forwardRef<HTMLDivElement, FilterPanelProps>(
  (
    {
      filters,
      selectedFilters = {},
      onFilterChange,
      onClearFilters,
      className,
    },
    ref
  ) => {
    const [expandedFilters, setExpandedFilters] = React.useState<Set<string>>(
      new Set(filters.map((f) => f.id))
    );

    const toggleFilter = (filterId: string) => {
      const newExpanded = new Set(expandedFilters);
      if (newExpanded.has(filterId)) {
        newExpanded.delete(filterId);
      } else {
        newExpanded.add(filterId);
      }
      setExpandedFilters(newExpanded);
    };

    const handleCheckboxChange = (filterId: string, optionId: string) => {
      const current = (selectedFilters[filterId] as string[]) || [];
      const updated = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];
      onFilterChange?.(filterId, updated);
    };

    const handleRangeChange = (filterId: string, min: number, max: number) => {
      onFilterChange?.(filterId, { min, max });
    };

    const hasActiveFilters = Object.values(selectedFilters).some(
      (v) => (Array.isArray(v) && v.length > 0) || (typeof v === 'object' && v)
    );

    return (
      <div ref={ref} className={cn('space-y-4', className)}>
        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
          >
            Clear All Filters
          </button>
        )}

        {/* Filter Groups */}
        {filters.map((filter) => (
          <Card key={filter.id}>
            <CardHeader
              className="cursor-pointer p-4"
              onClick={() => toggleFilter(filter.id)}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{filter.title}</CardTitle>
                <svg
                  className={cn(
                    'h-4 w-4 transition-transform',
                    expandedFilters.has(filter.id) && 'rotate-180'
                  )}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>
            </CardHeader>

            {expandedFilters.has(filter.id) && (
              <CardContent className="space-y-3 p-4 pt-0">
                {filter.type === 'checkbox' && filter.options && (
                  <div className="space-y-2">
                    {filter.options.map((option) => (
                      <label key={option.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={
                            ((selectedFilters[filter.id] as string[]) || []).includes(
                              option.id
                            )
                          }
                          onChange={() => handleCheckboxChange(filter.id, option.id)}
                          className="rounded border-neutral-300"
                        />
                        <span className="text-sm text-neutral-700">{option.label}</span>
                        {option.count !== undefined && (
                          <span className="ml-auto text-xs text-neutral-500">
                            ({option.count})
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                )}

                {filter.type === 'range' && filter.min !== undefined && filter.max !== undefined && (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min={filter.min}
                        max={filter.max}
                        value={
                          (selectedFilters[filter.id] as { min: number; max: number })?.min ||
                          filter.min
                        }
                        onChange={(e) =>
                          handleRangeChange(
                            filter.id,
                            parseInt(e.target.value),
                            (selectedFilters[filter.id] as { min: number; max: number })?.max ||
                              filter.max ||
                              100
                          )
                        }
                        className="w-full rounded border border-neutral-200 px-2 py-1 text-sm"
                        placeholder="Min"
                      />
                      <input
                        type="number"
                        min={filter.min}
                        max={filter.max}
                        value={
                          (selectedFilters[filter.id] as { min: number; max: number })?.max ||
                          filter.max
                        }
                        onChange={(e) =>
                          handleRangeChange(
                            filter.id,
                            (selectedFilters[filter.id] as { min: number; max: number })?.min ||
                              filter.min ||
                              0,
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full rounded border border-neutral-200 px-2 py-1 text-sm"
                        placeholder="Max"
                      />
                    </div>
                    <input
                      type="range"
                      min={filter.min}
                      max={filter.max}
                      step={filter.step || 1}
                      value={
                        (selectedFilters[filter.id] as { min: number; max: number })?.min ||
                        filter.min
                      }
                      onChange={(e) =>
                        handleRangeChange(
                          filter.id,
                          parseInt(e.target.value),
                          (selectedFilters[filter.id] as { min: number; max: number })?.max ||
                            filter.max ||
                            100
                        )
                      }
                      className="w-full"
                    />
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    );
  }
);
FilterPanel.displayName = 'FilterPanel';

export { FilterPanel };

