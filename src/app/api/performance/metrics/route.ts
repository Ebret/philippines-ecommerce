import { NextRequest, NextResponse } from "next/server";
import { PerformanceQuerySchema } from "@/lib/validations/performance";
import {
  calculateAverageResponseTime,
  calculateP95ResponseTime,
  calculateP99ResponseTime,
  calculateSuccessRate,
  calculatePerformanceScore,
  identifySlowEndpoints,
  identifyFailedRequests,
} from "@/lib/performance-utils";

// Mock data for demonstration
const mockMetrics = {
  apiMetrics: [
    {
      endpoint: "/api/products",
      method: "GET" as const,
      responseTime: 150,
      statusCode: 200,
      requestSize: 1024,
      responseSize: 2048,
      timestamp: new Date(),
    },
    {
      endpoint: "/api/products",
      method: "GET" as const,
      responseTime: 180,
      statusCode: 200,
      requestSize: 1024,
      responseSize: 2048,
      timestamp: new Date(),
    },
    {
      endpoint: "/api/orders",
      method: "GET" as const,
      responseTime: 1500,
      statusCode: 200,
      requestSize: 512,
      responseSize: 4096,
      timestamp: new Date(),
    },
    {
      endpoint: "/api/users",
      method: "POST" as const,
      responseTime: 500,
      statusCode: 500,
      requestSize: 2048,
      responseSize: 512,
      timestamp: new Date(),
    },
  ],
  coreWebVitals: {
    fcp: 1200,
    lcp: 2400,
    cls: 0.08,
    tti: 3500,
    tbt: 150,
    timestamp: new Date(),
  },
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const metric = searchParams.get("metric");
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Validate query parameters
    const queryParams = {
      metric: metric || undefined,
      limit,
      offset,
    };

    const validatedQuery = PerformanceQuerySchema.parse(queryParams);

    // Calculate performance metrics
    const avgResponseTime = calculateAverageResponseTime(mockMetrics.apiMetrics);
    const p95ResponseTime = calculateP95ResponseTime(mockMetrics.apiMetrics);
    const p99ResponseTime = calculateP99ResponseTime(mockMetrics.apiMetrics);
    const successRate = calculateSuccessRate(mockMetrics.apiMetrics);
    const performanceScore = calculatePerformanceScore(mockMetrics.coreWebVitals);
    const slowEndpoints = identifySlowEndpoints(mockMetrics.apiMetrics, 1000);
    const failedRequests = identifyFailedRequests(mockMetrics.apiMetrics);

    const response = {
      success: true,
      data: {
        metrics: {
          apiPerformance: {
            averageResponseTime: avgResponseTime,
            p95ResponseTime,
            p99ResponseTime,
            successRate,
            totalRequests: mockMetrics.apiMetrics.length,
            failedRequests: failedRequests.length,
            slowEndpoints: slowEndpoints.length,
          },
          coreWebVitals: mockMetrics.coreWebVitals,
          performanceScore,
        },
        slowEndpoints: slowEndpoints.slice(offset, offset + validatedQuery.limit),
        failedRequests: failedRequests.slice(offset, offset + validatedQuery.limit),
        pagination: {
          limit: validatedQuery.limit,
          offset: validatedQuery.offset,
          total: mockMetrics.apiMetrics.length,
        },
      },
      timestamp: new Date(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Performance metrics error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch performance metrics",
      },
      { status: 400 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // In a real implementation, this would store metrics in a database
    // For now, we'll just validate and return success

    const response = {
      success: true,
      message: "Performance metric recorded successfully",
      data: {
        metric: body,
        recordedAt: new Date(),
      },
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Performance metric recording error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to record performance metric",
      },
      { status: 400 }
    );
  }
}

