'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';

interface PriceRangeFilterProps {
  minPrice: number;
  maxPrice: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
  availableMin: number;
  availableMax: number;
}

export const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  minPrice,
  maxPrice,
  onMinChange,
  onMaxChange,
  availableMin,
  availableMax,
}) => {
  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);

  useEffect(() => {
    setLocalMin(minPrice);
  }, [minPrice]);

  useEffect(() => {
    setLocalMax(maxPrice);
  }, [maxPrice]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setLocalMin(value);
    if (value <= localMax) {
      onMinChange(value);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setLocalMax(value);
    if (value >= localMin) {
      onMaxChange(value);
    }
  };

  const handleMinSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (value <= localMax) {
      setLocalMin(value);
      onMinChange(value);
    }
  };

  const handleMaxSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (value >= localMin) {
      setLocalMax(value);
      onMaxChange(value);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold mb-2 text-foreground">Price Range</label>
        <div className="flex gap-2 mb-4">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">Min</label>
            <Input
              type="number"
              value={localMin}
              onChange={handleMinChange}
              min={availableMin}
              max={availableMax}
              placeholder="Min price"
              className="w-full"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">Max</label>
            <Input
              type="number"
              value={localMax}
              onChange={handleMaxChange}
              min={availableMin}
              max={availableMax}
              placeholder="Max price"
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Range Sliders */}
      <div className="space-y-2">
        <div>
          <label className="text-xs text-muted-foreground">Min Price</label>
          <input
            type="range"
            min={availableMin}
            max={availableMax}
            value={localMin}
            onChange={handleMinSlider}
            className="w-full accent-primary"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Max Price</label>
          <input
            type="range"
            min={availableMin}
            max={availableMax}
            value={localMax}
            onChange={handleMaxSlider}
            className="w-full accent-primary"
          />
        </div>
      </div>

      {/* Price Display */}
      <div className="bg-success/10 p-3 rounded text-sm">
        <div className="font-semibold text-success">
          {formatPrice(localMin)} - {formatPrice(localMax)}
        </div>
      </div>
    </div>
  );
};

