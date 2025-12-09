'use client';

import React from 'react';
import { format } from 'date-fns';
import {
  Clock,
  CheckCircle,
  Truck,
  Package,
  XCircle,
  RotateCcw,
  MapPin,
  CreditCard,
} from 'lucide-react';
import { OrderStatus, ORDER_STATUS_CONFIG } from './order-status-badge';

// Timeline event interface
export interface TimelineEvent {
  id: string;
  status: OrderStatus;
  title: string;
  description?: string;
  timestamp: string;
  location?: string;
  actor?: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface OrderTrackingTimelineProps {
  events: TimelineEvent[];
  currentStatus: OrderStatus;
  showAllSteps?: boolean;
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}

// Default order flow steps
const ORDER_FLOW_STEPS: { status: OrderStatus; title: string }[] = [
  { status: 'PENDING', title: 'Order Placed' },
  { status: 'CONFIRMED', title: 'Order Confirmed' },
  { status: 'PROCESSING', title: 'Processing' },
  { status: 'SHIPPED', title: 'Shipped' },
  { status: 'DELIVERED', title: 'Delivered' },
];

// Status order for determining completion
const STATUS_ORDER: Record<OrderStatus, number> = {
  PENDING: 0,
  CONFIRMED: 1,
  PROCESSING: 2,
  SHIPPED: 3,
  DELIVERED: 4,
  CANCELLED: -1,
  RETURNED: -2,
};

// Icon mapping
const STATUS_ICONS: Record<OrderStatus, React.ElementType> = {
  PENDING: Clock,
  CONFIRMED: CheckCircle,
  PROCESSING: Package,
  SHIPPED: Truck,
  DELIVERED: CheckCircle,
  CANCELLED: XCircle,
  RETURNED: RotateCcw,
};

/**
 * OrderTrackingTimeline - Visual timeline showing order progress
 */
export function OrderTrackingTimeline({
  events,
  currentStatus,
  showAllSteps = true,
  orientation = 'vertical',
  className = '',
}: OrderTrackingTimelineProps) {
  const isCancelled = currentStatus === 'CANCELLED';
  const isReturned = currentStatus === 'RETURNED';
  const currentStatusOrder = STATUS_ORDER[currentStatus];

  // Generate timeline items
  const timelineItems = showAllSteps
    ? ORDER_FLOW_STEPS.map((step) => {
        const event = events.find((e) => e.status === step.status);
        const stepOrder = STATUS_ORDER[step.status];
        const isCompleted = !isCancelled && !isReturned && stepOrder < currentStatusOrder;
        const isCurrent = step.status === currentStatus;

        return {
          id: event?.id || step.status,
          status: step.status,
          title: event?.title || step.title,
          description: event?.description,
          timestamp: event?.timestamp,
          location: event?.location,
          actor: event?.actor,
          isCompleted,
          isCurrent,
        };
      })
    : events;

  // Add cancelled/returned status if applicable
  if (isCancelled) {
    const cancelEvent = events.find((e) => e.status === 'CANCELLED');
    timelineItems.push({
      id: 'cancelled',
      status: 'CANCELLED',
      title: 'Order Cancelled',
      description: cancelEvent?.description,
      timestamp: cancelEvent?.timestamp || new Date().toISOString(),
      location: cancelEvent?.location,
      actor: cancelEvent?.actor,
      isCompleted: false,
      isCurrent: true,
    });
  }

  if (isReturned) {
    const returnEvent = events.find((e) => e.status === 'RETURNED');
    timelineItems.push({
      id: 'returned',
      status: 'RETURNED',
      title: 'Order Returned',
      description: returnEvent?.description,
      timestamp: returnEvent?.timestamp || new Date().toISOString(),
      location: returnEvent?.location,
      actor: returnEvent?.actor,
      isCompleted: false,
      isCurrent: true,
    });
  }

  if (orientation === 'horizontal') {
    return (
      <div className={`w-full overflow-x-auto ${className}`}>
        <div className="flex items-start min-w-max gap-4">
          {timelineItems.map((item, index) => {
            const Icon = STATUS_ICONS[item.status];
            const config = ORDER_STATUS_CONFIG[item.status];
            const isLast = index === timelineItems.length - 1;

            return (
              <div key={item.id} className="flex items-start">
                <div className="flex flex-col items-center">
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      item.isCompleted || item.isCurrent
                        ? `${config.bgColor} ${config.color}`
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  {/* Label */}
                  <div className="mt-2 text-center w-24">
                    <p className={`text-sm font-medium ${item.isCurrent ? config.color : ''}`}>
                      {item.title}
                    </p>
                    {item.timestamp && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {format(new Date(item.timestamp), 'MMM d, h:mm a')}
                      </p>
                    )}
                  </div>
                </div>
                {/* Connector line */}
                {!isLast && (
                  <div className={`w-12 h-0.5 mt-5 mx-1 ${item.isCompleted ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Vertical orientation (default)
  return (
    <div className={`relative ${className}`}>
      {timelineItems.map((item, index) => {
        const Icon = STATUS_ICONS[item.status];
        const config = ORDER_STATUS_CONFIG[item.status];
        const isLast = index === timelineItems.length - 1;

        return (
          <div key={item.id} className="relative flex gap-4 pb-8 last:pb-0">
            {!isLast && (
              <div
                className={`absolute left-5 top-10 w-0.5 h-full -translate-x-1/2 ${
                  item.isCompleted ? 'bg-primary' : 'bg-muted'
                }`}
              />
            )}
            <div
              className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                item.isCompleted || item.isCurrent
                  ? `${config.bgColor} ${config.color}`
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-medium ${item.isCurrent ? config.color : 'text-foreground'}`}>
                {item.title}
              </p>
              {item.description && (
                <p className="text-sm text-muted-foreground mt-0.5">{item.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-muted-foreground">
                {item.timestamp && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {format(new Date(item.timestamp), 'MMM d, yyyy h:mm a')}
                  </span>
                )}
                {item.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {item.location}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export { ORDER_FLOW_STEPS, STATUS_ORDER, STATUS_ICONS };