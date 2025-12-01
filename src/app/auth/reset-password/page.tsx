import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import Navbar from "@/components/layout/navbar";

export const metadata = {
  title: "Reset Password | Philippines E-Commerce",
  description: "Reset your password",
};

export default function ResetPasswordPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="bg-card rounded-xl shadow-lg border border-border p-8">
            <h2 className="text-center font-serif text-3xl font-bold text-primary mb-8">
              Create a new password
            </h2>
            <Suspense fallback={<div className="text-center text-muted-foreground">Loading...</div>}>
              <ResetPasswordForm />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}

