"use client";

import { useEffect, useState } from "react";

interface HealthData {
  status: string;
  timestamp: string;
  database: { status: string; responseTime: string };
  api: { responseTime: string };
  metrics: any;
  uptime: number;
  memory: { used: number; total: number };
}

interface LogEntry {
  id: string;
  level: string;
  message: string;
  timestamp: string;
}

export default function SystemPageClient() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [logLevel, setLogLevel] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await fetch("/api/admin/system/health");
        if (!response.ok) throw new Error("Failed to fetch health");
        const result = await response.json();
        setHealth(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const params = new URLSearchParams();
        if (logLevel !== "all") params.append("level", logLevel);
        params.append("limit", "50");

        const response = await fetch(`/api/admin/system/logs?${params.toString()}`);
        if (!response.ok) throw new Error("Failed to fetch logs");
        const result = await response.json();
        setLogs(result.data.logs);
      } catch (err) {
        console.error("Error fetching logs:", err);
      }
    };

    fetchLogs();
  }, [logLevel]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-red-600 py-8">Error: {error}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">System Status</h1>

      {health && (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-4">System Health</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-gray-600 text-sm">Status</p>
              <p className={`text-2xl font-bold ${health.status === "healthy" ? "text-green-600" : "text-yellow-600"}`}>
                {health.status.toUpperCase()}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-gray-600 text-sm">Database</p>
              <p className={`text-lg font-bold ${health.database.status === "healthy" ? "text-green-600" : "text-red-600"}`}>
                {health.database.status} ({health.database.responseTime})
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-gray-600 text-sm">API Response</p>
              <p className="text-lg font-bold text-blue-600">{health.api.responseTime}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <p className="text-2xl font-bold text-orange-600">
                {health.memory.used}/{health.memory.total} MB
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">System Logs</h2>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Filter by Level</label>
          <select
            value={logLevel}
            onChange={(e) => setLogLevel(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="all">All Levels</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Level</th>
                <th className="px-4 py-2 text-left">Message</th>
                <th className="px-4 py-2 text-left">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      log.level === "error" ? "bg-red-100 text-red-800" :
                      log.level === "warning" ? "bg-yellow-100 text-yellow-800" :
                      "bg-blue-100 text-blue-800"
                    }`}>
                      {log.level}
                    </span>
                  </td>
                  <td className="px-4 py-2">{log.message}</td>
                  <td className="px-4 py-2 text-gray-600">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

