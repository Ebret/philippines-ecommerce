'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ProductImageGalleryProps {
  images: Array<{
    id: string;
    url: string;
    alt?: string;
  }>;
  title?: string;
  onImageChange?: (imageId: string) => void;
  className?: string;
}

const ProductImageGallery = React.forwardRef<HTMLDivElement, ProductImageGalleryProps>(
  ({ images, title = 'Product Image', onImageChange, className }, ref) => {
    const [selectedImageId, setSelectedImageId] = React.useState(images[0]?.id || '');
    const [isZoomed, setIsZoomed] = React.useState(false);
    const [zoomPosition, setZoomPosition] = React.useState({ x: 0, y: 0 });
    const mainImageRef = React.useRef<HTMLDivElement>(null);

    const selectedImage = images.find((img) => img.id === selectedImageId);

    const handleImageSelect = (imageId: string) => {
      setSelectedImageId(imageId);
      onImageChange?.(imageId);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!mainImageRef.current) return;

      const rect = mainImageRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      setZoomPosition({ x, y });
    };

    const handleMouseEnter = () => {
      setIsZoomed(true);
    };

    const handleMouseLeave = () => {
      setIsZoomed(false);
    };

    if (images.length === 0) {
      return (
        <div className={cn('flex items-center justify-center bg-neutral-100', className)}>
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="mt-2 text-sm text-neutral-500">No images available</p>
          </div>
        </div>
      );
    }

    return (
      <div ref={ref} className={cn('flex flex-col gap-4', className)}>
        {/* Main Image */}
        <div
          ref={mainImageRef}
          className="group relative h-96 w-full overflow-hidden rounded-xl bg-gradient-to-br from-muted to-muted/80 shadow-lg"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {selectedImage && (
            <>
              <Image
                src={selectedImage.url}
                alt={selectedImage.alt || title}
                fill
                className={cn(
                  'object-cover transition-transform duration-300 cursor-zoom-in',
                  isZoomed && 'scale-150 cursor-zoom-out'
                )}
                style={
                  isZoomed
                    ? {
                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      }
                    : undefined
                }
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 60vw"
              />

              {/* Zoom Indicator */}
              {isZoomed && (
                <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-black/70 text-white text-xs font-semibold backdrop-blur-sm">
                  🔍 Zoomed
                </div>
              )}

              {/* Zoom Hint */}
              {!isZoomed && (
                <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-black/50 text-white text-xs font-semibold backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Hover to zoom
                </div>
              )}
            </>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {images.map((image) => (
              <button
                key={image.id}
                onClick={() => handleImageSelect(image.id)}
                className={cn(
                  'relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200',
                  selectedImageId === image.id
                    ? 'border-primary shadow-lg ring-2 ring-primary/30'
                    : 'border-border hover:border-primary/50'
                )}
                aria-label={`Select ${image.alt || 'product image'}`}
              >
                <Image
                  src={image.url}
                  alt={image.alt || title}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </button>
            ))}
          </div>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="text-center text-sm font-semibold text-muted-foreground">
            {images.findIndex((img) => img.id === selectedImageId) + 1} / {images.length}
          </div>
        )}
      </div>
    );
  }
);
ProductImageGallery.displayName = 'ProductImageGallery';

export { ProductImageGallery };

