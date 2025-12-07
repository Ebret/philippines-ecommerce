'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  Wallet,
  Banknote,
  Truck,
  Plus,
  Trash2,
  Check,
  Star,
  Edit2,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { PaymentMethodType } from './payment-status-tracker';

// Saved payment method interface
export interface SavedPaymentMethod {
  id: string;
  type: PaymentMethodType;
  label: string;
  isDefault: boolean;
  lastUsed?: string;
  // GCash/PayMaya
  phoneNumber?: string;
  email?: string;
  // Card
  cardLast4?: string;
  cardBrand?: string;
  cardExpiry?: string;
  // Bank
  bankName?: string;
  accountLast4?: string;
}

// Method icons
const METHOD_ICONS: Record<PaymentMethodType, React.ElementType> = {
  GCASH: Wallet,
  PAYMAYA: Wallet,
  CREDIT_CARD: CreditCard,
  DEBIT_CARD: CreditCard,
  BANK_TRANSFER: Banknote,
  COD: Truck,
};

// Method colors
const METHOD_COLORS: Record<PaymentMethodType, { bg: string; text: string }> = {
  GCASH: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' },
  PAYMAYA: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400' },
  CREDIT_CARD: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400' },
  DEBIT_CARD: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-600 dark:text-indigo-400' },
  BANK_TRANSFER: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400' },
  COD: { bg: 'bg-gray-100 dark:bg-gray-900/30', text: 'text-gray-600 dark:text-gray-400' },
};

// Method labels
const METHOD_LABELS: Record<PaymentMethodType, string> = {
  GCASH: 'GCash',
  PAYMAYA: 'PayMaya',
  CREDIT_CARD: 'Credit Card',
  DEBIT_CARD: 'Debit Card',
  BANK_TRANSFER: 'Bank Transfer',
  COD: 'Cash on Delivery',
};

export interface PaymentMethodManagerProps {
  methods: SavedPaymentMethod[];
  onAddMethod?: (type: PaymentMethodType) => void;
  onRemoveMethod?: (id: string) => void;
  onSetDefault?: (id: string) => void;
  onEditMethod?: (id: string) => void;
  onSelectMethod?: (id: string) => void;
  selectedMethodId?: string;
  isLoading?: boolean;
  allowAdd?: boolean;
  allowRemove?: boolean;
  allowEdit?: boolean;
  className?: string;
}

/**
 * PaymentMethodManager - Manage saved payment methods
 */
export function PaymentMethodManager({
  methods,
  onAddMethod,
  onRemoveMethod,
  onSetDefault,
  onEditMethod,
  onSelectMethod,
  selectedMethodId,
  isLoading = false,
  allowAdd = true,
  allowRemove = true,
  allowEdit = true,
  className = '',
}: PaymentMethodManagerProps) {
  const [showAddMenu, setShowAddMenu] = useState(false);

  // Get method display info
  const getMethodInfo = (method: SavedPaymentMethod): string => {
    if (method.phoneNumber) return `•••• ${method.phoneNumber.slice(-4)}`;
    if (method.cardLast4) return `•••• ${method.cardLast4}`;
    if (method.accountLast4) return `${method.bankName} •••• ${method.accountLast4}`;
    if (method.email) return method.email;
    return '';
  };

  return (
    <div className={`rounded-lg border border-border bg-card ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Payment Methods</h3>
            <p className="text-sm text-muted-foreground">{methods.length} saved method{methods.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        {allowAdd && onAddMethod && (
          <div className="relative">
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
            {showAddMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-border bg-card shadow-lg z-10">
                {(Object.keys(METHOD_LABELS) as PaymentMethodType[]).map((type) => {
                  const Icon = METHOD_ICONS[type];
                  return (
                    <button
                      key={type}
                      onClick={() => { onAddMethod(type); setShowAddMenu(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg"
                    >
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">{METHOD_LABELS[type]}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Methods List */}
      <div className="divide-y divide-border">
        {methods.length === 0 ? (
          <div className="p-8 text-center">
            <CreditCard className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No payment methods saved</p>
            {allowAdd && onAddMethod && (
              <button
                onClick={() => setShowAddMenu(true)}
                className="mt-3 text-primary hover:underline"
              >
                Add a payment method
              </button>
            )}
          </div>
        ) : (
          methods.map((method) => {
            const Icon = METHOD_ICONS[method.type];
            const colors = METHOD_COLORS[method.type];
            const isSelected = selectedMethodId === method.id;

            return (
              <div
                key={method.id}
                className={`p-4 flex items-center gap-4 transition-colors ${
                  onSelectMethod ? 'cursor-pointer hover:bg-muted/50' : ''
                } ${isSelected ? 'bg-primary/5 border-l-2 border-l-primary' : ''}`}
                onClick={() => onSelectMethod?.(method.id)}
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${colors.text}`} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{method.label || METHOD_LABELS[method.type]}</span>
                    {method.isDefault && (
                      <span className="px-1.5 py-0.5 rounded text-xs bg-primary/10 text-primary font-medium">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{getMethodInfo(method)}</p>
                  {method.cardExpiry && (
                    <p className="text-xs text-muted-foreground">Expires {method.cardExpiry}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  {!method.isDefault && onSetDefault && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onSetDefault(method.id); }}
                      className="p-2 rounded-lg hover:bg-muted transition-colors"
                      title="Set as default"
                    >
                      <Star className="w-4 h-4 text-muted-foreground" />
                    </button>
                  )}
                  {allowEdit && onEditMethod && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onEditMethod(method.id); }}
                      className="p-2 rounded-lg hover:bg-muted transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4 text-muted-foreground" />
                    </button>
                  )}
                  {allowRemove && onRemoveMethod && !method.isDefault && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onRemoveMethod(method.id); }}
                      className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                      title="Remove"
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

export { METHOD_ICONS, METHOD_COLORS, METHOD_LABELS };

