import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { VendorStoreSettingsSchema } from "@/lib/validations/vendor";

/**
 * GET /api/vendors/[id]/store
 * Get vendor store details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        storeName: true,
        storeSlug: true,
        description: true,
        logoUrl: true,
        bannerUrl: true,
        status: true,
        rating: true,
        reviewCount: true,
        totalSales: true,
        subscriptionPlan: true,
        subscriptionExpires: true,
        createdAt: true,
      },
    });

    if (!vendor) {
      return NextResponse.json(
        { error: "Vendor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(vendor);
  } catch (error) {
    console.error("Error fetching store:", error);
    return NextResponse.json(
      { error: "Failed to fetch store" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/vendors/[id]/store
 * Update vendor store settings
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get vendor
    const vendor = await prisma.vendor.findUnique({
      where: { id: params.id },
      include: { user: true },
    });

    if (!vendor) {
      return NextResponse.json(
        { error: "Vendor not found" },
        { status: 404 }
      );
    }

    // Check authorization
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Only vendor owner or admin can update
    if (vendor.userId !== user.id && user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = VendorStoreSettingsSchema.parse(body);

    // Update vendor store
    const updatedVendor = await prisma.vendor.update({
      where: { id: params.id },
      data: validatedData,
    });

    return NextResponse.json(updatedVendor);
  } catch (error) {
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json(
        { error: "Invalid store settings" },
        { status: 400 }
      );
    }

    console.error("Error updating store:", error);
    return NextResponse.json(
      { error: "Failed to update store" },
      { status: 500 }
    );
  }
}

