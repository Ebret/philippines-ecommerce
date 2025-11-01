/**
 * Live Selling Utility Functions
 * Helper functions for live stream operations, chat moderation, flash sales, and analytics
 */

import { Decimal } from "@prisma/client/runtime/library";

// ============================================================================
// STREAM ID & MANAGEMENT
// ============================================================================

/**
 * Generate a unique stream ID
 */
export function generateStreamId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `stream_${timestamp}_${randomStr}`;
}

/**
 * Get stream status based on current time
 */
export function getStreamStatus(
  startTime: Date,
  endTime: Date | null,
  currentStatus: string
): string {
  const now = new Date();

  if (currentStatus === "cancelled") return "cancelled";
  if (currentStatus === "paused") return "paused";

  if (now < startTime) return "scheduled";
  if (endTime && now > endTime) return "ended";
  if (now >= startTime && (!endTime || now <= endTime)) return "live";

  return currentStatus;
}

/**
 * Calculate stream duration in minutes
 */
export function calculateStreamDuration(
  startTime: Date,
  endTime: Date | null
): number {
  if (!endTime) return 0;
  const durationMs = endTime.getTime() - startTime.getTime();
  return Math.floor(durationMs / (1000 * 60));
}

/**
 * Check if stream is currently live
 */
export function isStreamLive(startTime: Date, endTime: Date | null): boolean {
  const now = new Date();
  return now >= startTime && (!endTime || now <= endTime);
}

/**
 * Get time until stream starts (in seconds)
 */
export function getTimeUntilStart(startTime: Date): number {
  const now = new Date();
  const secondsUntilStart = Math.floor(
    (startTime.getTime() - now.getTime()) / 1000
  );
  return Math.max(0, secondsUntilStart);
}

// ============================================================================
// VIEWER MANAGEMENT
// ============================================================================

/**
 * Calculate average viewers
 */
export function calculateAverageViewers(
  totalViewers: number,
  duration: number
): number {
  if (duration === 0) return totalViewers;
  return Math.round(totalViewers / duration);
}

/**
 * Format viewer count for display
 */
export function formatViewerCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

/**
 * Calculate engagement rate
 */
export function calculateEngagementRate(
  messageCount: number,
  viewerCount: number
): number {
  if (viewerCount === 0) return 0;
  return Math.round((messageCount / viewerCount) * 100 * 100) / 100;
}

// ============================================================================
// CHAT MODERATION
// ============================================================================

/**
 * Check if message contains banned words
 */
export function containsBannedWords(message: string): boolean {
  const bannedWords = [
    "spam",
    "scam",
    "fake",
    "fraud",
    "illegal",
    "violence",
  ];
  const lowerMessage = message.toLowerCase();
  return bannedWords.some((word) => lowerMessage.includes(word));
}

/**
 * Check if message is spam (repeated characters)
 */
export function isSpamMessage(message: string): boolean {
  const repeatedCharPattern = /(.)\1{4,}/;
  return repeatedCharPattern.test(message);
}

/**
 * Check if message is all caps (spam indicator)
 */
export function isAllCaps(message: string): boolean {
  const hasLetters = /[a-z]/i.test(message);
  if (!hasLetters) return false;
  const upperCaseLetters = message.match(/[A-Z]/g) || [];
  const lowerCaseLetters = message.match(/[a-z]/g) || [];
  return lowerCaseLetters.length === 0 && upperCaseLetters.length > 3;
}

/**
 * Sanitize message for display
 */
export function sanitizeMessage(message: string): string {
  return message
    .trim()
    .substring(0, 500)
    .replace(/[<>]/g, "");
}

/**
 * Check if user should be rate limited
 */
export function shouldRateLimit(
  messageCount: number,
  timeWindowSeconds: number
): boolean {
  const maxMessagesPerMinute = 5;
  const messagesPerSecond = messageCount / timeWindowSeconds;
  return messagesPerSecond > maxMessagesPerMinute / 60;
}

// ============================================================================
// FLASH SALE CALCULATIONS
// ============================================================================

/**
 * Calculate flash sale price
 */
