/**
 * ImageGallery Component
 * Image gallery with lightbox functionality
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  thumbnail?: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  columns?: number;
  onImageClick?: (image: GalleryImage) => void;
}

export function ImageGallery({
  images,
  columns = 3,
  onImageClick,
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleImageClick = (image: GalleryImage, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
    onImageClick?.(image);
  };

  const handlePrevious = () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setSelectedImage(images[newIndex]);
    setCurrentIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    setSelectedImage(images[newIndex]);
    setCurrentIndex(newIndex);
  };

  const handleClose = () => {
    setSelectedImage(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'Escape') handleClose();
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No images to display
      </div>
    );
  }

  return (
    <>
      {/* Gallery Grid */}
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: `repeat(auto-fill, minmax(${100 / columns}%, 1fr))`,
        }}
      >
        {images.map((image, index) => (
          <div
            key={image.id}
            className="relative aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => handleImageClick(image, index)}
          >
            <Image
              src={image.thumbnail || image.url}
              alt={image.alt}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-all duration-300 flex items-center justify-center">
              <span className="text-background text-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                🔍
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-foreground/90 z-50 flex items-center justify-center p-4"
          onClick={handleClose}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-background text-3xl hover:text-background/70 transition-colors z-10"
            aria-label="Close lightbox"
          >
            ✕
          </button>

          {/* Image Container */}
          <div
            className="relative w-full max-w-4xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage.url}
              alt={selectedImage.alt}
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-background text-3xl hover:text-background/70 transition-colors"
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-background text-3xl hover:text-background/70 transition-colors"
                aria-label="Next image"
              >
                ›
              </button>
            </>
          )}

          {/* Image Info */}
          <div className="absolute bottom-4 left-4 right-4 text-background text-sm">
            <p className="font-medium">{selectedImage.alt}</p>
            {images.length > 1 && (
              <p className="text-background/60">
                {currentIndex + 1} / {images.length}
              </p>
            )}
          </div>

          {/* Keyboard Hint */}
          <div className="absolute bottom-4 right-4 text-background/60 text-xs">
            <p>← → to navigate • ESC to close</p>
          </div>
        </div>
      )}
    </>
  );
}

