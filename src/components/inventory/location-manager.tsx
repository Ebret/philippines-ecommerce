'use client';

/**
 * Location Manager Component
 * Phase 26.1.4: Multi-location Inventory Management
 * 
 * Manage inventory locations (warehouses, stores, etc.)
 * with CRUD operations and stock overview per location.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  MapPin, Plus, Edit2, Trash2, Search, RefreshCw,
  Building2, Package, AlertTriangle, ChevronRight
} from 'lucide-react';

// Types for location management
export interface InventoryLocation {
  id: string;
  name: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country: string;
  isActive: boolean;
  isDefault: boolean;
  vendorId: string;
  createdAt: string;
  _count?: {
    inventoryItems: number;
  };
  stats?: {
    totalItems: number;
    totalValue: number;
    lowStockCount: number;
    outOfStockCount: number;
  };
}

interface LocationManagerProps {
  vendorId?: string;
  className?: string;
  onLocationSelect?: (location: InventoryLocation) => void;
  selectedLocationId?: string;
}

export function LocationManager({
  vendorId,
  className,
  onLocationSelect,
  selectedLocationId,
}: LocationManagerProps) {
  const [locations, setLocations] = useState<InventoryLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState<InventoryLocation | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'Philippines',
    isDefault: false,
  });

  // Fetch locations
  const fetchLocations = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        ...(vendorId && { vendorId }),
        ...(searchQuery && { search: searchQuery }),
      });

      const response = await fetch(`/api/inventory/locations?${params}`);
      if (!response.ok) throw new Error('Failed to fetch locations');
      
      const data = await response.json();
      setLocations(data.locations || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load locations');
    } finally {
      setLoading(false);
    }
  }, [vendorId, searchQuery]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingLocation 
        ? `/api/inventory/locations/${editingLocation.id}`
        : '/api/inventory/locations';
      
      const response = await fetch(url, {
        method: editingLocation ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save location');
      
      setShowForm(false);
      setEditingLocation(null);
      setFormData({
        name: '',
        address: '',
        city: '',
        province: '',
        postalCode: '',
        country: 'Philippines',
        isDefault: false,
      });
      fetchLocations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save location');
    }
  };

  // Handle edit
  const handleEdit = (location: InventoryLocation) => {
    setEditingLocation(location);
    setFormData({
      name: location.name,
      address: location.address || '',
      city: location.city || '',
      province: location.province || '',
      postalCode: location.postalCode || '',
      country: location.country,
      isDefault: location.isDefault,
    });
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this location?')) return;
    
    try {
      const response = await fetch(`/api/inventory/locations/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete location');
      fetchLocations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete location');
    }
  };

  return (
    <Card className={cn('overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Inventory Locations</h3>
        </div>
        <div className="flex gap-2">
          <Button variant="default" size="sm" onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Location
          </Button>
          <Button variant="ghost" size="sm" onClick={fetchLocations} disabled={loading}>
            <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="border-b border-border p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="border-b border-border bg-muted/20 p-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                placeholder="Location Name *"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
              <Input
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              />
              <Input
                placeholder="City"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              />
              <Input
                placeholder="Province"
                value={formData.province}
                onChange={(e) => setFormData(prev => ({ ...prev, province: e.target.value }))}
              />
              <Input
                placeholder="Postal Code"
                value={formData.postalCode}
                onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                  className="rounded border-input"
                />
                Set as default location
              </label>
            </div>
            <div className="flex gap-2">
              <Button type="submit" size="sm">
                {editingLocation ? 'Update' : 'Create'} Location
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowForm(false);
                  setEditingLocation(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Location List */}
      <div className="divide-y divide-border">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="p-4 text-center text-destructive">{error}</div>
        ) : locations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Building2 className="mb-2 h-8 w-8" />
            <p>No locations found</p>
          </div>
        ) : (
          locations.map((location) => (
            <div
              key={location.id}
              className={cn(
                'flex items-center justify-between p-4 transition-colors cursor-pointer hover:bg-muted/50',
                selectedLocationId === location.id && 'bg-primary/10'
              )}
              onClick={() => onLocationSelect?.(location)}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{location.name}</span>
                    {location.isDefault && (
                      <Badge variant="secondary" className="text-xs">Default</Badge>
                    )}
                    {!location.isActive && (
                      <Badge variant="destructive" className="text-xs">Inactive</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {[location.address, location.city, location.province].filter(Boolean).join(', ')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {location.stats && (
                  <div className="flex gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      {location.stats.totalItems} items
                    </span>
                    {location.stats.lowStockCount > 0 && (
                      <span className="flex items-center gap-1 text-amber-600">
                        <AlertTriangle className="h-3 w-3" />
                        {location.stats.lowStockCount} low
                      </span>
                    )}
                  </div>
                )}
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); handleEdit(location); }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); handleDelete(location.id); }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

