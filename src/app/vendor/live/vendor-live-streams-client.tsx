'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { StreamListSkeleton } from '@/components/loading-skeleton';
import { AlertCircle, RefreshCw, Play, Square, Eye, MessageCircle } from 'lucide-react';

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

export default function VendorLiveStreamsClient() {
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStreams();
  }, []);

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
    <div className="min-h-screen bg-white dark:bg-gray-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
              📡 Live Selling Dashboard
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Manage and monitor your live streaming sessions
            </p>
          </div>
          <Link
            href="/vendor/live/create"
            className="px-6 py-3 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
          >
            + Create Live Session
          </Link>
        </div>

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-8 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 dark:text-red-200 mb-1">Error Loading Sessions</h3>
              <p className="text-red-800 dark:text-red-300 mb-3">{error}</p>
              <button
                onClick={() => fetchStreams()}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && <StreamListSkeleton />}

        {/* Streams List */}
        {!loading && streams.length > 0 && (
          <div className="space-y-4 animate-fade-in">
            {streams.map((stream) => (
              <div
                key={stream.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 border-l-4 border-blue-600 dark:border-blue-400"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {stream.title}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-bold transition-colors ${
                          stream.status === 'LIVE'
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                            : stream.status === 'SCHEDULED'
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                        }`}
                      >
                        {stream.status === 'LIVE' && '🔴 '}
                        {stream.status === 'SCHEDULED' && '⏰ '}
                        {stream.status}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{stream.description}</p>
                    <div className="flex flex-wrap gap-6 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        {stream.viewerCount} viewers
                      </span>
                      <span className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        {stream.messageCount} messages
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    {stream.status === 'SCHEDULED' && (
                      <button
                        onClick={() => handleStartStream(stream.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                      >
                        <Play className="w-4 h-4" />
                        Start
                      </button>
                    )}
                    {stream.status === 'LIVE' && (
                      <button
                        onClick={() => handleEndStream(stream.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                      >
                        <Square className="w-4 h-4" />
                        End
                      </button>
                    )}
                    <Link
                      href={`/live/${stream.id}`}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && streams.length === 0 && (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
            <div className="text-5xl mb-4">📡</div>
            <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No live sessions yet
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create your first live session to start selling!
            </p>
            <Link
              href="/vendor/live/create"
              className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
            >
              Create Your First Live Session
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

