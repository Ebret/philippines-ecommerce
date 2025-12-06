/**
 * Image Management Components
 * Phase 26.3: Product Image Management Enhancements
 * 
 * Export all image-related components for easy importing
 */

// Phase 26.3.1: Bulk Image Upload
export { BulkImageUpload } from './bulk-image-upload';
export type { UploadFile } from './bulk-image-upload';

// Phase 26.3.2: Image Optimization & Compression
export { ImageOptimizer } from './image-optimizer';
export type { OptimizationSettings } from './image-optimizer';

// Phase 26.3.3: Image Gallery Management
export { ImageGalleryManager } from './image-gallery-manager';
export type { GalleryImage } from './image-gallery-manager';

// Phase 26.3.4: Image Cropping & Editing
export { ImageCropper } from './image-cropper';
export type { CropArea, ImageTransform } from './image-cropper';

// Phase 26.3.5: Image Variants
export { ImageVariantsGenerator } from './image-variants-generator';
export type { ImageVariant } from './image-variants-generator';

// Phase 26.3.6: CDN Integration
export { CDNImageManager } from './cdn-image-manager';
export type { CDNImage } from './cdn-image-manager';

