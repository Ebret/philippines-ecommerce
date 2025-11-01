// API Response Optimization Utilities

export interface ResponseMetrics {
  responseTime: number;
  responseSize: number;
  compressionRatio: number;
  cacheHit: boolean;
  statusCode: number;
}

export interface OptimizedResponse<T> {
  data: T;
  meta: {
    timestamp: number;
    responseTime: number;
    cached: boolean;
  };
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  cursor?: string;
  sort?: string;
  fields?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  meta: {
    timestamp: number;
    responseTime: number;
  };
}

// Response size limits
export const RESPONSE_SIZE_LIMITS = {
  small: 10 * 1024, // 10 KB
  medium: 100 * 1024, // 100 KB
  large: 1024 * 1024, // 1 MB
};

// Default pagination settings
export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 20,
  maxLimit: 100,
};

// Field selection for different endpoints
export const FIELD_SELECTIONS: Record<string, string[]> = {
  products: ["id", "name", "price", "image", "rating", "vendor_id"],
  orders: ["id", "order_number", "total", "status", "created_at"],
  users: ["id", "name", "email", "avatar", "created_at"],
  vendors: ["id", "name", "logo", "rating", "products_count"],
  reviews: ["id", "rating", "comment", "author", "created_at"],
  inventory: ["id", "sku", "quantity", "product_id"],
  categories: ["id", "name", "slug", "image"],
  cart_items: ["id", "product_id", "quantity", "price"],
};

// Optimize response payload
export function optimizeResponsePayload<T>(
  data: T,
  fields?: string[]
): T {
  if (!fields) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => selectFields(item, fields)) as T;
  }

  return selectFields(data, fields) as T;
}

// Select specific fields from object
function selectFields(obj: any, fields: string[]): any {
  if (!obj || typeof obj !== "object") {
    return obj;
  }

  const result: any = {};
  fields.forEach((field) => {
    if (field in obj) {
      result[field] = obj[field];
    }
  });

  return result;
}

// Calculate response size
export function calculateResponseSize(data: any): number {
  const json = JSON.stringify(data);
  return new Blob([json]).size;
}

// Compress response
export function compressResponse(data: any): {
  original: number;
  compressed: number;
  ratio: number;
} {
  const original = calculateResponseSize(data);
  // Simulate compression (actual compression would use gzip)
  const compressed = Math.ceil(original * 0.3); // Assume 70% compression

  return {
    original,
    compressed,
    ratio: (1 - compressed / original) * 100,
  };
}

// Paginate array
export function paginateArray<T>(
  items: T[],
  page: number = 1,
  limit: number = 20
): {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
} {
  const total = items.length;
  const pages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    data: items.slice(start, end),
    pagination: {
      total,
      page,
      limit,
      pages,
      hasNext: page < pages,
      hasPrev: page > 1,
    },
  };
}

// Create optimized response
export function createOptimizedResponse<T>(
  data: T,
  responseTime: number,
  cached: boolean = false
): OptimizedResponse<T> {
  return {
    data,
    meta: {
      timestamp: Date.now(),
      responseTime,
      cached,
    },
  };
}

// Create paginated response
export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
  responseTime: number
): PaginatedResponse<T> {
  const pages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      pages,
      hasNext: page < pages,
      hasPrev: page > 1,
    },
    meta: {
      timestamp: Date.now(),
      responseTime,
    },
  };
}

// Get recommended fields for endpoint
export function getRecommendedFields(endpoint: string): string[] {
  const key = endpoint.split("/").pop()?.replace(/\[.*\]/, "") || "";
  return FIELD_SELECTIONS[key] || [];
}

// Validate pagination parameters
export function validatePaginationParams(
  page?: number,
  limit?: number
): { page: number; limit: number; valid: boolean; errors: string[] } {
  const errors: string[] = [];
  let validPage = page || DEFAULT_PAGINATION.page;
  let validLimit = limit || DEFAULT_PAGINATION.limit;

  if (validPage < 1) {
    errors.push("Page must be greater than 0");
    validPage = 1;
  }

  if (validLimit < 1) {
    errors.push("Limit must be greater than 0");
    validLimit = 1;
  }

  if (validLimit > DEFAULT_PAGINATION.maxLimit) {
    errors.push(`Limit cannot exceed ${DEFAULT_PAGINATION.maxLimit}`);
    validLimit = DEFAULT_PAGINATION.maxLimit;
  }

  return {
    page: validPage,
    limit: validLimit,
    valid: errors.length === 0,
    errors,
  };
}

