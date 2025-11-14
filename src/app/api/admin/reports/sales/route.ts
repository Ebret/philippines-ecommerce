/**
 * GET /api/admin/reports/sales
 * Generate sales report with filters
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
    const vendorId = searchParams.get("vendorId");
    const format = searchParams.get("format") || "json";

    // Build where clause
    const where: any = {};
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }
    if (vendorId) {
      where.items = {
        some: {
          product: {
            vendorId,
          },
        },
      };
    }

    // Fetch orders
    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Calculate metrics
    const totalSales = orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
    const totalItems = orders.reduce((sum, order) => sum + order.items.length, 0);

    const report = {
      period: {
        startDate: startDate || "all-time",
        endDate: endDate || "all-time",
      },
      metrics: {
        totalSales,
        totalOrders,
        averageOrderValue,
        totalItems,
      },
      orders: orders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        status: order.status,
        itemCount: order.items.length,
        createdAt: order.createdAt,
      })),
      generatedAt: new Date(),
    };

    if (format === "csv") {
      const csv = convertToCSV(report);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": "attachment; filename=sales-report.csv",
        },
      });
    }

    return NextResponse.json({ success: true, data: report }, { status: 200 });
  } catch (error) {
    console.error("Error generating sales report:", error);
    return NextResponse.json(
      { error: "Failed to generate sales report" },
      { status: 500 }
    );
  }
}

function convertToCSV(report: any): string {
  const headers = ["Order ID", "Total", "Status", "Item Count", "Created At"];
  const rows = report.orders.map((order: any) => [
    order.id,
    order.total,
    order.status,
    order.itemCount,
    order.createdAt,
  ]);

  const csv = [
    headers.join(","),
    ...rows.map((row: any[]) => row.join(",")),
  ].join("\n");

  return csv;
}

