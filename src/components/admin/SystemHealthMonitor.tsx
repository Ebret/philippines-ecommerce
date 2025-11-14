'use client';

import React, { useEffect, useState } from 'react';

interface HealthData {
  status: string;
  timestamp: string;
  database: { status: string; responseTime: string };
  api: { responseTime: string };
  metrics: any;
  uptime: number;
  memory: { used: number; total: number };
}

interface SystemHealthMonitorProps {
  autoRefresh?: boolean;
  refreshInterval?: number;
  className?: string;
}

const SystemHealthMonitor = React.forwardRef<HTMLDivElement, SystemHealthMonitorProps>(
  ({ autoRefresh = true, refreshInterval = 30000, className = '' }, ref) => {
    const [health, setHealth] = useState<HealthData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const fetchHealth = async () => {
      try {
        const response = await fetch('/api/admin/system/health');
        if (!response.ok) throw new Error('Failed to fetch health');
        const result = await response.json();
        setHealth(result.data);
        setLastUpdated(new Date());
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchHealth();
      if (autoRefresh) {
        const interval = setInterval(fetchHealth, refreshInterval);
        return () => clearInterval(interval);
      }
    }, [autoRefresh, refreshInterval]);

    const getStatusColor = (status: string) => {
      return status === 'healthy' ? 'text-green-600' : 'text-yellow-600';
    };

    const getMemoryPercentage = () => {
      if (!health?.memory) return 0;
      return Math.round((health.memory.used / health.memory.total) * 100);
    };

    if (loading) return <div className="text-center py-8">Loading system health...</div>;
    if (error) return <div className="text-red-600 py-8">Error: {error}</div>;

    return (
      <div ref={ref} className={`bg-white p-6 rounded-lg shadow ${className}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">System Health Monitor</h2>
          <button
            onClick={fetchHealth}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
          >
            Refresh Now
          </button>
        </div>

        {health && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded border-l-4 border-green-500">
                <p className="text-gray-600 text-sm">Overall Status</p>
                <p className={`text-2xl font-bold ${getStatusColor(health.status)}`}>
                  {health.status.toUpperCase()}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded border-l-4 border-blue-500">
                <p className="text-gray-600 text-sm">Database</p>
                <p className={`text-lg font-bold ${getStatusColor(health.database.status)}`}>
                  {health.database.status} ({health.database.responseTime})
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded border-l-4 border-purple-500">
                <p className="text-gray-600 text-sm">API Response</p>
                <p className="text-lg font-bold text-purple-600">{health.api.responseTime}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded">
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-blue-600">{health.metrics.totalUsers}</p>
              </div>
              <div className="bg-green-50 p-4 rounded">
                <p className="text-gray-600 text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-green-600">{health.metrics.totalOrders}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded">
                <p className="text-gray-600 text-sm">Total Products</p>
                <p className="text-2xl font-bold text-purple-600">{health.metrics.totalProducts}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded">
                <p className="text-gray-600 text-sm">Memory Usage</p>
                <p className="text-2xl font-bold text-orange-600">{getMemoryPercentage()}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-orange-600 h-2 rounded-full"
                    style={{ width: `${getMemoryPercentage()}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              Last updated: {lastUpdated?.toLocaleTimeString()}
              {autoRefresh && ` (Auto-refresh every ${refreshInterval / 1000}s)`}
            </div>
          </>
        )}
      </div>
    );
  }
);

SystemHealthMonitor.displayName = 'SystemHealthMonitor';

export default SystemHealthMonitor;

