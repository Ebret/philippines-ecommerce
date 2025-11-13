'use client';

import React, { useState } from 'react';

interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId: string;
  onCategoryChange: (categoryId: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategoryId,
  onCategoryChange,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleExpanded = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold">Category</label>

      <div className="space-y-1">
        {/* All Categories Option */}
        <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded">
          <input
            type="radio"
            name="category"
            value=""
            checked={selectedCategoryId === ''}
            onChange={() => onCategoryChange('')}
            className="w-4 h-4"
          />
          <span className="text-sm">All Categories</span>
        </label>

        {/* Category List */}
        {categories.map((category) => (
          <div key={category.id}>
            <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded">
              <input
                type="radio"
                name="category"
                value={category.id}
                checked={selectedCategoryId === category.id}
                onChange={() => onCategoryChange(category.id)}
                className="w-4 h-4"
              />
              <span className="text-sm flex-1">{category.name}</span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {category.count}
              </span>
            </label>
          </div>
        ))}
      </div>

      {/* Selected Category Info */}
      {selectedCategoryId && (
        <div className="bg-green-50 p-2 rounded text-xs text-green-900">
          {categories.find(c => c.id === selectedCategoryId)?.name}
        </div>
      )}
    </div>
  );
};

