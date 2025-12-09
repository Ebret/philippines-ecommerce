'use client';

/**
 * Discount Manager Component
 * Phase 26.2.1: Discount Management System
 * 
 * Comprehensive discount management with CRUD operations,
 * filtering, and status management.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Percent, Plus, Search, Filter, Edit, Trash2,
  RefreshCw, Calendar, Tag, MoreVertical, Eye, EyeOff
} from 'lucide-react';

// Types for discounts
export interface Discount {
  id: string;
  name: string;
  description?: string;
  type: 'PERCENTAGE' | 'FIXED' | 'BOGO' | 'FREE_SHIPPING';
  value: number;
  minOrderValue?: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageLimit?: number;
  usageCount: number;
  applicableProducts: string[];
  applicableCategories: string[];
}

interface DiscountManagerProps {
  onCreateDiscount?: () => void;
  onEditDiscount?: (discount: Discount) => void;
  className?: string;
}

export function DiscountManager({
  onCreateDiscount,
  onEditDiscount,
  className,
}: DiscountManagerProps) {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'expired'>('all');

  // Fetch discounts
  const fetchDiscounts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (filter !== 'all') params.append('status', filter);

      const response = await fetch(`/api/discounts?${params}`);
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      setDiscounts(data.discounts || []);
    } catch (error) {
      console.error('Error fetching discounts:', error);
    } finally {
      setLoading(false);
    }
  }, [search, filter]);

  useEffect(() => {
    fetchDiscounts();
  }, [fetchDiscounts]);

  // Toggle discount status
  const toggleStatus = async (id: string, isActive: boolean) => {
    try {
      await fetch(`/api/discounts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });
      fetchDiscounts();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  // Delete discount
  const deleteDiscount = async (id: string) => {
    if (!confirm('Are you sure you want to delete this discount?')) return;
    
    try {
      await fetch(`/api/discounts/${id}`, { method: 'DELETE' });
      fetchDiscounts();
    } catch (error) {
      console.error('Error deleting discount:', error);
    }
  };

  // Get discount type badge
  const getTypeBadge = (type: string) => {
    const variants: Record<string, string> = {
      PERCENTAGE: 'bg-blue-500/10 text-blue-600',
      FIXED: 'bg-green-500/10 text-green-600',
      BOGO: 'bg-purple-500/10 text-purple-600',
      FREE_SHIPPING: 'bg-amber-500/10 text-amber-600',
    };
    return <Badge className={variants[type] || ''}>{type.replace('_', ' ')}</Badge>;
  };

  // Check if discount is expired
  const isExpired = (endDate: string) => new Date(endDate) < new Date();

  // Filter discounts
  const filteredDiscounts = discounts.filter(d => {
    if (filter === 'active') return d.isActive && !isExpired(d.endDate);
    if (filter === 'inactive') return !d.isActive;
    if (filter === 'expired') return isExpired(d.endDate);
    return true;
  });

  return (
    <Card className={cn('overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3">
        <div className="flex items-center gap-2">
          <Percent className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Discount Management</h3>
        </div>
        <Button onClick={onCreateDiscount} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Create Discount
        </Button>
      </div>

      {/* Filters */}
      <div className="border-b border-border p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search discounts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'active', 'inactive', 'expired'] as const).map((f) => (
              <Button
                key={f}
                variant={filter === f ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Discount List */}
      <div className="divide-y divide-border">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filteredDiscounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Percent className="mb-2 h-8 w-8" />
            <p>No discounts found</p>
          </div>
        ) : (
          filteredDiscounts.map((discount) => (
            <div key={discount.id} className="flex items-center gap-4 p-4 hover:bg-muted/30">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium truncate">{discount.name}</span>
                  {getTypeBadge(discount.type)}
                  {isExpired(discount.endDate) && (
                    <Badge variant="error">Expired</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {discount.type === 'PERCENTAGE' ? `${discount.value}% off` :
                   discount.type === 'FIXED' ? `₱${discount.value} off` :
                   discount.type === 'BOGO' ? 'Buy One Get One' : 'Free Shipping'}
                  {discount.minOrderValue && ` • Min: ₱${discount.minOrderValue}`}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  <Calendar className="inline h-3 w-3 mr-1" />
                  {new Date(discount.startDate).toLocaleDateString()} - {new Date(discount.endDate).toLocaleDateString()}
                  {discount.usageLimit && ` • ${discount.usageCount}/${discount.usageLimit} used`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleStatus(discount.id, discount.isActive)}
                >
                  {discount.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditDiscount?.(discount)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteDiscount(discount.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

