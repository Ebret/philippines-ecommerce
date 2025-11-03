# Phase 20.1 Implementation Roadmap
## Testimonials & Media System - Complete Execution Plan

**Status:** ✅ Backend Ready | ⏳ Database Migration Pending
**Date:** 2025-11-02
**Total Tasks:** 5 Major Steps

---

## 📋 Complete Implementation Roadmap

### Step 1: Execute Database Migration ⏳
**Status:** AWAITING DATABASE SERVER
**Estimated Time:** 5-10 minutes
**Prerequisites:** PostgreSQL running

#### Actions Required
```bash
# 1. Ensure database is running
# Option A: Start Prisma Postgres
npx prisma dev

# Option B: Use external PostgreSQL
# Update DATABASE_URL in .env

# 2. Run migration
npx prisma migrate dev --name add_testimonials_feature

# 3. Generate Prisma client
npx prisma generate

# 4. Verify migration
npx prisma db execute --stdin
# Query: SELECT * FROM information_schema.tables WHERE table_schema = 'public';
```

#### Success Indicators
- ✅ No errors during migration
- ✅ Tables created: `testimonial`, `testimonial_media`
- ✅ Indexes created successfully
- ✅ Prisma client generated

#### Deliverables
- Migration file: `prisma/migrations/[timestamp]_add_testimonials_feature/migration.sql`
- Updated Prisma client
- Database schema applied

---

### Step 2: Verify API Endpoints ⏳
**Status:** PENDING DATABASE MIGRATION
**Estimated Time:** 15-20 minutes
**Prerequisites:** Database migration complete

#### Actions Required
```bash
# 1. Start development server
npm run dev

# 2. Test public endpoints
curl -X GET http://localhost:3000/api/testimonials
curl -X GET http://localhost:3000/api/testimonials/test-id

# 3. Test authenticated endpoints (requires auth token)
curl -X POST http://localhost:3000/api/testimonials \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"productId":"test","rating":5,"title":"Test","content":"Test content"}'

# 4. Run integration tests
npm test -- --run src/__tests__/integration/testimonials.integration.test.ts
```

#### Success Indicators
- ✅ All endpoints respond with correct status codes
- ✅ Database queries execute successfully
- ✅ Authentication/authorization working
- ✅ Error handling working
- ✅ All 62 tests passing

#### Deliverables
- Verified API endpoints
- Test results report
- Performance metrics

---

### Step 3: Set up Media Processing Infrastructure ⏳
**Status:** PENDING API VERIFICATION
**Estimated Time:** 30-45 minutes
**Prerequisites:** API endpoints verified

#### Actions Required

##### 3.1 Install Media Processing Libraries
```bash
# Install FFmpeg (for video processing)
# Windows: Download from https://ffmpeg.org/download.html
# macOS: brew install ffmpeg
# Linux: sudo apt-get install ffmpeg

# Install Sharp (for image processing)
npm install sharp

# Verify installations
ffmpeg -version
node -e "console.log(require('sharp').versions)"
```

##### 3.2 Update Media Processor Implementation
```typescript
// src/lib/media-processor.ts

// Update processVideo function
export async function processVideo(
  file: File,
  outputPath: string
): Promise<ProcessedVideo> {
  // Implement actual FFmpeg transcoding
  // - Input validation
  // - Transcoding to H.264
  // - Thumbnail generation
  // - Metadata extraction
}

// Update processPhoto function
export async function processPhoto(
  file: File,
  outputPath: string
): Promise<ProcessedPhoto> {
  // Implement actual Sharp compression
  // - Input validation
  // - Resize to multiple sizes
  // - Compress with quality settings
  // - Convert to WebP
}
```

##### 3.3 Configure Environment Variables
```bash
# Add to .env
FFMPEG_PATH=/usr/bin/ffmpeg
SHARP_CONCURRENCY=4
MEDIA_UPLOAD_DIR=/tmp/media
MEDIA_MAX_VIDEO_SIZE=524288000  # 500MB
MEDIA_MAX_PHOTO_SIZE=10485760   # 10MB
```

