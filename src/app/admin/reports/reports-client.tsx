"use client";

import { useState } from "react";

interface ReportData {
  period: { startDate: string; endDate: string };
  metrics: any;
  orders?: any[];
}

export default function ReportsPageClient() {
  const [reportType, setReportType] = useState<"sales" | "revenue">("sales");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      if (reportType === "revenue") params.append("includeBreakdown", "true");

      const response = await fetch(
        `/api/admin/reports/${reportType}?${params.toString()}`
      );
      if (!response.ok) throw new Error("Failed to generate report");
      const result = await response.json();
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (format: "csv" | "json") => {
    try {
      const response = await fetch("/api/admin/reports/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportType,
          format,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        }),
      });

      if (!response.ok) throw new Error("Failed to export report");

      if (format === "csv") {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${reportType}-report.csv`;
        a.click();
      } else {
        const result = await response.json();
        console.log("Export data:", result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Reports</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-bold mb-4">Generate Report</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as "sales" | "revenue")}
              className="w-full border rounded px-3 py-2"
            >
              <option value="sales">Sales Report</option>
              <option value="revenue">Revenue Report</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={generateReport}
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded disabled:opacity-50"
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>
        </div>

        {error && <div className="text-red-600 mb-4">{error}</div>}

        {data && (
          <div className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {Object.entries(data.metrics).map(([key, value]) => (
                <div key={key} className="bg-gray-50 p-4 rounded">
                  <p className="text-gray-600 text-sm">{key}</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {typeof value === "number" ? value.toLocaleString() : String(value)}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => exportReport("csv")}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
              >
                Export as CSV
              </button>
              <button
                onClick={() => exportReport("json")}
                className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded"
              >
                Export as JSON
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

