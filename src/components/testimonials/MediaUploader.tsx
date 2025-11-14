/**
 * MediaUploader Component
 * Component for uploading videos and photos with progress tracking
 */

'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';

interface MediaUploaderProps {
  testimonialId: string;
  onUploadComplete: (mediaUrl: string, mediaType: 'video' | 'photo') => void;
  onError?: (error: string) => void;
  maxFileSize?: number; // in MB
}

export function MediaUploader({
  testimonialId,
  onUploadComplete,
  onError,
  maxFileSize = 100,
}: MediaUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
  const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadError(null);
      setProgress(0);

      // Validate file type
      const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);
      const isPhoto = ALLOWED_PHOTO_TYPES.includes(file.type);

      if (!isVideo && !isPhoto) {
        throw new Error('Invalid file type. Please upload a video or photo.');
      }

      // Validate file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxFileSize) {
        throw new Error(`File size exceeds ${maxFileSize}MB limit.`);
      }

      setIsUploading(true);

      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('mediaType', isVideo ? 'video' : 'photo');

      // Upload with progress tracking
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setProgress(Math.round(percentComplete));
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          onUploadComplete(response.mediaUrl, isVideo ? 'video' : 'photo');
          setProgress(100);
          setIsUploading(false);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        } else {
          throw new Error('Upload failed');
        }
      });

      xhr.addEventListener('error', () => {
        throw new Error('Upload error occurred');
      });

      xhr.open('POST', `/api/testimonials/${testimonialId}/upload-media`);
      xhr.send(formData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setUploadError(errorMessage);
      onError?.(errorMessage);
      setIsUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*,image/*"
          onChange={handleFileSelect}
          disabled={isUploading}
          className="hidden"
          id="media-input"
        />

        <label
          htmlFor="media-input"
          className="cursor-pointer block"
        >
          <div className="text-4xl mb-2">📁</div>
          <p className="text-lg font-medium text-gray-700 mb-1">
            {isUploading ? 'Uploading...' : 'Click to upload or drag and drop'}
          </p>
          <p className="text-sm text-gray-500">
            Video (MP4, WebM, MOV) or Photo (JPG, PNG, WebP) up to {maxFileSize}MB
          </p>
        </label>
      </div>

      {/* Progress Bar */}
      {isUploading && (
        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 text-center">{progress}% uploaded</p>
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {uploadError}
        </div>
      )}

      {/* Upload Button */}
      <Button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isUploading ? `Uploading (${progress}%)` : 'Select Media File'}
      </Button>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
        <p className="font-medium mb-2">📝 Upload Tips:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Videos will be transcoded to 360p, 720p, and 1080p</li>
          <li>Photos will be optimized and converted to WebP format</li>
          <li>Thumbnails will be automatically generated</li>
          <li>Processing may take a few minutes for large files</li>
        </ul>
      </div>
    </div>
  );
}

