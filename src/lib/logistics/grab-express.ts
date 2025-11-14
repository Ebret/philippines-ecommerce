import { BaseLogisticsProvider, ShippingRate, TrackingInfo, ShipmentLabel } from "./base";

/**
 * Grab Express Provider Implementation
 * On-demand delivery service by Grab for Philippines e-commerce
 * Provides same-day delivery with real-time tracking
 */
export class GrabExpressProvider extends BaseLogisticsProvider {
  constructor(apiKey: string, apiSecret: string, webhookSecret: string) {
    super(apiKey, apiSecret, "https://api.grab.com/grabexpress/v1", webhookSecret);
  }

  async getShippingRates(
    origin: string,
    destination: string,
    weight: number = 1
  ): Promise<ShippingRate[]> {
    // Mock implementation - distance-based pricing for on-demand delivery
    const rates: ShippingRate[] = [
      {
        provider: "GRAB",
        baseRate: 160,
        estimatedDays: 0.083, // ~2 hours
        description: "Grab Express - Same Day (1-2 Hours)",
      },
      {
        provider: "GRAB",
        baseRate: 220,
        estimatedDays: 0.167, // ~4 hours
        description: "Grab Express - Same Day (2-4 Hours)",
      },
    ];

    return rates;
  }

  async createShipment(
    recipientName: string,
    recipientPhone: string,
    recipientAddress: string,
    weight: number,
    itemDescription: string
  ): Promise<ShipmentLabel> {
    // Mock implementation
    const trackingNumber = `GRB${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    return {
      trackingNumber,
      provider: "GRAB",
      labelUrl: `https://mock-grab.com/label/${trackingNumber}`,
      barcodeUrl: `https://mock-grab.com/barcode/${trackingNumber}`,
    };
  }

  async trackShipment(trackingNumber: string): Promise<TrackingInfo> {
    // Mock implementation
    return {
      trackingNumber,
      provider: "GRAB",
      status: "ACCEPTED",
      lastUpdate: new Date(),
      location: "Driver assigned and heading to pickup",
      estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes
      events: [
        {
          timestamp: new Date(),
          status: "ACCEPTED",
          location: "Driver assigned and heading to pickup",
          description: "Driver has accepted the delivery",
        },
      ],
    };
  }

  async cancelShipment(trackingNumber: string): Promise<boolean> {
    // Mock implementation
    return true;
  }

  verifyWebhookSignature(
    payload: Record<string, unknown>,
    signature: string
  ): boolean {
    // Mock implementation
    return signature === this.webhookSecret;
  }

  async handleWebhook(payload: Record<string, unknown>): Promise<TrackingInfo> {
    // Mock implementation
    return {
      trackingNumber: (payload.trackingNumber as string) || "UNKNOWN",
      provider: "GRAB",
      status: (payload.status as string) || "PENDING",
      lastUpdate: new Date(),
      location: (payload.location as string) || "In Transit",
      estimatedDelivery: new Date(),
      events: [],
    };
  }
}

