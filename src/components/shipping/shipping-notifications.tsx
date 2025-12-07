'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  Check,
  Package,
  Truck,
  MapPin,
  CheckCircle,
  AlertCircle,
  Clock,
  Settings,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ShipmentStatusType, STATUS_CONFIG } from './shipment-tracker';

// Notification channel type
export type NotificationChannelType = 'EMAIL' | 'SMS' | 'PUSH' | 'IN_APP';

// Notification event type
export type ShippingNotificationEventType = 
  | 'ORDER_CONFIRMED'
  | 'PREPARING_SHIPMENT'
  | 'SHIPPED'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'DELIVERY_FAILED'
  | 'DELIVERY_RESCHEDULED';

// Channel configuration
const CHANNEL_CONFIG: Record<NotificationChannelType, { label: string; icon: React.ElementType; description: string }> = {
  EMAIL: { label: 'Email', icon: Mail, description: 'Receive detailed updates via email' },
  SMS: { label: 'SMS', icon: MessageSquare, description: 'Get text message alerts' },
  PUSH: { label: 'Push', icon: Smartphone, description: 'Mobile app notifications' },
  IN_APP: { label: 'In-App', icon: Bell, description: 'Notifications in your account' },
};

// Event configuration
const EVENT_CONFIG: Record<ShippingNotificationEventType, { label: string; description: string; icon: React.ElementType }> = {
  ORDER_CONFIRMED: { label: 'Order Confirmed', description: 'When your order is confirmed', icon: Check },
  PREPARING_SHIPMENT: { label: 'Preparing Shipment', description: 'When seller starts packing', icon: Package },
  SHIPPED: { label: 'Shipped', description: 'When order is handed to courier', icon: Truck },
  IN_TRANSIT: { label: 'In Transit', description: 'Updates during delivery', icon: Truck },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery', description: 'When courier is on the way', icon: MapPin },
  DELIVERED: { label: 'Delivered', description: 'When order is delivered', icon: CheckCircle },
  DELIVERY_FAILED: { label: 'Delivery Failed', description: 'If delivery attempt fails', icon: AlertCircle },
  DELIVERY_RESCHEDULED: { label: 'Rescheduled', description: 'When delivery is rescheduled', icon: Clock },
};

// Notification preferences interface
export interface ShippingNotificationPreferences {
  channels: NotificationChannelType[];
  events: ShippingNotificationEventType[];
  quietHoursEnabled: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
}

// Shipping notification interface
export interface ShippingNotification {
  id: string;
  orderId: string;
  orderNumber: string;
  event: ShippingNotificationEventType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  trackingNumber?: string;
  courierName?: string;
}

