// Email utility functions
// In production, integrate with SendGrid, Mailgun, or similar service

export async function sendVerificationEmail(email: string, token: string) {
  try {
    const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

    // TODO: Integrate with email service (SendGrid, Mailgun, etc.)
    console.log(`Verification email would be sent to ${email}`);
    console.log(`Verification URL: ${verificationUrl}`);

    // For development, just log the token
    if (process.env.NODE_ENV === "development") {
      console.log(`[DEV] Verification token: ${token}`);
    }

    return true;
  } catch (error) {
    console.error("Failed to send verification email:", error);
    throw error;
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  try {
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    // TODO: Integrate with email service (SendGrid, Mailgun, etc.)
    console.log(`Password reset email would be sent to ${email}`);
    console.log(`Reset URL: ${resetUrl}`);

    // For development, just log the token
    if (process.env.NODE_ENV === "development") {
      console.log(`[DEV] Reset token: ${token}`);
    }

    return true;
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    throw error;
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    // TODO: Integrate with email service (SendGrid, Mailgun, etc.)
    console.log(`Welcome email would be sent to ${email} for ${name}`);

    return true;
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    throw error;
  }
}

export async function sendOrderConfirmationEmail(
  email: string,
  orderId: string,
  orderTotal: number
) {
  try {
    // TODO: Integrate with email service (SendGrid, Mailgun, etc.)
    console.log(
      `Order confirmation email would be sent to ${email} for order ${orderId}`
    );

    return true;
  } catch (error) {
    console.error("Failed to send order confirmation email:", error);
    throw error;
  }
}

