// CDN Setup and Configuration Utilities

export interface CDNProvider {
  name: string;
  type: "cloudflare" | "cloudfront" | "akamai" | "fastly";
  apiKey?: string;
  apiSecret?: string;
  zoneId?: string;
  distributionId?: string;
  enabled: boolean;
}

export interface CDNOriginServer {
  id: string;
  name: string;
  domain: string;
  protocol: "http" | "https";
  port: number;
  weight: number;
  healthCheck: boolean;
  healthCheckPath: string;
  healthCheckInterval: number;
  failoverPriority: number;
}

export interface CDNConfiguration {
  provider: CDNProvider;
  originServers: CDNOriginServer[];
  primaryOrigin: string;
  backupOrigins: string[];
  enableCompression: boolean;
  enableHTTP2: boolean;
  enableHTTP3: boolean;
  enableBrotli: boolean;
  minifyAssets: boolean;
  enableImageOptimization: boolean;
  enableWebP: boolean;
  enableAVIF: boolean;
  enableLazyLoading: boolean;
  cacheKeyIncludeQueryString: boolean;
  cacheKeyIncludeHeaders: string[];
  purgeOnDeploy: boolean;
  enableAnalytics: boolean;
  enableDDoSProtection: boolean;
  enableWAF: boolean;
  enableRateLimiting: boolean;
  rateLimitThreshold: number;
  rateLimitWindow: number;
}

export interface CDNEdgeLocation {
  code: string;
  name: string;
  region: string;
  country: string;
  continent: string;
  latitude: number;
  longitude: number;
  enabled: boolean;
  priority: number;
}

export interface CDNHealthCheck {
  originId: string;
  status: "healthy" | "unhealthy" | "degraded";
  lastCheckTime: number;
  responseTime: number;
  statusCode: number;
  consecutiveFailures: number;
  consecutiveSuccesses: number;
}

// Default CDN configuration
export const DEFAULT_CDN_CONFIG: CDNConfiguration = {
  provider: {
    name: "CloudFlare",
    type: "cloudflare",
    enabled: true,
  },
  originServers: [],
  primaryOrigin: "",
  backupOrigins: [],
  enableCompression: true,
  enableHTTP2: true,
  enableHTTP3: true,
  enableBrotli: true,
  minifyAssets: true,
  enableImageOptimization: true,
  enableWebP: true,
  enableAVIF: true,
  enableLazyLoading: true,
  cacheKeyIncludeQueryString: false,
  cacheKeyIncludeHeaders: ["Accept-Encoding", "Accept-Language"],
  purgeOnDeploy: true,
  enableAnalytics: true,
  enableDDoSProtection: true,
  enableWAF: true,
  enableRateLimiting: true,
  rateLimitThreshold: 1000,
  rateLimitWindow: 60,
};

// Southeast Asian edge locations
export const SOUTHEAST_ASIA_EDGE_LOCATIONS: CDNEdgeLocation[] = [
  {
    code: "PH-MNL",
    name: "Manila, Philippines",
    region: "Southeast Asia",
    country: "Philippines",
    continent: "Asia",
    latitude: 14.5995,
    longitude: 120.9842,
    enabled: true,
    priority: 1,
  },
  {
    code: "SG-SIN",
    name: "Singapore",
    region: "Southeast Asia",
    country: "Singapore",
    continent: "Asia",
    latitude: 1.3521,
    longitude: 103.8198,
    enabled: true,
    priority: 2,
  },
  {
    code: "TH-BKK",
    name: "Bangkok, Thailand",
    region: "Southeast Asia",
    country: "Thailand",
    continent: "Asia",
    latitude: 13.7563,
    longitude: 100.5018,
    enabled: true,
    priority: 3,
  },
  {
    code: "ID-CGK",
    name: "Jakarta, Indonesia",
    region: "Southeast Asia",
    country: "Indonesia",
    continent: "Asia",
    latitude: -6.1751,
    longitude: 106.8650,
    enabled: true,
    priority: 4,
  },
  {
    code: "MY-KUL",
    name: "Kuala Lumpur, Malaysia",
    region: "Southeast Asia",
    country: "Malaysia",
    continent: "Asia",
    latitude: 3.1390,
    longitude: 101.6869,
    enabled: true,
    priority: 5,
  },
  {
    code: "VN-HAN",
    name: "Hanoi, Vietnam",
    region: "Southeast Asia",
    country: "Vietnam",
    continent: "Asia",
    latitude: 21.0285,
    longitude: 105.8542,
    enabled: true,
    priority: 6,
  },
];

