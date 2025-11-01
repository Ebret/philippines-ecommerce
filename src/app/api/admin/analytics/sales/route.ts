/**
 * GET /api/admin/analytics/sales
 * Get sales analytics
 */

import { NextRequest, NextResponse } from "next/server";
import {
  calculateSalesMetrics,
  calculateSalesByCategory,
  calculateSalesByRegion,
  calculateSalesTrend,
} from "@/lib/analytics-utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = (searchParams.get("period") || "month") as
      | "day"
      | "week"
      | "month";
    const groupBy = searchParams.get("groupBy") || "date";

    // Mock data - in production, fetch from database
    const mockOrders = [
      {
        id: "1",
        total: 5000,
        category: "Electronics",
        region: "NCR",
        createdAt: new Date("2024-01-15"),
      },
      {
        id: "2",
        total: 3500,
        category: "Fashion",
        region: "Calabarzon",
        createdAt: new Date("2024-01-16"),
      },
      {
        id: "3",
        total: 2000,
        category: "Electronics",
        region: "NCR",
        createdAt: new Date("2024-01-17"),
      },
      {
        id: "4",
        total: 4500,
        category: "Home",
        region: "Visayas",
        createdAt: new Date("2024-01-18"),
      },
      {
        id: "5",
        total: 3000,
        category: "Fashion",
        region: "Mindanao",
        createdAt: new Date("2024-01-19"),
      },
    ];

    const metrics = calculateSalesMetrics(mockOrders);
    const byCategory = calculateSalesByCategory(mockOrders);
    const byRegion = calculateSalesByRegion(mockOrders);
    const trend = calculateSalesTrend(mockOrders, period);

    return NextResponse.json(
      {
        success: true,
        data: {
          metrics,
          byCategory,
          byRegion,
          trend,
          period,
          groupBy,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching sales analytics:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch sales analytics",
      },
      { status: 500 }
    );
  }
}

