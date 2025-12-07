'use client';

import React, { useState, useEffect } from 'react';
import {
  Calculator,
  MapPin,
  Package,
  Scale,
  Ruler,
  Truck,
  Info,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { ShippingProviderType, PROVIDER_CONFIG } from './shipping-provider-selector';
import { PHILIPPINES_REGIONS, REGION_LABELS } from './shipping-address-manager';

// Package dimensions interface
export interface PackageDimensions {
  length: number;
  width: number;
  height: number;
  weight: number;
}

// Shipping cost result interface
export interface ShippingCostResult {
  provider: ShippingProviderType;
  baseCost: number;
  weightSurcharge: number;
  dimensionalSurcharge: number;
  remoteSurcharge: number;
  totalCost: number;
  estimatedDays: number;
  isFreeShipping: boolean;
}

// Calculate volumetric weight (cm to kg)
export function calculateVolumetricWeight(length: number, width: number, height: number): number {
  return (length * width * height) / 5000; // Standard divisor for air freight
}

// Calculate shipping cost
export function calculateShippingCost(
  region: string,
  provider: ShippingProviderType,
  dimensions: PackageDimensions,
  subtotal: number
): ShippingCostResult {
  // Base rates by region (in PHP)
  const baseRates: Record<string, number> = {
    NCR: 50, CAR: 150, ILOCOS: 100, CAGAYAN_VALLEY: 125, CENTRAL_LUZON: 75,
    CALABARZON: 75, MIMAROPA: 100, BICOL: 100, WESTERN_VISAYAS: 125,
    CENTRAL_VISAYAS: 125, EASTERN_VISAYAS: 150, ZAMBOANGA: 150,
    NORTHERN_MINDANAO: 150, DAVAO: 150, SOCCSKSARGEN: 175, CARAGA: 175, ARMM: 200,
  };

  // Provider multipliers
  const providerMultipliers: Record<ShippingProviderType, number> = {
    LBC: 1.0, TWO_GO: 0.95, JRS: 0.9, JT_EXPRESS: 1.0,
    GRAB: 1.2, LALAMOVE: 1.3, MOVEIT: 1.05, PICKUP: 0,
  };

  // Estimated delivery days
  const deliveryDays: Record<string, Record<ShippingProviderType, number>> = {
    NCR: { LBC: 1, TWO_GO: 2, JRS: 2, JT_EXPRESS: 1, GRAB: 0, LALAMOVE: 0, MOVEIT: 1, PICKUP: 0 },
    DEFAULT: { LBC: 3, TWO_GO: 4, JRS: 4, JT_EXPRESS: 3, GRAB: 2, LALAMOVE: 2, MOVEIT: 2, PICKUP: 0 },
  };

  // Handle PICKUP
  if (provider === 'PICKUP') {
    return {
      provider, baseCost: 0, weightSurcharge: 0, dimensionalSurcharge: 0,
      remoteSurcharge: 0, totalCost: 0, estimatedDays: 0, isFreeShipping: true,
    };
  }

  const baseCost = (baseRates[region] || 150) * (providerMultipliers[provider] || 1);
  
  // Weight surcharge (over 1kg)
  const actualWeight = dimensions.weight;
  const volumetricWeight = calculateVolumetricWeight(dimensions.length, dimensions.width, dimensions.height);
  const chargeableWeight = Math.max(actualWeight, volumetricWeight);
  const weightSurcharge = chargeableWeight > 1 ? (chargeableWeight - 1) * 30 : 0;

  // Dimensional surcharge (oversized packages)
  const maxDimension = Math.max(dimensions.length, dimensions.width, dimensions.height);
  const dimensionalSurcharge = maxDimension > 60 ? 50 : 0;

  // Remote area surcharge
  const remoteRegions = ['ARMM', 'CARAGA', 'SOCCSKSARGEN', 'EASTERN_VISAYAS'];
  const remoteSurcharge = remoteRegions.includes(region) ? 50 : 0;

  // Total cost
  let totalCost = baseCost + weightSurcharge + dimensionalSurcharge + remoteSurcharge;

  // Free shipping for orders over 1000 PHP (standard delivery only)
  const isFreeShipping = subtotal >= 1000 && !['GRAB', 'LALAMOVE', 'MOVEIT'].includes(provider);
  if (isFreeShipping) totalCost = 0;

  // Estimated days
  const regionDays = deliveryDays[region] || deliveryDays.DEFAULT;
  const estimatedDays = regionDays[provider] || 3;

  return {
    provider, baseCost: Math.round(baseCost), weightSurcharge: Math.round(weightSurcharge),
    dimensionalSurcharge, remoteSurcharge, totalCost: Math.round(totalCost),
    estimatedDays, isFreeShipping,
  };
}

export interface ShippingCostCalculatorProps {
  onCalculate?: (results: ShippingCostResult[]) => void;
  defaultRegion?: string;
  defaultDimensions?: PackageDimensions;
  subtotal?: number;
  className?: string;
}

/**
 * ShippingCostCalculator - Calculate shipping costs for different providers
 */
export function ShippingCostCalculator({
  onCalculate,
  defaultRegion = 'NCR',
  defaultDimensions = { length: 20, width: 15, height: 10, weight: 0.5 },
  subtotal = 0,
  className = '',
}: ShippingCostCalculatorProps) {
  const [region, setRegion] = useState(defaultRegion);
  const [dimensions, setDimensions] = useState(defaultDimensions);
  const [results, setResults] = useState<ShippingCostResult[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  // Calculate costs
  const handleCalculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      const providers: ShippingProviderType[] = ['LBC', 'TWO_GO', 'JRS', 'JT_EXPRESS', 'GRAB', 'LALAMOVE', 'MOVEIT'];
      const newResults = providers.map(provider => calculateShippingCost(region, provider, dimensions, subtotal));
      newResults.sort((a, b) => a.totalCost - b.totalCost);
      setResults(newResults);
      onCalculate?.(newResults);
      setIsCalculating(false);
    }, 500);
  };

  return (
    <div className={`rounded-lg border border-border bg-card ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Calculator className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Shipping Calculator</h3>
          <p className="text-sm text-muted-foreground">Estimate shipping costs</p>
        </div>
      </div>

      {/* Input Form */}
      <div className="p-4 space-y-4">
        {/* Region */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            <MapPin className="w-4 h-4 inline mr-1" />
            Destination Region
          </label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {PHILIPPINES_REGIONS.map((r) => (
              <option key={r} value={r}>{REGION_LABELS[r] || r}</option>
            ))}
          </select>
        </div>

        {/* Dimensions */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            <Ruler className="w-4 h-4 inline mr-1" />
            Package Dimensions (cm)
          </label>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="number"
              value={dimensions.length}
              onChange={(e) => setDimensions({ ...dimensions, length: parseFloat(e.target.value) || 0 })}
              placeholder="Length"
              className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-center focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <input
              type="number"
              value={dimensions.width}
              onChange={(e) => setDimensions({ ...dimensions, width: parseFloat(e.target.value) || 0 })}
              placeholder="Width"
              className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-center focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <input
              type="number"
              value={dimensions.height}
              onChange={(e) => setDimensions({ ...dimensions, height: parseFloat(e.target.value) || 0 })}
              placeholder="Height"
              className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-center focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        {/* Weight */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            <Scale className="w-4 h-4 inline mr-1" />
            Weight (kg)
          </label>
          <input
            type="number"
            value={dimensions.weight}
            onChange={(e) => setDimensions({ ...dimensions, weight: parseFloat(e.target.value) || 0 })}
            step="0.1"
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* Calculate Button */}
        <button
          onClick={handleCalculate}
          disabled={isCalculating}
          className="w-full py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isCalculating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Calculating...
            </>
          ) : (
            <>
              <Calculator className="w-4 h-4" />
              Calculate Shipping
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="border-t border-border">
          <div className="p-4">
            <h4 className="font-medium text-foreground mb-3">Shipping Options</h4>
            <div className="space-y-2">
              {results.map((result) => {
                const config = PROVIDER_CONFIG[result.provider];
                return (
                  <div
                    key={result.provider}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{config.logo}</span>
                      <div>
                        <p className="font-medium text-foreground">{config.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {result.estimatedDays === 0 ? 'Same day' : `${result.estimatedDays} day${result.estimatedDays > 1 ? 's' : ''}`}
                        </p>
                      </div>
                    </div>
                    <p className={`font-semibold ${result.isFreeShipping ? 'text-green-600 dark:text-green-400' : 'text-foreground'}`}>
                      {result.isFreeShipping ? 'FREE' : `₱${result.totalCost.toLocaleString()}`}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Info */}
          <div className="p-3 bg-muted/30 border-t border-border">
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <Info className="w-4 h-4 mt-0.5" />
              <p>Prices are estimates. Final cost may vary based on actual weight and dimensions.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

