import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getImageQuality,
  detectNetworkSpeed,
  getOptimalImageSize,
  generateImageSrcset,
  generateImageSrcsetWithQuality,
  getImagePlaceholder,
  optimizeImageUrl,
  calculateAspectRatio,
  optimizeImageForMobile,
  optimizeImageForTablet,
  optimizeImageForDesktop,
  imageOptimizationConfig,
  responsiveImageSizes,
} from "@/lib/image-optimization";
import {
  getCriticalCSSForRoute,
  generateCriticalCSSScript,
  measureCSSPerformance,
  generateCSSReport,
  criticalCSS,
} from "@/lib/critical-css";

describe("Frontend Optimization", () => {
  describe("Image Optimization", () => {
    describe("Image Quality Detection", () => {
      it("should return default quality for undefined network speed", () => {
        const quality = getImageQuality();
        expect(quality).toBe(85);
      });

      it("should return 2G quality for slow connection", () => {
        const quality = getImageQuality("2g");
        expect(quality).toBe(60);
      });

      it("should return 3G quality for 3G connection", () => {
        const quality = getImageQuality("3g");
        expect(quality).toBe(75);
      });

      it("should return 4G quality for 4G connection", () => {
        const quality = getImageQuality("4g");
        expect(quality).toBe(85);
      });

      it("should return 5G quality for 5G connection", () => {
        const quality = getImageQuality("5g");
        expect(quality).toBe(95);
      });
    });

    describe("Network Speed Detection", () => {
      it("should return undefined if navigator is not available", () => {
        const speed = detectNetworkSpeed();
        expect(speed === undefined || typeof speed === "string").toBe(true);
      });
    });

    describe("Optimal Image Size", () => {
      it("should return optimal size for hero images", () => {
        const size = getOptimalImageSize("hero");
        expect(size).toContain("100vw");
      });

      it("should return optimal size for product cards", () => {
        const size = getOptimalImageSize("productCard");
        expect(size).toContain("calc");
      });

      it("should return optimal size for thumbnails", () => {
        const size = getOptimalImageSize("thumbnail");
        expect(size).toContain("px");
      });

      it("should return optimal size for avatars", () => {
        const size = getOptimalImageSize("avatar");
        expect(size).toContain("px");
      });
    });

    describe("Image Srcset Generation", () => {
      it("should generate srcset with default widths", () => {
        const srcset = generateImageSrcset("/image.jpg");
        expect(srcset).toContain("320w");
        expect(srcset).toContain("640w");
        expect(srcset).toContain("1024w");
        expect(srcset).toContain("1280w");
        expect(srcset).toContain("1536w");
      });

      it("should generate srcset with custom widths", () => {
        const srcset = generateImageSrcset("/image.jpg", [200, 400, 800]);
        expect(srcset).toContain("200w");
        expect(srcset).toContain("400w");
        expect(srcset).toContain("800w");
      });

      it("should include quality parameter in srcset", () => {
        const srcset = generateImageSrcset("/image.jpg");
        expect(srcset).toContain("q=75");
      });
    });

    describe("Image Srcset with Quality", () => {
      it("should generate srcset with 2G quality", () => {
        const srcset = generateImageSrcsetWithQuality("/image.jpg", [320], "2g");
        expect(srcset).toContain("q=60");
      });

      it("should generate srcset with 4G quality", () => {
        const srcset = generateImageSrcsetWithQuality("/image.jpg", [320], "4g");
        expect(srcset).toContain("q=85");
      });

      it("should generate srcset with 5G quality", () => {
        const srcset = generateImageSrcsetWithQuality("/image.jpg", [320], "5g");
        expect(srcset).toContain("q=95");
      });
    });

    describe("Image Placeholder", () => {
      it("should generate SVG placeholder", () => {
        const placeholder = getImagePlaceholder(100, 100);
        expect(placeholder).toContain("data:image/svg+xml");
        expect(placeholder).toContain("100");
      });

      it("should use custom color for placeholder", () => {
        const placeholder = getImagePlaceholder(100, 100, "ff0000");
        expect(placeholder).toContain("ff0000");
      });

      it("should use default color if not provided", () => {
        const placeholder = getImagePlaceholder(100, 100);
        expect(placeholder).toContain("e5e7eb");
      });
    });

    describe("Image URL Optimization", () => {
      it("should add width parameter", () => {
        const url = optimizeImageUrl("/image.jpg", 640);
        expect(url).toContain("w=640");
      });

      it("should add height parameter", () => {
        const url = optimizeImageUrl("/image.jpg", 640, 480);
        expect(url).toContain("h=480");
      });

      it("should add quality parameter", () => {
        const url = optimizeImageUrl("/image.jpg", 640, 480, 85);
        expect(url).toContain("q=85");
      });

      it("should combine multiple parameters", () => {
        const url = optimizeImageUrl("/image.jpg", 640, 480, 85);
        expect(url).toContain("w=640");
        expect(url).toContain("h=480");
        expect(url).toContain("q=85");
      });

      it("should handle URLs with existing query parameters", () => {
        const url = optimizeImageUrl("/image.jpg?existing=param", 640);
        expect(url).toContain("existing=param");
        expect(url).toContain("w=640");
      });
    });

    describe("Aspect Ratio Calculation", () => {
      it("should calculate aspect ratio for 16:9", () => {
        const ratio = calculateAspectRatio(1920, 1080);
        expect(ratio).toBe("16/9");
      });

      it("should calculate aspect ratio for 4:3", () => {
        const ratio = calculateAspectRatio(800, 600);
        expect(ratio).toBe("4/3");
      });

      it("should calculate aspect ratio for 1:1", () => {
        const ratio = calculateAspectRatio(500, 500);
        expect(ratio).toBe("1/1");
      });

      it("should calculate aspect ratio for 3:2", () => {
        const ratio = calculateAspectRatio(300, 200);
        expect(ratio).toBe("3/2");
      });
    });

    describe("Device-Specific Image Optimization", () => {
      it("should optimize image for mobile", () => {
        const url = optimizeImageForMobile("/image.jpg");
        expect(url).toContain("w=640");
        expect(url).toContain("q=75");
      });

      it("should optimize image for tablet", () => {
        const url = optimizeImageForTablet("/image.jpg");
        expect(url).toContain("w=1024");
        expect(url).toContain("q=85");
      });

      it("should optimize image for desktop", () => {
        const url = optimizeImageForDesktop("/image.jpg");
        expect(url).toContain("w=1536");
        expect(url).toContain("q=95");
      });
    });

    describe("Image Optimization Config", () => {
      it("should have device sizes configured", () => {
        expect(imageOptimizationConfig.deviceSizes).toBeDefined();
        expect(imageOptimizationConfig.deviceSizes.mobile).toBe(320);
        expect(imageOptimizationConfig.deviceSizes.tablet).toBe(768);
        expect(imageOptimizationConfig.deviceSizes.desktop).toBe(1024);
      });

      it("should have quality settings for different networks", () => {
        expect(imageOptimizationConfig.qualitySettings["2g"]).toBe(60);
        expect(imageOptimizationConfig.qualitySettings["3g"]).toBe(75);
        expect(imageOptimizationConfig.qualitySettings["4g"]).toBe(85);
        expect(imageOptimizationConfig.qualitySettings["5g"]).toBe(95);
      });

      it("should have responsive image sizes", () => {
        expect(responsiveImageSizes.hero).toBeDefined();
        expect(responsiveImageSizes.productCard).toBeDefined();
        expect(responsiveImageSizes.thumbnail).toBeDefined();
        expect(responsiveImageSizes.avatar).toBeDefined();
      });
    });
  });

  describe("Critical CSS", () => {
    describe("Critical CSS Content", () => {
      it("should contain critical CSS", () => {
        expect(criticalCSS).toBeDefined();
        expect(criticalCSS.length).toBeGreaterThan(0);
      });

      it("should include reset styles", () => {
        expect(criticalCSS).toContain("margin: 0");
        expect(criticalCSS).toContain("padding: 0");
        expect(criticalCSS).toContain("box-sizing: border-box");
      });

      it("should include typography styles", () => {
        expect(criticalCSS).toContain("font-family");
        expect(criticalCSS).toContain("line-height");
      });

      it("should include responsive styles", () => {
        expect(criticalCSS).toContain("@media");
      });

      it("should include accessibility styles", () => {
        expect(criticalCSS).toContain("sr-only");
        expect(criticalCSS).toContain("focus-visible");
      });
    });

    describe("Route-Specific Critical CSS", () => {
      it("should return CSS for homepage", () => {
        const css = getCriticalCSSForRoute("/");
        expect(css).toContain("hero");
      });

      it("should return CSS for products page", () => {
        const css = getCriticalCSSForRoute("/products");
        expect(css).toContain("product");
      });

      it("should return CSS for cart page", () => {
        const css = getCriticalCSSForRoute("/cart");
        expect(css).toContain("cart");
      });

      it("should return empty string for unknown route", () => {
        const css = getCriticalCSSForRoute("/unknown");
        expect(css).toBe("");
      });
    });

    describe("Critical CSS Script Generation", () => {
      it("should generate valid script tag", () => {
        const script = generateCriticalCSSScript();
        expect(script).toContain("<script>");
        expect(script).toContain("</script>");
      });

      it("should include critical CSS in script", () => {
        const script = generateCriticalCSSScript();
        expect(script).toContain("criticalCSS");
      });

      it("should include style injection logic", () => {
        const script = generateCriticalCSSScript();
        expect(script).toContain("document.createElement");
        expect(script).toContain("document.head");
      });
    });

    describe("CSS Performance Measurement", () => {
      it("should measure CSS performance", () => {
        const metrics = measureCSSPerformance();
        expect(metrics).toHaveProperty("criticalCSSSize");
        expect(metrics).toHaveProperty("totalCSSSize");
        expect(metrics).toHaveProperty("cssLoadTime");
      });

      it("should have positive CSS sizes", () => {
        const metrics = measureCSSPerformance();
        expect(metrics.criticalCSSSize).toBeGreaterThan(0);
        expect(metrics.totalCSSSize).toBeGreaterThanOrEqual(metrics.criticalCSSSize);
      });
    });

    describe("CSS Report Generation", () => {
      it("should generate CSS report", () => {
        const report = generateCSSReport();
        expect(report).toHaveProperty("criticalCSSSize");
        expect(report).toHaveProperty("totalCSSSize");
        expect(report).toHaveProperty("cssLoadTime");
        expect(report).toHaveProperty("optimization");
      });

      it("should have valid optimization rating", () => {
        const report = generateCSSReport();
        expect(["Excellent", "Good", "Needs Improvement"]).toContain(
          report.optimization
        );
      });
    });
  });

  describe("Frontend Optimization Integration", () => {
    it("should support mobile-first optimization", () => {
      const mobileUrl = optimizeImageForMobile("/image.jpg");
      const desktopUrl = optimizeImageForDesktop("/image.jpg");

      // Mobile should have lower quality
      expect(mobileUrl).toContain("q=75");
      expect(desktopUrl).toContain("q=95");
    });

    it("should support network-aware optimization", () => {
      const quality2g = getImageQuality("2g");
      const quality5g = getImageQuality("5g");

      expect(quality2g).toBeLessThan(quality5g);
    });

    it("should support responsive image delivery", () => {
      const srcset = generateImageSrcset("/image.jpg");
      const widths = [320, 640, 1024, 1280, 1536];

      widths.forEach((width) => {
        expect(srcset).toContain(`${width}w`);
      });
    });

    it("should support critical CSS extraction", () => {
      const css = criticalCSS;
      expect(css).toContain("body");
      expect(css).toContain("button");
      expect(css).toContain("input");
    });
  });
});

