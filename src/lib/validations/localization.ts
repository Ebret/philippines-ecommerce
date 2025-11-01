/**
 * Localization Validation Schemas
 * Zod schemas for locale operations and localization data
 */

import { z } from "zod";

/**
 * Language Enum
 */
export const LanguageEnum = z.enum(["en", "tl", "fil"]);
export type Language = z.infer<typeof LanguageEnum>;

/**
 * Timezone Enum
 */
export const TimezoneEnum = z.enum([
  "Asia/Manila",
  "UTC",
  "Asia/Bangkok",
  "Asia/Hong_Kong",
]);
export type Timezone = z.infer<typeof TimezoneEnum>;

/**
 * Date Format Enum
 */
export const DateFormatEnum = z.enum([
  "MM/dd/yyyy",
  "dd/MM/yyyy",
  "yyyy-MM-dd",
  "MMM dd, yyyy",
  "MMMM dd, yyyy",
]);
export type DateFormat = z.infer<typeof DateFormatEnum>;

/**
 * Time Format Enum
 */
export const TimeFormatEnum = z.enum(["12h", "24h"]);
export type TimeFormat = z.infer<typeof TimeFormatEnum>;

/**
 * Address Type Enum
 */
export const AddressTypeEnum = z.enum(["home", "office", "other"]);
export type AddressType = z.infer<typeof AddressTypeEnum>;

/**
 * Localization Preferences Schema
 */
export const LocalizationPreferencesSchema = z.object({
  language: LanguageEnum.default("en"),
  timezone: TimezoneEnum.default("Asia/Manila"),
  dateFormat: DateFormatEnum.default("MMM dd, yyyy"),
  timeFormat: TimeFormatEnum.default("12h"),
  currency: z.string().default("PHP"),
  numberFormat: z.object({
    decimal: z.string().default("."),
    thousands: z.string().default(","),
    precision: z.number().default(2),
  }),
});

export type LocalizationPreferences = z.infer<
  typeof LocalizationPreferencesSchema
>;

/**
 * Philippines Address Schema
 */
export const PhilippinesAddressSchema = z.object({
  region: z.string().min(1, "Region is required"),
  province: z.string().min(1, "Province is required"),
  municipality: z.string().min(1, "Municipality is required"),
  barangay: z.string().min(1, "Barangay is required"),
  street: z.string().min(1, "Street address is required"),
  zipCode: z.string().regex(/^\d{4}$/, "ZIP code must be 4 digits"),
  landmark: z.string().optional(),
  addressType: AddressTypeEnum.default("home"),
  isDefault: z.boolean().default(false),
});

export type PhilippinesAddress = z.infer<typeof PhilippinesAddressSchema>;

/**
 * Phone Number Schema
 */
export const PhoneNumberSchema = z
  .string()
  .regex(
    /^(\+63|0)[0-9]{10}$/,
    "Invalid Philippine phone number format"
  );

export type PhoneNumber = z.infer<typeof PhoneNumberSchema>;

/**
 * Currency Schema
 */
export const CurrencySchema = z.object({
  code: z.string().length(3),
  symbol: z.string(),
  name: z.string(),
  decimalPlaces: z.number().min(0).max(4),
});

export type Currency = z.infer<typeof CurrencySchema>;

/**
 * Tax Configuration Schema
 */
export const TaxConfigurationSchema = z.object({
  vatRate: z.number().min(0).max(1),
  vatRatePercentage: z.number().min(0).max(100),
  taxableItems: z.array(z.string()).optional(),
  exemptItems: z.array(z.string()).optional(),
});

export type TaxConfiguration = z.infer<typeof TaxConfigurationSchema>;

/**
 * Holiday Schema
 */
export const HolidaySchema = z.object({
  date: z.string().regex(/^\d{2}-\d{2}$/, "Date must be in MM-dd format"),
  name: z.string().min(1),
  type: z.enum(["national", "religious", "special"]),
  isPublicHoliday: z.boolean().default(true),
});

export type Holiday = z.infer<typeof HolidaySchema>;

/**
 * Business Hours Schema
 */
