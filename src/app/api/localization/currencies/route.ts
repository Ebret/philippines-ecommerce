/**
 * GET /api/localization/currencies
 * Get available currencies
 */

import { NextRequest, NextResponse } from "next/server";
import {
  CURRENCY_CODE,
  CURRENCY_SYMBOL,
  CURRENCY_DECIMAL_PLACES,
} from "@/config/i18n";

export async function GET(request: NextRequest) {
  try {
    const currencies = [
      {
        code: CURRENCY_CODE,
        symbol: CURRENCY_SYMBOL,
        name: "Philippine Peso",
        decimalPlaces: CURRENCY_DECIMAL_PLACES,
        isDefault: true,
      },
      {
        code: "USD",
        symbol: "$",
        name: "US Dollar",
        decimalPlaces: 2,
        isDefault: false,
      },
      {
        code: "EUR",
        symbol: "€",
        name: "Euro",
        decimalPlaces: 2,
        isDefault: false,
      },
      {
        code: "GBP",
        symbol: "£",
        name: "British Pound",
        decimalPlaces: 2,
        isDefault: false,
      },
      {
        code: "JPY",
        symbol: "¥",
        name: "Japanese Yen",
        decimalPlaces: 0,
        isDefault: false,
      },
      {
        code: "CNY",
        symbol: "¥",
        name: "Chinese Yuan",
        decimalPlaces: 2,
        isDefault: false,
      },
      {
        code: "SGD",
        symbol: "S$",
        name: "Singapore Dollar",
        decimalPlaces: 2,
        isDefault: false,
      },
      {
        code: "MYR",
        symbol: "RM",
        name: "Malaysian Ringgit",
        decimalPlaces: 2,
        isDefault: false,
      },
      {
        code: "THB",
        symbol: "฿",
        name: "Thai Baht",
        decimalPlaces: 2,
        isDefault: false,
      },
      {
        code: "VND",
        symbol: "₫",
        name: "Vietnamese Dong",
        decimalPlaces: 0,
        isDefault: false,
      },
    ];

    return NextResponse.json(
      {
        success: true,
        data: currencies,
        count: currencies.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching currencies:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch currencies",
      },
      { status: 500 }
    );
  }
}

