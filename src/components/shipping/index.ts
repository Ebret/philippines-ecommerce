/**
 * Shipping Components Index
 * Phase 25.3: Shipping System Enhancements
 * 
 * Comprehensive shipping management components for Philippines E-Commerce Platform
 * Includes provider selection, address management, tracking, scheduling, and notifications
 */

// Shipping Provider Selector
export {
  ShippingProviderSelector,
  PROVIDER_CONFIG,
  type ShippingProviderType,
  type ShippingRate,
  type ShippingProviderSelectorProps,
} from './shipping-provider-selector';

// Shipping Address Manager
export {
  ShippingAddressManager,
  PHILIPPINES_REGIONS,
  REGION_LABELS,
  ADDRESS_TYPE_ICONS,
  type AddressType,
  type ShippingAddress,
  type ShippingAddressManagerProps,
} from './shipping-address-manager';

// Shipment Tracker
export {
  ShipmentTracker,
  ShipmentStatusBadge,
  STATUS_CONFIG,
  type ShipmentStatusType,
  type TrackingEvent,
  type ShipmentInfo,
  type ShipmentTrackerProps,
  type ShipmentStatusBadgeProps,
} from './shipment-tracker';

// Delivery Scheduler
export {
  DeliveryScheduler,
  TIME_SLOT_CONFIG,
  type TimeSlotType,
  type DeliverySchedule,
  type AvailableSlot,
  type DeliverySchedulerProps,
} from './delivery-scheduler';

// Shipping Notifications
export {
  ShippingNotificationPreferencesPanel,
  ShippingNotificationList,
  CHANNEL_CONFIG,
  EVENT_CONFIG,
  DEFAULT_PREFERENCES,
  type NotificationChannelType,
  type ShippingNotificationEventType,
  type ShippingNotificationPreferences,
  type ShippingNotification,
  type ShippingNotificationPreferencesPanelProps,
  type ShippingNotificationListProps,
} from './shipping-notifications';

// Shipping Cost Calculator
export {
  ShippingCostCalculator,
  calculateShippingCost,
  calculateVolumetricWeight,
  type PackageDimensions,
  type ShippingCostResult,
  type ShippingCostCalculatorProps,
} from './shipping-cost-calculator';

