'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { StreamListSkeleton } from '@/components/loading-skeleton';
import { AlertCircle, RefreshCw, Play, Square, Eye, MessageCircle, Edit2, Trash2, PlayCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-fade-in">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-lg">
                <PlayCircle className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 dark:from-emerald-400 dark:to-emerald-500 bg-clip-text text-transparent">
                Live Selling Dashboard
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400 ml-0 md:ml-12">
              Manage and monitor your live streaming sessions
            </p>
          </div>
          <Link
            href="/vendor/live/create"
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 dark:from-emerald-500 dark:to-emerald-600 dark:hover:from-emerald-600 dark:hover:to-emerald-700 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 whitespace-nowrap"
          >
            <Play className="w-4 h-4" />
            Create Live Session
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

        {/* Streams Grid */}
        {!loading && streams.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {streams.map((stream) => (
              <div
                key={stream.id}
                className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600"
              >
                {/* Thumbnail Container */}
                <div className="relative h-40 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
                  {stream.thumbnail ? (
                    <img
                      src={stream.thumbnail}
                      alt={stream.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <PlayCircle className="w-12 h-12 text-gray-400 dark:text-gray-600" />
                    </div>
                  )}

                  {/* Play Icon Overlay */}
                  {stream.status !== 'LIVE' && (
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Play className="w-12 h-12 text-white fill-white" />
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    {stream.status === 'LIVE' && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500 text-white rounded-full text-xs font-bold shadow-lg">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        LIVE
                      </div>
                    )}
                    {stream.status === 'SCHEDULED' && (
                      <div className="px-3 py-1.5 bg-amber-500 text-white rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                        ⏰ SCHEDULED
                      </div>
                    )}
                    {stream.status === 'ENDED' && (
                      <div className="px-3 py-1.5 bg-gray-500 text-white rounded-full text-xs font-bold shadow-lg">
                        ENDED
                      </div>
                    )}
                  </div>

                  {/* Viewer Count Badge */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 bg-black/60 text-white rounded-lg text-xs font-semibold backdrop-blur-sm">
                    <Eye className="w-3 h-3" />
                    {stream.viewerCount}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4">
                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {stream.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {stream.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                      <MessageCircle className="w-4 h-4" />
                      <span className="font-semibold">{stream.messageCount}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {stream.status === 'SCHEDULED' && (
                      <button
                        onClick={() => handleStartStream(stream.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 dark:from-emerald-500 dark:to-emerald-600 dark:hover:from-emerald-600 dark:hover:to-emerald-700 text-white rounded-lg font-semibold transition-all duration-200 text-sm"
                      >
                        <Play className="w-4 h-4" />
                        Start
                      </button>
                    )}
                    {stream.status === 'LIVE' && (
                      <button
                        onClick={() => handleEndStream(stream.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 dark:from-red-500 dark:to-red-600 dark:hover:from-red-600 dark:hover:to-red-700 text-white rounded-lg font-semibold transition-all duration-200 text-sm"
                      >
                        <Square className="w-4 h-4" />
                        End
                      </button>
                    )}
                    <Link
                      href={`/live/${stream.id}`}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white rounded-lg font-semibold transition-all duration-200 text-sm"
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
          <div className="text-center py-20 px-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-full mb-6">
              <PlayCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              No live sessions yet
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Start your first live selling session to engage with customers and boost your sales!
            </p>
            <Link
              href="/vendor/live/create"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 dark:from-emerald-500 dark:to-emerald-600 dark:hover:from-emerald-600 dark:hover:to-emerald-700 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Play className="w-4 h-4" />
              Create Your First Live Session
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

