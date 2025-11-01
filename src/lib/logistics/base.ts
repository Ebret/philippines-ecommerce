/**
 * Base Logistics Provider Interface
 * All logistics providers must implement these methods
 */

export interface ShippingRate {
  provider: string;
  baseRate: number;
  estimatedDays: number;
  description: string;
}

export interface TrackingInfo {
  trackingNumber: string;
  provider: string;
  status: string;
  location?: string;
  lastUpdate: Date;
  estimatedDelivery?: Date;
  events: TrackingEvent[];
}

export interface TrackingEvent {
  timestamp: Date;
  status: string;
  location: string;
  description: string;
}

export interface ShipmentLabel {
  trackingNumber: string;
  provider: string;
  labelUrl: string;
  barcodeUrl: string;
}

export abstract class BaseLogisticsProvider {
  protected apiKey: string;
  protected apiSecret: string;
  protected baseUrl: string;
  protected webhookSecret: string;

  constructor(
    apiKey: string,
    apiSecret: string,
    baseUrl: string,
    webhookSecret: string
  ) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.baseUrl = baseUrl;
    this.webhookSecret = webhookSecret;
  }

  /**
   * Get shipping rates for a destination
   */
  abstract getShippingRates(
    origin: string,
    destination: string,
    weight?: number
  ): Promise<ShippingRate[]>;

  /**
   * Create shipment and get tracking number
   */
  abstract createShipment(
    recipientName: string,
    recipientPhone: string,
    recipientAddress: string,
    weight: number,
    itemDescription: string
  ): Promise<ShipmentLabel>;

  /**
   * Track shipment status
   */
  abstract trackShipment(trackingNumber: string): Promise<TrackingInfo>;

  /**
   * Cancel shipment
   */
  abstract cancelShipment(trackingNumber: string): Promise<boolean>;

  /**
   * Verify webhook signature
   */
  abstract verifyWebhookSignature(
    payload: Record<string, unknown>,
    signature: string
  ): boolean;

  /**
   * Handle webhook payload
   */
  abstract handleWebhook(
    payload: Record<string, unknown>
  ): Promise<TrackingInfo>;
}

