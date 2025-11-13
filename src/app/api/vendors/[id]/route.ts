import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { VendorProfileUpdateSchema } from "@/lib/validations/vendor";
import { getVendorWithRelations } from "@/lib/vendor-utils";

/**
 * GET /api/vendors/[id]
 * Get vendor details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const vendor = await getVendorWithRelations(id);

    if (!vendor) {
      return NextResponse.json(
        { error: "Vendor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(vendor);
  } catch (error) {
    console.error("Error fetching vendor:", error);
    return NextResponse.json(
      { error: "Failed to fetch vendor" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/vendors/[id]
 * Update vendor details (seller/admin only)
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
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get vendor
    const vendor = await prisma.vendor.findUnique({
      where: { id: id },
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
    const validatedData = VendorProfileUpdateSchema.parse(body);

    // Update vendor profile
    const updatedVendor = await prisma.vendor.update({
      where: { id: id },
      data: {
        profile: {
          update: validatedData,
        },
      },
      include: { profile: true },
    });

    return NextResponse.json(updatedVendor);
  } catch (error) {
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json(
        { error: "Invalid update data" },
        { status: 400 }
      );
    }

    console.error("Error updating vendor:", error);
    return NextResponse.json(
      { error: "Failed to update vendor" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/vendors/[id]/profile
 * Get vendor profile details
 */
export async function GET_PROFILE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { id: id },
      include: { profile: true },
    });

    if (!vendor) {
      return NextResponse.json(
        { error: "Vendor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(vendor.profile);
  } catch (error) {
    console.error("Error fetching vendor profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch vendor profile" },
      { status: 500 }
    );
  }
}

