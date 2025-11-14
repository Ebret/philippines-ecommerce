/**
 * POST /api/admin/reports/export
 * Export reports in various formats (CSV, JSON, PDF)
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { reportType, format, startDate, endDate } = body;

    if (!reportType || !format) {
      return NextResponse.json(
        { error: "reportType and format are required" },
        { status: 400 }
      );
    }

    // Build where clause
    const where: any = {};
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    let data: any = {};

    if (reportType === "sales") {
      const orders = await prisma.order.findMany({
        where,
        include: { items: true },
      });
      data = {
        type: "sales",
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0),
        orders: orders.map(o => ({
          id: o.id,
          orderNumber: o.orderNumber,
          totalAmount: o.totalAmount,
          status: o.status,
          createdAt: o.createdAt,
        })),
      };
    } else if (reportType === "users") {
      const users = await prisma.user.findMany({
        where: { createdAt: where.createdAt },
      });
      data = {
        type: "users",
        totalUsers: users.length,
        users,
      };
    } else if (reportType === "products") {
      const products = await prisma.product.findMany({
        where: { createdAt: where.createdAt },
      });
      data = {
        type: "products",
        totalProducts: products.length,
        products,
      };
    }

    if (format === "csv") {
      const csv = convertToCSV(data);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename=${reportType}-report.csv`,
        },
      });
    } else if (format === "json") {
      return NextResponse.json(
        { success: true, data },
        { status: 200 }
      );
    } else if (format === "pdf") {
      // For PDF, return JSON with note that PDF generation requires additional library
      return NextResponse.json(
        {
          success: true,
          message: "PDF export requires additional setup",
          data,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: "Unsupported format" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error exporting report:", error);
    return NextResponse.json(
      { error: "Failed to export report" },
      { status: 500 }
    );
  }
}

function convertToCSV(data: any): string {
  if (data.type === "sales") {
    const headers = ["Order ID", "Total", "Status", "Created At"];
    const rows = data.orders.map((order: any) => [
      order.id,
      order.total,
      order.status,
      order.createdAt,
    ]);
    return [headers.join(","), ...rows.map((row: any[]) => row.join(","))].join("\n");
  }
  return "";
}

