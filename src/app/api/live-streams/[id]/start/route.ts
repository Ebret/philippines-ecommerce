/**
 * Start Live Stream API Route
 * POST /api/live-streams/[id]/start - Start a live stream
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/live-streams/[id]/start
 * Start a live stream
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

    // Get stream and verify ownership
    const stream = await prisma.liveSession.findUnique({
      where: { id },
      include: { vendor: { include: { user: true } } },
    });

    if (!stream) {
      return NextResponse.json(
        { success: false, error: "Live stream not found" },
        { status: 404 }
      );
    }

    if (stream.vendor.user.email !== session.user.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Check if stream can be started
    if (stream.status === "live") {
      return NextResponse.json(
        { success: false, error: "Stream is already live" },
        { status: 400 }
      );
    }

    if (stream.status === "ended") {
      return NextResponse.json(
        { success: false, error: "Cannot restart an ended stream" },
        { status: 400 }
      );
    }

    // Update stream status to live
    const updated = await prisma.liveSession.update({
      where: { id },
      data: {
        status: "live",
        startTime: new Date(),
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
        data: updated,
        message: "Live stream started successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error starting live stream:", error);
    return NextResponse.json(
      { success: false, error: "Failed to start live stream" },
      { status: 500 }
    );
  }
}

