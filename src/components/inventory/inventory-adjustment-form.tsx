'use client';

/**
 * Inventory Adjustment Form Component
 * Phase 26.1.2: Inventory Adjustment Workflow
 * 
 * Form for adjusting inventory quantities with reason tracking,
 * notes, and validation. Supports add, remove, and transfer operations.
 */

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, Minus, ArrowRightLeft, Package, AlertTriangle, 
  Check, X, Loader2 
} from 'lucide-react';

// Adjustment types
export type AdjustmentType = 'ADD' | 'REMOVE' | 'TRANSFER';

// Adjustment reasons from validation schema
export const ADJUSTMENT_REASONS = [
  { value: 'INITIAL_STOCK', label: 'Initial Stock' },
  { value: 'PURCHASE', label: 'Purchase/Restock' },
  { value: 'RETURN', label: 'Customer Return' },
  { value: 'DAMAGE', label: 'Damaged Goods' },
  { value: 'LOSS', label: 'Loss/Theft' },
  { value: 'EXPIRY', label: 'Expired Products' },
  { value: 'CORRECTION', label: 'Inventory Correction' },
  { value: 'TRANSFER_OUT', label: 'Transfer Out' },
  { value: 'TRANSFER_IN', label: 'Transfer In' },
  { value: 'RECOUNT', label: 'Physical Recount' },
  { value: 'SAMPLE', label: 'Sample/Giveaway' },
  { value: 'PROMOTION', label: 'Promotional Use' },
] as const;

export type AdjustmentReason = typeof ADJUSTMENT_REASONS[number]['value'];

interface InventoryAdjustmentFormProps {
  inventoryId: string;
  productName: string;
  variantName?: string;
  currentStock: number;
  locationName: string;
  onSubmit: (data: AdjustmentFormData) => Promise<void>;
  onCancel: () => void;
  className?: string;
}

export interface AdjustmentFormData {
  inventoryId: string;
  type: AdjustmentType;
  quantity: number;
  reason: AdjustmentReason;
  notes: string;
  referenceId?: string;
  targetLocationId?: string;
}

export function InventoryAdjustmentForm({
  inventoryId,
  productName,
  variantName,
  currentStock,
  locationName,
  onSubmit,
  onCancel,
  className,
}: InventoryAdjustmentFormProps) {
  // Form state
  const [type, setType] = useState<AdjustmentType>('ADD');
  const [quantity, setQuantity] = useState<number>(1);
  const [reason, setReason] = useState<AdjustmentReason>('CORRECTION');
  const [notes, setNotes] = useState('');
  const [referenceId, setReferenceId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate new stock after adjustment
  const newStock = type === 'ADD' 
    ? currentStock + quantity 
    : type === 'REMOVE' 
      ? Math.max(0, currentStock - quantity)
      : currentStock;

  // Validate form
  const isValid = quantity > 0 && reason && (type !== 'REMOVE' || quantity <= currentStock);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    setError(null);

    try {
      await onSubmit({
        inventoryId,
        type,
        quantity,
        reason,
        notes,
        referenceId: referenceId || undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit adjustment');
    } finally {
      setLoading(false);
    }
  };

  // Get filtered reasons based on adjustment type
  const filteredReasons = ADJUSTMENT_REASONS.filter(r => {
    if (type === 'ADD') return ['INITIAL_STOCK', 'PURCHASE', 'RETURN', 'TRANSFER_IN', 'CORRECTION', 'RECOUNT'].includes(r.value);
    if (type === 'REMOVE') return ['DAMAGE', 'LOSS', 'EXPIRY', 'TRANSFER_OUT', 'CORRECTION', 'SAMPLE', 'PROMOTION', 'RECOUNT'].includes(r.value);
    return true;
  });

  return (
    <Card className={cn('p-6', className)}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Adjust Inventory</h3>
            <p className="text-sm text-muted-foreground">
              {productName} {variantName && `- ${variantName}`}
            </p>
            <p className="text-xs text-muted-foreground">{locationName}</p>
          </div>
          <Badge variant="secondary" className="text-lg">
            Current: {currentStock}
          </Badge>
        </div>

        {/* Adjustment Type Selection */}
        <div className="space-y-2">
          <Label>Adjustment Type</Label>
          <div className="grid grid-cols-3 gap-2">
            <Button
              type="button"
              variant={type === 'ADD' ? 'default' : 'outline'}
              className={cn(type === 'ADD' && 'bg-green-600 hover:bg-green-700')}
              onClick={() => setType('ADD')}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Stock
            </Button>
            <Button
              type="button"
              variant={type === 'REMOVE' ? 'default' : 'outline'}
              className={cn(type === 'REMOVE' && 'bg-red-600 hover:bg-red-700')}
              onClick={() => setType('REMOVE')}
            >
              <Minus className="mr-2 h-4 w-4" /> Remove Stock
            </Button>
            <Button
              type="button"
              variant={type === 'TRANSFER' ? 'default' : 'outline'}
              className={cn(type === 'TRANSFER' && 'bg-blue-600 hover:bg-blue-700')}
              onClick={() => setType('TRANSFER')}
            >
              <ArrowRightLeft className="mr-2 h-4 w-4" /> Transfer
            </Button>
          </div>
        </div>

        {/* Quantity Input */}
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            min={1}
            max={type === 'REMOVE' ? currentStock : undefined}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="text-lg"
          />
          {type === 'REMOVE' && quantity > currentStock && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              Cannot remove more than current stock
            </p>
          )}
        </div>

        {/* Reason Selection */}
        <div className="space-y-2">
          <Label htmlFor="reason">Reason</Label>
          <select
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value as AdjustmentReason)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {filteredReasons.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>

        {/* Reference ID (optional) */}
        <div className="space-y-2">
          <Label htmlFor="referenceId">Reference ID (Optional)</Label>
          <Input
            id="referenceId"
            placeholder="e.g., PO-12345, RMA-67890"
            value={referenceId}
            onChange={(e) => setReferenceId(e.target.value)}
          />
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            placeholder="Add any additional notes about this adjustment..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        {/* Preview */}
        <div className="rounded-lg bg-muted/50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Current Stock:</span>
            <span className="font-medium">{currentStock}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Adjustment:</span>
            <span className={cn(
              'font-medium',
              type === 'ADD' && 'text-green-600',
              type === 'REMOVE' && 'text-red-600'
            )}>
              {type === 'ADD' ? '+' : '-'}{quantity}
            </span>
          </div>
          <div className="mt-2 border-t border-border pt-2 flex items-center justify-between">
            <span className="text-sm font-medium">New Stock:</span>
            <span className="text-lg font-bold">{newStock}</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
          <Button type="submit" disabled={!isValid || loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Check className="mr-2 h-4 w-4" />
            )}
            Submit Adjustment
          </Button>
        </div>
      </form>
    </Card>
  );
}

