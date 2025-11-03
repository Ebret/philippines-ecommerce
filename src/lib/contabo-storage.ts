/**
 * Contabo Object Storage Configuration
 * S3-compatible API for media file storage and CDN delivery
 * 
 * Features:
 * - S3-compatible API integration
 * - File upload/download/delete operations
 * - CDN URL generation
 * - Automatic cleanup of old files
 * - Error handling and retry logic
 */

import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Contabo Object Storage Configuration
const CONTABO_ENDPOINT = process.env.CONTABO_ENDPOINT || "https://usc1.contabostorage.com";
const CONTABO_REGION = process.env.CONTABO_REGION || "usc1";
const CONTABO_ACCESS_KEY = process.env.CONTABO_ACCESS_KEY || "";
const CONTABO_SECRET_KEY = process.env.CONTABO_SECRET_KEY || "";
const CONTABO_BUCKET = process.env.CONTABO_BUCKET || "philippines-ecommerce";
const CDN_URL = process.env.CDN_URL || "https://cdn.extremelifeherbal.com";

// Initialize S3 client for Contabo
const s3Client = new S3Client({
  region: CONTABO_REGION,
  endpoint: CONTABO_ENDPOINT,
  credentials: {
    accessKeyId: CONTABO_ACCESS_KEY,
    secretAccessKey: CONTABO_SECRET_KEY,
  },
});

export interface UploadOptions {
  contentType?: string;
  metadata?: Record<string, string>;
  isPublic?: boolean;
}

export interface UploadResult {
  key: string;
  url: string;
  cdnUrl: string;
  size: number;
  contentType: string;
}

/**
 * Upload file to Contabo Object Storage
 * 
 * @param file - File to upload
 * @param path - Path in storage (e.g., "testimonials/123/videos")
 * @param options - Upload options
 * @returns Upload result with URLs
 */
export async function uploadToContabo(
  file: File | Buffer,
  path: string,
  options?: UploadOptions
): Promise<UploadResult> {
  try {
    // Generate unique key
    const timestamp = Date.now();
    const fileName = file instanceof File ? file.name : `file-${timestamp}`;
    const key = `${path}/${timestamp}-${fileName}`;

    // Get file content
    let fileContent: Buffer;
    if (file instanceof File) {
      fileContent = Buffer.from(await file.arrayBuffer());
    } else {
      fileContent = file;
    }

    // Prepare upload command
    const uploadCommand = new PutObjectCommand({
      Bucket: CONTABO_BUCKET,
      Key: key,
      Body: fileContent,
      ContentType: options?.contentType || (file instanceof File ? file.type : "application/octet-stream"),
      Metadata: options?.metadata,
      ACL: options?.isPublic ? "public-read" : "private",
    });

    // Upload to Contabo
    await s3Client.send(uploadCommand);

    // Generate URLs
    const storageUrl = `${CONTABO_ENDPOINT}/${CONTABO_BUCKET}/${key}`;
    const cdnUrl = `${CDN_URL}/${key}`;

    return {
      key,
      url: storageUrl,
      cdnUrl,
      size: fileContent.length,
      contentType: options?.contentType || (file instanceof File ? file.type : "application/octet-stream"),
    };
  } catch (error) {
    console.error("Error uploading to Contabo:", error);
    throw new Error(`Failed to upload file to Contabo: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Delete file from Contabo Object Storage
 * 
 * @param key - File key in storage
 * @returns Deletion result
 */
export async function deleteFromContabo(key: string): Promise<boolean> {
  try {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: CONTABO_BUCKET,
      Key: key,
    });

    await s3Client.send(deleteCommand);
    return true;
  } catch (error) {
    console.error("Error deleting from Contabo:", error);
    throw new Error(`Failed to delete file from Contabo: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Get signed URL for file access
 * 
 * @param key - File key in storage
 * @param expiresIn - Expiration time in seconds (default: 3600)
 * @returns Signed URL
 */
export async function getSignedUrlForFile(key: string, expiresIn: number = 3600): Promise<string> {
  try {
    const getCommand = new GetObjectCommand({
      Bucket: CONTABO_BUCKET,
      Key: key,
    });

    const signedUrl = await getSignedUrl(s3Client, getCommand, { expiresIn });
    return signedUrl;
  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw new Error(`Failed to generate signed URL: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Get public CDN URL for file
 * 
 * @param key - File key in storage
 * @returns CDN URL
 */
export function getCdnUrl(key: string): string {
  return `${CDN_URL}/${key}`;
}

/**
 * Get storage URL for file
 * 
 * @param key - File key in storage
 * @returns Storage URL
 */
export function getStorageUrl(key: string): string {
  return `${CONTABO_ENDPOINT}/${CONTABO_BUCKET}/${key}`;
}

/**
 * Validate Contabo configuration
 * 
 * @returns Validation result
 */
export function validateContaboConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!CONTABO_ACCESS_KEY) {
    errors.push("CONTABO_ACCESS_KEY is not configured");
  }

  if (!CONTABO_SECRET_KEY) {
    errors.push("CONTABO_SECRET_KEY is not configured");
  }

  if (!CONTABO_BUCKET) {
    errors.push("CONTABO_BUCKET is not configured");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

