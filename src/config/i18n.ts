/**
 * Internationalization (i18n) Configuration
 * Supports English, Tagalog, and Filipino languages
 */

export type Locale = "en" | "tl" | "fil";

export const locales: Locale[] = ["en", "tl", "fil"];
export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  tl: "Tagalog",
  fil: "Filipino",
};

export const localeFlags: Record<Locale, string> = {
  en: "🇵🇭",
  tl: "🇵🇭",
  fil: "🇵🇭",
};

export const localeNativeNames: Record<Locale, string> = {
  en: "English",
  tl: "Tagalog",
  fil: "Filipino",
};

/**
 * Timezone Configuration
 */
export const PHILIPPINES_TIMEZONE = "Asia/Manila";
export const PHILIPPINES_TIMEZONE_OFFSET = "+08:00";

/**
 * Currency Configuration
 */
export const CURRENCY_CODE = "PHP";
export const CURRENCY_SYMBOL = "₱";
export const CURRENCY_DECIMAL_PLACES = 2;

/**
 * Tax Configuration
 */
export const VAT_RATE = 0.12; // 12% VAT
export const VAT_RATE_PERCENTAGE = 12;

/**
 * Number Formatting Configuration
 */
export const NUMBER_FORMAT = {
  decimal: ".",
  thousands: ",",
  precision: 2,
};

/**
 * Date Format Configuration
 */
export const DATE_FORMATS = {
  short: "MM/dd/yyyy",
  medium: "MMM dd, yyyy",
  long: "MMMM dd, yyyy",
  full: "EEEE, MMMM dd, yyyy",
  time: "hh:mm a",
  datetime: "MMM dd, yyyy hh:mm a",
};

/**
 * Philippines Regions
 */
export const PHILIPPINES_REGIONS = [
  "National Capital Region (NCR)",
  "Cordillera Administrative Region (CAR)",
  "Ilocos Region (Region I)",
  "Cagayan Valley (Region II)",
  "Central Luzon (Region III)",
  "CALABARZON (Region IV-A)",
  "Mimaropa (Region IV-B)",
  "Bicol Region (Region V)",
  "Western Visayas (Region VI)",
  "Central Visayas (Region VII)",
  "Eastern Visayas (Region VIII)",
  "Zamboanga Peninsula (Region IX)",
  "Northern Mindanao (Region X)",
  "Davao Region (Region XI)",
  "Soccsksargen (Region XII)",
  "Caraga (Region XIII)",
  "Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)",
];

/**
 * Philippines Provinces by Region
 */
export const PHILIPPINES_PROVINCES: Record<string, string[]> = {
  "National Capital Region (NCR)": [
    "Manila",
    "Quezon City",
    "Caloocan",
    "Las Piñas",
    "Makati",
    "Malabon",
    "Mandaluyong",
    "Marikina",
    "Muntinlupa",
    "Navotas",
    "Parañaque",
    "Pasay",
    "Pasig",
    "San Juan",
    "Taguig",
    "Valenzuela",
  ],
  "Cordillera Administrative Region (CAR)": [
    "Abra",
    "Apayao",
    "Benguet",
    "Ifugao",
    "Kalinga",
    "Mountain Province",
  ],
  "Ilocos Region (Region I)": [
    "Ilocos Norte",
    "Ilocos Sur",
    "La Union",
    "Pangasinan",
  ],
  "Cagayan Valley (Region II)": [
    "Batanes",
    "Cagayan",
    "Isabela",
    "Nueva Vizcaya",
    "Quirino",
  ],
  "Central Luzon (Region III)": [
    "Aurora",
    "Bataan",
    "Bulacan",
    "Nueva Ecija",
    "Pampanga",
    "Tarlac",
    "Zambales",
  ],
  "CALABARZON (Region IV-A)": [
    "Batangas",
    "Cavite",
    "Laguna",
    "Quezon",
    "Rizal",
  ],
  "Mimaropa (Region IV-B)": [
    "Marinduque",
    "Occidental Mindoro",
    "Oriental Mindoro",
    "Palawan",
    "Romblon",
  ],
  "Bicol Region (Region V)": [
    "Albay",
    "Camarines Norte",
    "Camarines Sur",
    "Catanduanes",
    "Masbate",
    "Sorsogon",
  ],
  "Western Visayas (Region VI)": [
    "Aklan",
    "Antique",
    "Capiz",
    "Guimaras",
    "Iloilo",
    "Negros Occidental",
  ],
  "Central Visayas (Region VII)": [
    "Bohol",
    "Cebu",
    "Negros Oriental",
    "Siquijor",
  ],
  "Eastern Visayas (Region VIII)": [
    "Biliran",
    "Eastern Samar",
    "Leyte",
    "Northern Samar",
    "Samar",
    "Southern Leyte",
  ],
  "Zamboanga Peninsula (Region IX)": [
    "Misamis Occidental",
    "Zamboanga del Norte",
    "Zamboanga del Sur",
    "Zamboanga Sibugay",
  ],
  "Northern Mindanao (Region X)": [
    "Bukidnon",
    "Camiguin",
    "Lanao del Norte",
    "Misamis Oriental",
  ],
  "Davao Region (Region XI)": [
    "Davao de Oro",
    "Davao del Norte",
    "Davao del Sur",
    "Davao Occidental",
    "Davao Oriental",
  ],
  "Soccsksargen (Region XII)": [
    "Cotabato",
    "Sarangani",
    "South Cotabato",
    "Sultan Kudarat",
  ],
  "Caraga (Region XIII)": [
    "Agusan del Norte",
    "Agusan del Sur",
    "Dinagat Islands",
    "Surigao del Norte",
    "Surigao del Sur",
  ],
  "Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)": [
    "Basilan",
    "Lanao del Sur",
    "Maguindanao",
    "Sulu",
    "Tawi-Tawi",
  ],
};

