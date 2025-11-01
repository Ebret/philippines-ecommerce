// Query Rewriting and Optimization Utilities

export interface QueryOptimizationRule {
  id: string;
  name: string;
  pattern: string;
  replacement: string;
  expectedImprovement: number;
  priority: "high" | "medium" | "low";
  description: string;
}

export interface OptimizedQuery {
  id: string;
  originalQuery: string;
  optimizedQuery: string;
  optimizationType: string;
  expectedImprovement: number;
  explanation: string;
}

export interface JoinOptimization {
  id: string;
  originalJoin: string;
  optimizedJoin: string;
  joinType: "inner" | "left" | "right" | "full";
  expectedImprovement: number;
  recommendations: string[];
}

export interface SubqueryOptimization {
  id: string;
  originalQuery: string;
  optimizedQuery: string;
  optimizationType: "join_replacement" | "cte" | "window_function";
  expectedImprovement: number;
  explanation: string;
}

// Query optimization rules
export const QUERY_OPTIMIZATION_RULES: QueryOptimizationRule[] = [
  {
    id: "rule:select_star",
    name: "Avoid SELECT *",
    pattern: "SELECT \\*",
    replacement: "SELECT specific_columns",
    expectedImprovement: 30,
    priority: "high",
    description: "Select only needed columns instead of all columns",
  },
  {
    id: "rule:distinct",
    name: "Avoid DISTINCT",
    pattern: "SELECT DISTINCT",
    replacement: "Use GROUP BY or JOIN optimization",
    expectedImprovement: 40,
    priority: "high",
    description: "Use GROUP BY or optimize JOIN instead of DISTINCT",
  },
  {
    id: "rule:subquery",
    name: "Replace subqueries with JOINs",
    pattern: "WHERE .* IN \\(SELECT",
    replacement: "Use INNER JOIN",
    expectedImprovement: 60,
    priority: "high",
    description: "Replace IN subqueries with JOINs for better performance",
  },
  {
    id: "rule:or_condition",
    name: "Optimize OR conditions",
    pattern: "WHERE .* OR .*",
    replacement: "Use UNION or IN clause",
    expectedImprovement: 35,
    priority: "medium",
    description: "Replace OR conditions with UNION or IN for better optimization",
  },
  {
    id: "rule:like_pattern",
    name: "Optimize LIKE patterns",
    pattern: "LIKE '%.*%'",
    replacement: "Use LIKE 'prefix%' or full-text search",
    expectedImprovement: 50,
    priority: "high",
    description: "Avoid leading wildcards in LIKE patterns",
  },
  {
    id: "rule:function_in_where",
    name: "Avoid functions in WHERE",
    pattern: "WHERE FUNCTION\\(.*\\)",
    replacement: "Move function to SELECT or use indexed column",
    expectedImprovement: 45,
    priority: "high",
    description: "Avoid using functions on columns in WHERE clause",
  },
  {
    id: "rule:join_order",
    name: "Optimize JOIN order",
    pattern: "JOIN.*JOIN",
    replacement: "Order JOINs by selectivity",
    expectedImprovement: 30,
    priority: "medium",
    description: "Order JOINs to filter data early",
  },
  {
    id: "rule:limit_offset",
    name: "Optimize LIMIT OFFSET",
    pattern: "LIMIT .* OFFSET .*",
    replacement: "Use keyset pagination",
    expectedImprovement: 70,
    priority: "high",
    description: "Use keyset pagination instead of OFFSET for large datasets",
  },
];

// Optimize SELECT * queries
export function optimizeSelectStar(query: string, availableColumns: string[]): OptimizedQuery {
  const optimizedQuery = query.replace(/SELECT \*/i, `SELECT ${availableColumns.join(", ")}`);

  return {
    id: `opt:select_star:${Date.now()}`,
    originalQuery: query,
    optimizedQuery,
    optimizationType: "Column Selection",
    expectedImprovement: 30,
    explanation: "Selecting only needed columns reduces data transfer and improves cache efficiency",
  };
}

