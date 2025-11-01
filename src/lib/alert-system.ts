// Alert System Utilities

export interface Alert {
  id: string;
  type: "performance" | "error" | "threshold" | "anomaly" | "system";
  severity: "info" | "warning" | "critical";
  title: string;
  message: string;
  source: string;
  timestamp: number;
  resolved: boolean;
  resolvedAt?: number;
  metadata: Record<string, any>;
}

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  condition: string;
  threshold: number;
  duration: number; // milliseconds
  enabled: boolean;
  severity: "info" | "warning" | "critical";
  actions: string[]; // notification channels
  createdAt: number;
}

export interface AlertNotification {
  id: string;
  alertId: string;
  channel: "email" | "sms" | "slack" | "webhook" | "in-app";
  recipient: string;
  status: "pending" | "sent" | "failed";
  sentAt?: number;
  error?: string;
}

export interface AlertHistory {
  alertId: string;
  occurrences: number;
  firstOccurrence: number;
  lastOccurrence: number;
  averageResolutionTime: number;
  status: "active" | "resolved" | "recurring";
}

export interface NotificationChannel {
  id: string;
  name: string;
  type: "email" | "sms" | "slack" | "webhook" | "in-app";
  config: Record<string, any>;
  enabled: boolean;
  createdAt: number;
}

// Initialize alert
export function initializeAlert(
  type: "performance" | "error" | "threshold" | "anomaly" | "system",
  severity: "info" | "warning" | "critical",
  title: string,
  message: string,
  source: string,
  metadata: Record<string, any> = {}
): Alert {
  return {
    id: `alert:${Date.now()}`,
    type,
    severity,
    title,
    message,
    source,
    timestamp: Date.now(),
    resolved: false,
    metadata,
  };
}

// Resolve alert
export function resolveAlert(alert: Alert): Alert {
  return {
    ...alert,
    resolved: true,
    resolvedAt: Date.now(),
  };
}

// Initialize alert rule
export function initializeAlertRule(
  name: string,
  description: string,
  condition: string,
  threshold: number,
  duration: number,
  severity: "info" | "warning" | "critical" = "warning",
  actions: string[] = []
): AlertRule {
  return {
    id: `rule:${Date.now()}`,
    name,
    description,
    condition,
    threshold,
    duration,
    enabled: true,
    severity,
    actions,
    createdAt: Date.now(),
  };
}

// Enable alert rule
export function enableAlertRule(rule: AlertRule): AlertRule {
  return {
    ...rule,
    enabled: true,
  };
}

// Disable alert rule
export function disableAlertRule(rule: AlertRule): AlertRule {
  return {
    ...rule,
    enabled: false,
  };
}

// Initialize alert notification
export function initializeAlertNotification(
  alertId: string,
  channel: "email" | "sms" | "slack" | "webhook" | "in-app",
  recipient: string
): AlertNotification {
  return {
    id: `notification:${Date.now()}`,
    alertId,
    channel,
    recipient,
    status: "pending",
  };
}

// Mark notification as sent
export function markNotificationAsSent(notification: AlertNotification): AlertNotification {
  return {
    ...notification,
    status: "sent",
    sentAt: Date.now(),
  };
}

// Mark notification as failed
export function markNotificationAsFailed(notification: AlertNotification, error: string): AlertNotification {
  return {
    ...notification,
    status: "failed",
    error,
  };
}

// Initialize notification channel
export function initializeNotificationChannel(
  name: string,
  type: "email" | "sms" | "slack" | "webhook" | "in-app",
  config: Record<string, any>
): NotificationChannel {
  return {
    id: `channel:${Date.now()}`,
    name,
    type,
    config,
    enabled: true,
    createdAt: Date.now(),
  };
}

// Initialize alert history
export function initializeAlertHistory(alertId: string): AlertHistory {
  return {
    alertId,
    occurrences: 1,
    firstOccurrence: Date.now(),
    lastOccurrence: Date.now(),
    averageResolutionTime: 0,
    status: "active",
  };
}

// Update alert history
export function updateAlertHistory(history: AlertHistory, resolutionTime?: number): AlertHistory {
  const updated = {
    ...history,
    occurrences: history.occurrences + 1,
    lastOccurrence: Date.now(),
  };

  if (resolutionTime !== undefined) {
    updated.averageResolutionTime =
      (history.averageResolutionTime * (history.occurrences - 1) + resolutionTime) / history.occurrences;
  }

  return updated;
}

// Check if alert should be triggered
export function shouldTriggerAlert(
  currentValue: number,
  threshold: number,
  condition: "greater_than" | "less_than" | "equals" | "not_equals"
): boolean {
  switch (condition) {
    case "greater_than":
      return currentValue > threshold;
    case "less_than":
      return currentValue < threshold;
    case "equals":
      return currentValue === threshold;
    case "not_equals":
      return currentValue !== threshold;
    default:
      return false;
  }
}