/**
 * Philippines Holidays
 */
export const PHILIPPINES_HOLIDAYS = [
  { date: "01-01", name: "New Year's Day", type: "national" },
  { date: "02-10", name: "EDSA Revolution Anniversary", type: "national" },
  { date: "02-25", name: "EDSA Revolution Day", type: "national" },
  { date: "03-28", name: "Maundy Thursday", type: "religious" },
  { date: "03-29", name: "Good Friday", type: "religious" },
  { date: "03-30", name: "Black Saturday", type: "religious" },
  { date: "04-09", name: "Day of Valor (Araw ng Kagitingan)", type: "national" },
  { date: "04-10", name: "Eid'l Fitr", type: "religious" },
  { date: "06-12", name: "Independence Day", type: "national" },
  { date: "06-20", name: "Eid'l Adha", type: "religious" },
  { date: "08-21", name: "Ninoy Aquino Day", type: "national" },
  { date: "08-26", name: "National Heroes Day", type: "national" },
  { date: "11-01", name: "All Saints' Day", type: "religious" },
  { date: "11-30", name: "Bonifacio Day", type: "national" },
  { date: "12-08", name: "Feast of the Immaculate Conception", type: "religious" },
  { date: "12-25", name: "Christmas Day", type: "religious" },
  { date: "12-26", name: "Additional Special Day", type: "national" },
  { date: "12-30", name: "Rizal Day", type: "national" },
  { date: "12-31", name: "New Year's Eve", type: "national" },
];

/**
 * Business Hours Configuration
 */
export const DEFAULT_BUSINESS_HOURS = {
  monday: { open: "09:00", close: "18:00" },
  tuesday: { open: "09:00", close: "18:00" },
  wednesday: { open: "09:00", close: "18:00" },
  thursday: { open: "09:00", close: "18:00" },
  friday: { open: "09:00", close: "18:00" },
  saturday: { open: "10:00", close: "17:00" },
  sunday: { open: "10:00", close: "17:00" },
};

/**
 * Phone Number Configuration
 */
export const PHILIPPINES_PHONE_CONFIG = {
  countryCode: "+63",
  areaCodeLength: 2,
  numberLength: 8,
  totalLength: 10,
  formats: [
    "+63 9XX XXX XXXX",
    "09XX XXX XXXX",
    "+63-9XX-XXX-XXXX",
  ],
};

/**
 * Mobile Network Operators
 */
