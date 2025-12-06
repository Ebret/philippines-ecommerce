/**
 * CDNImageManager Component
 * Phase 26.3.6: CDN Integration for Image Management
 * 
 * Features:
 * - Upload images to CDN
 * - Manage CDN-hosted images
 * - Cache invalidation
 * - CDN URL generation
 */

'use client';

import { useState, useCallback } from 'react';
import { 
  Cloud, Upload, Trash2, RefreshCw, Copy, Check, 
  ExternalLink, Loader2, AlertCircle, Globe 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface CDNImage {
  id: string;
  originalUrl: string;
  cdnUrl: string;
  thumbnailUrl?: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  cacheStatus: 'cached' | 'pending' | 'expired';
}

interface CDNImageManagerProps {
  images: CDNImage[];
  onUpload: (file: File) => Promise<CDNImage>;
  onDelete: (imageId: string) => Promise<void>;
  onInvalidateCache: (imageId: string) => Promise<void>;
  className?: string;
}

export function CDNImageManager({
  images,
  onUpload,
  onDelete,
  onInvalidateCache,
  className,
}: CDNImageManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [invalidatingId, setInvalidatingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle file upload
  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      await onUpload(file);

      clearInterval(progressInterval);
      setUploadProgress(100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [onUpload]);

  // Handle delete
  const handleDelete = useCallback(async (imageId: string) => {
    setDeletingId(imageId);
    setError(null);

    try {
      await onDelete(imageId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  }, [onDelete]);

  // Handle cache invalidation
  const handleInvalidateCache = useCallback(async (imageId: string) => {
    setInvalidatingId(imageId);
    setError(null);

    try {
      await onInvalidateCache(imageId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cache invalidation failed');
    } finally {
      setInvalidatingId(null);
    }
  }, [onInvalidateCache]);

  // Copy CDN URL to clipboard
  const copyToClipboard = useCallback(async (imageId: string, url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(imageId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setError('Failed to copy to clipboard');
    }
  }, []);

  // Format file size
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get cache status color
  const getCacheStatusColor = (status: CDNImage['cacheStatus']) => {
    switch (status) {
      case 'cached': return 'text-green-600 dark:text-green-400';
      case 'pending': return 'text-amber-600 dark:text-amber-400';
      case 'expired': return 'text-red-600 dark:text-red-400';
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cloud className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">CDN Image Manager</h3>
          <span className="text-sm text-muted-foreground">({images.length} images)</span>
        </div>
        
        {/* Upload Button */}
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={isUploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Button disabled={isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading {uploadProgress}%
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload to CDN
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
          <button onClick={() => setError(null)} className="ml-auto">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Images Grid */}
      {images.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
          <Globe className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No images uploaded to CDN</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="border border-border rounded-lg overflow-hidden bg-card"
            >
              {/* Image Preview */}
              <div className="aspect-video bg-muted relative">
                <img
                  src={image.thumbnailUrl || image.cdnUrl}
                  alt={image.fileName}
                  className="w-full h-full object-cover"
                />

                {/* Cache Status Badge */}
                <div className={cn(
                  'absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium bg-background/80',
                  getCacheStatusColor(image.cacheStatus)
                )}>
                  {image.cacheStatus}
                </div>
              </div>

              {/* Image Info */}
              <div className="p-3 space-y-3">
                <div>
                  <p className="font-medium truncate" title={image.fileName}>
                    {image.fileName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatSize(image.fileSize)} • {image.mimeType}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Uploaded: {formatDate(image.uploadedAt)}
                  </p>
                </div>

                {/* CDN URL */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={image.cdnUrl}
                    readOnly
                    className="flex-1 px-2 py-1 text-xs rounded border border-border bg-muted truncate"
                  />
                  <button
                    onClick={() => copyToClipboard(image.id, image.cdnUrl)}
                    className="p-1.5 rounded hover:bg-muted"
                    title="Copy URL"
                  >
                    {copiedId === image.id ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <a
                    href={image.cdnUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded hover:bg-muted"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleInvalidateCache(image.id)}
                    disabled={invalidatingId === image.id}
                  >
                    {invalidatingId === image.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Invalidate
                      </>
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(image.id)}
                    disabled={deletingId === image.id}
                  >
                    {deletingId === image.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

