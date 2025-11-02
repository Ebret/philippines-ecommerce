import React, { useState } from 'react';
import { Filter, X, Plus } from 'lucide-react';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterField {
  key: string;
  label: string;
  type: 'text' | 'select' | 'number' | 'date' | 'range';
  options?: FilterOption[];
  placeholder?: string;
}

export interface FilterCondition {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'gt' | 'lt' | 'gte' | 'lte' | 'between';
  value: string | number | [number, number];
}

export interface AdvancedFilteringProps {
  fields: FilterField[];
  onApplyFilters: (filters: FilterCondition[]) => void;
  onClearFilters?: () => void;
  disabled?: boolean;
  className?: string;
}

export const AdvancedFiltering: React.FC<AdvancedFilteringProps> = ({
  fields,
  onApplyFilters,
  onClearFilters,
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [nextId, setNextId] = useState(1);

  const addFilter = () => {
    const newFilter: FilterCondition = {
      id: String(nextId),
      field: fields[0]?.key || '',
      operator: 'equals',
      value: '',
    };
    setFilters([...filters, newFilter]);
    setNextId(nextId + 1);
  };

  const removeFilter = (id: string) => {
    setFilters(filters.filter((f) => f.id !== id));
  };

  const updateFilter = (id: string, updates: Partial<FilterCondition>) => {
    setFilters(
      filters.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  const handleApply = () => {
    onApplyFilters(filters);
    setIsOpen(false);
  };

  const handleClear = () => {
    setFilters([]);
    onClearFilters?.();
  };

  const getFieldType = (fieldKey: string): FilterField | undefined => {
    return fields.find((f) => f.key === fieldKey);
  };

  const getOperatorLabel = (operator: string): string => {
    const labels: Record<string, string> = {
      equals: 'Equals',
      contains: 'Contains',
      gt: 'Greater than',
      lt: 'Less than',
      gte: 'Greater or equal',
      lte: 'Less or equal',
      between: 'Between',
    };
    return labels[operator] || operator;
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors relative"
        aria-label="Advanced filters"
      >
        <Filter size={18} />
        <span>Filters</span>
        {filters.length > 0 && (
          <span className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {filters.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 p-4">
          <h3 className="text-lg font-semibold mb-4">Advanced Filters</h3>

          {/* Filter Conditions */}
          <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
            {filters.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No filters added yet
              </p>
            ) : (
              filters.map((filter) => {
                const field = getFieldType(filter.field);
                return (
                  <div
                    key={filter.id}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex gap-2 mb-2">
                      {/* Field Selection */}
                      <select
                        value={filter.field}
                        onChange={(e) =>
                          updateFilter(filter.id, { field: e.target.value })
                        }
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {fields.map((f) => (
                          <option key={f.key} value={f.key}>
                            {f.label}
                          </option>
                        ))}
                      </select>

                      {/* Operator Selection */}
                      <select
                        value={filter.operator}
                        onChange={(e) =>
                          updateFilter(filter.id, {
                            operator: e.target.value as FilterCondition['operator'],
                          })
                        }
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="equals">Equals</option>
                        <option value="contains">Contains</option>
                        <option value="gt">Greater than</option>
                        <option value="lt">Less than</option>
                        <option value="gte">≥</option>
                        <option value="lte">≤</option>
                        <option value="between">Between</option>
                      </select>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFilter(filter.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        aria-label="Remove filter"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    {/* Value Input */}
                    {field && (
                      <div>
                        {field.type === 'select' ? (
                          <select
                            value={String(filter.value)}
                            onChange={(e) =>
                              updateFilter(filter.id, { value: e.target.value })
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select...</option>
                            {field.options?.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field.type}
                            value={String(filter.value)}
                            onChange={(e) =>
                              updateFilter(filter.id, { value: e.target.value })
                            }
                            placeholder={field.placeholder}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Add Filter Button */}
          <button
            onClick={addFilter}
            className="w-full mb-4 py-2 px-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            <span>Add Filter</span>
          </button>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleApply}
              className="flex-1 py-2 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Apply Filters
            </button>
            <button
              onClick={handleClear}
              className="flex-1 py-2 px-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Clear
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="py-2 px-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFiltering;

