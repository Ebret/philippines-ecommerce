/**
 * Media Processor Utility
 * Handles video and photo processing for testimonials
 *
 * Features:
 * - Video transcoding to multiple resolutions using FFmpeg
 * - Photo compression and optimization using Sharp
 * - Thumbnail generation
 * - Metadata extraction
 * - Contabo Object Storage upload
 */

import sharp from "sharp";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";
import os from "os";
import { uploadToContabo, getCdnUrl, deleteFromContabo } from "./contabo-storage";

export interface ProcessedVideo {
  originalUrl: string;
  cdnUrl: string;
  thumbnailUrl: string;
  resolutions: {
    "360p": string;
    "720p": string;
    "1080p": string;
  };
  duration: number;
  fileSize: number;
  mimeType: string;
  width: number;
  height: number;
}

export interface ProcessedPhoto {
  originalUrl: string;
  cdnUrl: string;
  webpUrl: string;
  thumbnailUrl: string;
  fileSize: number;
  mimeType: string;
  width: number;
  height: number;
}

export interface MediaMetadata {
  type: "video" | "photo";
  duration?: number;
  width?: number;
  height?: number;
  fileSize: number;
  mimeType: string;
}

/**
 * Helper function to get FFmpeg path
 */
function getFFmpegPath(): string {
  // Try to find FFmpeg in system PATH
  const ffmpegPath = process.env.FFMPEG_PATH || "ffmpeg";
  return ffmpegPath;
}

/**
 * Helper function to save file temporarily
 */
async function saveFileTemporarily(file: File): Promise<string> {
  const tempDir = os.tmpdir();
  const tempPath = path.join(tempDir, `${Date.now()}-${file.name}`);
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(tempPath, buffer);
  return tempPath;
}

/**
 * Extract video metadata using FFmpeg
 */
function getVideoMetadata(filePath: string): Promise<{ duration: number; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        const stream = metadata.streams.find((s: any) => s.codec_type === "video");
        resolve({
          duration: metadata.format.duration || 0,
          width: stream?.width || 1920,
          height: stream?.height || 1080,
        });
      }
    });
  });
}

/**
 * Process video file for testimonials
 *
 * @param file - Video file to process
 * @param options - Processing options
 * @returns Processed video with multiple resolutions
 */
export async function processVideo(
  file: File,
  options?: {
    maxFileSize?: number;
    allowedFormats?: string[];
  }
): Promise<ProcessedVideo> {
  const maxFileSize = options?.maxFileSize || 500 * 1024 * 1024; // 500MB
  const allowedFormats = options?.allowedFormats || ["video/mp4", "video/webm", "video/quicktime"];

  // Validate file
  if (file.size > maxFileSize) {
    throw new Error(`Video file size exceeds maximum of ${maxFileSize / 1024 / 1024}MB`);
  }

  if (!allowedFormats.includes(file.type)) {
    throw new Error(`Video format not supported. Allowed formats: ${allowedFormats.join(", ")}`);
  }

  let tempInputPath: string | null = null;
  const tempOutputPaths: string[] = [];

  try {
    // Save file temporarily
    tempInputPath = await saveFileTemporarily(file);

    // Extract metadata
    const metadata = await getVideoMetadata(tempInputPath);

    // Upload original video
    const originalUpload = await uploadToContabo(file, "testimonials/videos/originals", {
      contentType: file.type,
      isPublic: true,
    });

    // Generate thumbnail
    const tempThumbnailPath = path.join(os.tmpdir(), `${Date.now()}-thumbnail.jpg`);
    tempOutputPaths.push(tempThumbnailPath);

    await new Promise<void>((resolve, reject) => {
      ffmpeg(tempInputPath!)
        .screenshots({
          timestamps: ["5"],
          filename: path.basename(tempThumbnailPath),
          folder: path.dirname(tempThumbnailPath),
          size: "320x180",
        })
        .on("end", () => resolve())
        .on("error", reject);
    });

    const thumbnailBuffer = fs.readFileSync(tempThumbnailPath);
    const thumbnailUpload = await uploadToContabo(thumbnailBuffer, "testimonials/videos/thumbnails", {
      contentType: "image/jpeg",
      isPublic: true,
    });

    // Process resolutions (360p, 720p, 1080p)
    const resolutions: { "360p": string; "720p": string; "1080p": string } = {
      "360p": "",
      "720p": "",
      "1080p": "",
    };

    const resolutionConfigs = [
      { name: "360p", scale: "640:360" },
      { name: "720p", scale: "1280:720" },
      { name: "1080p", scale: "1920:1080" },
    ];

    for (const config of resolutionConfigs) {
      const tempOutputPath = path.join(os.tmpdir(), `${Date.now()}-${config.name}.mp4`);
      tempOutputPaths.push(tempOutputPath);

      await new Promise<void>((resolve, reject) => {
        ffmpeg(tempInputPath!)
          .output(tempOutputPath)
          .videoCodec("libx264")
          .audioCodec("aac")
          .size(config.scale)
          .on("end", () => resolve())
          .on("error", reject)
          .run();
      });

      const outputBuffer = fs.readFileSync(tempOutputPath);
      const outputUpload = await uploadToContabo(outputBuffer, `testimonials/videos/${config.name}`, {
        contentType: "video/mp4",
        isPublic: true,
      });

      resolutions[config.name as keyof typeof resolutions] = outputUpload.cdnUrl;
    }

    return {
      originalUrl: originalUpload.url,
      cdnUrl: originalUpload.cdnUrl,
      thumbnailUrl: thumbnailUpload.cdnUrl,
      resolutions,
      duration: metadata.duration,
      fileSize: file.size,
      mimeType: file.type,
      width: metadata.width,
      height: metadata.height,
    };
  } finally {
    // Cleanup temporary files
    if (tempInputPath && fs.existsSync(tempInputPath)) {
      fs.unlinkSync(tempInputPath);
    }
    for (const tempPath of tempOutputPaths) {
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
    }
  }
}

