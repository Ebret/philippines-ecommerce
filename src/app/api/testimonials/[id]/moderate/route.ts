import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TestimonialModerationSchema } from "@/lib/validations/testimonials";

/**
 * PATCH /api/testimonials/[id]/moderate
 * Moderate a testimonial (approve, reject, or feature)
 * Only admins can perform this action
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Check authorization (only admins can moderate)
    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Only admins can moderate testimonials" },
        { status: 403 }
      );
    }

    // Get testimonial
    const testimonial = await prisma.testimonial.findUnique({
      where: { id: params.id },
    });

    if (!testimonial) {
      return NextResponse.json(
        { success: false, error: "Testimonial not found" },
        { status: 404 }
      );
    }

    // Parse and validate moderation data
    const body = await request.json();
    const validatedData = TestimonialModerationSchema.parse(body);

    // Update testimonial status
    const updatedTestimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        status: validatedData.status,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
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
        vendor: {
          select: {
            id: true,
            storeName: true,
            storeSlug: true,
          },
        },
        media: true,
      },
    });

    // Log moderation action
    console.log(`Testimonial ${id} moderated by ${user.email}: ${validatedData.status}`);

    return NextResponse.json({
      success: true,
      data: updatedTestimonial,
      message: `Testimonial ${validatedData.status.toLowerCase()} successfully`,
    });
  } catch (error) {
    console.error("Error moderating testimonial:", error);
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to moderate testimonial" },
      { status: 500 }
    );
  }
}

