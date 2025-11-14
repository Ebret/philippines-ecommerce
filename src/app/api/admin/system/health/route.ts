/**
 * GET /api/admin/system/health
 * Get system health status
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const startTime = Date.now();

    // Check database connection
    let dbStatus = "healthy";
    let dbResponseTime = 0;
    try {
      const dbStart = Date.now();
      await prisma.user.count();
      dbResponseTime = Date.now() - dbStart;
    } catch (error) {
      dbStatus = "unhealthy";
    }

    // Check API response time
    const apiResponseTime = Date.now() - startTime;

    // Get system metrics
    const totalUsers = await prisma.user.count();
    const totalOrders = await prisma.order.count();
    const totalProducts = await prisma.product.count();
    const totalVendors = await prisma.vendor.count();

    const health = {
      status: dbStatus === "healthy" ? "healthy" : "degraded",
      timestamp: new Date(),
      database: {
        status: dbStatus,
        responseTime: `${dbResponseTime}ms`,
      },
      api: {
        responseTime: `${apiResponseTime}ms`,
      },
      metrics: {
        totalUsers,
        totalOrders,
        totalProducts,
        totalVendors,
      },
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      },
    };

    return NextResponse.json({ success: true, data: health }, { status: 200 });
  } catch (error) {
    console.error("Error checking system health:", error);
    return NextResponse.json(
      {
        success: false,
        status: "unhealthy",
        error: "Failed to check system health",
      },
      { status: 500 }
    );
  }
}

