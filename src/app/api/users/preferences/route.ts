import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const preferencesSchema = z.object({
  marketingEmails: z.boolean().optional(),
  orderNotifications: z.boolean().optional(),
  promotionalEmails: z.boolean().optional(),
  abandonedCartEmails: z.boolean().optional(),
  productRecommendations: z.boolean().optional(),
  vendorCommunications: z.boolean().optional(),
  weeklyNewsletter: z.boolean().optional(),
});

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = preferencesSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true },
    });

    if (!user || !user.profile) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Update or create email preferences
    const preferences = await prisma.emailPreferences.upsert({
      where: { userProfileId: user.profile.id },
      update: validatedData,
      create: {
        userProfileId: user.profile.id,
        ...validatedData,
      },
    });

    return NextResponse.json({
      message: "Preferences updated successfully",
      preferences,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error updating preferences:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

