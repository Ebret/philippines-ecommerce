'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Live Streams Management</h1>
          <p className="text-gray-600">Monitor and manage all live selling sessions</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8 flex gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            All Streams
          </button>
          <button
            onClick={() => setFilter('LIVE')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'LIVE'
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            🔴 Live Now
          </button>
          <button
            onClick={() => setFilter('SCHEDULED')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'SCHEDULED'
                ? 'bg-yellow-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Scheduled
          </button>
          <button
            onClick={() => setFilter('ENDED')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'ENDED'
                ? 'bg-gray-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Ended
          </button>
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
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading live streams...</p>
          </div>
        )}

        {/* Streams Table */}
        {!loading && streams.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Vendor</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Viewers</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Messages</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {streams.map((stream) => (
                  <tr key={stream.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{stream.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{stream.vendorName}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        stream.status === 'LIVE'
                          ? 'bg-red-100 text-red-800'
                          : stream.status === 'SCHEDULED'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {stream.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{stream.viewerCount}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{stream.messageCount}</td>
                    <td className="px-6 py-4 text-sm">
                      <Link
                        href={`/live/${stream.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {!loading && streams.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600 text-lg">No live streams found</p>
          </div>
        )}
      </div>
    </div>
  );
}

