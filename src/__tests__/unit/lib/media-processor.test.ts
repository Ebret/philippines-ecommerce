import { describe, it, expect, vi } from "vitest";
import {
  validateMediaFile,
  extractMediaMetadata,
  generateVideoThumbnail,
  uploadMediaToCDN,
  deleteMediaFromCDN,
} from "@/lib/media-processor";

describe("Media Processor", () => {
  describe("validateMediaFile", () => {
    it("should validate correct video file", () => {
      const mockFile = {
        name: "video.mp4",
        type: "video/mp4",
        size: 50000000,
      };
      const result = validateMediaFile(mockFile as any, "video");

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("should validate correct photo file", () => {
      const mockFile = {
        name: "photo.jpg",
        type: "image/jpeg",
        size: 5000000,
      };
      const result = validateMediaFile(mockFile as any, "photo");

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("should reject invalid video format", () => {
      const mockFile = {
        name: "audio.mp3",
        type: "audio/mp3",
        size: 5000000,
      };
      const result = validateMediaFile(mockFile as any, "video");

      expect(result.valid).toBe(false);
      expect(result.error).toContain("Invalid video format");
    });

    it("should reject invalid photo format", () => {
      const mockFile = {
        name: "video.mp4",
        type: "video/mp4",
        size: 50000000,
      };
      const result = validateMediaFile(mockFile as any, "photo");

      expect(result.valid).toBe(false);
      expect(result.error).toContain("Invalid photo format");
    });

    it("should reject oversized video file", () => {
      const mockFile = {
        name: "large.mp4",
        type: "video/mp4",
        size: 600 * 1024 * 1024,
      };
      const result = validateMediaFile(mockFile as any, "video");

      expect(result.valid).toBe(false);
      expect(result.error).toContain("too large");
    });

    it("should reject oversized photo file", () => {
      const mockFile = {
        name: "large.jpg",
        type: "image/jpeg",
        size: 15 * 1024 * 1024,
      };
      const result = validateMediaFile(mockFile as any, "photo");

      expect(result.valid).toBe(false);
      expect(result.error).toContain("too large");
    });

    it("should accept WebM video format", () => {
      const mockFile = {
        name: "video.webm",
        type: "video/webm",
        size: 50000000,
      };
      const result = validateMediaFile(mockFile as any, "video");

      expect(result.valid).toBe(true);
    });

    it("should accept PNG photo format", () => {
      const mockFile = {
        name: "photo.png",
        type: "image/png",
        size: 5000000,
      };
      const result = validateMediaFile(mockFile as any, "photo");

      expect(result.valid).toBe(true);
    });

    it("should accept WebP photo format", () => {
      const mockFile = {
        name: "photo.webp",
        type: "image/webp",
        size: 5000000,
      };
      const result = validateMediaFile(mockFile as any, "photo");

      expect(result.valid).toBe(true);
    });
  });

  describe("extractMediaMetadata", () => {
    it("should extract video metadata", async () => {
      const mockFile = {
        name: "video.mp4",
        type: "video/mp4",
        size: 50000000,
      };
      const metadata = await extractMediaMetadata(mockFile as any);

      expect(metadata.type).toBe("video");
      expect(metadata.duration).toBeDefined();
      expect(metadata.fileSize).toBe(mockFile.size);
      expect(metadata.mimeType).toBe("video/mp4");
    });

    it("should extract photo metadata", async () => {
      const mockFile = {
        name: "photo.jpg",
        type: "image/jpeg",
        size: 5000000,
      };
      const metadata = await extractMediaMetadata(mockFile as any);

      expect(metadata.type).toBe("photo");
      expect(metadata.width).toBeDefined();
      expect(metadata.height).toBeDefined();
      expect(metadata.fileSize).toBe(mockFile.size);
      expect(metadata.mimeType).toBe("image/jpeg");
    });

    it("should reject non-media files", async () => {
      const mockFile = {
        name: "file.txt",
        type: "text/plain",
        size: 1000,
      };

      await expect(extractMediaMetadata(mockFile as any)).rejects.toThrow("must be a video or photo");
    });
  });

  describe("generateVideoThumbnail", () => {
    it("should generate thumbnail URL", async () => {
      const videoUrl = "https://cdn.example.com/video.mp4";
      const thumbnailUrl = await generateVideoThumbnail(videoUrl, 5);

      expect(thumbnailUrl).toContain("thumbnail");
      expect(thumbnailUrl).toContain(videoUrl);
    });

    it("should use default timestamp", async () => {
      const videoUrl = "https://cdn.example.com/video.mp4";
      const thumbnailUrl = await generateVideoThumbnail(videoUrl);

      expect(thumbnailUrl).toBeDefined();
    });
  });

  describe("uploadMediaToCDN", () => {
    it("should upload media to CDN", async () => {
      const mockFile = {
        name: "media.jpg",
        type: "image/jpeg",
        size: 5000000,
      };
      const path = "testimonials/123/photos";
      const url = await uploadMediaToCDN(mockFile as any, path);

      expect(url).toContain("cdn.example.com");
      expect(url).toContain(path);
    });

    it("should include timestamp in URL", async () => {
      const mockFile = {
        name: "media.jpg",
        type: "image/jpeg",
        size: 5000000,
      };
      const url = await uploadMediaToCDN(mockFile as any, "testimonials/123/photos");

      expect(url).toMatch(/\d+/);
    });

    it("should include filename in URL", async () => {
      const mockFile = {
        name: "media.jpg",
        type: "image/jpeg",
        size: 5000000,
      };
      const url = await uploadMediaToCDN(mockFile as any, "testimonials/123/photos");

      expect(url).toContain("media.jpg");
    });
  });

  describe("deleteMediaFromCDN", () => {
    it("should delete media from CDN", async () => {
      const mediaUrl = "https://cdn.example.com/testimonials/123/photos/media.jpg";
      const result = await deleteMediaFromCDN(mediaUrl);

      expect(result).toBe(true);
    });

    it("should handle deletion of non-existent media", async () => {
      const mediaUrl = "https://cdn.example.com/nonexistent.jpg";
      const result = await deleteMediaFromCDN(mediaUrl);

      expect(result).toBe(true);
    });
  });
});