// Default preferences
const DEFAULT_PREFERENCES: ShippingNotificationPreferences = {
  channels: ['EMAIL', 'IN_APP'],
  events: ['ORDER_CONFIRMED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'DELIVERY_FAILED'],
  quietHoursEnabled: false,
};

export interface ShippingNotificationPreferencesPanelProps {
  preferences?: ShippingNotificationPreferences;
  onSave: (preferences: ShippingNotificationPreferences) => void;
  isLoading?: boolean;
  className?: string;
}

/**
 * ShippingNotificationPreferencesPanel - Manage shipping notification preferences
 */
export function ShippingNotificationPreferencesPanel({
  preferences = DEFAULT_PREFERENCES,
  onSave,
  isLoading = false,
  className = '',
}: ShippingNotificationPreferencesPanelProps) {
  const [localPrefs, setLocalPrefs] = useState(preferences);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Toggle channel
  const toggleChannel = (channel: NotificationChannelType) => {
    const newChannels = localPrefs.channels.includes(channel)
      ? localPrefs.channels.filter(c => c !== channel)
      : [...localPrefs.channels, channel];
    setLocalPrefs({ ...localPrefs, channels: newChannels });
  };

  // Toggle event
  const toggleEvent = (event: ShippingNotificationEventType) => {
    const newEvents = localPrefs.events.includes(event)
      ? localPrefs.events.filter(e => e !== event)
      : [...localPrefs.events, event];
    setLocalPrefs({ ...localPrefs, events: newEvents });
  };

  return (
    <div className={`rounded-lg border border-border bg-card ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Bell className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Shipping Notifications</h3>
          <p className="text-sm text-muted-foreground">Choose how you want to be notified</p>
        </div>
      </div>

      {/* Channels */}
      <div className="p-4 border-b border-border">
        <h4 className="font-medium text-foreground mb-3">Notification Channels</h4>
        <div className="grid grid-cols-2 gap-3">
          {(Object.entries(CHANNEL_CONFIG) as [NotificationChannelType, typeof CHANNEL_CONFIG[NotificationChannelType]][]).map(([channel, config]) => {
            const Icon = config.icon;
            const isEnabled = localPrefs.channels.includes(channel);

            return (
              <button
                key={channel}
                onClick={() => toggleChannel(channel)}
                className={`p-3 rounded-lg border transition-colors text-left ${
                  isEnabled ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-4 h-4 ${isEnabled ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="font-medium text-foreground">{config.label}</span>
                  {isEnabled && <Check className="w-4 h-4 text-primary ml-auto" />}
                </div>
                <p className="text-xs text-muted-foreground">{config.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Events */}
      <div className="p-4 border-b border-border">
        <h4 className="font-medium text-foreground mb-3">Notification Events</h4>
        <div className="space-y-2">
          {(Object.entries(EVENT_CONFIG) as [ShippingNotificationEventType, typeof EVENT_CONFIG[ShippingNotificationEventType]][]).map(([event, config]) => {
            const Icon = config.icon;
            const isEnabled = localPrefs.events.includes(event);

            return (
              <label
                key={event}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={() => toggleEvent(event)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <Icon className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1">
                  <span className="text-sm font-medium text-foreground">{config.label}</span>
                  <p className="text-xs text-muted-foreground">{config.description}</p>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="p-4 border-b border-border">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm font-medium text-foreground"
        >
          <Settings className="w-4 h-4" />
          Advanced Settings
          {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showAdvanced && (
          <div className="mt-4 space-y-4">
            {/* Quiet Hours */}
            <div>
              <label className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={localPrefs.quietHoursEnabled}
                  onChange={(e) => setLocalPrefs({ ...localPrefs, quietHoursEnabled: e.target.checked })}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-foreground">Enable Quiet Hours</span>
              </label>
              {localPrefs.quietHoursEnabled && (
                <div className="flex items-center gap-2 ml-6">
                  <input
                    type="time"
                    value={localPrefs.quietHoursStart || '22:00'}
                    onChange={(e) => setLocalPrefs({ ...localPrefs, quietHoursStart: e.target.value })}
                    className="px-2 py-1 rounded border border-border bg-background text-foreground text-sm"
                  />
                  <span className="text-sm text-muted-foreground">to</span>
                  <input
                    type="time"
                    value={localPrefs.quietHoursEnd || '08:00'}
                    onChange={(e) => setLocalPrefs({ ...localPrefs, quietHoursEnd: e.target.value })}
                    className="px-2 py-1 rounded border border-border bg-background text-foreground text-sm"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="p-4">
        <button
          onClick={() => onSave(localPrefs)}
          disabled={isLoading}
          className="w-full py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
}

export interface ShippingNotificationListProps {
  notifications: ShippingNotification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onViewOrder?: (orderId: string) => void;
  onTrackShipment?: (trackingNumber: string) => void;
  className?: string;
}

/**
 * ShippingNotificationList - Display shipping notifications
 */
export function ShippingNotificationList({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onViewOrder,
  onTrackShipment,
  className = '',
}: ShippingNotificationListProps) {
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className={`rounded-lg border border-border bg-card ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Truck className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Shipping Updates</h3>
            <p className="text-sm text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
            </p>
          </div>
        </div>
        {unreadCount > 0 && onMarkAllAsRead && (
          <button
            onClick={onMarkAllAsRead}
            className="text-sm text-primary hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications */}
      <div className="divide-y divide-border max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Truck className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No shipping updates yet</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const eventConfig = EVENT_CONFIG[notification.event];
            const Icon = eventConfig?.icon || Package;

            return (
              <div
                key={notification.id}
                className={`p-4 transition-colors ${!notification.isRead ? 'bg-primary/5' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    !notification.isRead ? 'bg-primary/10' : 'bg-muted'
                  }`}>
                    <Icon className={`w-4 h-4 ${!notification.isRead ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground">{notification.title}</span>
                      {!notification.isRead && (
                        <span className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span>{format(new Date(notification.timestamp), 'MMM d, h:mm a')}</span>
                      <span>Order #{notification.orderNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {onViewOrder && (
                        <button
                          onClick={() => onViewOrder(notification.orderId)}
                          className="text-xs text-primary hover:underline"
                        >
                          View Order
                        </button>
                      )}
                      {notification.trackingNumber && onTrackShipment && (
                        <button
                          onClick={() => onTrackShipment(notification.trackingNumber!)}
                          className="text-xs text-primary hover:underline"
                        >
                          Track Shipment
                        </button>
                      )}
                      {!notification.isRead && onMarkAsRead && (
                        <button
                          onClick={() => onMarkAsRead(notification.id)}
                          className="text-xs text-muted-foreground hover:text-foreground"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export { CHANNEL_CONFIG, EVENT_CONFIG, DEFAULT_PREFERENCES };

