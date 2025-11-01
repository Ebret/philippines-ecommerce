import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Unauthorized | Philippines E-Commerce",
  description: "You do not have permission to access this page",
};

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Access Denied
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            You do not have permission to access this page.
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-700">
            If you believe this is an error, please contact support.
          </p>
        </div>

        <div className="space-y-2">
          <Link href="/" className="block">
            <Button className="w-full">Go to home page</Button>
          </Link>
          <Link href="/auth/login" className="block">
            <Button variant="outline" className="w-full">
              Sign in with different account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

