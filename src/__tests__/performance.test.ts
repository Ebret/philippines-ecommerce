import { describe, it, expect } from "vitest";
import {
  collectPerformanceMetric,
  measureCoreWebVitals,
  trackAPIPerformance,
  trackDatabaseQuery,
  analyzeBundleSize,
  calculateCacheMetrics,
  comparePerformance,
  calculateAverageResponseTime,
  calculateP95ResponseTime,
  calculateP99ResponseTime,
  calculateSuccessRate,
  calculateThroughput,
  identifySlowEndpoints,
  identifyFailedRequests,
  calculateQueryPerformance,
  calculateBundleSizeReduction,
  estimateLoadTime,
  calculatePerformanceScore,
  formatPerformanceMetric,
} from "@/lib/performance-utils";
import { APIPerformanceMetric, DatabaseQueryMetric } from "@/lib/validations/performance";

describe("Performance Utilities", () => {
  describe("Performance Metrics Collection", () => {
    it("should collect performance metric correctly", () => {
      const metric = collectPerformanceMetric("api_response_time", 150, "ms", {
        endpoint: "/api/products",
      });
      expect(metric.name).toBe("api_response_time");
      expect(metric.value).toBe(150);
      expect(metric.unit).toBe("ms");
      expect(metric.tags?.endpoint).toBe("/api/products");
      expect(metric.timestamp).toBeDefined();
    });

    it("should collect bundle size metric", () => {
      const metric = collectPerformanceMetric("bundle_size", 256, "kb");
      expect(metric.value).toBe(256);
      expect(metric.unit).toBe("kb");
    });

    it("should collect cache hit rate metric", () => {
      const metric = collectPerformanceMetric("cache_hit_rate", 85.5, "percent");
      expect(metric.value).toBe(85.5);
      expect(metric.unit).toBe("percent");
    });
  });

  describe("Core Web Vitals Measurement", () => {
    it("should measure core web vitals", () => {
      const vitals = measureCoreWebVitals();
      expect(vitals.timestamp).toBeDefined();
      // In Node.js environment, window is not available, so vitals will only have timestamp
      expect(vitals).toBeDefined();
      expect(typeof vitals.fcp === "number" || vitals.fcp === undefined).toBe(true);
      expect(typeof vitals.lcp === "number" || vitals.lcp === undefined).toBe(true);
      expect(typeof vitals.cls === "number" || vitals.cls === undefined).toBe(true);
    });
  });

  describe("API Performance Tracking", () => {
    it("should track API performance correctly", () => {
      const metric = trackAPIPerformance(
        "/api/products",
        "GET",
        150,
        200,
        1024,
        2048
      );
      expect(metric.endpoint).toBe("/api/products");
      expect(metric.method).toBe("GET");
      expect(metric.responseTime).toBe(150);
      expect(metric.statusCode).toBe(200);
      expect(metric.requestSize).toBe(1024);
      expect(metric.responseSize).toBe(2048);
      expect(metric.timestamp).toBeDefined();
    });

    it("should track failed API request", () => {
      const metric = trackAPIPerformance("/api/users", "POST", 500, 500);
      expect(metric.statusCode).toBe(500);
    });
  });

  describe("Database Query Performance Tracking", () => {
    it("should track database query performance", () => {
      const metric = trackDatabaseQuery(
        "SELECT * FROM products WHERE id = $1",
        45,
        1,
        true
      );
      expect(metric.query).toBe("SELECT * FROM products WHERE id = $1");
      expect(metric.executionTime).toBe(45);
      expect(metric.rowsAffected).toBe(1);
      expect(metric.indexUsed).toBe(true);
      expect(metric.timestamp).toBeDefined();
    });
  });

  describe("Bundle Size Analysis", () => {
    it("should analyze bundle size correctly", () => {
      const analysis = analyzeBundleSize(512, 128, [
        { name: "react", size: 200, gzippedSize: 50 },
        { name: "next", size: 150, gzippedSize: 40 },
        { name: "app", size: 162, gzippedSize: 38 },
      ]);
      expect(analysis.totalSize).toBe(512);
      expect(analysis.gzippedSize).toBe(128);
      expect(analysis.modules).toHaveLength(3);
      expect(analysis.modules?.[0].percentage).toBeCloseTo(39.06, 1);
    });
  });

  describe("Cache Metrics Calculation", () => {
    it("should calculate cache metrics correctly", () => {
      const metrics = calculateCacheMetrics("products_list", 950, 50, 1024, 3600);
      expect(metrics.cacheKey).toBe("products_list");
      expect(metrics.hitCount).toBe(950);
      expect(metrics.missCount).toBe(50);
      expect(metrics.hitRate).toBeCloseTo(95, 1);
      expect(metrics.size).toBe(1024);
      expect(metrics.ttl).toBe(3600);
    });

    it("should handle zero requests in cache metrics", () => {
      const metrics = calculateCacheMetrics("empty_cache", 0, 0);
      expect(metrics.hitRate).toBe(0);
    });
  });

  describe("Performance Comparison", () => {
    it("should compare performance correctly", () => {
      const comparison = comparePerformance(1000, 600);
      expect(comparison.improvement).toBe(400);
      expect(comparison.percentageChange).toBeCloseTo(40, 1);
      expect(comparison.isImproved).toBe(true);
    });

    it("should detect performance degradation", () => {
      const comparison = comparePerformance(500, 800);
      expect(comparison.improvement).toBe(-300);
      expect(comparison.percentageChange).toBeCloseTo(-60, 1);
      expect(comparison.isImproved).toBe(false);
    });
  });

  describe("Response Time Calculations", () => {
    const metrics: APIPerformanceMetric[] = [
      trackAPIPerformance("/api/products", "GET", 100, 200),
      trackAPIPerformance("/api/products", "GET", 150, 200),
      trackAPIPerformance("/api/products", "GET", 200, 200),
      trackAPIPerformance("/api/products", "GET", 250, 200),
      trackAPIPerformance("/api/products", "GET", 300, 200),
    ];

    it("should calculate average response time", () => {
      const avg = calculateAverageResponseTime(metrics);
      expect(avg).toBe(200);
    });

    it("should calculate P95 response time", () => {
      const p95 = calculateP95ResponseTime(metrics);
      expect(p95).toBeGreaterThanOrEqual(250);
    });

    it("should calculate P99 response time", () => {
      const p99 = calculateP99ResponseTime(metrics);
      expect(p99).toBeGreaterThanOrEqual(300);
    });

    it("should handle empty metrics array", () => {
      expect(calculateAverageResponseTime([])).toBe(0);
      expect(calculateP95ResponseTime([])).toBe(0);
      expect(calculateP99ResponseTime([])).toBe(0);
    });
  });

  describe("Success Rate Calculation", () => {
    it("should calculate success rate correctly", () => {
      const metrics: APIPerformanceMetric[] = [
        trackAPIPerformance("/api/products", "GET", 100, 200),
        trackAPIPerformance("/api/products", "GET", 150, 200),
        trackAPIPerformance("/api/products", "GET", 200, 500),
        trackAPIPerformance("/api/products", "GET", 250, 404),
      ];
      const rate = calculateSuccessRate(metrics);
      expect(rate).toBe(50);
    });
  });

  describe("Throughput Calculation", () => {
    it("should calculate throughput correctly", () => {
      const throughput = calculateThroughput(1000, 10);
      expect(throughput).toBe(100);
    });

    it("should handle zero duration", () => {
      const throughput = calculateThroughput(1000, 0);
      expect(throughput).toBe(0);
    });
  });

  describe("Slow Endpoint Identification", () => {
    it("should identify slow endpoints", () => {
      const metrics: APIPerformanceMetric[] = [
        trackAPIPerformance("/api/products", "GET", 500, 200),
        trackAPIPerformance("/api/orders", "GET", 1500, 200),
        trackAPIPerformance("/api/users", "GET", 800, 200),
      ];
      const slow = identifySlowEndpoints(metrics, 1000);
      expect(slow).toHaveLength(1);
      expect(slow[0].endpoint).toBe("/api/orders");
    });
  });

  describe("Failed Request Identification", () => {
    it("should identify failed requests", () => {
      const metrics: APIPerformanceMetric[] = [
        trackAPIPerformance("/api/products", "GET", 100, 200),
        trackAPIPerformance("/api/orders", "GET", 150, 500),
        trackAPIPerformance("/api/users", "GET", 200, 404),
      ];
      const failed = identifyFailedRequests(metrics);
      expect(failed).toHaveLength(2);
    });
  });

  describe("Database Query Performance", () => {
    it("should calculate query performance metrics", () => {
      const metrics: DatabaseQueryMetric[] = [
        trackDatabaseQuery("SELECT * FROM products", 50),
        trackDatabaseQuery("SELECT * FROM orders", 100),
        trackDatabaseQuery("SELECT * FROM users", 30),
      ];
      const perf = calculateQueryPerformance(metrics);
      expect(perf.averageTime).toBeCloseTo(60, 1);
      expect(perf.slowestQuery?.executionTime).toBe(100);
      expect(perf.fastestQuery?.executionTime).toBe(30);
      expect(perf.totalQueries).toBe(3);
    });

    it("should handle empty query metrics", () => {
      const perf = calculateQueryPerformance([]);
      expect(perf.averageTime).toBe(0);
      expect(perf.slowestQuery).toBeNull();
      expect(perf.fastestQuery).toBeNull();
      expect(perf.totalQueries).toBe(0);
    });
  });

  describe("Bundle Size Reduction", () => {
    it("should calculate bundle size reduction", () => {
      const reduction = calculateBundleSizeReduction(512, 256);
      expect(reduction.reduction).toBe(256);
      expect(reduction.percentageReduction).toBe(50);
    });
  });

  describe("Load Time Estimation", () => {
    it("should estimate load time for 3G connection", () => {
      const time = estimateLoadTime(256, 1.6); // 256KB on 1.6 Mbps (3G)
      expect(time).toBeGreaterThan(0);
    });

    it("should estimate load time for 4G connection", () => {
      const time4g = estimateLoadTime(256, 10); // 256KB on 10 Mbps (4G)
      const time3g = estimateLoadTime(256, 1.6); // 256KB on 1.6 Mbps (3G)
      expect(time4g).toBeLessThan(time3g);
    });
  });

  describe("Performance Score Calculation", () => {
    it("should calculate perfect performance score", () => {
      const vitals = {
        fcp: 1000,
        lcp: 2000,
        cls: 0.05,
        tti: 3000,
        tbt: 100,
        timestamp: new Date(),
      };
      const score = calculatePerformanceScore(vitals);
      expect(score).toBe(100);
    });

    it("should calculate poor performance score", () => {
      const vitals = {
        fcp: 4000,
        lcp: 5000,
        cls: 0.3,
        tti: 8000,
        tbt: 700,
        timestamp: new Date(),
      };
      const score = calculatePerformanceScore(vitals);
      expect(score).toBeLessThan(50);
    });
  });

  describe("Performance Metric Formatting", () => {
    it("should format milliseconds", () => {
      expect(formatPerformanceMetric(150.5, "ms")).toBe("150.50ms");
    });

    it("should format kilobytes", () => {
      const formatted = formatPerformanceMetric(1024 * 1024, "kb");
      expect(formatted).toContain("KB");
    });

    it("should format percentage", () => {
      expect(formatPerformanceMetric(85.5, "percent")).toBe("85.50%");
    });

    it("should format count", () => {
      expect(formatPerformanceMetric(1000.7, "count")).toBe("1001");
    });
  });
});