/**
 * Process photo file for testimonials
 *
 * @param file - Photo file to process
 * @param options - Processing options
 * @returns Processed photo with optimized versions
 */
export async function processPhoto(
  file: File,
  options?: {
    maxFileSize?: number;
    allowedFormats?: string[];
    maxWidth?: number;
    maxHeight?: number;
  }
): Promise<ProcessedPhoto> {
  const maxFileSize = options?.maxFileSize || 10 * 1024 * 1024; // 10MB
  const allowedFormats = options?.allowedFormats || ["image/jpeg", "image/png", "image/webp"];
  const maxWidth = options?.maxWidth || 4000;
  const maxHeight = options?.maxHeight || 4000;

  // Validate file
  if (file.size > maxFileSize) {
    throw new Error(`Photo file size exceeds maximum of ${maxFileSize / 1024 / 1024}MB`);
  }

  if (!allowedFormats.includes(file.type)) {
    throw new Error(`Photo format not supported. Allowed formats: ${allowedFormats.join(", ")}`);
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    // Get image metadata
    const metadata = await sharp(buffer).metadata();
    const width = metadata.width || 1920;
    const height = metadata.height || 1080;

    // Upload original photo
    const originalUpload = await uploadToContabo(buffer, "testimonials/photos/originals", {
      contentType: file.type,
      isPublic: true,
    });

    // Create WebP version (optimized for web)
    const webpBuffer = await sharp(buffer)
      .resize(Math.min(width, maxWidth), Math.min(height, maxHeight), {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toBuffer();

    const webpUpload = await uploadToContabo(webpBuffer, "testimonials/photos/webp", {
      contentType: "image/webp",
      isPublic: true,
    });

    // Create thumbnail
    const thumbnailBuffer = await sharp(buffer)
      .resize(320, 180, {
        fit: "cover",
        position: "center",
      })
      .jpeg({ quality: 80 })
      .toBuffer();

    const thumbnailUpload = await uploadToContabo(thumbnailBuffer, "testimonials/photos/thumbnails", {
      contentType: "image/jpeg",
      isPublic: true,
    });

    return {
      originalUrl: originalUpload.url,
      cdnUrl: originalUpload.cdnUrl,
      webpUrl: webpUpload.cdnUrl,
      thumbnailUrl: thumbnailUpload.cdnUrl,
      fileSize: file.size,
      mimeType: file.type,
      width,
      height,
    };
  } catch (error) {
    throw new Error(`Failed to process photo: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Extract metadata from media file
 *
 * @param file - Media file
 * @returns Extracted metadata
 */
export async function extractMediaMetadata(file: File): Promise<MediaMetadata> {
  const isVideo = file.type.startsWith("video/");
  const isPhoto = file.type.startsWith("image/");

  if (!isVideo && !isPhoto) {
    throw new Error("File must be a video or photo");
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    if (isVideo) {
      const tempPath = path.join(os.tmpdir(), `${Date.now()}-${file.name}`);
      fs.writeFileSync(tempPath, buffer);

      try {
        const metadata = await getVideoMetadata(tempPath);
        return {
          type: "video",
          duration: metadata.duration,
          width: metadata.width,
          height: metadata.height,
          fileSize: file.size,
          mimeType: file.type,
        };
      } finally {
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath);
        }
      }
    } else {
      const metadata = await sharp(buffer).metadata();
      return {
        type: "photo",
        width: metadata.width,
        height: metadata.height,
        fileSize: file.size,
        mimeType: file.type,
      };
    }
  } catch (error) {
    throw new Error(`Failed to extract metadata: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Generate thumbnail from video
 *
 * @param videoUrl - URL of the video
 * @param timestamp - Timestamp in seconds to extract thumbnail from
 * @returns Thumbnail URL
 */
export async function generateVideoThumbnail(
  videoUrl: string,
  timestamp: number = 5
): Promise<string> {
  // Note: This function generates a thumbnail from a local file path
  // For CDN URLs, use the pre-generated thumbnail from processVideo
  try {
    const tempOutputPath = path.join(os.tmpdir(), `${Date.now()}-thumbnail.jpg`);

    await new Promise<void>((resolve, reject) => {
      ffmpeg(videoUrl)
        .screenshots({
          timestamps: [timestamp.toString()],
          filename: path.basename(tempOutputPath),
          folder: path.dirname(tempOutputPath),
          size: "320x180",
        })
        .on("end", () => resolve())
        .on("error", reject);
    });

    const thumbnailBuffer = fs.readFileSync(tempOutputPath);
    const upload = await uploadToContabo(thumbnailBuffer, "testimonials/videos/thumbnails", {
      contentType: "image/jpeg",
      isPublic: true,
    });

    if (fs.existsSync(tempOutputPath)) {
      fs.unlinkSync(tempOutputPath);
    }

    return upload.cdnUrl;
  } catch (error) {
    throw new Error(`Failed to generate thumbnail: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Validate media file before processing
 * 
 * @param file - File to validate
 * @param mediaType - Expected media type
 * @returns Validation result
 */
export function validateMediaFile(
  file: File,
  mediaType: "video" | "photo"
): { valid: boolean; error?: string } {
  if (mediaType === "video") {
    const allowedFormats = ["video/mp4", "video/webm", "video/quicktime"];
    const maxSize = 500 * 1024 * 1024; // 500MB

    if (!allowedFormats.includes(file.type)) {
      return {
        valid: false,
        error: `Invalid video format. Allowed: ${allowedFormats.join(", ")}`,
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: `Video file too large. Maximum size: ${maxSize / 1024 / 1024}MB`,
      };
    }
  } else if (mediaType === "photo") {
    const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedFormats.includes(file.type)) {
      return {
        valid: false,
        error: `Invalid photo format. Allowed: ${allowedFormats.join(", ")}`,
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: `Photo file too large. Maximum size: ${maxSize / 1024 / 1024}MB`,
      };
    }
  }

  return { valid: true };
}

/**
 * Upload media to CDN (Contabo Object Storage)
 *
 * @param file - File to upload
 * @param path - Path in CDN
 * @returns CDN URL
 */
export async function uploadMediaToCDN(
  file: File,
  path: string
): Promise<string> {
  try {
    const upload = await uploadToContabo(file, path, {
      contentType: file.type,
      isPublic: true,
    });
    return upload.cdnUrl;
  } catch (error) {
    throw new Error(`Failed to upload media to CDN: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Delete media from CDN (Contabo Object Storage)
 *
 * @param mediaUrl - URL of media to delete
 * @returns Deletion result
 */
export async function deleteMediaFromCDN(mediaUrl: string): Promise<boolean> {
  try {
    // Extract key from CDN URL
    // CDN URL format: https://cdn.extremelifeherbal.com/path/to/file
    const urlObj = new URL(mediaUrl);
    const key = urlObj.pathname.substring(1); // Remove leading slash

    await deleteFromContabo(key);
    return true;
  } catch (error) {
    console.error("Failed to delete media from CDN:", error);
    return false;
  }
}

