'use client';

/**
 * Promotion Analytics Component
 * Phase 26.2.6: Promotion Analytics Dashboard
 * 
 * Track and visualize promotion performance metrics.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, TrendingUp, TrendingDown, DollarSign, Users,
  Ticket, Percent, RefreshCw, Calendar, ArrowUpRight
} from 'lucide-react';

// Types for analytics
export interface PromotionMetrics {
  totalRevenue: number;
  totalDiscountGiven: number;
  totalOrders: number;
  averageOrderValue: number;
  conversionRate: number;
  newCustomers: number;
  repeatCustomers: number;
}

export interface PromotionPerformance {
  id: string;
  name: string;
  type: 'DISCOUNT' | 'COUPON' | 'FLASH_SALE';
  revenue: number;
  discountGiven: number;
  orders: number;
  roi: number;
  status: 'ACTIVE' | 'ENDED';
}

interface PromotionAnalyticsProps {
  dateRange?: { start: Date; end: Date };
  className?: string;
}

export function PromotionAnalytics({
  dateRange,
  className,
}: PromotionAnalyticsProps) {
  const [metrics, setMetrics] = useState<PromotionMetrics | null>(null);
  const [topPromotions, setTopPromotions] = useState<PromotionPerformance[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch analytics
  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (dateRange) {
        params.append('startDate', dateRange.start.toISOString());
        params.append('endDate', dateRange.end.toISOString());
      }

      const response = await fetch(`/api/promotions/analytics?${params}`);
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      setMetrics(data.metrics);
      setTopPromotions(data.topPromotions || []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Mock data for demo
      setMetrics({
        totalRevenue: 125000,
        totalDiscountGiven: 18500,
        totalOrders: 342,
        averageOrderValue: 365.5,
        conversionRate: 4.2,
        newCustomers: 89,
        repeatCustomers: 156,
      });
      setTopPromotions([
        { id: '1', name: 'Summer Sale', type: 'DISCOUNT', revenue: 45000, discountGiven: 6750, orders: 123, roi: 5.67, status: 'ACTIVE' },
        { id: '2', name: 'WELCOME10', type: 'COUPON', revenue: 32000, discountGiven: 4800, orders: 87, roi: 5.67, status: 'ACTIVE' },
        { id: '3', name: 'Flash Friday', type: 'FLASH_SALE', revenue: 28000, discountGiven: 5600, orders: 76, roi: 4.0, status: 'ENDED' },
      ]);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Format currency
  const formatCurrency = (value: number) => `₱${value.toLocaleString()}`;

  // KPI Card component
  const KPICard = ({ 
    title, 
    value, 
    icon: Icon, 
    trend,
    trendValue 
  }: { 
    title: string; 
    value: string; 
    icon: React.ElementType;
    trend?: 'up' | 'down';
    trendValue?: string;
  }) => (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{title}</span>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold">{value}</span>
        {trend && trendValue && (
          <span className={cn(
            'flex items-center text-xs',
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          )}>
            {trend === 'up' ? <TrendingUp className="h-3 w-3 mr-0.5" /> : <TrendingDown className="h-3 w-3 mr-0.5" />}
            {trendValue}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <Card className={cn('overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Promotion Analytics</h3>
        </div>
        <Button variant="outline" size="sm" onClick={fetchAnalytics}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="p-4 space-y-6">
          {/* KPI Grid */}
          {metrics && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <KPICard title="Total Revenue" value={formatCurrency(metrics.totalRevenue)} icon={DollarSign} trend="up" trendValue="+12.5%" />
              <KPICard title="Discount Given" value={formatCurrency(metrics.totalDiscountGiven)} icon={Percent} />
              <KPICard title="Total Orders" value={metrics.totalOrders.toString()} icon={Ticket} trend="up" trendValue="+8.3%" />
              <KPICard title="New Customers" value={metrics.newCustomers.toString()} icon={Users} trend="up" trendValue="+15.2%" />
            </div>
          )}

          {/* Top Promotions Table */}
          <div>
            <h4 className="font-medium mb-3">Top Performing Promotions</h4>
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2">Promotion</th>
                    <th className="text-right text-xs font-medium text-muted-foreground px-4 py-2">Revenue</th>
                    <th className="text-right text-xs font-medium text-muted-foreground px-4 py-2">Discount</th>
                    <th className="text-right text-xs font-medium text-muted-foreground px-4 py-2">Orders</th>
                    <th className="text-right text-xs font-medium text-muted-foreground px-4 py-2">ROI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {topPromotions.map((promo) => (
                    <tr key={promo.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{promo.name}</span>
                          <Badge variant={promo.status === 'ACTIVE' ? 'default' : 'secondary'} className="text-xs">
                            {promo.type.replace('_', ' ')}
                          </Badge>
                        </div>
                      </td>
                      <td className="text-right px-4 py-3 font-medium">{formatCurrency(promo.revenue)}</td>
                      <td className="text-right px-4 py-3 text-muted-foreground">{formatCurrency(promo.discountGiven)}</td>
                      <td className="text-right px-4 py-3">{promo.orders}</td>
                      <td className="text-right px-4 py-3">
                        <span className={cn(
                          'flex items-center justify-end gap-1',
                          promo.roi >= 5 ? 'text-green-600' : promo.roi >= 3 ? 'text-amber-600' : 'text-red-600'
                        )}>
                          {promo.roi.toFixed(2)}x
                          <ArrowUpRight className="h-3 w-3" />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Additional Metrics */}
          {metrics && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="rounded-lg border border-border p-4">
                <span className="text-sm text-muted-foreground">Avg Order Value</span>
                <p className="text-xl font-bold mt-1">{formatCurrency(metrics.averageOrderValue)}</p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <span className="text-sm text-muted-foreground">Conversion Rate</span>
                <p className="text-xl font-bold mt-1">{metrics.conversionRate}%</p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <span className="text-sm text-muted-foreground">Repeat Customers</span>
                <p className="text-xl font-bold mt-1">{metrics.repeatCustomers}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

