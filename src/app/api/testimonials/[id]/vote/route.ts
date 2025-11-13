import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TestimonialVoteSchema } from "@/lib/validations/testimonials";

/**
 * POST /api/testimonials/[id]/vote
 * Vote on whether a testimonial is helpful or not
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Check authentication (optional - allow anonymous votes)
    const session = await getServerSession(authOptions);
    const userId = session?.user?.email ?
      (await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      }))?.id : null;

    // Get testimonial
    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
    });

    if (!testimonial) {
      return NextResponse.json(
        { success: false, error: "Testimonial not found" },
        { status: 404 }
      );
    }

    // Parse and validate vote data
    const body = await request.json();
    const validatedData = TestimonialVoteSchema.parse(body);

    // Update vote counts
    let updatedTestimonial;
    
    if (validatedData.voteType === "helpful") {
      updatedTestimonial = await prisma.testimonial.update({
        where: { id: id },
        data: {
          helpfulCount: {
            increment: 1,
          },
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
    } else if (validatedData.voteType === "unhelpful") {
      updatedTestimonial = await prisma.testimonial.update({
        where: { id: id },
        data: {
          notHelpfulCount: {
            increment: 1,
          },
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
    }

    return NextResponse.json({
      success: true,
      data: updatedTestimonial,
      message: `Testimonial marked as ${validatedData.voteType}`,
    });
  } catch (error) {
    console.error("Error voting on testimonial:", error);
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to vote on testimonial" },
      { status: 500 }
    );
  }
}

