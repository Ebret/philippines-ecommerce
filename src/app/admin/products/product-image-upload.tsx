'use client';

import { useState, useRef } from 'react';
import { Upload, X, Star, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  isPrimary: boolean;
  sortOrder: number;
}

interface ProductImageUploadProps {
  productId: string;
  images: ProductImage[];
  onImagesUpdated: () => void;
}

export default function ProductImageUpload({
  productId,
  images,
  onImagesUpdated,
}: ProductImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [altText, setAltText] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Error',
        description: 'Please select an image file',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'Image must be less than 5MB',
        variant: 'destructive',
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!preview) return;

    try {
      setUploading(true);
      const response = await fetch(`/api/products/${productId}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: preview,
          altText: altText || undefined,
          isPrimary: images.length === 0,
        }),
      });

      if (!response.ok) throw new Error('Failed to upload image');

      toast({
        title: 'Success',
        description: 'Image uploaded successfully',
      });

      setPreview(null);
      setAltText('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      onImagesUpdated();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload image',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId: string) => {
    try {
      setDeleting(imageId);
      const response = await fetch(`/api/products/${productId}/images/${imageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete image');

      toast({
        title: 'Success',
        description: 'Image deleted successfully',
      });

      onImagesUpdated();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete image',
        variant: 'destructive',
      });
    } finally {
      setDeleting(null);
    }
  };

  const handleSetPrimary = async (imageId: string) => {
    try {
      const response = await fetch(`/api/products/${productId}/images/${imageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPrimary: true }),
      });

      if (!response.ok) throw new Error('Failed to set primary image');

      toast({
        title: 'Success',
        description: 'Primary image updated',
      });

      onImagesUpdated();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update primary image',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Product Images</label>

        {/* Current Images Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                <img
                  src={image.url}
                  alt={image.altText || 'Product image'}
                  className="w-full h-24 object-cover rounded border border-border"
                />
                {image.isPrimary && (
                  <div className="absolute top-1 left-1 bg-primary text-primary-foreground p-1 rounded">
                    <Star className="w-3 h-3 fill-current" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center gap-2">
                  {!image.isPrimary && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleSetPrimary(image.id)}
                      disabled={deleting === image.id}
                    >
                      <Star className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(image.id)}
                    disabled={deleting === image.id}
                  >
                    {deleting === image.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Area */}
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
          {preview ? (
            <div className="space-y-3">
              <img src={preview} alt="Preview" className="w-full max-h-48 object-contain mx-auto rounded" />
              <input
                type="text"
                placeholder="Alt text (optional)"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded text-sm"
              />
              <div className="flex gap-2 justify-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setPreview(null);
                    setAltText('');
                  }}
                  disabled={uploading}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleUpload}
                  disabled={uploading}
                >
                  {uploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Upload Image
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
              <p className="text-sm font-medium">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Select Image
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

