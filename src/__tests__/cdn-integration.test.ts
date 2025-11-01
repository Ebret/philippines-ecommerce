import { describe, it, expect } from "vitest";
import * as cdnSetup from "../lib/cdn-setup";
import * as staticAssetOptimization from "../lib/static-asset-optimization";
import * as imageDeliveryOptimization from "../lib/image-delivery-optimization";
import * as edgeCachingConfig from "../lib/edge-caching-config";
import * as cdnPerformanceMonitoring from "../lib/cdn-performance-monitoring";
import * as cdnFailoverStrategy from "../lib/cdn-failover-strategy";

describe("CDN Integration & Configuration", () => {
  describe("CDN Setup", () => {
    it("should get default CDN configuration", () => {
      const config = cdnSetup.getCDNConfiguration("production");
      expect(config).toBeDefined();
      expect(config.provider).toBeDefined();
      expect(config.enableCompression).toBe(true);
      expect(config.enableHTTP2).toBe(true);
    });

    it("should create origin server", () => {
      const origin = cdnSetup.createOriginServer("origin1", "origin1.ecommerce.ph");
      expect(origin).toBeDefined();
      expect(origin.name).toBe("origin1");
      expect(origin.domain).toBe("origin1.ecommerce.ph");
      expect(origin.protocol).toBe("https");
    });

    it("should get Southeast Asia edge locations", () => {
      const locations = cdnSetup.getSoutheastAsiaEdgeLocations();
      expect(locations).toBeDefined();
      expect(locations.length).toBeGreaterThan(0);
      expect(locations[0].code).toBe("PH-MNL");
    });

    it("should get primary edge location", () => {
      const location = cdnSetup.getPrimaryEdgeLocation();
      expect(location).toBeDefined();
      expect(location.code).toBe("PH-MNL");
    });

    it("should initialize CDN health check", () => {
      const healthCheck = cdnSetup.initializeCDNHealthCheck("origin1");
      expect(healthCheck).toBeDefined();
      expect(healthCheck.status).toBe("healthy");
      expect(healthCheck.consecutiveFailures).toBe(0);
    });

    it("should update CDN health check on success", () => {
      let healthCheck = cdnSetup.initializeCDNHealthCheck("origin1");
      healthCheck = cdnSetup.updateCDNHealthCheck(healthCheck, 100, 200, true);
      expect(healthCheck.responseTime).toBe(100);
      expect(healthCheck.statusCode).toBe(200);
      expect(healthCheck.consecutiveSuccesses).toBe(1);
    });

    it("should get CDN provider configuration", () => {
      const config = cdnSetup.getCDNProviderConfig("cloudflare");
      expect(config).toBeDefined();
      expect(config.name).toBe("CloudFlare");
      expect(config.features).toContain("Global CDN");
    });

    it("should get CDN setup recommendations", () => {
      const recommendations = cdnSetup.getCDNSetupRecommendations();
      expect(recommendations).toBeDefined();
      expect(recommendations.recommendations).toContain("Use CloudFlare or AWS CloudFront for global coverage");
      expect(recommendations.bestPractices.length).toBeGreaterThan(0);
      expect(recommendations.securityMeasures.length).toBeGreaterThan(0);
    });

    it("should get CDN DNS configuration", () => {
      const dnsConfig = cdnSetup.getCDNDNSConfiguration();
      expect(dnsConfig).toBeDefined();
      expect(dnsConfig.length).toBeGreaterThan(0);
      expect(dnsConfig[0].recordType).toBe("CNAME");
    });

    it("should get CDN failover strategy", () => {
      const strategy = cdnSetup.getCDNFailoverStrategy();
      expect(strategy).toBeDefined();
      expect(strategy.strategy).toBe("Automatic failover with health checks");
      expect(strategy.backupOrigins.length).toBeGreaterThan(0);
    });

    it("should get CDN deployment checklist", () => {
      const checklist = cdnSetup.getCDNDeploymentChecklist();
      expect(checklist).toBeDefined();
      expect(checklist.length).toBeGreaterThan(0);
      expect(checklist[0].task).toBe("Select CDN provider");
    });
  });

  describe("Static Asset Optimization", () => {
    it("should get asset cache headers", () => {
      const headers = staticAssetOptimization.getAssetCacheHeaders("image", 31536000);
      expect(headers).toBeDefined();
      expect(headers.cacheControl).toContain("public");
      expect(headers.cacheControl).toContain("max-age=31536000");
    });

    it("should get asset optimization configuration", () => {
      const config = staticAssetOptimization.getAssetOptimizationConfig("image");
      expect(config).toBeDefined();
      expect(config.cacheable).toBe(true);
      expect(config.ttl).toBe(31536000);
    });

    it("should calculate compression ratio", () => {
      const ratio = staticAssetOptimization.calculateCompressionRatio(1000, 400);
      expect(ratio).toBe(60);
    });

    it("should get compression algorithm recommendation", () => {
      const recommendation = staticAssetOptimization.getCompressionAlgorithmRecommendation("css");
      expect(recommendation).toBeDefined();
      expect(recommendation.recommended).toBe("brotli");
    });

    it("should get asset versioning strategy", () => {
      const strategy = staticAssetOptimization.getAssetVersioningStrategy();
      expect(strategy).toBeDefined();
      expect(strategy.methods.length).toBeGreaterThan(0);
    });

    it("should initialize asset optimization metrics", () => {
      const metrics = staticAssetOptimization.initializeAssetOptimizationMetrics();
      expect(metrics).toBeDefined();
      expect(metrics.totalAssets).toBe(0);
      expect(metrics.compressionRatio).toBe(0);
    });

    it("should get asset delivery performance metrics", () => {
      const metrics = staticAssetOptimization.getAssetDeliveryPerformanceMetrics();
      expect(metrics).toBeDefined();
      expect(metrics.length).toBeGreaterThan(0);
      expect(metrics[0].metric).toBe("CSS delivery");
    });
  });

  describe("Image Delivery Optimization", () => {
    it("should get image optimization configuration", () => {
      const config = imageDeliveryOptimization.getImageOptimizationConfig("production");
      expect(config).toBeDefined();
      expect(config.enableWebP).toBe(true);
      expect(config.enableAVIF).toBe(true);
    });

    it("should get responsive image srcset", () => {
      const srcset = imageDeliveryOptimization.getResponsiveImageSrcSet("/images/product.jpg");
      expect(srcset).toBeDefined();
      expect(srcset).toContain("320w");
    });

    it("should create responsive image", () => {
      const image = imageDeliveryOptimization.createResponsiveImage(
        "/images/product.jpg",
        "Product image",
        800,
        600
      );
      expect(image).toBeDefined();
      expect(image.alt).toBe("Product image");
      expect(image.width).toBe(800);
      expect(image.height).toBe(600);
      expect(image.formats.length).toBeGreaterThan(0);
    });

    it("should get image format recommendation", () => {
      const recommendation = imageDeliveryOptimization.getImageFormatRecommendation("photograph");
      expect(recommendation).toBeDefined();
      expect(recommendation.recommended).toBe("avif");
    });

    it("should get lazy loading strategy", () => {
      const strategy = imageDeliveryOptimization.getLazyLoadingStrategy();
      expect(strategy).toBeDefined();
      expect(strategy.methods.length).toBeGreaterThan(0);
    });

    it("should initialize image delivery metrics", () => {
      const metrics = imageDeliveryOptimization.initializeImageDeliveryMetrics();
      expect(metrics).toBeDefined();
      expect(metrics.totalImages).toBe(0);
    });

    it("should get image delivery performance metrics", () => {
      const metrics = imageDeliveryOptimization.getImageDeliveryPerformanceMetrics();
      expect(metrics).toBeDefined();
      expect(metrics.length).toBeGreaterThan(0);
    });
  });

  describe("Edge Caching Configuration", () => {
    it("should get edge cache rule for path", () => {
      const rule = edgeCachingConfig.getEdgeCacheRuleForPath("/static/app.js");
      expect(rule).toBeDefined();
      expect(rule?.path).toBe("/static/*");
    });

    it("should get cache control header", () => {
      const rule = edgeCachingConfig.DEFAULT_EDGE_CACHE_RULES[0];
      const header = edgeCachingConfig.getCacheControlHeader(rule);
      expect(header).toBeDefined();
      expect(header).toContain("public");
      expect(header).toContain("max-age");
    });

    it("should get cache key", () => {
      const rule = edgeCachingConfig.DEFAULT_EDGE_CACHE_RULES[0];
      const key = edgeCachingConfig.getCacheKey("/static/app.js", rule);
      expect(key).toBe("/static/app.js");
    });

    it("should initialize edge cache metrics", () => {
      const metrics = edgeCachingConfig.initializeEdgeCacheMetrics();
      expect(metrics).toBeDefined();
      expect(metrics.totalRequests).toBe(0);
      expect(metrics.hitRate).toBe(0);
    });

    it("should update edge cache metrics", () => {
      let metrics = edgeCachingConfig.initializeEdgeCacheMetrics();
      metrics = edgeCachingConfig.updateEdgeCacheMetrics(metrics, true, 100, 1000, "PH-MNL");
      expect(metrics.totalRequests).toBe(1);
      expect(metrics.cacheHits).toBe(1);
      expect(metrics.hitRate).toBe(100);
    });

    it("should get edge cache strategy", () => {
      const strategy = edgeCachingConfig.getEdgeCacheStrategy("static");
      expect(strategy).toBeDefined();
      expect(strategy?.name).toBe("Static Assets");
    });

    it("should get edge cache performance metrics", () => {
      const metrics = edgeCachingConfig.getEdgeCachePerformanceMetrics();
      expect(metrics).toBeDefined();
      expect(metrics.length).toBeGreaterThan(0);
    });
  });

  describe("CDN Performance Monitoring", () => {
    it("should initialize CDN performance metrics", () => {
      const metrics = cdnPerformanceMonitoring.initializeCDNPerformanceMetrics();
      expect(metrics).toBeDefined();
      expect(metrics.totalRequests).toBe(0);
      expect(metrics.hitRate).toBe(0);
    });

    it("should update CDN performance metrics", () => {
      let metrics = cdnPerformanceMonitoring.initializeCDNPerformanceMetrics();
      metrics = cdnPerformanceMonitoring.updateCDNPerformanceMetrics(
        metrics,
        true,
        100,
        1000,
        "PH-MNL"
      );
      expect(metrics.totalRequests).toBe(1);
      expect(metrics.cacheHits).toBe(1);
      expect(metrics.hitRate).toBe(100);
    });

    it("should get CDN health status", () => {
      let metrics = cdnPerformanceMonitoring.initializeCDNPerformanceMetrics();
      metrics = cdnPerformanceMonitoring.updateCDNPerformanceMetrics(
        metrics,
        true,
        100,
        1000,
        "PH-MNL"
      );
      const health = cdnPerformanceMonitoring.getCDNHealthStatus(metrics);
      expect(health).toBeDefined();
      expect(health.status).toBe("healthy");
    });

    it("should create CDN alert", () => {
      const alert = cdnPerformanceMonitoring.createCDNAlert(
        "warning",
        "Low cache hit rate",
        "hitRate",
        70,
        60
      );
      expect(alert).toBeDefined();
      expect(alert.type).toBe("warning");
      expect(alert.resolved).toBe(false);
    });

    it("should get CDN alerts", () => {
      let metrics = cdnPerformanceMonitoring.initializeCDNPerformanceMetrics();
      metrics.hitRate = 40; // Low hit rate
      const alerts = cdnPerformanceMonitoring.getCDNAlerts(metrics);
      expect(alerts).toBeDefined();
      expect(alerts.length).toBeGreaterThan(0);
    });

    it("should get CDN efficiency score", () => {
      let metrics = cdnPerformanceMonitoring.initializeCDNPerformanceMetrics();
      metrics.hitRate = 85;
      metrics.averageResponseTime = 300;
      metrics.errorRate = 0.5;
      const score = cdnPerformanceMonitoring.getCDNEfficiencyScore(metrics);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it("should generate CDN performance report", () => {
      let metrics = cdnPerformanceMonitoring.initializeCDNPerformanceMetrics();
      metrics = cdnPerformanceMonitoring.updateCDNPerformanceMetrics(
        metrics,
        true,
        100,
        1000,
        "PH-MNL"
      );
      const report = cdnPerformanceMonitoring.generateCDNPerformanceReport(metrics);
      expect(report).toBeDefined();
      expect(report.totalRequests).toBe(1);
    });

    it("should get CDN monitoring dashboard data", () => {
      let metrics = cdnPerformanceMonitoring.initializeCDNPerformanceMetrics();
      metrics = cdnPerformanceMonitoring.updateCDNPerformanceMetrics(
        metrics,
        true,
        100,
        1000,
        "PH-MNL"
      );
      const dashboard = cdnPerformanceMonitoring.getCDNMonitoringDashboardData(metrics);
      expect(dashboard).toBeDefined();
      expect(dashboard.hitRate).toBe(100);
    });
  });

  describe("CDN Failover Strategy", () => {
    it("should initialize origin server status", () => {
      const status = cdnFailoverStrategy.initializeOriginServerStatus(
        "origin1",
        "Origin 1",
        "origin1.ecommerce.ph"
      );
      expect(status).toBeDefined();
      expect(status.status).toBe("healthy");
      expect(status.consecutiveFailures).toBe(0);
    });

    it("should update origin server status on success", () => {
      let status = cdnFailoverStrategy.initializeOriginServerStatus(
        "origin1",
        "Origin 1",
        "origin1.ecommerce.ph"
      );
      status = cdnFailoverStrategy.updateOriginServerStatus(status, 100, 200, true);
      expect(status.responseTime).toBe(100);
      expect(status.consecutiveSuccesses).toBe(1);
    });

    it("should check if origin server is healthy", () => {
      const status = cdnFailoverStrategy.initializeOriginServerStatus(
        "origin1",
        "Origin 1",
        "origin1.ecommerce.ph"
      );
      expect(cdnFailoverStrategy.isOriginServerHealthy(status)).toBe(true);
    });

    it("should get healthy origin servers", () => {
      const status1 = cdnFailoverStrategy.initializeOriginServerStatus(
        "origin1",
        "Origin 1",
        "origin1.ecommerce.ph"
      );
      const status2 = cdnFailoverStrategy.initializeOriginServerStatus(
        "origin2",
        "Origin 2",
        "origin2.ecommerce.ph"
      );
      const healthy = cdnFailoverStrategy.getHealthyOriginServers([status1, status2]);
      expect(healthy.length).toBe(2);
    });

    it("should create failover event", () => {
      const event = cdnFailoverStrategy.createFailoverEvent(
        "failover",
        "origin1.ecommerce.ph",
        "origin2.ecommerce.ph",
        "Origin 1 unhealthy",
        "success"
      );
      expect(event).toBeDefined();
      expect(event.type).toBe("failover");
      expect(event.status).toBe("success");
    });

    it("should initialize failover metrics", () => {
      const metrics = cdnFailoverStrategy.initializeFailoverMetrics();
      expect(metrics).toBeDefined();
      expect(metrics.totalFailovers).toBe(0);
      expect(metrics.uptime).toBe(100);
    });

    it("should get failover strategy recommendations", () => {
      const recommendations = cdnFailoverStrategy.getFailoverStrategyRecommendations();
      expect(recommendations).toBeDefined();
      expect(recommendations.length).toBeGreaterThan(0);
      expect(recommendations[0].strategy).toBe("Active-Passive");
    });

    it("should get failover performance metrics", () => {
      const metrics = cdnFailoverStrategy.getFailoverPerformanceMetrics();
      expect(metrics).toBeDefined();
      expect(metrics.length).toBeGreaterThan(0);
    });

    it("should get failover deployment checklist", () => {
      const checklist = cdnFailoverStrategy.getFailoverDeploymentChecklist();
      expect(checklist).toBeDefined();
      expect(checklist.length).toBeGreaterThan(0);
      expect(checklist[0].task).toBe("Select failover strategy");
    });
  });
});

