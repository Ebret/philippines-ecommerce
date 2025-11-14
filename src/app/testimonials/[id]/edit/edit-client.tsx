'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { TestimonialForm } from '@/components/testimonials/TestimonialForm';

interface Testimonial {
  id: string;
  title: string;
  content: string;
  rating: number;
  authorName: string;
  authorEmail: string;
  authorRole?: string;
  companyName?: string;
  videoUrl?: string;
  photoUrl?: string;
  userId: string;
}

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

export default function EditTestimonialClient() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const id = params.id as string;

  const [testimonial, setTestimonial] = useState<Testimonial | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestimonial = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/testimonials/${id}`);
        if (!response.ok) {
          throw new Error('Testimonial not found');
        }
        const data = await response.json();
        setTestimonial(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchTestimonial();
    }
  }, [id]);

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Sign In Required</h1>
          <p className="text-gray-600 mb-6">You must be signed in to edit a testimonial</p>
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          <p className="text-gray-600 mt-4">Loading testimonial...</p>
        </div>
      </div>
    );
  }

  if (error || !testimonial) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Testimonial Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The testimonial you are looking for does not exist'}</p>
          <Link
            href="/testimonials"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
          >
            Back to Testimonials
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (data: TestimonialFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch(`/api/testimonials/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          content: data.content,
          rating: data.rating,
          mediaUrls: [data.videoUrl || data.photoUrl].filter(Boolean),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update testimonial');
      }

      router.push(`/testimonials/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link href={`/testimonials/${id}`} className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Back to Testimonial
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">Edit Testimonial</h1>
          <p className="text-gray-600 mt-2">Update your testimonial</p>
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
            initialData={testimonial}
          />
        </div>
      </div>
    </div>
  );
}

