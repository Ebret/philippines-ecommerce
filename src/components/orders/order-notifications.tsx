'use client';

import React, { useState } from 'react';
import {
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  Check,
  X,
  Settings,
  Send,
  Loader2,
} from 'lucide-react';
import { OrderStatus, PaymentStatus, ShipmentStatus } from './order-status-badge';

// Notification channel types
export type NotificationChannel = 'EMAIL' | 'SMS' | 'IN_APP' | 'PUSH';

// Notification preference interface
export interface OrderNotificationPreferences {
  orderConfirmation: NotificationChannel[];
  orderStatusUpdate: NotificationChannel[];
  paymentConfirmation: NotificationChannel[];
  paymentFailed: NotificationChannel[];
  shipmentUpdate: NotificationChannel[];
  deliveryConfirmation: NotificationChannel[];
  refundProcessed: NotificationChannel[];
  orderCancelled: NotificationChannel[];
}

// Default preferences
const DEFAULT_PREFERENCES: OrderNotificationPreferences = {
  orderConfirmation: ['EMAIL', 'SMS', 'IN_APP'],
  orderStatusUpdate: ['EMAIL', 'IN_APP'],
  paymentConfirmation: ['EMAIL', 'SMS'],
  paymentFailed: ['EMAIL', 'SMS', 'IN_APP'],
  shipmentUpdate: ['EMAIL', 'SMS', 'IN_APP'],
  deliveryConfirmation: ['EMAIL', 'SMS', 'IN_APP'],
  refundProcessed: ['EMAIL', 'SMS'],
  orderCancelled: ['EMAIL', 'IN_APP'],
};

// Notification type labels
const NOTIFICATION_LABELS: Record<keyof OrderNotificationPreferences, { label: string; description: string }> = {
  orderConfirmation: { label: 'Order Confirmation', description: 'When your order is placed successfully' },
  orderStatusUpdate: { label: 'Order Status Updates', description: 'When your order status changes' },
  paymentConfirmation: { label: 'Payment Confirmation', description: 'When payment is received' },
  paymentFailed: { label: 'Payment Failed', description: 'When payment fails or is declined' },
  shipmentUpdate: { label: 'Shipment Updates', description: 'When your order is shipped or in transit' },
  deliveryConfirmation: { label: 'Delivery Confirmation', description: 'When your order is delivered' },
  refundProcessed: { label: 'Refund Processed', description: 'When a refund is processed' },
  orderCancelled: { label: 'Order Cancelled', description: 'When an order is cancelled' },
};

// Channel icons
const CHANNEL_ICONS: Record<NotificationChannel, React.ElementType> = {
  EMAIL: Mail,
  SMS: Smartphone,
  IN_APP: Bell,
  PUSH: MessageSquare,
};

export interface OrderNotificationPreferencesProps {
  preferences?: OrderNotificationPreferences;
  onSave?: (preferences: OrderNotificationPreferences) => Promise<void>;
  isLoading?: boolean;
  className?: string;
}

/**
 * OrderNotificationPreferences - Manage order notification preferences
 */
export function OrderNotificationPreferencesPanel({
  preferences = DEFAULT_PREFERENCES,
  onSave,
  isLoading = false,
  className = '',
}: OrderNotificationPreferencesProps) {
  const [localPreferences, setLocalPreferences] = useState<OrderNotificationPreferences>(preferences);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Toggle channel for a notification type
  const toggleChannel = (type: keyof OrderNotificationPreferences, channel: NotificationChannel) => {
    setLocalPreferences((prev) => {
      const current = prev[type];
      const updated = current.includes(channel)
        ? current.filter((c) => c !== channel)
        : [...current, channel];
      return { ...prev, [type]: updated };
    });
    setSaveSuccess(false);
  };

  // Save preferences
  const handleSave = async () => {
    if (!onSave) return;
    setIsSaving(true);
    try {
      await onSave(localPreferences);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save preferences:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`rounded-lg border border-border bg-card ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Settings className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Order Notifications</h2>
            <p className="text-sm text-muted-foreground">Choose how you want to be notified</p>
          </div>
        </div>
        {onSave && (
          <button
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saveSuccess ? (
              <Check className="w-4 h-4" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {saveSuccess ? 'Saved!' : 'Save'}
          </button>
        )}
      </div>

      {/* Channel Legend */}
      <div className="flex items-center gap-4 p-4 bg-muted/30 border-b border-border">
        {(Object.keys(CHANNEL_ICONS) as NotificationChannel[]).map((channel) => {
          const Icon = CHANNEL_ICONS[channel];
          return (
            <div key={channel} className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Icon className="w-4 h-4" />
              <span>{channel === 'IN_APP' ? 'In-App' : channel}</span>
            </div>
          );
        })}
      </div>

      {/* Notification Types */}
      <div className="divide-y divide-border">
        {(Object.keys(NOTIFICATION_LABELS) as (keyof OrderNotificationPreferences)[]).map((type) => {
          const { label, description } = NOTIFICATION_LABELS[type];
          const enabledChannels = localPreferences[type];

          return (
            <div key={type} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="font-medium text-foreground">{label}</p>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
              <div className="flex items-center gap-2">
                {(Object.keys(CHANNEL_ICONS) as NotificationChannel[]).map((channel) => {
                  const Icon = CHANNEL_ICONS[channel];
                  const isEnabled = enabledChannels.includes(channel);
                  return (
                    <button
                      key={channel}
                      onClick={() => toggleChannel(type, channel)}
                      className={`p-2 rounded-lg border transition-colors ${
                        isEnabled
                          ? 'bg-primary/10 border-primary text-primary'
                          : 'bg-muted/50 border-border text-muted-foreground hover:bg-muted'
                      }`}
                      title={`${isEnabled ? 'Disable' : 'Enable'} ${channel} notifications`}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Order notification item interface
export interface OrderNotificationItem {
  id: string;
  type: keyof OrderNotificationPreferences;
  title: string;
  message: string;
  orderId: string;
  orderNumber: string;
  channel: NotificationChannel;
  isRead: boolean;
  createdAt: string;
}

export interface OrderNotificationListProps {
  notifications: OrderNotificationItem[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onViewOrder?: (orderId: string) => void;
  className?: string;
}

/**
 * OrderNotificationList - Display order-related notifications
 */
export function OrderNotificationList({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onViewOrder,
  className = '',
}: OrderNotificationListProps) {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className={`rounded-lg border border-border bg-card ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Order Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-medium">
              {unreadCount}
            </span>
          )}
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
          <div className="p-8 text-center text-muted-foreground">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const Icon = CHANNEL_ICONS[notification.channel];
            return (
              <div
                key={notification.id}
                className={`p-4 hover:bg-muted/30 transition-colors ${!notification.isRead ? 'bg-primary/5' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${!notification.isRead ? 'bg-primary/10' : 'bg-muted'}`}>
                    <Icon className={`w-4 h-4 ${!notification.isRead ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`font-medium ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {notification.title}
                      </p>
                      {!notification.isRead && onMarkAsRead && (
                        <button
                          onClick={() => onMarkAsRead(notification.id)}
                          className="p-1 rounded hover:bg-muted"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4 text-muted-foreground" />
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{notification.message}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </span>
                      {onViewOrder && (
                        <button
                          onClick={() => onViewOrder(notification.orderId)}
                          className="text-xs text-primary hover:underline"
                        >
                          View Order #{notification.orderNumber}
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

export { DEFAULT_PREFERENCES, NOTIFICATION_LABELS, CHANNEL_ICONS };

