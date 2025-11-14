/**
 * MediaPreview Component
 * Display uploaded media with quality selection
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';

interface MediaPreviewProps {
  mediaUrl: string;
  mediaType: 'video' | 'photo';
  title?: string;
  thumbnailUrl?: string;
  availableQualities?: ('360p' | '720p' | '1080p')[];
  onQualityChange?: (quality: string) => void;
}

export function MediaPreview({
  mediaUrl,
  mediaType,
  title,
  thumbnailUrl,
  availableQualities = ['360p', '720p', '1080p'],
  onQualityChange,
}: MediaPreviewProps) {
  const [selectedQuality, setSelectedQuality] = useState<string>(availableQualities[0] || '720p');
  const [isLoading, setIsLoading] = useState(true);

  const handleQualityChange = (quality: string) => {
    setSelectedQuality(quality);
    onQualityChange?.(quality);
  };

  if (mediaType === 'photo') {
    return (
      <div className="space-y-4">
        <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={mediaUrl}
            alt={title || 'Media preview'}
            fill
            className="object-cover"
            onLoadingComplete={() => setIsLoading(false)}
            priority
          />
          {isLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
        </div>
        {title && <p className="text-sm text-gray-600">{title}</p>}
      </div>
    );
  }

  // Video preview
  return (
    <div className="space-y-4">
      {/* Video Player */}
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
        <video
          src={mediaUrl}
          controls
          poster={thumbnailUrl}
          className="w-full h-full"
          onLoadStart={() => setIsLoading(true)}
          onCanPlay={() => setIsLoading(false)}
        >
          Your browser does not support the video tag.
        </video>
        {isLoading && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
          </div>
        )}
      </div>

      {/* Quality Selector */}
      {availableQualities.length > 0 && (
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Quality:</label>
          <div className="flex gap-2">
            {availableQualities.map((quality) => (
              <button
                key={quality}
                onClick={() => handleQualityChange(quality)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  selectedQuality === quality
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {quality}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      {title && <p className="text-sm text-gray-600">{title}</p>}

      {/* Video Info */}
      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 space-y-1">
        <p>📹 Video Preview</p>
        <p>Current Quality: <span className="font-medium">{selectedQuality}</span></p>
        <p>Available Qualities: <span className="font-medium">{availableQualities.join(', ')}</span></p>
      </div>
    </div>
  );
}

