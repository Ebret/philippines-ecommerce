import { z } from "zod";

/**
 * Testimonial Creation Schema
 * Validates testimonial data when creating a new testimonial
 */
export const TestimonialCreationSchema = z.object({
  productId: z.string().cuid("Invalid product ID"),
  rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title must be at most 100 characters"),
  content: z.string().min(20, "Content must be at least 20 characters").max(2000, "Content must be at most 2000 characters"),
  mediaUrls: z.array(z.string().url("Invalid media URL")).optional().default([]),
  beforeAfterComparison: z.object({
    before: z.string().url("Invalid before image URL"),
    after: z.string().url("Invalid after image URL")
  }).optional(),
  isAnonymous: z.boolean().optional().default(false),
});

export type TestimonialCreationInput = z.infer<typeof TestimonialCreationSchema>;

/**
 * Testimonial Update Schema
 * Validates testimonial data when updating an existing testimonial
 */
export const TestimonialUpdateSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  title: z.string().min(5).max(100).optional(),
  content: z.string().min(20).max(2000).optional(),
  mediaUrls: z.array(z.string().url()).optional(),
  beforeAfterComparison: z.object({
    before: z.string().url(),
    after: z.string().url()
  }).optional(),
});

export type TestimonialUpdateInput = z.infer<typeof TestimonialUpdateSchema>;

/**
 * Testimonial Query Schema
 * Validates query parameters for listing testimonials
 */
export const TestimonialQuerySchema = z.object({
  productId: z.string().cuid().optional(),
  vendorId: z.string().cuid().optional(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "FEATURED"]).optional(),
  isFeatured: z.boolean().optional(),
  minRating: z.number().int().min(1).max(5).optional(),
  maxRating: z.number().int().min(1).max(5).optional(),
  sortBy: z.enum(["createdAt", "rating", "helpfulCount", "viewCount"]).optional().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(10),
});

export type TestimonialQueryInput = z.infer<typeof TestimonialQuerySchema>;

/**
 * Testimonial Moderation Schema
 * Validates moderation actions on testimonials
 */
export const TestimonialModerationSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED", "FEATURED"]),
  rejectionReason: z.string().optional(),
});

export type TestimonialModerationInput = z.infer<typeof TestimonialModerationSchema>;

/**
 * Media Upload Schema
 * Validates media file uploads for testimonials
 */
export const MediaUploadSchema = z.object({
  mediaType: z.enum(["video", "photo"]),
  fileSize: z.number().int().min(1),
  mimeType: z.string(),
  duration: z.number().int().optional(),
});

export type MediaUploadInput = z.infer<typeof MediaUploadSchema>;

/**
 * Testimonial Helpful Vote Schema
 * Validates helpful/unhelpful votes on testimonials
 */
export const TestimonialVoteSchema = z.object({
  voteType: z.enum(["helpful", "unhelpful"]),
});

export type TestimonialVoteInput = z.infer<typeof TestimonialVoteSchema>;

/**
 * Vendor Testimonial Dashboard Query Schema
 * Validates query parameters for vendor dashboard
 */
export const VendorTestimonialDashboardSchema = z.object({
  timeRange: z.enum(["7d", "30d", "90d", "1y", "all"]).optional().default("30d"),
  sortBy: z.enum(["rating", "date", "helpful"]).optional().default("date"),
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(50).optional().default(20),
});

export type VendorTestimonialDashboardInput = z.infer<typeof VendorTestimonialDashboardSchema>;

