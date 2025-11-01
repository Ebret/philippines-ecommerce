// Core Web Vitals Monitoring Utilities

export interface CoreWebVital {
  name: "LCP" | "FID" | "CLS" | "TTFB" | "FCP";
  value: number;
  unit: string;
  rating: "good" | "needs_improvement" | "poor";
  timestamp: number;
  deviceType: "mobile" | "desktop" | "tablet";
  networkType: "4g" | "3g" | "2g" | "5g" | "wifi";
  pageUrl: string;
}

export interface UserExperienceMetric {
  timestamp: number;
  pageUrl: string;
  deviceType: "mobile" | "desktop" | "tablet";
  networkType: "4g" | "3g" | "2g" | "5g" | "wifi";
  pageLoadTime: number;
  timeToInteractive: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

export interface MobilePerformanceMetric {
  timestamp: number;
  pageUrl: string;
  deviceType: string;
  screenSize: string;
  batteryLevel: number;
  connectionSpeed: number; // Mbps
  pageLoadTime: number;
  resourceCount: number;
  totalResourceSize: number; // bytes
  cacheSize: number; // bytes
}

export interface PerformanceBaseline {
  metric: string;
  goodThreshold: number;
  needsImprovementThreshold: number;
  poorThreshold: number;
  unit: string;
}

// Core Web Vitals thresholds (in milliseconds or unitless)
export const CORE_WEB_VITALS_THRESHOLDS: Record<string, PerformanceBaseline> = {
  LCP: {
    metric: "Largest Contentful Paint",
    goodThreshold: 2500,
    needsImprovementThreshold: 4000,
    poorThreshold: 4000,
    unit: "ms",
  },
  FID: {
    metric: "First Input Delay",
    goodThreshold: 100,
    needsImprovementThreshold: 300,
    poorThreshold: 300,
    unit: "ms",
  },
  CLS: {
    metric: "Cumulative Layout Shift",
    goodThreshold: 0.1,
    needsImprovementThreshold: 0.25,
    poorThreshold: 0.25,
    unit: "",
  },
  TTFB: {
    metric: "Time to First Byte",
    goodThreshold: 600,
    needsImprovementThreshold: 1800,
    poorThreshold: 1800,
    unit: "ms",
  },
  FCP: {
    metric: "First Contentful Paint",
    goodThreshold: 1800,
    needsImprovementThreshold: 3000,
    poorThreshold: 3000,
    unit: "ms",
  },
};

// Initialize Core Web Vital
export function initializeCoreWebVital(
  name: "LCP" | "FID" | "CLS" | "TTFB" | "FCP",
  value: number,
  deviceType: "mobile" | "desktop" | "tablet",
  networkType: "4g" | "3g" | "2g" | "5g" | "wifi",
  pageUrl: string
): CoreWebVital {
  const threshold = CORE_WEB_VITALS_THRESHOLDS[name];
  let rating: "good" | "needs_improvement" | "poor" = "poor";

  if (value <= threshold.goodThreshold) {
    rating = "good";
  } else if (value <= threshold.needsImprovementThreshold) {
    rating = "needs_improvement";
  }

  return {
    name,
    value,
    unit: threshold.unit,
    rating,
    timestamp: Date.now(),
    deviceType,
    networkType,
    pageUrl,
  };
}

// Calculate Core Web Vitals score
export function calculateCoreWebVitalsScore(vitals: CoreWebVital[]): {
  score: number;
  rating: "good" | "needs_improvement" | "poor";
  breakdown: Record<string, number>;
} {
  const scoreMap: Record<string, number> = {
    good: 100,
    needs_improvement: 50,
    poor: 0,
  };

  let totalScore = 0;
  const breakdown: Record<string, number> = {};

  vitals.forEach((vital) => {
    const score = scoreMap[vital.rating];
    breakdown[vital.name] = score;
    totalScore += score;
  });

  const averageScore = vitals.length > 0 ? totalScore / vitals.length : 0;
  let rating: "good" | "needs_improvement" | "poor" = "poor";

  if (averageScore >= 90) {
    rating = "good";
  } else if (averageScore >= 50) {
    rating = "needs_improvement";
  }

  return {
    score: Math.round(averageScore),
    rating,
    breakdown,
  };
}

// Initialize user experience metric
export function initializeUserExperienceMetric(
  pageUrl: string,
  deviceType: "mobile" | "desktop" | "tablet",
  networkType: "4g" | "3g" | "2g" | "5g" | "wifi",
  pageLoadTime: number,
  timeToInteractive: number,
  firstContentfulPaint: number,
  largestContentfulPaint: number,
  cumulativeLayoutShift: number,
  firstInputDelay: number
): UserExperienceMetric {
  return {
    timestamp: Date.now(),
    pageUrl,
    deviceType,
    networkType,
    pageLoadTime,
    timeToInteractive,
    firstContentfulPaint,
    largestContentfulPaint,
    cumulativeLayoutShift,
    firstInputDelay,
  };
}

// Initialize mobile performance metric
export function initializeMobilePerformanceMetric(
  pageUrl: string,
  deviceType: string,
  screenSize: string,
  batteryLevel: number,
  connectionSpeed: number,
  pageLoadTime: number,
  resourceCount: number,
  totalResourceSize: number,
  cacheSize: number
): MobilePerformanceMetric {
  return {
    timestamp: Date.now(),
    pageUrl,
    deviceType,
    screenSize,
    batteryLevel,
    connectionSpeed,
    pageLoadTime,
    resourceCount,
    totalResourceSize,
    cacheSize,
  };
}

// Get Core Web Vitals recommendations
export function getCoreWebVitalsRecommendations(vitals: CoreWebVital[]): string[] {
  const recommendations: string[] = [];

  vitals.forEach((vital) => {
    if (vital.rating === "poor") {
      switch (vital.name) {
        case "LCP":
          recommendations.push("Optimize Largest Contentful Paint: Reduce server response time, optimize images, defer non-critical CSS");
          break;
        case "FID":
          recommendations.push("Optimize First Input Delay: Break up long JavaScript tasks, use web workers");
          break;
        case "CLS":
          recommendations.push("Optimize Cumulative Layout Shift: Reserve space for dynamic content, avoid inserting content above existing content");
          break;
        case "TTFB":
          recommendations.push("Optimize Time to First Byte: Improve server response time, use CDN, optimize database queries");
          break;
        case "FCP":
          recommendations.push("Optimize First Contentful Paint: Reduce CSS blocking time, optimize critical rendering path");
          break;
      }
    }
  });

  return recommendations;
}

// Get mobile optimization recommendations
export function getMobileOptimizationRecommendations(metrics: MobilePerformanceMetric[]): string[] {
  const recommendations: string[] = [];

  const avgPageLoadTime = metrics.reduce((sum, m) => sum + m.pageLoadTime, 0) / metrics.length;
  const avgResourceSize = metrics.reduce((sum, m) => sum + m.totalResourceSize, 0) / metrics.length;

  if (avgPageLoadTime > 3000) {
    recommendations.push("Reduce page load time for mobile devices");
  }

  if (avgResourceSize > 5 * 1024 * 1024) {
    // 5MB
    recommendations.push("Optimize resource sizes for mobile networks");
  }

  const slowNetworkMetrics = metrics.filter((m) => m.networkType === "3g" || m.networkType === "2g");
  if (slowNetworkMetrics.length > 0) {
    recommendations.push("Optimize for slow network conditions (2G/3G)");
  }

  const lowBatteryMetrics = metrics.filter((m) => m.batteryLevel < 20);
  if (lowBatteryMetrics.length > 0) {
    recommendations.push("Optimize for low battery conditions");
  }

  return recommendations;
}

// Get Philippines-specific performance recommendations
export function getPhilippinesPerformanceRecommendations(metrics: UserExperienceMetric[]): string[] {
  const recommendations: string[] = [];

  // Philippines has significant 2G/3G usage
  const slowNetworkMetrics = metrics.filter((m) => m.networkType === "2g" || m.networkType === "3g");
  if (slowNetworkMetrics.length > metrics.length * 0.3) {
    recommendations.push("Optimize for 2G/3G networks prevalent in Philippines");
    recommendations.push("Implement progressive enhancement for slow networks");
    recommendations.push("Use adaptive image loading based on network speed");
  }

  // Mobile-first optimization
  const mobileMetrics = metrics.filter((m) => m.deviceType === "mobile");
  if (mobileMetrics.length > metrics.length * 0.7) {
    recommendations.push("Prioritize mobile-first optimization");
    recommendations.push("Optimize touch interactions for mobile devices");
    recommendations.push("Reduce data usage for mobile users");
  }

  // High traffic periods
  const avgPageLoadTime = metrics.reduce((sum, m) => sum + m.pageLoadTime, 0) / metrics.length;
  if (avgPageLoadTime > 2000) {
    recommendations.push("Implement server-side caching for high traffic");
    recommendations.push("Use CDN with Southeast Asian edge locations");
    recommendations.push("Optimize database queries for high concurrency");
  }

  return recommendations;
}

// Calculate performance score by network type
export function calculatePerformanceScoreByNetworkType(
  metrics: UserExperienceMetric[]
): Record<string, { score: number; avgPageLoadTime: number; sampleSize: number }> {
  const networkTypes = ["2g", "3g", "4g", "5g", "wifi"];
  const scores: Record<string, { score: number; avgPageLoadTime: number; sampleSize: number }> = {};

  networkTypes.forEach((networkType) => {
    const networkMetrics = metrics.filter((m) => m.networkType === networkType);
    if (networkMetrics.length > 0) {
      const avgPageLoadTime = networkMetrics.reduce((sum, m) => sum + m.pageLoadTime, 0) / networkMetrics.length;
      const score = Math.max(0, 100 - (avgPageLoadTime / 30)); // Normalize to 0-100

      scores[networkType] = {
        score: Math.round(score),
        avgPageLoadTime: Math.round(avgPageLoadTime),
        sampleSize: networkMetrics.length,
      };
    }
  });

  return scores;
}

// Calculate performance score by device type
export function calculatePerformanceScoreByDeviceType(
  metrics: UserExperienceMetric[]
): Record<string, { score: number; avgPageLoadTime: number; sampleSize: number }> {
  const deviceTypes = ["mobile", "tablet", "desktop"];
  const scores: Record<string, { score: number; avgPageLoadTime: number; sampleSize: number }> = {};

  deviceTypes.forEach((deviceType) => {
    const deviceMetrics = metrics.filter((m) => m.deviceType === deviceType);
    if (deviceMetrics.length > 0) {
      const avgPageLoadTime = deviceMetrics.reduce((sum, m) => sum + m.pageLoadTime, 0) / deviceMetrics.length;
      const score = Math.max(0, 100 - (avgPageLoadTime / 30)); // Normalize to 0-100

      scores[deviceType] = {
        score: Math.round(score),
        avgPageLoadTime: Math.round(avgPageLoadTime),
        sampleSize: deviceMetrics.length,
      };
    }
  });

  return scores;
}

// Get Core Web Vitals monitoring checklist
export function getCoreWebVitalsMonitoringChecklist(): {
  task: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
}[] {
  return [
    { task: "Set up LCP monitoring", priority: "high", completed: false },
    { task: "Set up FID monitoring", priority: "high", completed: false },
    { task: "Set up CLS monitoring", priority: "high", completed: false },
    { task: "Set up TTFB monitoring", priority: "high", completed: false },
    { task: "Set up FCP monitoring", priority: "high", completed: false },
    { task: "Configure mobile performance tracking", priority: "high", completed: false },
    { task: "Set up network type detection", priority: "medium", completed: false },
    { task: "Configure device type detection", priority: "medium", completed: false },
    { task: "Set up Philippines-specific monitoring", priority: "high", completed: false },
    { task: "Create Core Web Vitals dashboard", priority: "high", completed: false },
  ];
}

