import { describe, it, expect, beforeEach } from "vitest";
import {
  AddToCartSchema,
  UpdateCartItemSchema,
  AddressSchema,
  CheckoutDataSchema,
  CartSummarySchema,
  CheckoutValidationSchema,
  OrderCreationSchema,
  CouponSchema,
  TaxCalculationSchema,
  ShippingCalculationSchema,
  BarangayQuerySchema,
} from "@/lib/validations/cart";
import {
  calculateSubtotal,
  calculateTax,
  calculateShippingFee,
  calculateTotal,
  calculateCartSummary,
  groupItemsByVendor,
  calculateVendorSubtotal,
  applyDiscount,
  validateCartItemsStock,
  formatPrice,
  calculateEstimatedDelivery,
  getShippingProviderName,
  getEstimatedDeliveryDays,
  isValidShippingAddress,
  generateOrderNumber,
  calculateVendorCommission,
  calculateVendorEarnings,
} from "@/lib/cart-utils";
import { Decimal } from "@prisma/client/runtime/library";

describe("Cart Validation Schemas", () => {
  describe("AddToCartSchema", () => {
    it("should validate valid add to cart data", () => {
      const data = {
        variantId: "variant-123",
        quantity: 2,
      };
      expect(() => AddToCartSchema.parse(data)).not.toThrow();
    });

    it("should reject invalid quantity", () => {
      const data = {
        variantId: "variant-123",
        quantity: 0,
      };
      expect(() => AddToCartSchema.parse(data)).toThrow();
    });

    it("should reject quantity exceeding maximum", () => {
      const data = {
        variantId: "variant-123",
        quantity: 1000,
      };
      expect(() => AddToCartSchema.parse(data)).toThrow();
    });
  });

  describe("AddressSchema", () => {
    it("should validate valid Philippines address", () => {
      const data = {
        recipientName: "John Doe",
        phone: "09123456789",
        region: "NCR",
        province: "Metro Manila",
        cityMunicipality: "Manila",
        barangay: "Barangay 1",
        streetAddress: "123 Main Street",
      };
      expect(() => AddressSchema.parse(data)).not.toThrow();
    });

    it("should reject invalid phone number", () => {
      const data = {
        recipientName: "John Doe",
        phone: "1234567890",
        region: "NCR",
        province: "Metro Manila",
        cityMunicipality: "Manila",
        barangay: "Barangay 1",
        streetAddress: "123 Main Street",
      };
      expect(() => AddressSchema.parse(data)).toThrow();
    });

    it("should reject short street address", () => {
      const data = {
        recipientName: "John Doe",
        phone: "09123456789",
        region: "NCR",
        province: "Metro Manila",
        cityMunicipality: "Manila",
        barangay: "Barangay 1",
        streetAddress: "123",
      };
      expect(() => AddressSchema.parse(data)).toThrow();
    });
  });

  describe("CheckoutDataSchema", () => {
    it("should validate valid checkout data", () => {
      const data = {
        shippingAddress: {
          recipientName: "John Doe",
          phone: "09123456789",
          region: "NCR",
          province: "Metro Manila",
          cityMunicipality: "Manila",
          barangay: "Barangay 1",
          streetAddress: "123 Main Street",
        },
        shippingProvider: "LBC",
        acceptTerms: true,
      };
      expect(() => CheckoutDataSchema.parse(data)).not.toThrow();
    });

    it("should reject without accepting terms", () => {
      const data = {
        shippingAddress: {
          recipientName: "John Doe",
          phone: "09123456789",
          region: "NCR",
          province: "Metro Manila",
          cityMunicipality: "Manila",
          barangay: "Barangay 1",
          streetAddress: "123 Main Street",
        },
        shippingProvider: "LBC",
        acceptTerms: false,
      };
      expect(() => CheckoutDataSchema.parse(data)).toThrow();
    });
  });

  describe("CouponSchema", () => {
    it("should validate valid coupon", () => {
      const data = {
        code: "SAVE10",
        discountPercent: 10,
      };
      expect(() => CouponSchema.parse(data)).not.toThrow();
    });

    it("should reject invalid discount percent", () => {
      const data = {
        code: "SAVE10",
        discountPercent: 150,
      };
      expect(() => CouponSchema.parse(data)).toThrow();
    });
  });

  describe("ShippingCalculationSchema", () => {
    it("should validate valid shipping calculation", () => {
      const data = {
        region: "NCR",
        province: "Metro Manila",
        cityMunicipality: "Manila",
        barangay: "Barangay 1",
        provider: "LBC",
      };
      expect(() => ShippingCalculationSchema.parse(data)).not.toThrow();
    });
  });
});

