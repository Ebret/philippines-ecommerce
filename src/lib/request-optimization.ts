// Request Processing Optimization Utilities

export interface RequestMetrics {
  processingTime: number;
  payloadSize: number;
  compressionRatio: number;
  middlewareTime: number;
  validationTime: number;
}

export interface MiddlewareConfig {
  name: string;
  enabled: boolean;
  timeout: number;
  priority: number;
}

export interface RequestCompressionConfig {
  enabled: boolean;
  threshold: number; // bytes
  level: number; // 1-9
  types: string[];
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator: (req: any) => string;
}

// Middleware optimization order
export const MIDDLEWARE_ORDER: MiddlewareConfig[] = [
  { name: "cors", enabled: true, timeout: 10, priority: 1 },
  { name: "compression", enabled: true, timeout: 50, priority: 2 },
  { name: "bodyParser", enabled: true, timeout: 100, priority: 3 },
  { name: "authentication", enabled: true, timeout: 200, priority: 4 },
  { name: "authorization", enabled: true, timeout: 150, priority: 5 },
  { name: "validation", enabled: true, timeout: 100, priority: 6 },
  { name: "logging", enabled: true, timeout: 50, priority: 7 },
];

// Default compression configuration
export const DEFAULT_COMPRESSION_CONFIG: RequestCompressionConfig = {
  enabled: true,
  threshold: 1024, // 1 KB
  level: 6, // Default compression level
  types: ["application/json", "text/html", "text/css", "application/javascript"],
};

// Default rate limit configuration
export const DEFAULT_RATE_LIMIT_CONFIG: RateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100,
  keyGenerator: (req: any) => req.ip || "unknown",
};

// Get optimized middleware stack
export function getOptimizedMiddlewareStack(): MiddlewareConfig[] {
  return MIDDLEWARE_ORDER.filter((m) => m.enabled).sort((a, b) => a.priority - b.priority);
}

// Calculate middleware overhead
export function calculateMiddlewareOverhead(
  middlewares: MiddlewareConfig[]
): {
  totalTime: number;
  averageTime: number;
  bottleneck: MiddlewareConfig | null;
} {
  const totalTime = middlewares.reduce((sum, m) => sum + m.timeout, 0);
  const averageTime = totalTime / middlewares.length;
  const bottleneck = middlewares.reduce((max, m) => (m.timeout > max.timeout ? m : max));

  return {
    totalTime,
    averageTime,
    bottleneck,
  };
}

// Get request compression configuration
export function getRequestCompressionConfig(
  environment: "development" | "production" = "production"
): RequestCompressionConfig {
  if (environment === "development") {
    return {
      ...DEFAULT_COMPRESSION_CONFIG,
      level: 1, // Lower compression in development
    };
  }

  return DEFAULT_COMPRESSION_CONFIG;
}

// Estimate compression ratio
export function estimateCompressionRatio(
  originalSize: number,
  contentType: string
): {
  originalSize: number;
  compressedSize: number;
  ratio: number;
  savings: number;
} {
  // Different content types have different compression ratios
  const ratios: Record<string, number> = {
    "application/json": 0.3,
    "text/html": 0.25,
    "text/css": 0.2,
    "application/javascript": 0.35,
    "text/plain": 0.4,
  };

  const ratio = ratios[contentType] || 0.3;
  const compressedSize = Math.ceil(originalSize * ratio);
  const savings = originalSize - compressedSize;

  return {
    originalSize,
    compressedSize,
    ratio: (1 - ratio) * 100,
    savings,
  };
}

// Get rate limiting strategy
export function getRateLimitingStrategy(): {
  strategies: Record<string, RateLimitConfig>;
  recommendations: string[];
} {
  return {
    strategies: {
      public: {
        windowMs: 60 * 1000,
        maxRequests: 100,
        keyGenerator: (req: any) => req.ip || "unknown",
      },
      authenticated: {
        windowMs: 60 * 1000,
        maxRequests: 1000,
        keyGenerator: (req: any) => req.user?.id || req.ip || "unknown",
      },
      admin: {
        windowMs: 60 * 1000,
        maxRequests: 10000,
        keyGenerator: (req: any) => req.user?.id || req.ip || "unknown",
      },
      api: {
        windowMs: 60 * 1000,
        maxRequests: 500,
        keyGenerator: (req: any) => req.headers["x-api-key"] || req.ip || "unknown",
      },
    },
    recommendations: [
      "Implement rate limiting per IP address",
      "Use stricter limits for public endpoints",
      "Implement exponential backoff for retries",
      "Monitor rate limit violations",
      "Use distributed rate limiting for multiple servers",
    ],
  };
}

