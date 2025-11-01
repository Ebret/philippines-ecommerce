// Image Delivery Optimization Utilities

export interface ImageFormat {
  format: "jpeg" | "png" | "webp" | "avif" | "svg";
  mimeType: string;
  quality: number;
  compression: number;
  supportedBrowsers: string[];
  fileSize: number;
  loadTime: number;
}

export interface ResponsiveImage {
  src: string;
  srcSet: string;
  sizes: string;
  alt: string;
  width: number;
  height: number;
  aspectRatio: number;
  formats: ImageFormat[];
  lazyLoad: boolean;
  placeholder: string;
}

export interface ImageOptimizationConfig {
  enableWebP: boolean;
  enableAVIF: boolean;
  enableResponsive: boolean;
  enableLazyLoading: boolean;
  enablePlaceholder: boolean;
  maxWidth: number;
  maxHeight: number;
  quality: number;
  formats: string[];
  breakpoints: number[];
  lazyLoadThreshold: number;
}

export interface ImageDeliveryMetrics {
  totalImages: number;
  averageImageSize: number;
  averageLoadTime: number;
  cacheHitRate: number;
  lazyLoadRate: number;
  webPUsageRate: number;
  avifUsageRate: number;
  bandwidthSaved: number;
}

// Default image optimization configuration
export const DEFAULT_IMAGE_OPTIMIZATION_CONFIG: ImageOptimizationConfig = {
  enableWebP: true,
  enableAVIF: true,
  enableResponsive: true,
  enableLazyLoading: true,
  enablePlaceholder: true,
  maxWidth: 2560,
  maxHeight: 2560,
  quality: 80,
  formats: ["avif", "webp", "jpeg"],
  breakpoints: [320, 640, 960, 1280, 1920, 2560],
  lazyLoadThreshold: 300,
};

// Image format configurations
export const IMAGE_FORMAT_CONFIG: Record<string, ImageFormat> = {
  jpeg: {
    format: "jpeg",
    mimeType: "image/jpeg",
    quality: 80,
    compression: 60,
    supportedBrowsers: ["All"],
    fileSize: 100,
    loadTime: 100,
  },
  png: {
    format: "png",
    mimeType: "image/png",
    quality: 100,
    compression: 40,
    supportedBrowsers: ["All"],
    fileSize: 150,
    loadTime: 120,
  },
  webp: {
    format: "webp",
    mimeType: "image/webp",
    quality: 80,
    compression: 75,
    supportedBrowsers: ["Chrome 23+", "Edge 18+", "Firefox 65+", "Safari 16+"],
    fileSize: 60,
    loadTime: 60,
  },
  avif: {
    format: "avif",
    mimeType: "image/avif",
    quality: 80,
    compression: 85,
    supportedBrowsers: ["Chrome 85+", "Firefox 93+", "Safari 16+"],
    fileSize: 40,
    loadTime: 40,
  },
  svg: {
    format: "svg",
    mimeType: "image/svg+xml",
    quality: 100,
    compression: 70,
    supportedBrowsers: ["All"],
    fileSize: 20,
    loadTime: 20,
  },
};

// Get image optimization configuration
export function getImageOptimizationConfig(environment: "development" | "production" = "production"): ImageOptimizationConfig {
  if (environment === "development") {
    return {
      ...DEFAULT_IMAGE_OPTIMIZATION_CONFIG,
      quality: 90,
      enableLazyLoading: false,
    };
  }

  return DEFAULT_IMAGE_OPTIMIZATION_CONFIG;
}

// Get responsive image srcset
export function getResponsiveImageSrcSet(
  basePath: string,
  breakpoints: number[] = DEFAULT_IMAGE_OPTIMIZATION_CONFIG.breakpoints
): string {
  return breakpoints
    .map((bp) => `${basePath}?w=${bp} ${bp}w`)
    .join(", ");
}

// Get responsive image sizes
export function getResponsiveImageSizes(): string {
  return "(max-width: 320px) 280px, (max-width: 640px) 600px, (max-width: 960px) 920px, (max-width: 1280px) 1240px, (max-width: 1920px) 1880px, 2520px";
}

