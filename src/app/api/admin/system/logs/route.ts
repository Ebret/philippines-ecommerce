/**
 * GET /api/admin/system/logs
 * Get system logs with filtering
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// In-memory log storage (in production, use a proper logging service)
const systemLogs: any[] = [];

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
    const level = searchParams.get("level") || "all";
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Filter logs
    let filteredLogs = systemLogs;
    if (level !== "all") {
      filteredLogs = systemLogs.filter((log) => log.level === level);
    }

    // Paginate
    const paginatedLogs = filteredLogs
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(offset, offset + limit);

    return NextResponse.json(
      {
        success: true,
        data: {
          logs: paginatedLogs,
          total: filteredLogs.length,
          limit,
          offset,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching system logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch system logs" },
      { status: 500 }
    );
  }
}

// Helper function to add logs
export function addSystemLog(level: string, message: string, data?: any) {
  systemLogs.push({
    id: `log-${Date.now()}`,
    level,
    message,
    data,
    timestamp: new Date(),
  });

  // Keep only last 1000 logs
  if (systemLogs.length > 1000) {
    systemLogs.shift();
  }
}

