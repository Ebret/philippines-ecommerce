'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { TestimonialForm } from '@/components/testimonials/TestimonialForm';

interface TestimonialFormData {
  title: string;
  content: string;
  rating: number;
  authorName: string;
  authorEmail: string;
  authorRole?: string;
  companyName?: string;
  videoUrl?: string;
  photoUrl?: string;
}

export default function CreateTestimonialClient() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Sign In Required</h1>
          <p className="text-gray-600 mb-6">You must be signed in to share a testimonial</p>
          <a
            href="/auth/login"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  // Show loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (data: TestimonialFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
          content: data.content,
          rating: data.rating,
          mediaUrls: [data.videoUrl || data.photoUrl].filter(Boolean),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create testimonial');
      }

      const result = await response.json();
      router.push(`/testimonials/${result.data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Share Your Testimonial</h1>
          <p className="text-gray-600 mt-2">Tell us about your experience with our products</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-8">
          <TestimonialForm
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
            initialData={{
              authorName: session?.user?.name || '',
              authorEmail: session?.user?.email || '',
              rating: 5,
              title: '',
              content: '',
            }}
          />
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Tips for a great testimonial:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✓ Be specific about what you liked</li>
            <li>✓ Share your honest experience</li>
            <li>✓ Include photos or videos if possible</li>
            <li>✓ Keep it concise but detailed</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

