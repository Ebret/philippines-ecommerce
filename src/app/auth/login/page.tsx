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
      <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="bg-card rounded-xl shadow-lg border border-border p-8">
            <h2 className="text-center font-serif text-3xl font-bold text-primary mb-8">
              Sign in to your account
            </h2>
            <LoginForm />
          </div>
        </div>
      </div>
    </>
  );
}

