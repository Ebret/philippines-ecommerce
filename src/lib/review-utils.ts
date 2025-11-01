/**
 * Review & Rating System Utility Functions
 * Comprehensive utilities for review management, moderation, analytics, and calculations
 */

import { Decimal } from "@prisma/client/runtime/library";

// ============================================================================
// REVIEW ID GENERATION
// ============================================================================

export function generateReviewId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `rev_${timestamp}_${randomStr}`;
}

// ============================================================================
// RATING CALCULATIONS
// ============================================================================

export function calculateAverageRating(ratings: number[]): number {
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, rating) => acc + rating, 0);
  return Math.round((sum / ratings.length) * 10) / 10;
}

export function calculateRatingPercentage(
  count: number,
  total: number
): number {
  if (total === 0) return 0;
  return Math.round((count / total) * 100);
}

export function getRatingDistribution(ratings: number[]): {
  fiveStar: number;
  fourStar: number;
  threeStar: number;
  twoStar: number;
  oneStar: number;
} {
  const distribution = {
    fiveStar: 0,
    fourStar: 0,
    threeStar: 0,
    twoStar: 0,
    oneStar: 0,
  };

  ratings.forEach((rating) => {
    if (rating === 5) distribution.fiveStar++;
    else if (rating === 4) distribution.fourStar++;
    else if (rating === 3) distribution.threeStar++;
    else if (rating === 2) distribution.twoStar++;
    else if (rating === 1) distribution.oneStar++;
  });

  return distribution;
}

// ============================================================================
// HELPFULNESS CALCULATIONS
// ============================================================================

export function calculateHelpfulnessScore(
  helpfulCount: number,
  notHelpfulCount: number
): number {
  const total = helpfulCount + notHelpfulCount;
  if (total === 0) return 0;
  return Math.round((helpfulCount / total) * 100);
}

export function getHelpfulnessLevel(score: number): string {
  if (score >= 80) return "very_helpful";
  if (score >= 60) return "helpful";
  if (score >= 40) return "somewhat_helpful";
  return "not_helpful";
}

// ============================================================================
// VERIFIED PURCHASE DETECTION
// ============================================================================

export function isVerifiedPurchase(
  orderId: string,
  orderStatus: string
): boolean {
  // Check if order exists and is completed
  return (
    orderId.length > 0 &&
    (orderStatus === "delivered" || orderStatus === "completed")
  );
}

export function getVerificationBadgeText(isVerified: boolean): string {
  return isVerified ? "Verified Purchase" : "Unverified";
}

// ============================================================================
// REVIEW MODERATION
// ============================================================================

export function shouldFlagReview(content: string): boolean {
  // Simple content filtering - can be enhanced with ML
  const flaggedWords = [
    "spam",
    "scam",
    "fake",
    "inappropriate",
    "offensive",
  ];
  const lowerContent = content.toLowerCase();
  return flaggedWords.some((word) => lowerContent.includes(word));
}

export function calculateSpamScore(
  reviewCount: number,
  timeSpan: number
): number {
  // Calculate spam score based on review frequency
  // timeSpan in hours
  if (timeSpan === 0) return 0;
  const reviewsPerHour = reviewCount / timeSpan;
  if (reviewsPerHour > 5) return 100;
  if (reviewsPerHour > 3) return 75;
  if (reviewsPerHour > 1) return 50;
  return 0;
}

export function getModerationPriority(
  flagCount: number,
  spamScore: number
): "high" | "medium" | "low" {
  if (flagCount >= 3 || spamScore >= 75) return "high";
  if (flagCount >= 1 || spamScore >= 50) return "medium";
  return "low";
}

// ============================================================================
// SENTIMENT ANALYSIS
// ============================================================================

export function analyzeSentiment(content: string): {
  positive: number;
  neutral: number;
  negative: number;
} {
  // Simplified sentiment analysis
  const positiveWords = [
    "excellent",
    "great",
    "amazing",
    "love",
    "perfect",
    "best",
    "wonderful",
    "fantastic",
  ];
  const negativeWords = [
    "terrible",
    "awful",
    "hate",
    "worst",
    "bad",
    "poor",
    "disappointing",
    "broken",
  ];

  const lowerContent = content.toLowerCase();
  let positiveCount = 0;
  let negativeCount = 0;

  positiveWords.forEach((word) => {
    if (lowerContent.includes(word)) positiveCount++;
  });

  negativeWords.forEach((word) => {
    if (lowerContent.includes(word)) negativeCount++;
  });

  const total = positiveCount + negativeCount || 1;
  const positive = Math.round((positiveCount / total) * 100);
  const negative = Math.round((negativeCount / total) * 100);
  const neutral = 100 - positive - negative;

  return { positive, neutral, negative };
}

