/**
 * GET /api/localization/holidays
 * Get Philippines holidays
 */

import { NextRequest, NextResponse } from "next/server";
import { PHILIPPINES_HOLIDAYS } from "@/config/i18n";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year");
    const type = searchParams.get("type");

    let holidays = PHILIPPINES_HOLIDAYS;

    // Filter by type if provided
    if (type && ["national", "religious", "special"].includes(type)) {
      holidays = holidays.filter((h) => h.type === type);
    }

    // Format holidays with full dates if year is provided
    const formattedHolidays = holidays.map((holiday) => {
      const fullDate = year
        ? `${year}-${holiday.date}`
        : `2024-${holiday.date}`;

      return {
        ...holiday,
        fullDate,
        dateObj: new Date(fullDate),
      };
    });

    return NextResponse.json(
      {
        success: true,
        data: formattedHolidays,
        count: formattedHolidays.length,
        filters: {
          year: year || "2024",
          type: type || "all",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching holidays:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch holidays",
      },
      { status: 500 }
    );
  }
}

