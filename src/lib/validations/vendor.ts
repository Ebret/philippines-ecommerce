import { z } from "zod";

// ============================================================================
// VENDOR REGISTRATION & ONBOARDING
// ============================================================================

export const VendorRegistrationSchema = z.object({
  storeName: z
    .string()
    .min(3, "Store name must be at least 3 characters")
    .max(100, "Store name must not exceed 100 characters"),
  storeSlug: z
    .string()
    .min(3, "Store slug must be at least 3 characters")
    .max(50, "Store slug must not exceed 50 characters")
    .regex(/^[a-z0-9-]+$/, "Store slug can only contain lowercase letters, numbers, and hyphens"),
  description: z
    .string()
    .max(500, "Description must not exceed 500 characters")
    .optional(),
  businessType: z.enum(["INDIVIDUAL", "SOLE_PROPRIETORSHIP", "PARTNERSHIP", "CORPORATION"]),
  businessName: z
    .string()
    .min(3, "Business name must be at least 3 characters")
    .optional(),
  businessRegistration: z
    .string()
    .optional(),
  tin: z
    .string()
    .regex(/^\d{12}$/, "TIN must be 12 digits")
    .optional(),
  bankName: z
    .string()
    .optional(),
  bankAccountNumber: z
    .string()
    .optional(),
  bankAccountName: z
    .string()
    .optional(),
  gcashNumber: z
    .string()
    .regex(/^09\d{9}$/, "GCash number must be a valid Philippine mobile number")
    .optional(),
  paymayaNumber: z
    .string()
    .regex(/^09\d{9}$/, "PayMaya number must be a valid Philippine mobile number")
    .optional(),
});

export type VendorRegistration = z.infer<typeof VendorRegistrationSchema>;

// ============================================================================
// VENDOR PROFILE UPDATES
// ============================================================================

export const VendorProfileUpdateSchema = z.object({
  businessType: z.enum(["INDIVIDUAL", "SOLE_PROPRIETORSHIP", "PARTNERSHIP", "CORPORATION"]).optional(),
  businessName: z.string().min(3).optional(),
  businessRegistration: z.string().optional(),
  tin: z.string().regex(/^\d{12}$/).optional(),
  birCertificateUrl: z.string().url().optional(),
  dtiRegistrationUrl: z.string().url().optional(),
  bankName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankAccountName: z.string().optional(),
  gcashNumber: z.string().regex(/^09\d{9}$/).optional(),
  paymayaNumber: z.string().regex(/^09\d{9}$/).optional(),
});

export type VendorProfileUpdate = z.infer<typeof VendorProfileUpdateSchema>;

// ============================================================================
// VENDOR STORE SETTINGS
// ============================================================================

export const VendorStoreSettingsSchema = z.object({
  storeName: z
    .string()
    .min(3, "Store name must be at least 3 characters")
    .max(100, "Store name must not exceed 100 characters")
    .optional(),
  description: z
    .string()
    .max(500, "Description must not exceed 500 characters")
    .optional(),
  logoUrl: z.string().url().optional(),
  bannerUrl: z.string().url().optional(),
  subscriptionPlan: z.enum(["basic", "professional", "enterprise"]).optional(),
});

export type VendorStoreSettings = z.infer<typeof VendorStoreSettingsSchema>;

// ============================================================================
// VENDOR COMMISSION SETTINGS
// ============================================================================

export const VendorCommissionSchema = z.object({
  commissionRate: z
    .number()
    .min(0, "Commission rate must be at least 0%")
    .max(100, "Commission rate must not exceed 100%"),
  description: z.string().optional(),
});

export type VendorCommission = z.infer<typeof VendorCommissionSchema>;

// ============================================================================
// VENDOR PAYOUT REQUEST
// ============================================================================

export const VendorPayoutRequestSchema = z.object({
  amount: z
    .number()
    .positive("Payout amount must be greater than 0"),
  paymentMethod: z.enum(["BANK_TRANSFER", "GCASH", "PAYMAYA"]),
  notes: z.string().optional(),
});

export type VendorPayoutRequest = z.infer<typeof VendorPayoutRequestSchema>;

// ============================================================================
// VENDOR SEARCH & FILTERING
// ============================================================================

export const VendorSearchSchema = z.object({
  query: z.string().optional(),
  status: z.enum(["PENDING", "APPROVED", "SUSPENDED", "REJECTED"]).optional(),
  subscriptionPlan: z.enum(["basic", "professional", "enterprise"]).optional(),
  minRating: z
    .number()
    .min(0, "Minimum rating must be at least 0")
    .max(5, "Minimum rating must not exceed 5")
    .optional(),
  sortBy: z.enum(["newest", "rating", "sales", "name"]).default("newest"),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

export type VendorSearch = z.infer<typeof VendorSearchSchema>;

// ============================================================================
// VENDOR VERIFICATION (ADMIN)
// ============================================================================

export const VendorVerificationSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED", "SUSPENDED"]),
  reason: z.string().optional(),
  notes: z.string().optional(),
});

export type VendorVerification = z.infer<typeof VendorVerificationSchema>;

// ============================================================================
// VENDOR ANALYTICS
// ============================================================================

export const VendorAnalyticsQuerySchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  period: z.enum(["daily", "weekly", "monthly", "yearly"]).default("monthly"),
});

export type VendorAnalyticsQuery = z.infer<typeof VendorAnalyticsQuerySchema>;

// ============================================================================
// VENDOR STORE POLICIES
// ============================================================================

export const VendorStorePoliciesSchema = z.object({
  returnPolicy: z.string().max(1000).optional(),
  shippingPolicy: z.string().max(1000).optional(),
  refundPolicy: z.string().max(1000).optional(),
  warrantyPolicy: z.string().max(1000).optional(),
});

export type VendorStorePolicies = z.infer<typeof VendorStorePoliciesSchema>;

