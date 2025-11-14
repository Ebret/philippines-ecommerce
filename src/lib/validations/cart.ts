import { z } from "zod";

/**
 * Cart Item Schema
 * Validates cart item data
 */
export const CartItemSchema = z.object({
  variantId: z.string().min(1, "Variant ID is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(999, "Quantity cannot exceed 999"),
  productSnapshot: z.object({
    productId: z.string(),
    productName: z.string(),
    vendorId: z.string(),
    vendorName: z.string(),
    price: z.number().positive("Price must be positive"),
    image: z.string().optional(),
  }).optional(),
});

export type CartItem = z.infer<typeof CartItemSchema>;

/**
 * Add to Cart Schema
 * Validates adding item to cart
 */
export const AddToCartSchema = z.object({
  variantId: z.string().min(1, "Variant ID is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(999, "Quantity cannot exceed 999"),
});

export type AddToCart = z.infer<typeof AddToCartSchema>;

/**
 * Update Cart Item Schema
 * Validates updating cart item quantity
 */
export const UpdateCartItemSchema = z.object({
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(999, "Quantity cannot exceed 999"),
});

export type UpdateCartItem = z.infer<typeof UpdateCartItemSchema>;

/**
 * Address Schema
 * Validates Philippines address with barangay-level detail
 */
export const AddressSchema = z.object({
  label: z.string().optional(),
  recipientName: z.string().min(2, "Recipient name must be at least 2 characters"),
  phone: z.string().regex(/^09\d{9}$/, "Phone must be valid Philippine number (09XXXXXXXXX)"),
  region: z.string().min(1, "Region is required"),
  province: z.string().min(1, "Province is required"),
  cityMunicipality: z.string().min(1, "City/Municipality is required"),
  barangay: z.string().min(1, "Barangay is required"),
  streetAddress: z.string().min(5, "Street address must be at least 5 characters"),
  postalCode: z.string().optional(),
  landmark: z.string().optional(),
  isDefault: z.boolean().default(false),
});

export type Address = z.infer<typeof AddressSchema>;

/**
 * Checkout Data Schema
 * Validates checkout information
 */
export const CheckoutDataSchema = z.object({
  shippingAddressId: z.string().optional(),
  shippingAddress: AddressSchema.optional(),
  billingAddressId: z.string().optional(),
  billingAddress: AddressSchema.optional(),
  useSameAddress: z.boolean().default(true),
  shippingProvider: z.enum(["LBC", "TWO_GO", "JRS", "JT_EXPRESS", "GRAB", "LALAMOVE", "MOVEIT", "PICKUP"]),
  notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
  acceptTerms: z.boolean().refine((val) => val === true, "You must accept terms and conditions"),
});

export type CheckoutData = z.infer<typeof CheckoutDataSchema>;

/**
 * Shipping Option Schema
 * Validates shipping option selection
 */
export const ShippingOptionSchema = z.object({
  provider: z.enum(["LBC", "TWO_GO", "JRS", "JT_EXPRESS", "GRAB", "LALAMOVE", "MOVEIT", "PICKUP"]),
  estimatedDays: z.number().min(0, "Estimated days cannot be negative"),
  fee: z.number().nonnegative("Shipping fee cannot be negative"),
  description: z.string().optional(),
});

export type ShippingOption = z.infer<typeof ShippingOptionSchema>;

/**
 * Cart Summary Schema
 * Validates cart summary data
 */
export const CartSummarySchema = z.object({
  subtotal: z.number().nonnegative("Subtotal cannot be negative"),
  taxAmount: z.number().nonnegative("Tax amount cannot be negative"),
  shippingFee: z.number().nonnegative("Shipping fee cannot be negative"),
  discountAmount: z.number().nonnegative("Discount cannot be negative"),
  totalAmount: z.number().nonnegative("Total cannot be negative"),
  itemCount: z.number().int().nonnegative("Item count cannot be negative"),
  vendorCount: z.number().int().nonnegative("Vendor count cannot be negative"),
});

export type CartSummary = z.infer<typeof CartSummarySchema>;

/**
 * Checkout Validation Schema
 * Validates complete checkout data
 */
export const CheckoutValidationSchema = z.object({
  items: z.array(CartItemSchema).min(1, "Cart must have at least one item"),
  shippingAddress: AddressSchema,
  billingAddress: AddressSchema.optional(),
  shippingProvider: z.enum(["LBC", "TWO_GO", "JRS", "JT_EXPRESS", "GRAB", "LALAMOVE", "MOVEIT", "PICKUP"]),
  notes: z.string().max(500).optional(),
});

export type CheckoutValidation = z.infer<typeof CheckoutValidationSchema>;

/**
 * Order Creation Schema
 * Validates order creation data
 */
export const OrderCreationSchema = z.object({
  items: z.array(CartItemSchema).min(1, "Order must have at least one item"),
  shippingAddress: AddressSchema,
  billingAddress: AddressSchema.optional(),
  shippingProvider: z.enum(["LBC", "TWO_GO", "JRS", "JT_EXPRESS", "GRAB", "LALAMOVE", "MOVEIT", "PICKUP"]),
  paymentMethod: z.enum(["GCASH", "PAYMAYA", "CREDIT_CARD", "DEBIT_CARD", "BANK_TRANSFER", "COD"]),
  notes: z.string().max(500).optional(),
});

export type OrderCreation = z.infer<typeof OrderCreationSchema>;

/**
 * Coupon/Discount Schema
 * Validates coupon code
 */
export const CouponSchema = z.object({
  code: z.string().min(3, "Coupon code must be at least 3 characters").max(20, "Coupon code cannot exceed 20 characters"),
  discountPercent: z.number().min(0, "Discount cannot be negative").max(100, "Discount cannot exceed 100%"),
  minOrderAmount: z.number().nonnegative("Minimum order amount cannot be negative").optional(),
  maxDiscount: z.number().nonnegative("Max discount cannot be negative").optional(),
  expiryDate: z.date().optional(),
});

export type Coupon = z.infer<typeof CouponSchema>;

/**
 * Tax Calculation Schema
 * Validates tax calculation parameters
 */
export const TaxCalculationSchema = z.object({
  subtotal: z.number().nonnegative("Subtotal cannot be negative"),
  taxRate: z.number().min(0, "Tax rate cannot be negative").max(100, "Tax rate cannot exceed 100%"),
  taxableItems: z.array(z.object({
    itemId: z.string(),
    amount: z.number().nonnegative(),
    isTaxable: z.boolean(),
  })).optional(),
});

export type TaxCalculation = z.infer<typeof TaxCalculationSchema>;

/**
 * Shipping Calculation Schema
 * Validates shipping calculation parameters
 */
export const ShippingCalculationSchema = z.object({
  region: z.string().min(1, "Region is required"),
  province: z.string().min(1, "Province is required"),
  cityMunicipality: z.string().min(1, "City/Municipality is required"),
  barangay: z.string().min(1, "Barangay is required"),
  weight: z.number().positive("Weight must be positive").optional(),
  provider: z.enum(["LBC", "TWO_GO", "JRS", "JT_EXPRESS", "GRAB", "LALAMOVE", "MOVEIT", "PICKUP"]),
});

export type ShippingCalculation = z.infer<typeof ShippingCalculationSchema>;

/**
 * Barangay Query Schema
 * Validates barangay lookup parameters
 */
export const BarangayQuerySchema = z.object({
  region: z.string().optional(),
  province: z.string().optional(),
  cityMunicipality: z.string().optional(),
});

export type BarangayQuery = z.infer<typeof BarangayQuerySchema>;

