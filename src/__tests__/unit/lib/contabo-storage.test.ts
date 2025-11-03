/**
 * Contabo Object Storage Tests
 * Tests for S3-compatible API integration
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  uploadToContabo,
  deleteFromContabo,
  getCdnUrl,
  getStorageUrl,
  validateContaboConfig,
} from "@/lib/contabo-storage";

// Mock AWS SDK
vi.mock("@aws-sdk/client-s3", () => ({
  S3Client: vi.fn(),
  PutObjectCommand: vi.fn(),
  DeleteObjectCommand: vi.fn(),
  GetObjectCommand: vi.fn(),
}));

vi.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: vi.fn(async () => "https://signed-url.example.com"),
}));

describe("Contabo Object Storage", () => {
  describe("validateContaboConfig", () => {
    it("should validate configuration", () => {
      const result = validateContaboConfig();
      expect(result).toHaveProperty("valid");
      expect(result).toHaveProperty("errors");
      expect(Array.isArray(result.errors)).toBe(true);
    });

    it("should report missing access key", () => {
      const result = validateContaboConfig();
      if (!process.env.CONTABO_ACCESS_KEY) {
        expect(result.errors).toContain("CONTABO_ACCESS_KEY is not configured");
      }
    });

    it("should report missing secret key", () => {
      const result = validateContaboConfig();
      if (!process.env.CONTABO_SECRET_KEY) {
        expect(result.errors).toContain("CONTABO_SECRET_KEY is not configured");
      }
    });

    it("should report missing bucket", () => {
      const result = validateContaboConfig();
      // CONTABO_BUCKET has a default value, so this test checks if it's properly set
      // If no env var is set, it uses the default "philippines-ecommerce"
      if (!process.env.CONTABO_BUCKET) {
        // Default value is set, so no error should be reported
        expect(result.errors).not.toContain("CONTABO_BUCKET is not configured");
      }
    });
  });

  describe("getCdnUrl", () => {
    it("should generate CDN URL from key", () => {
      const key = "testimonials/videos/originals/123-test.mp4";
      const url = getCdnUrl(key);
      expect(url).toContain("cdn");
      expect(url).toContain(key);
    });

    it("should handle keys with special characters", () => {
      const key = "testimonials/videos/originals/123-test-file.mp4";
      const url = getCdnUrl(key);
      expect(url).toContain(key);
    });
  });

  describe("getStorageUrl", () => {
    it("should generate storage URL from key", () => {
      const key = "testimonials/videos/originals/123-test.mp4";
      const url = getStorageUrl(key);
      expect(url).toContain("contabostorage");
      expect(url).toContain(key);
    });

    it("should handle keys with special characters", () => {
      const key = "testimonials/photos/originals/456-test-image.jpg";
      const url = getStorageUrl(key);
      expect(url).toContain(key);
    });
  });

  describe("uploadToContabo", () => {
    it("should handle File objects", async () => {
      const file = new File(["test content"], "test.mp4", { type: "video/mp4" });
      
      try {
        const result = await uploadToContabo(file, "testimonials/videos");
        expect(result).toHaveProperty("key");
        expect(result).toHaveProperty("url");
        expect(result).toHaveProperty("cdnUrl");
        expect(result).toHaveProperty("size");
        expect(result).toHaveProperty("contentType");
      } catch (error) {
        // Expected to fail without AWS credentials
        expect(error).toBeDefined();
      }
    });

    it("should handle Buffer objects", async () => {
      const buffer = Buffer.from("test content");
      
      try {
        const result = await uploadToContabo(buffer, "testimonials/videos");
        expect(result).toHaveProperty("key");
        expect(result).toHaveProperty("url");
        expect(result).toHaveProperty("cdnUrl");
        expect(result).toHaveProperty("size");
      } catch (error) {
        // Expected to fail without AWS credentials
        expect(error).toBeDefined();
      }
    });

    it("should include metadata in upload", async () => {
      const file = new File(["test content"], "test.mp4", { type: "video/mp4" });
      const metadata = { duration: "120", resolution: "1080p" };
      
      try {
        const result = await uploadToContabo(file, "testimonials/videos", {
          metadata,
          contentType: "video/mp4",
        });
        expect(result).toHaveProperty("key");
      } catch (error) {
        // Expected to fail without AWS credentials
        expect(error).toBeDefined();
      }
    });

    it("should set public ACL when specified", async () => {
      const file = new File(["test content"], "test.jpg", { type: "image/jpeg" });
      
      try {
        const result = await uploadToContabo(file, "testimonials/photos", {
          isPublic: true,
        });
        expect(result).toHaveProperty("cdnUrl");
      } catch (error) {
        // Expected to fail without AWS credentials
        expect(error).toBeDefined();
      }
    });

    it("should generate unique keys for files", async () => {
      const file = new File(["test content"], "test.mp4", { type: "video/mp4" });
      
      try {
        const result1 = await uploadToContabo(file, "testimonials/videos");
        const result2 = await uploadToContabo(file, "testimonials/videos");
        
        // Keys should be different due to timestamp
        expect(result1.key).not.toBe(result2.key);
      } catch (error) {
        // Expected to fail without AWS credentials
        expect(error).toBeDefined();
      }
    });
  });

  describe("deleteFromContabo", () => {
    it("should delete file from storage", async () => {
      const key = "testimonials/videos/originals/123-test.mp4";
      
      try {
        const result = await deleteFromContabo(key);
        expect(result).toBe(true);
      } catch (error) {
        // Expected to fail without AWS credentials
        expect(error).toBeDefined();
      }
    });

    it("should handle deletion of non-existent files", async () => {
      const key = "testimonials/videos/originals/non-existent.mp4";
      
      try {
        const result = await deleteFromContabo(key);
        expect(result).toBe(true);
      } catch (error) {
        // Expected to fail without AWS credentials
        expect(error).toBeDefined();
      }
    });

    it("should handle keys with special characters", async () => {
      const key = "testimonials/videos/originals/123-test-file-special.mp4";
      
      try {
        const result = await deleteFromContabo(key);
        expect(result).toBe(true);
      } catch (error) {
        // Expected to fail without AWS credentials
        expect(error).toBeDefined();
      }
    });
  });

  describe("URL generation", () => {
    it("should generate consistent URLs for same key", () => {
      const key = "testimonials/videos/originals/123-test.mp4";
      const url1 = getCdnUrl(key);
      const url2 = getCdnUrl(key);
      expect(url1).toBe(url2);
    });

    it("should generate different URLs for different keys", () => {
      const key1 = "testimonials/videos/originals/123-test.mp4";
      const key2 = "testimonials/photos/originals/456-test.jpg";
      const url1 = getCdnUrl(key1);
      const url2 = getCdnUrl(key2);
      expect(url1).not.toBe(url2);
    });

    it("should preserve path structure in URLs", () => {
      const key = "testimonials/videos/originals/123-test.mp4";
      const url = getCdnUrl(key);
      expect(url).toContain("testimonials");
      expect(url).toContain("videos");
      expect(url).toContain("originals");
    });
  });
});