// Get response caching headers
export function getResponseCachingHeaders(
  cacheType: "public" | "private" | "no-cache" = "public",
  maxAge: number = 3600
): Record<string, string> {
  return {
    "Cache-Control": `${cacheType}, max-age=${maxAge}`,
    "Content-Type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
  };
}

// Get compression headers
export function getCompressionHeaders(): Record<string, string> {
  return {
    "Content-Encoding": "gzip",
    "Vary": "Accept-Encoding",
  };
}

// Estimate response size category
export function estimateResponseSizeCategory(size: number): "small" | "medium" | "large" {
  if (size <= RESPONSE_SIZE_LIMITS.small) return "small";
  if (size <= RESPONSE_SIZE_LIMITS.medium) return "medium";
  return "large";
}

// Get response optimization recommendations
export function getResponseOptimizationRecommendations(
  responseSize: number,
  responseTime: number
): string[] {
  const recommendations: string[] = [];

  if (responseSize > RESPONSE_SIZE_LIMITS.medium) {
    recommendations.push("Response size is large, consider implementing pagination");
    recommendations.push("Use field selection to reduce payload size");
  }

  if (responseTime > 500) {
    recommendations.push("Response time is slow, consider adding caching");
    recommendations.push("Optimize database queries");
  }

  if (responseSize > RESPONSE_SIZE_LIMITS.large) {
    recommendations.push("Implement response compression (gzip)");
  }

  return recommendations;
}

// Calculate response efficiency score
export function calculateResponseEfficiencyScore(
  responseSize: number,
  responseTime: number
): {
  score: number;
  rating: "excellent" | "good" | "fair" | "poor";
  recommendations: string[];
} {
  let score = 100;
  const recommendations: string[] = [];

  // Penalize for large response size
  if (responseSize > RESPONSE_SIZE_LIMITS.large) {
    score -= 30;
    recommendations.push("Reduce response size");
  } else if (responseSize > RESPONSE_SIZE_LIMITS.medium) {
    score -= 15;
    recommendations.push("Consider reducing response size");
  }

  // Penalize for slow response time
  if (responseTime > 1000) {
    score -= 30;
    recommendations.push("Optimize response time");
  } else if (responseTime > 500) {
    score -= 15;
    recommendations.push("Consider optimizing response time");
  }

  let rating: "excellent" | "good" | "fair" | "poor" = "excellent";
  if (score < 50) rating = "poor";
  else if (score < 70) rating = "fair";
  else if (score < 85) rating = "good";

  return {
    score: Math.max(0, score),
    rating,
    recommendations,
  };
}

// Get batch response optimization
export function getBatchResponseOptimization(): {
  strategy: string;
  batchSize: number;
  expectedImprovement: number;
} {
  return {
    strategy: "Combine multiple requests into single batch request",
    batchSize: 50,
    expectedImprovement: 60,
  };
}

// Get response streaming optimization
export function getResponseStreamingOptimization(): {
  strategy: string;
  chunkSize: number;
  expectedImprovement: number;
} {
  return {
    strategy: "Stream large responses in chunks",
    chunkSize: 64 * 1024, // 64 KB chunks
    expectedImprovement: 40,
  };
}

// Format response with metadata
export function formatResponseWithMetadata<T>(
  data: T,
  statusCode: number = 200,
  message: string = "Success"
): {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: number;
} {
  return {
    success: statusCode >= 200 && statusCode < 300,
    statusCode,
    message,
    data,
    timestamp: Date.now(),
  };
}

// Get API response optimization report
export function getAPIResponseOptimizationReport(): {
  recommendations: string[];
  fieldSelections: Record<string, string[]>;
  paginationDefaults: typeof DEFAULT_PAGINATION;
  estimatedImprovement: number;
} {
  return {
    recommendations: [
      "Implement field selection for all endpoints",
      "Use pagination for list endpoints",
      "Enable response compression (gzip)",
      "Add response caching headers",
      "Implement batch request endpoints",
      "Use response streaming for large datasets",
      "Optimize database queries",
      "Add response size monitoring",
    ],
    fieldSelections: FIELD_SELECTIONS,
    paginationDefaults: DEFAULT_PAGINATION,
    estimatedImprovement: 35,
  };
}

