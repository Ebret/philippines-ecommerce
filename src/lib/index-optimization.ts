// Index Optimization Utilities

export interface DatabaseIndex {
  id: string;
  name: string;
  table: string;
  columns: string[];
  type: "primary" | "unique" | "composite" | "fulltext";
  size: number;
  usageCount: number;
  lastUsed: number;
  selectivity: number;
  cardinality: number;
  isUsed: boolean;
}

export interface IndexOptimizationRecommendation {
  id: string;
  type: "add" | "remove" | "modify" | "create_composite";
  table: string;
  columns: string[];
  reason: string;
  expectedImprovement: number;
  priority: "high" | "medium" | "low";
  estimatedSize: number;
}

export interface IndexPerformanceMetrics {
  indexName: string;
  table: string;
  usageCount: number;
  lastUsed: number;
  size: number;
  selectivity: number;
  efficiency: number;
  status: "active" | "unused" | "low_usage";
}

export interface IndexAnalysisResult {
  totalIndexes: number;
  usedIndexes: number;
  unusedIndexes: number;
  lowUsageIndexes: number;
  totalIndexSize: number;
  recommendations: IndexOptimizationRecommendation[];
  metrics: IndexPerformanceMetrics[];
}

// Common index recommendations for e-commerce
export const RECOMMENDED_INDEXES = [
  // Products table
  { table: "products", columns: ["category_id"], type: "composite" },
  { table: "products", columns: ["vendor_id"], type: "composite" },
  { table: "products", columns: ["status"], type: "composite" },
  { table: "products", columns: ["created_at"], type: "composite" },
  { table: "products", columns: ["category_id", "status"], type: "composite" },
  { table: "products", columns: ["vendor_id", "status"], type: "composite" },

  // Orders table
  { table: "orders", columns: ["user_id"], type: "composite" },
  { table: "orders", columns: ["status"], type: "composite" },
  { table: "orders", columns: ["created_at"], type: "composite" },
  { table: "orders", columns: ["user_id", "status"], type: "composite" },
  { table: "orders", columns: ["user_id", "created_at"], type: "composite" },

  // Inventory table
  { table: "inventory", columns: ["product_id"], type: "composite" },
  { table: "inventory", columns: ["warehouse_id"], type: "composite" },
  { table: "inventory", columns: ["product_id", "warehouse_id"], type: "composite" },

  // Reviews table
  { table: "reviews", columns: ["product_id"], type: "composite" },
  { table: "reviews", columns: ["user_id"], type: "composite" },
  { table: "reviews", columns: ["rating"], type: "composite" },
  { table: "reviews", columns: ["created_at"], type: "composite" },

  // Users table
  { table: "users", columns: ["email"], type: "unique" },
  { table: "users", columns: ["status"], type: "composite" },
  { table: "users", columns: ["created_at"], type: "composite" },

  // Vendors table
  { table: "vendors", columns: ["status"], type: "composite" },
  { table: "vendors", columns: ["created_at"], type: "composite" },

  // Cart table
  { table: "cart", columns: ["user_id"], type: "composite" },
  { table: "cart", columns: ["product_id"], type: "composite" },
  { table: "cart", columns: ["user_id", "product_id"], type: "composite" },
];

// Initialize database index
export function initializeDatabaseIndex(
  name: string,
  table: string,
  columns: string[],
  type: "primary" | "unique" | "composite" | "fulltext" = "composite",
  size: number = 0,
  selectivity: number = 0.8
): DatabaseIndex {
  return {
    id: `idx:${table}:${columns.join("_")}`,
    name,
    table,
    columns,
    type,
    size,
    usageCount: 0,
    lastUsed: 0,
    selectivity,
    cardinality: 0,
    isUsed: false,
  };
}

// Update index usage
export function updateIndexUsage(index: DatabaseIndex, used: boolean = true): DatabaseIndex {
  const updated = { ...index };
  if (used) {
    updated.usageCount++;
    updated.lastUsed = Date.now();
    updated.isUsed = true;
  }
  return updated;
}

