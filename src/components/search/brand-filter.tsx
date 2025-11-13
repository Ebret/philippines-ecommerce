'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';

interface Brand {
  name: string;
}

interface BrandFilterProps {
  brands: Brand[];
  selectedBrand: string;
  onBrandChange: (brand: string) => void;
}

export const BrandFilter: React.FC<BrandFilterProps> = ({
  brands,
  selectedBrand,
  onBrandChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold">Brand</label>

      {/* Search Input */}
      <Input
        type="text"
        placeholder="Search brands..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full"
      />

      <div className="space-y-1 max-h-48 overflow-y-auto">
        {/* All Brands Option */}
        <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded">
          <input
            type="radio"
            name="brand"
            value=""
            checked={selectedBrand === ''}
            onChange={() => onBrandChange('')}
            className="w-4 h-4"
          />
          <span className="text-sm">All Brands</span>
        </label>

        {/* Brand List */}
        {filteredBrands.length > 0 ? (
          filteredBrands.map((brand) => (
            <label
              key={brand.name}
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded"
            >
              <input
                type="radio"
                name="brand"
                value={brand.name}
                checked={selectedBrand === brand.name}
                onChange={() => onBrandChange(brand.name)}
                className="w-4 h-4"
              />
              <span className="text-sm">{brand.name}</span>
            </label>
          ))
        ) : (
          <div className="text-xs text-gray-500 p-2">No brands found</div>
        )}
      </div>

      {/* Selected Brand Info */}
      {selectedBrand && (
        <div className="bg-green-50 p-2 rounded text-xs text-green-900">
          {selectedBrand}
        </div>
      )}
    </div>
  );
};

