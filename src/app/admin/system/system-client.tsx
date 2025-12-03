"use client";

import SystemHealthMonitor from "@/components/admin/SystemHealthMonitor";
import LogViewer from "@/components/admin/LogViewer";
import { Activity, AlertCircle, CheckCircle } from "lucide-react";

export default function SystemPageClient() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-gradient-to-r from-background to-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/20">
              <Activity className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold font-serif text-foreground">System Status</h1>
              <p className="text-muted-foreground mt-1">Monitor system health and view logs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Health Monitor */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-success" />
            <h2 className="text-xl font-bold text-foreground">System Health</h2>
          </div>
          <SystemHealthMonitor
            autoRefresh={true}
            refreshInterval={30000}
            className="mb-8"
          />
        </div>

        {/* Log Viewer */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-warning" />
            <h2 className="text-xl font-bold text-foreground">System Logs</h2>
          </div>
          <LogViewer
            autoRefresh={false}
            refreshInterval={10000}
            className="mb-8"
          />
        </div>
      </div>
    </div>
  );
}

