/**
 * Live Stream Detail API Routes
 * GET /api/live-streams/[id] - Get stream details
 * PATCH /api/live-streams/[id] - Update stream
 * DELETE /api/live-streams/[id] - Delete stream
 * POST /api/live-streams/[id]/start - Start stream
 * POST /api/live-streams/[id]/end - End stream
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LiveSessionUpdateSchema } from "@/lib/validations/live-selling";
import { getStreamStatus } from "@/lib/live-selling-utils";

/**
 * GET /api/live-streams/[id]
 * Get live stream details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const stream = await prisma.liveSession.findUnique({
      where: { id },
      include: {
        vendor: {
          select: {
            id: true,
            storeName: true,
            logoUrl: true,
            rating: true,
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
    });

    if (!stream) {
      return NextResponse.json(
        { success: false, error: "Live stream not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: stream,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching live stream:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch live stream" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/live-streams/[id]
 * Update live stream
 */
export async function PATCH(
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

    const body = await request.json();
    const data = LiveSessionUpdateSchema.parse(body);

    // Update stream
    const updated = await prisma.liveSession.update({
      where: { id },
      data,
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
        message: "Live stream updated successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating live stream:", error);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update live stream" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/live-streams/[id]
 * Delete live stream
 */
export async function DELETE(
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

    // Delete stream
    await prisma.liveSession.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Live stream deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting live stream:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete live stream" },
      { status: 500 }
    );
  }
}

