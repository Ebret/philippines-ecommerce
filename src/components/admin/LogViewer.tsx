'use client';

import React, { useEffect, useState } from 'react';

interface LogEntry {
  id: string;
  level: string;
  message: string;
  timestamp: string;
}

interface LogViewerProps {
  autoRefresh?: boolean;
  refreshInterval?: number;
  className?: string;
}

const LogViewer = React.forwardRef<HTMLDivElement, LogViewerProps>(
  ({ autoRefresh = false, refreshInterval = 10000, className = '' }, ref) => {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [logLevel, setLogLevel] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const itemsPerPage = 20;

    const fetchLogs = async () => {
      try {
        const params = new URLSearchParams();
        if (logLevel !== 'all') params.append('level', logLevel);
        params.append('limit', '100');

        const response = await fetch(`/api/admin/system/logs?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch logs');
        const result = await response.json();
        setLogs(result.data.logs || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchLogs();
      if (autoRefresh) {
        const interval = setInterval(fetchLogs, refreshInterval);
        return () => clearInterval(interval);
      }
    }, [logLevel, autoRefresh, refreshInterval]);

    const filteredLogs = logs.filter(log =>
      log.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedLogs = filteredLogs.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    );

    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

    const getLevelColor = (level: string) => {
      switch (level) {
        case 'error': return 'bg-red-100 text-red-800';
        case 'warning': return 'bg-yellow-100 text-yellow-800';
        case 'info': return 'bg-blue-100 text-blue-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    const exportLogs = () => {
      const csv = [
        ['Level', 'Message', 'Timestamp'],
        ...filteredLogs.map(log => [
          log.level,
          log.message,
          new Date(log.timestamp).toLocaleString()
        ])
      ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `logs-${new Date().toISOString()}.csv`;
      a.click();
    };

    if (loading) return <div className="text-center py-8">Loading logs...</div>;

    return (
      <div ref={ref} className={`bg-white p-6 rounded-lg shadow ${className}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">System Logs</h2>
          <button
            onClick={exportLogs}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm"
          >
            Export Logs
          </button>
        </div>

        {error && <div className="text-red-600 mb-4">Error: {error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Filter by Level</label>
            <select
              value={logLevel}
              onChange={(e) => { setLogLevel(e.target.value); setPage(1); }}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Levels</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Search</label>
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Results</label>
            <div className="text-sm text-gray-600 py-2">
              Showing {paginatedLogs.length > 0 ? (page - 1) * itemsPerPage + 1 : 0} - {Math.min(page * itemsPerPage, filteredLogs.length)} of {filteredLogs.length}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Level</th>
                <th className="px-4 py-2 text-left">Message</th>
                <th className="px-4 py-2 text-left">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLogs.map((log) => (
                <tr key={log.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getLevelColor(log.level)}`}>
                      {log.level.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-2 max-w-md truncate">{log.message}</td>
                  <td className="px-4 py-2 text-gray-600 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-1">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    );
  }
);

LogViewer.displayName = 'LogViewer';

export default LogViewer;

