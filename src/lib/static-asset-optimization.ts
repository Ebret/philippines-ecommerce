// Static Asset Optimization Utilities

export interface StaticAsset {
  path: string;
  type: "image" | "css" | "javascript" | "font" | "video" | "document";
  size: number;
  compressedSize: number;
  mimeType: string;
  cacheable: boolean;
  ttl: number;
  compressionRatio: number;
  lastModified: number;
}

export interface AssetCacheHeaders {
  cacheControl: string;
  expires: string;
  eTag: string;
  lastModified: string;
  contentEncoding: string;
  contentType: string;
  vary: string;
}

export interface AssetCompressionConfig {
  enabled: boolean;
  algorithm: "gzip" | "brotli" | "deflate";
  level: number;
  minSize: number;
  excludeTypes: string[];
}

export interface AssetOptimizationMetrics {
  totalAssets: number;
  totalSize: number;
  totalCompressedSize: number;
  compressionRatio: number;
  averageCompressionTime: number;
  cacheHitRate: number;
  bandwidthSaved: number;
}

// Asset type configurations
export const ASSET_TYPE_CONFIG: Record<string, any> = {
  image: {
    mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif", "image/svg+xml"],
    cacheable: true,
    ttl: 31536000, // 1 year
    compression: false,
    optimization: true,
  },
  css: {
    mimeTypes: ["text/css"],
    cacheable: true,
    ttl: 31536000, // 1 year
    compression: true,
    optimization: true,
  },
  javascript: {
    mimeTypes: ["application/javascript", "text/javascript"],
    cacheable: true,
    ttl: 31536000, // 1 year
    compression: true,
    optimization: true,
  },
  font: {
    mimeTypes: ["font/woff", "font/woff2", "font/ttf", "font/otf"],
    cacheable: true,
    ttl: 31536000, // 1 year
    compression: false,
    optimization: false,
  },
  video: {
    mimeTypes: ["video/mp4", "video/webm", "video/ogg"],
    cacheable: true,
    ttl: 2592000, // 30 days
    compression: false,
    optimization: true,
  },
  document: {
    mimeTypes: ["text/html", "application/pdf"],
    cacheable: true,
    ttl: 3600, // 1 hour
    compression: true,
    optimization: false,
  },
};

// Default compression configuration
export const DEFAULT_COMPRESSION_CONFIG: AssetCompressionConfig = {
  enabled: true,
  algorithm: "brotli",
  level: 11,
  minSize: 1024, // 1KB
  excludeTypes: ["image/jpeg", "image/png", "image/webp", "video/mp4"],
};

// Get asset cache headers
export function getAssetCacheHeaders(assetType: string, ttl: number = 31536000): AssetCacheHeaders {
  const expiresDate = new Date(Date.now() + ttl * 1000).toUTCString();

  return {
    cacheControl: `public, max-age=${ttl}, immutable`,
    expires: expiresDate,
    eTag: `"${Date.now()}"`,
    lastModified: new Date().toUTCString(),
    contentEncoding: "gzip, br",
    contentType: ASSET_TYPE_CONFIG[assetType]?.mimeTypes[0] || "application/octet-stream",
    vary: "Accept-Encoding",
  };
}

// Get asset optimization configuration
export function getAssetOptimizationConfig(assetType: string): {
  cacheable: boolean;
  ttl: number;
  compression: boolean;
  optimization: boolean;
  mimeTypes: string[];
} {
  const config = ASSET_TYPE_CONFIG[assetType];
  return {
    cacheable: config?.cacheable || false,
    ttl: config?.ttl || 3600,
    compression: config?.compression || false,
    optimization: config?.optimization || false,
    mimeTypes: config?.mimeTypes || [],
  };
}

// Calculate compression ratio
export function calculateCompressionRatio(originalSize: number, compressedSize: number): number {
  if (originalSize === 0) return 0;
  return ((originalSize - compressedSize) / originalSize) * 100;
}

