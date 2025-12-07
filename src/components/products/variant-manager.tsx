/**
 * VariantManager Component
 * Phase 26.4.1: Product Variant Management
 * 
 * Features:
 * - Create and manage product variants
 * - SKU and barcode management
 * - Price and stock per variant
 * - Variant attributes (size, color, etc.)
 */

'use client';

import { useState, useCallback } from 'react';
import { 
  Plus, Trash2, Edit2, Save, X, Package, 
  DollarSign, Hash, Barcode, AlertCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ProductVariant {
  id: string;
  sku: string;
  barcode?: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  attributes: Record<string, string>;
  isActive: boolean;
}

interface VariantManagerProps {
  productId: string;
  variants: ProductVariant[];
  onAdd: (variant: Omit<ProductVariant, 'id'>) => void;
  onUpdate: (id: string, variant: Partial<ProductVariant>) => void;
  onDelete: (id: string) => void;
  attributeOptions?: { name: string; values: string[] }[];
  className?: string;
}

const DEFAULT_ATTRIBUTES = [
  { name: 'Size', values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
  { name: 'Color', values: ['Red', 'Blue', 'Green', 'Black', 'White'] },
  { name: 'Material', values: ['Cotton', 'Polyester', 'Silk', 'Wool'] },
];

export function VariantManager({
  productId,
  variants,
  onAdd,
  onUpdate,
  onDelete,
  attributeOptions = DEFAULT_ATTRIBUTES,
  className,
}: VariantManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [newVariant, setNewVariant] = useState<Omit<ProductVariant, 'id'>>({
    sku: '',
    name: '',
    price: 0,
    stock: 0,
    attributes: {},
    isActive: true,
  });
  const [editVariant, setEditVariant] = useState<Partial<ProductVariant>>({});

  // Generate SKU
  const generateSku = useCallback(() => {
    const prefix = productId.slice(0, 4).toUpperCase();
    const suffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${suffix}`;
  }, [productId]);

  // Handle add variant
  const handleAdd = () => {
    if (!newVariant.sku || !newVariant.name) return;
    onAdd(newVariant);
    setNewVariant({
      sku: '',
      name: '',
      price: 0,
      stock: 0,
      attributes: {},
      isActive: true,
    });
    setIsAdding(false);
  };

  // Handle update variant
  const handleUpdate = (id: string) => {
    onUpdate(id, editVariant);
    setEditingId(null);
    setEditVariant({});
  };

  // Start editing
  const startEdit = (variant: ProductVariant) => {
    setEditingId(variant.id);
    setEditVariant(variant);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditVariant({});
  };

  // Confirm delete
  const confirmDelete = (id: string) => {
    onDelete(id);
    setDeleteConfirmId(null);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Product Variants
          </h3>
          <p className="text-sm text-muted-foreground">
            {variants.length} variant{variants.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
          <Plus className="w-4 h-4 mr-2" />
          Add Variant
        </Button>
      </div>

      {/* Add New Variant Form */}
      {isAdding && (
        <div className="p-4 border border-border rounded-lg bg-card space-y-4">
          <h4 className="font-medium">New Variant</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* SKU */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">SKU</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newVariant.sku}
                  onChange={(e) => setNewVariant(v => ({ ...v, sku: e.target.value }))}
                  placeholder="SKU-001"
                  className="flex-1 px-3 py-2 rounded-md border border-border bg-background text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setNewVariant(v => ({ ...v, sku: generateSku() }))}
                >
                  Generate
                </Button>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Variant Name</label>
              <input
                type="text"
                value={newVariant.name}
                onChange={(e) => setNewVariant(v => ({ ...v, name: e.target.value }))}
                placeholder="e.g., Large / Red"
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm"
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Price (₱)</label>
              <input
                type="number"
                value={newVariant.price}
                onChange={(e) => setNewVariant(v => ({ ...v, price: parseFloat(e.target.value) || 0 }))}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm"
              />
            </div>

            {/* Stock */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Stock</label>
              <input
                type="number"
                value={newVariant.stock}
                onChange={(e) => setNewVariant(v => ({ ...v, stock: parseInt(e.target.value) || 0 }))}
                min="0"
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm"
              />
            </div>
          </div>

          {/* Attributes */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Attributes</label>
            <div className="flex flex-wrap gap-4">
              {attributeOptions.map((attr) => (
                <div key={attr.name} className="space-y-1">
                  <span className="text-xs text-muted-foreground">{attr.name}</span>
                  <select
                    value={newVariant.attributes[attr.name] || ''}
                    onChange={(e) => setNewVariant(v => ({
                      ...v,
                      attributes: { ...v.attributes, [attr.name]: e.target.value },
                    }))}
                    className="px-3 py-2 rounded-md border border-border bg-background text-sm"
                  >
                    <option value="">Select {attr.name}</option>
                    {attr.values.map((val) => (
                      <option key={val} value={val}>{val}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={handleAdd} disabled={!newVariant.sku || !newVariant.name}>
              <Save className="w-4 h-4 mr-2" />
              Save Variant
            </Button>
            <Button variant="outline" onClick={() => setIsAdding(false)}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Variants Table */}
      {variants.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
          <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No variants yet</p>
          <p className="text-sm text-muted-foreground">Add variants to offer different options</p>
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">SKU</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Attributes</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Price</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Stock</th>
                <th className="px-4 py-3 text-center text-sm font-medium">Status</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {variants.map((variant) => (
                <tr key={variant.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 text-sm font-mono">{variant.sku}</td>
                  <td className="px-4 py-3 text-sm">{variant.name}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(variant.attributes).map(([key, value]) => (
                        <span key={key} className="px-2 py-0.5 bg-muted rounded text-xs">
                          {key}: {value}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">{formatCurrency(variant.price)}</td>
                  <td className="px-4 py-3 text-sm text-right">{variant.stock}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn(
                      'px-2 py-1 rounded text-xs font-medium',
                      variant.isActive
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                    )}>
                      {variant.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => startEdit(variant)}
                        className="p-1.5 rounded hover:bg-muted"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(variant.id)}
                        className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <h4 className="font-semibold">Delete Variant?</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              This action cannot be undone. The variant will be permanently deleted.
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => confirmDelete(deleteConfirmId)}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