// Calculate index efficiency
export function calculateIndexEfficiency(index: DatabaseIndex): number {
  if (index.usageCount === 0) {
    return 0;
  }

  // Efficiency = (usage count * selectivity) / (size in MB)
  const sizeInMB = index.size / (1024 * 1024);
  const efficiency = (index.usageCount * index.selectivity) / (sizeInMB || 1);

  return Math.min(100, efficiency);
}

// Get index status
export function getIndexStatus(index: DatabaseIndex, daysSinceLastUse: number = 30): "active" | "unused" | "low_usage" {
  if (index.usageCount === 0 || daysSinceLastUse > 30) {
    return "unused";
  } else if (index.usageCount < 10) {
    return "low_usage";
  }
  return "active";
}

// Analyze indexes
export function analyzeIndexes(indexes: DatabaseIndex[]): IndexAnalysisResult {
  const usedIndexes = indexes.filter((i) => i.isUsed).length;
  const unusedIndexes = indexes.filter((i) => !i.isUsed).length;
  const lowUsageIndexes = indexes.filter((i) => i.usageCount > 0 && i.usageCount < 10).length;
  const totalIndexSize = indexes.reduce((sum, i) => sum + i.size, 0);

  const recommendations: IndexOptimizationRecommendation[] = [];

  // Recommend removing unused indexes
  for (const index of indexes) {
    if (!index.isUsed) {
      recommendations.push({
        id: `rec:remove:${index.id}`,
        type: "remove",
        table: index.table,
        columns: index.columns,
        reason: "Index is not being used",
        expectedImprovement: 0,
        priority: "medium",
        estimatedSize: index.size,
      });
    }
  }

  // Recommend adding missing indexes
  for (const rec of RECOMMENDED_INDEXES) {
    const exists = indexes.some((i) => i.table === rec.table && JSON.stringify(i.columns) === JSON.stringify(rec.columns));
    if (!exists) {
      recommendations.push({
        id: `rec:add:${rec.table}:${rec.columns.join("_")}`,
        type: "add",
        table: rec.table,
        columns: rec.columns,
        reason: "Recommended index for common queries",
        expectedImprovement: 50,
        priority: "high",
        estimatedSize: 1024 * 1024, // 1MB estimate
      });
    }
  }

  const metrics: IndexPerformanceMetrics[] = indexes.map((index) => ({
    indexName: index.name,
    table: index.table,
    usageCount: index.usageCount,
    lastUsed: index.lastUsed,
    size: index.size,
    selectivity: index.selectivity,
    efficiency: calculateIndexEfficiency(index),
    status: getIndexStatus(index),
  }));

  return {
    totalIndexes: indexes.length,
    usedIndexes,
    unusedIndexes,
    lowUsageIndexes,
    totalIndexSize,
    recommendations,
    metrics,
  };
}

// Get index creation SQL
export function getIndexCreationSQL(table: string, columns: string[], indexName?: string): string {
  const name = indexName || `idx_${table}_${columns.join("_")}`;
  return `CREATE INDEX ${name} ON ${table} (${columns.join(", ")});`;
}

// Get index removal SQL
export function getIndexRemovalSQL(indexName: string): string {
  return `DROP INDEX ${indexName};`;
}

// Get composite index recommendations
export function getCompositeIndexRecommendations(queries: string[]): {
  columns: string[];
  frequency: number;
  expectedImprovement: number;
}[] {
  const columnCombinations = new Map<string, number>();

  for (const query of queries) {
    // Extract column names from WHERE and JOIN clauses
    const whereMatch = query.match(/WHERE\s+(.+?)(?:GROUP|ORDER|LIMIT|$)/i);
    const joinMatch = query.match(/ON\s+(.+?)(?:WHERE|GROUP|ORDER|LIMIT|$)/i);

    const conditions = [whereMatch?.[1], joinMatch?.[1]].filter(Boolean).join(" AND ");

    if (conditions) {
      const columnPattern = /(\w+)\s*[=<>]/g;
      let match;
      const columns: string[] = [];

      while ((match = columnPattern.exec(conditions)) !== null) {
        columns.push(match[1]);
      }

      if (columns.length > 1) {
        const key = columns.sort().join(",");
        columnCombinations.set(key, (columnCombinations.get(key) || 0) + 1);
      }
    }
  }

  return Array.from(columnCombinations.entries())
    .map(([columns, frequency]) => ({
      columns: columns.split(","),
      frequency,
      expectedImprovement: Math.min(80, frequency * 5),
    }))
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 10);
}

