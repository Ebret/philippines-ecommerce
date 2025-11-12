/**
 * Live Stream Viewers API Routes
 * GET /api/live-streams/[id]/viewers - Get viewers list
 * POST /api/live-streams/[id]/viewers/join - Join stream
 * POST /api/live-streams/[id]/viewers/leave - Leave stream
 * GET /api/live-streams/[id]/viewers/count - Get viewer count
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/live-streams/[id]/viewers
 * Get list of viewers
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "20"));
    const skip = (page - 1) * limit;

    // Verify stream exists
    const stream = await prisma.liveSession.findUnique({
      where: { id },
    });

    if (!stream) {
      return NextResponse.json(
        { success: false, error: "Live stream not found" },
        { status: 404 }
      );
    }

    // Get total count
    const total = await prisma.liveViewer.count({
      where: { sessionId: id },
    });

    // Get viewers
    const viewers = await prisma.liveViewer.findMany({
      where: { sessionId: id },
      include: {
        user: {
          select: {
            id: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        joinedAt: "desc",
      },
      skip,
      take: limit,
    });

    return NextResponse.json(
      {
        success: true,
        data: viewers,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching viewers:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch viewers" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/live-streams/[id]/viewers/join
 * Join a live stream
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Verify stream exists
    const stream = await prisma.liveSession.findUnique({
      where: { id },
    });

    if (!stream) {
      return NextResponse.json(
        { success: false, error: "Live stream not found" },
        { status: 404 }
      );
    }

    // Check if already joined
    const existing = await prisma.liveViewer.findUnique({
      where: {
        sessionId_userId: {
          sessionId: id,
          userId: user.id,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: true,
          data: existing,
          message: "Already joined this stream",
        },
        { status: 200 }
      );
    }

    // Add viewer
    const viewer = await prisma.liveViewer.create({
      data: {
        sessionId: id,
        userId: user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    // Update viewer count
    await prisma.liveSession.update({
      where: { id },
      data: {
        viewerCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: viewer,
        message: "Joined stream successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error joining stream:", error);
    return NextResponse.json(
      { success: false, error: "Failed to join stream" },
      { status: 500 }
    );
  }
}

