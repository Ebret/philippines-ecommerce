'use client';

/**
 * Stock Transfer Form Component
 * Phase 26.1.4: Multi-location Inventory Management
 * 
 * Form for transferring stock between inventory locations.
 * Supports partial transfers and batch transfers.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ArrowRightLeft, Package, MapPin, AlertTriangle, 
  Check, X, RefreshCw, Search
} from 'lucide-react';

// Types for stock transfer
export interface TransferItem {
  inventoryId: string;
  variantId: string;
  productName: string;
  variantName?: string;
  sku: string;
  currentStock: number;
  transferQuantity: number;
}

export interface TransferFormData {
  sourceLocationId: string;
  targetLocationId: string;
  items: TransferItem[];
  notes: string;
  referenceId?: string;
}

interface Location {
  id: string;
  name: string;
  address?: string;
}

interface StockTransferFormProps {
  vendorId?: string;
  className?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function StockTransferForm({
  vendorId,
  className,
  onSuccess,
  onCancel,
}: StockTransferFormProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [sourceLocation, setSourceLocation] = useState<string>('');
  const [targetLocation, setTargetLocation] = useState<string>('');
  const [availableItems, setAvailableItems] = useState<TransferItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<TransferItem[]>([]);
  const [notes, setNotes] = useState('');
  const [referenceId, setReferenceId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const params = new URLSearchParams({ ...(vendorId && { vendorId }) });
        const response = await fetch(`/api/inventory/locations?${params}`);
        if (!response.ok) throw new Error('Failed to fetch locations');
        const data = await response.json();
        setLocations(data.locations || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load locations');
      }
    };
    fetchLocations();
  }, [vendorId]);

  // Fetch inventory items when source location changes
  useEffect(() => {
    if (!sourceLocation) {
      setAvailableItems([]);
      return;
    }

    const fetchItems = async () => {
      try {
        const response = await fetch(`/api/inventory/dashboard?locationId=${sourceLocation}`);
        if (!response.ok) throw new Error('Failed to fetch inventory');
        const data = await response.json();
        
        const items: TransferItem[] = (data.items || []).map((item: any) => ({
          inventoryId: item.id,
          variantId: item.variantId,
          productName: item.variant?.product?.name || 'Unknown',
          variantName: item.variant?.name,
          sku: item.variant?.sku || '',
          currentStock: item.quantity,
          transferQuantity: 0,
        }));
        
        setAvailableItems(items);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load inventory');
      }
    };
    fetchItems();
  }, [sourceLocation]);

  // Filter items by search
  const filteredItems = availableItems.filter(item =>
    item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add item to transfer
  const addItem = (item: TransferItem) => {
    if (selectedItems.find(i => i.inventoryId === item.inventoryId)) return;
    setSelectedItems(prev => [...prev, { ...item, transferQuantity: 1 }]);
  };

  // Remove item from transfer
  const removeItem = (inventoryId: string) => {
    setSelectedItems(prev => prev.filter(i => i.inventoryId !== inventoryId));
  };

  // Update transfer quantity
  const updateQuantity = (inventoryId: string, quantity: number) => {
    setSelectedItems(prev => prev.map(item =>
      item.inventoryId === inventoryId
        ? { ...item, transferQuantity: Math.min(Math.max(1, quantity), item.currentStock) }
        : item
    ));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceLocation || !targetLocation || selectedItems.length === 0) {
      setError('Please select locations and items to transfer');
      return;
    }

    if (sourceLocation === targetLocation) {
      setError('Source and target locations must be different');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/inventory/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceLocationId: sourceLocation,
          targetLocationId: targetLocation,
          items: selectedItems.map(i => ({
            inventoryId: i.inventoryId,
            quantity: i.transferQuantity,
          })),
          notes,
          referenceId: referenceId || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to transfer stock');
      }

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to transfer stock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={cn('overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3">
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Stock Transfer</h3>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4" />
            {error}
          </div>
        )}

        {/* Location Selection */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Source Location</label>
            <select
              value={sourceLocation}
              onChange={(e) => setSourceLocation(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              required
            >
              <option value="">Select source...</option>
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Target Location</label>
            <select
              value={targetLocation}
              onChange={(e) => setTargetLocation(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              required
            >
              <option value="">Select target...</option>
              {locations.filter(l => l.id !== sourceLocation).map(loc => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Item Selection */}
        {sourceLocation && (
          <div>
            <label className="mb-1 block text-sm font-medium">Select Items to Transfer</label>
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="max-h-40 overflow-y-auto rounded-lg border border-border">
              {filteredItems.length === 0 ? (
                <p className="p-3 text-center text-sm text-muted-foreground">No items available</p>
              ) : (
                filteredItems.map(item => (
                  <div
                    key={item.inventoryId}
                    className="flex items-center justify-between border-b border-border p-2 last:border-0 hover:bg-muted/50 cursor-pointer"
                    onClick={() => addItem(item)}
                  >
                    <div>
                      <p className="text-sm font-medium">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">{item.sku} • {item.currentStock} in stock</p>
                    </div>
                    <Button type="button" variant="ghost" size="sm">
                      <Package className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Selected Items */}
        {selectedItems.length > 0 && (
          <div>
            <label className="mb-1 block text-sm font-medium">Items to Transfer ({selectedItems.length})</label>
            <div className="space-y-2">
              {selectedItems.map(item => (
                <div key={item.inventoryId} className="flex items-center gap-2 rounded-lg border border-border p-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.productName}</p>
                    <p className="text-xs text-muted-foreground">{item.sku}</p>
                  </div>
                  <Input
                    type="number"
                    min={1}
                    max={item.currentStock}
                    value={item.transferQuantity}
                    onChange={(e) => updateQuantity(item.inventoryId, parseInt(e.target.value) || 1)}
                    className="w-20 text-center"
                  />
                  <span className="text-xs text-muted-foreground">/ {item.currentStock}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(item.inventoryId)}>
                    <X className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Reference ID (Optional)</label>
            <Input
              placeholder="e.g., TR-001"
              value={referenceId}
              onChange={(e) => setReferenceId(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Notes (Optional)</label>
            <Input
              placeholder="Transfer notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button type="submit" disabled={loading || selectedItems.length === 0}>
            {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
            Transfer Stock
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}

