# Phase 20.1 Quick Reference Card
## Testimonials & Media System - Cheat Sheet

---

## Database Models

### Testimonial
```prisma
id                    String (CUID)
productId             String (FK)
vendorId              String (FK)
userId                String (FK)
rating                Int (1-5)
title                 String
content               String
mediaUrls             String[]
mediaTypes            String[]
beforeAfterComparison Json?
isVerified            Boolean
isFeatured            Boolean
status                TestimonialStatus
viewCount             Int
helpfulCount          Int
notHelpfulCount       Int
createdAt             DateTime
updatedAt             DateTime
```

### TestimonialMedia
```prisma
id                String (CUID)
testimonialId     String (FK)
mediaUrl          String
mediaType         String (video|photo)
duration          Int? (seconds)
fileSize          Int
mimeType          String
uploadedAt        DateTime
```

---

## API Endpoints Quick Reference

### Create Testimonial
```bash
POST /api/testimonials
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "clh1234567890abcdefghijkl",
  "rating": 5,
  "title": "Amazing!",
  "content": "This product is great...",
  "mediaUrls": [],
  "isAnonymous": false
}
```

### Get Testimonials
```bash
GET /api/testimonials?productId=xxx&status=APPROVED&page=1&limit=10
```

### Update Testimonial
```bash
PATCH /api/testimonials/[id]
Authorization: Bearer <token>

{
  "rating": 4,
  "title": "Updated title"
}
```

### Delete Testimonial
```bash
DELETE /api/testimonials/[id]
Authorization: Bearer <token>
```

### Upload Media
```bash
POST /api/testimonials/[id]/upload-media
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <File>
mediaType: "video" or "photo"
```

### Vote on Testimonial
```bash
POST /api/testimonials/[id]/vote

{
  "voteType": "helpful" or "unhelpful"
}
```

### Moderate Testimonial (Admin)
```bash
PATCH /api/testimonials/[id]/moderate
Authorization: Bearer <admin-token>

{
  "status": "APPROVED|REJECTED|FEATURED",
  "rejectionReason": "Optional"
}
```

### Vendor Dashboard
```bash
GET /api/vendors/testimonials/dashboard?timeRange=30d&sortBy=date&page=1&limit=20
Authorization: Bearer <vendor-token>
```

---

## Validation Schemas

### Create Testimonial
```typescript
{
  productId: string (CUID),
  rating: number (1-5),
  title: string (min 10, max 200),
  content: string (min 20, max 5000),
  mediaUrls?: string[] (max 10),
  isAnonymous?: boolean
}
```

### Query Parameters
```typescript
{
  productId?: string,
  vendorId?: string,
  status?: "PENDING" | "APPROVED" | "REJECTED" | "FEATURED",
  isFeatured?: boolean,
  minRating?: number (1-5),
  maxRating?: number (1-5),
  sortBy?: "createdAt" | "rating" | "helpfulCount" | "viewCount",
  sortOrder?: "asc" | "desc",
  page?: number (min 1),
  limit?: number (1-100)
}
```

### Media Upload
```typescript
{
  mediaType: "video" | "photo",
  fileSize: number,
  mimeType: string,
  duration?: number (for videos)
}
```

---

## File Limits

### Video
- Max size: 500 MB
- Formats: MP4, WebM, MOV
- Duration: Max 10 minutes

### Photo
- Max size: 10 MB
- Formats: JPEG, PNG, WebP
- Dimensions: Max 4000x4000px

---

## Status Values

```
PENDING   - Awaiting moderation
APPROVED  - Approved by admin
REJECTED  - Rejected by admin
FEATURED  - Featured on product page
```

---

## Common Queries

### Get Approved Testimonials for Product
```typescript
const testimonials = await prisma.testimonial.findMany({
  where: {
    productId: "product-id",
    status: "APPROVED"
  },
  orderBy: { createdAt: "desc" },
  take: 10
});
```

### Get Featured Testimonials
```typescript
const featured = await prisma.testimonial.findMany({
  where: { isFeatured: true },
  orderBy: { helpfulCount: "desc" },
  take: 5
});
```

