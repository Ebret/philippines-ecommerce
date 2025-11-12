/**
 * Live Streams API Routes
 * GET /api/live-streams - List live streams
 * POST /api/live-streams - Create new live stream
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  LiveSessionCreationSchema,
  LiveSessionQuerySchema,
} from "@/lib/validations/live-selling";

/**
 * GET /api/live-streams
 * List live streams with filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = LiveSessionQuerySchema.parse({
      status: searchParams.get("status"),
      vendorId: searchParams.get("vendorId"),
      search: searchParams.get("search"),
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      sortBy: searchParams.get("sortBy"),
      sortOrder: searchParams.get("sortOrder"),
    });

    const skip = (query.page - 1) * query.limit;

    // Build where clause
    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.vendorId) where.vendorId = query.vendorId;
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { description: { contains: query.search, mode: "insensitive" } },
      ];
    }

    // Get total count
    const total = await prisma.liveSession.count({ where });

    // Get streams
    const streams = await prisma.liveSession.findMany({
      where,
      include: {
        vendor: {
          select: {
            id: true,
            storeName: true,
            logoUrl: true,
          },
        },
        products: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            viewers: true,
            messages: true,
          },
        },
      },
      orderBy: {
        [query.sortBy]: query.sortOrder,
      },
      skip,
      take: query.limit,
    });

    return NextResponse.json(
      {
        success: true,
        data: streams,
        pagination: {
          page: query.page,
          limit: query.limit,
          total,
          pages: Math.ceil(total / query.limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching live streams:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch live streams" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/live-streams
 * Create new live stream
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user and vendor
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { vendor: true },
    });

    if (!user?.vendor) {
      return NextResponse.json(
        { success: false, error: "Only vendors can create live streams" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const data = LiveSessionCreationSchema.parse(body);

    // Create live session
    const liveSession = await prisma.liveSession.create({
      data: {
        vendorId: user.vendor.id,
        title: data.title,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
        streamUrl: data.streamUrl,
        status: "scheduled",
      },
      include: {
        vendor: {
          select: {
            id: true,
            storeName: true,
            logoUrl: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: liveSession,
        message: "Live stream created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating live stream:", error);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create live stream" },
      { status: 500 }
    );
  }
}

