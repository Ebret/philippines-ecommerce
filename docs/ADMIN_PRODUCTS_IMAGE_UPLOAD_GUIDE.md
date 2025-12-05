# Admin Products - Image Upload Feature Guide

## Overview

The Admin Products feature now includes comprehensive image upload functionality, allowing admins to:
- Upload product images with preview
- Set primary/featured image
- Delete images
- Add alt text for accessibility
- Manage multiple images per product

---

## Features

### 1. Image Upload
- **File Types**: PNG, JPG, GIF, WebP
- **Max Size**: 5MB per image
- **Preview**: Real-time preview before upload
- **Alt Text**: Optional accessibility text

### 2. Image Management
- **Grid Display**: View all product images
- **Primary Image**: Mark one image as primary (featured)
- **Delete**: Remove images from product
- **Sorting**: Images sorted by sort order

### 3. User Experience
- **Drag & Drop**: Support for drag and drop (future enhancement)
- **Progress Indicator**: Loading state during upload
- **Error Handling**: Clear error messages
- **Toast Notifications**: Success/error feedback

---

## API Endpoints

### Upload Image
```
POST /api/products/:id/images
Content-Type: application/json

{
  "url": "https://example.com/image.jpg",
  "altText": "Product description",
  "isPrimary": false
}

Response: 201 Created
{
  "id": "img_123",
  "url": "https://example.com/image.jpg",
  "altText": "Product description",
  "isPrimary": false,
  "sortOrder": 0,
  "productId": "prod_123"
}
```

### Get Images
```
GET /api/products/:id/images

Response: 200 OK
[
  {
    "id": "img_123",
    "url": "https://example.com/image.jpg",
    "altText": "Product description",
    "isPrimary": true,
    "sortOrder": 0
  }
]
```

### Set Primary Image
```
PATCH /api/products/:id/images/:imageId
Content-Type: application/json

{
  "isPrimary": true
}

Response: 200 OK
```

### Delete Image
```
DELETE /api/products/:id/images/:imageId

Response: 200 OK
{ "success": true }
```

---

## Component Structure

### ProductImageUpload Component
**Location**: `src/app/admin/products/product-image-upload.tsx`

**Props**:
- `productId: string` - Product ID
- `images: ProductImage[]` - Current images
- `onImagesUpdated: () => void` - Callback when images change

**Features**:
- File input with validation
- Image preview
- Upload progress
- Image grid display
- Delete functionality
- Primary image selection

---

## Testing

### Unit Tests
**Location**: `src/__tests__/product-image-upload.test.ts`

**Test Coverage**:
- Image upload validation (file type, size)
- Image API operations (create, read, delete)
- Primary image management
- Image grid display
- Error handling
- UI state management

**Run Tests**:
```bash
npm test product-image-upload
```

---

## Usage Guide

### For Admins

1. **Navigate to Admin Products**
   - Go to `/admin/products`
   - Click "Edit" on a product

2. **Upload Images**
   - Scroll to "Product Images" section
   - Click "Select Image" or drag & drop
   - Add optional alt text
   - Click "Upload Image"

3. **Manage Images**
   - Hover over image to see options
   - Click star icon to set as primary
   - Click X icon to delete

4. **Save Changes**
   - Click "Save Changes" to update product

---

## Validation Rules

### File Validation
- ✅ Must be image file (PNG, JPG, GIF, WebP)
- ✅ Maximum 5MB size
- ✅ Valid image format

### Image Data Validation
- ✅ URL must be valid HTTP/HTTPS URL
- ✅ Alt text max 255 characters
- ✅ Sort order must be non-negative integer
- ✅ isPrimary must be boolean

---

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Please select an image file" | Non-image file selected | Select PNG, JPG, GIF, or WebP |
| "Image must be less than 5MB" | File too large | Compress image or select smaller file |
| "Failed to upload image" | API error | Check network and try again |
| "Failed to delete image" | API error | Check network and try again |
| "Unauthorized" | Not admin role | Login with admin account |

---

## Mobile Responsiveness

### Desktop (1920px+)
- 3-column image grid
- Full upload interface
- All controls visible

### Tablet (768px)
- 2-column image grid
- Responsive upload area
- Touch-friendly buttons

### Mobile (375px)
- 2-column image grid
- Stacked upload interface
- Large touch targets

---

## Dark Mode Support

The image upload component fully supports dark mode:
- ✅ Dark background for upload area
- ✅ Proper contrast for text
- ✅ Visible image previews
- ✅ Clear button styling

---

## Performance Considerations

- **Image Preview**: Uses FileReader API for client-side preview
- **Lazy Loading**: Images loaded on demand
- **Caching**: Browser caches image URLs
- **Optimization**: Consider image optimization service for production

---

## Future Enhancements

- [ ] Drag and drop support
- [ ] Batch upload multiple images
- [ ] Image cropping/editing
- [ ] Image optimization (compression)
- [ ] CDN integration for image storage
- [ ] Image sorting/reordering
- [ ] Bulk image operations

---

## Related Documentation

- [Admin Products Feature Guide](./ADMIN_PRODUCTS_FEATURE_GUIDE.md)
- [Product API Documentation](./PRODUCT_API_GUIDE.md)
- [Testing Guide](./TESTING_GUIDE.md)

