/**
 * End Live Stream API Route
 * POST /api/live-streams/[id]/end - End a live stream
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/live-streams/[id]/end
 * End a live stream
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get stream and verify ownership
    const stream = await prisma.liveSession.findUnique({
      where: { id: params.id },
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

    // Check if stream is live
    if (stream.status !== "live" && stream.status !== "paused") {
      return NextResponse.json(
        { success: false, error: "Stream is not currently live" },
        { status: 400 }
      );
    }

    // Update stream status to ended
    const updated = await prisma.liveSession.update({
      where: { id: params.id },
      data: {
        status: "ended",
        endTime: new Date(),
      },
      include: {
        vendor: {
          select: {
            id: true,
            storeName: true,
            logoUrl: true,
          },
        },
        _count: {
          select: {
            viewers: true,
            messages: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: updated,
        message: "Live stream ended successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error ending live stream:", error);
    return NextResponse.json(
      { success: false, error: "Failed to end live stream" },
      { status: 500 }
    );
  }
}

