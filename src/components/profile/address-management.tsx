'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  province: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
  type: 'home' | 'work' | 'other';
}

interface AddressManagementProps {
  addresses: Address[];
  onAdd?: () => void;
  onEdit?: (address: Address) => void;
  onDelete?: (id: string) => Promise<void>;
  onSetDefault?: (id: string) => Promise<void>;
  isLoading?: boolean;
  className?: string;
}

const typeColors = {
  home: 'bg-info/10 text-info',
  work: 'bg-accent/20 text-accent-foreground',
  other: 'bg-muted text-muted-foreground',
};

export const AddressManagement: React.FC<AddressManagementProps> = ({
  addresses,
  onAdd,
  onEdit,
  onDelete,
  onSetDefault,
  isLoading = false,
  className,
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!onDelete) return;
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (id: string) => {
    if (!onSetDefault) return;
    setSettingDefaultId(id);
    try {
      await onSetDefault(id);
    } finally {
      setSettingDefaultId(null);
    }
  };

  return (
    <div className={cn('bg-card text-card-foreground rounded-lg shadow-md border border-border p-6', className)}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Addresses</h2>
        {onAdd && (
          <button
            onClick={onAdd}
            disabled={isLoading}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-50 transition-colors"
          >
            + Add Address
          </button>
        )}
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No addresses added yet</p>
          {onAdd && (
            <button
              onClick={onAdd}
              className="text-primary hover:text-primary-dark font-semibold"
            >
              Add your first address
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={cn(
                'border rounded-lg p-4 transition-all',
                address.isDefault
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              )}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">
                    {address.label}
                  </h3>
                  <span
                    className={cn(
                      'px-2 py-1 rounded text-xs font-semibold',
                      typeColors[address.type]
                    )}
                  >
                    {address.type.charAt(0).toUpperCase() + address.type.slice(1)}
                  </span>
                </div>
                {address.isDefault && (
                  <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-semibold">
                    Default
                  </span>
                )}
              </div>

              {/* Address Details */}
              <div className="space-y-2 mb-4 text-sm text-foreground">
                <p>{address.street}</p>
                <p>
                  {address.city}, {address.province} {address.zipCode}
                </p>
                <p>{address.country}</p>
                <p className="font-semibold">{address.phone}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-3 border-t border-border">
                {onEdit && (
                  <button
                    onClick={() => onEdit(address)}
                    disabled={isLoading}
                    className="flex-1 text-primary hover:text-primary-dark font-semibold text-sm disabled:opacity-50 transition-colors"
                  >
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => handleDelete(address.id)}
                    disabled={isLoading || deletingId === address.id}
                    className="flex-1 text-error hover:text-error/80 font-semibold text-sm disabled:opacity-50 transition-colors"
                  >
                    {deletingId === address.id ? 'Deleting...' : 'Delete'}
                  </button>
                )}
                {onSetDefault && !address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    disabled={isLoading || settingDefaultId === address.id}
                    className="flex-1 text-success hover:text-success/80 font-semibold text-sm disabled:opacity-50 transition-colors"
                  >
                    {settingDefaultId === address.id ? 'Setting...' : 'Set Default'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

