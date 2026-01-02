import { LoginForm } from "@/components/auth/LoginForm";
import Navbar from "@/components/layout/navbar";

export const metadata = {
  title: "Sign In | Philippines E-Commerce",
  description: "Sign in to your account",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen relative">
      {/* PharmaPro Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(155,50%,45%)] via-[hsl(175,45%,38%)] to-[hsl(224,60%,45%)] dark:from-[hsl(155,45%,18%)] dark:via-[hsl(175,40%,15%)] dark:to-[hsl(224,55%,22%)]" />

      {/* Pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 20L20 0v20H0zm20 0L40 0v20H20zm0 0v20l20-20H20zm0 0H0l20 20V20z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <Navbar />

      <div className="relative z-10 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md space-y-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8">
            <h2 className="text-center font-sans text-3xl font-bold text-white mb-2">
              Welcome Back
            </h2>
            <p className="text-center text-white/70 mb-8">
              Sign in to your account to continue
            </p>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}

