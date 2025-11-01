/**
 * GET /api/localization/languages
 * Get available languages
 */

import { NextRequest, NextResponse } from "next/server";
import { locales, localeNames, localeNativeNames, localeFlags } from "@/config/i18n";

export async function GET(request: NextRequest) {
  try {
    const languages = locales.map((locale) => ({
      code: locale,
      name: localeNames[locale],
      nativeName: localeNativeNames[locale],
      flag: localeFlags[locale],
    }));

    return NextResponse.json(
      {
        success: true,
        data: languages,
        count: languages.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching languages:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch languages",
      },
      { status: 500 }
    );
  }
}