// Get compression algorithm recommendation
export function getCompressionAlgorithmRecommendation(assetType: string): {
  recommended: string;
  alternatives: string[];
  compressionRatio: number;
  speed: number;
} {
  const recommendations: Record<string, any> = {
    image: {
      recommended: "none",
      alternatives: ["webp", "avif"],
      compressionRatio: 0,
      speed: 100,
    },
    css: {
      recommended: "brotli",
      alternatives: ["gzip"],
      compressionRatio: 85,
      speed: 90,
    },
    javascript: {
      recommended: "brotli",
      alternatives: ["gzip"],
      compressionRatio: 80,
      speed: 85,
    },
    font: {
      recommended: "none",
      alternatives: ["gzip"],
      compressionRatio: 0,
      speed: 100,
    },
    video: {
      recommended: "none",
      alternatives: ["h264", "vp9"],
      compressionRatio: 0,
      speed: 100,
    },
    document: {
      recommended: "brotli",
      alternatives: ["gzip"],
      compressionRatio: 75,
      speed: 80,
    },
  };

  return recommendations[assetType] || recommendations.document;
}

// Get asset versioning strategy
export function getAssetVersioningStrategy(): {
  strategy: string;
  methods: string[];
  recommendations: string[];
} {
  return {
    strategy: "Content-based versioning with cache busting",
    methods: [
      "Hash-based versioning (e.g., app.abc123.js)",
      "Timestamp-based versioning (e.g., app.1234567890.js)",
      "Semantic versioning (e.g., app.v1.2.3.js)",
      "Query parameter versioning (e.g., app.js?v=1.2.3)",
    ],
    recommendations: [
      "Use hash-based versioning for immutable assets",
      "Include hash in filename for cache busting",
      "Use long cache TTL for versioned assets",
      "Implement cache invalidation on deployment",
      "Use service workers for offline support",
    ],
  };
}

// Get asset delivery optimization tips
export function getAssetDeliveryOptimizationTips(): {
  tips: string[];
  expectedImprovement: number;
} {
  return {
    tips: [
      "Use CDN for global asset delivery",
      "Enable HTTP/2 server push",
      "Implement lazy loading",
      "Use responsive images",
      "Minify CSS and JavaScript",
      "Remove unused CSS",
      "Defer non-critical JavaScript",
      "Use async/defer attributes",
      "Implement critical CSS",
      "Use service workers",
    ],
    expectedImprovement: 50,
  };
}

// Get asset size optimization recommendations
export function getAssetSizeOptimizationRecommendations(): {
  recommendations: string[];
  estimatedReduction: number;
} {
  return {
    recommendations: [
      "Minify CSS and JavaScript (10-20% reduction)",
      "Remove unused CSS (20-40% reduction)",
      "Optimize images (30-50% reduction)",
      "Use WebP format (25-35% reduction)",
      "Use AVIF format (40-50% reduction)",
      "Compress fonts (20-30% reduction)",
      "Remove unused fonts (10-20% reduction)",
      "Defer non-critical resources",
      "Implement code splitting",
      "Use tree shaking",
    ],
    estimatedReduction: 50,
  };
}

// Get asset loading strategy
export function getAssetLoadingStrategy(): {
  strategy: string;
  priorities: Record<string, string>;
  recommendations: string[];
} {
  return {
    strategy: "Priority-based asset loading with lazy loading",
    priorities: {
      critical: "Load immediately (HTML, critical CSS, critical JS)",
      high: "Load early (fonts, above-fold images)",
      medium: "Load on demand (below-fold images, non-critical JS)",
      low: "Load lazily (analytics, tracking, ads)",
    },
    recommendations: [
      "Load critical assets first",
      "Defer non-critical JavaScript",
      "Lazy load images and videos",
      "Use intersection observer for lazy loading",
      "Implement progressive enhancement",
      "Use service workers for caching",
      "Implement resource hints (preload, prefetch)",
      "Use async/defer attributes",
    ],
  };
}

// Get asset monitoring recommendations
export function getAssetMonitoringRecommendations(): {
  metrics: string[];
  alerts: string[];
  reportingInterval: number;
} {
  return {
    metrics: [
      "Total asset size",
      "Compressed asset size",
      "Compression ratio",
      "Cache hit rate",
      "Asset delivery time",
      "Bandwidth usage",
      "Error rate",
      "CDN performance",
    ],
    alerts: [
      "Asset size increase > 10%",
      "Cache hit rate < 80%",
      "Asset delivery time > 1000ms",
      "Bandwidth usage spike",
      "CDN error rate > 1%",
      "Origin server errors",
    ],
    reportingInterval: 3600000, // 1 hour
  };
}