// Get alert severity color
export function getAlertSeverityColor(severity: "info" | "warning" | "critical"): string {
  switch (severity) {
    case "info":
      return "#3b82f6"; // blue
    case "warning":
      return "#f59e0b"; // amber
    case "critical":
      return "#ef4444"; // red
    default:
      return "#6b7280"; // gray
  }
}

// Get alert severity icon
export function getAlertSeverityIcon(severity: "info" | "warning" | "critical"): string {
  switch (severity) {
    case "info":
      return "ℹ️";
    case "warning":
      return "⚠️";
    case "critical":
      return "🚨";
    default:
      return "❓";
  }
}

// Create default alert rules
export function createDefaultAlertRules(): AlertRule[] {
  return [
    initializeAlertRule(
      "High Response Time",
      "Alert when average response time exceeds 500ms",
      "average_response_time > 500",
      500,
      60000,
      "warning",
      ["email", "slack"]
    ),
    initializeAlertRule(
      "High Error Rate",
      "Alert when error rate exceeds 1%",
      "error_rate > 1",
      1,
      60000,
      "critical",
      ["email", "sms", "slack"]
    ),
    initializeAlertRule(
      "Low Cache Hit Rate",
      "Alert when cache hit rate drops below 70%",
      "cache_hit_rate < 70",
      70,
      300000,
      "warning",
      ["email", "slack"]
    ),
    initializeAlertRule(
      "High CPU Usage",
      "Alert when CPU usage exceeds 80%",
      "cpu_usage > 80",
      80,
      300000,
      "warning",
      ["email", "slack"]
    ),
    initializeAlertRule(
      "High Memory Usage",
      "Alert when memory usage exceeds 85%",
      "memory_usage > 85",
      85,
      300000,
      "warning",
      ["email", "slack"]
    ),
    initializeAlertRule(
      "Database Connection Pool Exhausted",
      "Alert when connection pool is nearly exhausted",
      "active_connections > 18",
      18,
      60000,
      "critical",
      ["email", "sms", "slack"]
    ),
    initializeAlertRule(
      "Slow Database Query",
      "Alert when slow queries are detected",
      "slow_query_count > 5",
      5,
      300000,
      "warning",
      ["email", "slack"]
    ),
    initializeAlertRule(
      "High Disk I/O",
      "Alert when disk I/O rate is high",
      "disk_io_rate > 80",
      80,
      300000,
      "warning",
      ["email", "slack"]
    ),
  ];
}

// Get alert statistics
export function getAlertStatistics(alerts: Alert[]): {
  totalAlerts: number;
  activeAlerts: number;
  resolvedAlerts: number;
  criticalAlerts: number;
  warningAlerts: number;
  infoAlerts: number;
  alertsByType: Record<string, number>;
  alertsBySource: Record<string, number>;
} {
  const activeAlerts = alerts.filter((a) => !a.resolved).length;
  const resolvedAlerts = alerts.filter((a) => a.resolved).length;
  const criticalAlerts = alerts.filter((a) => a.severity === "critical").length;
  const warningAlerts = alerts.filter((a) => a.severity === "warning").length;
  const infoAlerts = alerts.filter((a) => a.severity === "info").length;

  const alertsByType: Record<string, number> = {};
  const alertsBySource: Record<string, number> = {};

  alerts.forEach((a) => {
    alertsByType[a.type] = (alertsByType[a.type] || 0) + 1;
    alertsBySource[a.source] = (alertsBySource[a.source] || 0) + 1;
  });

  return {
    totalAlerts: alerts.length,
    activeAlerts,
    resolvedAlerts,
    criticalAlerts,
    warningAlerts,
    infoAlerts,
    alertsByType,
    alertsBySource,
  };
}

// Get alert recommendations
export function getAlertRecommendations(alerts: Alert[]): string[] {
  const recommendations: string[] = [];
  const stats = getAlertStatistics(alerts);

  if (stats.criticalAlerts > 0) {
    recommendations.push("Address critical alerts immediately");
  }
  if (stats.warningAlerts > 5) {
    recommendations.push("Investigate recurring warning alerts");
  }
  if (stats.activeAlerts > 10) {
    recommendations.push("Review and resolve active alerts");
  }

  const performanceAlerts = alerts.filter((a) => a.type === "performance");
  if (performanceAlerts.length > 5) {
    recommendations.push("Optimize performance to reduce alerts");
  }

  const errorAlerts = alerts.filter((a) => a.type === "error");
  if (errorAlerts.length > 3) {
    recommendations.push("Investigate and fix errors");
  }

  return recommendations;
}

// Get alert notification template
export function getAlertNotificationTemplate(alert: Alert, channel: string): {
  subject: string;
  body: string;
} {
  const icon = getAlertSeverityIcon(alert.severity);

  return {
    subject: `${icon} ${alert.title} - ${alert.severity.toUpperCase()}`,
    body: `
Alert: ${alert.title}
Severity: ${alert.severity}
Source: ${alert.source}
Message: ${alert.message}
Time: ${new Date(alert.timestamp).toISOString()}

Metadata:
${JSON.stringify(alert.metadata, null, 2)}
    `.trim(),
  };
}

