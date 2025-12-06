'use client';

/**
 * Low Stock Alerts Component
 * Phase 26.1.1: Real-time Inventory Tracking & Low Stock Alerts
 * 
 * Displays and manages low stock alerts with threshold management,
 * acknowledgement workflow, and notification preferences.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, Bell, BellOff, Check, ChevronRight, 
  Package, RefreshCw, X 
} from 'lucide-react';

// Types for stock alerts
export interface StockAlert {
  id: string;
  variantId: string;
  locationId: string;
  threshold: number;
  isActive: boolean;
  lastTriggered: string | null;
  createdAt: string;
  variant: {
    id: string;
    name: string | null;
    sku: string;
    stockQuantity: number;
    product: { name: string };
  };
  location: { id: string; name: string };
  status: 'active' | 'acknowledged' | 'resolved';
}

interface LowStockAlertsProps {
  className?: string;
  maxItems?: number;
  onViewAll?: () => void;
  onAlertClick?: (alert: StockAlert) => void;
  compact?: boolean;
}

export function LowStockAlerts({
  className,
  maxItems = 5,
  onViewAll,
  onAlertClick,
  compact = false,
}: LowStockAlertsProps) {
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch alerts from API
  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/inventory/alerts?limit=${maxItems}&status=active`);
      if (!response.ok) throw new Error('Failed to fetch alerts');
      
      const data = await response.json();
      setAlerts(data.alerts || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load alerts');
    } finally {
      setLoading(false);
    }
  }, [maxItems]);

  useEffect(() => {
    fetchAlerts();
    // Refresh alerts every 60 seconds
    const interval = setInterval(fetchAlerts, 60000);
    return () => clearInterval(interval);
  }, [fetchAlerts]);

  // Acknowledge an alert
  const handleAcknowledge = async (alertId: string) => {
    try {
      const response = await fetch(`/api/inventory/alerts/${alertId}/acknowledge`, {
        method: 'PATCH',
      });
      if (!response.ok) throw new Error('Failed to acknowledge alert');
      // Refresh alerts after acknowledgement
      fetchAlerts();
    } catch (err) {
      console.error('Error acknowledging alert:', err);
    }
  };

  // Dismiss an alert
  const handleDismiss = async (alertId: string) => {
    try {
      const response = await fetch(`/api/inventory/alerts/${alertId}/dismiss`, {
        method: 'PATCH',
      });
      if (!response.ok) throw new Error('Failed to dismiss alert');
      fetchAlerts();
    } catch (err) {
      console.error('Error dismissing alert:', err);
    }
  };

  // Get severity level based on stock vs threshold
  const getSeverity = (quantity: number, threshold: number): 'critical' | 'warning' | 'low' => {
    if (quantity <= 0) return 'critical';
    if (quantity <= threshold * 0.5) return 'critical';
    if (quantity <= threshold) return 'warning';
    return 'low';
  };

  // Get badge variant based on severity
  const getBadgeVariant = (severity: 'critical' | 'warning' | 'low') => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'warning': return 'warning';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <Card className={cn('p-6', className)}>
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn('p-6', className)}>
        <div className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-warning" />
          <h3 className="font-semibold text-foreground">Low Stock Alerts</h3>
          {alerts.length > 0 && (
            <Badge variant="warning" className="ml-2">{alerts.length}</Badge>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={fetchAlerts}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Alert List */}
      <div className="divide-y divide-border">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <BellOff className="mb-2 h-8 w-8" />
            <p>No active alerts</p>
          </div>
        ) : (
          alerts.map((alert) => {
            const severity = getSeverity(alert.variant?.stockQuantity || 0, alert.threshold);
            return (
              <div
                key={alert.id}
                className={cn(
                  'flex items-center justify-between p-4 transition-colors hover:bg-muted/50',
                  onAlertClick && 'cursor-pointer'
                )}
                onClick={() => onAlertClick?.(alert)}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full',
                    severity === 'critical' && 'bg-destructive/10 text-destructive',
                    severity === 'warning' && 'bg-warning/10 text-warning',
                    severity === 'low' && 'bg-muted text-muted-foreground'
                  )}>
                    <Package className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {alert.variant?.product?.name || 'Unknown Product'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      SKU: {alert.variant?.sku} • {alert.location?.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getBadgeVariant(severity)}>
                    {alert.variant?.stockQuantity || 0} / {alert.threshold}
                  </Badge>
                  {!compact && (
                    <>
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleAcknowledge(alert.id); }}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleDismiss(alert.id); }}>
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer - View All */}
      {onViewAll && alerts.length > 0 && (
        <div className="border-t border-border bg-muted/30 p-3">
          <Button variant="ghost" className="w-full justify-center" onClick={onViewAll}>
            View All Alerts <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}
    </Card>
  );
}

