/**
 * GET /api/admin/dashboard/kpis
 * Get key performance indicators
 */

import { NextRequest, NextResponse } from "next/server";
import {
  calculateTotalRevenue,
  calculateTotalOrders,
  calculateAverageOrderValue,
  calculateConversionRate,
  calculateCustomerRetentionRate,
  calculateGrowthRate,
} from "@/lib/admin-utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "month";
    const compareWithPrevious = searchParams.get("compareWithPrevious") === "true";

    // Mock data - in production, fetch from database
    const currentOrders = [
      { id: "1", total: 5000, status: "delivered" },
      { id: "2", total: 3500, status: "shipped" },
      { id: "3", total: 2000, status: "pending" },
      { id: "4", total: 4500, status: "delivered" },
      { id: "5", total: 3000, status: "delivered" },
    ];

    const previousOrders = [
      { id: "1", total: 4000, status: "delivered" },
      { id: "2", total: 3000, status: "delivered" },
      { id: "3", total: 2500, status: "delivered" },
    ];

    const currentCustomers = [
      { id: "1", isActive: true, isReturning: true, totalSpent: 15000 },
      { id: "2", isActive: true, isReturning: false, totalSpent: 5000 },
      { id: "3", isActive: false, isReturning: false, totalSpent: 2000 },
    ];

    const previousCustomers = [
      { id: "1", isActive: true, isReturning: true, totalSpent: 10000 },
      { id: "2", isActive: true, isReturning: false, totalSpent: 3000 },
    ];

    const currentRevenue = calculateTotalRevenue(currentOrders);
    const previousRevenue = calculateTotalRevenue(previousOrders);
    const currentOrders_count = calculateTotalOrders(currentOrders);
    const previousOrders_count = calculateTotalOrders(previousOrders);
    const currentAOV = calculateAverageOrderValue(currentOrders);
    const previousAOV = calculateAverageOrderValue(previousOrders);

    const conversionRate = calculateConversionRate(1000, currentOrders_count);
    const retentionRate = calculateCustomerRetentionRate(2, 3);

    const revenueGrowth = calculateGrowthRate(currentRevenue, previousRevenue);
    const orderGrowth = calculateGrowthRate(currentOrders_count, previousOrders_count);
    const aovGrowth = calculateGrowthRate(currentAOV, previousAOV);

    const kpis = {
      revenue: {
        current: currentRevenue,
        previous: compareWithPrevious ? previousRevenue : undefined,
        growth: compareWithPrevious ? revenueGrowth : undefined,
      },
      orders: {
        current: currentOrders_count,
        previous: compareWithPrevious ? previousOrders_count : undefined,
        growth: compareWithPrevious ? orderGrowth : undefined,
      },
      averageOrderValue: {
        current: currentAOV,
        previous: compareWithPrevious ? previousAOV : undefined,
        growth: compareWithPrevious ? aovGrowth : undefined,
      },
      conversionRate: {
        current: conversionRate,
      },
      retentionRate: {
        current: retentionRate,
      },
      period,
      timestamp: new Date(),
    };

    return NextResponse.json(
      {
        success: true,
        data: kpis,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching KPIs:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch KPIs",
      },
      { status: 500 }
    );
  }
}

