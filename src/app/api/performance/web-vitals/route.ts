import { NextRequest, NextResponse } from "next/server";
import { CoreWebVitalsSchema } from "@/lib/validations/performance";
import { calculatePerformanceScore } from "@/lib/performance-utils";

// Mock data for demonstration
const mockWebVitals = {
  fcp: 1200, // First Contentful Paint (ms)
  lcp: 2400, // Largest Contentful Paint (ms)
  cls: 0.08, // Cumulative Layout Shift
  tti: 3500, // Time to Interactive (ms)
  tbt: 150, // Total Blocking Time (ms)
  fid: 50, // First Input Delay (ms)
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get("period") || "day";

    // Validate Core Web Vitals
    const validatedVitals = CoreWebVitalsSchema.parse({
      ...mockWebVitals,
      timestamp: new Date(),
    });

    // Calculate performance score
    const performanceScore = calculatePerformanceScore(validatedVitals);

    // Determine performance rating
    let rating = "Good";
    if (performanceScore >= 90) rating = "Excellent";
    else if (performanceScore >= 75) rating = "Good";
    else if (performanceScore >= 50) rating = "Needs Improvement";
    else rating = "Poor";

    // Determine metric status
    const getMetricStatus = (value: number, threshold: number) => {
      return value <= threshold ? "good" : "needs-improvement";
    };

    const response = {
      success: true,
      data: {
        period,
        vitals: {
          fcp: {
            value: validatedVitals.fcp,
            unit: "ms",
            status: getMetricStatus(validatedVitals.fcp || 0, 1800),
            threshold: 1800,
            description: "First Contentful Paint",
          },
          lcp: {
            value: validatedVitals.lcp,
            unit: "ms",
            status: getMetricStatus(validatedVitals.lcp || 0, 2500),
            threshold: 2500,
            description: "Largest Contentful Paint",
          },
          cls: {
            value: validatedVitals.cls,
            unit: "score",
            status: getMetricStatus(validatedVitals.cls || 0, 0.1),
            threshold: 0.1,
            description: "Cumulative Layout Shift",
          },
          tti: {
            value: validatedVitals.tti,
            unit: "ms",
            status: getMetricStatus(validatedVitals.tti || 0, 3800),
            threshold: 3800,
            description: "Time to Interactive",
          },
          tbt: {
            value: validatedVitals.tbt,
            unit: "ms",
            status: getMetricStatus(validatedVitals.tbt || 0, 200),
            threshold: 200,
            description: "Total Blocking Time",
          },
          fid: {
            value: validatedVitals.fid,
            unit: "ms",
            status: getMetricStatus(validatedVitals.fid || 0, 100),
            threshold: 100,
            description: "First Input Delay",
          },
        },
        summary: {
          performanceScore,
          rating,
          timestamp: validatedVitals.timestamp,
        },
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Web Vitals error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch Web Vitals",
      },
      { status: 400 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate Core Web Vitals data
    const validatedVitals = CoreWebVitalsSchema.parse(body);

    // Calculate performance score
    const performanceScore = calculatePerformanceScore(validatedVitals);

    const response = {
      success: true,
      message: "Web Vitals recorded successfully",
      data: {
        vitals: validatedVitals,
        performanceScore,
        recordedAt: new Date(),
      },
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Web Vitals recording error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to record Web Vitals",
      },
      { status: 400 }
    );
  }
}

