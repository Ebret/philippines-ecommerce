/**
 * BulkImageUpload Component
 * Phase 26.3.1: Bulk Image Upload for Multiple Products
 * 
 * Features:
 * - Upload multiple images at once
 * - Progress tracking for each image
 * - Drag and drop support
 * - File validation (type, size)
 * - Batch processing with queue
 */

'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface UploadFile {
  id: string;
  file: File;
  preview: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
  productId?: string;
}

interface BulkImageUploadProps {
  productId?: string;
  onUploadComplete?: (files: UploadFile[]) => void;
  onError?: (error: string) => void;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
}

const DEFAULT_ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const DEFAULT_MAX_SIZE = 5; // 5MB
const DEFAULT_MAX_FILES = 20;

export function BulkImageUpload({
  productId,
  onUploadComplete,
  onError,
  maxFiles = DEFAULT_MAX_FILES,
  maxFileSize = DEFAULT_MAX_SIZE,
  acceptedTypes = DEFAULT_ACCEPTED_TYPES,
}: BulkImageUploadProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate unique ID for each file
  const generateId = () => `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Validate file
  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `Invalid file type. Accepted: ${acceptedTypes.map(t => t.split('/')[1]).join(', ')}`;
    }
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File too large. Maximum size: ${maxFileSize}MB`;
    }
    return null;
  };

  // Create preview URL for file
  const createPreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  };

  // Handle file selection
  const handleFiles = useCallback(async (selectedFiles: FileList | File[]) => {
    const fileArray = Array.from(selectedFiles);
    
    if (files.length + fileArray.length > maxFiles) {
      onError?.(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const newFiles: UploadFile[] = [];
    
    for (const file of fileArray) {
      const error = validateFile(file);
      const preview = await createPreview(file);
      
      newFiles.push({
        id: generateId(),
        file,
        preview,
        status: error ? 'error' : 'pending',
        progress: 0,
        error: error || undefined,
        productId,
      });
    }

    setFiles(prev => [...prev, ...newFiles]);
  }, [files.length, maxFiles, productId, onError, acceptedTypes, maxFileSize]);

  // Handle drag events
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  // Remove file from list
  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  // Upload single file
  const uploadFile = async (uploadFile: UploadFile): Promise<UploadFile> => {
    try {
      // Update status to uploading
      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id ? { ...f, status: 'uploading' as const, progress: 0 } : f
      ));

      // Simulate upload progress (replace with actual upload logic)
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setFiles(prev => prev.map(f => 
          f.id === uploadFile.id ? { ...f, progress } : f
        ));
      }

      // Mark as success
      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id ? { ...f, status: 'success' as const, progress: 100 } : f
      ));

      return { ...uploadFile, status: 'success', progress: 100 };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id ? { ...f, status: 'error' as const, error: errorMessage } : f
      ));
      return { ...uploadFile, status: 'error', error: errorMessage };
    }
  };

  // Upload all pending files
  const uploadAll = async () => {
    setIsUploading(true);
    const pendingFiles = files.filter(f => f.status === 'pending');
    const results: UploadFile[] = [];

    for (const file of pendingFiles) {
      const result = await uploadFile(file);
      results.push(result);
    }

    setIsUploading(false);
    onUploadComplete?.(results);
  };

  // Clear all files
  const clearAll = () => {
    setFiles([]);
  };

  const pendingCount = files.filter(f => f.status === 'pending').length;
  const successCount = files.filter(f => f.status === 'success').length;
  const errorCount = files.filter(f => f.status === 'error').length;

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50',
          isUploading && 'pointer-events-none opacity-50'
        )}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />
        <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-lg font-medium text-foreground mb-1">
          {isDragging ? 'Drop images here' : 'Drag & drop images or click to browse'}
        </p>
        <p className="text-sm text-muted-foreground">
          {acceptedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')} • Max {maxFileSize}MB each • Up to {maxFiles} files
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted-foreground">{files.length} file(s)</span>
              {pendingCount > 0 && (
                <span className="text-amber-600 dark:text-amber-400">{pendingCount} pending</span>
              )}
              {successCount > 0 && (
                <span className="text-green-600 dark:text-green-400">{successCount} uploaded</span>
              )}
              {errorCount > 0 && (
                <span className="text-red-600 dark:text-red-400">{errorCount} failed</span>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={clearAll} disabled={isUploading}>
                Clear All
              </Button>
              <Button size="sm" onClick={uploadAll} disabled={isUploading || pendingCount === 0}>
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload All ({pendingCount})
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* File Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="relative group rounded-lg overflow-hidden border border-border bg-card"
              >
                {/* Preview Image */}
                <div className="aspect-square relative">
                  <img
                    src={file.preview}
                    alt={file.file.name}
                    className="w-full h-full object-cover"
                  />

                  {/* Status Overlay */}
                  {file.status === 'uploading' && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                      <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
                        <span className="text-sm font-medium">{file.progress}%</span>
                      </div>
                    </div>
                  )}

                  {file.status === 'success' && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    </div>
                  )}

                  {file.status === 'error' && (
                    <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                      <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                  )}

                  {/* Remove Button */}
                  {file.status !== 'uploading' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(file.id);
                      }}
                      className="absolute top-2 left-2 p-1 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* File Info */}
                <div className="p-2">
                  <p className="text-xs font-medium truncate" title={file.file.name}>
                    {file.file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(file.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  {file.error && (
                    <p className="text-xs text-red-500 truncate" title={file.error}>
                      {file.error}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

