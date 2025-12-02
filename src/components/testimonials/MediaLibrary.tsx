/**
 * MediaLibrary Component
 * Media file management interface
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface MediaFile {
  id: string;
  url: string;
  type: 'video' | 'photo';
  name: string;
  size: number;
  duration?: number;
  createdAt: Date | string;
  thumbnailUrl?: string;
}

interface MediaLibraryProps {
  media: MediaFile[];
  onDelete?: (mediaId: string) => Promise<void>;
  onSelect?: (media: MediaFile) => void;
  isLoading?: boolean;
}

export function MediaLibrary({
  media,
  onDelete,
  onSelect,
  isLoading = false,
}: MediaLibraryProps) {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDelete = async (mediaId: string) => {
    if (!onDelete) return;
    setDeletingId(mediaId);
    try {
      await onDelete(mediaId);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSelect = (mediaFile: MediaFile) => {
    setSelectedMedia(mediaFile.id);
    onSelect?.(mediaFile);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-muted rounded-lg h-48 animate-pulse" />
        ))}
      </div>
    );
  }

  if (media.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg font-medium">No media files</p>
        <p className="text-sm">Upload media to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {media.map((mediaFile) => (
          <div
            key={mediaFile.id}
            className={`rounded-lg overflow-hidden border-2 transition-all cursor-pointer bg-card ${
              selectedMedia === mediaFile.id
                ? 'border-primary shadow-lg'
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => handleSelect(mediaFile)}
          >
            {/* Thumbnail */}
            <div className="relative w-full h-32 bg-muted">
              {mediaFile.thumbnailUrl ? (
                <Image
                  src={mediaFile.thumbnailUrl}
                  alt={mediaFile.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl">
                  {mediaFile.type === 'video' ? '🎥' : '📷'}
                </div>
              )}
              <div className="absolute top-2 right-2 bg-foreground/60 text-background px-2 py-1 rounded text-xs font-medium">
                {mediaFile.type === 'video' ? 'Video' : 'Photo'}
              </div>
            </div>

            {/* Info */}
            <div className="p-3 space-y-2">
              <p className="font-medium text-sm truncate text-foreground">{mediaFile.name}</p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Size: {formatFileSize(mediaFile.size)}</p>
                {mediaFile.duration && (
                  <p>Duration: {formatDuration(mediaFile.duration)}</p>
                )}
                <p>
                  {typeof mediaFile.createdAt === 'string'
                    ? new Date(mediaFile.createdAt).toLocaleDateString()
                    : mediaFile.createdAt.toLocaleDateString()}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(mediaFile);
                  }}
                  className="flex-1"
                >
                  Select
                </Button>
                {onDelete && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(mediaFile.id);
                    }}
                    disabled={deletingId === mediaFile.id}
                    className="flex-1"
                  >
                    {deletingId === mediaFile.id ? 'Deleting...' : 'Delete'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="text-sm text-muted-foreground text-center">
        {media.length} media file{media.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}