// Get CDN configuration
export function getCDNConfiguration(environment: "development" | "production" = "production"): CDNConfiguration {
  if (environment === "development") {
    return {
      ...DEFAULT_CDN_CONFIG,
      enableDDoSProtection: false,
      enableWAF: false,
      enableRateLimiting: false,
    };
  }

  return DEFAULT_CDN_CONFIG;
}

// Create origin server
export function createOriginServer(
  name: string,
  domain: string,
  protocol: "http" | "https" = "https",
  port: number = 443,
  failoverPriority: number = 1
): CDNOriginServer {
  return {
    id: `origin:${name}:${Date.now()}`,
    name,
    domain,
    protocol,
    port,
    weight: 100,
    healthCheck: true,
    healthCheckPath: "/health",
    healthCheckInterval: 30,
    failoverPriority,
  };
}

// Get Southeast Asia edge locations
export function getSoutheastAsiaEdgeLocations(): CDNEdgeLocation[] {
  return SOUTHEAST_ASIA_EDGE_LOCATIONS;
}

// Get primary edge location (Philippines)
export function getPrimaryEdgeLocation(): CDNEdgeLocation {
  return SOUTHEAST_ASIA_EDGE_LOCATIONS[0]; // Manila
}

// Get backup edge locations
export function getBackupEdgeLocations(): CDNEdgeLocation[] {
  return SOUTHEAST_ASIA_EDGE_LOCATIONS.slice(1);
}

// Initialize CDN health check
export function initializeCDNHealthCheck(originId: string): CDNHealthCheck {
  return {
    originId,
    status: "healthy",
    lastCheckTime: Date.now(),
    responseTime: 0,
    statusCode: 200,
    consecutiveFailures: 0,
    consecutiveSuccesses: 0,
  };
}

// Update CDN health check
export function updateCDNHealthCheck(
  healthCheck: CDNHealthCheck,
  responseTime: number,
  statusCode: number,
  success: boolean
): CDNHealthCheck {
  const updated = { ...healthCheck };
  updated.lastCheckTime = Date.now();
  updated.responseTime = responseTime;
  updated.statusCode = statusCode;

  if (success) {
    updated.consecutiveSuccesses++;
    updated.consecutiveFailures = 0;
    if (updated.consecutiveSuccesses >= 3) {
      updated.status = "healthy";
    }
  } else {
    updated.consecutiveFailures++;
    updated.consecutiveSuccesses = 0;
    if (updated.consecutiveFailures >= 3) {
      updated.status = "unhealthy";
    } else if (updated.consecutiveFailures >= 1) {
      updated.status = "degraded";
    }
  }

  return updated;
}

