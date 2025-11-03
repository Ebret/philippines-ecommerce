import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TestimonialCreationSchema, TestimonialQuerySchema } from "@/lib/validations/testimonials";
import { validateMediaFile } from "@/lib/media-processor";

/**
 * GET /api/testimonials
 * List testimonials with filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse and validate query parameters
    const queryData = {
      productId: searchParams.get("productId") || undefined,
      vendorId: searchParams.get("vendorId") || undefined,
      status: searchParams.get("status") || undefined,
      isFeatured: searchParams.get("isFeatured") === "true" || undefined,
      minRating: searchParams.get("minRating") ? parseInt(searchParams.get("minRating")!) : undefined,
      maxRating: searchParams.get("maxRating") ? parseInt(searchParams.get("maxRating")!) : undefined,
      sortBy: searchParams.get("sortBy") || "createdAt",
      sortOrder: searchParams.get("sortOrder") || "desc",
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "10"),
    };

    const validatedQuery = TestimonialQuerySchema.parse(queryData);

    // Build where clause
    const where: any = {
      status: "APPROVED", // Only show approved testimonials by default
    };

    if (validatedQuery.productId) {
      where.productId = validatedQuery.productId;
    }

    if (validatedQuery.vendorId) {
      where.vendorId = validatedQuery.vendorId;
    }

    if (validatedQuery.isFeatured) {
      where.isFeatured = true;
    }

    if (validatedQuery.minRating || validatedQuery.maxRating) {
      where.rating = {};
      if (validatedQuery.minRating) {
        where.rating.gte = validatedQuery.minRating;
      }
      if (validatedQuery.maxRating) {
        where.rating.lte = validatedQuery.maxRating;
      }
    }

    // Calculate pagination
    const skip = (validatedQuery.page - 1) * validatedQuery.limit;

    // Build sort order
    const orderBy: any = {};
    orderBy[validatedQuery.sortBy] = validatedQuery.sortOrder;

    // Fetch testimonials
    const [testimonials, total] = await Promise.all([
      prisma.testimonial.findMany({
        where,
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
      prisma.testimonial.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: testimonials,
      pagination: {
        page: validatedQuery.page,
        limit: validatedQuery.limit,
        total,
        pages: Math.ceil(total / validatedQuery.limit),
      },
    });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/testimonials
 * Create a new testimonial
 */
export async function POST(request: NextRequest) {
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

    // Parse request body
    const body = await request.json();
    const validatedData = TestimonialCreationSchema.parse(body);

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: validatedData.productId },
      include: { vendor: true },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Verify user has purchased this product
    const order = await prisma.order.findFirst({
      where: {
        userId: user.id,
        items: {
          some: {
            productId: validatedData.productId,
          },
        },
        status: {
          in: ["DELIVERED", "COMPLETED"],
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "You must purchase this product to leave a testimonial" },
        { status: 403 }
      );
    }

    // Create testimonial
    const testimonial = await prisma.testimonial.create({
      data: {
        productId: validatedData.productId,
        vendorId: product.vendorId,
        userId: user.id,
        rating: validatedData.rating,
        title: validatedData.title,
        content: validatedData.content,
        mediaUrls: validatedData.mediaUrls || [],
        mediaTypes: validatedData.mediaUrls?.map(() => "photo") || [],
        beforeAfterComparison: validatedData.beforeAfterComparison,
        status: "PENDING", // Testimonials require moderation
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
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        media: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: testimonial,
        message: "Testimonial created successfully. It will be reviewed before publication.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating testimonial:", error);
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}