### Get Vendor Statistics
```typescript
const stats = await prisma.testimonial.aggregate({
  where: { vendorId: "vendor-id" },
  _avg: { rating: true },
  _count: { id: true }
});
```

### Get Testimonials with Media
```typescript
const testimonials = await prisma.testimonial.findMany({
  where: { mediaUrls: { hasSome: [""] } },
  include: { media: true }
});
```

---

## Error Codes

```
400 Bad Request        - Invalid input data
401 Unauthorized       - Missing authentication
403 Forbidden          - Not authorized for action
404 Not Found          - Resource not found
409 Conflict           - Duplicate or conflict
413 Payload Too Large  - File too large
422 Unprocessable      - Validation failed
500 Server Error       - Internal error
```

---

## Testing Commands

```bash
# Run all testimonials tests
npm test -- --run src/__tests__/unit/validations/testimonials.test.ts \
  src/__tests__/unit/lib/media-processor.test.ts \
  src/__tests__/integration/testimonials.integration.test.ts

# Run specific test
npm test -- --run src/__tests__/unit/validations/testimonials.test.ts

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- src/__tests__/unit/validations/testimonials.test.ts
```

---

## Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/db

# CDN (AWS S3)
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_S3_BUCKET=testimonials
AWS_S3_REGION=us-east-1

# CDN (Cloudinary)
CLOUDINARY_URL=cloudinary://key:secret@cloud

# Media Processing
FFMPEG_PATH=/usr/bin/ffmpeg
```

---

## Useful Links

- **API Documentation:** `docs/PHASE_20_1_DEVELOPER_GUIDE.md`
- **Implementation Progress:** `docs/PHASE_20_1_IMPLEMENTATION_PROGRESS.md`
- **Completion Summary:** `docs/PHASE_20_1_COMPLETION_SUMMARY.md`
- **Next Steps:** `docs/PHASE_20_1_NEXT_STEPS.md`

---

## Key Files

```
src/
├── lib/
│   ├── validations/testimonials.ts
│   └── media-processor.ts
├── app/api/
│   ├── testimonials/
│   │   ├── route.ts
│   │   └── [id]/
│   │       ├── route.ts
│   │       ├── upload-media/route.ts
│   │       ├── moderate/route.ts
│   │       └── vote/route.ts
│   └── vendors/testimonials/
│       └── dashboard/route.ts
└── __tests__/
    ├── unit/
    │   ├── validations/testimonials.test.ts
    │   └── lib/media-processor.test.ts
    └── integration/
        └── testimonials.integration.test.ts

prisma/
└── schema.prisma

docs/
├── PHASE_20_1_IMPLEMENTATION_PROGRESS.md
├── PHASE_20_1_DEVELOPER_GUIDE.md
├── PHASE_20_1_COMPLETION_SUMMARY.md
├── PHASE_20_1_NEXT_STEPS.md
└── PHASE_20_1_QUICK_REFERENCE.md
```

---

## Quick Troubleshooting

### Database Migration Failed
```bash
# Rollback
npx prisma migrate resolve --rolled-back add_testimonials_feature

# Try again
npx prisma migrate dev --name add_testimonials_feature
```

### Tests Failing
```bash
# Clear cache
rm -rf node_modules/.vitest

# Reinstall
npm install

# Run tests
npm test -- --run
```

### Media Upload Issues
```bash
# Check file size
ls -lh file.mp4

# Check MIME type
file -b --mime-type file.mp4

# Verify CDN credentials
echo $AWS_ACCESS_KEY_ID
```

---

## Performance Tips

1. **Use Pagination** - Always paginate large result sets
2. **Filter Early** - Filter in database, not in app
3. **Use Indexes** - Query on indexed fields
4. **Cache Results** - Cache frequently accessed data
5. **Compress Media** - Compress before upload
6. **Use CDN** - Serve media from CDN

---

**Version:** 1.0
**Last Updated:** 2025-11-02
**Status:** Ready for Use

