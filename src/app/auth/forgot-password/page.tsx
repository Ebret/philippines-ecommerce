import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import Navbar from "@/components/layout/navbar";

export const metadata = {
  title: "Forgot Password | Philippines E-Commerce",
  description: "Reset your password",
};

export default function ForgotPasswordPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="bg-card rounded-xl shadow-lg border border-border p-8">
            <h2 className="text-center font-serif text-3xl font-bold text-primary mb-4">
              Reset your password
            </h2>
            <p className="text-center text-sm text-muted-foreground mb-8">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <ForgotPasswordForm />
          </div>
        </div>
      </div>
    </>
  );
}