##### 3.4 Test Media Processing
```bash
# Run media processor tests
npm test -- --run src/__tests__/unit/lib/media-processor.test.ts

# Test with actual files
node -e "
const { processVideo, processPhoto } = require('./src/lib/media-processor');
// Test with sample files
"
```

#### Success Indicators
- ✅ FFmpeg installed and working
- ✅ Sharp installed and working
- ✅ Media processor tests passing
- ✅ Video transcoding working
- ✅ Photo compression working
- ✅ Thumbnail generation working

#### Deliverables
- Updated media-processor.ts with actual implementations
- FFmpeg/Sharp integration complete
- Media processing tests passing
- Performance benchmarks

---

### Step 4: Configure CDN Integration ⏳
**Status:** PENDING MEDIA PROCESSING
**Estimated Time:** 20-30 minutes
**Prerequisites:** Media processing setup complete

#### Actions Required

##### 4.1 Choose CDN Provider

**Option A: AWS S3**
```bash
# Install AWS SDK
npm install @aws-sdk/client-s3

# Configure credentials in .env
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_S3_BUCKET=testimonials
AWS_S3_REGION=us-east-1
```

**Option B: Cloudinary**
```bash
# Install Cloudinary SDK
npm install cloudinary

# Configure credentials in .env
CLOUDINARY_URL=cloudinary://key:secret@cloud
```

##### 4.2 Update CDN Functions
```typescript
// src/lib/media-processor.ts

// Update uploadMediaToCDN
export async function uploadMediaToCDN(
  filePath: string,
  mediaType: string
): Promise<CDNUploadResult> {
  // Implement actual CDN upload
  // - Connect to AWS S3 or Cloudinary
  // - Upload file
  // - Return CDN URL
}

// Update deleteMediaFromCDN
export async function deleteMediaFromCDN(
  cdnUrl: string
): Promise<void> {
  // Implement actual CDN deletion
  // - Connect to AWS S3 or Cloudinary
  // - Delete file
}
```

##### 4.3 Test CDN Integration
```bash
# Run CDN integration tests
npm test -- --run src/__tests__/unit/lib/media-processor.test.ts

# Test upload/delete
node -e "
const { uploadMediaToCDN, deleteMediaFromCDN } = require('./src/lib/media-processor');
// Test with sample files
"
```

#### Success Indicators
- ✅ CDN credentials configured
- ✅ Upload function working
- ✅ Delete function working
- ✅ CDN URLs returned correctly
- ✅ File accessible via CDN URL
- ✅ CDN integration tests passing

#### Deliverables
- CDN integration complete
- Upload/delete functions working
- CDN integration tests passing
- Performance metrics

---

### Step 5: Begin Frontend Development ⏳
**Status:** PENDING CDN INTEGRATION
**Estimated Time:** 2-3 days
**Prerequisites:** All backend steps complete

#### Actions Required

##### 5.1 Create Testimonial Components
```typescript
// src/components/testimonials/

// Components to create:
- TestimonialCard.tsx          // Display single testimonial
- TestimonialList.tsx          // List of testimonials
- TestimonialForm.tsx          // Create/edit form
- TestimonialMedia.tsx         // Media display
- TestimonialVoting.tsx        // Helpful/unhelpful voting
- TestimonialRating.tsx        // Star rating display
```

##### 5.2 Create Media Upload Component
```typescript
// src/components/media/

// Components to create:
- MediaUploader.tsx            // File upload interface
- MediaPreview.tsx             // Preview uploaded media
- MediaGallery.tsx             // Display media gallery
- VideoPlayer.tsx              // Video playback
- ImageGallery.tsx             // Image gallery
```

##### 5.3 Create Vendor Dashboard
```typescript
// src/components/dashboard/

// Components to create:
- TestimonialDashboard.tsx     // Main dashboard
- TestimonialStats.tsx         // Statistics display
- TestimonialChart.tsx         // Analytics charts
- TestimonialFilter.tsx        // Filtering interface
- TestimonialExport.tsx        // Export functionality
```

