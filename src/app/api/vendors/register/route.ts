import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { VendorRegistrationSchema, generateVendorSlug, isVendorSlugUnique } from "@/lib/vendor-utils";

/**
 * POST /api/vendors/register
 * Register a new vendor/seller
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate input
    const validatedData = VendorRegistrationSchema.parse(body);

    // Check if user already has a vendor account
    const existingVendor = await prisma.vendor.findFirst({
      where: {
        user: { email: session.user.email },
      },
    });

    if (existingVendor) {
      return NextResponse.json(
        { error: "You already have a vendor account" },
        { status: 400 }
      );
    }

    // Check if slug is unique
    const isUnique = await isVendorSlugUnique(validatedData.storeSlug);
    if (!isUnique) {
      return NextResponse.json(
        { error: "Store slug is already taken" },
        { status: 400 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Create vendor account
    const vendor = await prisma.vendor.create({
      data: {
        userId: user.id,
        storeName: validatedData.storeName,
        storeSlug: validatedData.storeSlug,
        description: validatedData.description,
        status: "PENDING",
        profile: {
          create: {
            businessType: validatedData.businessType,
            businessName: validatedData.businessName,
            businessRegistration: validatedData.businessRegistration,
            tin: validatedData.tin,
            bankName: validatedData.bankName,
            bankAccountNumber: validatedData.bankAccountNumber,
            bankAccountName: validatedData.bankAccountName,
            gcashNumber: validatedData.gcashNumber,
            paymayaNumber: validatedData.paymayaNumber,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    // Update user role to SELLER
    await prisma.user.update({
      where: { id: user.id },
      data: { role: "SELLER" },
    });

    return NextResponse.json(
      {
        message: "Vendor registration successful. Awaiting approval.",
        vendor: {
          id: vendor.id,
          storeName: vendor.storeName,
          storeSlug: vendor.storeSlug,
          status: vendor.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json(
        { error: "Invalid registration data" },
        { status: 400 }
      );
    }

    console.error("Error registering vendor:", error);
    return NextResponse.json(
      { error: "Failed to register vendor" },
      { status: 500 }
    );
  }
}

