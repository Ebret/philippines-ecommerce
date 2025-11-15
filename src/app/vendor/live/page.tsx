'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface LiveStream {
  id: string;
  title: string;
  description: string;
  status: string;
  viewerCount: number;
  messageCount: number;
  startTime: string;
  endTime?: string;
  thumbnail?: string;
}

export default function VendorLiveStreamsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.email) {
      fetchStreams();
    }
  }, [session]);

  const fetchStreams = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/live-streams');
      if (!response.ok) throw new Error('Failed to fetch streams');
      
      const data = await response.json();
      setStreams(data.data || data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load streams');
    } finally {
      setLoading(false);
    }
  };

  const handleStartStream = async (streamId: string) => {
    try {
      const response = await fetch(`/api/live-streams/${streamId}/start`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to start stream');
      fetchStreams();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start stream');
    }
  };

  const handleEndStream = async (streamId: string) => {
    try {
      const response = await fetch(`/api/live-streams/${streamId}/end`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to end stream');
      fetchStreams();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to end stream');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Live Selling Dashboard</h1>
            <p className="text-gray-600">Manage your live streaming sessions</p>
          </div>
          <Link
            href="/vendor/live/create"
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
          >
            + Create Live Session
          </Link>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800">Error: {error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600">Loading your live sessions...</p>
          </div>
        )}

        {/* Streams List */}
        {!loading && streams.length > 0 && (
          <div className="space-y-4">
            {streams.map((stream) => (
              <div
                key={stream.id}
                className="bg-white rounded-lg shadow p-6 flex justify-between items-center"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{stream.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      stream.status === 'LIVE'
                        ? 'bg-red-100 text-red-800'
                        : stream.status === 'SCHEDULED'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {stream.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{stream.description}</p>
                  <div className="flex gap-6 text-sm text-gray-500">
                    <span>👁️ {stream.viewerCount} viewers</span>
                    <span>💬 {stream.messageCount} messages</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  {stream.status === 'SCHEDULED' && (
                    <button
                      onClick={() => handleStartStream(stream.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
                    >
                      Start
                    </button>
                  )}
                  {stream.status === 'LIVE' && (
                    <button
                      onClick={() => handleEndStream(stream.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
                    >
                      End
                    </button>
                  )}
                  <Link
                    href={`/live/${stream.id}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && streams.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600 text-lg mb-4">No live sessions yet</p>
            <Link
              href="/vendor/live/create"
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
            >
              Create Your First Live Session
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

