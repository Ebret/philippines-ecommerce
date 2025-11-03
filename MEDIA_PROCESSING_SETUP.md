# Media Processing Infrastructure Setup Guide

## Overview

This document describes the media processing infrastructure for the Philippines E-Commerce Platform's Testimonials & Media System. The system uses FFmpeg for video processing, Sharp for image optimization, and Contabo Object Storage for CDN delivery.

## Architecture

### Components

1. **Media Processor** (`src/lib/media-processor.ts`)
   - Real FFmpeg-based video processing
   - Sharp-based image optimization
   - Metadata extraction
   - Thumbnail generation
   - CDN upload orchestration

2. **Contabo Storage** (`src/lib/contabo-storage.ts`)
   - S3-compatible API integration
   - File upload/download/delete operations
   - CDN URL generation
   - Signed URL generation for private files

3. **Media Upload Endpoint** (`src/app/api/testimonials/[id]/upload-media/route.ts`)
   - Handles media file uploads
   - Validates file types and sizes
   - Processes media files
   - Stores metadata in database

## Installation & Configuration

### 1. Install Dependencies

```bash
npm install sharp fluent-ffmpeg aws-sdk @aws-sdk/client-s3 @aws-sdk/s3-request-presigner dotenv
npm install --save-dev @types/fluent-ffmpeg
```

### 2. Install FFmpeg

**Windows:**
```bash
# Using Chocolatey
choco install ffmpeg

# Or download from: https://ffmpeg.org/download.html
```

**macOS:**
```bash
brew install ffmpeg
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install ffmpeg
```

### 3. Configure Environment Variables

Create a `.env.local` file with the following:

```env
# Contabo Object Storage Configuration
CONTABO_ENDPOINT="https://usc1.contabostorage.com"
CONTABO_REGION="usc1"
CONTABO_ACCESS_KEY="your-access-key"
CONTABO_SECRET_KEY="your-secret-key"
CONTABO_BUCKET="philippines-ecommerce"

# CDN Configuration
CDN_URL="https://cdn.extremelifeherbal.com"

# Media Processing
FFMPEG_PATH="ffmpeg"
MAX_VIDEO_SIZE="524288000"  # 500MB
MAX_PHOTO_SIZE="10485760"   # 10MB
```

### 4. Set Up Contabo Object Storage

1. Create a Contabo account at https://contabo.com
2. Navigate to Object Storage section
3. Create a new bucket (e.g., "philippines-ecommerce")
4. Generate API credentials (Access Key & Secret Key)
5. Configure CORS for your domain
6. Set up CDN (optional but recommended)

## Media Processing Pipeline

### Video Processing

```
Input Video
    ↓
Validate (format, size)
    ↓
Upload Original to Contabo
    ↓
Extract Metadata (duration, resolution)
    ↓
Generate Thumbnail (5s mark)
    ↓
Transcode to Multiple Resolutions
    ├─ 360p (640x360)
    ├─ 720p (1280x720)
    └─ 1080p (1920x1080)
    ↓
Upload All Versions to Contabo
    ↓
Return URLs & Metadata
```

### Photo Processing

```
Input Photo
    ↓
Validate (format, size)
    ↓
Upload Original to Contabo
    ↓
Extract Metadata (dimensions)
    ↓
Create WebP Version (optimized)
    ↓
Create Thumbnail (320x180)
    ↓
Upload All Versions to Contabo
    ↓
Return URLs & Metadata
```

## API Usage

### Upload Media to Testimonial

```bash
POST /api/testimonials/{id}/upload-media

Content-Type: multipart/form-data

Body:
- file: <video or image file>
- mediaType: "video" | "photo"
```

**Response:**
```json
{
  "success": true,
  "media": {
    "id": "media-123",
    "testimonialId": "testimonial-456",
    "mediaType": "video",
    "mediaUrl": "https://storage.example.com/testimonials/videos/originals/...",
    "cdnUrl": "https://cdn.example.com/testimonials/videos/originals/...",
    "thumbnailUrl": "https://cdn.example.com/testimonials/videos/thumbnails/...",
    "duration": 120,
    "fileSize": 52428800,
    "mimeType": "video/mp4",
    "width": 1920,
    "height": 1080,
    "resolutions": {
      "360p": "https://cdn.example.com/testimonials/videos/360p/...",
      "720p": "https://cdn.example.com/testimonials/videos/720p/...",
      "1080p": "https://cdn.example.com/testimonials/videos/1080p/..."
    }
  }
}
```

## File Storage Structure

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

## Performance Optimization

### Video Processing
- **Codec**: H.264 (libx264) for compatibility
- **Bitrate**: 2500k for quality/size balance
- **Resolutions**: 360p, 720p, 1080p for adaptive streaming
- **Thumbnail**: 320x180 at 5-second mark

### Photo Processing
- **WebP Conversion**: 80% quality for 30-40% size reduction
- **Thumbnail**: 320x180 cover crop
- **Original**: Preserved for high-quality viewing

### CDN Delivery
- **Caching**: 30 days for processed media
- **Compression**: Gzip enabled
- **Optimization**: Automatic format selection

## Testing

### Run Tests

```bash
# All tests
npm test -- --run

# Media processor tests only
npm test -- --run src/__tests__/unit/lib/media-processor.test.ts

# Contabo storage tests only
npm test -- --run src/__tests__/unit/lib/contabo-storage.test.ts
```

### Test Coverage

- **Media Processor**: 17 tests covering video/photo processing, metadata extraction, CDN operations
- **Contabo Storage**: 19 tests covering S3 operations, URL generation, configuration validation
- **Integration Tests**: 18 tests for complete media upload workflow

## Troubleshooting

### FFmpeg Not Found
```bash
# Check if FFmpeg is installed
ffmpeg -version

# Set custom FFmpeg path in .env
FFMPEG_PATH="/usr/local/bin/ffmpeg"
```

### Contabo Connection Issues
```bash
# Verify credentials
CONTABO_ACCESS_KEY=your-key
CONTABO_SECRET_KEY=your-secret

# Test connection
curl -X GET https://usc1.contabostorage.com/
```

### File Upload Failures
- Check file size limits (500MB video, 10MB photo)
- Verify file format (MP4, WebM, JPEG, PNG, WebP)
- Ensure Contabo bucket exists and is accessible
- Check disk space for temporary processing files

## Production Deployment

1. **Install FFmpeg** on production server
2. **Configure Contabo credentials** in environment variables
3. **Set up CDN** with proper caching headers
4. **Monitor** media processing queue
5. **Backup** original files to secondary storage
6. **Test** media upload workflow end-to-end

## Security Considerations

- **File Validation**: Strict MIME type and size checks
- **Virus Scanning**: Consider adding ClamAV for production
- **Access Control**: Private files use signed URLs
- **Encryption**: Enable SSL/TLS for all transfers
- **Rate Limiting**: Implement upload rate limits per user

## Future Enhancements

- [ ] Async media processing queue (Bull/BullMQ)
- [ ] Watermark addition for videos
- [ ] Subtitle/caption support
- [ ] Advanced video analytics
- [ ] Automatic quality detection
- [ ] Multi-region CDN distribution

