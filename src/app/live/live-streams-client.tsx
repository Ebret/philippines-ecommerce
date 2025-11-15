'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { GridSkeleton } from '@/components/loading-skeleton';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface LiveStream {
  id: string;
  title: string;
  description: string;
  status: string;
  vendorId: string;
  vendorName: string;
  viewerCount: number;
  messageCount: number;
  thumbnail?: string;
  startTime: string;
  endTime?: string;
}

export default function LiveStreamsClient() {
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchStreams();
  }, [filter]);

  const fetchStreams = async () => {
    try {
      setLoading(true);
      const url = filter === 'all' 
        ? '/api/live-streams'
        : `/api/live-streams?status=${filter}`;
      
      const response = await fetch(url);
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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
            🔴 Live Selling
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Watch live streams and shop in real-time with exclusive deals
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8 flex flex-wrap gap-3">
          {[
            { value: 'all', label: 'All Streams', icon: '📺' },
            { value: 'LIVE', label: '🔴 Live Now', icon: '' },
            { value: 'SCHEDULED', label: '⏰ Scheduled', icon: '' },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                filter === value
                  ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-lg scale-105'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && <GridSkeleton count={6} />}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-8 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 dark:text-red-200 mb-1">Error Loading Streams</h3>
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

        {/* Streams Grid */}
        {!loading && streams.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {streams.map((stream) => (
              <Link
                key={stream.id}
                href={`/live/${stream.id}`}
                className="group bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden hover:scale-105"
              >
                <div className="relative bg-gray-200 dark:bg-gray-700 h-40 overflow-hidden">
                  {stream.thumbnail && (
                    <img
                      src={stream.thumbnail}
                      alt={stream.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  )}
                  {stream.status === 'LIVE' && (
                    <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                      LIVE
                    </div>
                  )}
                  {stream.status === 'SCHEDULED' && (
                    <div className="absolute top-3 right-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      SCHEDULED
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {stream.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {stream.description}
                  </p>
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">👤 {stream.vendorName}</span>
                    <span className="flex items-center gap-1">👁️ {stream.viewerCount}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && streams.length === 0 && (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
            <div className="text-5xl mb-4">📺</div>
            <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No live streams available
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Check back soon for exciting live selling events!
            </p>
            <button
              onClick={() => fetchStreams()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

