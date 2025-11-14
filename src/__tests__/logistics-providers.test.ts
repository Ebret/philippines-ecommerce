import { describe, it, expect, beforeEach } from "vitest";
import { JTExpressProvider } from "@/lib/logistics/jt-express";
import { LalamoveProvider } from "@/lib/logistics/lalamove";
import { GrabExpressProvider } from "@/lib/logistics/grab-express";
import { MoveItProvider } from "@/lib/logistics/moveit";
import { LogisticsFactory } from "@/lib/logistics/factory";
import { calculateShippingFee, getShippingProviderName, getEstimatedDeliveryDays } from "@/lib/cart-utils";
import { Decimal } from "@prisma/client/runtime/library";

describe("J&T Express Provider", () => {
  let provider: JTExpressProvider;

  beforeEach(() => {
    provider = new JTExpressProvider("test-key", "test-secret", "test-webhook");
  });

  it("should get J&T Express shipping rates", async () => {
    const rates = await provider.getShippingRates("Manila", "Cebu");
    expect(rates).toHaveLength(3);
    expect(rates[0].provider).toBe("JT_EXPRESS");
    expect(rates[0].baseRate).toBeGreaterThan(0);
    expect(rates[0].estimatedDays).toBeGreaterThan(0);
  });

  it("should create J&T Express shipment", async () => {
    const shipment = await provider.createShipment("John Doe", "09123456789", "123 Main St", 1, "Test Item");
    expect(shipment.trackingNumber).toMatch(/^JT/);
    expect(shipment.provider).toBe("JT_EXPRESS");
    expect(shipment.labelUrl).toBeDefined();
    expect(shipment.barcodeUrl).toBeDefined();
  });

  it("should track J&T Express shipment", async () => {
    const tracking = await provider.trackShipment("JT123456789");
    expect(tracking.trackingNumber).toBe("JT123456789");
    expect(tracking.status).toBeDefined();
    expect(tracking.location).toBeDefined();
  });

  it("should cancel J&T Express shipment", async () => {
    const result = await provider.cancelShipment("JT123456789");
    expect(result).toBe(true);
  });
});

describe("Lalamove Provider", () => {
  let provider: LalamoveProvider;

  beforeEach(() => {
    provider = new LalamoveProvider("test-key", "test-secret", "test-webhook");
  });

  it("should get Lalamove shipping rates", async () => {
    const rates = await provider.getShippingRates("Manila", "Makati");
    expect(rates).toHaveLength(2);
    expect(rates[0].provider).toBe("LALAMOVE");
    expect(rates[0].estimatedDays).toBeLessThan(1); // Same day delivery
  });

  it("should create Lalamove shipment", async () => {
    const shipment = await provider.createShipment("Jane Doe", "09987654321", "456 Oak Ave", 1, "Package");
    expect(shipment.trackingNumber).toMatch(/^LLM/);
    expect(shipment.provider).toBe("LALAMOVE");
    expect(shipment.labelUrl).toBeDefined();
    expect(shipment.barcodeUrl).toBeDefined();
  });

  it("should track Lalamove shipment", async () => {
    const tracking = await provider.trackShipment("LLM123456789");
    expect(tracking.status).toBe("PICKING_UP");
    expect(tracking.location).toBeDefined();
  });
});

describe("Grab Express Provider", () => {
  let provider: GrabExpressProvider;

  beforeEach(() => {
    provider = new GrabExpressProvider("test-key", "test-secret", "test-webhook");
  });

  it("should get Grab Express shipping rates", async () => {
    const rates = await provider.getShippingRates("Manila", "Pasig");
    expect(rates).toHaveLength(2);
    expect(rates[0].provider).toBe("GRAB");
    expect(rates[0].baseRate).toBeGreaterThan(0);
  });

  it("should create Grab Express shipment", async () => {
    const shipment = await provider.createShipment("Bob Smith", "09111111111", "789 Pine Rd", 1, "Item");
    expect(shipment.trackingNumber).toMatch(/^GRB/);
    expect(shipment.provider).toBe("GRAB");
    expect(shipment.labelUrl).toBeDefined();
    expect(shipment.barcodeUrl).toBeDefined();
  });

  it("should track Grab Express shipment", async () => {
    const tracking = await provider.trackShipment("GRB123456789");
    expect(tracking.status).toBe("ACCEPTED");
  });
});

