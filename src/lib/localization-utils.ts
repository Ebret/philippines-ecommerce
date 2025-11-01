/**
 * Localization Utility Functions
 * Comprehensive utilities for currency, date/time, address, and number formatting
 */

import {
  CURRENCY_CODE,
  CURRENCY_SYMBOL,
  CURRENCY_DECIMAL_PLACES,
  VAT_RATE,
  VAT_RATE_PERCENTAGE,
  PHILIPPINES_TIMEZONE,
  DATE_FORMATS,
  PHILIPPINES_PROVINCES,
  PHILIPPINES_HOLIDAYS,
  MOBILE_OPERATORS,
  Locale,
} from "@/config/i18n";

/**
 * ========================================================================
 * Currency Formatting Functions
 * ========================================================================
 */

/**
 * Format amount as PHP currency
 */
export function formatCurrency(
  amount: number,
  includeSymbol: boolean = true
): string {
  const formatted = amount.toLocaleString("en-PH", {
    minimumFractionDigits: CURRENCY_DECIMAL_PLACES,
    maximumFractionDigits: CURRENCY_DECIMAL_PLACES,
  });

  return includeSymbol ? `${CURRENCY_SYMBOL}${formatted}` : formatted;
}

/**
 * Format currency with locale support
 */
export function formatCurrencyLocale(
  amount: number,
  locale: Locale = "en"
): string {
  const localeMap: Record<Locale, string> = {
    en: "en-PH",
    tl: "en-PH",
    fil: "en-PH",
  };

  const formatted = amount.toLocaleString(localeMap[locale], {
    minimumFractionDigits: CURRENCY_DECIMAL_PLACES,
    maximumFractionDigits: CURRENCY_DECIMAL_PLACES,
  });

  return `${CURRENCY_SYMBOL}${formatted}`;
}

/**
 * Parse currency string to number
 */
export function parseCurrency(currencyString: string): number {
  const cleaned = currencyString
    .replace(CURRENCY_SYMBOL, "")
    .replace(/,/g, "")
    .trim();
  return parseFloat(cleaned);
}

/**
 * ========================================================================
 * Tax Calculation Functions
 * ========================================================================
 */

/**
 * Calculate VAT (12%)
 */
export function calculateVAT(amount: number): number {
  return amount * VAT_RATE;
}

/**
 * Calculate total with VAT
 */
export function calculateTotalWithVAT(amount: number): number {
  return amount + calculateVAT(amount);
}

/**
 * Calculate amount before VAT
 */
export function calculateAmountBeforeVAT(totalWithVAT: number): number {
  return totalWithVAT / (1 + VAT_RATE);
}

/**
 * Format tax display
 */
export function formatTaxDisplay(amount: number): string {
  const vat = calculateVAT(amount);
  return `${formatCurrency(vat)} (${VAT_RATE_PERCENTAGE}% VAT)`;
}

/**
 * ========================================================================
 * Date & Time Formatting Functions
 * ========================================================================
 */

/**
 * Format date to Philippine Standard Time
 */
