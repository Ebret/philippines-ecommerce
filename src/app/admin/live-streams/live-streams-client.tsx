'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { StreamListSkeleton } from '@/components/loading-skeleton';
import { AlertCircle, RefreshCw, Eye, TrendingUp } from 'lucide-react';

interface LiveStream {
  id: string;
  title: string;
  description: string;
  status: string;
  vendorId: string;
  vendorName: string;
  viewerCount: number;
  messageCount: number;
  startTime: string;
  endTime?: string;
  thumbnail?: string;
}

export default function AdminLiveStreamsClient() {
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

  // Calculate statistics
  const stats = {
    total: streams.length,
    live: streams.filter(s => s.status === 'LIVE').length,
    scheduled: streams.filter(s => s.status === 'SCHEDULED').length,
    totalViewers: streams.reduce((sum, s) => sum + s.viewerCount, 0),
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
            📊 Live Streams Management
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Monitor and manage all live selling sessions
          </p>
        </div>

        {/* Statistics Cards */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Streams', value: stats.total, icon: '📺', color: 'blue' },
              { label: 'Live Now', value: stats.live, icon: '🔴', color: 'red' },
              { label: 'Scheduled', value: stats.scheduled, icon: '⏰', color: 'yellow' },
              { label: 'Total Viewers', value: stats.totalViewers, icon: '👁️', color: 'green' },
            ].map((stat, i) => (
              <div
                key={i}
                className={`bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 dark:from-${stat.color}-900/20 dark:to-${stat.color}-900/10 rounded-lg p-6 border border-${stat.color}-200 dark:border-${stat.color}-800`}
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="mb-8 flex flex-wrap gap-3">
          {[
            { value: 'all', label: 'All Streams' },
            { value: 'LIVE', label: '🔴 Live Now' },
            { value: 'SCHEDULED', label: '⏰ Scheduled' },
            { value: 'ENDED', label: '✓ Ended' },
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

        {/* Loading State */}
        {loading && <StreamListSkeleton />}

        {/* Streams Table */}
        {!loading && streams.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 animate-fade-in">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">Title</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">Vendor</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        Viewers
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">Messages</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {streams.map((stream, idx) => (
                    <tr
                      key={stream.id}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                        {stream.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {stream.vendorName}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                            stream.status === 'LIVE'
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                              : stream.status === 'SCHEDULED'
                              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                          }`}
                        >
                          {stream.status === 'LIVE' && '🔴'}
                          {stream.status === 'SCHEDULED' && '⏰'}
                          {stream.status === 'ENDED' && '✓'}
                          {stream.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          {stream.viewerCount}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {stream.messageCount}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Link
                          href={`/live/${stream.id}`}
                          className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && streams.length === 0 && (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
            <div className="text-5xl mb-4">📺</div>
            <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No live streams found
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              No streams match the current filter
            </p>
            <button
              onClick={() => fetchStreams()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors"
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

