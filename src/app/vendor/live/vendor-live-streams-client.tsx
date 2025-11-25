'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { StreamListSkeleton } from '@/components/loading-skeleton';
import { AlertCircle, RefreshCw, Play, Square, Eye, MessageCircle, Edit2, Trash2, PlayCircle, Zap, TrendingUp, Users } from 'lucide-react';
import Navbar from '@/components/layout/navbar';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <Navbar />
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
        {/* Header with Enhanced Design */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-fade-in">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <PlayCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 dark:from-emerald-400 dark:to-emerald-500 bg-clip-text text-transparent">
                  Live Selling Dashboard
                </h1>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                  Manage and monitor your live streaming sessions
                </p>
              </div>
            </div>
          </div>
          <Link
            href="/vendor/live/create"
            className="px-7 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 dark:from-emerald-500 dark:to-emerald-600 dark:hover:from-emerald-600 dark:hover:to-emerald-700 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 flex items-center gap-2 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
            aria-label="Create a new live selling session"
            title="Create a new live selling session"
          >
            <Play className="w-5 h-5" />
            Create Live Session
          </Link>
        </div>

        {/* Error State - Enhanced */}
        {error && !loading && (
          <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/20 border-2 border-red-200 dark:border-red-700 rounded-xl p-6 mb-8 flex items-start gap-4 shadow-md hover:shadow-lg transition-shadow duration-300">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5 animate-pulse" />
            <div className="flex-1">
              <h3 className="font-bold text-lg text-red-900 dark:text-red-200 mb-2">Error Loading Sessions</h3>
              <p className="text-red-800 dark:text-red-300 mb-4 text-sm">{error}</p>
              <button
                onClick={() => fetchStreams()}
                className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 dark:from-red-600 dark:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800 text-white rounded-lg font-semibold transition-all duration-200 hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                aria-label="Retry loading live streams"
                title="Retry loading live streams"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && <StreamListSkeleton />}

        {/* Streams Grid - Enhanced */}
        {!loading && streams.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {streams.map((stream) => (
              <div
                key={stream.id}
                className="group bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-emerald-400 dark:hover:border-emerald-500 hover:scale-105 active:scale-100"
              >
                {/* Thumbnail Container - Enhanced */}
                <div className="relative h-48 bg-gradient-to-br from-gray-200 via-gray-250 to-gray-300 dark:from-gray-700 dark:via-gray-750 dark:to-gray-800 overflow-hidden">
                  {stream.thumbnail ? (
                    <img
                      src={stream.thumbnail}
                      alt={stream.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:to-emerald-800/20">
                      <PlayCircle className="w-16 h-16 text-emerald-400 dark:text-emerald-500 opacity-60" />
                    </div>
                  )}

                  {/* Play Icon Overlay - Enhanced */}
                  {stream.status !== 'LIVE' && (
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="p-3 bg-emerald-600 dark:bg-emerald-500 rounded-full shadow-lg">
                        <Play className="w-8 h-8 text-white fill-white" />
                      </div>
                    </div>
                  )}

                  {/* Status Badge - Enhanced */}
                  <div className="absolute top-3 right-3">
                    {stream.status === 'LIVE' && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 dark:from-red-600 dark:to-red-700 text-white rounded-full text-xs font-bold shadow-lg hover:shadow-xl transition-shadow">
                        <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                        LIVE
                      </div>
                    )}
                    {stream.status === 'SCHEDULED' && (
                      <div className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700 text-white rounded-full text-xs font-bold shadow-lg hover:shadow-xl transition-shadow flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5" />
                        SCHEDULED
                      </div>
                    )}
                    {stream.status === 'ENDED' && (
                      <div className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 dark:from-gray-600 dark:to-gray-700 text-white rounded-full text-xs font-bold shadow-lg">
                        ENDED
                      </div>
                    )}
                  </div>

                  {/* Viewer Count Badge - Enhanced */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5 bg-black/70 hover:bg-black/80 text-white rounded-lg text-xs font-semibold backdrop-blur-md transition-all duration-200 shadow-lg">
                    <Users className="w-3.5 h-3.5" />
                    {stream.viewerCount}
                  </div>
                </div>

                {/* Card Content - Enhanced */}
                <div className="p-5 flex flex-col h-full">
                  {/* Title - Enhanced */}
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                    {stream.title}
                  </h3>

                  {/* Description - Enhanced */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 flex-grow">
                    {stream.description}
                  </p>

                  {/* Stats - Enhanced */}
                  <div className="flex items-center gap-4 mb-5 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300 font-semibold">
                      <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>{stream.messageCount}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300 font-semibold">
                      <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>{stream.viewerCount}</span>
                    </div>
                  </div>

                  {/* Action Buttons - Enhanced */}
                  <div className="flex gap-2">
                    {stream.status === 'SCHEDULED' && (
                      <button
                        onClick={() => handleStartStream(stream.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 dark:from-emerald-500 dark:to-emerald-600 dark:hover:from-emerald-600 dark:hover:to-emerald-700 text-white rounded-lg font-semibold transition-all duration-200 text-sm shadow-md hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                        aria-label={`Start live stream: ${stream.title}`}
                        title={`Start live stream: ${stream.title}`}
                      >
                        <Play className="w-4 h-4" />
                        Start
                      </button>
                    )}
                    {stream.status === 'LIVE' && (
                      <button
                        onClick={() => handleEndStream(stream.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 dark:from-red-500 dark:to-red-600 dark:hover:from-red-600 dark:hover:to-red-700 text-white rounded-lg font-semibold transition-all duration-200 text-sm shadow-md hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                        aria-label={`End live stream: ${stream.title}`}
                        title={`End live stream: ${stream.title}`}
                      >
                        <Square className="w-4 h-4" />
                        End
                      </button>
                    )}
                    <Link
                      href={`/live/${stream.id}`}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white rounded-lg font-semibold transition-all duration-200 text-sm shadow-md hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                      aria-label={`View live stream: ${stream.title}`}
                      title={`View live stream: ${stream.title}`}
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

        {/* Empty State - Enhanced */}
        {!loading && streams.length === 0 && (
          <div className="text-center py-24 px-6 bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-emerald-900/20 dark:via-gray-800 dark:to-blue-900/20 rounded-2xl border-2 border-dashed border-emerald-300 dark:border-emerald-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/40 dark:to-emerald-800/40 rounded-full mb-6 shadow-lg">
              <PlayCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400 animate-bounce" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              No live sessions yet
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto text-lg leading-relaxed">
              Start your first live selling session to engage with customers and boost your sales!
            </p>
            <Link
              href="/vendor/live/create"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 dark:from-emerald-500 dark:to-emerald-600 dark:hover:from-emerald-600 dark:hover:to-emerald-700 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
              aria-label="Create your first live selling session"
              title="Create your first live selling session"
            >
              <Play className="w-5 h-5" />
              Create Your First Live Session
            </Link>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

