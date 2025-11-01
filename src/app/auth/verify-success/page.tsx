"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function VerifySuccessPage() {
  const searchParams = useSearchParams();
  const alreadyVerified = searchParams.get("already_verified");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            {alreadyVerified ? "Email already verified" : "Email verified!"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {alreadyVerified
              ? "Your email was already verified. You can now sign in to your account."
              : "Your email has been successfully verified. You can now sign in to your account."}
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-700">
            Your account is now active and ready to use.
          </p>
        </div>

        <Link href="/auth/login" className="block">
          <Button className="w-full">Sign in to your account</Button>
        </Link>
      </div>
    </div>
  );
}