// Create responsive image
export function createResponsiveImage(
  src: string,
  alt: string,
  width: number,
  height: number,
  lazyLoad: boolean = true
): ResponsiveImage {
  const aspectRatio = width / height;
  const formats: ImageFormat[] = [
    IMAGE_FORMAT_CONFIG.avif,
    IMAGE_FORMAT_CONFIG.webp,
    IMAGE_FORMAT_CONFIG.jpeg,
  ];

  return {
    src,
    srcSet: getResponsiveImageSrcSet(src),
    sizes: getResponsiveImageSizes(),
    alt,
    width,
    height,
    aspectRatio,
    formats,
    lazyLoad,
    placeholder: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'%3E%3C/svg%3E`,
  };
}

// Get image format recommendation
export function getImageFormatRecommendation(imageType: string): {
  recommended: string;
  alternatives: string[];
  compressionRatio: number;
  loadTimeImprovement: number;
} {
  const recommendations: Record<string, any> = {
    photograph: {
      recommended: "avif",
      alternatives: ["webp", "jpeg"],
      compressionRatio: 85,
      loadTimeImprovement: 60,
    },
    graphic: {
      recommended: "webp",
      alternatives: ["png", "svg"],
      compressionRatio: 75,
      loadTimeImprovement: 50,
    },
    icon: {
      recommended: "svg",
      alternatives: ["webp", "png"],
      compressionRatio: 70,
      loadTimeImprovement: 40,
    },
    screenshot: {
      recommended: "webp",
      alternatives: ["png", "jpeg"],
      compressionRatio: 75,
      loadTimeImprovement: 50,
    },
    animation: {
      recommended: "webp",
      alternatives: ["gif", "mp4"],
      compressionRatio: 80,
      loadTimeImprovement: 55,
    },
  };

  return recommendations[imageType] || recommendations.photograph;
}

// Get lazy loading strategy
export function getLazyLoadingStrategy(): {
  strategy: string;
  methods: string[];
  recommendations: string[];
  expectedImprovement: number;
} {
  return {
    strategy: "Intersection Observer-based lazy loading",
    methods: [
      "Intersection Observer API",
      "Scroll event listener",
      "Native lazy loading attribute",
      "Service worker caching",
    ],
    recommendations: [
      "Use Intersection Observer for better performance",
      "Implement placeholder images",
      "Use blur-up technique",
      "Implement progressive image loading",
      "Use service workers for caching",
      "Implement error handling",
      "Monitor lazy load performance",
    ],
    expectedImprovement: 40,
  };
}

// Get image placeholder strategy
export function getImagePlaceholderStrategy(): {
  strategy: string;
  methods: string[];
  recommendations: string[];
} {
  return {
    strategy: "Progressive image loading with placeholders",
    methods: [
      "Solid color placeholder",
      "Blur-up technique",
      "LQIP (Low Quality Image Placeholder)",
      "SVG placeholder",
      "Dominant color placeholder",
    ],
    recommendations: [
      "Use blur-up technique for better UX",
      "Generate LQIP on server",
      "Use dominant color as fallback",
      "Implement smooth transition",
      "Cache placeholders",
      "Monitor placeholder performance",
    ],
  };
}

// Get image CDN optimization tips
export function getImageCDNOptimizationTips(): {
  tips: string[];
  expectedImprovement: number;
} {
  return {
    tips: [
      "Use CDN for image delivery",
      "Enable automatic format selection",
      "Implement responsive images",
      "Use lazy loading",
      "Enable image compression",
      "Use WebP and AVIF formats",
      "Implement image resizing",
      "Use image caching",
      "Monitor image performance",
      "Implement error handling",
    ],
    expectedImprovement: 70,
  };
}

// Get image optimization recommendations
export function getImageOptimizationRecommendations(): {
  recommendations: string[];
  estimatedReduction: number;
} {
  return {
    recommendations: [
      "Use AVIF format (40-50% reduction)",
      "Use WebP format (25-35% reduction)",
      "Optimize JPEG quality (10-20% reduction)",
      "Remove metadata (5-10% reduction)",
      "Use responsive images (20-30% reduction)",
      "Implement lazy loading (30-40% reduction)",
      "Use image CDN (50-70% reduction)",
      "Implement progressive loading",
      "Use image sprites for icons",
      "Implement image caching",
    ],
    estimatedReduction: 60,
  };
}

// Initialize image delivery metrics
export function initializeImageDeliveryMetrics(): ImageDeliveryMetrics {
  return {
    totalImages: 0,
    averageImageSize: 0,
    averageLoadTime: 0,
    cacheHitRate: 0,
    lazyLoadRate: 0,
    webPUsageRate: 0,
    avifUsageRate: 0,
    bandwidthSaved: 0,
  };
}