// Get index maintenance recommendations
export function getIndexMaintenanceRecommendations(): {
  task: string;
  frequency: string;
  priority: "high" | "medium" | "low";
}[] {
  return [
    { task: "Rebuild fragmented indexes", frequency: "Weekly", priority: "high" },
    { task: "Update index statistics", frequency: "Daily", priority: "high" },
    { task: "Remove unused indexes", frequency: "Monthly", priority: "medium" },
    { task: "Analyze index usage", frequency: "Weekly", priority: "medium" },
    { task: "Monitor index size", frequency: "Daily", priority: "medium" },
    { task: "Defragment indexes", frequency: "Monthly", priority: "low" },
  ];
}

// Get index best practices
export function getIndexBestPractices(): {
  practice: string;
  description: string;
  expectedImprovement: number;
}[] {
  return [
    {
      practice: "Index columns in WHERE clauses",
      description: "Add indexes to columns frequently used in WHERE conditions",
      expectedImprovement: 70,
    },
    {
      practice: "Use composite indexes",
      description: "Create indexes on multiple columns for complex queries",
      expectedImprovement: 60,
    },
    {
      practice: "Index JOIN columns",
      description: "Add indexes to columns used in JOIN conditions",
      expectedImprovement: 50,
    },
    {
      practice: "Index ORDER BY columns",
      description: "Add indexes to columns used in ORDER BY clauses",
      expectedImprovement: 40,
    },
    {
      practice: "Remove unused indexes",
      description: "Delete indexes that are not being used",
      expectedImprovement: 20,
    },
    {
      practice: "Monitor index fragmentation",
      description: "Rebuild indexes when fragmentation exceeds 30%",
      expectedImprovement: 30,
    },
    {
      practice: "Use covering indexes",
      description: "Create indexes that include all columns needed by a query",
      expectedImprovement: 80,
    },
    {
      practice: "Avoid over-indexing",
      description: "Balance query performance with write performance",
      expectedImprovement: 10,
    },
  ];
}

// Generate index optimization report
export function generateIndexOptimizationReport(analysis: IndexAnalysisResult): {
  summary: string;
  details: Record<string, any>;
  recommendations: string[];
} {
  return {
    summary: `Total indexes: ${analysis.totalIndexes}, Used: ${analysis.usedIndexes}, Unused: ${analysis.unusedIndexes}, Total size: ${(analysis.totalIndexSize / (1024 * 1024)).toFixed(2)} MB`,
    details: {
      totalIndexes: analysis.totalIndexes,
      usedIndexes: analysis.usedIndexes,
      unusedIndexes: analysis.unusedIndexes,
      lowUsageIndexes: analysis.lowUsageIndexes,
      totalIndexSize: `${(analysis.totalIndexSize / (1024 * 1024)).toFixed(2)} MB`,
      recommendations: analysis.recommendations.length,
    },
    recommendations: [
      analysis.unusedIndexes > 0 ? `Remove ${analysis.unusedIndexes} unused indexes` : "No unused indexes",
      analysis.recommendations.filter((r) => r.type === "add").length > 0
        ? `Add ${analysis.recommendations.filter((r) => r.type === "add").length} recommended indexes`
        : "All recommended indexes exist",
    ],
  };
}

// Get index creation priority
export function getIndexCreationPriority(recommendations: IndexOptimizationRecommendation[]): IndexOptimizationRecommendation[] {
  return recommendations
    .filter((r) => r.type === "add")
    .sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority === "high" ? -1 : b.priority === "high" ? 1 : 0;
      }
      return b.expectedImprovement - a.expectedImprovement;
    });
}

