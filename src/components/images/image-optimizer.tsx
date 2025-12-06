/**
 * ImageOptimizer Component
 * Phase 26.3.2: Image Optimization & Compression
 * 
 * Features:
 * - Client-side image compression
 * - Quality adjustment slider
 * - Format conversion (WebP, JPEG, PNG)
 * - Resize options
 * - Before/after preview
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Sliders, Download, RefreshCw, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface OptimizationSettings {
  quality: number;
  maxWidth: number;
  maxHeight: number;
  format: 'webp' | 'jpeg' | 'png';
  maintainAspectRatio: boolean;
}

interface ImageOptimizerProps {
  imageUrl?: string;
  imageFile?: File;
  onOptimized?: (blob: Blob, settings: OptimizationSettings) => void;
  className?: string;
}

const DEFAULT_SETTINGS: OptimizationSettings = {
  quality: 80,
  maxWidth: 1920,
  maxHeight: 1080,
  format: 'webp',
  maintainAspectRatio: true,
};

export function ImageOptimizer({
  imageUrl,
  imageFile,
  onOptimized,
  className,
}: ImageOptimizerProps) {
  const [settings, setSettings] = useState<OptimizationSettings>(DEFAULT_SETTINGS);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [optimizedBlob, setOptimizedBlob] = useState<Blob | null>(null);
  const [optimizedUrl, setOptimizedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [optimizedSize, setOptimizedSize] = useState<number>(0);

  // Load image from URL or File
  useEffect(() => {
    const loadImage = async () => {
      const img = new Image();
      
      if (imageFile) {
        const url = URL.createObjectURL(imageFile);
        img.src = url;
        setOriginalSize(imageFile.size);
      } else if (imageUrl) {
        img.src = imageUrl;
        // Fetch to get size
        try {
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          setOriginalSize(blob.size);
        } catch {
          setOriginalSize(0);
        }
      }

      img.onload = () => {
        setOriginalImage(img);
      };
    };

    loadImage();
  }, [imageUrl, imageFile]);

  // Optimize image when settings change
  const optimizeImage = useCallback(async () => {
    if (!originalImage) return;

    setIsProcessing(true);

    try {
      // Create canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not available');

      // Calculate dimensions
      let width = originalImage.width;
      let height = originalImage.height;

      if (settings.maintainAspectRatio) {
        const ratio = Math.min(
          settings.maxWidth / width,
          settings.maxHeight / height,
          1 // Don't upscale
        );
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      } else {
        width = Math.min(width, settings.maxWidth);
        height = Math.min(height, settings.maxHeight);
      }

      canvas.width = width;
      canvas.height = height;

      // Draw image
      ctx.drawImage(originalImage, 0, 0, width, height);

      // Convert to blob
      const mimeType = `image/${settings.format}`;
      const quality = settings.quality / 100;

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setOptimizedBlob(blob);
            setOptimizedSize(blob.size);
            
            // Create preview URL
            if (optimizedUrl) {
              URL.revokeObjectURL(optimizedUrl);
            }
            setOptimizedUrl(URL.createObjectURL(blob));
            
            onOptimized?.(blob, settings);
          }
          setIsProcessing(false);
        },
        mimeType,
        quality
      );
    } catch (error) {
      console.error('Image optimization failed:', error);
      setIsProcessing(false);
    }
  }, [originalImage, settings, onOptimized, optimizedUrl]);

  // Auto-optimize when image or settings change
  useEffect(() => {
    if (originalImage) {
      optimizeImage();
    }
  }, [originalImage, settings, optimizeImage]);

  // Calculate savings
  const savings = originalSize > 0 ? ((originalSize - optimizedSize) / originalSize * 100).toFixed(1) : '0';
  const savingsPositive = optimizedSize < originalSize;

  // Format file size
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  // Download optimized image
  const downloadOptimized = () => {
    if (!optimizedUrl) return;
    const link = document.createElement('a');
    link.href = optimizedUrl;
    link.download = `optimized.${settings.format}`;
    link.click();
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Settings Panel */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Sliders className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Optimization Settings</h3>
        </div>

        {/* Quality Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <label className="text-muted-foreground">Quality</label>
            <span className="font-medium">{settings.quality}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={settings.quality}
            onChange={(e) => setSettings(s => ({ ...s, quality: parseInt(e.target.value) }))}
            className="w-full accent-primary"
          />
        </div>

        {/* Format Selection */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Output Format</label>
          <div className="flex gap-2">
            {(['webp', 'jpeg', 'png'] as const).map((format) => (
              <button
                key={format}
                onClick={() => setSettings(s => ({ ...s, format }))}
                className={cn(
                  'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                  settings.format === format
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                )}
              >
                {format.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Max Dimensions */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Max Width</label>
            <input
              type="number"
              value={settings.maxWidth}
              onChange={(e) => setSettings(s => ({ ...s, maxWidth: parseInt(e.target.value) || 1920 }))}
              className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Max Height</label>
            <input
              type="number"
              value={settings.maxHeight}
              onChange={(e) => setSettings(s => ({ ...s, maxHeight: parseInt(e.target.value) || 1080 }))}
              className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm"
            />
          </div>
        </div>

        {/* Maintain Aspect Ratio */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.maintainAspectRatio}
            onChange={(e) => setSettings(s => ({ ...s, maintainAspectRatio: e.target.checked }))}
            className="rounded border-border"
          />
          <span className="text-sm">Maintain aspect ratio</span>
        </label>
      </div>

      {/* Preview Section */}
      {originalImage && (
        <div className="grid md:grid-cols-2 gap-4">
          {/* Original */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Original</h4>
            <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
              <img
                src={imageFile ? URL.createObjectURL(imageFile) : imageUrl}
                alt="Original"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {originalImage.width} × {originalImage.height}
              </span>
              <span className="font-medium">{formatSize(originalSize)}</span>
            </div>
          </div>

          {/* Optimized */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Optimized</h4>
            <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
              {isProcessing ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : optimizedUrl ? (
                <img
                  src={optimizedUrl}
                  alt="Optimized"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex justify-between text-sm">
              <span className={cn(
                'font-medium',
                savingsPositive ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'
              )}>
                {savingsPositive ? `${savings}% smaller` : `${Math.abs(parseFloat(savings))}% larger`}
              </span>
              <span className="font-medium">{formatSize(optimizedSize)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="outline" onClick={optimizeImage} disabled={isProcessing || !originalImage}>
          <RefreshCw className={cn('w-4 h-4 mr-2', isProcessing && 'animate-spin')} />
          Re-optimize
        </Button>
        <Button onClick={downloadOptimized} disabled={!optimizedUrl}>
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>
    </div>
  );
}

