'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Redirect page for /auth/signin
 * NextAuth uses /auth/signin by default, but our app uses /auth/login
 * This page redirects users to the correct login page
 */
export default function SignInRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the correct login page
    router.replace('/auth/login');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Redirecting...</h1>
        <p className="text-gray-600">Please wait while we redirect you to the login page.</p>
      </div>
    </div>
  );
}

