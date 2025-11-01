/**
 * GET /api/admin/dashboard
 * Get admin dashboard overview
 */

import { NextRequest, NextResponse } from "next/server";
import {
  calculateTotalRevenue,
  calculateTotalOrders,
  calculateAverageOrderValue,
  calculateUserStats,
  calculateOrderStats,
  calculateProductStats,
  calculateVendorStats,
} from "@/lib/admin-utils";

export async function GET(request: NextRequest) {
  try {
    // Mock data - in production, fetch from database
    const mockOrders = [
      {
        id: "1",
        total: 5000,
        status: "delivered",
        paymentStatus: "completed",
        createdAt: new Date(),
      },
      {
        id: "2",
        total: 3500,
        status: "shipped",
        paymentStatus: "completed",
        createdAt: new Date(),
      },
      {
        id: "3",
        total: 2000,
        status: "pending",
        paymentStatus: "pending",
        createdAt: new Date(),
      },
    ];

    const mockUsers = [
      { id: "1", role: "customer", status: "active" },
      { id: "2", role: "vendor", status: "active" },
      { id: "3", role: "customer", status: "inactive" },
      { id: "4", role: "admin", status: "active" },
    ];

    const mockProducts = [
      { id: "1", status: "active", sales: 150 },
      { id: "2", status: "active", sales: 200 },
      { id: "3", status: "inactive", sales: 0 },
    ];

    const mockVendors = [
      { id: "1", status: "active", sales: 500 },
      { id: "2", status: "active", sales: 300 },
      { id: "3", status: "suspended", sales: 0 },
    ];

    const totalRevenue = calculateTotalRevenue(mockOrders);
    const totalOrders = calculateTotalOrders(mockOrders);
    const averageOrderValue = calculateAverageOrderValue(mockOrders);
    const userStats = calculateUserStats(mockUsers);
    const orderStats = calculateOrderStats(mockOrders);
    const productStats = calculateProductStats(mockProducts);
    const vendorStats = calculateVendorStats(mockVendors);

    return NextResponse.json(
      {
        success: true,
        data: {
          revenue: {
            total: totalRevenue,
            average: averageOrderValue,
          },
          orders: {
            total: totalOrders,
            stats: orderStats,
          },
          users: userStats,
          products: productStats,
          vendors: vendorStats,
          timestamp: new Date(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching dashboard:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch dashboard data",
      },
      { status: 500 }
    );
  }
}