describe("MoveIt Provider", () => {
  let provider: MoveItProvider;

  beforeEach(() => {
    provider = new MoveItProvider("test-key", "test-secret", "test-webhook");
  });

  it("should get MoveIt shipping rates", async () => {
    const rates = await provider.getShippingRates("Manila", "Quezon City");
    expect(rates).toHaveLength(2);
    expect(rates[0].provider).toBe("MOVEIT");
  });

  it("should create MoveIt shipment", async () => {
    const shipment = await provider.createShipment("Alice Johnson", "09222222222", "321 Elm St", 1, "Box");
    expect(shipment.trackingNumber).toMatch(/^MVT/);
    expect(shipment.provider).toBe("MOVEIT");
    expect(shipment.labelUrl).toBeDefined();
    expect(shipment.barcodeUrl).toBeDefined();
  });

  it("should track MoveIt shipment", async () => {
    const tracking = await provider.trackShipment("MVT123456789");
    expect(tracking.status).toBe("OUT_FOR_DELIVERY");
  });
});

describe("Logistics Factory", () => {
  it("should get J&T Express provider", () => {
    const provider = LogisticsFactory.getProvider("JT_EXPRESS");
    expect(provider).toBeDefined();
    expect(provider).toBeInstanceOf(JTExpressProvider);
  });

  it("should get Lalamove provider", () => {
    const provider = LogisticsFactory.getProvider("LALAMOVE");
    expect(provider).toBeDefined();
    expect(provider).toBeInstanceOf(LalamoveProvider);
  });

  it("should get Grab Express provider", () => {
    const provider = LogisticsFactory.getProvider("GRAB");
    expect(provider).toBeDefined();
    expect(provider).toBeInstanceOf(GrabExpressProvider);
  });

  it("should get MoveIt provider", () => {
    const provider = LogisticsFactory.getProvider("MOVEIT");
    expect(provider).toBeDefined();
    expect(provider).toBeInstanceOf(MoveItProvider);
  });

  it("should throw error for unknown provider", () => {
    expect(() => LogisticsFactory.getProvider("UNKNOWN")).toThrow();
  });

  it("should check if provider exists", () => {
    expect(LogisticsFactory.hasProvider("JT_EXPRESS")).toBe(true);
    expect(LogisticsFactory.hasProvider("LALAMOVE")).toBe(true);
    expect(LogisticsFactory.hasProvider("GRAB")).toBe(true);
    expect(LogisticsFactory.hasProvider("MOVEIT")).toBe(true);
    expect(LogisticsFactory.hasProvider("UNKNOWN")).toBe(false);
  });
});

describe("Shipping Rate Calculations", () => {
  it("should calculate J&T Express shipping fee", () => {
    const fee = calculateShippingFee("NCR", "JT_EXPRESS", 500);
    expect(fee).toBeInstanceOf(Decimal);
    expect(fee.toNumber()).toBeGreaterThan(0);
  });

  it("should calculate Lalamove shipping fee", () => {
    const fee = calculateShippingFee("NCR", "LALAMOVE", 500);
    expect(fee.toNumber()).toBeGreaterThan(0);
  });

  it("should calculate Grab Express shipping fee", () => {
    const fee = calculateShippingFee("NCR", "GRAB", 500);
    expect(fee.toNumber()).toBeGreaterThan(0);
  });

  it("should calculate MoveIt shipping fee", () => {
    const fee = calculateShippingFee("NCR", "MOVEIT", 500);
    expect(fee.toNumber()).toBeGreaterThan(0);
  });

  it("should apply free shipping for orders over 1000 PHP (standard providers)", () => {
    const fee = calculateShippingFee("NCR", "JT_EXPRESS", 1500);
    expect(fee.toNumber()).toBe(0);
  });

  it("should not apply free shipping for on-demand providers", () => {
    const fee = calculateShippingFee("NCR", "LALAMOVE", 1500);
    expect(fee.toNumber()).toBeGreaterThan(0);
  });
});

describe("Provider Display Names", () => {
  it("should get J&T Express display name", () => {
    expect(getShippingProviderName("JT_EXPRESS")).toBe("J&T Express");
  });

  it("should get Lalamove display name", () => {
    expect(getShippingProviderName("LALAMOVE")).toBe("Lalamove");
  });

  it("should get Grab Express display name", () => {
    expect(getShippingProviderName("GRAB")).toBe("Grab Express");
  });

  it("should get MoveIt display name", () => {
    expect(getShippingProviderName("MOVEIT")).toBe("MoveIt");
  });
});

describe("Estimated Delivery Days", () => {
  it("should get J&T Express estimated delivery days", () => {
    const days = getEstimatedDeliveryDays("JT_EXPRESS");
    expect(days).toBe(2);
  });

  it("should get Lalamove estimated delivery days", () => {
    const days = getEstimatedDeliveryDays("LALAMOVE");
    expect(days).toBeLessThan(1);
  });

  it("should get Grab Express estimated delivery days", () => {
    const days = getEstimatedDeliveryDays("GRAB");
    expect(days).toBeLessThan(1);
  });

  it("should get MoveIt estimated delivery days", () => {
    const days = getEstimatedDeliveryDays("MOVEIT");
    expect(days).toBe(1);
  });
});

