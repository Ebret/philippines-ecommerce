# Media Processing Quick Start Guide

## 5-Minute Setup

### 1. Install FFmpeg

**Windows (Chocolatey):**
```bash
choco install ffmpeg
```

**macOS:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt-get install ffmpeg
```

### 2. Set Environment Variables

Create `.env.local`:
```env
CONTABO_ENDPOINT=https://usc1.contabostorage.com
CONTABO_REGION=usc1
CONTABO_ACCESS_KEY=your-access-key
CONTABO_SECRET_KEY=your-secret-key
CONTABO_BUCKET=philippines-ecommerce
CDN_URL=https://cdn.extremelifeherbal.com
```

### 3. Install Dependencies

```bash
npm install sharp fluent-ffmpeg @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

## Usage Examples

### Upload Video to Testimonial

```typescript
import { processVideo } from '@/lib/media-processor';

const videoFile = new File([...], 'testimonial.mp4', { type: 'video/mp4' });

const processed = await processVideo(videoFile);

console.log({
  originalUrl: processed.originalUrl,
  cdnUrl: processed.cdnUrl,
  thumbnailUrl: processed.thumbnailUrl,
  resolutions: processed.resolutions,
  duration: processed.duration,
  width: processed.width,
  height: processed.height
});
```

### Upload Photo to Testimonial

```typescript
import { processPhoto } from '@/lib/media-processor';

const photoFile = new File([...], 'testimonial.jpg', { type: 'image/jpeg' });

const processed = await processPhoto(photoFile);

console.log({
  originalUrl: processed.originalUrl,
  cdnUrl: processed.cdnUrl,
  webpUrl: processed.webpUrl,
  thumbnailUrl: processed.thumbnailUrl,
  width: processed.width,
  height: processed.height
});
```

### Extract Media Metadata

```typescript
import { extractMediaMetadata } from '@/lib/media-processor';

const metadata = await extractMediaMetadata(file);

console.log({
  type: metadata.type,
  duration: metadata.duration,
  width: metadata.width,
  height: metadata.height,
  fileSize: metadata.fileSize
});
```

### Upload to Contabo Directly

```typescript
import { uploadToContabo, getCdnUrl } from '@/lib/contabo-storage';

const result = await uploadToContabo(file, 'testimonials/videos', {
  contentType: 'video/mp4',
  isPublic: true
});

console.log({
  key: result.key,
  url: result.url,
  cdnUrl: result.cdnUrl,
  size: result.size
});
```

### Delete Media from CDN

```typescript
import { deleteMediaFromCDN } from '@/lib/media-processor';

const success = await deleteMediaFromCDN(mediaUrl);
console.log('Deleted:', success);
```

## API Endpoint

### Upload Media to Testimonial

```bash
POST /api/testimonials/{testimonialId}/upload-media

Content-Type: multipart/form-data

Parameters:
- file: File (video or image)
- mediaType: "video" | "photo"
```

**Success Response (200):**
```json
{
  "success": true,
  "media": {
    "id": "media-123",
    "testimonialId": "testimonial-456",
    "mediaType": "video",
    "mediaUrl": "https://storage.example.com/...",
    "cdnUrl": "https://cdn.example.com/...",
    "thumbnailUrl": "https://cdn.example.com/...",
    "duration": 120,
    "fileSize": 52428800,
    "mimeType": "video/mp4",
    "width": 1920,
    "height": 1080,
    "resolutions": {
      "360p": "https://cdn.example.com/...",
      "720p": "https://cdn.example.com/...",
      "1080p": "https://cdn.example.com/..."
    }
  }
}
```

**Error Response (400/500):**
```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

## File Size Limits

- **Videos**: 500MB max
- **Photos**: 10MB max

## Supported Formats

**Videos:**
- MP4 (.mp4)
- WebM (.webm)
- QuickTime (.mov)

**Photos:**
- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)

## Storage Structure

```
philippines-ecommerce/
├── testimonials/
│   ├── videos/
│   │   ├── originals/
│   │   ├── 360p/
│   │   ├── 720p/
│   │   ├── 1080p/
│   │   └── thumbnails/
│   └── photos/
│       ├── originals/
│       ├── webp/
│       └── thumbnails/
```

## Video Resolutions

| Resolution | Dimensions | Use Case |
|-----------|-----------|----------|
| 360p | 640x360 | Mobile devices |
| 720p | 1280x720 | Tablets, laptops |
| 1080p | 1920x1080 | Desktop, high-quality |

## Photo Optimization

| Format | Quality | Use Case |
|--------|---------|----------|
| Original | 100% | High-quality viewing |
| WebP | 80% | Web delivery (30-40% smaller) |
| Thumbnail | 80% | Preview (320x180) |

## Testing

```bash
# Run all tests
npm test -- --run

# Run media processor tests
npm test -- --run src/__tests__/unit/lib/media-processor-real.test.ts

# Run Contabo storage tests
npm test -- --run src/__tests__/unit/lib/contabo-storage.test.ts

# Watch mode
npm test
```

## Troubleshooting

### FFmpeg Not Found
```bash
# Verify installation
ffmpeg -version

# Set custom path in .env
FFMPEG_PATH=/usr/local/bin/ffmpeg
```

### Contabo Connection Error
```bash
# Check credentials
echo $CONTABO_ACCESS_KEY
echo $CONTABO_SECRET_KEY

# Test connectivity
curl -X GET https://usc1.contabostorage.com/
```

### File Upload Fails
- Check file size (under limits)
- Verify file format (supported types)
- Ensure Contabo bucket exists
- Check disk space for temp files

## Performance Tips

1. **Use CDN URLs** for public media delivery
2. **Cache thumbnails** on client side
3. **Lazy load** video players
4. **Use WebP** for photos when possible
5. **Monitor** processing queue for bottlenecks

## Security Best Practices

1. ✅ Always validate file types
2. ✅ Enforce file size limits
3. ✅ Use signed URLs for private files
4. ✅ Enable HTTPS/TLS
5. ✅ Rotate Contabo credentials regularly
6. ✅ Monitor access logs

## Next Steps

1. Configure Contabo credentials
2. Install FFmpeg on your system
3. Test media upload workflow
4. Monitor processing performance
5. Set up CDN caching headers
6. Implement async processing queue (optional)

## Support

For issues or questions:
1. Check MEDIA_PROCESSING_SETUP.md for detailed docs
2. Review test files for usage examples
3. Check error logs for specific issues
4. Contact Contabo support for storage issues

