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
        case 'error': return 'bg-error/10 text-error';
        case 'warning': return 'bg-warning/10 text-warning';
        case 'info': return 'bg-info/10 text-info';
        default: return 'bg-muted text-foreground';
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

    if (loading) return <div className="text-center py-8 text-foreground">Loading logs...</div>;

    return (
      <div ref={ref} className={`bg-card text-card-foreground p-6 rounded-lg shadow border border-border ${className}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">System Logs</h2>
          <button
            onClick={exportLogs}
            className="bg-primary hover:bg-primary-dark text-primary-foreground px-4 py-2 rounded text-sm transition-colors"
          >
            Export Logs
          </button>
        </div>

        {error && <div className="text-error mb-4">Error: {error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold mb-2 text-foreground">Filter by Level</label>
            <select
              value={logLevel}
              onChange={(e) => { setLogLevel(e.target.value); setPage(1); }}
              className="w-full border border-border rounded px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Levels</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-foreground">Search</label>
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="w-full border border-border rounded px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-foreground">Results</label>
            <div className="text-sm text-muted-foreground py-2">
              Showing {paginatedLogs.length > 0 ? (page - 1) * itemsPerPage + 1 : 0} - {Math.min(page * itemsPerPage, filteredLogs.length)} of {filteredLogs.length}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-2 text-left text-foreground">Level</th>
                <th className="px-4 py-2 text-left text-foreground">Message</th>
                <th className="px-4 py-2 text-left text-foreground">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLogs.map((log) => (
                <tr key={log.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getLevelColor(log.level)}`}>
                      {log.level.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-2 max-w-md truncate text-foreground">{log.message}</td>
                  <td className="px-4 py-2 text-muted-foreground whitespace-nowrap">
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
              className="px-3 py-1 border border-border rounded bg-background text-foreground hover:bg-muted disabled:opacity-50 transition-colors"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-foreground">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 border border-border rounded bg-background text-foreground hover:bg-muted disabled:opacity-50 transition-colors"
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

