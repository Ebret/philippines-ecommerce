import { describe, it, expect, beforeEach } from "vitest";
import * as queryAnalysis from "../lib/query-performance-analysis";
import * as indexOptimization from "../lib/index-optimization";
import * as queryRewriting from "../lib/query-rewriting";
import * as connectionPooling from "../lib/connection-pooling";
import * as schemaOptimization from "../lib/database-schema-optimization";
import * as performanceMonitoring from "../lib/database-performance-monitoring";

describe("Database Query Optimization", () => {
  describe("Query Performance Analysis", () => {
    it("should initialize query performance metrics", () => {
      const metrics = queryAnalysis.initializeQueryPerformanceMetrics(
        "q1",
        "SELECT * FROM products",
        150,
        100,
        500,
        ["idx_products_id"],
        false
      );

      expect(metrics.queryId).toBe("q1");
      expect(metrics.executionTime).toBe(150);
      expect(metrics.status).toBe("slow");
    });

    it("should identify slow queries", () => {
      const metrics = [
        queryAnalysis.initializeQueryPerformanceMetrics("q1", "SELECT * FROM products", 150, 100, 500),
        queryAnalysis.initializeQueryPerformanceMetrics("q2", "SELECT * FROM orders", 600, 50, 1000),
      ];

      const slowQueries = queryAnalysis.identifySlowQueries(metrics);
      expect(slowQueries.length).toBeGreaterThan(0);
      // The second query has 600ms execution time, which is > 500ms threshold, so it's critical
      expect(slowQueries[0].status).toMatch(/slow|critical/);
    });

    it("should identify query bottlenecks", () => {
      const metrics = [
        queryAnalysis.initializeQueryPerformanceMetrics("q1", "SELECT * FROM products", 200, 100, 5000, [], true),
      ];

      const bottlenecks = queryAnalysis.identifyQueryBottlenecks(metrics);
      expect(bottlenecks.length).toBeGreaterThan(0);
      expect(bottlenecks[0].type).toBe("full_table_scan");
    });

    it("should calculate database query statistics", () => {
      const metrics = [
        queryAnalysis.initializeQueryPerformanceMetrics("q1", "SELECT * FROM products", 50, 100, 100),
        queryAnalysis.initializeQueryPerformanceMetrics("q2", "SELECT * FROM orders", 150, 50, 500),
      ];

      const stats = queryAnalysis.calculateDatabaseQueryStats(metrics);
      expect(stats.totalQueries).toBe(2);
      expect(stats.averageExecutionTime).toBe(100);
      expect(stats.slowQueryCount).toBe(1);
    });

    it("should generate query performance report", () => {
      const metrics = [
        queryAnalysis.initializeQueryPerformanceMetrics("q1", "SELECT * FROM products", 150, 100, 500),
      ];

      const report = queryAnalysis.generateQueryPerformanceReport(metrics);
      expect(report.stats.totalQueries).toBe(1);
      expect(report.slowQueries.length).toBeGreaterThan(0);
    });
  });

  describe("Index Optimization", () => {
    it("should initialize database index", () => {
      const index = indexOptimization.initializeDatabaseIndex("idx_products_id", "products", ["id"]);

      expect(index.name).toBe("idx_products_id");
      expect(index.table).toBe("products");
      expect(index.isUsed).toBe(false);
    });

    it("should update index usage", () => {
      let index = indexOptimization.initializeDatabaseIndex("idx_products_id", "products", ["id"]);
      index = indexOptimization.updateIndexUsage(index, true);

      expect(index.usageCount).toBe(1);
      expect(index.isUsed).toBe(true);
    });

    it("should calculate index efficiency", () => {
      let index = indexOptimization.initializeDatabaseIndex("idx_products_id", "products", ["id"], "composite", 1024 * 1024);
      index = indexOptimization.updateIndexUsage(index, true);

      const efficiency = indexOptimization.calculateIndexEfficiency(index);
      expect(efficiency).toBeGreaterThan(0);
    });

    it("should analyze indexes", () => {
      const indexes = [
        indexOptimization.initializeDatabaseIndex("idx_products_id", "products", ["id"]),
        indexOptimization.initializeDatabaseIndex("idx_products_status", "products", ["status"]),
      ];

      const analysis = indexOptimization.analyzeIndexes(indexes);
      expect(analysis.totalIndexes).toBe(2);
      expect(analysis.recommendations.length).toBeGreaterThan(0);
    });

    it("should get index creation SQL", () => {
      const sql = indexOptimization.getIndexCreationSQL("products", ["category_id", "status"]);
      expect(sql).toContain("CREATE INDEX");
      expect(sql).toContain("products");
    });

    it("should get composite index recommendations", () => {
      const queries = [
        "SELECT * FROM products WHERE category_id = 1 AND status = 'active'",
        "SELECT * FROM products WHERE category_id = 1 AND status = 'active'",
      ];

      const recommendations = indexOptimization.getCompositeIndexRecommendations(queries);
      expect(recommendations.length).toBeGreaterThan(0);
    });
  });

  describe("Query Rewriting", () => {
    it("should optimize SELECT * queries", () => {
      const query = "SELECT * FROM products";
      const optimized = queryRewriting.optimizeSelectStar(query, ["id", "name", "price"]);

      expect(optimized.optimizedQuery).not.toContain("SELECT *");
      expect(optimized.expectedImprovement).toBe(30);
    });

    it("should replace subqueries with JOINs", () => {
      const query = "SELECT * FROM products WHERE id IN (SELECT product_id FROM orders WHERE status = 'completed')";
      const optimized = queryRewriting.replaceSubqueryWithJoin(query);

      expect(optimized.optimizationType).toBe("Subquery Replacement");
      expect(optimized.expectedImprovement).toBe(60);
    });

    it("should optimize LIKE patterns", () => {
      const query = "SELECT * FROM products WHERE name LIKE '%phone%'";
      const optimized = queryRewriting.optimizeLikePattern(query);

      expect(optimized.optimizationType).toBe("LIKE Pattern Optimization");
      expect(optimized.expectedImprovement).toBe(50);
    });

    it("should get query optimization suggestions", () => {
      const query = "SELECT * FROM products WHERE name LIKE '%phone%'";
      const suggestions = queryRewriting.getQueryOptimizationSuggestions(query);

      expect(suggestions.length).toBeGreaterThan(0);
    });

    it("should generate query rewriting report", () => {
      const queries = ["SELECT * FROM products", "SELECT * FROM orders WHERE id IN (SELECT order_id FROM items)"];
      const report = queryRewriting.generateQueryRewritingReport(queries);

      expect(report.optimizations.length).toBeGreaterThan(0);
      expect(report.totalExpectedImprovement).toBeGreaterThan(0);
    });
  });

  describe("Connection Pooling", () => {
    it("should initialize connection pool config", () => {
      const config = connectionPooling.getConnectionPoolConfig("production");

      expect(config.minConnections).toBeGreaterThan(0);
      expect(config.maxConnections).toBeGreaterThan(config.minConnections);
    });

    it("should initialize pooled connection", () => {
      const connection = connectionPooling.initializePooledConnection("conn1");

      expect(connection.id).toBe("conn1");
      expect(connection.status).toBe("available");
      expect(connection.queryCount).toBe(0);
    });

    it("should acquire and release connection", () => {
      let connection = connectionPooling.initializePooledConnection("conn1");
      connection = connectionPooling.acquireConnection(connection);

      expect(connection.status).toBe("in_use");

      connection = connectionPooling.releaseConnection(connection, 50);
      expect(connection.status).toBe("available");
      expect(connection.queryCount).toBe(1);
    });

    it("should update connection pool metrics", () => {
      const connections = [connectionPooling.initializePooledConnection("conn1")];
      let metrics = connectionPooling.initializeConnectionPoolMetrics();

      metrics = connectionPooling.updateConnectionPoolMetrics(metrics, connections, 10, 50);
      expect(metrics.totalConnections).toBe(1);
      expect(metrics.averageAcquisitionTime).toBe(10);
    });

    it("should get connection pool health status", () => {
      const config = connectionPooling.getConnectionPoolConfig("production");
      const connections = Array.from({ length: 15 }, (_, i) => connectionPooling.initializePooledConnection(`conn${i}`));
      let metrics = connectionPooling.initializeConnectionPoolMetrics();

      metrics = connectionPooling.updateConnectionPoolMetrics(metrics, connections);
      const health = connectionPooling.getConnectionPoolHealthStatus(metrics, config);

      expect(health.status).toBeDefined();
      expect(health.recommendations.length).toBeGreaterThan(0);
    });

    it("should get connection pool sizing recommendations", () => {
      const recommendations = connectionPooling.getConnectionPoolSizingRecommendations(100);

      expect(recommendations.minConnections).toBeGreaterThan(0);
      expect(recommendations.maxConnections).toBeGreaterThan(recommendations.minConnections);
    });
  });

  describe("Database Schema Optimization", () => {
    it("should get schema optimization recommendations", () => {
      const recommendations = schemaOptimization.getSchemaOptimizationRecommendations();

      expect(recommendations.length).toBeGreaterThan(0);
      expect(recommendations[0].type).toBeDefined();
    });

    it("should get normalization recommendations", () => {
      const recommendations = schemaOptimization.getNormalizationRecommendations();

      expect(recommendations.length).toBeGreaterThan(0);
      expect(recommendations[0].table).toBeDefined();
    });

    it("should get denormalization recommendations", () => {
      const recommendations = schemaOptimization.getDenormalizationRecommendations();

      expect(recommendations.length).toBeGreaterThan(0);
    });

    it("should calculate schema optimization impact", () => {
      const recommendations = schemaOptimization.getSchemaOptimizationRecommendations();
      const impact = schemaOptimization.calculateSchemaOptimizationImpact(recommendations);

      expect(impact.totalRecommendations).toBeGreaterThan(0);
      expect(impact.totalExpectedImprovement).toBeGreaterThan(0);
    });

    it("should generate schema optimization report", () => {
      const recommendations = schemaOptimization.getSchemaOptimizationRecommendations();
      const report = schemaOptimization.generateSchemaOptimizationReport(recommendations);

      expect(report.summary).toBeDefined();
      expect(report.details).toBeDefined();
    });
  });

  describe("Database Performance Monitoring", () => {
    it("should initialize database performance metrics", () => {
      const metrics = performanceMonitoring.initializeDatabasePerformanceMetrics();

      expect(metrics.queryCount).toBe(0);
      expect(metrics.averageQueryTime).toBe(0);
    });

    it("should update database performance metrics", () => {
      let metrics = performanceMonitoring.initializeDatabasePerformanceMetrics();
      metrics = performanceMonitoring.updateDatabasePerformanceMetrics(metrics, 100, 10, 5, 85, 50, 60);

      expect(metrics.queryCount).toBe(1);
      expect(metrics.averageQueryTime).toBe(100);
      expect(metrics.connectionCount).toBe(10);
    });

    it("should create slow query alert", () => {
      const alert = performanceMonitoring.createSlowQueryAlert("SELECT * FROM products", 600, 100);

      expect(alert.severity).toBe("critical");
      expect(alert.recommendations.length).toBeGreaterThan(0);
    });

    it("should create performance alert", () => {
      const alert = performanceMonitoring.createPerformanceAlert("high_cpu", 85, 80);

      expect(alert.type).toBe("high_cpu");
      expect(alert.severity).toBe("warning");
    });

    it("should check performance thresholds", () => {
      let metrics = performanceMonitoring.initializeDatabasePerformanceMetrics();
      metrics = performanceMonitoring.updateDatabasePerformanceMetrics(metrics, 100, 10, 5, 60, 85, 90);

      const alerts = performanceMonitoring.checkPerformanceThresholds(metrics);
      expect(alerts.length).toBeGreaterThan(0);
    });

    it("should generate performance dashboard", () => {
      let metrics = performanceMonitoring.initializeDatabasePerformanceMetrics();
      metrics = performanceMonitoring.updateDatabasePerformanceMetrics(metrics, 100, 10, 5, 85, 50, 60);

      const dashboard = performanceMonitoring.generatePerformanceDashboard(metrics);
      expect(dashboard.metrics).toBeDefined();
      expect(dashboard.trends).toBeDefined();
    });

    it("should generate performance monitoring report", () => {
      let metrics = performanceMonitoring.initializeDatabasePerformanceMetrics();
      metrics = performanceMonitoring.updateDatabasePerformanceMetrics(metrics, 100, 10, 5, 85, 50, 60);

      const dashboard = performanceMonitoring.generatePerformanceDashboard(metrics);
      const report = performanceMonitoring.generatePerformanceMonitoringReport(dashboard);

      expect(report.summary).toBeDefined();
      expect(report.details).toBeDefined();
    });
  });

  describe("Integration Tests", () => {
    it("should perform complete database optimization workflow", () => {
      // 1. Analyze queries
      const metrics = [
        queryAnalysis.initializeQueryPerformanceMetrics("q1", "SELECT * FROM products", 150, 100, 500),
        queryAnalysis.initializeQueryPerformanceMetrics("q2", "SELECT * FROM orders WHERE id IN (SELECT order_id FROM items)", 300, 50, 1000),
      ];

      const report = queryAnalysis.generateQueryPerformanceReport(metrics);
      expect(report.slowQueries.length).toBeGreaterThan(0);

      // 2. Optimize queries
      const optimizations = queryRewriting.generateQueryRewritingReport([
        "SELECT * FROM products",
        "SELECT * FROM orders WHERE id IN (SELECT order_id FROM items)",
      ]);
      expect(optimizations.optimizations.length).toBeGreaterThan(0);

      // 3. Optimize indexes
      const indexes = [
        indexOptimization.initializeDatabaseIndex("idx_products_id", "products", ["id"]),
        indexOptimization.initializeDatabaseIndex("idx_orders_id", "orders", ["id"]),
      ];
      const indexAnalysis = indexOptimization.analyzeIndexes(indexes);
      expect(indexAnalysis.recommendations.length).toBeGreaterThan(0);

      // 4. Monitor performance
      let perfMetrics = performanceMonitoring.initializeDatabasePerformanceMetrics();
      perfMetrics = performanceMonitoring.updateDatabasePerformanceMetrics(perfMetrics, 100, 10, 5, 85, 50, 60);
      const dashboard = performanceMonitoring.generatePerformanceDashboard(perfMetrics);
      expect(dashboard.metrics).toBeDefined();
    });

    it("should calculate total optimization impact", () => {
      const queryOptimizations = queryRewriting.generateQueryRewritingReport(["SELECT * FROM products"]);
      const schemaRecommendations = schemaOptimization.getSchemaOptimizationRecommendations();
      const indexRecommendations = indexOptimization.analyzeIndexes([
        indexOptimization.initializeDatabaseIndex("idx_products_id", "products", ["id"]),
      ]);

      const totalImprovement =
        queryOptimizations.totalExpectedImprovement +
        schemaRecommendations.reduce((sum, r) => sum + r.expectedImprovement, 0) +
        indexRecommendations.recommendations.reduce((sum, r) => sum + r.expectedImprovement, 0);

      expect(totalImprovement).toBeGreaterThan(0);
    });
  });
});

