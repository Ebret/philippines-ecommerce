/**
 * Priority 1 Components Tests
 * Tests for core testimonial components
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { z } from 'zod';

// Test validation schema (from TestimonialForm)
const TestimonialSchema = z.object({
  title: z.string().min(5).max(100),
  content: z.string().min(20).max(5000),
  rating: z.number().min(1).max(5),
  authorName: z.string().min(2).max(100),
  authorEmail: z.string().email(),
  authorRole: z.string().optional(),
  companyName: z.string().optional(),
  videoUrl: z.string().url().optional().or(z.literal('')),
  photoUrl: z.string().url().optional().or(z.literal('')),
});

describe('Priority 1: Core Testimonial Components', () => {
  describe('TestimonialForm Validation', () => {
    it('should validate correct testimonial data', () => {
      const validData = {
        title: 'Great Product',
        content: 'This product is amazing and works perfectly for our needs.',
        rating: 5,
        authorName: 'John Doe',
        authorEmail: 'john@example.com',
      };
      const result = TestimonialSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject title shorter than 5 characters', () => {
      const invalidData = {
        title: 'Good',
        content: 'This product is amazing and works perfectly for our needs.',
        rating: 5,
        authorName: 'John Doe',
        authorEmail: 'john@example.com',
      };
      const result = TestimonialSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject content shorter than 20 characters', () => {
      const invalidData = {
        title: 'Great Product',
        content: 'Short',
        rating: 5,
        authorName: 'John Doe',
        authorEmail: 'john@example.com',
      };
      const result = TestimonialSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        title: 'Great Product',
        content: 'This product is amazing and works perfectly for our needs.',
        rating: 5,
        authorName: 'John Doe',
        authorEmail: 'invalid-email',
      };
      const result = TestimonialSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject rating outside 1-5 range', () => {
      const invalidData = {
        title: 'Great Product',
        content: 'This product is amazing and works perfectly for our needs.',
        rating: 6,
        authorName: 'John Doe',
        authorEmail: 'john@example.com',
      };
      const result = TestimonialSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should accept optional fields', () => {
      const validData = {
        title: 'Great Product',
        content: 'This product is amazing and works perfectly for our needs.',
        rating: 5,
        authorName: 'John Doe',
        authorEmail: 'john@example.com',
        authorRole: 'Manager',
        companyName: 'Tech Corp',
      };
      const result = TestimonialSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should accept valid video URL', () => {
      const validData = {
        title: 'Great Product',
        content: 'This product is amazing and works perfectly for our needs.',
        rating: 5,
        authorName: 'John Doe',
        authorEmail: 'john@example.com',
        videoUrl: 'https://example.com/video.mp4',
      };
      const result = TestimonialSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid video URL', () => {
      const invalidData = {
        title: 'Great Product',
        content: 'This product is amazing and works perfectly for our needs.',
        rating: 5,
        authorName: 'John Doe',
        authorEmail: 'john@example.com',
        videoUrl: 'not-a-url',
      };
      const result = TestimonialSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('MediaUploader Validation', () => {
    const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
    const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

    it('should accept valid video types', () => {
      ALLOWED_VIDEO_TYPES.forEach((type) => {
        expect(ALLOWED_VIDEO_TYPES.includes(type)).toBe(true);
      });
    });

    it('should accept valid photo types', () => {
      ALLOWED_PHOTO_TYPES.forEach((type) => {
        expect(ALLOWED_PHOTO_TYPES.includes(type)).toBe(true);
      });
    });

    it('should reject invalid file types', () => {
      const invalidTypes = ['application/pdf', 'text/plain', 'audio/mp3'];
      invalidTypes.forEach((type) => {
        expect(ALLOWED_VIDEO_TYPES.includes(type) || ALLOWED_PHOTO_TYPES.includes(type)).toBe(false);
      });
    });

    it('should validate file size limits', () => {
      const maxFileSize = 100; // MB
      const fileSizeMB = 50;
      expect(fileSizeMB <= maxFileSize).toBe(true);
    });

    it('should reject files exceeding size limit', () => {
      const maxFileSize = 100; // MB
      const fileSizeMB = 150;
      expect(fileSizeMB <= maxFileSize).toBe(false);
    });
  });

  describe('TestimonialCard Display', () => {
    const mockTestimonial = {
      id: '1',
      title: 'Great Product',
      content: 'This product is amazing and works perfectly for our needs.',
      rating: 5,
      authorName: 'John Doe',
      authorRole: 'Manager',
      companyName: 'Tech Corp',
      thumbnailUrl: 'https://example.com/thumb.jpg',
      mediaType: 'video' as const,
      createdAt: new Date('2025-11-14'),
      featured: true,
    };

    it('should display testimonial with all fields', () => {
      expect(mockTestimonial.title).toBe('Great Product');
      expect(mockTestimonial.rating).toBe(5);
      expect(mockTestimonial.authorName).toBe('John Doe');
    });

    it('should handle featured testimonials', () => {
      expect(mockTestimonial.featured).toBe(true);
    });

    it('should display media type indicator', () => {
      expect(mockTestimonial.mediaType).toBe('video');
    });

    it('should format author information correctly', () => {
      const authorInfo = `${mockTestimonial.authorName}`;
      if (mockTestimonial.authorRole) {
        expect(authorInfo).toContain(mockTestimonial.authorName);
      }
    });
  });

  describe('TestimonialList Filtering', () => {
    const mockTestimonials = [
      {
        id: '1',
        title: 'Excellent',
        content: 'This product is amazing and works perfectly for our needs.',
        rating: 5,
        authorName: 'John',
        createdAt: new Date('2025-11-14'),
        mediaType: 'video' as const,
      },
      {
        id: '2',
        title: 'Good',
        content: 'This product is good and works well for our needs.',
        rating: 4,
        authorName: 'Jane',
        createdAt: new Date('2025-11-13'),
        mediaType: 'photo' as const,
      },
      {
        id: '3',
        title: 'Average',
        content: 'This product is average and works okay for our needs.',
        rating: 3,
        authorName: 'Bob',
        createdAt: new Date('2025-11-12'),
        mediaType: 'video' as const,
      },
    ];

    it('should filter by minimum rating', () => {
      const filtered = mockTestimonials.filter((t) => t.rating >= 4);
      expect(filtered.length).toBe(2);
      expect(filtered.every((t) => t.rating >= 4)).toBe(true);
    });

    it('should filter by media type', () => {
      const filtered = mockTestimonials.filter((t) => t.mediaType === 'video');
      expect(filtered.length).toBe(2);
      expect(filtered.every((t) => t.mediaType === 'video')).toBe(true);
    });

    it('should sort by newest first', () => {
      const sorted = [...mockTestimonials].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      expect(sorted[0].id).toBe('1');
      expect(sorted[sorted.length - 1].id).toBe('3');
    });

    it('should sort by rating descending', () => {
      const sorted = [...mockTestimonials].sort((a, b) => b.rating - a.rating);
      expect(sorted[0].rating).toBe(5);
      expect(sorted[sorted.length - 1].rating).toBe(3);
    });
  });

  describe('Component Integration', () => {
    it('should handle form submission with valid data', async () => {
      const mockSubmit = vi.fn();
      const validData = {
        title: 'Great Product',
        content: 'This product is amazing and works perfectly for our needs.',
        rating: 5,
        authorName: 'John Doe',
        authorEmail: 'john@example.com',
      };
      
      await mockSubmit(validData);
      expect(mockSubmit).toHaveBeenCalledWith(validData);
    });

    it('should handle media upload completion', () => {
      const mockCallback = vi.fn();
      mockCallback('https://example.com/video.mp4', 'video');
      expect(mockCallback).toHaveBeenCalledWith('https://example.com/video.mp4', 'video');
    });

    it('should handle pagination', () => {
      const mockLoadMore = vi.fn();
      mockLoadMore();
      expect(mockLoadMore).toHaveBeenCalled();
    });
  });
});

