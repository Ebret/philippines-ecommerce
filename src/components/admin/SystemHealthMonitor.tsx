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
      return status === 'healthy' ? 'text-success' : 'text-warning';
    };

    const getMemoryPercentage = () => {
      if (!health?.memory) return 0;
      return Math.round((health.memory.used / health.memory.total) * 100);
    };

    if (loading) return <div className="text-center py-8 text-foreground">Loading system health...</div>;
    if (error) return <div className="text-error py-8">Error: {error}</div>;

    return (
      <div ref={ref} className={`bg-card text-card-foreground p-6 rounded-lg shadow border border-border ${className}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">System Health Monitor</h2>
          <button
            onClick={fetchHealth}
            className="bg-primary hover:bg-primary-dark text-primary-foreground px-4 py-2 rounded text-sm transition-colors"
          >
            Refresh Now
          </button>
        </div>

        {health && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-muted p-4 rounded border-l-4 border-success">
                <p className="text-muted-foreground text-sm">Overall Status</p>
                <p className={`text-2xl font-bold ${getStatusColor(health.status)}`}>
                  {health.status.toUpperCase()}
                </p>
              </div>
              <div className="bg-muted p-4 rounded border-l-4 border-info">
                <p className="text-muted-foreground text-sm">Database</p>
                <p className={`text-lg font-bold ${getStatusColor(health.database.status)}`}>
                  {health.database.status} ({health.database.responseTime})
                </p>
              </div>
              <div className="bg-muted p-4 rounded border-l-4 border-accent">
                <p className="text-muted-foreground text-sm">API Response</p>
                <p className="text-lg font-bold text-accent">{health.api.responseTime}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-info/10 p-4 rounded">
                <p className="text-muted-foreground text-sm">Total Users</p>
                <p className="text-2xl font-bold text-info">{health.metrics.totalUsers}</p>
              </div>
              <div className="bg-success/10 p-4 rounded">
                <p className="text-muted-foreground text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-success">{health.metrics.totalOrders}</p>
              </div>
              <div className="bg-accent/10 p-4 rounded">
                <p className="text-muted-foreground text-sm">Total Products</p>
                <p className="text-2xl font-bold text-accent">{health.metrics.totalProducts}</p>
              </div>
              <div className="bg-warning/10 p-4 rounded">
                <p className="text-muted-foreground text-sm">Memory Usage</p>
                <p className="text-2xl font-bold text-warning">{getMemoryPercentage()}%</p>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div
                    className="bg-warning h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getMemoryPercentage()}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
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

