import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { VendorTestimonialDashboardSchema } from "@/lib/validations/testimonials";

/**
 * GET /api/vendors/testimonials/dashboard
 * Get testimonial dashboard data for a vendor
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
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

    // Get vendor
    const vendor = await prisma.vendor.findUnique({
      where: { userId: user.id },
    });

    if (!vendor) {
      return NextResponse.json(
        { success: false, error: "Vendor not found" },
        { status: 404 }
      );
    }

    // Parse and validate query parameters
    const searchParams = request.nextUrl.searchParams;
    const queryData = {
      timeRange: searchParams.get("timeRange") || "30d",
      sortBy: searchParams.get("sortBy") || "date",
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "20"),
    };

    const validatedQuery = VendorTestimonialDashboardSchema.parse(queryData);

    // Calculate date range
    const now = new Date();
    let startDate = new Date();

    switch (validatedQuery.timeRange) {
      case "7d":
        startDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(now.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(now.getDate() - 90);
        break;
      case "1y":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case "all":
        startDate = new Date(0);
        break;
    }

    // Build sort order
    let orderBy: any = { createdAt: "desc" };
    if (validatedQuery.sortBy === "rating") {
      orderBy = { rating: "desc" };
    } else if (validatedQuery.sortBy === "helpful") {
      orderBy = { helpfulCount: "desc" };
    }

    // Calculate pagination
    const skip = (validatedQuery.page - 1) * validatedQuery.limit;

    // Fetch testimonials
    const [testimonials, total, stats] = await Promise.all([
      prisma.testimonial.findMany({
        where: {
          vendorId: vendor.id,
          createdAt: {
            gte: startDate,
          },
        },
        orderBy,
        skip,
        take: validatedQuery.limit,
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
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          media: true,
        },
      }),
      prisma.testimonial.count({
        where: {
          vendorId: vendor.id,
          createdAt: {
            gte: startDate,
          },
        },
      }),
      // Get statistics
      prisma.testimonial.aggregate({
        where: {
          vendorId: vendor.id,
          createdAt: {
            gte: startDate,
          },
        },
        _avg: {
          rating: true,
        },
        _count: {
          id: true,
        },
      }),
    ]);

    // Calculate additional stats
    const approvedCount = await prisma.testimonial.count({
      where: {
        vendorId: vendor.id,
        status: "APPROVED",
        createdAt: {
          gte: startDate,
        },
      },
    });

    const pendingCount = await prisma.testimonial.count({
      where: {
        vendorId: vendor.id,
        status: "PENDING",
        createdAt: {
          gte: startDate,
        },
      },
    });

    const featuredCount = await prisma.testimonial.count({
      where: {
        vendorId: vendor.id,
        status: "FEATURED",
        createdAt: {
          gte: startDate,
        },
      },
    });

    const totalHelpful = testimonials.reduce((sum, t) => sum + t.helpfulCount, 0);
    const totalViews = testimonials.reduce((sum, t) => sum + t.viewCount, 0);

    return NextResponse.json({
      success: true,
      data: {
        testimonials,
        stats: {
          total,
          approved: approvedCount,
          pending: pendingCount,
          featured: featuredCount,
          averageRating: stats._avg.rating || 0,
          totalHelpful,
          totalViews,
        },
        pagination: {
          page: validatedQuery.page,
          limit: validatedQuery.limit,
          total,
          pages: Math.ceil(total / validatedQuery.limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching vendor testimonial dashboard:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}