// ============================================================================
// REVIEW QUALITY SCORING
// ============================================================================

export function calculateReviewQualityScore(
  rating: number,
  contentLength: number,
  hasPhotos: boolean,
  hasResponses: boolean,
  helpfulnessScore: number
): number {
  let score = 0;

  // Rating quality (0-20 points)
  if (rating >= 3) score += 20;
  else if (rating >= 2) score += 10;

  // Content length (0-20 points)
  if (contentLength >= 500) score += 20;
  else if (contentLength >= 200) score += 15;
  else if (contentLength >= 100) score += 10;

  // Media (0-20 points)
  if (hasPhotos) score += 15;

  // Engagement (0-20 points)
  if (hasResponses) score += 10;

  // Helpfulness (0-20 points)
  score += Math.round((helpfulnessScore / 100) * 20);

  return Math.min(score, 100);
}

// ============================================================================
// ANALYTICS CALCULATIONS
// ============================================================================

export function calculateTrendingScore(
  reviewCount: number,
  averageRating: number,
  recentReviews: number,
  helpfulnessScore: number
): number {
  const recencyWeight = recentReviews * 10;
  const ratingWeight = averageRating * 15;
  const volumeWeight = Math.min(reviewCount * 2, 30);
  const helpfulnessWeight = (helpfulnessScore / 100) * 20;

  return Math.round(recencyWeight + ratingWeight + volumeWeight + helpfulnessWeight);
}

export function getPerformanceLevel(
  averageRating: number
): "excellent" | "good" | "average" | "poor" {
  if (averageRating >= 4.5) return "excellent";
  if (averageRating >= 3.5) return "good";
  if (averageRating >= 2.5) return "average";
  return "poor";
}

// ============================================================================
// REVIEW FILTERING & SORTING
// ============================================================================

export function sortReviewsByHelpfulness(
  reviews: Array<{ helpfulCount: number; notHelpfulCount: number }>
): Array<{ helpfulCount: number; notHelpfulCount: number }> {
  return [...reviews].sort((a, b) => {
    const scoreA = calculateHelpfulnessScore(a.helpfulCount, a.notHelpfulCount);
    const scoreB = calculateHelpfulnessScore(b.helpfulCount, b.notHelpfulCount);
    return scoreB - scoreA;
  });
}

export function filterReviewsByRating(
  reviews: Array<{ rating: number }>,
  targetRating: number
): Array<{ rating: number }> {
  return reviews.filter((review) => review.rating === targetRating);
}

// ============================================================================
// RESPONSE MANAGEMENT
// ============================================================================

export function canVendorRespond(vendorId: string, sellerId: string): boolean {
  return vendorId === sellerId;
}

export function getResponseCount(responses: Array<{ id: string }>): number {
  return responses.length;
}

// ============================================================================
// REVIEW STATISTICS
// ============================================================================

export function calculateReviewStats(reviews: Array<{
  rating: number;
  isVerified: boolean;
  helpfulCount: number;
  notHelpfulCount: number;
  responses: Array<{ id: string }>;
}>) {
  const totalReviews = reviews.length;
  const verifiedCount = reviews.filter((r) => r.isVerified).length;
  const averageRating = calculateAverageRating(reviews.map((r) => r.rating));
  const totalResponses = reviews.reduce((sum, r) => sum + r.responses.length, 0);
  const averageHelpfulness = Math.round(
    reviews.reduce(
      (sum, r) =>
        sum + calculateHelpfulnessScore(r.helpfulCount, r.notHelpfulCount),
      0
    ) / (totalReviews || 1)
  );

  return {
    totalReviews,
    verifiedCount,
    averageRating,
    totalResponses,
    averageHelpfulness,
    verificationRate: calculateRatingPercentage(verifiedCount, totalReviews),
  };
}

// ============================================================================
// PHILIPPINES-SPECIFIC FEATURES
// ============================================================================

export function isPhilippinesReview(location?: string): boolean {
  if (!location) return false;
  const phLocations = ["PH", "Philippines", "Metro Manila", "Cebu", "Davao"];
  return phLocations.some((loc) =>
    location.toUpperCase().includes(loc.toUpperCase())
  );
}

export function getLocalLanguageSupport(language: string): boolean {
  const supportedLanguages = ["en", "tl", "fil"];
  return supportedLanguages.includes(language.toLowerCase());
}

