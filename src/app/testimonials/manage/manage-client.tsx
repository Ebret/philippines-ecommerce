'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Testimonial {
  id: string;
  title: string;
  content: string;
  rating: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FEATURED';
  createdAt: string;
  featured?: boolean;
}

type StatusFilter = 'all' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'FEATURED';

export default function ManageTestimonialsClient() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Sign In Required</h1>
          <p className="text-gray-600 mb-6">You must be signed in to manage your testimonials</p>
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

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams({
          page: '1',
          limit: '50',
        });

        if (statusFilter !== 'all') {
          params.append('status', statusFilter);
        }

        const response = await fetch(`/api/testimonials?${params}`);
        if (!response.ok) {
          throw new Error('Failed to fetch testimonials');
        }

        const data = await response.json();
        setTestimonials(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchTestimonials();
    }
  }, [statusFilter, status]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) {
      return;
    }

    try {
      setDeletingId(id);
      const response = await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete testimonial');
      }

      setTestimonials(testimonials.filter(t => t.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
      setDeletingId(null);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          <p className="text-gray-600 mt-4">Loading testimonials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">My Testimonials</h1>
            <p className="text-gray-600 mt-2">Manage your testimonials and track their status</p>
          </div>
          <Link
            href="/testimonials/create"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            + New Testimonial
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="mb-6 flex gap-2 flex-wrap">
          {(['all', 'PENDING', 'APPROVED', 'REJECTED', 'FEATURED'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>

        {testimonials.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600 mb-4">No testimonials found</p>
            <Link
              href="/testimonials/create"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
            >
              Create Your First Testimonial
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{testimonial.title}</h3>
                    <p className="text-gray-600 mt-1 line-clamp-2">{testimonial.content}</p>
                    <div className="mt-3 flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        testimonial.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        testimonial.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        testimonial.status === 'FEATURED' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {testimonial.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Link
                      href={`/testimonials/${testimonial.id}/edit`}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(testimonial.id)}
                      disabled={deletingId === testimonial.id}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      {deletingId === testimonial.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

