import { NextRequest, NextResponse } from "next/server";
import { VendorSearchSchema } from "@/lib/validations/vendor";
import { searchVendors } from "@/lib/vendor-utils";

/**
 * GET /api/vendors/search
 * Search and filter vendors
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse search parameters
    const query = searchParams.get("query") || undefined;
    const status = searchParams.get("status") || undefined;
    const minRating = searchParams.get("minRating")
      ? parseFloat(searchParams.get("minRating")!)
      : undefined;
    const sortBy = (searchParams.get("sortBy") || "newest") as
      | "newest"
      | "rating"
      | "sales"
      | "name";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);

    // Validate search parameters
    const validatedParams = VendorSearchSchema.parse({
      query,
      status,
      minRating,
      sortBy,
      page,
      limit,
    });

    const offset = (validatedParams.page - 1) * validatedParams.limit;

    // Search vendors
    const { vendors, total } = await searchVendors(
      validatedParams.query,
      validatedParams.status,
      validatedParams.minRating,
      validatedParams.limit,
      offset
    );

    return NextResponse.json({
      vendors,
      pagination: {
        page: validatedParams.page,
        limit: validatedParams.limit,
        total,
        pages: Math.ceil(total / validatedParams.limit),
      },
      filters: {
        query: validatedParams.query,
        status: validatedParams.status,
        minRating: validatedParams.minRating,
        sortBy: validatedParams.sortBy,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json(
        { error: "Invalid search parameters" },
        { status: 400 }
      );
    }

    console.error("Error searching vendors:", error);
    return NextResponse.json(
      { error: "Failed to search vendors" },
      { status: 500 }
    );
  }
}

