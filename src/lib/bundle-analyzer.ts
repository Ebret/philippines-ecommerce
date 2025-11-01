// Bundle Analyzer Utilities for identifying large dependencies and optimizing imports

export interface BundleModule {
  name: string;
  size: number;
  gzippedSize: number;
  percentage: number;
  type: "vendor" | "app" | "ui" | "utils";
}

export interface BundleAnalysisResult {
  totalSize: number;
  totalGzippedSize: number;
  modules: BundleModule[];
  largestModules: BundleModule[];
  recommendations: string[];
}

// Mock bundle data for analysis
const mockBundleModules: BundleModule[] = [
  {
    name: "react",
    size: 200000,
    gzippedSize: 50000,
    percentage: 0,
    type: "vendor",
  },
  {
    name: "react-dom",
    size: 180000,
    gzippedSize: 45000,
    percentage: 0,
    type: "vendor",
  },
  {
    name: "next",
    size: 150000,
    gzippedSize: 40000,
    percentage: 0,
    type: "vendor",
  },
  {
    name: "@radix-ui/react-dialog",
    size: 50000,
    gzippedSize: 12000,
    percentage: 0,
    type: "ui",
  },
  {
    name: "@radix-ui/react-select",
    size: 45000,
    gzippedSize: 11000,
    percentage: 0,
    type: "ui",
  },
  {
    name: "lucide-react",
    size: 80000,
    gzippedSize: 20000,
    percentage: 0,
    type: "ui",
  },
  {
    name: "zod",
    size: 60000,
    gzippedSize: 15000,
    percentage: 0,
    type: "utils",
  },
  {
    name: "app-code",
    size: 120000,
    gzippedSize: 30000,
    percentage: 0,
    type: "app",
  },
];

// Analyze bundle and identify large modules
export function analyzeBundleModules(modules: BundleModule[]): BundleAnalysisResult {
  const totalSize = modules.reduce((sum, m) => sum + m.size, 0);
  const totalGzippedSize = modules.reduce((sum, m) => sum + m.gzippedSize, 0);

  // Calculate percentages
  const modulesWithPercentage = modules.map((m) => ({
    ...m,
    percentage: (m.size / totalSize) * 100,
  }));

  // Get largest modules
  const largestModules = [...modulesWithPercentage]
    .sort((a, b) => b.size - a.size)
    .slice(0, 5);

  // Generate recommendations
  const recommendations = generateRecommendations(modulesWithPercentage);

  return {
    totalSize,
    totalGzippedSize,
    modules: modulesWithPercentage,
    largestModules,
    recommendations,
  };
}

// Generate optimization recommendations
function generateRecommendations(modules: BundleModule[]): string[] {
  const recommendations: string[] = [];

  // Check for large vendor bundles
  const vendorSize = modules
    .filter((m) => m.type === "vendor")
    .reduce((sum, m) => sum + m.size, 0);
  const vendorPercentage = (vendorSize / modules.reduce((sum, m) => sum + m.size, 0)) * 100;

  if (vendorPercentage > 50) {
    recommendations.push(
      "Consider code splitting vendor libraries to reduce initial bundle size"
    );
  }

  // Check for large UI libraries
  const uiModules = modules.filter((m) => m.type === "ui");
  uiModules.forEach((m) => {
    if (m.percentage > 5) {
      recommendations.push(
        `Consider lazy loading ${m.name} or using tree shaking to reduce its size`
      );
    }
  });

  // Check for unused imports
  recommendations.push("Audit imports to remove unused dependencies");
  recommendations.push("Enable tree shaking in webpack configuration");
  recommendations.push("Consider using dynamic imports for route-based code splitting");

  // Check for optimization opportunities
  const appModules = modules.filter((m) => m.type === "app");
  if (appModules.length > 0) {
    const appSize = appModules.reduce((sum, m) => sum + m.size, 0);
    if (appSize > 100000) {
      recommendations.push("Consider splitting large app modules into smaller chunks");
    }
  }

  return recommendations;
}

// Identify unused imports
export function identifyUnusedImports(
  imports: Array<{ name: string; used: boolean }>
): string[] {
  return imports.filter((imp) => !imp.used).map((imp) => imp.name);
}

// Calculate bundle size reduction potential
export function calculateReductionPotential(modules: BundleModule[]): {
  currentSize: number;
  potentialReduction: number;
  reductionPercentage: number;
  targetSize: number;
} {
  const currentSize = modules.reduce((sum, m) => sum + m.size, 0);

  // Estimate 30-40% reduction through optimization
  const reductionPercentage = 35;
  const potentialReduction = (currentSize * reductionPercentage) / 100;
  const targetSize = currentSize - potentialReduction;

  return {
    currentSize,
    potentialReduction,
    reductionPercentage,
    targetSize,
  };
}

