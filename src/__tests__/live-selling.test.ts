/**
 * Live Selling Platform Tests
 * Comprehensive unit tests for live stream functionality
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  generateStreamId,
  getStreamStatus,
  calculateStreamDuration,
  isStreamLive,
  getTimeUntilStart,
  calculateAverageViewers,
  formatViewerCount,
  calculateEngagementRate,
  containsBannedWords,
  isSpamMessage,
  isAllCaps,
  sanitizeMessage,
  shouldRateLimit,
  calculateFlashSalePrice,
  calculateSavings,
  isFlashSaleActive,
  getFlashSaleTimeRemaining,
  calculateDepletionRate,
  estimateTimeToStockOut,
  generateRecordingId,
  estimateVideoFileSize,
  formatVideoDuration,
  calculateConversionRate,
  calculateAverageOrderValue,
  calculateRevenuePerViewer,
  determinePerformanceLevel,
} from "@/lib/live-selling-utils";
import {
  LiveSessionCreationSchema,
  LiveSessionUpdateSchema,
  ChatMessageSchema,
  FlashSaleCreationSchema,
  GiftSchema,
  RecordingStartSchema,
} from "@/lib/validations/live-selling";
import { Decimal } from "@prisma/client/runtime/library";

describe("Live Selling Utilities", () => {
  // ============================================================================
  // STREAM ID & MANAGEMENT
  // ============================================================================

  describe("Stream ID Generation", () => {
    it("should generate unique stream IDs", () => {
      const id1 = generateStreamId();
      const id2 = generateStreamId();
      expect(id1).toMatch(/^stream_/);
      expect(id2).toMatch(/^stream_/);
      expect(id1).not.toBe(id2);
    });

    it("should generate valid stream IDs", () => {
      const id = generateStreamId();
      expect(id.length).toBeGreaterThan(10);
      expect(id).toMatch(/^stream_[a-z0-9]+_[a-z0-9]+$/);
    });
  });

  describe("Stream Status", () => {
    it("should return scheduled for future streams", () => {
      const future = new Date(Date.now() + 3600000);
      const status = getStreamStatus(future, null, "scheduled");
      expect(status).toBe("scheduled");
    });

    it("should return live for current streams", () => {
      const past = new Date(Date.now() - 1000);
      const future = new Date(Date.now() + 3600000);
      const status = getStreamStatus(past, future, "scheduled");
      expect(status).toBe("live");
    });

    it("should return ended for past streams", () => {
      const past = new Date(Date.now() - 3600000);
      const status = getStreamStatus(past, past, "scheduled");
      expect(status).toBe("ended");
    });

    it("should respect cancelled status", () => {
      const future = new Date(Date.now() + 3600000);
      const status = getStreamStatus(future, null, "cancelled");
      expect(status).toBe("cancelled");
    });
  });

  describe("Stream Duration", () => {
    it("should calculate stream duration correctly", () => {
      const start = new Date("2025-01-01T10:00:00Z");
      const end = new Date("2025-01-01T11:30:00Z");
      const duration = calculateStreamDuration(start, end);
      expect(duration).toBe(90);
    });

    it("should return 0 for streams without end time", () => {
      const start = new Date("2025-01-01T10:00:00Z");
      const duration = calculateStreamDuration(start, null);
      expect(duration).toBe(0);
    });
  });

  describe("Stream Live Check", () => {
    it("should return true for live streams", () => {
      const past = new Date(Date.now() - 1000);
      const future = new Date(Date.now() + 3600000);
      expect(isStreamLive(past, future)).toBe(true);
    });

    it("should return false for scheduled streams", () => {
      const future = new Date(Date.now() + 3600000);
      expect(isStreamLive(future, null)).toBe(false);
    });
  });

  // ============================================================================
  // VIEWER MANAGEMENT
  // ============================================================================

  describe("Viewer Analytics", () => {
    it("should calculate average viewers correctly", () => {
      const avg = calculateAverageViewers(1000, 60);
      expect(avg).toBe(17);
    });

    it("should format viewer count correctly", () => {
      expect(formatViewerCount(500)).toBe("500");
      expect(formatViewerCount(1500)).toBe("1.5K");
      expect(formatViewerCount(1500000)).toBe("1.5M");
    });

    it("should calculate engagement rate correctly", () => {
      const rate = calculateEngagementRate(500, 1000);
      expect(rate).toBe(50);
    });

    it("should return 0 engagement for no viewers", () => {
      const rate = calculateEngagementRate(100, 0);
      expect(rate).toBe(0);
    });
  });

  // ============================================================================
  // CHAT MODERATION
  // ============================================================================

  describe("Chat Moderation", () => {
    it("should detect banned words", () => {
      expect(containsBannedWords("This is spam")).toBe(true);
      expect(containsBannedWords("Hello friend")).toBe(false);
    });

    it("should detect spam messages", () => {
      expect(isSpamMessage("hellooooooo")).toBe(true);
      expect(isSpamMessage("hello")).toBe(false);
    });

    it("should detect all caps messages", () => {
      expect(isAllCaps("HELLO WORLD")).toBe(true);
      expect(isAllCaps("Hello World")).toBe(false);
      expect(isAllCaps("123 456")).toBe(false);
    });

    it("should sanitize messages", () => {
      const sanitized = sanitizeMessage("  <script>alert('xss')</script>  ");
      expect(sanitized).not.toContain("<");
      expect(sanitized).not.toContain(">");
      expect(sanitized).toBe("scriptalert('xss')/script");
    });

    it("should detect rate limiting", () => {
      expect(shouldRateLimit(10, 60)).toBe(true);
      expect(shouldRateLimit(2, 60)).toBe(false);
    });
  });

  // ============================================================================
  // FLASH SALES
  // ============================================================================

  describe("Flash Sale Calculations", () => {
    it("should calculate flash sale price correctly", () => {
      const price = calculateFlashSalePrice(1000, 20);
      expect(price).toBe(800);
    });

    it("should calculate savings correctly", () => {
      const savings = calculateSavings(1000, 20);
      expect(savings).toBe(200);
    });

    it("should handle Decimal prices", () => {
      const price = calculateFlashSalePrice(new Decimal("1000.50"), 10);
      expect(price).toBe(900.45);
    });

    it("should check if flash sale is active", () => {
      const past = new Date(Date.now() - 1000);
      const future = new Date(Date.now() + 3600000);
      expect(isFlashSaleActive(past, future)).toBe(true);
    });

    it("should calculate time remaining", () => {
      const future = new Date(Date.now() + 60000);
      const remaining = getFlashSaleTimeRemaining(future);
      expect(remaining).toBeGreaterThan(50);
      expect(remaining).toBeLessThanOrEqual(60);
    });

    it("should calculate depletion rate", () => {
      const rate = calculateDepletionRate(100, 1000, 3600);
      expect(rate).toBeGreaterThan(0);
    });

    it("should estimate time to stock out", () => {
      const timeToStockOut = estimateTimeToStockOut(100, 1000, 3600);
      expect(timeToStockOut).toBeGreaterThan(0);
    });
  });

  // ============================================================================
  // RECORDING & REPLAY
  // ============================================================================

  describe("Recording Management", () => {
    it("should generate unique recording IDs", () => {
      const id1 = generateRecordingId();
      const id2 = generateRecordingId();
      expect(id1).toMatch(/^rec_/);
      expect(id2).toMatch(/^rec_/);
      expect(id1).not.toBe(id2);
    });

    it("should estimate video file size", () => {
      const size720p = estimateVideoFileSize(60, "720p");
      const size1080p = estimateVideoFileSize(60, "1080p");
      const size4k = estimateVideoFileSize(60, "4k");
      expect(size720p).toBeLessThan(size1080p);
      expect(size1080p).toBeLessThan(size4k);
    });

    it("should format video duration correctly", () => {
      expect(formatVideoDuration(65)).toBe("1:05");
      expect(formatVideoDuration(3665)).toBe("1:01:05");
      expect(formatVideoDuration(30)).toBe("0:30");
    });
  });

  // ============================================================================
  // ANALYTICS
  // ============================================================================

  describe("Stream Analytics", () => {
    it("should calculate conversion rate", () => {
      const rate = calculateConversionRate(50, 1000);
      expect(rate).toBe(5);
    });

    it("should calculate average order value", () => {
      const aov = calculateAverageOrderValue(10000, 100);
      expect(aov).toBe(100);
    });

    it("should calculate revenue per viewer", () => {
      const rpv = calculateRevenuePerViewer(5000, 1000);
      expect(rpv).toBe(5);
    });

    it("should determine performance level", () => {
      expect(determinePerformanceLevel(6, 12)).toBe("excellent");
      expect(determinePerformanceLevel(4, 6)).toBe("good");
      expect(determinePerformanceLevel(2, 3)).toBe("average");
      expect(determinePerformanceLevel(0.5, 1)).toBe("poor");
    });
  });

  // ============================================================================
  // VALIDATION SCHEMAS
  // ============================================================================

  describe("Validation Schemas", () => {
    it("should validate live session creation", () => {
      const data = {
        title: "Amazing Live Sale",
        description: "Join us for an amazing live sale",
        startTime: new Date(Date.now() + 3600000),
      };
      const result = LiveSessionCreationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should reject invalid session title", () => {
      const data = {
        title: "Bad",
        startTime: new Date(Date.now() + 3600000),
      };
      const result = LiveSessionCreationSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should validate chat message", () => {
      const data = {
        message: "Great products!",
        type: "text",
      };
      const result = ChatMessageSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should validate flash sale creation", () => {
      const data = {
        productId: "clh1234567890abcdefghijk",
        discountPercent: 20,
        stockLimit: 100,
        startTime: new Date(),
        endTime: new Date(Date.now() + 3600000),
      };
      const result = FlashSaleCreationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should validate gift schema", () => {
      const data = {
        giftType: "heart",
        quantity: 5,
        amount: 50,
      };
      const result = GiftSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should reject invalid gift quantity", () => {
      const data = {
        giftType: "heart",
        quantity: 200,
        amount: 50,
      };
      const result = GiftSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should validate recording start", () => {
      const data = {
        sessionId: "clh1234567890abcdefghijk",
        quality: "1080p",
      };
      const result = RecordingStartSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });
});

