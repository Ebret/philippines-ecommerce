/**
 * ImageCropper Component
 * Phase 26.3.4: Image Cropping & Editing Tools
 * 
 * Features:
 * - Crop with aspect ratio presets
 * - Rotate and flip
 * - Zoom control
 * - Preview before apply
 */

'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Crop, RotateCw, RotateCcw, FlipHorizontal, FlipVertical, 
  ZoomIn, ZoomOut, Check, X, RefreshCw 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ImageTransform {
  rotation: number;
  flipH: boolean;
  flipV: boolean;
  zoom: number;
}

interface ImageCropperProps {
  imageUrl: string;
  aspectRatio?: number; // width/height, e.g., 1 for square, 16/9 for widescreen
  onCrop: (croppedBlob: Blob, cropArea: CropArea) => void;
  onCancel?: () => void;
  className?: string;
}

const ASPECT_RATIOS = [
  { label: 'Free', value: 0 },
  { label: '1:1', value: 1 },
  { label: '4:3', value: 4/3 },
  { label: '16:9', value: 16/9 },
  { label: '3:2', value: 3/2 },
  { label: '2:3', value: 2/3 },
];

export function ImageCropper({
  imageUrl,
  aspectRatio: initialAspectRatio,
  onCrop,
  onCancel,
  className,
}: ImageCropperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [aspectRatio, setAspectRatio] = useState(initialAspectRatio || 0);
  const [transform, setTransform] = useState<ImageTransform>({
    rotation: 0,
    flipH: false,
    flipV: false,
    zoom: 1,
  });
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 100, height: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);

  // Load image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setImage(img);
      // Initialize crop area to center
      const size = Math.min(img.width, img.height) * 0.8;
      setCropArea({
        x: (img.width - size) / 2,
        y: (img.height - size) / 2,
        width: size,
        height: aspectRatio ? size / aspectRatio : size,
      });
    };
    img.src = imageUrl;
  }, [imageUrl, aspectRatio]);

  // Draw image with transforms
  const drawImage = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !image) return;

    const container = containerRef.current;
    if (!container) return;

    // Set canvas size to container size
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Calculate scale to fit image in canvas
    const scale = Math.min(
      canvas.width / image.width,
      canvas.height / image.height
    ) * transform.zoom;

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Apply transforms
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((transform.rotation * Math.PI) / 180);
    ctx.scale(transform.flipH ? -1 : 1, transform.flipV ? -1 : 1);

    // Draw image centered
    const drawWidth = image.width * scale;
    const drawHeight = image.height * scale;
    ctx.drawImage(image, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    ctx.restore();

    // Draw crop overlay
    const cropX = (cropArea.x / image.width) * drawWidth + (canvas.width - drawWidth) / 2;
    const cropY = (cropArea.y / image.height) * drawHeight + (canvas.height - drawHeight) / 2;
    const cropW = (cropArea.width / image.width) * drawWidth;
    const cropH = (cropArea.height / image.height) * drawHeight;

    // Darken outside crop area
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, cropY);
    ctx.fillRect(0, cropY, cropX, cropH);
    ctx.fillRect(cropX + cropW, cropY, canvas.width - cropX - cropW, cropH);
    ctx.fillRect(0, cropY + cropH, canvas.width, canvas.height - cropY - cropH);

    // Draw crop border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(cropX, cropY, cropW, cropH);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(cropX + (cropW * i) / 3, cropY);
      ctx.lineTo(cropX + (cropW * i) / 3, cropY + cropH);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cropX, cropY + (cropH * i) / 3);
      ctx.lineTo(cropX + cropW, cropY + (cropH * i) / 3);
      ctx.stroke();
    }

    // Draw resize handles
    const handleSize = 10;
    ctx.fillStyle = '#fff';
    const handles = [
      { x: cropX, y: cropY },
      { x: cropX + cropW, y: cropY },
      { x: cropX, y: cropY + cropH },
      { x: cropX + cropW, y: cropY + cropH },
    ];
    handles.forEach(({ x, y }) => {
      ctx.fillRect(x - handleSize / 2, y - handleSize / 2, handleSize, handleSize);
    });
  }, [image, transform, cropArea]);

  // Redraw on changes
  useEffect(() => {
    drawImage();
  }, [drawImage]);

  // Rotate image
  const rotate = (degrees: number) => {
    setTransform(t => ({ ...t, rotation: (t.rotation + degrees) % 360 }));
  };

  // Flip image
  const flip = (direction: 'h' | 'v') => {
    setTransform(t => ({
      ...t,
      flipH: direction === 'h' ? !t.flipH : t.flipH,
      flipV: direction === 'v' ? !t.flipV : t.flipV,
    }));
  };

  // Zoom
  const zoom = (delta: number) => {
    setTransform(t => ({
      ...t,
      zoom: Math.max(0.5, Math.min(3, t.zoom + delta)),
    }));
  };

  // Reset transforms
  const reset = () => {
    setTransform({ rotation: 0, flipH: false, flipV: false, zoom: 1 });
  };

  // Apply crop
  const applyCrop = async () => {
    if (!image) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = cropArea.width;
    canvas.height = cropArea.height;

    // Apply transforms and draw cropped area
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((transform.rotation * Math.PI) / 180);
    ctx.scale(transform.flipH ? -1 : 1, transform.flipV ? -1 : 1);
    ctx.drawImage(
      image,
      cropArea.x, cropArea.y, cropArea.width, cropArea.height,
      -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height
    );
    ctx.restore();

    canvas.toBlob((blob) => {
      if (blob) {
        onCrop(blob, cropArea);
      }
    }, 'image/jpeg', 0.9);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-2 bg-card border border-border rounded-lg">
        {/* Aspect Ratio */}
        <div className="flex gap-1">
          {ASPECT_RATIOS.map((ratio) => (
            <button
              key={ratio.label}
              onClick={() => setAspectRatio(ratio.value)}
              className={cn(
                'px-2 py-1 text-xs rounded transition-colors',
                aspectRatio === ratio.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              )}
            >
              {ratio.label}
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-border" />

        {/* Rotate */}
        <button onClick={() => rotate(-90)} className="p-2 rounded hover:bg-muted" title="Rotate left">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button onClick={() => rotate(90)} className="p-2 rounded hover:bg-muted" title="Rotate right">
          <RotateCw className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-border" />

        {/* Flip */}
        <button onClick={() => flip('h')} className="p-2 rounded hover:bg-muted" title="Flip horizontal">
          <FlipHorizontal className="w-4 h-4" />
        </button>
        <button onClick={() => flip('v')} className="p-2 rounded hover:bg-muted" title="Flip vertical">
          <FlipVertical className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-border" />

        {/* Zoom */}
        <button onClick={() => zoom(-0.1)} className="p-2 rounded hover:bg-muted" title="Zoom out">
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="text-xs w-12 text-center">{Math.round(transform.zoom * 100)}%</span>
        <button onClick={() => zoom(0.1)} className="p-2 rounded hover:bg-muted" title="Zoom in">
          <ZoomIn className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-border" />

        {/* Reset */}
        <button onClick={reset} className="p-2 rounded hover:bg-muted" title="Reset">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="relative w-full aspect-video bg-black rounded-lg overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        )}
        <Button onClick={applyCrop}>
          <Check className="w-4 h-4 mr-2" />
          Apply Crop
        </Button>
      </div>
    </div>
  );
}