describe("Cart Utility Functions", () => {
  describe("calculateSubtotal", () => {
    it("should calculate subtotal correctly", () => {
      const items = [
        {
          variantId: "var-1",
          quantity: 2,
          productSnapshot: { productId: "prod-1", productName: "Product 1", vendorId: "vendor-1", vendorName: "Vendor 1", price: 100 },
        },
        {
          variantId: "var-2",
          quantity: 3,
          productSnapshot: { productId: "prod-2", productName: "Product 2", vendorId: "vendor-1", vendorName: "Vendor 1", price: 50 },
        },
      ];
      const subtotal = calculateSubtotal(items);
      expect(subtotal.toNumber()).toBe(350); // (2 * 100) + (3 * 50)
    });

    it("should return 0 for empty cart", () => {
      const subtotal = calculateSubtotal([]);
      expect(subtotal.toNumber()).toBe(0);
    });
  });

  describe("calculateTax", () => {
    it("should calculate 12% VAT correctly", () => {
      const subtotal = new Decimal(1000);
      const tax = calculateTax(subtotal);
      expect(tax.toNumber()).toBe(120); // 1000 * 0.12
    });

    it("should handle number input", () => {
      const tax = calculateTax(1000);
      expect(tax.toNumber()).toBe(120);
    });
  });

  describe("calculateShippingFee", () => {
    it("should calculate shipping fee for NCR", () => {
      const fee = calculateShippingFee("NCR", "LBC", new Decimal(500));
      expect(fee.toNumber()).toBe(50);
    });

    it("should apply provider multiplier", () => {
      const feeLBC = calculateShippingFee("NCR", "LBC", new Decimal(500));
      const feeGrab = calculateShippingFee("NCR", "GRAB", new Decimal(500));
      expect(feeGrab.toNumber()).toBeGreaterThan(feeLBC.toNumber());
    });

    it("should offer free shipping for orders over 1000", () => {
      const fee = calculateShippingFee("NCR", "LBC", new Decimal(1500));
      expect(fee.toNumber()).toBe(0);
    });

    it("should not offer free shipping for express services", () => {
      const fee = calculateShippingFee("NCR", "GRAB", new Decimal(1500));
      expect(fee.toNumber()).toBeGreaterThan(0);
    });

    it("should handle PICKUP provider", () => {
      const fee = calculateShippingFee("NCR", "PICKUP", new Decimal(500));
      expect(fee.toNumber()).toBe(0);
    });
  });

  describe("calculateTotal", () => {
    it("should calculate total with all components", () => {
      const total = calculateTotal(
        new Decimal(1000),
        new Decimal(120),
        new Decimal(50),
        new Decimal(100)
      );
      expect(total.toNumber()).toBe(1070); // 1000 + 120 + 50 - 100
    });
  });

  describe("calculateCartSummary", () => {
    it("should calculate complete cart summary", () => {
      const items = [
        {
          variantId: "var-1",
          quantity: 2,
          productSnapshot: { productId: "prod-1", productName: "Product 1", vendorId: "vendor-1", vendorName: "Vendor 1", price: 100 },
        },
      ];
      const summary = calculateCartSummary(items);
      expect(summary.subtotal).toBe(200);
      expect(summary.taxAmount).toBe(24); // 200 * 0.12
      expect(summary.itemCount).toBe(2);
      expect(summary.vendorCount).toBe(1);
    });
  });

  describe("groupItemsByVendor", () => {
    it("should group items by vendor correctly", () => {
      const items = [
        {
          variantId: "var-1",
          quantity: 1,
          productSnapshot: { productId: "prod-1", productName: "Product 1", vendorId: "vendor-1", vendorName: "Vendor 1", price: 100 },
        },
        {
          variantId: "var-2",
          quantity: 1,
          productSnapshot: { productId: "prod-2", productName: "Product 2", vendorId: "vendor-2", vendorName: "Vendor 2", price: 50 },
        },
      ];
      const grouped = groupItemsByVendor(items);
      expect(Object.keys(grouped).length).toBe(2);
      expect(grouped["vendor-1"].length).toBe(1);
      expect(grouped["vendor-2"].length).toBe(1);
    });
  });

  describe("applyDiscount", () => {
    it("should apply discount percentage", () => {
      const discount = applyDiscount(new Decimal(1000), 10);
      expect(discount.toNumber()).toBe(100);
    });

    it("should respect max discount", () => {
      const discount = applyDiscount(new Decimal(1000), 50, 200);
      expect(discount.toNumber()).toBe(200);
    });
  });

  describe("validateCartItemsStock", () => {
    it("should validate valid items", () => {
      const items = [
        {
          variantId: "var-1",
          quantity: 5,
          productSnapshot: { productId: "prod-1", productName: "Product 1", vendorId: "vendor-1", vendorName: "Vendor 1", price: 100 },
        },
      ];
      const result = validateCartItemsStock(items);
      expect(result.valid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    it("should reject invalid quantity", () => {
      const items = [
        {
          variantId: "var-1",
          quantity: 0,
          productSnapshot: { productId: "prod-1", productName: "Product 1", vendorId: "vendor-1", vendorName: "Vendor 1", price: 100 },
        },
      ];
      const result = validateCartItemsStock(items);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe("formatPrice", () => {
    it("should format price as PHP currency", () => {
      const formatted = formatPrice(1000);
      expect(formatted).toContain("₱");
      expect(formatted).toContain("1,000");
    });
  });

  describe("getShippingProviderName", () => {
    it("should return correct provider names", () => {
      expect(getShippingProviderName("LBC")).toBe("LBC Express");
      expect(getShippingProviderName("GRAB")).toBe("Grab");
      expect(getShippingProviderName("PICKUP")).toBe("Pickup at Store");
    });
  });

  describe("getEstimatedDeliveryDays", () => {
    it("should return correct estimated days", () => {
      expect(getEstimatedDeliveryDays("LBC")).toBe(3);
      expect(getEstimatedDeliveryDays("GRAB")).toBe(1);
      expect(getEstimatedDeliveryDays("PICKUP")).toBe(0);
    });
  });

  describe("isValidShippingAddress", () => {
    it("should validate complete address", () => {
      const address = {
        region: "NCR",
        province: "Metro Manila",
        cityMunicipality: "Manila",
        barangay: "Barangay 1",
        streetAddress: "123 Main Street",
      };
      expect(isValidShippingAddress(address)).toBe(true);
    });

    it("should reject incomplete address", () => {
      const address = {
        region: "NCR",
        province: "Metro Manila",
      };
      expect(isValidShippingAddress(address)).toBe(false);
    });
  });

  describe("generateOrderNumber", () => {
    it("should generate unique order numbers", () => {
      const order1 = generateOrderNumber();
      const order2 = generateOrderNumber();
      expect(order1).not.toBe(order2);
      expect(order1).toMatch(/^ORD-/);
      expect(order2).toMatch(/^ORD-/);
    });
  });

  describe("calculateVendorCommission", () => {
    it("should calculate commission correctly", () => {
      const commission = calculateVendorCommission(new Decimal(1000), new Decimal(5));
      expect(commission.toNumber()).toBe(50); // 1000 * 5%
    });
  });

  describe("calculateVendorEarnings", () => {
    it("should calculate earnings after commission", () => {
      const earnings = calculateVendorEarnings(new Decimal(1000), new Decimal(5));
      expect(earnings.toNumber()).toBe(950); // 1000 - 50
    });
  });
});

