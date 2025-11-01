import { NextRequest, NextResponse } from "next/server";
import { CacheMetricSchema, PerformanceQuerySchema } from "@/lib/validations/performance";
import { calculateCacheMetrics } from "@/lib/performance-utils";

// Mock cache metrics data
const mockCacheMetrics = [
  {
    cacheKey: "products_list",
    hitCount: 950,
    missCount: 50,
    size: 1024000,
    ttl: 3600,
  },
  {
    cacheKey: "user_profile",
    hitCount: 850,
    missCount: 150,
    size: 512000,
    ttl: 1800,
  },
  {
    cacheKey: "categories",
    hitCount: 1000,
    missCount: 10,
    size: 256000,
    ttl: 7200,
  },
  {
    cacheKey: "orders_summary",
    hitCount: 700,
    missCount: 300,
    size: 2048000,
    ttl: 900,
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");
    const cacheKey = searchParams.get("cacheKey");

    // Validate query parameters
    const validatedQuery = PerformanceQuerySchema.parse({
      limit,
      offset,
    });

    // Filter by cache key if provided
    let filteredMetrics = mockCacheMetrics;
    if (cacheKey) {
      filteredMetrics = mockCacheMetrics.filter((m) =>
        m.cacheKey.includes(cacheKey)
      );
    }

    // Calculate metrics for each cache
    const calculatedMetrics = filteredMetrics.map((m) =>
      calculateCacheMetrics(m.cacheKey, m.hitCount, m.missCount, m.size, m.ttl)
    );

    // Calculate overall cache statistics
    const totalHits = calculatedMetrics.reduce((sum, m) => sum + m.hitCount, 0);
    const totalMisses = calculatedMetrics.reduce((sum, m) => sum + m.missCount, 0);
    const totalSize = calculatedMetrics.reduce((sum, m) => sum + (m.size || 0), 0);
    const overallHitRate = totalHits + totalMisses > 0
      ? (totalHits / (totalHits + totalMisses)) * 100
      : 0;

    // Paginate results
    const paginatedMetrics = calculatedMetrics.slice(
      offset,
      offset + validatedQuery.limit
    );

    const response = {
      success: true,
      data: {
        metrics: paginatedMetrics,
        summary: {
          totalCaches: calculatedMetrics.length,
          totalHits,
          totalMisses,
          overallHitRate: overallHitRate.toFixed(2),
          totalSize,
          averageHitRate: (
            calculatedMetrics.reduce((sum, m) => sum + m.hitRate, 0) /
            calculatedMetrics.length
          ).toFixed(2),
        },
        pagination: {
          limit: validatedQuery.limit,
          offset: validatedQuery.offset,
          total: calculatedMetrics.length,
        },
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Cache metrics error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch cache metrics",
      },
      { status: 400 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate cache metric data
    const validatedMetric = CacheMetricSchema.parse(body);

    const response = {
      success: true,
      message: "Cache metric recorded successfully",
      data: {
        metric: validatedMetric,
        recordedAt: new Date(),
      },
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Cache metric recording error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to record cache metric",
      },
      { status: 400 }
    );
  }
}

