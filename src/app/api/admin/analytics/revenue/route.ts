/**
 * GET /api/admin/analytics/revenue
 * Get revenue analytics
 */

import { NextRequest, NextResponse } from "next/server";
import {
  calculateRevenueMetrics,
  calculateRevenueByPaymentMethod,
  calculateRevenueTrend,
} from "@/lib/analytics-utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = (searchParams.get("period") || "month") as
      | "day"
      | "week"
      | "month";
    const includeBreakdown = searchParams.get("includeBreakdown") === "true";
    const includeTax = searchParams.get("includeTax") === "true";

    // Mock data - in production, fetch from database
    const mockOrders = [
      {
        id: "1",
        total: 5000,
        tax: 600,
        commission: 500,
        paymentMethod: "GCash",
        createdAt: new Date("2024-01-15"),
      },
      {
        id: "2",
        total: 3500,
        tax: 420,
        commission: 350,
        paymentMethod: "PayMaya",
        createdAt: new Date("2024-01-16"),
      },
      {
        id: "3",
        total: 2000,
        tax: 240,
        commission: 200,
        paymentMethod: "Credit Card",
        createdAt: new Date("2024-01-17"),
      },
      {
        id: "4",
        total: 4500,
        tax: 540,
        commission: 450,
        paymentMethod: "COD",
        createdAt: new Date("2024-01-18"),
      },
      {
        id: "5",
        total: 3000,
        tax: 360,
        commission: 300,
        paymentMethod: "GCash",
        createdAt: new Date("2024-01-19"),
      },
    ];

    const metrics = calculateRevenueMetrics(mockOrders);
    const byPaymentMethod = includeBreakdown
      ? calculateRevenueByPaymentMethod(mockOrders)
      : undefined;
    const trend = calculateRevenueTrend(mockOrders, period);

    return NextResponse.json(
      {
        success: true,
        data: {
          metrics,
          byPaymentMethod,
          trend,
          period,
          includeBreakdown,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching revenue analytics:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch revenue analytics",
      },
      { status: 500 }
    );
  }
}

