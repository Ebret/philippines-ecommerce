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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-8">
            <h2 className="text-center text-3xl font-extrabold text-neutral-900 dark:text-white mb-4">
              Reset your password
            </h2>
            <p className="text-center text-sm text-neutral-600 dark:text-neutral-400 mb-8">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <ForgotPasswordForm />
          </div>
        </div>
      </div>
    </>
  );
}