export const BusinessHoursSchema = z.object({
  monday: z.object({
    open: z.string().regex(/^\d{2}:\d{2}$/),
    close: z.string().regex(/^\d{2}:\d{2}$/),
    isClosed: z.boolean().default(false),
  }),
  tuesday: z.object({
    open: z.string().regex(/^\d{2}:\d{2}$/),
    close: z.string().regex(/^\d{2}:\d{2}$/),
    isClosed: z.boolean().default(false),
  }),
  wednesday: z.object({
    open: z.string().regex(/^\d{2}:\d{2}$/),
    close: z.string().regex(/^\d{2}:\d{2}$/),
    isClosed: z.boolean().default(false),
  }),
  thursday: z.object({
    open: z.string().regex(/^\d{2}:\d{2}$/),
    close: z.string().regex(/^\d{2}:\d{2}$/),
    isClosed: z.boolean().default(false),
  }),
  friday: z.object({
    open: z.string().regex(/^\d{2}:\d{2}$/),
    close: z.string().regex(/^\d{2}:\d{2}$/),
    isClosed: z.boolean().default(false),
  }),
  saturday: z.object({
    open: z.string().regex(/^\d{2}:\d{2}$/),
    close: z.string().regex(/^\d{2}:\d{2}$/),
    isClosed: z.boolean().default(false),
  }),
  sunday: z.object({
    open: z.string().regex(/^\d{2}:\d{2}$/),
    close: z.string().regex(/^\d{2}:\d{2}$/),
    isClosed: z.boolean().default(false),
  }),
});

export type BusinessHours = z.infer<typeof BusinessHoursSchema>;

/**
 * Language Preference Update Schema
 */
export const LanguagePreferenceUpdateSchema = z.object({
  language: LanguageEnum,
});

export type LanguagePreferenceUpdate = z.infer<
  typeof LanguagePreferenceUpdateSchema
>;

/**
 * Localization Settings Update Schema
 */
export const LocalizationSettingsUpdateSchema = z.object({
  language: LanguageEnum.optional(),
  timezone: TimezoneEnum.optional(),
  dateFormat: DateFormatEnum.optional(),
  timeFormat: TimeFormatEnum.optional(),
  currency: z.string().optional(),
});

export type LocalizationSettingsUpdate = z.infer<
  typeof LocalizationSettingsUpdateSchema
>;

/**
 * Address Validation Schema
 */
export const AddressValidationSchema = z.object({
  region: z.string().min(1),
  province: z.string().min(1),
  municipality: z.string().min(1),
  barangay: z.string().min(1),
  street: z.string().min(1),
  zipCode: z.string().regex(/^\d{4}$/),
});

export type AddressValidation = z.infer<typeof AddressValidationSchema>;

/**
 * Locale Detection Schema
 */
export const LocaleDetectionSchema = z.object({
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  acceptLanguage: z.string().optional(),
  timezone: TimezoneEnum.optional(),
});

export type LocaleDetection = z.infer<typeof LocaleDetectionSchema>;

/**
 * Number Formatting Schema
 */
export const NumberFormattingSchema = z.object({
  value: z.number(),
  locale: LanguageEnum.default("en"),
  decimalPlaces: z.number().min(0).max(4).default(2),
  useGrouping: z.boolean().default(true),
});

export type NumberFormatting = z.infer<typeof NumberFormattingSchema>;

/**
 * Currency Formatting Schema
 */
export const CurrencyFormattingSchema = z.object({
  amount: z.number().min(0),
  currency: z.string().default("PHP"),
  locale: LanguageEnum.default("en"),
  includeSymbol: z.boolean().default(true),
});

export type CurrencyFormatting = z.infer<typeof CurrencyFormattingSchema>;

/**
 * Date Formatting Schema
 */
export const DateFormattingSchema = z.object({
  date: z.date().or(z.string()),
  locale: LanguageEnum.default("en"),
  format: DateFormatEnum.default("MMM dd, yyyy"),
  timezone: TimezoneEnum.default("Asia/Manila"),
});

export type DateFormatting = z.infer<typeof DateFormattingSchema>;

/**
 * Tax Calculation Schema
 */
export const TaxCalculationSchema = z.object({
  amount: z.number().min(0),
  vatRate: z.number().min(0).max(1).default(0.12),
  includeVat: z.boolean().default(false),
});

export type TaxCalculation = z.infer<typeof TaxCalculationSchema>;

/**
 * Localization Query Schema
 */
export const LocalizationQuerySchema = z.object({
  language: LanguageEnum.optional(),
  timezone: TimezoneEnum.optional(),
  region: z.string().optional(),
  province: z.string().optional(),
  municipality: z.string().optional(),
});

export type LocalizationQuery = z.infer<typeof LocalizationQuerySchema>;