// Replace subqueries with JOINs
export function replaceSubqueryWithJoin(query: string): OptimizedQuery {
  // Simple pattern matching for IN subqueries
  const inSubqueryPattern = /WHERE\s+(\w+)\s+IN\s*\(\s*SELECT\s+(\w+)\s+FROM\s+(\w+)\s+WHERE\s+(.+?)\)/i;
  const match = query.match(inSubqueryPattern);

  let optimizedQuery = query;
  if (match) {
    const [, column, selectColumn, table, condition] = match;
    optimizedQuery = query.replace(
      inSubqueryPattern,
      `INNER JOIN ${table} ON ${column} = ${table}.${selectColumn} WHERE ${condition}`
    );
  }

  return {
    id: `opt:subquery_join:${Date.now()}`,
    originalQuery: query,
    optimizedQuery,
    optimizationType: "Subquery Replacement",
    expectedImprovement: 60,
    explanation: "JOINs are typically more efficient than subqueries for filtering data",
  };
}

// Optimize LIKE patterns
export function optimizeLikePattern(query: string): OptimizedQuery {
  const likePattern = /LIKE\s+'%(.+?)%'/i;
  const match = query.match(likePattern);

  let optimizedQuery = query;
  let explanation = "Use prefix matching instead of wildcard matching";

  if (match) {
    const pattern = match[1];
    optimizedQuery = query.replace(likePattern, `LIKE '${pattern}%'`);
  }

  return {
    id: `opt:like_pattern:${Date.now()}`,
    originalQuery: query,
    optimizedQuery,
    optimizationType: "LIKE Pattern Optimization",
    expectedImprovement: 50,
    explanation,
  };
}

// Optimize JOIN operations
export function optimizeJoinOperations(query: string): JoinOptimization {
  const joinPattern = /JOIN\s+(\w+)\s+ON\s+(.+?)(?=JOIN|WHERE|GROUP|ORDER|LIMIT|$)/gi;
  const joins: string[] = [];
  let match;

  while ((match = joinPattern.exec(query)) !== null) {
    joins.push(match[0]);
  }

  // Recommend ordering JOINs by selectivity
  const recommendations: string[] = [];
  if (joins.length > 1) {
    recommendations.push("Order JOINs by selectivity (most selective first)");
    recommendations.push("Ensure JOIN columns are indexed");
    recommendations.push("Consider using INNER JOIN instead of LEFT JOIN when possible");
  }

  return {
    id: `opt:join:${Date.now()}`,
    originalJoin: joins.join(" "),
    optimizedJoin: joins.join(" "), // Simplified for demo
    joinType: "inner",
    expectedImprovement: 30,
    recommendations,
  };
}

// Replace DISTINCT with GROUP BY
export function replaceDistinctWithGroupBy(query: string): OptimizedQuery {
  const distinctPattern = /SELECT\s+DISTINCT\s+(.+?)\s+FROM/i;
  const match = query.match(distinctPattern);

  let optimizedQuery = query;
  if (match) {
    const columns = match[1];
    optimizedQuery = query.replace(distinctPattern, `SELECT ${columns} FROM`);
    optimizedQuery += ` GROUP BY ${columns}`;
  }

  return {
    id: `opt:distinct_groupby:${Date.now()}`,
    originalQuery: query,
    optimizedQuery,
    optimizationType: "DISTINCT to GROUP BY",
    expectedImprovement: 40,
    explanation: "GROUP BY is often more efficient than DISTINCT for aggregation",
  };
}

// Optimize pagination
export function optimizePagination(query: string, pageSize: number = 20): OptimizedQuery {
  const offsetPattern = /LIMIT\s+\d+\s+OFFSET\s+(\d+)/i;
  const match = query.match(offsetPattern);

  let optimizedQuery = query;
  let explanation = "Use keyset pagination for better performance with large offsets";

  if (match) {
    const offset = parseInt(match[1]);
    if (offset > 1000) {
      explanation = "For large offsets, use keyset pagination with the last row's ID";
      optimizedQuery = query.replace(offsetPattern, `LIMIT ${pageSize}`);
    }
  }

  return {
    id: `opt:pagination:${Date.now()}`,
    originalQuery: query,
    optimizedQuery,
    optimizationType: "Pagination Optimization",
    expectedImprovement: 70,
    explanation,
  };
}

