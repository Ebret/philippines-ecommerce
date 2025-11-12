import { z } from "zod";

// Performance Metrics Schemas
export const PerformanceMetricSchema = z.object({
  name: z.string().min(1, "Metric name is required"),
  value: z.number().min(0, "Metric value must be non-negative"),
  unit: z.enum(["ms", "kb", "mb", "percent", "count"]),
  timestamp: z.date().optional(),
  tags: z.record(z.string(), z.string()).optional(),
});

export const CoreWebVitalsSchema = z.object({
  fcp: z.number().min(0).optional(), // First Contentful Paint
  lcp: z.number().min(0).optional(), // Largest Contentful Paint
  cls: z.number().min(0).optional(), // Cumulative Layout Shift
  tti: z.number().min(0).optional(), // Time to Interactive
  tbt: z.number().min(0).optional(), // Total Blocking Time
  fid: z.number().min(0).optional(), // First Input Delay
  timestamp: z.date().optional(),
});

export const APIPerformanceMetricSchema = z.object({
  endpoint: z.string().min(1, "Endpoint is required"),
  method: z.enum(["GET", "POST", "PATCH", "DELETE", "PUT"]),
  responseTime: z.number().min(0, "Response time must be non-negative"),
  statusCode: z.number().min(100).max(599),
  requestSize: z.number().min(0).optional(),
  responseSize: z.number().min(0).optional(),
  timestamp: z.date().optional(),
  userId: z.string().optional(),
});

export const DatabaseQueryMetricSchema = z.object({
  query: z.string().min(1, "Query is required"),
  executionTime: z.number().min(0, "Execution time must be non-negative"),
  rowsAffected: z.number().min(0).optional(),
  indexUsed: z.boolean().optional(),
  timestamp: z.date().optional(),
});

export const BundleAnalysisSchema = z.object({
  totalSize: z.number().min(0, "Total size must be non-negative"),
  gzippedSize: z.number().min(0, "Gzipped size must be non-negative"),
  modules: z.array(
    z.object({
      name: z.string(),
      size: z.number().min(0),
      gzippedSize: z.number().min(0),
      percentage: z.number().min(0).max(100),
    })
  ).optional(),
  timestamp: z.date().optional(),
});

export const CacheMetricSchema = z.object({
  cacheKey: z.string().min(1, "Cache key is required"),
  hitCount: z.number().min(0),
  missCount: z.number().min(0),
  hitRate: z.number().min(0).max(100),
  size: z.number().min(0).optional(),
  ttl: z.number().min(0).optional(),
  timestamp: z.date().optional(),
});

export const ImageOptimizationSchema = z.object({
  originalSize: z.number().min(0, "Original size must be non-negative"),
  optimizedSize: z.number().min(0, "Optimized size must be non-negative"),
  format: z.enum(["webp", "jpg", "png", "avif"]),
  width: z.number().min(1).optional(),
  height: z.number().min(1).optional(),
  compressionRatio: z.number().min(0).optional(),
});

export const LoadTestResultSchema = z.object({
  testName: z.string().min(1, "Test name is required"),
  concurrentUsers: z.number().min(1),
  duration: z.number().min(1, "Duration must be at least 1 second"),
  totalRequests: z.number().min(0),
  successfulRequests: z.number().min(0),
  failedRequests: z.number().min(0),
  averageResponseTime: z.number().min(0),
  minResponseTime: z.number().min(0),
  maxResponseTime: z.number().min(0),
  p95ResponseTime: z.number().min(0),
  p99ResponseTime: z.number().min(0),
  throughput: z.number().min(0),
  timestamp: z.date().optional(),
});

export const PerformanceAlertSchema = z.object({
  name: z.string().min(1, "Alert name is required"),
  metric: z.string().min(1, "Metric is required"),
  threshold: z.number(),
  operator: z.enum(["gt", "gte", "lt", "lte", "eq", "ne"]),
  enabled: z.boolean().default(true),
  severity: z.enum(["low", "medium", "high", "critical"]),
  notificationChannels: z.array(z.enum(["email", "slack", "webhook"])).optional(),
});

export const PerformanceMonitoringConfigSchema = z.object({
  enabled: z.boolean().default(true),
  sampleRate: z.number().min(0).max(1).default(0.1),
  collectCoreWebVitals: z.boolean().default(true),
  collectAPIMetrics: z.boolean().default(true),
  collectDatabaseMetrics: z.boolean().default(true),
  collectCacheMetrics: z.boolean().default(true),
  retentionDays: z.number().min(1).default(30),
  alerts: z.array(PerformanceAlertSchema).optional(),
});

export const PerformanceQuerySchema = z.object({
  metric: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  limit: z.number().min(1).max(1000).default(100),
  offset: z.number().min(0).default(0),
  groupBy: z.enum(["hour", "day", "week", "month"]).optional(),
  tags: z.record(z.string(), z.string()).optional(),
});

export const PerformanceComparisonSchema = z.object({
  baselineDate: z.date(),
  comparisonDate: z.date(),
  metrics: z.array(z.string()),
  threshold: z.number().min(0).max(100).optional(),
});

export const PerformanceReportSchema = z.object({
  title: z.string().min(1, "Report title is required"),
  startDate: z.date(),
  endDate: z.date(),
  metrics: z.array(PerformanceMetricSchema),
  summary: z.string().optional(),
  recommendations: z.array(z.string()).optional(),
  generatedAt: z.date().optional(),
});

// Export types
export type PerformanceMetric = z.infer<typeof PerformanceMetricSchema>;
export type CoreWebVitals = z.infer<typeof CoreWebVitalsSchema>;
export type APIPerformanceMetric = z.infer<typeof APIPerformanceMetricSchema>;
export type DatabaseQueryMetric = z.infer<typeof DatabaseQueryMetricSchema>;
export type BundleAnalysis = z.infer<typeof BundleAnalysisSchema>;
export type CacheMetric = z.infer<typeof CacheMetricSchema>;
export type ImageOptimization = z.infer<typeof ImageOptimizationSchema>;
export type LoadTestResult = z.infer<typeof LoadTestResultSchema>;
export type PerformanceAlert = z.infer<typeof PerformanceAlertSchema>;
export type PerformanceMonitoringConfig = z.infer<typeof PerformanceMonitoringConfigSchema>;
export type PerformanceQuery = z.infer<typeof PerformanceQuerySchema>;
export type PerformanceComparison = z.infer<typeof PerformanceComparisonSchema>;
export type PerformanceReport = z.infer<typeof PerformanceReportSchema>;

