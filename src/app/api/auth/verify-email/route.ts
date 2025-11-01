import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { token, email } = await request.json();

    if (!token || !email) {
      return NextResponse.json(
        { error: "Token and email are required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Email already verified" },
        { status: 400 }
      );
    }

    // In a production app, verify the token against stored verification tokens
    // For now, we'll accept any token and mark email as verified
    // TODO: Implement proper token verification with expiration

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true },
      include: { profile: true },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Email verified successfully",
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          emailVerified: updatedUser.emailVerified,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Email verification failed" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      return NextResponse.redirect(
        new URL("/auth/verify-error?reason=missing_params", request.url)
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.redirect(
        new URL("/auth/verify-error?reason=user_not_found", request.url)
      );
    }

    if (user.emailVerified) {
      return NextResponse.redirect(
        new URL("/auth/verify-success?already_verified=true", request.url)
      );
    }

    // Verify email
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true },
    });

    return NextResponse.redirect(
      new URL("/auth/verify-success", request.url)
    );
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.redirect(
      new URL("/auth/verify-error?reason=verification_failed", request.url)
    );
  }
}