// Get CDN provider configuration
export function getCDNProviderConfig(provider: "cloudflare" | "cloudfront" | "akamai" | "fastly"): {
  name: string;
  apiEndpoint: string;
  features: string[];
  pricing: string;
  supportedRegions: string[];
} {
  const configs: Record<string, any> = {
    cloudflare: {
      name: "CloudFlare",
      apiEndpoint: "https://api.cloudflare.com/client/v4",
      features: [
        "Global CDN",
        "DDoS Protection",
        "WAF",
        "Image Optimization",
        "Automatic Compression",
        "HTTP/3 Support",
      ],
      pricing: "Pay-as-you-go",
      supportedRegions: ["Global", "Southeast Asia", "Asia-Pacific"],
    },
    cloudfront: {
      name: "AWS CloudFront",
      apiEndpoint: "https://cloudfront.amazonaws.com",
      features: [
        "Global CDN",
        "Lambda@Edge",
        "Origin Shield",
        "Real-time Logs",
        "Field-level Encryption",
      ],
      pricing: "Pay-as-you-go",
      supportedRegions: ["Global", "Southeast Asia", "Asia-Pacific"],
    },
    akamai: {
      name: "Akamai",
      apiEndpoint: "https://api.akamai.com",
      features: [
        "Global CDN",
        "DDoS Protection",
        "WAF",
        "Bot Management",
        "API Acceleration",
      ],
      pricing: "Enterprise",
      supportedRegions: ["Global", "Southeast Asia", "Asia-Pacific"],
    },
    fastly: {
      name: "Fastly",
      apiEndpoint: "https://api.fastly.com",
      features: [
        "Global CDN",
        "Real-time Purging",
        "VCL Programming",
        "Image Optimization",
        "Instant Purge",
      ],
      pricing: "Pay-as-you-go",
      supportedRegions: ["Global", "Southeast Asia", "Asia-Pacific"],
    },
  };

  return configs[provider] || configs.cloudflare;
}

// Get CDN setup recommendations
export function getCDNSetupRecommendations(): {
  recommendations: string[];
  bestPractices: string[];
  securityMeasures: string[];
} {
  return {
    recommendations: [
      "Use CloudFlare or AWS CloudFront for global coverage",
      "Configure multiple origin servers for failover",
      "Enable HTTP/2 and HTTP/3 for better performance",
      "Enable Brotli compression for text assets",
      "Enable WebP and AVIF image formats",
      "Configure appropriate cache TTL values",
      "Implement cache invalidation on deployment",
      "Monitor CDN performance metrics",
      "Set up alerts for CDN issues",
      "Implement DDoS protection",
    ],
    bestPractices: [
      "Use separate CDN domain for static assets",
      "Implement cache busting with versioning",
      "Use edge locations closest to users",
      "Implement health checks for origin servers",
      "Configure failover for high availability",
      "Monitor cache hit rates",
      "Optimize image delivery",
      "Implement lazy loading",
      "Use appropriate cache headers",
      "Test CDN performance regularly",
    ],
    securityMeasures: [
      "Enable HTTPS for all CDN traffic",
      "Implement DDoS protection",
      "Enable WAF (Web Application Firewall)",
      "Implement rate limiting",
      "Use signed URLs for sensitive content",
      "Implement origin authentication",
      "Monitor for suspicious activity",
      "Implement IP whitelisting",
      "Use secure headers",
      "Regular security audits",
    ],
  };
}

// Get CDN DNS configuration
export function getCDNDNSConfiguration(): {
  recordType: string;
  recordName: string;
  recordValue: string;
  ttl: number;
  priority?: number;
}[] {
  return [
    {
      recordType: "CNAME",
      recordName: "cdn.ecommerce.ph",
      recordValue: "ecommerce.ph.cdn.cloudflare.net",
      ttl: 3600,
    },
    {
      recordType: "CNAME",
      recordName: "static.ecommerce.ph",
      recordValue: "ecommerce.ph.cdn.cloudflare.net",
      ttl: 3600,
    },
    {
      recordType: "CNAME",
      recordName: "images.ecommerce.ph",
      recordValue: "ecommerce.ph.cdn.cloudflare.net",
      ttl: 3600,
    },
    {
      recordType: "CNAME",
      recordName: "assets.ecommerce.ph",
      recordValue: "ecommerce.ph.cdn.cloudflare.net",
      ttl: 3600,
    },
  ];
}

