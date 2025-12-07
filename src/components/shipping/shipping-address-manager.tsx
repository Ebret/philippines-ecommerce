'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Check,
  Star,
  Phone,
  User,
  Home,
  Building,
  Loader2,
} from 'lucide-react';

// Philippines regions
export const PHILIPPINES_REGIONS = [
  'NCR', 'CAR', 'ILOCOS', 'CAGAYAN_VALLEY', 'CENTRAL_LUZON', 'CALABARZON',
  'MIMAROPA', 'BICOL', 'WESTERN_VISAYAS', 'CENTRAL_VISAYAS', 'EASTERN_VISAYAS',
  'ZAMBOANGA', 'NORTHERN_MINDANAO', 'DAVAO', 'SOCCSKSARGEN', 'CARAGA', 'ARMM',
];

// Region labels
const REGION_LABELS: Record<string, string> = {
  NCR: 'National Capital Region',
  CAR: 'Cordillera Administrative Region',
  ILOCOS: 'Ilocos Region',
  CAGAYAN_VALLEY: 'Cagayan Valley',
  CENTRAL_LUZON: 'Central Luzon',
  CALABARZON: 'CALABARZON',
  MIMAROPA: 'MIMAROPA',
  BICOL: 'Bicol Region',
  WESTERN_VISAYAS: 'Western Visayas',
  CENTRAL_VISAYAS: 'Central Visayas',
  EASTERN_VISAYAS: 'Eastern Visayas',
  ZAMBOANGA: 'Zamboanga Peninsula',
  NORTHERN_MINDANAO: 'Northern Mindanao',
  DAVAO: 'Davao Region',
  SOCCSKSARGEN: 'SOCCSKSARGEN',
  CARAGA: 'Caraga',
  ARMM: 'BARMM',
};

// Address type
export type AddressType = 'HOME' | 'OFFICE' | 'OTHER';

// Shipping address interface
export interface ShippingAddress {
  id: string;
  type: AddressType;
  label?: string;
  recipientName: string;
  phone: string;
  streetAddress: string;
  barangay?: string;
  city: string;
  province: string;
  region: string;
  postalCode: string;
  isDefault: boolean;
  notes?: string;
}

// Address type icons
const ADDRESS_TYPE_ICONS: Record<AddressType, React.ElementType> = {
  HOME: Home,
  OFFICE: Building,
  OTHER: MapPin,
};

export interface ShippingAddressManagerProps {
  addresses: ShippingAddress[];
  selectedAddressId?: string;
  onSelect?: (id: string) => void;
  onAdd?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onSetDefault?: (id: string) => void;
  isLoading?: boolean;
  allowAdd?: boolean;
  allowEdit?: boolean;
  allowDelete?: boolean;
  className?: string;
}

/**
 * ShippingAddressManager - Manage shipping addresses
 */
export function ShippingAddressManager({
  addresses,
  selectedAddressId,
  onSelect,
  onAdd,
  onEdit,
  onDelete,
  onSetDefault,
  isLoading = false,
  allowAdd = true,
  allowEdit = true,
  allowDelete = true,
  className = '',
}: ShippingAddressManagerProps) {
  return (
    <div className={`rounded-lg border border-border bg-card ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Shipping Addresses</h3>
            <p className="text-sm text-muted-foreground">{addresses.length} saved address{addresses.length !== 1 ? 'es' : ''}</p>
          </div>
        </div>
        {allowAdd && onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        )}
      </div>

      {/* Addresses List */}
      <div className="divide-y divide-border">
        {addresses.length === 0 ? (
          <div className="p-8 text-center">
            <MapPin className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No addresses saved</p>
            {allowAdd && onAdd && (
              <button onClick={onAdd} className="mt-3 text-primary hover:underline">
                Add your first address
              </button>
            )}
          </div>
        ) : (
          addresses.map((address) => {
            const Icon = ADDRESS_TYPE_ICONS[address.type];
            const isSelected = selectedAddressId === address.id;

            return (
              <div
                key={address.id}
                onClick={() => onSelect?.(address.id)}
                className={`p-4 transition-colors ${onSelect ? 'cursor-pointer hover:bg-muted/50' : ''} ${
                  isSelected ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  </div>

                  {/* Address Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground">
                        {address.label || address.type}
                      </span>
                      {address.isDefault && (
                        <span className="px-1.5 py-0.5 rounded text-xs bg-primary/10 text-primary font-medium">
                          Default
                        </span>
                      )}
                    </div>

                    {/* Recipient */}
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <User className="w-3 h-3 text-muted-foreground" />
                      <span>{address.recipientName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                      <Phone className="w-3 h-3" />
                      <span>{address.phone}</span>
                    </div>

                    {/* Full Address */}
                    <p className="text-sm text-muted-foreground mt-2">
                      {address.streetAddress}
                      {address.barangay && `, Brgy. ${address.barangay}`}
                      <br />
                      {address.city}, {address.province}
                      <br />
                      {REGION_LABELS[address.region] || address.region} {address.postalCode}
                    </p>

                    {address.notes && (
                      <p className="text-xs text-muted-foreground mt-1 italic">
                        Note: {address.notes}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    {!address.isDefault && onSetDefault && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onSetDefault(address.id); }}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                        title="Set as default"
                      >
                        <Star className="w-4 h-4 text-muted-foreground" />
                      </button>
                    )}
                    {allowEdit && onEdit && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onEdit(address.id); }}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4 text-muted-foreground" />
                      </button>
                    )}
                    {allowDelete && onDelete && !address.isDefault && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onDelete(address.id); }}
                        className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    )}
                    {isSelected && (
                      <div className="p-2">
                        <Check className="w-4 h-4 text-primary" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-lg">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
}

export { REGION_LABELS, ADDRESS_TYPE_ICONS };

