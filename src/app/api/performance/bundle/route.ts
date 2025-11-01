import { NextRequest, NextResponse } from "next/server";
import { BundleAnalysisSchema } from "@/lib/validations/performance";
import { calculateBundleSizeReduction, estimateLoadTime } from "@/lib/performance-utils";

// Mock bundle analysis data
const mockBundleData = {
  totalSize: 512000, // 512 KB
  gzippedSize: 128000, // 128 KB
  modules: [
    { name: "react", size: 200000, gzippedSize: 50000 },
    { name: "next", size: 150000, gzippedSize: 40000 },
    { name: "app", size: 162000, gzippedSize: 38000 },
  ],
};

const previousBundleData = {
  totalSize: 768000, // 768 KB
  gzippedSize: 192000, // 192 KB
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const compareWithPrevious = searchParams.get("compareWithPrevious") === "true";

    // Validate bundle analysis
    const validatedBundle = BundleAnalysisSchema.parse({
      ...mockBundleData,
      timestamp: new Date(),
    });

    // Calculate bundle size reduction if comparing
    let comparison = null;
    if (compareWithPrevious) {
      comparison = {
        previous: previousBundleData,
        current: {
          totalSize: validatedBundle.totalSize,
          gzippedSize: validatedBundle.gzippedSize,
        },
        reduction: calculateBundleSizeReduction(
          previousBundleData.totalSize,
          validatedBundle.totalSize
        ),
        gzippedReduction: calculateBundleSizeReduction(
          previousBundleData.gzippedSize,
          validatedBundle.gzippedSize
        ),
      };
    }

    // Estimate load times for different network speeds
    const loadTimes = {
      "2g": estimateLoadTime(validatedBundle.gzippedSize / 1024, 0.1), // 0.1 Mbps
      "3g": estimateLoadTime(validatedBundle.gzippedSize / 1024, 1.6), // 1.6 Mbps
      "4g": estimateLoadTime(validatedBundle.gzippedSize / 1024, 10), // 10 Mbps
      "5g": estimateLoadTime(validatedBundle.gzippedSize / 1024, 50), // 50 Mbps
    };

    const response = {
      success: true,
      data: {
        bundle: {
          totalSize: validatedBundle.totalSize,
          gzippedSize: validatedBundle.gzippedSize,
          compressionRatio: (
            ((validatedBundle.totalSize - validatedBundle.gzippedSize) /
              validatedBundle.totalSize) *
            100
          ).toFixed(2),
        },
        modules: validatedBundle.modules?.map((m) => ({
          name: m.name,
          size: m.size,
          gzippedSize: m.gzippedSize,
          percentage: m.percentage,
          compressionRatio: (
            ((m.size - m.gzippedSize) / m.size) *
            100
          ).toFixed(2),
        })),
        loadTimes: {
          "2g": `${loadTimes["2g"].toFixed(2)}ms`,
          "3g": `${loadTimes["3g"].toFixed(2)}ms`,
          "4g": `${loadTimes["4g"].toFixed(2)}ms`,
          "5g": `${loadTimes["5g"].toFixed(2)}ms`,
        },
        comparison,
        timestamp: validatedBundle.timestamp,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Bundle analysis error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch bundle analysis",
      },
      { status: 400 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate bundle analysis data
    const validatedBundle = BundleAnalysisSchema.parse(body);

    const response = {
      success: true,
      message: "Bundle analysis recorded successfully",
      data: {
        bundle: validatedBundle,
        recordedAt: new Date(),
      },
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Bundle analysis recording error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to record bundle analysis",
      },
      { status: 400 }
    );
  }
}

