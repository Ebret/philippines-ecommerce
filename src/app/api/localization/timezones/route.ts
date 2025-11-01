/**
 * GET /api/localization/timezones
 * Get available timezones
 */

import { NextRequest, NextResponse } from "next/server";
import { PHILIPPINES_TIMEZONE } from "@/config/i18n";

export async function GET(request: NextRequest) {
  try {
    const timezones = [
      {
        code: "Asia/Manila",
        name: "Philippine Standard Time (PST)",
        offset: "+08:00",
        isDefault: true,
        region: "Philippines",
      },
      {
        code: "UTC",
        name: "Coordinated Universal Time (UTC)",
        offset: "+00:00",
        isDefault: false,
        region: "Universal",
      },
      {
        code: "Asia/Bangkok",
        name: "Indochina Time (ICT)",
        offset: "+07:00",
        isDefault: false,
        region: "Southeast Asia",
      },
      {
        code: "Asia/Hong_Kong",
        name: "Hong Kong Time (HKT)",
        offset: "+08:00",
        isDefault: false,
        region: "East Asia",
      },
      {
        code: "Asia/Tokyo",
        name: "Japan Standard Time (JST)",
        offset: "+09:00",
        isDefault: false,
        region: "East Asia",
      },
      {
        code: "Asia/Shanghai",
        name: "China Standard Time (CST)",
        offset: "+08:00",
        isDefault: false,
        region: "East Asia",
      },
      {
        code: "Asia/Singapore",
        name: "Singapore Standard Time (SGT)",
        offset: "+08:00",
        isDefault: false,
        region: "Southeast Asia",
      },
      {
        code: "Asia/Kolkata",
        name: "Indian Standard Time (IST)",
        offset: "+05:30",
        isDefault: false,
        region: "South Asia",
      },
      {
        code: "Europe/London",
        name: "Greenwich Mean Time (GMT)",
        offset: "+00:00",
        isDefault: false,
        region: "Europe",
      },
      {
        code: "Europe/Paris",
        name: "Central European Time (CET)",
        offset: "+01:00",
        isDefault: false,
        region: "Europe",
      },
      {
        code: "America/New_York",
        name: "Eastern Standard Time (EST)",
        offset: "-05:00",
        isDefault: false,
        region: "North America",
      },
      {
        code: "America/Los_Angeles",
        name: "Pacific Standard Time (PST)",
        offset: "-08:00",
        isDefault: false,
        region: "North America",
      },
      {
        code: "Australia/Sydney",
        name: "Australian Eastern Standard Time (AEST)",
        offset: "+10:00",
        isDefault: false,
        region: "Oceania",
      },
    ];

    return NextResponse.json(
      {
        success: true,
        data: timezones,
        count: timezones.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching timezones:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch timezones",
      },
      { status: 500 }
    );
  }
}