// Get CDN failover strategy
export function getCDNFailoverStrategy(): {
  strategy: string;
  primaryOrigin: string;
  backupOrigins: string[];
  failoverConditions: string[];
  healthCheckInterval: number;
  failoverThreshold: number;
} {
  return {
    strategy: "Automatic failover with health checks",
    primaryOrigin: "origin1.ecommerce.ph",
    backupOrigins: ["origin2.ecommerce.ph", "origin3.ecommerce.ph"],
    failoverConditions: [
      "Origin returns 5xx error",
      "Origin response time > 5000ms",
      "Origin connection timeout",
      "Origin health check fails",
    ],
    healthCheckInterval: 30,
    failoverThreshold: 3,
  };
}

// Get CDN performance optimization tips
export function getCDNPerformanceOptimizationTips(): {
  tips: string[];
  expectedImprovement: number;
} {
  return {
    tips: [
      "Use edge locations closest to users",
      "Enable HTTP/2 and HTTP/3",
      "Enable Brotli compression",
      "Implement cache busting",
      "Use appropriate cache TTL",
      "Optimize image delivery",
      "Implement lazy loading",
      "Use WebP and AVIF formats",
      "Minimize JavaScript and CSS",
      "Use service workers for offline support",
    ],
    expectedImprovement: 60,
  };
}

// Get CDN cost optimization strategies
export function getCDNCostOptimizationStrategies(): {
  strategies: string[];
  estimatedSavings: number;
} {
  return {
    strategies: [
      "Use regional edge locations",
      "Implement aggressive caching",
      "Compress all assets",
      "Use image optimization",
      "Implement cache invalidation",
      "Monitor bandwidth usage",
      "Use reserved capacity",
      "Implement traffic shaping",
      "Use origin shield",
      "Optimize origin requests",
    ],
    estimatedSavings: 40,
  };
}

// Get CDN provider comparison
export function getCDNProviderComparison(): {
  provider: string;
  globalCoverage: number;
  performanceScore: number;
  securityScore: number;
  costEfficiency: number;
  supportQuality: number;
  overallScore: number;
}[] {
  return [
    {
      provider: "CloudFlare",
      globalCoverage: 95,
      performanceScore: 92,
      securityScore: 94,
      costEfficiency: 90,
      supportQuality: 88,
      overallScore: 92,
    },
    {
      provider: "AWS CloudFront",
      globalCoverage: 98,
      performanceScore: 94,
      securityScore: 96,
      costEfficiency: 85,
      supportQuality: 90,
      overallScore: 93,
    },
    {
      provider: "Akamai",
      globalCoverage: 99,
      performanceScore: 96,
      securityScore: 98,
      costEfficiency: 75,
      supportQuality: 92,
      overallScore: 92,
    },
    {
      provider: "Fastly",
      globalCoverage: 90,
      performanceScore: 95,
      securityScore: 93,
      costEfficiency: 88,
      supportQuality: 89,
      overallScore: 91,
    },
  ];
}

// Get CDN deployment checklist
export function getCDNDeploymentChecklist(): {
  task: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
}[] {
  return [
    { task: "Select CDN provider", priority: "high", completed: false },
    { task: "Configure origin servers", priority: "high", completed: false },
    { task: "Set up DNS records", priority: "high", completed: false },
    { task: "Configure cache rules", priority: "high", completed: false },
    { task: "Enable compression", priority: "high", completed: false },
    { task: "Enable image optimization", priority: "medium", completed: false },
    { task: "Set up health checks", priority: "high", completed: false },
    { task: "Configure failover", priority: "high", completed: false },
    { task: "Enable DDoS protection", priority: "medium", completed: false },
    { task: "Enable WAF", priority: "medium", completed: false },
    { task: "Set up monitoring", priority: "high", completed: false },
    { task: "Configure alerts", priority: "medium", completed: false },
    { task: "Test failover", priority: "high", completed: false },
    { task: "Performance testing", priority: "high", completed: false },
    { task: "Security audit", priority: "medium", completed: false },
  ];
}

