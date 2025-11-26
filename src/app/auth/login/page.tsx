import { LoginForm } from "@/components/auth/LoginForm";
import Navbar from "@/components/layout/navbar";

export const metadata = {
  title: "Sign In | Philippines E-Commerce",
  description: "Sign in to your account",
};

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-8">
            <h2 className="text-center text-3xl font-extrabold text-neutral-900 dark:text-white mb-8">
              Sign in to your account
            </h2>
            <LoginForm />
          </div>
        </div>
      </div>
    </>
  );
}

