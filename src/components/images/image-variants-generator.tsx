/**
 * ImageVariantsGenerator Component
 * Phase 26.3.5: Image Variants (thumbnail, medium, large)
 * 
 * Features:
 * - Generate multiple image sizes
 * - Preview all variants
 * - Download individual variants
 * - Batch generation
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { Image as ImageIcon, Download, Loader2, Check, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ImageVariant {
  name: string;
  width: number;
  height: number;
  quality: number;
  blob?: Blob;
  url?: string;
  size?: number;
}

interface ImageVariantsGeneratorProps {
  imageUrl?: string;
  imageFile?: File;
  onVariantsGenerated?: (variants: ImageVariant[]) => void;
  className?: string;
}

const DEFAULT_VARIANTS: Omit<ImageVariant, 'blob' | 'url' | 'size'>[] = [
  { name: 'thumbnail', width: 150, height: 150, quality: 80 },
  { name: 'small', width: 300, height: 300, quality: 80 },
  { name: 'medium', width: 600, height: 600, quality: 85 },
  { name: 'large', width: 1200, height: 1200, quality: 90 },
  { name: 'original', width: 0, height: 0, quality: 95 }, // 0 means keep original size
];

export function ImageVariantsGenerator({
  imageUrl,
  imageFile,
  onVariantsGenerated,
  className,
}: ImageVariantsGeneratorProps) {
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [variants, setVariants] = useState<ImageVariant[]>(DEFAULT_VARIANTS);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCount, setGeneratedCount] = useState(0);

  // Load original image
  useEffect(() => {
    const loadImage = async () => {
      const img = new Image();
      
      if (imageFile) {
        img.src = URL.createObjectURL(imageFile);
      } else if (imageUrl) {
        img.crossOrigin = 'anonymous';
        img.src = imageUrl;
      }

      img.onload = () => {
        setOriginalImage(img);
      };
    };

    loadImage();
  }, [imageUrl, imageFile]);

  // Generate single variant
  const generateVariant = useCallback(async (
    image: HTMLImageElement,
    variant: ImageVariant
  ): Promise<ImageVariant> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(variant);
        return;
      }

      // Calculate dimensions
      let width = variant.width || image.width;
      let height = variant.height || image.height;

      // Maintain aspect ratio
      if (variant.width && variant.height) {
        const ratio = Math.min(variant.width / image.width, variant.height / image.height);
        width = Math.round(image.width * ratio);
        height = Math.round(image.height * ratio);
      }

      canvas.width = width;
      canvas.height = height;

      // Draw image
      ctx.drawImage(image, 0, 0, width, height);

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            resolve({
              ...variant,
              blob,
              url,
              size: blob.size,
              width,
              height,
            });
          } else {
            resolve(variant);
          }
        },
        'image/webp',
        variant.quality / 100
      );
    });
  }, []);

  // Generate all variants
  const generateAllVariants = useCallback(async () => {
    if (!originalImage) return;

    setIsGenerating(true);
    setGeneratedCount(0);

    const generatedVariants: ImageVariant[] = [];

    for (const variant of DEFAULT_VARIANTS) {
      const generated = await generateVariant(originalImage, variant);
      generatedVariants.push(generated);
      setGeneratedCount(prev => prev + 1);
    }

    setVariants(generatedVariants);
    setIsGenerating(false);
    onVariantsGenerated?.(generatedVariants);
  }, [originalImage, generateVariant, onVariantsGenerated]);

  // Auto-generate when image loads
  useEffect(() => {
    if (originalImage) {
      generateAllVariants();
    }
  }, [originalImage, generateAllVariants]);

  // Download variant
  const downloadVariant = (variant: ImageVariant) => {
    if (!variant.url) return;
    const link = document.createElement('a');
    link.href = variant.url;
    link.download = `image-${variant.name}.webp`;
    link.click();
  };

  // Format file size
  const formatSize = (bytes?: number) => {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            Image Variants
          </h3>
          <p className="text-sm text-muted-foreground">
            Generate optimized versions for different use cases
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={generateAllVariants}
          disabled={isGenerating || !originalImage}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating ({generatedCount}/{DEFAULT_VARIANTS.length})
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate All
            </>
          )}
        </Button>
      </div>

      {/* Variants Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {variants.map((variant) => (
          <div
            key={variant.name}
            className="border border-border rounded-lg overflow-hidden bg-card"
          >
            {/* Preview */}
            <div className="aspect-square bg-muted relative">
              {variant.url ? (
                <img
                  src={variant.url}
                  alt={variant.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  {isGenerating ? (
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
              )}

              {/* Generated Badge */}
              {variant.url && (
                <div className="absolute top-2 right-2">
                  <Check className="w-5 h-5 text-green-500" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium capitalize">{variant.name}</span>
                <span className="text-xs text-muted-foreground">
                  {variant.quality}% quality
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {variant.width || 'Original'} × {variant.height || 'Original'}
                </span>
                <span className="font-medium">{formatSize(variant.size)}</span>
              </div>

              {/* Download Button */}
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => downloadVariant(variant)}
                disabled={!variant.url}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      {variants.some(v => v.size) && (
        <div className="p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">Summary</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Total Variants</span>
              <p className="font-medium">{variants.filter(v => v.url).length}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Total Size</span>
              <p className="font-medium">
                {formatSize(variants.reduce((sum, v) => sum + (v.size || 0), 0))}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Smallest</span>
              <p className="font-medium">
                {formatSize(Math.min(...variants.filter(v => v.size).map(v => v.size!)))}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Largest</span>
              <p className="font-medium">
                {formatSize(Math.max(...variants.filter(v => v.size).map(v => v.size!)))}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

