/**
 * Live Stream Chat API Routes
 * GET /api/live-streams/[id]/chat - Get chat messages
 * POST /api/live-streams/[id]/chat/messages - Send chat message
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  ChatMessageSchema,
  ChatMessageQuerySchema,
} from "@/lib/validations/live-selling";
import {
  containsBannedWords,
  isSpamMessage,
  isAllCaps,
  sanitizeMessage,
} from "@/lib/live-selling-utils";

/**
 * GET /api/live-streams/[id]/chat
 * Get chat messages for a live stream
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = ChatMessageQuerySchema.parse({
      sessionId: params.id,
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      sortOrder: searchParams.get("sortOrder"),
    });

    const skip = (query.page - 1) * query.limit;

    // Verify stream exists
    const stream = await prisma.liveSession.findUnique({
      where: { id: params.id },
    });

    if (!stream) {
      return NextResponse.json(
        { success: false, error: "Live stream not found" },
        { status: 404 }
      );
    }

    // Get total count
    const total = await prisma.liveMessage.count({
      where: { sessionId: params.id },
    });

    // Get messages
    const messages = await prisma.liveMessage.findMany({
      where: { sessionId: params.id },
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
        timestamp: query.sortOrder,
      },
      skip,
      take: query.limit,
    });

    return NextResponse.json(
      {
        success: true,
        data: messages,
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
    console.error("Error fetching chat messages:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch chat messages" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/live-streams/[id]/chat/messages
 * Send a chat message
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
      where: { id: params.id },
    });

    if (!stream) {
      return NextResponse.json(
        { success: false, error: "Live stream not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const data = ChatMessageSchema.parse(body);

    // Sanitize message
    const sanitized = sanitizeMessage(data.message);

    // Check for spam/banned content
    if (
      containsBannedWords(sanitized) ||
      isSpamMessage(sanitized) ||
      isAllCaps(sanitized)
    ) {
      return NextResponse.json(
        { success: false, error: "Message violates community guidelines" },
        { status: 400 }
      );
    }

    // Create message
    const message = await prisma.liveMessage.create({
      data: {
        sessionId: params.id,
        userId: user.id,
        message: sanitized,
        timestamp: new Date(),
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

    return NextResponse.json(
      {
        success: true,
        data: message,
        message: "Message sent successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error sending chat message:", error);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to send message" },
      { status: 500 }
    );
  }
}

