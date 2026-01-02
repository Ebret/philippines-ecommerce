"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={onSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-500/20 border border-red-400/30 text-white px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-semibold text-white">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="pl-11 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 focus:ring-white/20"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-semibold text-white">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="pl-11 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 focus:ring-white/20"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-[hsl(25,100%,47%)] hover:bg-[hsl(25,100%,42%)] text-white font-semibold py-3 h-auto shadow-lg shadow-[hsl(25,100%,47%)]/30"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="mt-5 space-y-2 text-center text-sm">
        <Link href="/auth/forgot-password" className="text-white/80 hover:text-white hover:underline transition-colors duration-200">
          Forgot password?
        </Link>
        <div className="text-white/60">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="text-white font-semibold hover:underline transition-colors duration-200">
            Sign up
          </Link>
        </div>
      </div>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/20"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-transparent text-white/60">Or continue with</span>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white font-semibold py-3 h-auto"
          onClick={() => signIn("google")}
          disabled={isLoading}
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white font-semibold py-3 h-auto"
          onClick={() => signIn("facebook")}
          disabled={isLoading}
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Continue with Facebook
        </Button>
      </div>
    </div>
  );
}