// Initialize asset optimization metrics
export function initializeAssetOptimizationMetrics(): AssetOptimizationMetrics {
  return {
    totalAssets: 0,
    totalSize: 0,
    totalCompressedSize: 0,
    compressionRatio: 0,
    averageCompressionTime: 0,
    cacheHitRate: 0,
    bandwidthSaved: 0,
  };
}

// Update asset optimization metrics
export function updateAssetOptimizationMetrics(
  metrics: AssetOptimizationMetrics,
  asset: StaticAsset,
  compressionTime: number,
  cacheHit: boolean
): AssetOptimizationMetrics {
  const updated = { ...metrics };
  updated.totalAssets++;
  updated.totalSize += asset.size;
  updated.totalCompressedSize += asset.compressedSize;
  updated.compressionRatio = calculateCompressionRatio(updated.totalSize, updated.totalCompressedSize);
  updated.averageCompressionTime =
    (updated.averageCompressionTime * (updated.totalAssets - 1) + compressionTime) / updated.totalAssets;
  updated.bandwidthSaved = updated.totalSize - updated.totalCompressedSize;

  if (cacheHit) {
    updated.cacheHitRate = (updated.cacheHitRate * (updated.totalAssets - 1) + 100) / updated.totalAssets;
  } else {
    updated.cacheHitRate = (updated.cacheHitRate * (updated.totalAssets - 1)) / updated.totalAssets;
  }

  return updated;
}

// Get asset optimization report
export function generateAssetOptimizationReport(metrics: AssetOptimizationMetrics): {
  summary: string;
  details: Record<string, any>;
  recommendations: string[];
} {
  return {
    summary: `Total assets: ${metrics.totalAssets}, Compression ratio: ${metrics.compressionRatio.toFixed(2)}%, Cache hit rate: ${metrics.cacheHitRate.toFixed(2)}%`,
    details: {
      totalAssets: metrics.totalAssets,
      totalSize: `${(metrics.totalSize / (1024 * 1024)).toFixed(2)} MB`,
      totalCompressedSize: `${(metrics.totalCompressedSize / (1024 * 1024)).toFixed(2)} MB`,
      compressionRatio: `${metrics.compressionRatio.toFixed(2)}%`,
      averageCompressionTime: `${metrics.averageCompressionTime.toFixed(2)}ms`,
      cacheHitRate: `${metrics.cacheHitRate.toFixed(2)}%`,
      bandwidthSaved: `${(metrics.bandwidthSaved / (1024 * 1024)).toFixed(2)} MB`,
    },
    recommendations: [
      metrics.compressionRatio < 50 ? "Improve compression ratio" : "Compression ratio is good",
      metrics.cacheHitRate < 80 ? "Improve cache hit rate" : "Cache hit rate is good",
    ],
  };
}

// Get asset delivery performance metrics
export function getAssetDeliveryPerformanceMetrics(): {
  metric: string;
  currentTime: number;
  optimizedTime: number;
  improvement: number;
  improvementPercentage: number;
}[] {
  return [
    {
      metric: "CSS delivery",
      currentTime: 200,
      optimizedTime: 50,
      improvement: 150,
      improvementPercentage: 75,
    },
    {
      metric: "JavaScript delivery",
      currentTime: 300,
      optimizedTime: 75,
      improvement: 225,
      improvementPercentage: 75,
    },
    {
      metric: "Image delivery",
      currentTime: 400,
      optimizedTime: 100,
      improvement: 300,
      improvementPercentage: 75,
    },
    {
      metric: "Font delivery",
      currentTime: 150,
      optimizedTime: 50,
      improvement: 100,
      improvementPercentage: 67,
    },
    {
      metric: "Overall asset delivery",
      currentTime: 1050,
      optimizedTime: 275,
      improvement: 775,
      improvementPercentage: 74,
    },
  ];
}