// Remove functions from WHERE clause
export function removeFunctionsFromWhere(query: string): OptimizedQuery {
  const functionPattern = /WHERE\s+(\w+)\((.+?)\)\s*=/i;
  const match = query.match(functionPattern);

  let optimizedQuery = query;
  let explanation = "Avoid functions on columns in WHERE clause to allow index usage";

  if (match) {
    explanation = "Move function to SELECT clause or use indexed column directly";
  }

  return {
    id: `opt:function_where:${Date.now()}`,
    originalQuery: query,
    optimizedQuery,
    optimizationType: "Function Removal",
    expectedImprovement: 45,
    explanation,
  };
}

// Get query optimization suggestions
export function getQueryOptimizationSuggestions(query: string): OptimizedQuery[] {
  const suggestions: OptimizedQuery[] = [];

  // Check for SELECT *
  if (/SELECT\s+\*/i.test(query)) {
    suggestions.push(optimizeSelectStar(query, ["id", "name", "status"]));
  }

  // Check for subqueries
  if (/IN\s*\(\s*SELECT/i.test(query)) {
    suggestions.push(replaceSubqueryWithJoin(query));
  }

  // Check for LIKE patterns
  if (/LIKE\s+'%.*%'/i.test(query)) {
    suggestions.push(optimizeLikePattern(query));
  }

  // Check for DISTINCT
  if (/SELECT\s+DISTINCT/i.test(query)) {
    suggestions.push(replaceDistinctWithGroupBy(query));
  }

  // Check for pagination
  if (/LIMIT\s+\d+\s+OFFSET/i.test(query)) {
    suggestions.push(optimizePagination(query));
  }

  return suggestions;
}

// Generate query rewriting report
export function generateQueryRewritingReport(queries: string[]): {
  summary: string;
  optimizations: OptimizedQuery[];
  totalExpectedImprovement: number;
  recommendations: string[];
} {
  const optimizations: OptimizedQuery[] = [];
  let totalExpectedImprovement = 0;

  for (const query of queries) {
    const suggestions = getQueryOptimizationSuggestions(query);
    optimizations.push(...suggestions);
    totalExpectedImprovement += suggestions.reduce((sum, s) => sum + s.expectedImprovement, 0);
  }

  const recommendations: string[] = [];
  if (optimizations.length > 0) {
    recommendations.push(`Apply ${optimizations.length} query optimizations`);
    recommendations.push("Review and test optimized queries");
    recommendations.push("Monitor performance improvements");
  }

  return {
    summary: `Found ${optimizations.length} optimization opportunities with ${totalExpectedImprovement.toFixed(0)}% total improvement potential`,
    optimizations,
    totalExpectedImprovement,
    recommendations,
  };
}

// Get query rewriting best practices
export function getQueryRewritingBestPractices(): {
  practice: string;
  description: string;
  expectedImprovement: number;
}[] {
  return [
    {
      practice: "Select specific columns",
      description: "Avoid SELECT *, specify only needed columns",
      expectedImprovement: 30,
    },
    {
      practice: "Use JOINs instead of subqueries",
      description: "Replace IN subqueries with INNER JOINs",
      expectedImprovement: 60,
    },
    {
      practice: "Optimize LIKE patterns",
      description: "Use prefix matching instead of wildcard matching",
      expectedImprovement: 50,
    },
    {
      practice: "Use GROUP BY instead of DISTINCT",
      description: "GROUP BY is often more efficient than DISTINCT",
      expectedImprovement: 40,
    },
    {
      practice: "Avoid functions in WHERE",
      description: "Move functions to SELECT or use indexed columns",
      expectedImprovement: 45,
    },
    {
      practice: "Use keyset pagination",
      description: "Use keyset pagination for large datasets",
      expectedImprovement: 70,
    },
    {
      practice: "Optimize JOIN order",
      description: "Order JOINs by selectivity",
      expectedImprovement: 30,
    },
    {
      practice: "Use UNION instead of OR",
      description: "UNION can be more efficient than OR conditions",
      expectedImprovement: 35,
    },
  ];
}

