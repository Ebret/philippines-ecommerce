import { describe, it, expect } from "vitest";
import {
  TestimonialCreationSchema,
  TestimonialUpdateSchema,
  TestimonialQuerySchema,
  TestimonialModerationSchema,
  MediaUploadSchema,
  TestimonialVoteSchema,
  VendorTestimonialDashboardSchema,
} from "@/lib/validations/testimonials";

describe("Testimonial Validation Schemas", () => {
  describe("TestimonialCreationSchema", () => {
    it("should validate correct testimonial creation data", () => {
      const data = {
        productId: "clh1234567890abcdefghijkl",
        rating: 5,
        title: "Amazing product!",
        content: "This product exceeded my expectations. Highly recommended!",
        mediaUrls: ["https://example.com/photo.jpg"],
        isAnonymous: false,
      };

      const result = TestimonialCreationSchema.parse(data);
      expect(result).toEqual(data);
    });

    it("should fail with invalid product ID", () => {
      const data = {
        productId: "invalid-id",
        rating: 5,
        title: "Amazing product!",
        content: "This product exceeded my expectations. Highly recommended!",
      };

      expect(() => TestimonialCreationSchema.parse(data)).toThrow();
    });

    it("should fail with rating out of range", () => {
      const data = {
        productId: "clh1234567890abcdefghijkl",
        rating: 6,
        title: "Amazing product!",
        content: "This product exceeded my expectations. Highly recommended!",
      };

      expect(() => TestimonialCreationSchema.parse(data)).toThrow();
    });

    it("should fail with title too short", () => {
      const data = {
        productId: "clh1234567890abcdefghijkl",
        rating: 5,
        title: "Good",
        content: "This product exceeded my expectations. Highly recommended!",
      };

      expect(() => TestimonialCreationSchema.parse(data)).toThrow();
    });

    it("should fail with content too short", () => {
      const data = {
        productId: "clh1234567890abcdefghijkl",
        rating: 5,
        title: "Amazing product!",
        content: "Good",
      };

      expect(() => TestimonialCreationSchema.parse(data)).toThrow();
    });

    it("should set default values for optional fields", () => {
      const data = {
        productId: "clh1234567890abcdefghijkl",
        rating: 5,
        title: "Amazing product!",
        content: "This product exceeded my expectations. Highly recommended!",
      };

      const result = TestimonialCreationSchema.parse(data);
      expect(result.mediaUrls).toEqual([]);
      expect(result.isAnonymous).toBe(false);
    });
  });

  describe("TestimonialUpdateSchema", () => {
    it("should validate partial update data", () => {
      const data = {
        rating: 4,
        title: "Updated title",
      };

      const result = TestimonialUpdateSchema.parse(data);
      expect(result).toEqual(data);
    });

    it("should allow empty update", () => {
      const data = {};
      const result = TestimonialUpdateSchema.parse(data);
      expect(result).toEqual({});
    });

    it("should fail with invalid rating", () => {
      const data = {
        rating: 10,
      };

      expect(() => TestimonialUpdateSchema.parse(data)).toThrow();
    });
  });

  describe("TestimonialQuerySchema", () => {
    it("should validate query parameters with defaults", () => {
      const data = {};
      const result = TestimonialQuerySchema.parse(data);

      expect(result.sortBy).toBe("createdAt");
      expect(result.sortOrder).toBe("desc");
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it("should validate with all parameters", () => {
      const data = {
        productId: "clh1234567890abcdefghijkl",
        vendorId: "clh1234567890abcdefghijkl",
        status: "APPROVED",
        isFeatured: true,
        minRating: 3,
        maxRating: 5,
        sortBy: "rating",
        sortOrder: "asc",
        page: 2,
        limit: 20,
      };

      const result = TestimonialQuerySchema.parse(data);
      expect(result).toEqual(data);
    });

    it("should fail with invalid sort order", () => {
      const data = {
        sortOrder: "invalid",
      };

      expect(() => TestimonialQuerySchema.parse(data)).toThrow();
    });

    it("should fail with page less than 1", () => {
      const data = {
        page: 0,
      };

      expect(() => TestimonialQuerySchema.parse(data)).toThrow();
    });
  });

  describe("TestimonialModerationSchema", () => {
    it("should validate moderation data", () => {
      const data = {
        status: "APPROVED",
      };

      const result = TestimonialModerationSchema.parse(data);
      expect(result).toEqual(data);
    });

    it("should validate with rejection reason", () => {
      const data = {
        status: "REJECTED",
        rejectionReason: "Inappropriate content",
      };

      const result = TestimonialModerationSchema.parse(data);
      expect(result).toEqual(data);
    });

    it("should fail with invalid status", () => {
      const data = {
        status: "INVALID",
      };

      expect(() => TestimonialModerationSchema.parse(data)).toThrow();
    });
  });

  describe("MediaUploadSchema", () => {
    it("should validate video upload", () => {
      const data = {
        mediaType: "video",
        fileSize: 50000000,
        mimeType: "video/mp4",
        duration: 120,
      };

      const result = MediaUploadSchema.parse(data);
      expect(result).toEqual(data);
    });

    it("should validate photo upload", () => {
      const data = {
        mediaType: "photo",
        fileSize: 5000000,
        mimeType: "image/jpeg",
      };

      const result = MediaUploadSchema.parse(data);
      expect(result).toEqual(data);
    });

    it("should fail with invalid media type", () => {
      const data = {
        mediaType: "audio",
        fileSize: 5000000,
        mimeType: "audio/mp3",
      };

      expect(() => MediaUploadSchema.parse(data)).toThrow();
    });
  });

  describe("TestimonialVoteSchema", () => {
    it("should validate helpful vote", () => {
      const data = {
        voteType: "helpful",
      };

      const result = TestimonialVoteSchema.parse(data);
      expect(result).toEqual(data);
    });

    it("should validate unhelpful vote", () => {
      const data = {
        voteType: "unhelpful",
      };

      const result = TestimonialVoteSchema.parse(data);
      expect(result).toEqual(data);
    });

    it("should fail with invalid vote type", () => {
      const data = {
        voteType: "neutral",
      };

      expect(() => TestimonialVoteSchema.parse(data)).toThrow();
    });
  });

  describe("VendorTestimonialDashboardSchema", () => {
    it("should validate dashboard query with defaults", () => {
      const data = {};
      const result = VendorTestimonialDashboardSchema.parse(data);

      expect(result.timeRange).toBe("30d");
      expect(result.sortBy).toBe("date");
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
    });

    it("should validate with all parameters", () => {
      const data = {
        timeRange: "90d",
        sortBy: "helpful",
        page: 3,
        limit: 50,
      };

      const result = VendorTestimonialDashboardSchema.parse(data);
      expect(result).toEqual(data);
    });

    it("should fail with invalid time range", () => {
      const data = {
        timeRange: "2w",
      };

      expect(() => VendorTestimonialDashboardSchema.parse(data)).toThrow();
    });
  });
});