// Get request validation optimization
export function getRequestValidationOptimization(): {
  strategy: string;
  expectedImprovement: number;
  recommendations: string[];
} {
  return {
    strategy: "Validate requests early in middleware stack",
    expectedImprovement: 20,
    recommendations: [
      "Use schema validation (Zod, Joi)",
      "Validate early in middleware",
      "Cache validation schemas",
      "Use async validation only when necessary",
      "Implement request size limits",
    ],
  };
}

// Get request body parsing optimization
export function getRequestBodyParsingOptimization(): {
  strategy: string;
  maxSize: string;
  expectedImprovement: number;
} {
  return {
    strategy: "Optimize request body parsing",
    maxSize: "10mb",
    expectedImprovement: 15,
  };
}

// Get connection keep-alive optimization
export function getConnectionKeepAliveOptimization(): {
  strategy: string;
  timeout: number;
  expectedImprovement: number;
} {
  return {
    strategy: "Enable HTTP keep-alive for connection reuse",
    timeout: 65000, // milliseconds
    expectedImprovement: 30,
  };
}

// Calculate request processing efficiency
export function calculateRequestProcessingEfficiency(
  processingTime: number,
  payloadSize: number
): {
  efficiency: number;
  rating: "excellent" | "good" | "fair" | "poor";
  recommendations: string[];
} {
  let efficiency = 100;
  const recommendations: string[] = [];

  // Penalize for slow processing
  if (processingTime > 500) {
    efficiency -= 30;
    recommendations.push("Optimize request processing");
  } else if (processingTime > 200) {
    efficiency -= 15;
    recommendations.push("Consider optimizing request processing");
  }

  // Penalize for large payload
  if (payloadSize > 1024 * 1024) {
    efficiency -= 20;
    recommendations.push("Reduce request payload size");
  } else if (payloadSize > 100 * 1024) {
    efficiency -= 10;
    recommendations.push("Consider reducing request payload");
  }

  let rating: "excellent" | "good" | "fair" | "poor" = "excellent";
  if (efficiency < 50) rating = "poor";
  else if (efficiency < 70) rating = "fair";
  else if (efficiency < 85) rating = "good";

  return {
    efficiency: Math.max(0, efficiency),
    rating,
    recommendations,
  };
}

// Get request optimization report
export function getRequestOptimizationReport(): {
  middlewareStack: MiddlewareConfig[];
  compressionConfig: RequestCompressionConfig;
  rateLimitConfig: RateLimitConfig;
  recommendations: string[];
  estimatedImprovement: number;
} {
  return {
    middlewareStack: getOptimizedMiddlewareStack(),
    compressionConfig: DEFAULT_COMPRESSION_CONFIG,
    rateLimitConfig: DEFAULT_RATE_LIMIT_CONFIG,
    recommendations: [
      "Optimize middleware stack order",
      "Enable request compression",
      "Implement rate limiting",
      "Use connection keep-alive",
      "Optimize request body parsing",
      "Implement request caching",
      "Use async middleware where possible",
      "Monitor middleware performance",
    ],
    estimatedImprovement: 25,
  };
}

// Get response header optimization
export function getResponseHeaderOptimization(): {
  headers: Record<string, string>;
  recommendations: string[];
} {
  return {
    headers: {
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
      "Content-Security-Policy": "default-src 'self'",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
    },
    recommendations: [
      "Add security headers",
      "Enable HSTS",
      "Implement CSP",
      "Set proper cache headers",
      "Add CORS headers",
    ],
  };
}

// Get request timeout configuration
export function getRequestTimeoutConfiguration(): {
  defaultTimeout: number;
  maxTimeout: number;
  recommendations: string[];
} {
  return {
    defaultTimeout: 30000, // 30 seconds
    maxTimeout: 60000, // 60 seconds
    recommendations: [
      "Set appropriate request timeouts",
      "Implement timeout handling",
      "Use circuit breakers for external APIs",
      "Monitor timeout occurrences",
    ],
  };
}

// Get request batching optimization
export function getRequestBatchingOptimization(): {
  strategy: string;
  maxBatchSize: number;
  expectedImprovement: number;
} {
  return {
    strategy: "Combine multiple requests into single batch",
    maxBatchSize: 50,
    expectedImprovement: 50,
  };
}

// Get request deduplication optimization
export function getRequestDeduplicationOptimization(): {
  strategy: string;
  cacheTime: number;
  expectedImprovement: number;
} {
  return {
    strategy: "Deduplicate identical concurrent requests",
    cacheTime: 1000, // 1 second
    expectedImprovement: 40,
  };
}

// Calculate total request optimization potential
export function calculateTotalRequestOptimizationPotential(): {
  totalImprovement: number;
  breakdown: Record<string, number>;
} {
  return {
    totalImprovement: 35,
    breakdown: {
      compression: 15,
      rateLimiting: 5,
      validation: 5,
      bodyParsing: 5,
      keepAlive: 5,
    },
  };
}