// Update image delivery metrics
export function updateImageDeliveryMetrics(
  metrics: ImageDeliveryMetrics,
  imageSize: number,
  loadTime: number,
  cacheHit: boolean,
  lazyLoaded: boolean,
  format: string
): ImageDeliveryMetrics {
  const updated = { ...metrics };
  updated.totalImages++;
  updated.averageImageSize =
    (updated.averageImageSize * (updated.totalImages - 1) + imageSize) / updated.totalImages;
  updated.averageLoadTime =
    (updated.averageLoadTime * (updated.totalImages - 1) + loadTime) / updated.totalImages;

  if (cacheHit) {
    updated.cacheHitRate = (updated.cacheHitRate * (updated.totalImages - 1) + 100) / updated.totalImages;
  } else {
    updated.cacheHitRate = (updated.cacheHitRate * (updated.totalImages - 1)) / updated.totalImages;
  }

  if (lazyLoaded) {
    updated.lazyLoadRate = (updated.lazyLoadRate * (updated.totalImages - 1) + 100) / updated.totalImages;
  } else {
    updated.lazyLoadRate = (updated.lazyLoadRate * (updated.totalImages - 1)) / updated.totalImages;
  }

  if (format === "webp") {
    updated.webPUsageRate = (updated.webPUsageRate * (updated.totalImages - 1) + 100) / updated.totalImages;
  } else {
    updated.webPUsageRate = (updated.webPUsageRate * (updated.totalImages - 1)) / updated.totalImages;
  }

  if (format === "avif") {
    updated.avifUsageRate = (updated.avifUsageRate * (updated.totalImages - 1) + 100) / updated.totalImages;
  } else {
    updated.avifUsageRate = (updated.avifUsageRate * (updated.totalImages - 1)) / updated.totalImages;
  }

  return updated;
}

// Generate image delivery report
export function generateImageDeliveryReport(metrics: ImageDeliveryMetrics): {
  summary: string;
  details: Record<string, any>;
  recommendations: string[];
} {
  return {
    summary: `Total images: ${metrics.totalImages}, Average load time: ${metrics.averageLoadTime.toFixed(2)}ms, Cache hit rate: ${metrics.cacheHitRate.toFixed(2)}%`,
    details: {
      totalImages: metrics.totalImages,
      averageImageSize: `${(metrics.averageImageSize / 1024).toFixed(2)} KB`,
      averageLoadTime: `${metrics.averageLoadTime.toFixed(2)}ms`,
      cacheHitRate: `${metrics.cacheHitRate.toFixed(2)}%`,
      lazyLoadRate: `${metrics.lazyLoadRate.toFixed(2)}%`,
      webPUsageRate: `${metrics.webPUsageRate.toFixed(2)}%`,
      avifUsageRate: `${metrics.avifUsageRate.toFixed(2)}%`,
      bandwidthSaved: `${(metrics.bandwidthSaved / (1024 * 1024)).toFixed(2)} MB`,
    },
    recommendations: [
      metrics.averageLoadTime > 500 ? "Optimize image delivery" : "Image delivery is good",
      metrics.cacheHitRate < 80 ? "Improve cache hit rate" : "Cache hit rate is good",
      metrics.lazyLoadRate < 70 ? "Increase lazy loading" : "Lazy loading is good",
    ],
  };
}

// Get image delivery performance metrics
export function getImageDeliveryPerformanceMetrics(): {
  metric: string;
  currentTime: number;
  optimizedTime: number;
  improvement: number;
  improvementPercentage: number;
}[] {
  return [
    {
      metric: "JPEG delivery",
      currentTime: 400,
      optimizedTime: 100,
      improvement: 300,
      improvementPercentage: 75,
    },
    {
      metric: "WebP delivery",
      currentTime: 300,
      optimizedTime: 75,
      improvement: 225,
      improvementPercentage: 75,
    },
    {
      metric: "AVIF delivery",
      currentTime: 250,
      optimizedTime: 50,
      improvement: 200,
      improvementPercentage: 80,
    },
    {
      metric: "Lazy loaded images",
      currentTime: 500,
      optimizedTime: 100,
      improvement: 400,
      improvementPercentage: 80,
    },
    {
      metric: "Overall image delivery",
      currentTime: 1450,
      optimizedTime: 325,
      improvement: 1125,
      improvementPercentage: 78,
    },
  ];
}

