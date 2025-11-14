"use client";

import SystemHealthMonitor from "@/components/admin/SystemHealthMonitor";
import LogViewer from "@/components/admin/LogViewer";

export default function SystemPageClient() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">System Status</h1>

      <SystemHealthMonitor
        autoRefresh={true}
        refreshInterval={30000}
        className="mb-8"
      />

      <LogViewer
        autoRefresh={false}
        refreshInterval={10000}
        className="mb-8"
      />
    </div>
  );
}

