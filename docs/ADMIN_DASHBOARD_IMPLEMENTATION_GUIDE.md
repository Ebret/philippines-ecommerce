# Admin Dashboard Implementation Guide

## Overview

The Admin Dashboard is a comprehensive management interface for the Philippines E-Commerce Platform. It provides real-time monitoring, reporting, and system health tracking capabilities.

### Architecture

The admin dashboard follows a modular component-based architecture:

```
/admin
├── layout.tsx (Server component with auth check)
├── page.tsx (Dashboard overview)
├── reports/
│   ├── page.tsx (Server component)
│   └── reports-client.tsx (Client component with ReportBuilder)
└── system/
    ├── page.tsx (Server component)
    └── system-client.tsx (Client component with monitors)

/components/admin
├── ReportBuilder.tsx (Report configuration)
├── SystemHealthMonitor.tsx (Health monitoring)
├── LogViewer.tsx (Log viewing)
└── index.ts (Centralized exports)
```

## Component Usage

### ReportBuilder Component

The ReportBuilder component provides an interactive interface for generating and exporting reports.

**Props:**
```typescript
interface ReportBuilderProps {
  onGenerateReport: (config: ReportConfig) => Promise<void>;
  onExportReport: (config: ReportConfig, format: ExportFormat) => Promise<void>;
  isLoading?: boolean;
  className?: string;
}

type ExportFormat = 'csv' | 'json' | 'pdf';

interface ReportConfig {
  reportType: 'sales' | 'revenue' | 'customers' | 'products';
  startDate?: string;
  endDate?: string;
  vendor?: string;
  category?: string;
  status?: string;
  exportFormat?: ExportFormat;
}
```

**Usage Example:**
```typescript
import ReportBuilder from '@/components/admin/ReportBuilder';

export default function ReportsPage() {
  const [loading, setLoading] = useState(false);

  const handleGenerateReport = async (config: ReportConfig) => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/reports/sales', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      // Handle response
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReportBuilder
      onGenerateReport={handleGenerateReport}
      onExportReport={handleExportReport}
      isLoading={loading}
    />
  );
}
```

### SystemHealthMonitor Component

Displays real-time system health metrics with auto-refresh capability.

**Props:**
```typescript
interface SystemHealthMonitorProps {
  autoRefresh?: boolean;
  refreshInterval?: number; // milliseconds
  className?: string;
}
```

**Usage Example:**
```typescript
import SystemHealthMonitor from '@/components/admin/SystemHealthMonitor';

export default function SystemPage() {
  return (
    <SystemHealthMonitor
      autoRefresh={true}
      refreshInterval={30000}
      className="mb-8"
    />
  );
}
```

### LogViewer Component

Displays and filters system logs with search and export capabilities.

**Props:**
```typescript
interface LogViewerProps {
  autoRefresh?: boolean;
  refreshInterval?: number; // milliseconds
  className?: string;
}
```

**Usage Example:**
```typescript
import LogViewer from '@/components/admin/LogViewer';

export default function SystemPage() {
  return (
    <LogViewer
      autoRefresh={false}
      refreshInterval={10000}
      className="mb-8"
    />
  );
}
```

## Authentication & Authorization

All admin pages require authentication and ADMIN or SUPER_ADMIN role:

```typescript
// In server component
const session = await getServerSession(authOptions);
if (!session?.user) redirect('/auth/login');
if (!['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
  redirect('/');
}
```

## Configuration Options

### ReportBuilder
- **Report Types**: sales, revenue, customers, products
- **Export Formats**: CSV, JSON, PDF
- **Filters**: vendor, category, status
- **Date Range**: Optional start and end dates

### SystemHealthMonitor
- **Auto-refresh**: Enable/disable automatic updates
- **Refresh Interval**: Configurable in milliseconds (default: 30000ms)
- **Metrics**: Database status, API response time, memory usage, uptime

### LogViewer
- **Log Levels**: info, warning, error
- **Search**: Full-text search across log messages
- **Pagination**: 20 items per page
- **Export**: CSV format export

## Troubleshooting

### Components Not Rendering
- Verify authentication is working
- Check browser console for errors
- Ensure API endpoints are accessible

### API Errors
- Check network tab in browser DevTools
- Verify API endpoints are running
- Check authentication headers

### Performance Issues
- Reduce auto-refresh interval
- Limit log entries displayed
- Use pagination for large datasets

## API Integration

All components integrate with the following API endpoints:
- `GET /api/admin/reports/sales`
- `GET /api/admin/reports/revenue`
- `POST /api/admin/reports/export`
- `GET /api/admin/system/health`
- `GET /api/admin/system/logs`

See ADMIN_API_ENDPOINTS.md for detailed endpoint documentation.

