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
      <label className="block text-sm font-semibold text-foreground">Category</label>

      <div className="space-y-1">
        {/* All Categories Option */}
        <label className="flex items-center gap-3 cursor-pointer hover:bg-muted p-2 rounded">
          <input
            type="radio"
            name="category"
            value=""
            checked={selectedCategoryId === ''}
            onChange={() => onCategoryChange('')}
            className="w-4 h-4 accent-primary"
          />
          <span className="text-sm text-foreground">All Categories</span>
        </label>

        {/* Category List */}
        {categories.map((category) => (
          <div key={category.id}>
            <label className="flex items-center gap-3 cursor-pointer hover:bg-muted p-2 rounded">
              <input
                type="radio"
                name="category"
                value={category.id}
                checked={selectedCategoryId === category.id}
                onChange={() => onCategoryChange(category.id)}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm flex-1 text-foreground">{category.name}</span>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                {category.count}
              </span>
            </label>
          </div>
        ))}
      </div>

      {/* Selected Category Info */}
      {selectedCategoryId && (
        <div className="bg-success/10 p-2 rounded text-xs text-success">
          {categories.find(c => c.id === selectedCategoryId)?.name}
        </div>
      )}
    </div>
  );
};