export function formatDatePST(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format date and time
 */
export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Format time only
 */
export function formatTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleTimeString("en-PH", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/**
 * Get relative time (e.g., "2 hours ago")
 */
export function getRelativeTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

  return formatDatePST(dateObj);
}

/**
 * Check if date is a Philippines holiday
 */
export function isPhilippinesHoliday(date: Date): boolean {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const dateStr = `${month}-${day}`;

  return PHILIPPINES_HOLIDAYS.some((holiday) => holiday.date === dateStr);
}

/**
 * Get Philippines holiday name
 */
export function getPhilippinesHolidayName(date: Date): string | null {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const dateStr = `${month}-${day}`;

  const holiday = PHILIPPINES_HOLIDAYS.find((h) => h.date === dateStr);
  return holiday ? holiday.name : null;
}

/**
 * ========================================================================
 * Number Formatting Functions
 * ========================================================================
 */

/**
 * Format number with thousand separators
 */
export function formatNumber(
  value: number,
  decimalPlaces: number = 2
): string {
  return value.toLocaleString("en-PH", {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimalPlaces: number = 2): string {
  return `${formatNumber(value, decimalPlaces)}%`;
}

/**
 * ========================================================================
 * Address Functions
 * ========================================================================
 */

/**
 * Format Philippines address
 */
export function formatPhilippinesAddress(
  street: string,
  barangay: string,
  municipality: string,
  province: string,
  zipCode: string
): string {
  return `${street}, ${barangay}, ${municipality}, ${province} ${zipCode}`;
}

/**
 * Validate Philippines address
 */
export function validatePhilippinesAddress(
  region: string,
  province: string,
  municipality: string,
  barangay: string
): boolean {
  const provinces = PHILIPPINES_PROVINCES[region];
  return provinces ? provinces.includes(province) : false;
}

/**
 * Get provinces for region
 */
export function getProvincesForRegion(region: string): string[] {
  return PHILIPPINES_PROVINCES[region] || [];
}

/**
 * ========================================================================
 * Phone Number Functions
 * ========================================================================
 */

/**
 * Validate Philippine phone number
 */
export function validatePhilippinePhoneNumber(phoneNumber: string): boolean {
  const pattern = /^(\+63|0)[0-9]{10}$/;
  return pattern.test(phoneNumber);
}

/**
 * Format Philippine phone number
 */
export function formatPhilippinePhoneNumber(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/\D/g, "");

  if (cleaned.length === 11 && cleaned.startsWith("0")) {
    return `+63${cleaned.substring(1)}`;
  }

  if (cleaned.length === 12 && cleaned.startsWith("63")) {
    return `+${cleaned}`;
  }

  return phoneNumber;
}

/**
 * Get mobile operator from phone number
 */
export function getMobileOperator(phoneNumber: string): string | null {
  const formatted = formatPhilippinePhoneNumber(phoneNumber);
  const areaCode = formatted.substring(0, 5); // +63 + 2 digits

  const operator = MOBILE_OPERATORS.find((op) =>
    formatted.startsWith(`+63${op.code.substring(1)}`)
  );

  return operator ? operator.name : null;
}

/**
 * ========================================================================
 * Locale Detection Functions
 * ========================================================================
 */

/**
 * Detect locale from browser
 */
export function detectLocaleFromBrowser(): Locale {
  if (typeof navigator === "undefined") return "en";

  const language = navigator.language.split("-")[0];
  const localeMap: Record<string, Locale> = {
    tl: "tl",
    fil: "fil",
    en: "en",
  };

  return localeMap[language] || "en";
}

/**
 * Detect timezone
 */
export function detectTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * ========================================================================
 * Locale Utility Functions
 * ========================================================================
 */

/**
 * Get locale name
 */
export function getLocaleName(locale: Locale): string {
  const names: Record<Locale, string> = {
    en: "English",
    tl: "Tagalog",
    fil: "Filipino",
  };
  return names[locale];
}

/**
 * Get locale flag emoji
 */
export function getLocaleFlag(locale: Locale): string {
  const flags: Record<Locale, string> = {
    en: "🇵🇭",
    tl: "🇵🇭",
    fil: "🇵🇭",
  };
  return flags[locale];
}

/**
 * Check if locale is Philippines-specific
 */
export function isPhilippinesLocale(locale: Locale): boolean {
  return ["en", "tl", "fil"].includes(locale);
}

/**
 * ========================================================================
 * Business Hours Functions
 * ========================================================================
 */

/**
 * Check if business is open
 */
export function isBusinessOpen(
  openTime: string,
  closeTime: string,
  currentDate: Date = new Date()
): boolean {
  const [openHour, openMin] = openTime.split(":").map(Number);
  const [closeHour, closeMin] = closeTime.split(":").map(Number);

  const now = currentDate;
  const currentHour = now.getHours();
  const currentMin = now.getMinutes();

  const openTotalMin = openHour * 60 + openMin;
  const closeTotalMin = closeHour * 60 + closeMin;
  const currentTotalMin = currentHour * 60 + currentMin;

  return currentTotalMin >= openTotalMin && currentTotalMin < closeTotalMin;
}

/**
 * Get day name
 */
export function getDayName(date: Date): string {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[date.getDay()];
}

/**
 * Get day name in Tagalog
 */
export function getDayNameTagalog(date: Date): string {
  const days = [
    "Linggo",
    "Lunes",
    "Martes",
    "Miyerkules",
    "Huwebes",
    "Biyernes",
    "Sabado",
  ];
  return days[date.getDay()];
}

/**
 * ========================================================================
 * Conversion Functions
 * ========================================================================
 */

/**
 * Convert kilometers to miles
 */
export function kmToMiles(km: number): number {
  return km * 0.621371;
}

/**
 * Convert kilograms to pounds
 */
export function kgToPounds(kg: number): number {
  return kg * 2.20462;
}

/**
 * Convert Celsius to Fahrenheit
 */
export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

