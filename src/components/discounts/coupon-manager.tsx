'use client';

/**
 * Coupon Manager Component
 * Phase 26.2.2: Coupon Code System
 * 
 * Manage coupon codes with generation, validation, and tracking.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Ticket, Plus, Search, Copy, Check, RefreshCw,
  Calendar, Users, Trash2, Edit
} from 'lucide-react';

// Types for coupons
export interface Coupon {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageLimit?: number;
  usageCount: number;
  perCustomerLimit?: number;
  description?: string;
}

interface CouponManagerProps {
  onCreateCoupon?: () => void;
  onEditCoupon?: (coupon: Coupon) => void;
  className?: string;
}

export function CouponManager({
  onCreateCoupon,
  onEditCoupon,
  className,
}: CouponManagerProps) {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch coupons
  const fetchCoupons = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);

      const response = await fetch(`/api/coupons?${params}`);
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      setCoupons(data.coupons || []);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  // Copy coupon code
  const copyCode = async (id: string, code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Delete coupon
  const deleteCoupon = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    
    try {
      await fetch(`/api/coupons/${id}`, { method: 'DELETE' });
      fetchCoupons();
    } catch (error) {
      console.error('Error deleting coupon:', error);
    }
  };

  // Check if coupon is expired
  const isExpired = (endDate: string) => new Date(endDate) < new Date();

  // Check if coupon is exhausted
  const isExhausted = (coupon: Coupon) => 
    coupon.usageLimit !== undefined && coupon.usageCount >= coupon.usageLimit;

  return (
    <Card className={cn('overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3">
        <div className="flex items-center gap-2">
          <Ticket className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Coupon Codes</h3>
        </div>
        <Button onClick={onCreateCoupon} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Create Coupon
        </Button>
      </div>

      {/* Search */}
      <div className="border-b border-border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search coupons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Coupon List */}
      <div className="divide-y divide-border">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : coupons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Ticket className="mb-2 h-8 w-8" />
            <p>No coupons found</p>
          </div>
        ) : (
          coupons.map((coupon) => (
            <div key={coupon.id} className="flex items-center gap-4 p-4 hover:bg-muted/30">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <code className="rounded bg-muted px-2 py-0.5 font-mono text-sm">
                    {coupon.code}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => copyCode(coupon.id, coupon.code)}
                  >
                    {copiedId === coupon.id ? (
                      <Check className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                  {!coupon.isActive && <Badge variant="secondary">Inactive</Badge>}
                  {isExpired(coupon.endDate) && <Badge variant="error">Expired</Badge>}
                  {isExhausted(coupon) && <Badge variant="outline">Exhausted</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">
                  {coupon.discountType === 'PERCENTAGE'
                    ? `${coupon.discountValue}% off`
                    : `₱${coupon.discountValue} off`}
                  {coupon.minOrderValue && ` • Min: ₱${coupon.minOrderValue}`}
                  {coupon.maxDiscount && ` • Max: ₱${coupon.maxDiscount}`}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  <Calendar className="inline h-3 w-3 mr-1" />
                  {new Date(coupon.startDate).toLocaleDateString()} - {new Date(coupon.endDate).toLocaleDateString()}
                  <Users className="inline h-3 w-3 ml-2 mr-1" />
                  {coupon.usageCount}{coupon.usageLimit ? `/${coupon.usageLimit}` : ''} used
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditCoupon?.(coupon)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteCoupon(coupon.id)}
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

