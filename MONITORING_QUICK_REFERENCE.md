# Performance Monitoring System - Quick Reference Guide

## 🚀 Quick Start

### Initialize Monitoring System
```typescript
import * as monitoring from './lib/monitoring-integration';

// Create default monitoring system
const system = monitoring.createDefaultMonitoringSystem();

// Get system health status
const health = monitoring.getSystemHealthStatus(system);
console.log(`System Health: ${health}`);
```

---

## 📊 Real-time Performance Monitoring

### Collect Performance Metrics
```typescript
import * as realtime from './lib/realtime-performance-monitoring';

// Initialize API response metrics
const metric = realtime.initializeAPIResponseMetrics(
  '/api/products',
  'GET',
  250,      // response time in ms
  200,      // status code
  1024,     // request size
  2048,     // response size
  true      // cache hit
);

// Calculate statistics
const avgTime = realtime.calculateAverageResponseTime([metric]);
const p95Time = realtime.calculateP95ResponseTime([metric]);
const cacheHitRate = realtime.calculateCacheHitRate([metric]);
const errorRate = realtime.calculateErrorRate([metric]);
```

### Monitor System Resources
```typescript
// Update system metrics
let metrics = realtime.initializeSystemResourceMetrics();
metrics = realtime.updateSystemResourceMetrics(
  metrics,
  45,      // CPU usage %
  60,      // Memory usage %
  30,      // Disk I/O rate
  100,     // Network bandwidth
  10,      // Active connections
  500      // Requests per second
);
```

---

## 📈 Performance Dashboard

### Create Dashboard
```typescript
import * as dashboard from './lib/performance-dashboard';

// Create default dashboard
const dash = dashboard.createDefaultPerformanceDashboard();

// Add custom metric widget
const widget = dashboard.initializeDashboardWidget(
  'Custom Metric',
  'metric',
  dashboard.initializeMetricWidget('Response Time', 250, 'ms', 'normal'),
  0, 0, 1, 1
);
const updatedDash = dashboard.addWidgetToDashboard(dash, widget);
```

### Dashboard Widgets
- **Metric Widget**: Display KPIs with status
- **Chart Widget**: Visualize trends over time
- **Gauge Widget**: Monitor resource usage
- **Alert Widget**: Show recent alerts

---

## 🚨 Alert System

### Create Alerts
```typescript
import * as alerts from './lib/alert-system';

// Initialize alert
const alert = alerts.initializeAlert(
  'performance',
  'warning',
  'High Response Time',
  'Response time exceeded 500ms',
  'api'
);

// Resolve alert
const resolved = alerts.resolveAlert(alert);
```

### Default Alert Rules
1. **High Response Time** - >500ms
2. **High Error Rate** - >1%
3. **Low Cache Hit Rate** - <70%
4. **High CPU Usage** - >80%
5. **High Memory Usage** - >85%
6. **Connection Pool Exhausted** - >18 connections
7. **Slow Database Query** - >5 slow queries
8. **High Disk I/O** - >80%

### Notification Channels
- Email
- SMS
- Slack
- Webhook
- In-app

---

## 🎯 Core Web Vitals Monitoring

### Monitor Core Web Vitals
```typescript
import * as vitals from './lib/core-web-vitals-monitoring';

// Initialize Core Web Vital
const lcp = vitals.initializeCoreWebVital(
  'LCP',
  2000,      // value in ms
  'mobile',  // device type
  '4g',      // network type
  '/products'
);

// Calculate score
const score = vitals.calculateCoreWebVitalsScore([lcp]);
console.log(`Core Web Vitals Score: ${score.score}`);

// Get recommendations
const recommendations = vitals.getCoreWebVitalsRecommendations([lcp]);
```

### Core Web Vitals Metrics
- **LCP** (Largest Contentful Paint): Good ≤2.5s
- **FID** (First Input Delay): Good ≤100ms
- **CLS** (Cumulative Layout Shift): Good ≤0.1
- **TTFB** (Time to First Byte): Good ≤600ms
- **FCP** (First Contentful Paint): Good ≤1.8s

### Philippines-Specific Monitoring
```typescript
// Get Philippines-specific recommendations
const recommendations = vitals.getPhilippinesPerformanceRecommendations(metrics);

// Analyze by network type
const scores = vitals.calculatePerformanceScoreByNetworkType(metrics);
console.log(`4G Score: ${scores['4g'].score}`);
console.log(`3G Score: ${scores['3g'].score}`);
console.log(`2G Score: ${scores['2g'].score}`);
```

