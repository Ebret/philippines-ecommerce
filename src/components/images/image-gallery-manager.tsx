/**
 * ImageGalleryManager Component
 * Phase 26.3.3: Image Gallery Management with Drag-and-Drop
 * 
 * Features:
 * - Drag and drop reordering
 * - Primary image selection
 * - Image deletion
 * - Alt text editing
 * - Thumbnail preview
 */

'use client';

import { useState, useCallback } from 'react';
import { GripVertical, Star, Trash2, Edit2, X, Check, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface GalleryImage {
  id: string;
  url: string;
  thumbnailUrl?: string;
  altText?: string;
  isPrimary: boolean;
  sortOrder: number;
}

interface ImageGalleryManagerProps {
  images: GalleryImage[];
  onReorder: (images: GalleryImage[]) => void;
  onSetPrimary: (imageId: string) => void;
  onDelete: (imageId: string) => void;
  onUpdateAltText: (imageId: string, altText: string) => void;
  className?: string;
}

export function ImageGalleryManager({
  images,
  onReorder,
  onSetPrimary,
  onDelete,
  onUpdateAltText,
  className,
}: ImageGalleryManagerProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAltText, setEditAltText] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Sort images by sortOrder
  const sortedImages = [...images].sort((a, b) => a.sortOrder - b.sortOrder);

  // Handle drag start
  const handleDragStart = useCallback((e: React.DragEvent, imageId: string) => {
    setDraggedId(imageId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', imageId);
  }, []);

  // Handle drag over
  const handleDragOver = useCallback((e: React.DragEvent, imageId: string) => {
    e.preventDefault();
    if (draggedId !== imageId) {
      setDragOverId(imageId);
    }
  }, [draggedId]);

  // Handle drag leave
  const handleDragLeave = useCallback(() => {
    setDragOverId(null);
  }, []);

  // Handle drop
  const handleDrop = useCallback((e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    setDragOverId(null);
    
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      return;
    }

    const draggedIndex = sortedImages.findIndex(img => img.id === draggedId);
    const targetIndex = sortedImages.findIndex(img => img.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedId(null);
      return;
    }

    // Reorder images
    const newImages = [...sortedImages];
    const [draggedImage] = newImages.splice(draggedIndex, 1);
    newImages.splice(targetIndex, 0, draggedImage);

    // Update sort orders
    const reorderedImages = newImages.map((img, index) => ({
      ...img,
      sortOrder: index,
    }));

    onReorder(reorderedImages);
    setDraggedId(null);
  }, [draggedId, sortedImages, onReorder]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setDraggedId(null);
    setDragOverId(null);
  }, []);

  // Start editing alt text
  const startEditAltText = (image: GalleryImage) => {
    setEditingId(image.id);
    setEditAltText(image.altText || '');
  };

  // Save alt text
  const saveAltText = () => {
    if (editingId) {
      onUpdateAltText(editingId, editAltText);
      setEditingId(null);
      setEditAltText('');
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditAltText('');
  };

  // Confirm delete
  const confirmDelete = (imageId: string) => {
    onDelete(imageId);
    setDeleteConfirmId(null);
  };

  if (images.length === 0) {
    return (
      <div className={cn('text-center py-12 border-2 border-dashed border-border rounded-lg', className)}>
        <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">No images in gallery</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Image Gallery ({images.length})</h3>
        <p className="text-sm text-muted-foreground">Drag to reorder</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {sortedImages.map((image) => (
          <div
            key={image.id}
            draggable
            onDragStart={(e) => handleDragStart(e, image.id)}
            onDragOver={(e) => handleDragOver(e, image.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, image.id)}
            onDragEnd={handleDragEnd}
            className={cn(
              'relative group rounded-lg overflow-hidden border-2 transition-all cursor-move',
              draggedId === image.id && 'opacity-50 scale-95',
              dragOverId === image.id && 'border-primary ring-2 ring-primary/30',
              image.isPrimary ? 'border-amber-500' : 'border-border',
              deleteConfirmId === image.id && 'ring-2 ring-red-500'
            )}
          >
            {/* Image */}
            <div className="aspect-square relative bg-muted">
              <img
                src={image.thumbnailUrl || image.url}
                alt={image.altText || 'Product image'}
                className="w-full h-full object-cover"
              />

              {/* Drag Handle */}
              <div className="absolute top-2 left-2 p-1 rounded bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="w-4 h-4 text-muted-foreground" />
              </div>

              {/* Primary Badge */}
              {image.isPrimary && (
                <div className="absolute top-2 right-2 px-2 py-1 rounded bg-amber-500 text-white text-xs font-medium flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  Primary
                </div>
              )}

              {/* Action Buttons */}
              <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {!image.isPrimary && (
                  <button
                    onClick={() => onSetPrimary(image.id)}
                    className="p-1.5 rounded bg-background/80 hover:bg-amber-500 hover:text-white transition-colors"
                    title="Set as primary"
                  >
                    <Star className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => startEditAltText(image)}
                  className="p-1.5 rounded bg-background/80 hover:bg-primary hover:text-primary-foreground transition-colors"
                  title="Edit alt text"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(image.id)}
                  className="p-1.5 rounded bg-background/80 hover:bg-red-500 hover:text-white transition-colors"
                  title="Delete image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Alt Text Display/Edit */}
            <div className="p-2 bg-card">
              {editingId === image.id ? (
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={editAltText}
                    onChange={(e) => setEditAltText(e.target.value)}
                    placeholder="Alt text..."
                    className="flex-1 px-2 py-1 text-xs rounded border border-border bg-background"
                    autoFocus
                  />
                  <button
                    onClick={saveAltText}
                    className="p-1 rounded bg-green-500 text-white"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="p-1 rounded bg-muted"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground truncate">
                  {image.altText || 'No alt text'}
                </p>
              )}
            </div>

            {/* Delete Confirmation */}
            {deleteConfirmId === image.id && (
              <div className="absolute inset-0 bg-background/90 flex flex-col items-center justify-center p-4">
                <p className="text-sm font-medium mb-3 text-center">Delete this image?</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => confirmDelete(image.id)}
                  >
                    Delete
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDeleteConfirmId(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

