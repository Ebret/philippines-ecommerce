/**
 * MetadataDisplay Component
 * Display media metadata (duration, size, dimensions)
 */

'use client';

interface MediaMetadata {
  duration?: number;
  fileSize?: number;
  width?: number;
  height?: number;
  mimeType?: string;
  bitrate?: number;
  frameRate?: number;
  codec?: string;
  createdAt?: Date | string;
  uploadedAt?: Date | string;
}

interface MetadataDisplayProps {
  metadata: MediaMetadata;
  mediaType?: 'video' | 'photo';
  title?: string;
}

export function MetadataDisplay({
  metadata,
  mediaType = 'video',
  title,
}: MetadataDisplayProps) {
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hours > 0) {
      return `${hours}h ${mins}m ${secs}s`;
    }
    return `${mins}m ${secs}s`;
  };

  const formatDate = (date?: Date | string) => {
    if (!date) return 'N/A';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
  };

  const getAspectRatio = () => {
    if (!metadata.width || !metadata.height) return 'N/A';
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(metadata.width, metadata.height);
    return `${metadata.width / divisor}:${metadata.height / divisor}`;
  };

  const metadataItems = [
    {
      label: 'File Size',
      value: formatFileSize(metadata.fileSize),
      icon: '📦',
    },
    {
      label: 'Duration',
      value: formatDuration(metadata.duration),
      icon: '⏱️',
      show: mediaType === 'video',
    },
    {
      label: 'Dimensions',
      value: metadata.width && metadata.height ? `${metadata.width}x${metadata.height}px` : 'N/A',
      icon: '📐',
    },
    {
      label: 'Aspect Ratio',
      value: getAspectRatio(),
      icon: '🎬',
      show: mediaType === 'video',
    },
    {
      label: 'MIME Type',
      value: metadata.mimeType || 'N/A',
      icon: '📄',
    },
    {
      label: 'Bitrate',
      value: metadata.bitrate ? `${metadata.bitrate} kbps` : 'N/A',
      icon: '📊',
      show: mediaType === 'video',
    },
    {
      label: 'Frame Rate',
      value: metadata.frameRate ? `${metadata.frameRate} fps` : 'N/A',
      icon: '🎞️',
      show: mediaType === 'video',
    },
    {
      label: 'Codec',
      value: metadata.codec || 'N/A',
      icon: '🔧',
      show: mediaType === 'video',
    },
    {
      label: 'Uploaded',
      value: formatDate(metadata.uploadedAt || metadata.createdAt),
      icon: '📅',
    },
  ];

  return (
    <div className="space-y-4">
      {title && (
        <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
      )}

      {/* Metadata Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metadataItems
          .filter((item) => item.show !== false)
          .map((item, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-600">{item.label}</p>
                  <p className="text-base font-semibold text-gray-900 truncate">
                    {item.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Summary */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700">
          <span className="font-medium">📋 Summary:</span> This{' '}
          {mediaType === 'video' ? 'video' : 'image'} is{' '}
          {formatFileSize(metadata.fileSize)} in size with dimensions of{' '}
          {metadata.width && metadata.height ? `${metadata.width}x${metadata.height}px` : 'unknown dimensions'}
          {mediaType === 'video' && metadata.duration ? ` and a duration of ${formatDuration(metadata.duration)}` : ''}.
        </p>
      </div>
    </div>
  );
}

