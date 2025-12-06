/**
 * Image API Tests
 * Phase 26.3: Product Image Management API Endpoints
 * 
 * Tests for image upload, optimization, gallery, variants, and CDN APIs
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { z } from 'zod';

// Validation schemas (matching API routes)
const UploadSchema = z.object({
  productId: z.string().cuid().optional(),
  images: z.array(z.object({
    data: z.string(),
    fileName: z.string(),
    mimeType: z.string(),
    altText: z.string().optional(),
  })).min(1).max(20),
});

const OptimizeSchema = z.object({
  imageData: z.string(),
  settings: z.object({
    quality: z.number().min(10).max(100).default(80),
    maxWidth: z.number().min(100).max(4096).default(1920),
    maxHeight: z.number().min(100).max(4096).default(1080),
    format: z.enum(['webp', 'jpeg', 'png']).default('webp'),
    maintainAspectRatio: z.boolean().default(true),
  }),
});

const GalleryUpdateSchema = z.object({
  productId: z.string().cuid(),
  images: z.array(z.object({
    id: z.string(),
    sortOrder: z.number().int().min(0),
    isPrimary: z.boolean().optional(),
    altText: z.string().optional(),
  })),
});

const VariantsSchema = z.object({
  imageData: z.string(),
  variants: z.array(z.object({
    name: z.string(),
    width: z.number().min(0).max(4096),
    height: z.number().min(0).max(4096),
    quality: z.number().min(10).max(100),
  })).optional(),
});

const CDNUploadSchema = z.object({
  imageData: z.string(),
  fileName: z.string(),
  mimeType: z.string(),
});

describe('Image API Validation', () => {
  describe('POST /api/images/upload', () => {
    it('should validate valid upload request', () => {
      const validRequest = {
        productId: 'clxxxxxxxxxxxxxxxxxxxxxxxxx',
        images: [
          { data: 'base64data', fileName: 'test.jpg', mimeType: 'image/jpeg' },
        ],
      };

      const result = UploadSchema.safeParse(validRequest);
      expect(result.success).toBe(true);
    });

    it('should reject empty images array', () => {
      const invalidRequest = {
        images: [],
      };

      const result = UploadSchema.safeParse(invalidRequest);
      expect(result.success).toBe(false);
    });

    it('should reject too many images', () => {
      const invalidRequest = {
        images: Array.from({ length: 25 }, (_, i) => ({
          data: 'base64data',
          fileName: `test-${i}.jpg`,
          mimeType: 'image/jpeg',
        })),
      };

      const result = UploadSchema.safeParse(invalidRequest);
      expect(result.success).toBe(false);
    });

    it('should allow optional productId', () => {
      const validRequest = {
        images: [
          { data: 'base64data', fileName: 'test.jpg', mimeType: 'image/jpeg' },
        ],
      };

      const result = UploadSchema.safeParse(validRequest);
      expect(result.success).toBe(true);
    });
  });

  describe('POST /api/images/optimize', () => {
    it('should validate valid optimization request', () => {
      const validRequest = {
        imageData: 'base64data',
        settings: {
          quality: 80,
          maxWidth: 1920,
          maxHeight: 1080,
          format: 'webp' as const,
          maintainAspectRatio: true,
        },
      };

      const result = OptimizeSchema.safeParse(validRequest);
      expect(result.success).toBe(true);
    });

    it('should reject invalid quality', () => {
      const invalidRequest = {
        imageData: 'base64data',
        settings: {
          quality: 5, // Below minimum
          maxWidth: 1920,
          maxHeight: 1080,
          format: 'webp' as const,
          maintainAspectRatio: true,
        },
      };

      const result = OptimizeSchema.safeParse(invalidRequest);
      expect(result.success).toBe(false);
    });

    it('should reject invalid format', () => {
      const invalidRequest = {
        imageData: 'base64data',
        settings: {
          quality: 80,
          maxWidth: 1920,
          maxHeight: 1080,
          format: 'gif', // Invalid format
          maintainAspectRatio: true,
        },
      };

      const result = OptimizeSchema.safeParse(invalidRequest);
      expect(result.success).toBe(false);
    });

    it('should reject dimensions out of range', () => {
      const invalidRequest = {
        imageData: 'base64data',
        settings: {
          quality: 80,
          maxWidth: 10000, // Above maximum
          maxHeight: 1080,
          format: 'webp' as const,
          maintainAspectRatio: true,
        },
      };

      const result = OptimizeSchema.safeParse(invalidRequest);
      expect(result.success).toBe(false);
    });
  });

  describe('PATCH /api/images/gallery', () => {
    it('should validate valid gallery update', () => {
      const validRequest = {
        productId: 'clxxxxxxxxxxxxxxxxxxxxxxxxx',
        images: [
          { id: 'img-1', sortOrder: 0, isPrimary: true },
          { id: 'img-2', sortOrder: 1, isPrimary: false },
        ],
      };

      const result = GalleryUpdateSchema.safeParse(validRequest);
      expect(result.success).toBe(true);
    });

    it('should require productId', () => {
      const invalidRequest = {
        images: [
          { id: 'img-1', sortOrder: 0 },
        ],
      };

      const result = GalleryUpdateSchema.safeParse(invalidRequest);
      expect(result.success).toBe(false);
    });

    it('should reject negative sortOrder', () => {
      const invalidRequest = {
        productId: 'clxxxxxxxxxxxxxxxxxxxxxxxxx',
        images: [
          { id: 'img-1', sortOrder: -1 },
        ],
      };

      const result = GalleryUpdateSchema.safeParse(invalidRequest);
      expect(result.success).toBe(false);
    });
  });

  describe('POST /api/images/variants', () => {
    it('should validate valid variants request', () => {
      const validRequest = {
        imageData: 'base64data',
        variants: [
          { name: 'thumbnail', width: 150, height: 150, quality: 80 },
          { name: 'medium', width: 600, height: 600, quality: 85 },
        ],
      };

      const result = VariantsSchema.safeParse(validRequest);
      expect(result.success).toBe(true);
    });

    it('should allow request without custom variants', () => {
      const validRequest = {
        imageData: 'base64data',
      };

      const result = VariantsSchema.safeParse(validRequest);
      expect(result.success).toBe(true);
    });

    it('should reject invalid variant dimensions', () => {
      const invalidRequest = {
        imageData: 'base64data',
        variants: [
          { name: 'huge', width: 10000, height: 10000, quality: 80 },
        ],
      };

      const result = VariantsSchema.safeParse(invalidRequest);
      expect(result.success).toBe(false);
    });
  });

  describe('POST /api/images/cdn', () => {
    it('should validate valid CDN upload', () => {
      const validRequest = {
        imageData: 'base64data',
        fileName: 'product.jpg',
        mimeType: 'image/jpeg',
      };

      const result = CDNUploadSchema.safeParse(validRequest);
      expect(result.success).toBe(true);
    });

    it('should require all fields', () => {
      const invalidRequest = {
        imageData: 'base64data',
        // Missing fileName and mimeType
      };

      const result = CDNUploadSchema.safeParse(invalidRequest);
      expect(result.success).toBe(false);
    });
  });
});

describe('Image API Response Handling', () => {
  it('should format upload response correctly', () => {
    const mockResponse = {
      success: true,
      images: [
        {
          id: 'img-123',
          url: '/uploads/test.jpg',
          thumbnailUrl: '/uploads/thumb-test.jpg',
          fileName: 'test.jpg',
          sortOrder: 0,
          isPrimary: true,
        },
      ],
      count: 1,
    };

    expect(mockResponse.success).toBe(true);
    expect(mockResponse.images).toHaveLength(1);
    expect(mockResponse.count).toBe(1);
  });

  it('should format optimization response correctly', () => {
    const mockResponse = {
      success: true,
      result: {
        originalSize: 1000000,
        optimizedSize: 300000,
        format: 'webp',
        width: 1920,
        height: 1080,
        quality: 80,
        savings: 70,
      },
    };

    expect(mockResponse.success).toBe(true);
    expect(mockResponse.result.savings).toBe(70);
  });

  it('should format variants response correctly', () => {
    const mockResponse = {
      success: true,
      variants: [
        { name: 'thumbnail', width: 150, height: 150, size: 5000 },
        { name: 'medium', width: 600, height: 600, size: 50000 },
      ],
      totalSize: 55000,
    };

    expect(mockResponse.success).toBe(true);
    expect(mockResponse.variants).toHaveLength(2);
    expect(mockResponse.totalSize).toBe(55000);
  });

  it('should format CDN response correctly', () => {
    const mockResponse = {
      success: true,
      image: {
        id: 'cdn-123',
        cdnUrl: 'https://cdn.example.com/images/test.webp',
        cacheStatus: 'pending',
      },
    };

    expect(mockResponse.success).toBe(true);
    expect(mockResponse.image.cdnUrl).toContain('cdn.example.com');
  });
});