export function calculateFlashSalePrice(
  originalPrice: Decimal | number,
  discountPercent: number
): number {
  const price =
    typeof originalPrice === "number"
      ? originalPrice
      : originalPrice.toNumber();
  const discount = (price * discountPercent) / 100;
  return Math.round((price - discount) * 100) / 100;
}

/**
 * Calculate savings amount
 */
export function calculateSavings(
  originalPrice: Decimal | number,
  discountPercent: number
): number {
  const price =
    typeof originalPrice === "number"
      ? originalPrice
      : originalPrice.toNumber();
  return Math.round((price * discountPercent) / 100 * 100) / 100;
}

/**
 * Check if flash sale is active
 */
export function isFlashSaleActive(
  startTime: Date,
  endTime: Date
): boolean {
  const now = new Date();
  return now >= startTime && now <= endTime;
}

/**
 * Get time remaining for flash sale (in seconds)
 */
export function getFlashSaleTimeRemaining(endTime: Date): number {
  const now = new Date();
  const secondsRemaining = Math.floor(
    (endTime.getTime() - now.getTime()) / 1000
  );
  return Math.max(0, secondsRemaining);
}

/**
 * Calculate stock depletion rate
 */
export function calculateDepletionRate(
  soldCount: number,
  stockLimit: number,
  durationSeconds: number
): number {
  if (durationSeconds === 0) return 0;
  return Math.round((soldCount / stockLimit / (durationSeconds / 3600)) * 100);
}

/**
 * Estimate time to stock out
 */
export function estimateTimeToStockOut(
  soldCount: number,
  stockLimit: number,
  durationSeconds: number
): number {
  if (soldCount === 0 || durationSeconds === 0) return -1;
  const depletionRate = soldCount / durationSeconds;
  const remainingStock = stockLimit - soldCount;
  return Math.floor(remainingStock / depletionRate);
}

// ============================================================================
// RECORDING & REPLAY
// ============================================================================

/**
 * Generate recording ID
 */
export function generateRecordingId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `rec_${timestamp}_${randomStr}`;
}

/**
 * Calculate video file size estimate (MB)
 */
export function estimateVideoFileSize(
  durationMinutes: number,
  quality: "720p" | "1080p" | "4k"
): number {
  const bitrates: Record<string, number> = {
    "720p": 2.5, // Mbps
    "1080p": 5, // Mbps
    "4k": 15, // Mbps
  };

  const bitrate = bitrates[quality] || 5;
  const fileSizeMb = (bitrate * durationMinutes * 60) / 8;
  return Math.round(fileSizeMb);
}

/**
 * Format video duration for display
 */
export function formatVideoDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

// ============================================================================
// ANALYTICS
// ============================================================================

/**
 * Calculate conversion rate
 */
export function calculateConversionRate(
  purchases: number,
  viewers: number
): number {
  if (viewers === 0) return 0;
  return Math.round((purchases / viewers) * 100 * 100) / 100;
}

/**
 * Calculate average order value
 */
export function calculateAverageOrderValue(
  totalRevenue: Decimal | number,
  orderCount: number
): number {
  if (orderCount === 0) return 0;
  const revenue =
    typeof totalRevenue === "number"
      ? totalRevenue
      : totalRevenue.toNumber();
  return Math.round((revenue / orderCount) * 100) / 100;
}

/**
 * Calculate revenue per viewer
 */
export function calculateRevenuePerViewer(
  totalRevenue: Decimal | number,
  viewerCount: number
): number {
  if (viewerCount === 0) return 0;
  const revenue =
    typeof totalRevenue === "number"
      ? totalRevenue
      : totalRevenue.toNumber();
  return Math.round((revenue / viewerCount) * 100) / 100;
}

/**
 * Determine stream performance level
 */
export function determinePerformanceLevel(
  conversionRate: number,
  engagementRate: number
): "excellent" | "good" | "average" | "poor" {
  if (conversionRate > 5 && engagementRate > 10) return "excellent";
  if (conversionRate > 3 && engagementRate > 5) return "good";
  if (conversionRate > 1 && engagementRate > 2) return "average";
  return "poor";
}

