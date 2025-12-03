"use client";

import { useState } from "react";
import ReportBuilder, { ReportConfig, ExportFormat } from "@/components/admin/ReportBuilder";
import { AlertCircle, CheckCircle, TrendingUp, BarChart3 } from "lucide-react";

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-gradient-to-r from-background to-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-secondary/20">
              <BarChart3 className="w-8 h-8 text-secondary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold font-serif text-foreground">Reports & Analytics</h1>
              <p className="text-muted-foreground mt-1">Generate and analyze business metrics</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-lg border border-error/50 bg-error/10 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 text-error flex-shrink-0" />
            <p className="text-error font-medium">{error}</p>
          </div>
        )}

        {/* Report Builder */}
        <div className="mb-8">
          <ReportBuilder
            onGenerateReport={generateReport}
            onExportReport={exportReport}
            isLoading={loading}
            className="mb-8"
          />
        </div>

        {/* Report Results */}
        {data && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
              {/* Results Header */}
              <div className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-accent/5 p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/20">
                    <CheckCircle className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold font-serif text-foreground">Report Results</h2>
                    <p className="text-sm text-muted-foreground">
                      Period: {data.period.startDate} to {data.period.endDate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(data.metrics).map(([key, value], index) => (
                    <div
                      key={key}
                      className="group relative overflow-hidden rounded-lg border border-border/50 bg-gradient-to-br from-card to-card/50 p-4 hover:shadow-md transition-all duration-300 hover:border-primary/50"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Background gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Content */}
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-muted-foreground capitalize">
                            {key.replace(/([A-Z])/g, ' $1')}
                          </p>
                          <TrendingUp className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <p className="text-2xl font-bold text-foreground">
                          {typeof value === "number" ? value.toLocaleString() : String(value)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!data && !loading && (
          <div className="rounded-xl border border-border/50 border-dashed bg-card/50 p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <BarChart3 className="w-8 h-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No Report Generated</h3>
            <p className="text-muted-foreground">Generate a report using the form above to see results</p>
          </div>
        )}
      </div>
    </div>
  );
}