##### 5.4 Create Pages
```typescript
// src/app/

// Pages to create:
- /testimonials                // Public testimonials list
- /testimonials/[id]           // Testimonial detail
- /testimonials/create         // Create testimonial
- /vendor/testimonials         // Vendor dashboard
- /admin/testimonials          // Admin moderation
```

##### 5.5 Write Component Tests
```bash
# Create comprehensive tests for all components
npm test -- --run src/__tests__/unit/components/testimonials/

# Target: 100+ new tests
# Pass rate: 100%
```

#### Success Indicators
- ✅ All components created
- ✅ All pages created
- ✅ 100+ component tests passing
- ✅ Responsive design working
- ✅ Accessibility compliance
- ✅ Integration with API working

#### Deliverables
- 15+ React components
- 5+ pages
- 100+ component tests
- Storybook stories
- Component documentation

---

## 📊 Timeline & Dependencies

```
Step 1: Database Migration (5-10 min)
   ↓
Step 2: API Verification (15-20 min)
   ↓
Step 3: Media Processing (30-45 min)
   ↓
Step 4: CDN Integration (20-30 min)
   ↓
Step 5: Frontend Development (2-3 days)

Total Time: ~3-4 days
```

---

## 🎯 Success Criteria

### Overall
- ✅ All 5 steps completed
- ✅ All tests passing (100% pass rate)
- ✅ All components working
- ✅ All endpoints verified
- ✅ Production-ready code

### Per Step
1. **Database:** Tables created, migration successful
2. **API:** All endpoints responding, tests passing
3. **Media:** FFmpeg/Sharp working, tests passing
4. **CDN:** Upload/delete working, tests passing
5. **Frontend:** Components created, tests passing

---

## 📋 Checklist

### Pre-Implementation
- [ ] Database server running
- [ ] DATABASE_URL configured
- [ ] All dependencies installed
- [ ] Tests passing (62/62)

### Step 1: Database Migration
- [ ] Migration executed successfully
- [ ] Tables created
- [ ] Indexes created
- [ ] Prisma client generated

### Step 2: API Verification
- [ ] All 12 endpoints tested
- [ ] Database queries working
- [ ] Authentication working
- [ ] Error handling working
- [ ] Integration tests passing

### Step 3: Media Processing
- [ ] FFmpeg installed
- [ ] Sharp installed
- [ ] Media processor updated
- [ ] Video processing working
- [ ] Photo compression working
- [ ] Tests passing

### Step 4: CDN Integration
- [ ] CDN credentials configured
- [ ] Upload function working
- [ ] Delete function working
- [ ] CDN URLs returned
- [ ] Tests passing

### Step 5: Frontend Development
- [ ] Components created
- [ ] Pages created
- [ ] Component tests passing
- [ ] Responsive design working
- [ ] API integration working

---

## 📞 Support Resources

### Documentation
- `PHASE_20_1_DEPLOYMENT_CHECKLIST.md` - Deployment guide
- `docs/PHASE_20_1_DEVELOPER_GUIDE.md` - API reference
- `docs/PHASE_20_1_QUICK_REFERENCE.md` - Quick reference
- `PHASE_20_1_MIGRATION_STATUS.md` - Migration status

### Test Files
- `src/__tests__/unit/validations/testimonials.test.ts`
- `src/__tests__/unit/lib/media-processor.test.ts`
- `src/__tests__/integration/testimonials.integration.test.ts`

### Configuration
- `.env` - Environment variables
- `prisma/schema.prisma` - Database schema
- `tsconfig.json` - TypeScript config

---

**Document Version:** 1.0
**Last Updated:** 2025-11-02
**Status:** READY FOR EXECUTION
**Next Action:** Start database and execute Step 1

**To begin: Start your PostgreSQL database and run:**
```bash
npx prisma migrate dev --name add_testimonials_feature
```

