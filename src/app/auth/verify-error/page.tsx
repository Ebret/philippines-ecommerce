"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

function VerifyErrorContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  const getErrorMessage = () => {
    switch (reason) {
      case "missing_params":
        return "The verification link is invalid or incomplete.";
      case "user_not_found":
        return "The user account could not be found.";
      case "verification_failed":
        return "An error occurred while verifying your email. Please try again.";
      default:
        return "An error occurred during email verification.";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Verification failed
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {getErrorMessage()}
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">
            Please try registering again or contact support if the problem persists.
          </p>
        </div>

        <div className="space-y-2">
          <Link href="/auth/register" className="block">
            <Button className="w-full">Try registering again</Button>
          </Link>
          <Link href="/auth/login" className="block">
            <Button variant="outline" className="w-full">
              Back to login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyErrorContent />
    </Suspense>
  );
}

