'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { TestimonialCard } from '@/components/testimonials/TestimonialCard';
import { CommentSection } from '@/components/testimonials/CommentSection';
import { RatingComponent } from '@/components/testimonials/RatingComponent';

interface Testimonial {
  id: string;
  title: string;
  content: string;
  rating: number;
  authorName: string;
  authorRole?: string;
  companyName?: string;
  thumbnailUrl?: string;
  mediaType?: 'video' | 'photo';
  videoUrl?: string;
  photoUrl?: string;
  createdAt: string;
  featured?: boolean;
  helpfulCount: number;
  viewCount: number;
}

export default function TestimonialDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHelpful, setIsHelpful] = useState<boolean | null>(null);

  // Fetch testimonial
  useEffect(() => {
    const fetchTestimonial = async () => {
      try {
        setIsLoading(true);
        setError(null);

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

  const handleHelpfulVote = async (helpful: boolean) => {
    try {
      const response = await fetch(`/api/testimonials/${id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ helpful }),
      });

      if (response.ok) {
        setIsHelpful(helpful);
        // Update helpful count
        if (testimonial) {
          setTestimonial({
            ...testimonial,
            helpfulCount: testimonial.helpfulCount + (helpful ? 1 : 0),
          });
        }
      }
    } catch (err) {
      console.error('Failed to vote:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          <p className="text-gray-600 mt-4">Loading testimonial...</p>
        </div>
      </div>
    );
  }

  if (error || !testimonial) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link href="/testimonials" className="text-blue-600 hover:text-blue-700 mb-6 inline-block">
          ← Back to Testimonials
        </Link>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Testimonial Card */}
          <div className="lg:col-span-2">
            <TestimonialCard
              id={testimonial.id}
              title={testimonial.title}
              content={testimonial.content}
              rating={testimonial.rating}
              authorName={testimonial.authorName}
              authorRole={testimonial.authorRole}
              companyName={testimonial.companyName}
              thumbnailUrl={testimonial.thumbnailUrl}
              mediaType={testimonial.mediaType}
              createdAt={testimonial.createdAt}
              featured={testimonial.featured}
            />

            {/* Helpful Section */}
            <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
              <h3 className="font-semibold text-gray-900 mb-4">Was this helpful?</h3>
              <div className="flex gap-4">
                <button
                  onClick={() => handleHelpfulVote(true)}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    isHelpful === true
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  👍 Yes ({testimonial.helpfulCount})
                </button>
                <button
                  onClick={() => handleHelpfulVote(false)}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    isHelpful === false
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  👎 No
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <div className="mt-8">
              <CommentSection
                comments={[]}
                allowComments={true}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Rating Component */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <RatingComponent rating={testimonial.rating} />
            </div>

            {/* Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Views</span>
                  <span className="font-semibold text-gray-900">{testimonial.viewCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Helpful</span>
                  <span className="font-semibold text-gray-900">{testimonial.helpfulCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Posted</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(testimonial.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

