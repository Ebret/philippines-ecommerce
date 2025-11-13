/**
 * Flash Sales API Routes
 * GET /api/live-streams/[id]/flash-sales - Get flash sales
 * POST /api/live-streams/[id]/flash-sales - Create flash sale
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  FlashSaleCreationSchema,
  FlashSaleUpdateSchema,
} from "@/lib/validations/live-selling";
import { calculateFlashSalePrice } from "@/lib/live-selling-utils";

/**
 * GET /api/live-streams/[id]/flash-sales
 * Get flash sales for a live stream
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Get flash sales
    const flashSales = await prisma.liveProduct.findMany({
      where: { sessionId: id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: flashSales,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching flash sales:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch flash sales" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/live-streams/[id]/flash-sales
 * Create a flash sale
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

    const body = await request.json();
    const data = FlashSaleCreationSchema.parse(body);

    // Verify product exists and belongs to vendor
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!product || product.vendorId !== stream.vendorId) {
      return NextResponse.json(
        { success: false, error: "Product not found or does not belong to vendor" },
        { status: 404 }
      );
    }

    // Create flash sale
    const flashSale = await prisma.liveProduct.create({
      data: {
        sessionId: id,
        productId: data.productId,
        specialPrice: data.specialPrice,
        stockLimit: data.stockLimit,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: flashSale,
        message: "Flash sale created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating flash sale:", error);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create flash sale" },
      { status: 500 }
    );
  }
}