---

## 🐛 Error Tracking

### Track Errors
```typescript
import * as errors from './lib/error-tracking';

// Initialize error event
const error = errors.initializeErrorEvent(
  'error',
  'high',
  'Database connection failed',
  'database',
  { query: 'SELECT * FROM products' }
);

// Get error statistics
const stats = errors.getErrorStatistics([error]);
console.log(`Total Errors: ${stats.totalErrors}`);
console.log(`Error Rate: ${stats.errorRate} errors/min`);

// Get recommendations
const recommendations = errors.getErrorRecommendations([error]);
```

### Error Categories
- **Type**: TypeError, ReferenceError, SyntaxError, etc.
- **Severity**: Low, Medium, High, Critical
- **Source**: API, Database, Frontend, System

### Performance Bottleneck Detection
```typescript
// Detect bottleneck
const bottleneck = errors.detectPerformanceBottleneck(
  'query_time',
  1000,  // current value
  500,   // baseline value
  1.5    // threshold multiplier
);

if (bottleneck) {
  console.log(`Bottleneck: ${bottleneck.description}`);
  console.log(`Recommendations: ${bottleneck.recommendations}`);
}
```

---

## 🔗 System Integration

### Create Integrated Monitoring System
```typescript
import * as integration from './lib/monitoring-integration';

// Create default system with all components
const system = integration.createDefaultMonitoringSystem();

// Get system health
const health = integration.getSystemHealthStatus(system);

// Generate unified report
const report = integration.generateUnifiedPerformanceReport(
  system,
  realtimeMetrics,
  dashboardMetrics,
  alertMetrics,
  vitalMetrics,
  errorMetrics,
  metricsData
);

console.log(`System Health: ${report.systemHealth}`);
console.log(`Active Alerts: ${report.components.alerts.activeAlerts}`);
console.log(`Core Web Vitals Score: ${report.components.vitals.score}`);
```

---

## 📋 Monitoring Checklist

### Setup
- [ ] Initialize monitoring system
- [ ] Configure alert rules
- [ ] Set up notification channels
- [ ] Create performance dashboard
- [ ] Enable Core Web Vitals tracking
- [ ] Configure error tracking

### Daily Monitoring
- [ ] Check system health status
- [ ] Review active alerts
- [ ] Monitor Core Web Vitals scores
- [ ] Check error rates
- [ ] Review performance trends

### Weekly Review
- [ ] Analyze performance metrics
- [ ] Review alert patterns
- [ ] Optimize slow endpoints
- [ ] Check Core Web Vitals trends
- [ ] Plan optimizations

### Monthly Analysis
- [ ] Generate performance report
- [ ] Identify optimization opportunities
- [ ] Plan capacity upgrades
- [ ] Review alert effectiveness
- [ ] Update baselines

---

## 🎯 Performance Targets

### Response Time
- **Target**: <250ms average
- **P95**: <500ms
- **P99**: <1000ms

### Error Rate
- **Target**: <0.5%
- **Alert**: >1%
- **Critical**: >5%

### Cache Hit Rate
- **Target**: >80%
- **Warning**: <70%
- **Critical**: <50%

### Core Web Vitals
- **LCP**: <2.5s (Good)
- **FID**: <100ms (Good)
- **CLS**: <0.1 (Good)

### System Resources
- **CPU**: <80% (Warning at 80%, Critical at 95%)
- **Memory**: <85% (Warning at 85%, Critical at 95%)
- **Disk I/O**: <80% (Warning at 80%, Critical at 95%)

---

## 🔧 Troubleshooting

### High Response Time
1. Check database query performance
2. Review cache hit rate
3. Check system resources
4. Analyze slow queries
5. Optimize indexes

### High Error Rate
1. Check error logs
2. Identify error patterns
3. Review recent changes
4. Check system health
5. Investigate root causes

### Low Cache Hit Rate
1. Review cache configuration
2. Check cache invalidation
3. Analyze cache keys
4. Monitor cache size
5. Optimize cache strategy

### Poor Core Web Vitals
1. Optimize images
2. Reduce CSS/JS
3. Improve server response time
4. Implement lazy loading
5. Use CDN

---

## 📞 Support

For detailed documentation, refer to:
- `PHASE_15_PERFORMANCE_MONITORING.md` - Complete monitoring guide
- `PHASE_15_COMPLETION_SUMMARY.md` - Phase 15 overview
- Individual module documentation in source files

---

**Last Updated**: 2025-11-01
**Version**: 1.0
**Status**: Production Ready ✅

