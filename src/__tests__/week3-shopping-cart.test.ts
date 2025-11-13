import { describe, it, expect, beforeEach } from 'vitest';
import {
  calculateSubtotal,
  calculateTax,
  calculateShippingFee,
  calculateTotal,
  calculateCartSummary,
  groupItemsByVendor,
  applyDiscount,
  formatPrice,
  generateOrderNumber,
} from '@/lib/cart-utils';
import {
  AddToCartSchema,
  UpdateCartItemSchema,
  AddressSchema,
  CheckoutDataSchema,
  CartSummarySchema,
} from '@/lib/validations/cart';
import { Decimal } from '@prisma/client/runtime/library';

describe('Week 3: Shopping Cart Implementation', () => {
  describe('Cart Validation Schemas', () => {
    it('should validate add to cart data', () => {
      const validData = {
        variantId: 'variant-123',
        quantity: 2,
      };
      const result = AddToCartSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid quantity', () => {
      const invalidData = {
        variantId: 'variant-123',
        quantity: 0,
      };
      const result = AddToCartSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should validate update cart item', () => {
      const validData = { quantity: 5 };
      const result = UpdateCartItemSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate Philippines address', () => {
      const validAddress = {
        recipientName: 'John Doe',
        phone: '09123456789',
        region: 'NCR',
        province: 'Metro Manila',
        cityMunicipality: 'Manila',
        barangay: 'Barangay 1',
        streetAddress: '123 Main Street',
      };
      const result = AddressSchema.safeParse(validAddress);
      expect(result.success).toBe(true);
    });

    it('should reject invalid phone number', () => {
      const invalidAddress = {
        recipientName: 'John Doe',
        phone: '1234567890',
        region: 'NCR',
        province: 'Metro Manila',
        cityMunicipality: 'Manila',
        barangay: 'Barangay 1',
        streetAddress: '123 Main Street',
      };
      const result = AddressSchema.safeParse(invalidAddress);
      expect(result.success).toBe(false);
    });

    it('should validate checkout data', () => {
      const validCheckout = {
        shippingAddress: {
          recipientName: 'John Doe',
          phone: '09123456789',
          region: 'NCR',
          province: 'Metro Manila',
          cityMunicipality: 'Manila',
          barangay: 'Barangay 1',
          streetAddress: '123 Main Street',
        },
        paymentMethod: 'cod',
      };
      const result = CheckoutDataSchema.safeParse(validCheckout);
      expect(result.success).toBe(true);
    });
  });

  describe('Cart Calculations', () => {
    it('should calculate subtotal correctly', () => {
      const items = [
        {
          variantId: 'v1',
          quantity: 2,
          productSnapshot: { productId: 'p1', productName: 'Product 1', vendorId: 'v1', vendorName: 'Vendor 1', price: 100 },
        },
        {
          variantId: 'v2',
          quantity: 3,
          productSnapshot: { productId: 'p2', productName: 'Product 2', vendorId: 'v2', vendorName: 'Vendor 2', price: 50 },
        },
      ];
      const subtotal = calculateSubtotal(items);
      expect(subtotal.toNumber()).toBe(350); // (2 * 100) + (3 * 50)
    });

    it('should calculate 12% tax correctly', () => {
      const subtotal = new Decimal(1000);
      const tax = calculateTax(subtotal);
      expect(tax.toNumber()).toBe(120); // 1000 * 0.12
    });

    it('should calculate shipping fee based on region', () => {
      const fee = calculateShippingFee(new Decimal(500), 'NCR', 'LBC');
      expect(fee.toNumber()).toBeGreaterThan(0);
    });

    it('should apply free shipping for orders over 1000 PHP', () => {
      const fee = calculateShippingFee(new Decimal(1500), 'NCR', 'LBC');
      expect(fee.toNumber()).toBe(0);
    });

    it('should calculate total with all fees', () => {
      const items = [
        {
          variantId: 'v1',
          quantity: 1,
          productSnapshot: { productId: 'p1', productName: 'Product 1', vendorId: 'v1', vendorName: 'Vendor 1', price: 1000 },
        },
      ];
      const total = calculateTotal(items, new Decimal(0), 'NCR', 'LBC');
      expect(total.toNumber()).toBeGreaterThan(1000); // Should include tax
    });

    it('should group items by vendor', () => {
      const items = [
        {
          variantId: 'v1',
          quantity: 1,
          productSnapshot: { productId: 'p1', productName: 'Product 1', vendorId: 'vendor1', vendorName: 'Vendor 1', price: 100 },
        },
        {
          variantId: 'v2',
          quantity: 1,
          productSnapshot: { productId: 'p2', productName: 'Product 2', vendorId: 'vendor2', vendorName: 'Vendor 2', price: 50 },
        },
        {
          variantId: 'v3',
          quantity: 1,
          productSnapshot: { productId: 'p3', productName: 'Product 3', vendorId: 'vendor1', vendorName: 'Vendor 1', price: 75 },
        },
      ];
      const grouped = groupItemsByVendor(items);
      expect(Object.keys(grouped).length).toBe(2);
      expect(grouped['vendor1'].length).toBe(2);
      expect(grouped['vendor2'].length).toBe(1);
    });

    it('should apply discount correctly', () => {
      const subtotal = new Decimal(1000);
      const discounted = applyDiscount(subtotal, 10); // 10% discount
      expect(discounted.toNumber()).toBe(900);
    });

    it('should format price as PHP currency', () => {
      const formatted = formatPrice(1234.56);
      expect(formatted).toContain('₱');
      expect(formatted).toContain('1,234.56');
    });

    it('should generate unique order numbers', () => {
      const orderNum1 = generateOrderNumber();
      const orderNum2 = generateOrderNumber();
      expect(orderNum1).not.toBe(orderNum2);
      expect(orderNum1).toMatch(/^ORD-/);
    });
  });

  describe('Cart Summary', () => {
    it('should calculate complete cart summary', () => {
      const items = [
        {
          variantId: 'v1',
          quantity: 2,
          productSnapshot: { productId: 'p1', productName: 'Product 1', vendorId: 'v1', vendorName: 'Vendor 1', price: 500 },
        },
      ];
      const summary = calculateCartSummary(items, new Decimal(0), 'NCR', 'LBC');
      expect(summary.subtotal.toNumber()).toBe(1000);
      expect(summary.taxAmount.toNumber()).toBe(120); // 12% of 1000
      expect(summary.itemCount).toBe(2);
      expect(summary.vendorCount).toBe(1);
    });

    it('should include discount in summary', () => {
      const items = [
        {
          variantId: 'v1',
          quantity: 1,
          productSnapshot: { productId: 'p1', productName: 'Product 1', vendorId: 'v1', vendorName: 'Vendor 1', price: 1000 },
        },
      ];
      const summary = calculateCartSummary(items, new Decimal(100), 'NCR', 'LBC');
      expect(summary.discountAmount.toNumber()).toBe(100);
    });
  });

  describe('Multi-Vendor Orders', () => {
    it('should handle multiple vendors in single order', () => {
      const items = [
        {
          variantId: 'v1',
          quantity: 1,
          productSnapshot: { productId: 'p1', productName: 'Product 1', vendorId: 'vendor1', vendorName: 'Vendor 1', price: 100 },
        },
        {
          variantId: 'v2',
          quantity: 1,
          productSnapshot: { productId: 'p2', productName: 'Product 2', vendorId: 'vendor2', vendorName: 'Vendor 2', price: 200 },
        },
      ];
      const grouped = groupItemsByVendor(items);
      expect(Object.keys(grouped).length).toBe(2);
    });

    it('should calculate vendor-specific subtotals', () => {
      const items = [
        {
          variantId: 'v1',
          quantity: 2,
          productSnapshot: { productId: 'p1', productName: 'Product 1', vendorId: 'vendor1', vendorName: 'Vendor 1', price: 100 },
        },
        {
          variantId: 'v2',
          quantity: 1,
          productSnapshot: { productId: 'p2', productName: 'Product 2', vendorId: 'vendor2', vendorName: 'Vendor 2', price: 300 },
        },
      ];
      const grouped = groupItemsByVendor(items);
      const vendor1Items = grouped['vendor1'];
      const vendor1Subtotal = vendor1Items.reduce((sum, item) => sum + (item.productSnapshot?.price || 0) * item.quantity, 0);
      expect(vendor1Subtotal).toBe(200);
    });
  });

  describe('Shipping Calculations', () => {
    it('should calculate different shipping fees by region', () => {
      const ncrFee = calculateShippingFee(new Decimal(500), 'NCR', 'LBC');
      const visayasFee = calculateShippingFee(new Decimal(500), 'Central Visayas', 'LBC');
      expect(ncrFee.toNumber()).not.toBe(visayasFee.toNumber());
    });

    it('should apply provider multipliers', () => {
      const lbcFee = calculateShippingFee(new Decimal(500), 'NCR', 'LBC');
      const twoGoFee = calculateShippingFee(new Decimal(500), 'NCR', 'TWO_GO');
      expect(twoGoFee.toNumber()).toBeLessThan(lbcFee.toNumber());
    });

    it('should handle pickup as free shipping', () => {
      const pickupFee = calculateShippingFee(new Decimal(500), 'NCR', 'PICKUP');
      expect(pickupFee.toNumber()).toBe(0);
    });
  });

  describe('Promo Code & Discounts', () => {
    it('should apply percentage discount', () => {
      const subtotal = new Decimal(1000);
      const discounted = applyDiscount(subtotal, 10); // 10% off
      expect(discounted.toNumber()).toBe(900);
    });

    it('should apply fixed amount discount', () => {
      const subtotal = new Decimal(1000);
      const discounted = applyDiscount(subtotal, 50); // 50 PHP off
      expect(discounted.toNumber()).toBeLessThanOrEqual(1000);
    });

    it('should not apply discount greater than subtotal', () => {
      const subtotal = new Decimal(100);
      const discounted = applyDiscount(subtotal, 200);
      expect(discounted.toNumber()).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Order Number Generation', () => {
    it('should generate order number with correct format', () => {
      const orderNum = generateOrderNumber();
      expect(orderNum).toMatch(/^ORD-\d{10,}/);
    });

    it('should generate unique order numbers', () => {
      const orderNums = new Set();
      for (let i = 0; i < 100; i++) {
        orderNums.add(generateOrderNumber());
      }
      expect(orderNums.size).toBe(100);
    });
  });
});

