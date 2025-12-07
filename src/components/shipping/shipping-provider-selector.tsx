'use client';

import React, { useState } from 'react';
import {
  Truck,
  Package,
  Clock,
  MapPin,
  Check,
  Info,
  Loader2,
} from 'lucide-react';

// Shipping provider type
export type ShippingProviderType = 'LBC' | 'TWO_GO' | 'JRS' | 'JT_EXPRESS' | 'GRAB' | 'LALAMOVE' | 'MOVEIT' | 'PICKUP';

// Shipping rate interface
export interface ShippingRate {
  provider: ShippingProviderType;
  name: string;
  description: string;
  baseRate: number;
  estimatedDays: number;
  estimatedDelivery: string;
  isExpress: boolean;
  isFreeShipping: boolean;
}

// Provider configuration
const PROVIDER_CONFIG: Record<ShippingProviderType, { name: string; logo: string; color: string }> = {
  LBC: { name: 'LBC Express', logo: '📦', color: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' },
  TWO_GO: { name: '2GO Express', logo: '🚢', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
  JRS: { name: 'JRS Express', logo: '📮', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' },
  JT_EXPRESS: { name: 'J&T Express', logo: '🚚', color: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' },
  GRAB: { name: 'Grab Express', logo: '🏍️', color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' },
  LALAMOVE: { name: 'Lalamove', logo: '🛵', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' },
  MOVEIT: { name: 'MoveIt', logo: '📬', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
  PICKUP: { name: 'Store Pickup', logo: '🏪', color: 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400' },
};

export interface ShippingProviderSelectorProps {
  rates: ShippingRate[];
  selectedProvider?: ShippingProviderType;
  onSelect: (provider: ShippingProviderType) => void;
  isLoading?: boolean;
  className?: string;
}

/**
 * ShippingProviderSelector - Select shipping provider with rates
 */
export function ShippingProviderSelector({
  rates,
  selectedProvider,
  onSelect,
  isLoading = false,
  className = '',
}: ShippingProviderSelectorProps) {
  return (
    <div className={`rounded-lg border border-border bg-card ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Truck className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Shipping Method</h3>
          <p className="text-sm text-muted-foreground">Choose your preferred delivery option</p>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="p-8 text-center">
          <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-primary" />
          <p className="text-muted-foreground">Calculating shipping rates...</p>
        </div>
      ) : rates.length === 0 ? (
        <div className="p-8 text-center">
          <Truck className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">No shipping options available for this address</p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {rates.map((rate) => {
            const config = PROVIDER_CONFIG[rate.provider];
            const isSelected = selectedProvider === rate.provider;

            return (
              <div
                key={rate.provider}
                onClick={() => onSelect(rate.provider)}
                className={`p-4 flex items-center gap-4 cursor-pointer transition-colors hover:bg-muted/50 ${
                  isSelected ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                }`}
              >
                {/* Provider Icon */}
                <div className={`w-12 h-12 rounded-lg ${config.color} flex items-center justify-center text-2xl`}>
                  {config.logo}
                </div>

                {/* Provider Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{config.name}</span>
                    {rate.isExpress && (
                      <span className="px-1.5 py-0.5 rounded text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 font-medium">
                        Express
                      </span>
                    )}
                    {rate.isFreeShipping && (
                      <span className="px-1.5 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-medium">
                        Free
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{rate.description}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {rate.estimatedDays === 0 ? 'Same day' : rate.estimatedDays === 1 ? 'Next day' : `${rate.estimatedDays} days`}
                    </span>
                    <span>Est. {rate.estimatedDelivery}</span>
                  </div>
                </div>

                {/* Price & Selection */}
                <div className="text-right">
                  <p className={`font-semibold ${rate.isFreeShipping ? 'text-green-600 dark:text-green-400' : 'text-foreground'}`}>
                    {rate.isFreeShipping ? 'FREE' : `₱${rate.baseRate.toLocaleString()}`}
                  </p>
                  {isSelected && (
                    <div className="mt-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center ml-auto">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info */}
      <div className="p-3 bg-muted/30 border-t border-border">
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <Info className="w-4 h-4 mt-0.5" />
          <p>Free shipping on orders over ₱1,000 (standard delivery only). Express delivery available for NCR.</p>
        </div>
      </div>
    </div>
  );
}

export { PROVIDER_CONFIG };
