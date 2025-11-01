// Database Query Optimization Utilities

export interface QueryMetrics {
  queryTime: number;
  rowsAffected: number;
  indexUsed: boolean;
  cacheHit: boolean;
  executionPlan: string;
}

export interface DatabaseOptimization {
  query: string;
  optimization: string;
  expectedImprovement: number; // percentage
  priority: "high" | "medium" | "low";
}

export interface ConnectionPoolConfig {
  min: number;
  max: number;
  idleTimeout: number;
  acquireTimeout: number;
  reapInterval: number;
}

export interface QueryAnalysis {
  totalQueries: number;
  slowQueries: number;
  n1Queries: number;
  missingIndexes: string[];
  averageQueryTime: number;
  recommendations: string[];
}

// Default connection pool configuration
export const defaultConnectionPoolConfig: ConnectionPoolConfig = {
  min: 5,
  max: 20,
  idleTimeout: 30000, // 30 seconds
  acquireTimeout: 10000, // 10 seconds
  reapInterval: 5000, // 5 seconds
};

// Common database optimizations
const commonOptimizations: DatabaseOptimization[] = [
  {
    query: "SELECT * FROM products",
    optimization: "SELECT id, name, price, image FROM products",
    expectedImprovement: 40,
    priority: "high",
  },
  {
    query: "SELECT * FROM orders WHERE user_id = ?",
    optimization: "SELECT id, order_number, total, status FROM orders WHERE user_id = ? LIMIT 50",
    expectedImprovement: 35,
    priority: "high",
  },
  {
    query: "SELECT * FROM products p JOIN categories c ON p.category_id = c.id",
    optimization:
      "SELECT p.id, p.name, p.price, c.name as category FROM products p JOIN categories c ON p.category_id = c.id",
    expectedImprovement: 45,
    priority: "high",
  },
  {
    query: "SELECT * FROM inventory WHERE product_id IN (SELECT id FROM products)",
    optimization:
      "SELECT i.id, i.quantity, i.sku FROM inventory i WHERE i.product_id IN (...) LIMIT 100",
    expectedImprovement: 50,
    priority: "high",
  },
  {
    query: "SELECT COUNT(*) FROM orders",
    optimization: "SELECT COUNT(*) FROM orders WHERE created_at > DATE_SUB(NOW(), INTERVAL 30 DAY)",
    expectedImprovement: 60,
    priority: "medium",
  },
];

// Missing indexes that should be added
const missingIndexes = [
  "CREATE INDEX idx_products_category_id ON products(category_id)",
  "CREATE INDEX idx_orders_user_id ON orders(user_id)",
  "CREATE INDEX idx_orders_status ON orders(status)",
  "CREATE INDEX idx_inventory_product_id ON inventory(product_id)",
  "CREATE INDEX idx_inventory_sku ON inventory(sku)",
  "CREATE INDEX idx_reviews_product_id ON reviews(product_id)",
  "CREATE INDEX idx_reviews_vendor_id ON reviews(vendor_id)",
  "CREATE INDEX idx_cart_items_user_id ON cart_items(user_id)",
  "CREATE INDEX idx_shipments_order_id ON shipments(order_id)",
  "CREATE INDEX idx_payments_order_id ON payments(order_id)",
];

// Analyze query performance
export function analyzeQueryPerformance(
  queryTime: number,
  rowsAffected: number
): { status: "fast" | "slow" | "critical"; recommendation: string } {
  if (queryTime < 100) {
    return { status: "fast", recommendation: "Query is performing well" };
  } else if (queryTime < 500) {
    return { status: "slow", recommendation: "Consider adding indexes or optimizing the query" };
  } else {
    return { status: "critical", recommendation: "Query needs immediate optimization" };
  }
}

// Get query optimization suggestions
export function getQueryOptimizations(): DatabaseOptimization[] {
  return commonOptimizations;
}

// Get missing indexes
export function getMissingIndexes(): string[] {
  return missingIndexes;
}

// Calculate query improvement potential
export function calculateOptimizationPotential(
  currentQueryTime: number,
  optimizations: DatabaseOptimization[]
): {
  currentTime: number;
  potentialTime: number;
  improvement: number;
  improvementPercentage: number;
} {
  const totalImprovement = optimizations.reduce((sum, opt) => sum + opt.expectedImprovement, 0);
  const averageImprovement = totalImprovement / optimizations.length;
  const potentialTime = currentQueryTime * (1 - averageImprovement / 100);

  return {
    currentTime: currentQueryTime,
    potentialTime,
    improvement: currentQueryTime - potentialTime,
    improvementPercentage: averageImprovement,
  };
}

// Detect N+1 query problems
export function detectN1Queries(queries: string[]): {
  n1Queries: string[];
  count: number;
  recommendation: string;
} {
  const n1Queries: string[] = [];

  // Simple pattern matching for N+1 queries
  for (let i = 0; i < queries.length - 1; i++) {
    const current = queries[i].toLowerCase();
    const next = queries[i + 1].toLowerCase();

    // Check for repeated similar queries
    if (
      current.includes("select") &&
      next.includes("select") &&
      current.split("where")[0] === next.split("where")[0]
    ) {
      n1Queries.push(current);
    }
  }

  return {
    n1Queries,
    count: n1Queries.length,
    recommendation:
      n1Queries.length > 0
        ? "Use JOIN or batch queries to reduce N+1 problems"
        : "No N+1 query patterns detected",
  };
}