// Get bundle analysis report
export function getBundleAnalysisReport(): BundleAnalysisResult {
  return analyzeBundleModules(mockBundleModules);
}

// Identify modules that can be lazy loaded
export function identifyLazyLoadablModules(modules: BundleModule[]): BundleModule[] {
  return modules.filter((m) => {
    // UI components and utils can typically be lazy loaded
    return (m.type === "ui" || m.type === "utils") && m.percentage < 10;
  });
}

// Identify modules that should be code split
export function identifyCodeSplitModules(modules: BundleModule[]): BundleModule[] {
  return modules.filter((m) => {
    // Modules larger than 50KB should be code split
    return m.size > 50000;
  });
}

// Calculate compression ratio
export function calculateCompressionRatio(
  module: BundleModule
): { ratio: number; percentage: number } {
  const ratio = module.size / module.gzippedSize;
  const percentage = ((module.size - module.gzippedSize) / module.size) * 100;

  return {
    ratio,
    percentage,
  };
}

// Get module by type
export function getModulesByType(
  modules: BundleModule[],
  type: "vendor" | "app" | "ui" | "utils"
): BundleModule[] {
  return modules.filter((m) => m.type === type);
}

// Calculate total size by type
export function calculateSizeByType(modules: BundleModule[]): Record<string, number> {
  const types = ["vendor", "app", "ui", "utils"] as const;
  const result: Record<string, number> = {};

  types.forEach((type) => {
    result[type] = modules
      .filter((m) => m.type === type)
      .reduce((sum, m) => sum + m.size, 0);
  });

  return result;
}

// Generate bundle optimization report
export function generateBundleOptimizationReport(): {
  analysis: BundleAnalysisResult;
  reduction: ReturnType<typeof calculateReductionPotential>;
  lazyLoadable: BundleModule[];
  codeSplit: BundleModule[];
  sizeByType: Record<string, number>;
} {
  const analysis = analyzeBundleModules(mockBundleModules);
  const reduction = calculateReductionPotential(mockBundleModules);
  const lazyLoadable = identifyLazyLoadablModules(mockBundleModules);
  const codeSplit = identifyCodeSplitModules(mockBundleModules);
  const sizeByType = calculateSizeByType(mockBundleModules);

  return {
    analysis,
    reduction,
    lazyLoadable,
    codeSplit,
    sizeByType,
  };
}

// Utility function to format bundle size
export function formatBundleSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

// Utility function to get bundle size comparison
export function getBundleSizeComparison(
  current: number,
  previous: number
): {
  difference: number;
  percentageChange: number;
  status: "improved" | "degraded" | "unchanged";
} {
  const difference = previous - current;
  const percentageChange = (difference / previous) * 100;
  const status = difference > 0 ? "improved" : difference < 0 ? "degraded" : "unchanged";

  return {
    difference,
    percentageChange,
    status,
  };
}

// Utility function to estimate load time
export function estimateBundleLoadTime(
  bundleSize: number,
  bandwidth: number // in Mbps
): number {
  // Convert bundle size from bytes to bits
  const bits = bundleSize * 8;
  // Convert bandwidth from Mbps to bits per second
  const bitsPerSecond = bandwidth * 1000000;
  // Calculate time in milliseconds
  return (bits / bitsPerSecond) * 1000;
}

// Utility function to get bundle health score
export function getBundleHealthScore(modules: BundleModule[]): {
  score: number;
  rating: "excellent" | "good" | "fair" | "poor";
  issues: string[];
} {
  let score = 100;
  const issues: string[] = [];

  const totalSize = modules.reduce((sum, m) => sum + m.size, 0);

  // Check total bundle size
  if (totalSize > 500000) {
    score -= 20;
    issues.push("Bundle size is larger than recommended (>500KB)");
  } else if (totalSize > 300000) {
    score -= 10;
    issues.push("Bundle size is larger than optimal (>300KB)");
  }

  // Check for large individual modules
  const largeModules = modules.filter((m) => m.size > 100000);
  if (largeModules.length > 0) {
    score -= 10;
    issues.push(`Found ${largeModules.length} large modules that should be code split`);
  }

  // Check compression ratio
  const avgCompressionRatio =
    modules.reduce((sum, m) => sum + m.size / m.gzippedSize, 0) / modules.length;
  if (avgCompressionRatio < 3) {
    score -= 5;
    issues.push("Compression ratio is lower than expected");
  }

  // Determine rating
  let rating: "excellent" | "good" | "fair" | "poor" = "excellent";
  if (score < 50) rating = "poor";
  else if (score < 70) rating = "fair";
  else if (score < 85) rating = "good";

  return {
    score: Math.max(0, score),
    rating,
    issues,
  };
}