export const MOBILE_OPERATORS = [
  { code: "0917", name: "Globe Telecom", type: "mobile" },
  { code: "0918", name: "Globe Telecom", type: "mobile" },
  { code: "0919", name: "Globe Telecom", type: "mobile" },
  { code: "0920", name: "Globe Telecom", type: "mobile" },
  { code: "0921", name: "Globe Telecom", type: "mobile" },
  { code: "0922", name: "Globe Telecom", type: "mobile" },
  { code: "0923", name: "Globe Telecom", type: "mobile" },
  { code: "0924", name: "Globe Telecom", type: "mobile" },
  { code: "0925", name: "Globe Telecom", type: "mobile" },
  { code: "0926", name: "Globe Telecom", type: "mobile" },
  { code: "0927", name: "Globe Telecom", type: "mobile" },
  { code: "0928", name: "Globe Telecom", type: "mobile" },
  { code: "0929", name: "Globe Telecom", type: "mobile" },
  { code: "0930", name: "Globe Telecom", type: "mobile" },
  { code: "0931", name: "PLDT/Smart", type: "mobile" },
  { code: "0932", name: "PLDT/Smart", type: "mobile" },
  { code: "0933", name: "PLDT/Smart", type: "mobile" },
  { code: "0934", name: "PLDT/Smart", type: "mobile" },
  { code: "0935", name: "PLDT/Smart", type: "mobile" },
  { code: "0936", name: "PLDT/Smart", type: "mobile" },
  { code: "0937", name: "PLDT/Smart", type: "mobile" },
  { code: "0938", name: "PLDT/Smart", type: "mobile" },
  { code: "0939", name: "PLDT/Smart", type: "mobile" },
  { code: "0940", name: "PLDT/Smart", type: "mobile" },
  { code: "0941", name: "PLDT/Smart", type: "mobile" },
  { code: "0942", name: "PLDT/Smart", type: "mobile" },
  { code: "0943", name: "PLDT/Smart", type: "mobile" },
  { code: "0944", name: "PLDT/Smart", type: "mobile" },
  { code: "0945", name: "PLDT/Smart", type: "mobile" },
  { code: "0946", name: "PLDT/Smart", type: "mobile" },
  { code: "0947", name: "PLDT/Smart", type: "mobile" },
  { code: "0948", name: "PLDT/Smart", type: "mobile" },
  { code: "0949", name: "PLDT/Smart", type: "mobile" },
  { code: "0950", name: "PLDT/Smart", type: "mobile" },
  { code: "0951", name: "PLDT/Smart", type: "mobile" },
  { code: "0952", name: "PLDT/Smart", type: "mobile" },
  { code: "0953", name: "PLDT/Smart", type: "mobile" },
  { code: "0954", name: "PLDT/Smart", type: "mobile" },
  { code: "0955", name: "PLDT/Smart", type: "mobile" },
  { code: "0956", name: "PLDT/Smart", type: "mobile" },
  { code: "0957", name: "PLDT/Smart", type: "mobile" },
  { code: "0958", name: "PLDT/Smart", type: "mobile" },
  { code: "0959", name: "PLDT/Smart", type: "mobile" },
  { code: "0960", name: "PLDT/Smart", type: "mobile" },
  { code: "0961", name: "PLDT/Smart", type: "mobile" },
  { code: "0962", name: "PLDT/Smart", type: "mobile" },
  { code: "0963", name: "PLDT/Smart", type: "mobile" },
  { code: "0964", name: "PLDT/Smart", type: "mobile" },
  { code: "0965", name: "PLDT/Smart", type: "mobile" },
  { code: "0966", name: "PLDT/Smart", type: "mobile" },
  { code: "0967", name: "PLDT/Smart", type: "mobile" },
  { code: "0968", name: "PLDT/Smart", type: "mobile" },
  { code: "0969", name: "PLDT/Smart", type: "mobile" },
  { code: "0970", name: "PLDT/Smart", type: "mobile" },
  { code: "0971", name: "PLDT/Smart", type: "mobile" },
  { code: "0972", name: "PLDT/Smart", type: "mobile" },
  { code: "0973", name: "PLDT/Smart", type: "mobile" },
  { code: "0974", name: "PLDT/Smart", type: "mobile" },
  { code: "0975", name: "PLDT/Smart", type: "mobile" },
  { code: "0976", name: "PLDT/Smart", type: "mobile" },
  { code: "0977", name: "PLDT/Smart", type: "mobile" },
  { code: "0978", name: "PLDT/Smart", type: "mobile" },
  { code: "0979", name: "PLDT/Smart", type: "mobile" },
  { code: "0980", name: "PLDT/Smart", type: "mobile" },
  { code: "0981", name: "PLDT/Smart", type: "mobile" },
  { code: "0982", name: "PLDT/Smart", type: "mobile" },
  { code: "0983", name: "PLDT/Smart", type: "mobile" },
  { code: "0984", name: "PLDT/Smart", type: "mobile" },
  { code: "0985", name: "PLDT/Smart", type: "mobile" },
  { code: "0986", name: "PLDT/Smart", type: "mobile" },
  { code: "0987", name: "PLDT/Smart", type: "mobile" },
  { code: "0988", name: "PLDT/Smart", type: "mobile" },
  { code: "0989", name: "PLDT/Smart", type: "mobile" },
  { code: "0990", name: "PLDT/Smart", type: "mobile" },
  { code: "0991", name: "PLDT/Smart", type: "mobile" },
  { code: "0992", name: "PLDT/Smart", type: "mobile" },
  { code: "0993", name: "PLDT/Smart", type: "mobile" },
  { code: "0994", name: "PLDT/Smart", type: "mobile" },
  { code: "0995", name: "PLDT/Smart", type: "mobile" },
  { code: "0996", name: "PLDT/Smart", type: "mobile" },
  { code: "0997", name: "PLDT/Smart", type: "mobile" },
];

