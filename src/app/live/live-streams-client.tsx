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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Live Selling</h1>
          <p className="text-gray-600">Watch live streams and shop in real-time</p>
        </div>

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
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading live streams...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800">Error: {error}</p>
          </div>
        )}

        {!loading && streams.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {streams.map((stream) => (
              <Link
                key={stream.id}
                href={`/live/${stream.id}`}
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
              >
                <div className="relative bg-gray-200 h-40">
                  {stream.thumbnail && (
                    <img
                      src={stream.thumbnail}
                      alt={stream.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {stream.status === 'LIVE' && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                      LIVE
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">{stream.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{stream.description}</p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>👤 {stream.vendorName}</span>
                    <span>👁️ {stream.viewerCount} viewers</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && streams.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600 text-lg">No live streams available</p>
            <p className="text-gray-500 mt-2">Check back soon for exciting live selling events!</p>
          </div>
        )}
      </div>
    </div>
  );
}