// Generate database optimization report
export function generateDatabaseOptimizationReport(): {
  optimizations: DatabaseOptimization[];
  missingIndexes: string[];
  recommendations: string[];
  estimatedImprovement: number;
} {
  const optimizations = getQueryOptimizations();
  const indexes = getMissingIndexes();

  const recommendations = [
    "Add missing indexes to improve query performance",
    "Use field selection instead of SELECT *",
    "Implement query pagination for large result sets",
    "Use connection pooling to reduce connection overhead",
    "Add query caching for frequently accessed data",
    "Optimize JOIN operations with proper indexes",
    "Use EXPLAIN to analyze query execution plans",
    "Implement database query monitoring",
  ];

  const estimatedImprovement =
    optimizations.reduce((sum, opt) => sum + opt.expectedImprovement, 0) / optimizations.length;

  return {
    optimizations,
    missingIndexes: indexes,
    recommendations,
    estimatedImprovement,
  };
}

// Get connection pool configuration
export function getConnectionPoolConfig(
  environment: "development" | "production" = "production"
): ConnectionPoolConfig {
  if (environment === "development") {
    return {
      min: 2,
      max: 5,
      idleTimeout: 60000,
      acquireTimeout: 10000,
      reapInterval: 10000,
    };
  }

  return defaultConnectionPoolConfig;
}

// Estimate query execution time
export function estimateQueryExecutionTime(
  rowsAffected: number,
  complexity: "simple" | "moderate" | "complex"
): number {
  const baseTime = 10; // 10ms base time
  const complexityMultiplier = {
    simple: 1,
    moderate: 2,
    complex: 4,
  };

  const rowMultiplier = Math.log(rowsAffected + 1) * 0.5;
  return baseTime * complexityMultiplier[complexity] * (1 + rowMultiplier);
}

// Get slow query threshold
export function getSlowQueryThreshold(
  environment: "development" | "production" = "production"
): number {
  return environment === "production" ? 500 : 1000; // milliseconds
}

// Analyze database schema for optimization
export function analyzeDatabaseSchema(): {
  tables: string[];
  recommendations: string[];
  optimizationScore: number;
} {
  const tables = [
    "users",
    "products",
    "categories",
    "orders",
    "inventory",
    "reviews",
    "vendors",
    "cart_items",
    "shipments",
    "payments",
  ];

  const recommendations = [
    "Add composite indexes for frequently filtered columns",
    "Partition large tables by date or category",
    "Archive old orders and transactions",
    "Optimize data types (use INT instead of VARCHAR for IDs)",
    "Add CHECK constraints for data validation",
    "Use ENUM for status fields instead of VARCHAR",
    "Implement table partitioning for large datasets",
    "Add foreign key constraints for referential integrity",
  ];

  // Score based on recommendations (0-100)
  const optimizationScore = Math.max(0, 100 - recommendations.length * 10);

  return {
    tables,
    recommendations,
    optimizationScore,
  };
}

// Get query caching strategy
export function getQueryCachingStrategy(): {
  cacheable: string[];
  ttl: Record<string, number>;
  invalidationRules: Record<string, string[]>;
} {
  return {
    cacheable: [
      "GET /api/products",
      "GET /api/categories",
      "GET /api/localization/currencies",
      "GET /api/localization/holidays",
      "GET /api/vendors/[id]",
      "GET /api/reviews/[id]",
    ],
    ttl: {
      products: 3600, // 1 hour
      categories: 86400, // 24 hours
      localization: 604800, // 7 days
      vendors: 3600, // 1 hour
      reviews: 1800, // 30 minutes
    },
    invalidationRules: {
      products: ["POST /api/products", "PATCH /api/products/[id]", "DELETE /api/products/[id]"],
      categories: ["POST /api/categories", "PATCH /api/categories/[id]"],
      vendors: ["PATCH /api/vendors/[id]"],
      reviews: ["POST /api/reviews", "PATCH /api/reviews/[id]"],
    },
  };
}

// Calculate database optimization metrics
export function calculateDatabaseMetrics(
  totalQueries: number,
  slowQueries: number,
  averageQueryTime: number
): {
  slowQueryPercentage: number;
  performanceScore: number;
  status: "excellent" | "good" | "fair" | "poor";
} {
  const slowQueryPercentage = (slowQueries / totalQueries) * 100;
  const performanceScore = Math.max(0, 100 - slowQueryPercentage - averageQueryTime / 10);

  let status: "excellent" | "good" | "fair" | "poor" = "excellent";
  if (performanceScore < 50) status = "poor";
  else if (performanceScore < 70) status = "fair";
  else if (performanceScore < 85) status = "good";

  return {
    slowQueryPercentage,
    performanceScore,
    status,
  };
}

// Get batch query optimization
export function getBatchQueryOptimization(): {
  strategy: string;
  batchSize: number;
  expectedImprovement: number;
} {
  return {
    strategy: "Use batch queries to reduce round trips to database",
    batchSize: 100,
    expectedImprovement: 40,
  };
}

// Get pagination optimization
export function getPaginationOptimization(): {
  defaultPageSize: number;
  maxPageSize: number;
  cursorBased: boolean;
  recommendations: string[];
} {
  return {
    defaultPageSize: 20,
    maxPageSize: 100,
    cursorBased: true,
    recommendations: [
      "Use cursor-based pagination for large datasets",
      "Implement offset-based pagination with limits",
      "Cache pagination results",
      "Use keyset pagination for better performance",
    ],
  };
}

