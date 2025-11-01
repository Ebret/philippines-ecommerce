/**
 * Localization & Internationalization Unit Tests
 * Comprehensive tests for all localization functionality
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  formatCurrency,
  formatCurrencyLocale,
  parseCurrency,
  calculateVAT,
  calculateTotalWithVAT,
  calculateAmountBeforeVAT,
  formatTaxDisplay,
  formatDatePST,
  formatDateTime,
  formatTime,
  getRelativeTime,
  isPhilippinesHoliday,
  getPhilippinesHolidayName,
  formatNumber,
  formatPercentage,
  formatPhilippinesAddress,
  validatePhilippinesAddress,
  getProvincesForRegion,
  validatePhilippinePhoneNumber,
  formatPhilippinePhoneNumber,
  getMobileOperator,
  detectLocaleFromBrowser,
  detectTimezone,
  getLocaleName,
  getLocaleFlag,
  isPhilippinesLocale,
  isBusinessOpen,
  getDayName,
  getDayNameTagalog,
  kmToMiles,
  kgToPounds,
  celsiusToFahrenheit,
} from "@/lib/localization-utils";
import {
  LocalizationPreferencesSchema,
  PhilippinesAddressSchema,
  PhoneNumberSchema,
  CurrencySchema,
  TaxConfigurationSchema,
  HolidaySchema,
  BusinessHoursSchema,
  LanguagePreferenceUpdateSchema,
  LocalizationSettingsUpdateSchema,
  AddressValidationSchema,
  NumberFormattingSchema,
  CurrencyFormattingSchema,
  DateFormattingSchema,
  TaxCalculationSchema,
} from "@/lib/validations/localization";

describe("Localization & Internationalization", () => {
  // ========================================================================
  // Currency Formatting Tests
  // ========================================================================

  describe("Currency Formatting", () => {
    it("should format currency with symbol", () => {
      const formatted = formatCurrency(1000);
      expect(formatted).toBe("₱1,000.00");
    });

    it("should format currency without symbol", () => {
      const formatted = formatCurrency(1000, false);
      expect(formatted).toBe("1,000.00");
    });

    it("should format currency with decimals", () => {
      const formatted = formatCurrency(1234.56);
      expect(formatted).toBe("₱1,234.56");
    });

    it("should format currency locale", () => {
      const formatted = formatCurrencyLocale(1000, "en");
      expect(formatted).toContain("₱");
    });

    it("should parse currency string", () => {
      const parsed = parseCurrency("₱1,000.00");
      expect(parsed).toBe(1000);
    });
  });

  // ========================================================================
  // Tax Calculation Tests
  // ========================================================================

  describe("Tax Calculations", () => {
    it("should calculate VAT (12%)", () => {
      const vat = calculateVAT(1000);
      expect(vat).toBe(120);
    });

    it("should calculate total with VAT", () => {
      const total = calculateTotalWithVAT(1000);
      expect(total).toBe(1120);
    });

    it("should calculate amount before VAT", () => {
      const amount = calculateAmountBeforeVAT(1120);
      expect(amount).toBeCloseTo(1000, 2);
    });

    it("should format tax display", () => {
      const display = formatTaxDisplay(1000);
      expect(display).toContain("120");
      expect(display).toContain("12%");
    });
  });

  // ========================================================================
  // Date & Time Formatting Tests
  // ========================================================================

  describe("Date & Time Formatting", () => {
    it("should format date PST", () => {
      const date = new Date("2024-01-15");
      const formatted = formatDatePST(date);
      expect(formatted).toContain("Jan");
      expect(formatted).toContain("15");
    });

    it("should format date and time", () => {
      const date = new Date("2024-01-15T10:30:00");
      const formatted = formatDateTime(date);
      expect(formatted).toContain("Jan");
      expect(formatted).toContain("15");
    });

    it("should format time only", () => {
      const date = new Date("2024-01-15T10:30:45");
      const formatted = formatTime(date);
      expect(formatted).toContain("10");
      expect(formatted).toContain("30");
    });

    it("should get relative time", () => {
      const now = new Date();
      const relative = getRelativeTime(now);
      expect(relative).toBe("just now");
    });

    it("should detect Philippines holidays", () => {
      const newYear = new Date("2024-01-01");
      expect(isPhilippinesHoliday(newYear)).toBe(true);
    });

    it("should get holiday name", () => {
      const newYear = new Date("2024-01-01");
      const name = getPhilippinesHolidayName(newYear);
      expect(name).toBe("New Year's Day");
    });
  });

  // ========================================================================
  // Number Formatting Tests
  // ========================================================================

  describe("Number Formatting", () => {
    it("should format number with thousand separators", () => {
      const formatted = formatNumber(1000000);
      expect(formatted).toBe("1,000,000.00");
    });

    it("should format percentage", () => {
      const formatted = formatPercentage(12.5);
      expect(formatted).toBe("12.50%");
    });

    it("should format number with custom decimal places", () => {
      const formatted = formatNumber(1234.5678, 3);
      expect(formatted).toBe("1,234.568");
    });
  });

  // ========================================================================
  // Address Functions Tests
  // ========================================================================

  describe("Address Functions", () => {
    it("should format Philippines address", () => {
      const address = formatPhilippinesAddress(
        "123 Main St",
        "Barangay 1",
        "Manila",
        "Metro Manila",
        "1000"
      );
      expect(address).toContain("123 Main St");
      expect(address).toContain("Barangay 1");
      expect(address).toContain("Manila");
    });

    it("should validate Philippines address", () => {
      const isValid = validatePhilippinesAddress(
        "National Capital Region (NCR)",
        "Manila",
        "Manila",
        "Barangay 1"
      );
      expect(isValid).toBe(true);
    });

    it("should get provinces for region", () => {
      const provinces = getProvincesForRegion(
        "National Capital Region (NCR)"
      );
      expect(provinces.length).toBeGreaterThan(0);
      expect(provinces).toContain("Manila");
    });
  });

  // ========================================================================
  // Phone Number Functions Tests
  // ========================================================================

  describe("Phone Number Functions", () => {
    it("should validate Philippine phone number", () => {
      expect(validatePhilippinePhoneNumber("09171234567")).toBe(true);
      expect(validatePhilippinePhoneNumber("+639171234567")).toBe(true);
      expect(validatePhilippinePhoneNumber("1234567890")).toBe(false);
    });

    it("should format Philippine phone number", () => {
      const formatted = formatPhilippinePhoneNumber("09171234567");
      expect(formatted).toBe("+639171234567");
    });

    it("should get mobile operator", () => {
      const operator = getMobileOperator("09171234567");
      expect(operator).toBeTruthy();
    });
  });

  // ========================================================================
  // Locale Detection Tests
  // ========================================================================

  describe("Locale Detection", () => {
    it("should detect timezone", () => {
      const timezone = detectTimezone();
      expect(timezone).toBeTruthy();
    });

    it("should get locale name", () => {
      expect(getLocaleName("en")).toBe("English");
      expect(getLocaleName("tl")).toBe("Tagalog");
      expect(getLocaleName("fil")).toBe("Filipino");
    });

    it("should get locale flag", () => {
      expect(getLocaleFlag("en")).toBe("🇵🇭");
      expect(getLocaleFlag("tl")).toBe("🇵🇭");
      expect(getLocaleFlag("fil")).toBe("🇵🇭");
    });

    it("should check if locale is Philippines-specific", () => {
      expect(isPhilippinesLocale("en")).toBe(true);
      expect(isPhilippinesLocale("tl")).toBe(true);
      expect(isPhilippinesLocale("fil")).toBe(true);
    });
  });

  // ========================================================================
  // Business Hours Tests
  // ========================================================================

  describe("Business Hours", () => {
    it("should check if business is open", () => {
      const testDate = new Date("2024-01-15T10:00:00");
      const isOpen = isBusinessOpen("09:00", "18:00", testDate);
      expect(isOpen).toBe(true);
    });

    it("should check if business is closed", () => {
      const testDate = new Date("2024-01-15T20:00:00");
      const isOpen = isBusinessOpen("09:00", "18:00", testDate);
      expect(isOpen).toBe(false);
    });

    it("should get day name", () => {
      const date = new Date("2024-01-15"); // Monday
      expect(getDayName(date)).toBe("Monday");
    });

    it("should get day name in Tagalog", () => {
      const date = new Date("2024-01-15"); // Monday
      expect(getDayNameTagalog(date)).toBe("Lunes");
    });
  });

  // ========================================================================
  // Conversion Functions Tests
  // ========================================================================

  describe("Conversion Functions", () => {
    it("should convert kilometers to miles", () => {
      const miles = kmToMiles(1);
      expect(miles).toBeCloseTo(0.621371, 5);
    });

    it("should convert kilograms to pounds", () => {
      const pounds = kgToPounds(1);
      expect(pounds).toBeCloseTo(2.20462, 5);
    });

    it("should convert Celsius to Fahrenheit", () => {
      const fahrenheit = celsiusToFahrenheit(0);
      expect(fahrenheit).toBe(32);
    });
  });

  // ========================================================================
  // Validation Schema Tests
  // ========================================================================

  describe("Validation Schemas", () => {
    it("should validate localization preferences", () => {
      const data = {
        language: "en",
        timezone: "Asia/Manila",
        dateFormat: "MMM dd, yyyy",
        timeFormat: "12h",
        currency: "PHP",
        numberFormat: {
          decimal: ".",
          thousands: ",",
          precision: 2,
        },
      };
      const result = LocalizationPreferencesSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should validate Philippines address", () => {
      const data = {
        region: "National Capital Region (NCR)",
        province: "Manila",
        municipality: "Manila",
        barangay: "Barangay 1",
        street: "123 Main St",
        zipCode: "1000",
        addressType: "home",
      };
      const result = PhilippinesAddressSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should validate phone number", () => {
      const result = PhoneNumberSchema.safeParse("09171234567");
      expect(result.success).toBe(true);
    });

    it("should validate currency", () => {
      const data = {
        code: "PHP",
        symbol: "₱",
        name: "Philippine Peso",
        decimalPlaces: 2,
      };
      const result = CurrencySchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should validate tax configuration", () => {
      const data = {
        vatRate: 0.12,
        vatRatePercentage: 12,
      };
      const result = TaxConfigurationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should validate holiday", () => {
      const data = {
        date: "01-01",
        name: "New Year's Day",
        type: "national",
      };
      const result = HolidaySchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should validate language preference update", () => {
      const data = { language: "tl" };
      const result = LanguagePreferenceUpdateSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should validate localization settings update", () => {
      const data = {
        language: "fil",
        timezone: "Asia/Manila",
      };
      const result = LocalizationSettingsUpdateSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should validate number formatting", () => {
      const data = {
        value: 1000,
        locale: "en",
        decimalPlaces: 2,
      };
      const result = NumberFormattingSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should validate currency formatting", () => {
      const data = {
        amount: 1000,
        currency: "PHP",
        locale: "en",
      };
      const result = CurrencyFormattingSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should validate date formatting", () => {
      const data = {
        date: new Date(),
        locale: "en",
        format: "MMM dd, yyyy",
      };
      const result = DateFormattingSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should validate tax calculation", () => {
      const data = {
        amount: 1000,
        vatRate: 0.12,
      };
      const result = TaxCalculationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });
});

