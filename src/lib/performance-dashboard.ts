// Performance Dashboard Utilities

export interface DashboardWidget {
  id: string;
  title: string;
  type: "metric" | "chart" | "gauge" | "table" | "alert";
  data: any;
  refreshInterval: number; // milliseconds
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface PerformanceDashboard {
  id: string;
  name: string;
  description: string;
  widgets: DashboardWidget[];
  refreshInterval: number;
  createdAt: number;
  updatedAt: number;
  isActive: boolean;
}

export interface MetricWidget {
  id: string;
  title: string;
  value: number;
  unit: string;
  previousValue?: number;
  trend: "up" | "down" | "stable";
  status: "normal" | "warning" | "critical";
  threshold?: number;
}

export interface ChartWidget {
  id: string;
  title: string;
  chartType: "line" | "bar" | "area" | "pie";
  dataPoints: Array<{
    label: string;
    value: number;
    timestamp?: number;
  }>;
  timeRange: "1h" | "6h" | "24h" | "7d" | "30d";
}

export interface GaugeWidget {
  id: string;
  title: string;
  value: number;
  minValue: number;
  maxValue: number;
  unit: string;
  status: "normal" | "warning" | "critical";
  thresholds: {
    warning: number;
    critical: number;
  };
}

export interface AlertWidget {
  id: string;
  title: string;
  alerts: Array<{
    id: string;
    message: string;
    severity: "info" | "warning" | "critical";
    timestamp: number;
  }>;
  maxAlerts: number;
}

// Initialize metric widget
export function initializeMetricWidget(
  title: string,
  value: number,
  unit: string,
  status: "normal" | "warning" | "critical" = "normal",
  threshold?: number
): MetricWidget {
  return {
    id: `widget:metric:${Date.now()}`,
    title,
    value,
    unit,
    trend: "stable",
    status,
    threshold,
  };
}

// Update metric widget
export function updateMetricWidget(
  widget: MetricWidget,
  newValue: number,
  status: "normal" | "warning" | "critical"
): MetricWidget {
  const previousValue = widget.value;
  const trend = newValue > previousValue ? "up" : newValue < previousValue ? "down" : "stable";

  return {
    ...widget,
    value: newValue,
    previousValue,
    trend,
    status,
  };
}

// Initialize chart widget
export function initializeChartWidget(
  title: string,
  chartType: "line" | "bar" | "area" | "pie" = "line",
  timeRange: "1h" | "6h" | "24h" | "7d" | "30d" = "24h"
): ChartWidget {
  return {
    id: `widget:chart:${Date.now()}`,
    title,
    chartType,
    dataPoints: [],
    timeRange,
  };
}

// Add data point to chart widget
export function addDataPointToChart(
  widget: ChartWidget,
  label: string,
  value: number,
  timestamp: number = Date.now()
): ChartWidget {
  return {
    ...widget,
    dataPoints: [
      ...widget.dataPoints,
      {
        label,
        value,
        timestamp,
      },
    ],
  };
}

// Initialize gauge widget
export function initializeGaugeWidget(
  title: string,
  value: number,
  minValue: number,
  maxValue: number,
  unit: string,
  warningThreshold: number,
  criticalThreshold: number
): GaugeWidget {
  const status = value >= criticalThreshold ? "critical" : value >= warningThreshold ? "warning" : "normal";

  return {
    id: `widget:gauge:${Date.now()}`,
    title,
    value,
    minValue,
    maxValue,
    unit,
    status,
    thresholds: {
      warning: warningThreshold,
      critical: criticalThreshold,
    },
  };
}

// Update gauge widget
export function updateGaugeWidget(widget: GaugeWidget, newValue: number): GaugeWidget {
  const status = newValue >= widget.thresholds.critical ? "critical" : newValue >= widget.thresholds.warning ? "warning" : "normal";

  return {
    ...widget,
    value: newValue,
    status,
  };
}

// Initialize alert widget
export function initializeAlertWidget(title: string, maxAlerts: number = 10): AlertWidget {
  return {
    id: `widget:alert:${Date.now()}`,
    title,
    alerts: [],
    maxAlerts,
  };
}

// Add alert to alert widget
export function addAlertToWidget(
  widget: AlertWidget,
  message: string,
  severity: "info" | "warning" | "critical"
): AlertWidget {
  const newAlert = {
    id: `alert:${Date.now()}`,
    message,
    severity,
    timestamp: Date.now(),
  };

  const alerts = [newAlert, ...widget.alerts].slice(0, widget.maxAlerts);

  return {
    ...widget,
    alerts,
  };
}

// Initialize dashboard widget
export function initializeDashboardWidget(
  title: string,
  type: "metric" | "chart" | "gauge" | "table" | "alert",
  data: any,
  x: number = 0,
  y: number = 0,
  width: number = 1,
  height: number = 1,
  refreshInterval: number = 60000
): DashboardWidget {
  return {
    id: `widget:${type}:${Date.now()}`,
    title,
    type,
    data,
    refreshInterval,
    position: {
      x,
      y,
      width,
      height,
    },
  };
}

// Initialize performance dashboard
export function initializePerformanceDashboard(
  name: string,
  description: string = "",
  refreshInterval: number = 30000
): PerformanceDashboard {
  return {
    id: `dashboard:${Date.now()}`,
    name,
    description,
    widgets: [],
    refreshInterval,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isActive: true,
  };
}

// Add widget to dashboard
export function addWidgetToDashboard(dashboard: PerformanceDashboard, widget: DashboardWidget): PerformanceDashboard {
  return {
    ...dashboard,
    widgets: [...dashboard.widgets, widget],
    updatedAt: Date.now(),
  };
}

// Remove widget from dashboard
export function removeWidgetFromDashboard(dashboard: PerformanceDashboard, widgetId: string): PerformanceDashboard {
  return {
    ...dashboard,
    widgets: dashboard.widgets.filter((w) => w.id !== widgetId),
    updatedAt: Date.now(),
  };
}

// Update widget in dashboard
export function updateWidgetInDashboard(dashboard: PerformanceDashboard, updatedWidget: DashboardWidget): PerformanceDashboard {
  return {
    ...dashboard,
    widgets: dashboard.widgets.map((w) => (w.id === updatedWidget.id ? updatedWidget : w)),
    updatedAt: Date.now(),
  };
}

// Get dashboard layout
export function getDashboardLayout(dashboard: PerformanceDashboard): {
  gridWidth: number;
  gridHeight: number;
  widgets: Array<{
    id: string;
    title: string;
    position: { x: number; y: number; width: number; height: number };
  }>;
} {
  const maxX = Math.max(...dashboard.widgets.map((w) => w.position.x + w.position.width), 4);
  const maxY = Math.max(...dashboard.widgets.map((w) => w.position.y + w.position.height), 4);

  return {
    gridWidth: maxX,
    gridHeight: maxY,
    widgets: dashboard.widgets.map((w) => ({
      id: w.id,
      title: w.title,
      position: w.position,
    })),
  };
}

// Create default performance dashboard
export function createDefaultPerformanceDashboard(): PerformanceDashboard {
  let dashboard = initializePerformanceDashboard("Performance Overview", "Real-time performance metrics and alerts");

  // Add metric widgets
  const responseTimeWidget = initializeDashboardWidget(
    "Average Response Time",
    "metric",
    initializeMetricWidget("Avg Response Time", 250, "ms", "normal", 500),
    0,
    0,
    1,
    1
  );
  dashboard = addWidgetToDashboard(dashboard, responseTimeWidget);

  const cacheHitRateWidget = initializeDashboardWidget(
    "Cache Hit Rate",
    "gauge",
    initializeGaugeWidget("Cache Hit Rate", 85, 0, 100, "%", 70, 50),
    1,
    0,
    1,
    1
  );
  dashboard = addWidgetToDashboard(dashboard, cacheHitRateWidget);

  const errorRateWidget = initializeDashboardWidget(
    "Error Rate",
    "gauge",
    initializeGaugeWidget("Error Rate", 0.5, 0, 10, "%", 2, 5),
    2,
    0,
    1,
    1
  );
  dashboard = addWidgetToDashboard(dashboard, errorRateWidget);

  const cpuUsageWidget = initializeDashboardWidget(
    "CPU Usage",
    "gauge",
    initializeGaugeWidget("CPU Usage", 45, 0, 100, "%", 80, 95),
    3,
    0,
    1,
    1
  );
  dashboard = addWidgetToDashboard(dashboard, cpuUsageWidget);

  // Add chart widget
  const responseTimeChartWidget = initializeDashboardWidget(
    "Response Time Trend",
    "chart",
    initializeChartWidget("Response Time Trend", "line", "24h"),
    0,
    1,
    2,
    2
  );
  dashboard = addWidgetToDashboard(dashboard, responseTimeChartWidget);

  // Add alert widget
  const alertWidget = initializeDashboardWidget(
    "Recent Alerts",
    "alert",
    initializeAlertWidget("Recent Alerts", 10),
    2,
    1,
    2,
    2
  );
  dashboard = addWidgetToDashboard(dashboard, alertWidget);

  return dashboard;
}

// Get dashboard summary
export function getDashboardSummary(dashboard: PerformanceDashboard): {
  totalWidgets: number;
  metricWidgets: number;
  chartWidgets: number;
  gaugeWidgets: number;
  alertWidgets: number;
  criticalAlerts: number;
  warningAlerts: number;
} {
  const metricWidgets = dashboard.widgets.filter((w) => w.type === "metric").length;
  const chartWidgets = dashboard.widgets.filter((w) => w.type === "chart").length;
  const gaugeWidgets = dashboard.widgets.filter((w) => w.type === "gauge").length;
  const alertWidgets = dashboard.widgets.filter((w) => w.type === "alert").length;

  let criticalAlerts = 0;
  let warningAlerts = 0;

  dashboard.widgets.forEach((w) => {
    if (w.type === "alert" && w.data?.alerts) {
      w.data.alerts.forEach((a: any) => {
        if (a.severity === "critical") criticalAlerts++;
        if (a.severity === "warning") warningAlerts++;
      });
    }
  });

  return {
    totalWidgets: dashboard.widgets.length,
    metricWidgets,
    chartWidgets,
    gaugeWidgets,
    alertWidgets,
    criticalAlerts,
    warningAlerts,
  };
}

// Get dashboard export format
export function exportDashboard(dashboard: PerformanceDashboard): {
  dashboard: PerformanceDashboard;
  exportedAt: number;
  format: string;
} {
  return {
    dashboard,
    exportedAt: Date.now(),
    format: "json",
  };
}

// Get dashboard templates
export function getDashboardTemplates(): Array<{
  name: string;
  description: string;
  category: string;
}> {
  return [
    {
      name: "Performance Overview",
      description: "Real-time performance metrics and alerts",
      category: "general",
    },
    {
      name: "API Performance",
      description: "API response times and error rates",
      category: "api",
    },
    {
      name: "Database Performance",
      description: "Database query performance and metrics",
      category: "database",
    },
    {
      name: "System Resources",
      description: "CPU, memory, and disk usage",
      category: "system",
    },
    {
      name: "User Experience",
      description: "Core Web Vitals and user metrics",
      category: "frontend",
    },
    {
      name: "Cache Performance",
      description: "Cache hit rates and effectiveness",
      category: "cache",
    },
  ];
}

