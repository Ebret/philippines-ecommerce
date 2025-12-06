'use client';

/**
 * Flash Sale Manager Component
 * Phase 26.2.3: Flash Sale System
 * 
 * Manage time-limited flash sales with countdown timers.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Zap, Plus, Search, Clock, Package, RefreshCw,
  Play, Pause, Trash2, Edit, AlertTriangle
} from 'lucide-react';

// Types for flash sales
export interface FlashSale {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  originalPrice: number;
  salePrice: number;
  discountPercent: number;
  stockLimit: number;
  soldCount: number;
  startTime: string;
  endTime: string;
  status: 'SCHEDULED' | 'ACTIVE' | 'ENDED' | 'CANCELLED';
}

interface FlashSaleManagerProps {
  onCreateSale?: () => void;
  onEditSale?: (sale: FlashSale) => void;
  className?: string;
}

export function FlashSaleManager({
  onCreateSale,
  onEditSale,
  className,
}: FlashSaleManagerProps) {
  const [sales, setSales] = useState<FlashSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'active' | 'ended'>('all');

  // Fetch flash sales
  const fetchSales = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('status', filter.toUpperCase());

      const response = await fetch(`/api/flash-sales?${params}`);
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      setSales(data.sales || []);
    } catch (error) {
      console.error('Error fetching flash sales:', error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchSales();
    // Refresh every minute for countdown updates
    const interval = setInterval(fetchSales, 60000);
    return () => clearInterval(interval);
  }, [fetchSales]);

  // Calculate time remaining
  const getTimeRemaining = (endTime: string) => {
    const diff = new Date(endTime).getTime() - Date.now();
    if (diff <= 0) return 'Ended';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) return `${Math.floor(hours / 24)}d ${hours % 24}h`;
    return `${hours}h ${minutes}m`;
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      SCHEDULED: 'bg-blue-500/10 text-blue-600',
      ACTIVE: 'bg-green-500/10 text-green-600',
      ENDED: 'bg-gray-500/10 text-gray-600',
      CANCELLED: 'bg-red-500/10 text-red-600',
    };
    return <Badge className={variants[status] || ''}>{status}</Badge>;
  };

  // Toggle sale status
  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'CANCELLED' : 'ACTIVE';
    try {
      await fetch(`/api/flash-sales/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchSales();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  // Filter sales
  const filteredSales = sales.filter(s => {
    if (filter === 'all') return true;
    return s.status.toLowerCase() === filter;
  });

  return (
    <Card className={cn('overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-amber-500" />
          <h3 className="font-semibold text-foreground">Flash Sales</h3>
        </div>
        <Button onClick={onCreateSale} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Create Sale
        </Button>
      </div>

      {/* Filters */}
      <div className="border-b border-border p-4">
        <div className="flex gap-2">
          {(['all', 'scheduled', 'active', 'ended'] as const).map((f) => (
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

      {/* Flash Sale List */}
      <div className="divide-y divide-border">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filteredSales.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Zap className="mb-2 h-8 w-8" />
            <p>No flash sales found</p>
          </div>
        ) : (
          filteredSales.map((sale) => (
            <div key={sale.id} className="flex items-center gap-4 p-4 hover:bg-muted/30">
              {/* Product Image */}
              <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center">
                {sale.productImage ? (
                  <img src={sale.productImage} alt={sale.productName} className="h-full w-full object-cover rounded-lg" />
                ) : (
                  <Package className="h-8 w-8 text-muted-foreground" />
                )}
              </div>

              {/* Sale Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium truncate">{sale.productName}</span>
                  {getStatusBadge(sale.status)}
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-muted-foreground line-through">₱{sale.originalPrice}</span>
                  <span className="font-semibold text-primary">₱{sale.salePrice}</span>
                  <Badge variant="secondary">-{sale.discountPercent}%</Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                  <span>
                    <Clock className="inline h-3 w-3 mr-1" />
                    {sale.status === 'ACTIVE' ? getTimeRemaining(sale.endTime) :
                     sale.status === 'SCHEDULED' ? `Starts ${new Date(sale.startTime).toLocaleString()}` :
                     'Ended'}
                  </span>
                  <span>
                    <Package className="inline h-3 w-3 mr-1" />
                    {sale.soldCount}/{sale.stockLimit} sold
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-24">
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${(sale.soldCount / sale.stockLimit) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-center text-muted-foreground mt-1">
                  {Math.round((sale.soldCount / sale.stockLimit) * 100)}% sold
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {sale.status === 'ACTIVE' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleStatus(sale.id, sale.status)}
                  >
                    <Pause className="h-4 w-4" />
                  </Button>
                )}
                {sale.status === 'SCHEDULED' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleStatus(sale.id, sale.status)}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditSale?.(sale)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

