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
  home: 'bg-blue-100 text-blue-800',
  work: 'bg-purple-100 text-purple-800',
  other: 'bg-gray-100 text-gray-800',
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
    <div className={cn('bg-white rounded-lg shadow-md p-6', className)}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Addresses</h2>
        {onAdd && (
          <button
            onClick={onAdd}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            + Add Address
          </button>
        )}
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No addresses added yet</p>
          {onAdd && (
            <button
              onClick={onAdd}
              className="text-blue-600 hover:text-blue-700 font-semibold"
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
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              )}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">
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
                  <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                    Default
                  </span>
                )}
              </div>

              {/* Address Details */}
              <div className="space-y-2 mb-4 text-sm text-gray-700">
                <p>{address.street}</p>
                <p>
                  {address.city}, {address.province} {address.zipCode}
                </p>
                <p>{address.country}</p>
                <p className="font-semibold">{address.phone}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-3 border-t border-gray-200">
                {onEdit && (
                  <button
                    onClick={() => onEdit(address)}
                    disabled={isLoading}
                    className="flex-1 text-blue-600 hover:text-blue-700 font-semibold text-sm disabled:text-gray-400 transition-colors"
                  >
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => handleDelete(address.id)}
                    disabled={isLoading || deletingId === address.id}
                    className="flex-1 text-red-600 hover:text-red-700 font-semibold text-sm disabled:text-gray-400 transition-colors"
                  >
                    {deletingId === address.id ? 'Deleting...' : 'Delete'}
                  </button>
                )}
                {onSetDefault && !address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    disabled={isLoading || settingDefaultId === address.id}
                    className="flex-1 text-green-600 hover:text-green-700 font-semibold text-sm disabled:text-gray-400 transition-colors"
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

