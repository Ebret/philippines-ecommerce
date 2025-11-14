"use client";

import { useState } from "react";
import ReportBuilder, { ReportConfig, ExportFormat } from "@/components/admin/ReportBuilder";

interface ReportData {
  period: { startDate: string; endDate: string };
  metrics: any;
  orders?: any[];
}

export default function ReportsPageClient() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateReport = async (config: ReportConfig) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (config.startDate) params.append("startDate", config.startDate);
      if (config.endDate) params.append("endDate", config.endDate);
      if (config.reportType === "revenue") params.append("includeBreakdown", "true");

      const response = await fetch(
        `/api/admin/reports/${config.reportType}?${params.toString()}`
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

  const exportReport = async (config: ReportConfig, format: ExportFormat) => {
    try {
      const response = await fetch("/api/admin/reports/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportType: config.reportType,
          format,
          startDate: config.startDate || undefined,
          endDate: config.endDate || undefined,
        }),
      });

      if (!response.ok) throw new Error("Failed to export report");

      if (format === "csv") {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${config.reportType}-report.csv`;
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

      {error && <div className="text-red-600 mb-4 p-4 bg-red-50 rounded">{error}</div>}

      <ReportBuilder
        onGenerateReport={generateReport}
        onExportReport={exportReport}
        isLoading={loading}
        className="mb-8"
      />

      {data && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6">Report Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(data.metrics).map(([key, value]) => (
              <div key={key} className="bg-gray-50 p-4 rounded border-l-4 border-blue-500">
                <p className="text-gray-600 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                <p className="text-2xl font-bold text-gray-800">
                  {typeof value === "number" ? value.toLocaleString() : String(value)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

