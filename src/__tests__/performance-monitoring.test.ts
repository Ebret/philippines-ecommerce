import { describe, it, expect, beforeEach } from "vitest";
import * as realtimeMonitoring from "../lib/realtime-performance-monitoring";
import * as dashboard from "../lib/performance-dashboard";
import * as alertSystem from "../lib/alert-system";
import * as coreWebVitals from "../lib/core-web-vitals-monitoring";
import * as errorTracking from "../lib/error-tracking";
import * as monitoringIntegration from "../lib/monitoring-integration";

describe("Performance Monitoring System", () => {
  describe("Real-time Performance Monitoring", () => {
    it("should initialize performance metric", () => {
      const metric = realtimeMonitoring.initializePerformanceMetric("response_time", 250, "ms", "api", {
        endpoint: "/api/products",
      });

      expect(metric.name).toBe("response_time");
      expect(metric.value).toBe(250);
      expect(metric.source).toBe("api");
    });

    it("should initialize system resource metrics", () => {
      const metrics = realtimeMonitoring.initializeSystemResourceMetrics();

      expect(metrics.cpuUsage).toBe(0);
      expect(metrics.memoryUsage).toBe(0);
      expect(metrics.timestamp).toBeGreaterThan(0);
    });

    it("should update system resource metrics", () => {
      let metrics = realtimeMonitoring.initializeSystemResourceMetrics();
      metrics = realtimeMonitoring.updateSystemResourceMetrics(metrics, 45, 60, 30, 100, 10, 500);

      expect(metrics.cpuUsage).toBe(45);
      expect(metrics.memoryUsage).toBe(60);
      expect(metrics.activeConnections).toBe(10);
    });

    it("should calculate average response time", () => {
      const metrics = [
        realtimeMonitoring.initializeAPIResponseMetrics("/api/products", "GET", 100, 200),
        realtimeMonitoring.initializeAPIResponseMetrics("/api/orders", "GET", 200, 200),
        realtimeMonitoring.initializeAPIResponseMetrics("/api/users", "GET", 300, 200),
      ];

      const avg = realtimeMonitoring.calculateAverageResponseTime(metrics);
      expect(avg).toBe(200);
    });

    it("should calculate P95 response time", () => {
      const metrics = Array.from({ length: 100 }, (_, i) =>
        realtimeMonitoring.initializeAPIResponseMetrics("/api/test", "GET", i * 10, 200)
      );

      const p95 = realtimeMonitoring.calculateP95ResponseTime(metrics);
      expect(p95).toBeGreaterThan(0);
    });

    it("should calculate cache hit rate", () => {
      const metrics = [
        realtimeMonitoring.initializeAPIResponseMetrics("/api/products", "GET", 100, 200, 0, 0, true),
        realtimeMonitoring.initializeAPIResponseMetrics("/api/products", "GET", 100, 200, 0, 0, true),
        realtimeMonitoring.initializeAPIResponseMetrics("/api/products", "GET", 100, 200, 0, 0, false),
      ];

      const hitRate = realtimeMonitoring.calculateCacheHitRate(metrics);
      expect(hitRate).toBeCloseTo(66.67, 1);
    });

    it("should calculate error rate", () => {
      const metrics = [
        realtimeMonitoring.initializeAPIResponseMetrics("/api/products", "GET", 100, 200),
        realtimeMonitoring.initializeAPIResponseMetrics("/api/products", "GET", 100, 200),
        realtimeMonitoring.initializeAPIResponseMetrics("/api/products", "GET", 100, 500),
      ];

      const errorRate = realtimeMonitoring.calculateErrorRate(metrics);
      expect(errorRate).toBeCloseTo(33.33, 1);
    });

    it("should generate performance summary", () => {
      const apiMetrics = [
        realtimeMonitoring.initializeAPIResponseMetrics("/api/products", "GET", 250, 200, 0, 0, true),
      ];
      const systemMetrics = realtimeMonitoring.updateSystemResourceMetrics(
        realtimeMonitoring.initializeSystemResourceMetrics(),
        45,
        60,
        30,
        100,
        10,
        500
      );

      const summary = realtimeMonitoring.generatePerformanceSummary(apiMetrics, systemMetrics, []);
      expect(summary.summary).toBeDefined();
      expect(summary.metrics).toBeDefined();
    });
  });

  describe("Performance Dashboard", () => {
    it("should initialize metric widget", () => {
      const widget = dashboard.initializeMetricWidget("Response Time", 250, "ms", "normal");

      expect(widget.title).toBe("Response Time");
      expect(widget.value).toBe(250);
      expect(widget.status).toBe("normal");
    });

    it("should update metric widget", () => {
      let widget = dashboard.initializeMetricWidget("Response Time", 250, "ms");
      widget = dashboard.updateMetricWidget(widget, 300, "warning");

      expect(widget.value).toBe(300);
      expect(widget.previousValue).toBe(250);
      expect(widget.trend).toBe("up");
    });

    it("should initialize chart widget", () => {
      const widget = dashboard.initializeChartWidget("Response Time Trend", "line", "24h");

      expect(widget.title).toBe("Response Time Trend");
      expect(widget.chartType).toBe("line");
      expect(widget.dataPoints.length).toBe(0);
    });

    it("should add data point to chart", () => {
      let widget = dashboard.initializeChartWidget("Response Time Trend");
      widget = dashboard.addDataPointToChart(widget, "12:00", 250);

      expect(widget.dataPoints.length).toBe(1);
      expect(widget.dataPoints[0].value).toBe(250);
    });

    it("should initialize gauge widget", () => {
      const widget = dashboard.initializeGaugeWidget("CPU Usage", 45, 0, 100, "%", 80, 95);

      expect(widget.title).toBe("CPU Usage");
      expect(widget.value).toBe(45);
      expect(widget.status).toBe("normal");
    });

    it("should initialize performance dashboard", () => {
      const dash = dashboard.initializePerformanceDashboard("Performance Overview");

      expect(dash.name).toBe("Performance Overview");
      expect(dash.isActive).toBe(true);
      expect(dash.widgets.length).toBe(0);
    });

    it("should add widget to dashboard", () => {
      let dash = dashboard.initializePerformanceDashboard("Performance Overview");
      const widget = dashboard.initializeDashboardWidget("Response Time", "metric", {}, 0, 0);
      dash = dashboard.addWidgetToDashboard(dash, widget);

      expect(dash.widgets.length).toBe(1);
    });

    it("should create default performance dashboard", () => {
      const dash = dashboard.createDefaultPerformanceDashboard();

      expect(dash.widgets.length).toBeGreaterThan(0);
      expect(dash.name).toBe("Performance Overview");
    });

    it("should get dashboard summary", () => {
      const dash = dashboard.createDefaultPerformanceDashboard();
      const summary = dashboard.getDashboardSummary(dash);

      expect(summary.totalWidgets).toBeGreaterThan(0);
      expect(summary.metricWidgets).toBeGreaterThan(0);
    });
  });

  describe("Alert System", () => {
    it("should initialize alert", () => {
      const alert = alertSystem.initializeAlert(
        "performance",
        "warning",
        "High Response Time",
        "Response time exceeded 500ms",
        "api"
      );

      expect(alert.type).toBe("performance");
      expect(alert.severity).toBe("warning");
      expect(alert.resolved).toBe(false);
    });

    it("should resolve alert", () => {
      let alert = alertSystem.initializeAlert("performance", "warning", "High Response Time", "Response time exceeded 500ms", "api");
      alert = alertSystem.resolveAlert(alert);

      expect(alert.resolved).toBe(true);
      expect(alert.resolvedAt).toBeGreaterThan(0);
    });

    it("should initialize alert rule", () => {
      const rule = alertSystem.initializeAlertRule(
        "High Response Time",
        "Alert when response time exceeds 500ms",
        "response_time > 500",
        500,
        60000
      );

      expect(rule.name).toBe("High Response Time");
      expect(rule.enabled).toBe(true);
    });

    it("should create default alert rules", () => {
      const rules = alertSystem.createDefaultAlertRules();

      expect(rules.length).toBeGreaterThan(0);
      expect(rules[0].enabled).toBe(true);
    });

    it("should get alert statistics", () => {
      const alerts = [
        alertSystem.initializeAlert("performance", "warning", "Alert 1", "Message 1", "api"),
        alertSystem.initializeAlert("error", "critical", "Alert 2", "Message 2", "database"),
      ];

      const stats = alertSystem.getAlertStatistics(alerts);
      expect(stats.totalAlerts).toBe(2);
      expect(stats.criticalAlerts).toBe(1);
    });

    it("should get alert notification template", () => {
      const alert = alertSystem.initializeAlert("performance", "critical", "Critical Alert", "System critical", "api");
      const template = alertSystem.getAlertNotificationTemplate(alert, "email");

      expect(template.subject).toContain("Critical Alert");
      expect(template.body).toContain("System critical");
    });
  });

  describe("Core Web Vitals Monitoring", () => {
    it("should initialize Core Web Vital", () => {
      const vital = coreWebVitals.initializeCoreWebVital("LCP", 2000, "mobile", "4g", "/products");

      expect(vital.name).toBe("LCP");
      expect(vital.value).toBe(2000);
      expect(vital.rating).toBe("good");
    });

    it("should calculate Core Web Vitals score", () => {
      const vitals = [
        coreWebVitals.initializeCoreWebVital("LCP", 2000, "mobile", "4g", "/products"),
        coreWebVitals.initializeCoreWebVital("FID", 50, "mobile", "4g", "/products"),
        coreWebVitals.initializeCoreWebVital("CLS", 0.05, "mobile", "4g", "/products"),
      ];

      const score = coreWebVitals.calculateCoreWebVitalsScore(vitals);
      expect(score.score).toBeGreaterThan(0);
      expect(score.rating).toBe("good");
    });

    it("should get Core Web Vitals recommendations", () => {
      const vitals = [coreWebVitals.initializeCoreWebVital("LCP", 5000, "mobile", "4g", "/products")];

      const recommendations = coreWebVitals.getCoreWebVitalsRecommendations(vitals);
      expect(recommendations.length).toBeGreaterThan(0);
    });

    it("should calculate performance score by network type", () => {
      const metrics = [
        coreWebVitals.initializeUserExperienceMetric("/products", "mobile", "4g", 1000, 1500, 800, 2000, 0.05, 50),
        coreWebVitals.initializeUserExperienceMetric("/products", "mobile", "3g", 3000, 4000, 2000, 3500, 0.1, 100),
      ];

      const scores = coreWebVitals.calculatePerformanceScoreByNetworkType(metrics);
      expect(scores["4g"]).toBeDefined();
      expect(scores["3g"]).toBeDefined();
    });

    it("should get Philippines-specific recommendations", () => {
      const metrics = [
        coreWebVitals.initializeUserExperienceMetric("/products", "mobile", "3g", 2000, 2500, 1000, 2500, 0.05, 50),
        coreWebVitals.initializeUserExperienceMetric("/products", "mobile", "2g", 4000, 5000, 2000, 4000, 0.1, 100),
      ];

      const recommendations = coreWebVitals.getPhilippinesPerformanceRecommendations(metrics);
      expect(recommendations.length).toBeGreaterThan(0);
    });
  });

  describe("Error Tracking", () => {
    it("should initialize error event", () => {
      const error = errorTracking.initializeErrorEvent(
        "error",
        "high",
        "Database connection failed",
        "database",
        { query: "SELECT * FROM products" }
      );

      expect(error.type).toBe("error");
      expect(error.severity).toBe("high");
      expect(error.message).toBe("Database connection failed");
    });

    it("should categorize error by type", () => {
      const errorType = errorTracking.categorizeErrorByType("TypeError: Cannot read property");
      expect(errorType).toBe("TypeError");
    });

    it("should categorize error by severity", () => {
      const severity = errorTracking.categorizeErrorBySeverity("Critical database error", 500);
      expect(severity).toBe("critical");
    });

    it("should detect performance bottleneck", () => {
      const bottleneck = errorTracking.detectPerformanceBottleneck("query_time", 1000, 500, 1.5);

      expect(bottleneck).toBeDefined();
      expect(bottleneck?.severity).toBe("high");
    });

    it("should get error statistics", () => {
      const errors = [
        errorTracking.initializeErrorEvent("error", "high", "Error 1", "api"),
        errorTracking.initializeErrorEvent("error", "critical", "Error 2", "database"),
      ];

      const stats = errorTracking.getErrorStatistics(errors);
      expect(stats.totalErrors).toBe(2);
      expect(stats.errorsBySeverity["critical"]).toBe(1);
    });

    it("should get error recommendations", () => {
      const errors = [
        errorTracking.initializeErrorEvent("error", "critical", "Error 1", "api"),
        errorTracking.initializeErrorEvent("error", "critical", "Error 2", "api"),
      ];

      const recommendations = errorTracking.getErrorRecommendations(errors);
      expect(recommendations.length).toBeGreaterThan(0);
    });
  });

  describe("Monitoring Integration", () => {
    it("should initialize monitoring system", () => {
      const system = monitoringIntegration.initializeMonitoringSystem("Test System");

      expect(system.name).toBe("Test System");
      expect(system.status).toBe("active");
      expect(system.components.length).toBe(0);
    });

    it("should initialize monitoring component", () => {
      const component = monitoringIntegration.initializeMonitoringComponent("Real-time Monitoring", "realtime");

      expect(component.name).toBe("Real-time Monitoring");
      expect(component.type).toBe("realtime");
      expect(component.status).toBe("active");
    });

    it("should add component to system", () => {
      let system = monitoringIntegration.initializeMonitoringSystem("Test System");
      const component = monitoringIntegration.initializeMonitoringComponent("Real-time Monitoring", "realtime");
      system = monitoringIntegration.addComponentToSystem(system, component);

      expect(system.components.length).toBe(1);
    });

    it("should initialize monitoring integration", () => {
      const integration = monitoringIntegration.initializeMonitoringIntegration("Redis Cache", "cache", {
        host: "localhost",
      });

      expect(integration.name).toBe("Redis Cache");
      expect(integration.type).toBe("cache");
      expect(integration.status).toBe("disconnected");
    });

    it("should connect integration", () => {
      let integration = monitoringIntegration.initializeMonitoringIntegration("Redis Cache", "cache");
      integration = monitoringIntegration.connectIntegration(integration);

      expect(integration.status).toBe("connected");
      expect(integration.lastSync).toBeGreaterThan(0);
    });

    it("should get system health status", () => {
      let system = monitoringIntegration.initializeMonitoringSystem("Test System");
      const component = monitoringIntegration.initializeMonitoringComponent("Real-time Monitoring", "realtime");
      system = monitoringIntegration.addComponentToSystem(system, component);

      const health = monitoringIntegration.getSystemHealthStatus(system);
      expect(health).toBe("healthy");
    });

    it("should create default monitoring system", () => {
      const system = monitoringIntegration.createDefaultMonitoringSystem();

      expect(system.components.length).toBeGreaterThan(0);
      expect(system.integrations.length).toBeGreaterThan(0);
    });

    it("should generate unified performance report", () => {
      const system = monitoringIntegration.createDefaultMonitoringSystem();
      const report = monitoringIntegration.generateUnifiedPerformanceReport(
        system,
        { cacheHitRate: 85, avgResponseTime: 250 },
        { widgetCount: 6, edgeLocations: 5 },
        { activeAlerts: 2 },
        { score: 90, pageLoadTime: 1500 },
        { totalErrors: 5 },
        { avgQueryTime: 100, dataPointCount: 1000 }
      );

      expect(report.systemHealth).toBeDefined();
      expect(report.components).toBeDefined();
      expect(report.integrations).toBeDefined();
    });

    it("should get monitoring system summary", () => {
      const system = monitoringIntegration.createDefaultMonitoringSystem();
      const summary = monitoringIntegration.getMonitoringSystemSummary(system);

      expect(summary.totalComponents).toBeGreaterThan(0);
      expect(summary.totalIntegrations).toBeGreaterThan(0);
    });
  });

  describe("Integration Tests", () => {
    it("should perform complete monitoring workflow", () => {
      // 1. Initialize monitoring system
      const system = monitoringIntegration.createDefaultMonitoringSystem();
      expect(system.components.length).toBeGreaterThan(0);

      // 2. Collect performance metrics
      const apiMetrics = [
        realtimeMonitoring.initializeAPIResponseMetrics("/api/products", "GET", 250, 200, 0, 0, true),
      ];
      const summary = realtimeMonitoring.generatePerformanceSummary(
        apiMetrics,
        realtimeMonitoring.updateSystemResourceMetrics(
          realtimeMonitoring.initializeSystemResourceMetrics(),
          45,
          60,
          30,
          100,
          10,
          500
        ),
        []
      );
      expect(summary.metrics).toBeDefined();

      // 3. Create dashboard
      const dash = dashboard.createDefaultPerformanceDashboard();
      expect(dash.widgets.length).toBeGreaterThan(0);

      // 4. Set up alerts
      const rules = alertSystem.createDefaultAlertRules();
      expect(rules.length).toBeGreaterThan(0);

      // 5. Monitor Core Web Vitals
      const vitals = [coreWebVitals.initializeCoreWebVital("LCP", 2000, "mobile", "4g", "/products")];
      const vitalScore = coreWebVitals.calculateCoreWebVitalsScore(vitals);
      expect(vitalScore.score).toBeGreaterThan(0);

      // 6. Track errors
      const errors = [errorTracking.initializeErrorEvent("error", "high", "Test error", "api")];
      const errorStats = errorTracking.getErrorStatistics(errors);
      expect(errorStats.totalErrors).toBe(1);
    });

    it("should calculate total monitoring coverage", () => {
      const system = monitoringIntegration.createDefaultMonitoringSystem();
      const summary = monitoringIntegration.getMonitoringSystemSummary(system);

      const coverage = (summary.activeComponents / summary.totalComponents) * 100;
      expect(coverage).toBeGreaterThan(0);
    });
  });
});

