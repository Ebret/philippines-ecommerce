/**
 * GET /api/localization/regions
 * Get Philippines regions and provinces
 */

import { NextRequest, NextResponse } from "next/server";
import {
  PHILIPPINES_REGIONS,
  PHILIPPINES_PROVINCES,
} from "@/config/i18n";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get("region");

    if (region) {
      // Get provinces for specific region
      const provinces = PHILIPPINES_PROVINCES[region];

      if (!provinces) {
        return NextResponse.json(
          {
            success: false,
            error: "Region not found",
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          data: {
            region,
            provinces,
            count: provinces.length,
          },
        },
        { status: 200 }
      );
    }

    // Get all regions
    const regions = PHILIPPINES_REGIONS.map((regionName) => ({
      name: regionName,
      provinces: PHILIPPINES_PROVINCES[regionName] || [],
      provinceCount: (PHILIPPINES_PROVINCES[regionName] || []).length,
    }));

    return NextResponse.json(
      {
        success: true,
        data: regions,
        count: regions.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching regions:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch regions",
      },
      { status: 500 }
    );
  }
}

