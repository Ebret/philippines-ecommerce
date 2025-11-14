/**
 * GET /api/admin/reports/revenue
 * Generate revenue report with breakdown by payment method
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

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const includeBreakdown = searchParams.get("includeBreakdown") === "true";

    // Build where clause
    const where: any = {
      status: "delivered", // Only count delivered orders as revenue
    };
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    // Fetch orders
    const orders = await prisma.order.findMany({
      where,
      include: {
        payments: true,
      },
    });

    // Calculate metrics
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
    const totalOrders = orders.length;
    const averageRevenue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Calculate breakdown by payment method if requested
    let byPaymentMethod: any = {};
    if (includeBreakdown) {
      byPaymentMethod = orders.reduce((acc: any, order: any) => {
        const method = order.payments?.[0]?.paymentMethod || "unknown";
        if (!acc[method]) {
          acc[method] = { count: 0, total: 0 };
        }
        acc[method].count += 1;
        acc[method].total += Number(order.totalAmount || 0);
        return acc;
      }, {});
    }

    const report = {
      period: {
        startDate: startDate || "all-time",
        endDate: endDate || "all-time",
      },
      metrics: {
        totalRevenue: Number(totalRevenue),
        totalOrders,
        averageRevenue: Number(averageRevenue),
      },
      byPaymentMethod: includeBreakdown ? byPaymentMethod : undefined,
      generatedAt: new Date(),
    };

    return NextResponse.json({ success: true, data: report }, { status: 200 });
  } catch (error) {
    console.error("Error generating revenue report:", error);
    return NextResponse.json(
      { error: "Failed to generate revenue report" },
      { status: 500 }
    );
  }
}

