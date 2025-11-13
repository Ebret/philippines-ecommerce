import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { VendorVerificationSchema } from "@/lib/validations/vendor";

/**
 * PATCH /api/admin/vendors/[id]/verify
 * Approve or reject vendor (admin only)
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

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Get vendor
    const vendor = await prisma.vendor.findUnique({
      where: { id },
    });

    if (!vendor) {
      return NextResponse.json(
        { error: "Vendor not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validatedData = VendorVerificationSchema.parse(body);

    // Update vendor status
    const updatedVendor = await prisma.vendor.update({
      where: { id },
      data: {
        status: validatedData.status,
      },
      include: {
        user: { select: { email: true } },
        profile: true,
      },
    });

    // TODO: Send email notification to vendor about approval/rejection

    return NextResponse.json({
      message: `Vendor ${validatedData.status.toLowerCase()}`,
      vendor: updatedVendor,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json(
        { error: "Invalid verification data" },
        { status: 400 }
      );
    }

    console.error("Error verifying vendor:", error);
    return NextResponse.json(
      { error: "Failed to verify vendor" },
      { status: 500 }
    );
  }
}

