import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validateMediaFile, uploadMediaToCDN, extractMediaMetadata } from "@/lib/media-processor";

/**
 * POST /api/testimonials/[id]/upload-media
 * Upload media (video or photo) to a testimonial
 */
export async function POST(
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

    // Check authorization (only creator can upload media)
    if (testimonial.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: "You can only upload media to your own testimonials" },
        { status: 403 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const mediaType = formData.get("mediaType") as "video" | "photo";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    if (!mediaType || !["video", "photo"].includes(mediaType)) {
      return NextResponse.json(
        { success: false, error: "Invalid media type. Must be 'video' or 'photo'" },
        { status: 400 }
      );
    }

    // Validate media file
    const validation = validateMediaFile(file, mediaType);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // Extract metadata
    const metadata = await extractMediaMetadata(file);

    // Upload to CDN
    const cdnPath = `testimonials/${testimonial.id}/${mediaType}s`;
    const mediaUrl = await uploadMediaToCDN(file, cdnPath);

    // Create media record
    const media = await prisma.testimonialMedia.create({
      data: {
        testimonialId: testimonial.id,
        mediaUrl,
        mediaType,
        duration: metadata.duration,
        fileSize: metadata.fileSize,
        mimeType: metadata.mimeType,
      },
    });

    // Update testimonial media arrays
    const updatedTestimonial = await prisma.testimonial.update({
      where: { id: testimonial.id },
      data: {
        mediaUrls: {
          push: mediaUrl,
        },
        mediaTypes: {
          push: mediaType,
        },
      },
      include: {
        media: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          media,
          testimonial: updatedTestimonial,
        },
        message: "Media uploaded successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error uploading media:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload media" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/testimonials/[id]/upload-media
 * Delete media from a testimonial
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check authorization
    if (testimonial.userId !== user.id && user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "You can only delete media from your own testimonials" },
        { status: 403 }
      );
    }

    // Get media ID from query
    const searchParams = request.nextUrl.searchParams;
    const mediaId = searchParams.get("mediaId");

    if (!mediaId) {
      return NextResponse.json(
        { success: false, error: "Media ID is required" },
        { status: 400 }
      );
    }

    // Get media
    const media = await prisma.testimonialMedia.findUnique({
      where: { id: mediaId },
    });

    if (!media || media.testimonialId !== testimonial.id) {
      return NextResponse.json(
        { success: false, error: "Media not found" },
        { status: 404 }
      );
    }

    // Delete media record
    await prisma.testimonialMedia.delete({
      where: { id: mediaId },
    });

    // Update testimonial media arrays
    const mediaUrlIndex = testimonial.mediaUrls.indexOf(media.mediaUrl);
    if (mediaUrlIndex > -1) {
      testimonial.mediaUrls.splice(mediaUrlIndex, 1);
      testimonial.mediaTypes.splice(mediaUrlIndex, 1);
    }

    const updatedTestimonial = await prisma.testimonial.update({
      where: { id: testimonial.id },
      data: {
        mediaUrls: testimonial.mediaUrls,
        mediaTypes: testimonial.mediaTypes,
      },
      include: {
        media: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedTestimonial,
      message: "Media deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting media:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete media" },
      { status: 500 }
    );
  }
}

