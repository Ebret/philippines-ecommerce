/**
 * ThumbnailGenerator Component
 * Thumbnail generation and preview
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface ThumbnailGeneratorProps {
  mediaUrl: string;
  mediaType: 'video' | 'photo';
  onThumbnailGenerated?: (thumbnailUrl: string) => void;
  isLoading?: boolean;
}

export function ThumbnailGenerator({
  mediaUrl,
  mediaType,
  onThumbnailGenerated,
  isLoading = false,
}: ThumbnailGeneratorProps) {
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTimestamp, setSelectedTimestamp] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

  const generateThumbnail = async () => {
    if (mediaType === 'photo') {
      // For photos, use the image itself as thumbnail
      setThumbnail(mediaUrl);
      onThumbnailGenerated?.(mediaUrl);
      return;
    }

    // For videos, generate thumbnail at selected timestamp
    setIsGenerating(true);
    try {
      const response = await fetch('/api/media/generate-thumbnail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoUrl: mediaUrl,
          timestamp: selectedTimestamp,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setThumbnail(data.thumbnailUrl);
        onThumbnailGenerated?.(data.thumbnailUrl);
      }
    } catch (error) {
      console.error('Failed to generate thumbnail:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVideoMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    setVideoDuration(video.duration);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Thumbnail Preview */}
      {thumbnail && (
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground">Generated Thumbnail</h3>
          <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden">
            <Image
              src={thumbnail}
              alt="Generated thumbnail"
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* Video Timestamp Selector */}
      {mediaType === 'video' && (
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Select Thumbnail Timestamp</h3>

          {/* Video Preview */}
          <div className="relative w-full aspect-video bg-foreground rounded-lg overflow-hidden">
            <video
              src={mediaUrl}
              onLoadedMetadata={handleVideoMetadata}
              className="w-full h-full"
            />
          </div>

          {/* Timestamp Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-foreground">
                Timestamp: {formatTime(selectedTimestamp)}
              </label>
              <span className="text-sm text-muted-foreground">
                / {formatTime(videoDuration)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max={Math.floor(videoDuration)}
              value={selectedTimestamp}
              onChange={(e) => setSelectedTimestamp(parseInt(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg cursor-pointer accent-primary"
              disabled={isGenerating || isLoading}
            />
          </div>

          {/* Preset Timestamps */}
          <div className="flex gap-2 flex-wrap">
            {[0, Math.floor(videoDuration / 4), Math.floor(videoDuration / 2), Math.floor(videoDuration * 0.75)].map(
              (time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTimestamp(time)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    selectedTimestamp === time
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                  disabled={isGenerating || isLoading}
                >
                  {formatTime(time)}
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* Generate Button */}
      <Button
        onClick={generateThumbnail}
        disabled={isGenerating || isLoading}
        className="w-full bg-primary hover:bg-primary-dark text-primary-foreground"
      >
        {isGenerating ? 'Generating...' : 'Generate Thumbnail'}
      </Button>

      {/* Info */}
      <div className="bg-info/10 border border-info/30 rounded-lg p-4 text-sm text-info">
        <p className="font-medium mb-2">💡 Thumbnail Tips:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Choose a clear, representative frame from the video</li>
          <li>Avoid dark or blurry sections</li>
          <li>Include faces or key elements for better engagement</li>
          <li>Thumbnails are automatically optimized for all devices</li>
        </ul>
      </div>
    </div>
  );
}

