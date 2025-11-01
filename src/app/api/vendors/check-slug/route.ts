import { NextRequest, NextResponse } from "next/server";
import { isVendorSlugUnique } from "@/lib/vendor-utils";

/**
 * GET /api/vendors/check-slug?slug=store-name
 * Check if vendor slug is available
 */
export async function GET(request: NextRequest) {
  try {
    const slug = request.nextUrl.searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { error: "Slug parameter is required" },
        { status: 400 }
      );
    }

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json(
        { available: false, reason: "Invalid slug format" },
        { status: 200 }
      );
    }

    if (slug.length < 3 || slug.length > 50) {
      return NextResponse.json(
        { available: false, reason: "Slug must be between 3 and 50 characters" },
        { status: 200 }
      );
    }

    const isUnique = await isVendorSlugUnique(slug);

    return NextResponse.json({
      available: isUnique,
      slug,
    });
  } catch (error) {
    console.error("Error checking slug:", error);
    return NextResponse.json(
      { error: "Failed to check slug availability" },
      { status: 500 }
    );
  }
}

