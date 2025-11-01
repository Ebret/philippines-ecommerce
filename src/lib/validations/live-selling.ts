/**
 * Live Selling Validation Schemas
 * Zod schemas for live stream operations, chat, flash sales, and viewer management
 */

import { z } from "zod";

// ============================================================================
// ENUMS
// ============================================================================

export const LiveSessionStatusEnum = z.enum([
  "scheduled",
  "live",
  "ended",
  "cancelled",
  "paused",
]);

export const ChatMessageStatusEnum = z.enum([
  "pending",
  "approved",
  "rejected",
  "deleted",
]);

export const FlashSaleStatusEnum = z.enum([
  "scheduled",
  "active",
  "ended",
  "cancelled",
]);

export const RecordingStatusEnum = z.enum([
  "pending",
  "recording",
  "processing",
  "completed",
  "failed",
]);

// ============================================================================
// LIVE SESSION SCHEMAS
// ============================================================================

export const LiveSessionCreationSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must not exceed 200 characters"),
  description: z
    .string()
    .max(2000, "Description must not exceed 2000 characters")
    .optional(),
  startTime: z.coerce.date().min(new Date(), "Start time must be in the future"),
  endTime: z.coerce.date().optional(),
  streamUrl: z.string().url("Invalid stream URL").optional(),
  thumbnail: z.string().url("Invalid thumbnail URL").optional(),
  tags: z.array(z.string()).max(10, "Maximum 10 tags allowed").optional(),
  isPublic: z.boolean().default(true),
  allowComments: z.boolean().default(true),
  allowGifts: z.boolean().default(true),
});

export const LiveSessionUpdateSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must not exceed 200 characters")
    .optional(),
  description: z
    .string()
    .max(2000, "Description must not exceed 2000 characters")
    .optional(),
  status: LiveSessionStatusEnum.optional(),
  endTime: z.coerce.date().optional(),
  streamUrl: z.string().url("Invalid stream URL").optional(),
  thumbnail: z.string().url("Invalid thumbnail URL").optional(),
  tags: z.array(z.string()).max(10, "Maximum 10 tags allowed").optional(),
  allowComments: z.boolean().optional(),
  allowGifts: z.boolean().optional(),
});

export const LiveSessionQuerySchema = z.object({
  status: LiveSessionStatusEnum.optional(),
  vendorId: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["createdAt", "startTime", "viewerCount"]).default("startTime"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// ============================================================================
// LIVE PRODUCT SCHEMAS
// ============================================================================

export const LiveProductSchema = z.object({
  productId: z.string().cuid("Invalid product ID"),
  specialPrice: z
    .number()
    .positive("Special price must be positive")
    .optional(),
  stockLimit: z
    .number()
    .int()
    .positive("Stock limit must be positive")
    .optional(),
});

export const LiveProductUpdateSchema = z.object({
  specialPrice: z
    .number()
    .positive("Special price must be positive")
    .optional(),
  stockLimit: z
    .number()
    .int()
    .positive("Stock limit must be positive")
    .optional(),
});

// ============================================================================
// CHAT MESSAGE SCHEMAS
// ============================================================================

export const ChatMessageSchema = z.object({
  message: z
    .string()
    .min(1, "Message cannot be empty")
    .max(500, "Message must not exceed 500 characters"),
  type: z.enum(["text", "emoji", "gift"]).default("text"),
});

export const ChatMessageQuerySchema = z.object({
  sessionId: z.string().cuid("Invalid session ID"),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export const ChatModerationSchema = z.object({
  messageId: z.string().cuid("Invalid message ID"),
  action: z.enum(["approve", "reject", "delete"]),
  reason: z.string().optional(),
});

// ============================================================================
// FLASH SALE SCHEMAS
// ============================================================================

export const FlashSaleCreationSchema = z.object({
  productId: z.string().cuid("Invalid product ID"),
  discountPercent: z
    .number()
    .min(1, "Discount must be at least 1%")
    .max(99, "Discount cannot exceed 99%"),
  specialPrice: z
    .number()
    .positive("Special price must be positive")
    .optional(),
  stockLimit: z
    .number()
    .int()
    .positive("Stock limit must be positive"),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  description: z.string().max(500, "Description must not exceed 500 characters").optional(),
});

export const FlashSaleUpdateSchema = z.object({
  discountPercent: z
    .number()
    .min(1, "Discount must be at least 1%")
    .max(99, "Discount cannot exceed 99%")
    .optional(),
  specialPrice: z
    .number()
    .positive("Special price must be positive")
    .optional(),
  stockLimit: z
    .number()
    .int()
    .positive("Stock limit must be positive")
    .optional(),
  status: FlashSaleStatusEnum.optional(),
  description: z.string().max(500, "Description must not exceed 500 characters").optional(),
});

// ============================================================================
// VIEWER SCHEMAS
// ============================================================================

export const ViewerJoinSchema = z.object({
  sessionId: z.string().cuid("Invalid session ID"),
});

export const ViewerLeaveSchema = z.object({
  sessionId: z.string().cuid("Invalid session ID"),
});

export const GiftSchema = z.object({
  giftType: z.enum(["heart", "star", "diamond", "rose", "crown"]),
  quantity: z.number().int().positive().max(100, "Maximum 100 gifts per action"),
  amount: z.number().positive("Amount must be positive"),
});

// ============================================================================
// SOCIAL MEDIA SCHEMAS
// ============================================================================

export const SocialShareSchema = z.object({
  platform: z.enum(["facebook", "twitter", "tiktok", "instagram", "whatsapp"]),
  message: z.string().max(500, "Message must not exceed 500 characters").optional(),
});

export const SocialLinkSchema = z.object({
  platform: z.enum(["facebook", "twitter", "tiktok", "instagram", "youtube"]),
  url: z.string().url("Invalid URL"),
});

// ============================================================================
// RECORDING SCHEMAS
// ============================================================================

export const RecordingStartSchema = z.object({
  sessionId: z.string().cuid("Invalid session ID"),
  quality: z.enum(["720p", "1080p", "4k"]).default("1080p"),
});

export const RecordingStopSchema = z.object({
  sessionId: z.string().cuid("Invalid session ID"),
});

export const ReplayQuerySchema = z.object({
  vendorId: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["createdAt", "viewCount"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// ============================================================================
// EXPORT TYPES
// ============================================================================

export type LiveSessionCreation = z.infer<typeof LiveSessionCreationSchema>;
export type LiveSessionUpdate = z.infer<typeof LiveSessionUpdateSchema>;
export type LiveSessionQuery = z.infer<typeof LiveSessionQuerySchema>;
export type LiveProduct = z.infer<typeof LiveProductSchema>;
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type ChatMessageQuery = z.infer<typeof ChatMessageQuerySchema>;
export type ChatModeration = z.infer<typeof ChatModerationSchema>;
export type FlashSaleCreation = z.infer<typeof FlashSaleCreationSchema>;
export type FlashSaleUpdate = z.infer<typeof FlashSaleUpdateSchema>;
export type ViewerJoin = z.infer<typeof ViewerJoinSchema>;
export type Gift = z.infer<typeof GiftSchema>;
export type SocialShare = z.infer<typeof SocialShareSchema>;
export type SocialLink = z.infer<typeof SocialLinkSchema>;
export type RecordingStart = z.infer<typeof RecordingStartSchema>;
export type ReplayQuery = z.infer<typeof ReplayQuerySchema>;

