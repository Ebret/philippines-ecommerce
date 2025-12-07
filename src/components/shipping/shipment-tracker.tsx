'use client';

import React from 'react';
import { format } from 'date-fns';
import {
  Package,
  Truck,
  MapPin,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Copy,
  Phone,
} from 'lucide-react';
import { ShippingProviderType, PROVIDER_CONFIG } from './shipping-provider-selector';

// Shipment status type
export type ShipmentStatusType = 'PREPARING' | 'PICKED_UP' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'FAILED_DELIVERY' | 'RETURNED';

// Status configuration
const STATUS_CONFIG: Record<ShipmentStatusType, { label: string; color: string; bgColor: string; icon: React.ElementType }> = {
  PREPARING: { label: 'Preparing', color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-100 dark:bg-amber-900/30', icon: Package },
  PICKED_UP: { label: 'Picked Up', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30', icon: Truck },
  IN_TRANSIT: { label: 'In Transit', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30', icon: Truck },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery', color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-100 dark:bg-purple-900/30', icon: MapPin },
  DELIVERED: { label: 'Delivered', color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900/30', icon: CheckCircle },
  FAILED_DELIVERY: { label: 'Failed Delivery', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900/30', icon: AlertCircle },
  RETURNED: { label: 'Returned', color: 'text-gray-600 dark:text-gray-400', bgColor: 'bg-gray-100 dark:bg-gray-900/30', icon: RefreshCw },
};

// Tracking event interface
export interface TrackingEvent {
  id: string;
  status: ShipmentStatusType;
  description: string;
  location?: string;
  timestamp: string;
}

// Shipment info interface
export interface ShipmentInfo {
  trackingNumber: string;
  provider: ShippingProviderType;
  status: ShipmentStatusType;
  estimatedDelivery?: string;
  actualDelivery?: string;
  recipientName: string;
  recipientPhone: string;
  deliveryAddress: string;
  events: TrackingEvent[];
  courierName?: string;
  courierPhone?: string;
}

export interface ShipmentStatusBadgeProps {
  status: ShipmentStatusType;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

/**
 * ShipmentStatusBadge - Display shipment status with color and icon
 */
export function ShipmentStatusBadge({
  status,
  size = 'md',
  showIcon = true,
  className = '',
}: ShipmentStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  const sizeConfig = {
    sm: { badge: 'px-2 py-0.5 text-xs', icon: 'w-3 h-3' },
    md: { badge: 'px-2.5 py-1 text-sm', icon: 'w-4 h-4' },
    lg: { badge: 'px-3 py-1.5 text-base', icon: 'w-5 h-5' },
  }[size];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.bgColor} ${config.color} ${sizeConfig.badge} ${className}`}>
      {showIcon && <Icon className={sizeConfig.icon} />}
      {config.label}
    </span>
  );
}

export interface ShipmentTrackerProps {
  shipment: ShipmentInfo;
  onRefresh?: () => void;
  onCopyTracking?: (trackingNumber: string) => void;
  onContactCourier?: () => void;
  isLoading?: boolean;
  className?: string;
}

/**
 * ShipmentTracker - Track shipment with timeline
 */
export function ShipmentTracker({
  shipment,
  onRefresh,
  onCopyTracking,
  onContactCourier,
  isLoading = false,
  className = '',
}: ShipmentTrackerProps) {
  const providerConfig = PROVIDER_CONFIG[shipment.provider];

  // Copy tracking number
  const handleCopyTracking = () => {
    navigator.clipboard.writeText(shipment.trackingNumber);
    onCopyTracking?.(shipment.trackingNumber);
  };

  return (
    <div className={`rounded-lg border border-border bg-card ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${providerConfig.color} flex items-center justify-center text-xl`}>
              {providerConfig.logo}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{providerConfig.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-mono">{shipment.trackingNumber}</span>
                <button onClick={handleCopyTracking} className="p-1 hover:bg-muted rounded" title="Copy">
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ShipmentStatusBadge status={shipment.status} />
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isLoading}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 text-muted-foreground ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Delivery Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Estimated Delivery</span>
            <p className="font-medium text-foreground">
              {shipment.estimatedDelivery ? format(new Date(shipment.estimatedDelivery), 'MMM d, yyyy') : 'Calculating...'}
            </p>
          </div>
          {shipment.actualDelivery && (
            <div>
              <span className="text-muted-foreground">Delivered On</span>
              <p className="font-medium text-green-600 dark:text-green-400">
                {format(new Date(shipment.actualDelivery), 'MMM d, yyyy h:mm a')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tracking Timeline */}
      <div className="p-4">
        <h4 className="font-medium text-foreground mb-4">Tracking History</h4>
        <div className="space-y-0">
          {shipment.events.map((event, index) => {
            const config = STATUS_CONFIG[event.status];
            const Icon = config.icon;
            const isFirst = index === 0;
            const isLast = index === shipment.events.length - 1;

            return (
              <div key={event.id} className="flex gap-4">
                {/* Timeline Line */}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full ${isFirst ? config.bgColor : 'bg-muted'} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${isFirst ? config.color : 'text-muted-foreground'}`} />
                  </div>
                  {!isLast && <div className="w-0.5 h-full min-h-[40px] bg-border" />}
                </div>

                {/* Event Content */}
                <div className={`pb-6 ${isLast ? 'pb-0' : ''}`}>
                  <p className={`font-medium ${isFirst ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {event.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Clock className="w-3 h-3" />
                    <span>{format(new Date(event.timestamp), 'MMM d, yyyy h:mm a')}</span>
                    {event.location && (
                      <>
                        <span>•</span>
                        <MapPin className="w-3 h-3" />
                        <span>{event.location}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Courier Contact */}
      {shipment.courierName && (
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Courier</p>
              <p className="font-medium text-foreground">{shipment.courierName}</p>
              {shipment.courierPhone && (
                <p className="text-sm text-muted-foreground">{shipment.courierPhone}</p>
              )}
            </div>
            {onContactCourier && shipment.courierPhone && (
              <button
                onClick={onContactCourier}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Phone className="w-4 h-4" />
                Contact
              </button>
            )}
          </div>
        </div>
      )}

      {/* Delivery Address */}
      <div className="p-4 border-t border-border">
        <h4 className="font-medium text-foreground mb-2">Delivery Address</h4>
        <p className="text-sm text-foreground">{shipment.recipientName}</p>
        <p className="text-sm text-muted-foreground">{shipment.recipientPhone}</p>
        <p className="text-sm text-muted-foreground mt-1">{shipment.deliveryAddress}</p>
      </div>
    </div>
  );
}

export { STATUS_CONFIG };

