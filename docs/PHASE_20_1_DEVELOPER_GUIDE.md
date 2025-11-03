# Phase 20.1 Developer Guide
## Testimonials & Media System - Quick Reference

**Last Updated:** 2025-11-02
**Status:** Implementation Ready

---

## Quick Start

### 1. Database Setup
```bash
# Apply migrations when database is available
cd philippines-ecommerce
npx prisma migrate dev --name add_testimonials_feature

# Generate Prisma client
npx prisma generate
```

### 2. Run Tests
```bash
# Run all tests
npm test

# Run specific test file
npm test -- testimonials.test.ts

# Run with coverage
npm test -- --coverage
```

### 3. Start Development Server
```bash
npm run dev
# Server runs on http://localhost:3000
```

---

## API Endpoints Reference

### List Testimonials
```
GET /api/testimonials?productId=xxx&status=APPROVED&page=1&limit=10

Query Parameters:
- productId: Filter by product
- vendorId: Filter by vendor
- status: PENDING, APPROVED, REJECTED, FEATURED
- isFeatured: true/false
- minRating: 1-5
- maxRating: 1-5
- sortBy: createdAt, rating, helpfulCount, viewCount
- sortOrder: asc, desc
- page: Page number (default: 1)
- limit: Items per page (default: 10)

Response:
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

### Create Testimonial
```
POST /api/testimonials
Content-Type: application/json
Authorization: Bearer <token>

Body:
{
  "productId": "clh1234567890abcdefghijkl",
  "rating": 5,
  "title": "Amazing product!",
  "content": "This product exceeded my expectations...",
  "mediaUrls": ["https://cdn.example.com/photo.jpg"],
  "beforeAfterComparison": {
    "before": "https://cdn.example.com/before.jpg",
    "after": "https://cdn.example.com/after.jpg"
  },
  "isAnonymous": false
}

Response:
{
  "success": true,
  "data": { testimonial object },
  "message": "Testimonial created successfully..."
}
```

### Get Testimonial
```
GET /api/testimonials/[id]

Response:
{
  "success": true,
  "data": { testimonial object with media }
}
```

### Update Testimonial
```
PATCH /api/testimonials/[id]
Content-Type: application/json
Authorization: Bearer <token>

Body:
{
  "rating": 4,
  "title": "Updated title",
  "content": "Updated content..."
}

Response:
{
  "success": true,
  "data": { updated testimonial },
  "message": "Testimonial updated successfully"
}
```

### Delete Testimonial
```
DELETE /api/testimonials/[id]
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Testimonial deleted successfully"
}
```

### Upload Media
```
POST /api/testimonials/[id]/upload-media
Content-Type: multipart/form-data
Authorization: Bearer <token>

Form Data:
- file: <File object>
- mediaType: "video" or "photo"

Response:
{
  "success": true,
  "data": {
    "media": { media object },
    "testimonial": { updated testimonial }
  },
  "message": "Media uploaded successfully"
}
```

### Delete Media
```
DELETE /api/testimonials/[id]/upload-media?mediaId=xxx
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": { updated testimonial },
  "message": "Media deleted successfully"
}
```

### Moderate Testimonial (Admin)
```
PATCH /api/testimonials/[id]/moderate
Content-Type: application/json
Authorization: Bearer <admin-token>

Body:
{
  "status": "APPROVED",
  "rejectionReason": "Optional reason if rejected"
}

Response:
{
  "success": true,
  "data": { moderated testimonial },
  "message": "Testimonial approved successfully"
}
```

### Vote on Testimonial
```
POST /api/testimonials/[id]/vote
Content-Type: application/json

Body:
{
  "voteType": "helpful" or "unhelpful"
}

Response:
{
  "success": true,
  "data": { updated testimonial },
  "message": "Testimonial marked as helpful"
}
```

### Vendor Dashboard
```
GET /api/vendors/testimonials/dashboard?timeRange=30d&sortBy=date&page=1&limit=20
Authorization: Bearer <vendor-token>

Query Parameters:
- timeRange: 7d, 30d, 90d, 1y, all
- sortBy: rating, date, helpful
- page: Page number
- limit: Items per page

Response:
{
  "success": true,
  "data": {
    "testimonials": [...],
    "stats": {
      "total": 50,
      "approved": 45,
      "pending": 5,
      "featured": 3,
      "averageRating": 4.5,
      "totalHelpful": 250,
      "totalViews": 1000
    },
    "pagination": { ... }
  }
}
```

---

## File Structure

```
philippines-ecommerce/
├── src/
│   ├── lib/
│   │   ├── validations/
│   │   │   └── testimonials.ts          # Validation schemas
│   │   └── media-processor.ts           # Media processing utilities
│   ├── app/api/
│   │   ├── testimonials/
│   │   │   ├── route.ts                 # List & create
│   │   │   └── [id]/
│   │   │       ├── route.ts             # Get, update, delete
│   │   │       ├── upload-media/
│   │   │       │   └── route.ts         # Media upload/delete
│   │   │       ├── moderate/
│   │   │       │   └── route.ts         # Moderation
│   │   │       └── vote/
│   │   │           └── route.ts         # Voting
│   │   └── vendors/testimonials/
│   │       └── dashboard/
│   │           └── route.ts             # Vendor dashboard
│   └── __tests__/
│       ├── unit/
│       │   ├── validations/
│       │   │   └── testimonials.test.ts
│       │   └── lib/
│       │       └── media-processor.test.ts
│       └── integration/
│           └── testimonials.integration.test.ts
├── prisma/
│   └── schema.prisma                    # Database schema
└── docs/
    ├── PHASE_20_1_IMPLEMENTATION_PROGRESS.md
    └── PHASE_20_1_DEVELOPER_GUIDE.md
```

---

## Key Classes & Functions

### Validation Schemas
```typescript
// src/lib/validations/testimonials.ts

TestimonialCreationSchema      // Create testimonial
TestimonialUpdateSchema        // Update testimonial
TestimonialQuerySchema         // Query testimonials
TestimonialModerationSchema    // Moderate testimonial
MediaUploadSchema              // Upload media
TestimonialVoteSchema          // Vote on testimonial
VendorTestimonialDashboardSchema // Vendor dashboard
```

### Media Processor
```typescript
// src/lib/media-processor.ts

processVideo()                 // Process video file
processPhoto()                 // Process photo file
extractMediaMetadata()         // Extract file metadata
generateVideoThumbnail()       // Generate thumbnail
validateMediaFile()            // Validate file
uploadMediaToCDN()             // Upload to CDN
deleteMediaFromCDN()           // Delete from CDN
```

---

## Database Models

### Testimonial
```prisma
model Testimonial {
  id                    String
  productId             String
  vendorId              String
  userId                String
  rating                Int
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
  
  product               Product
  vendor                Vendor
  user                  User
  media                 TestimonialMedia[]
}
```

### TestimonialMedia
```prisma
model TestimonialMedia {
  id                String
  testimonialId     String
  mediaUrl          String
  mediaType         String
  duration          Int?
  fileSize          Int
  mimeType          String
  uploadedAt        DateTime
  
  testimonial       Testimonial
}
```

---

## Common Tasks

### Create a Testimonial
```typescript
const testimonial = await prisma.testimonial.create({
  data: {
    productId: "product-id",
    vendorId: "vendor-id",
    userId: "user-id",
    rating: 5,
    title: "Great product!",
    content: "This product is amazing...",
    status: "PENDING",
  },
});
```

### Approve a Testimonial
```typescript
const approved = await prisma.testimonial.update({
  where: { id: "testimonial-id" },
  data: { status: "APPROVED" },
});
```

### Get Vendor Statistics
```typescript
const stats = await prisma.testimonial.aggregate({
  where: { vendorId: "vendor-id" },
  _avg: { rating: true },
  _count: { id: true },
});
```

### Filter Testimonials
```typescript
const testimonials = await prisma.testimonial.findMany({
  where: {
    productId: "product-id",
    status: "APPROVED",
    rating: { gte: 4 },
  },
  orderBy: { createdAt: "desc" },
  take: 10,
});
```

---

## Error Handling

### Common Errors
```
401 Unauthorized        - Missing or invalid authentication
403 Forbidden          - User not authorized for action
404 Not Found          - Testimonial or resource not found
400 Bad Request        - Invalid input data
500 Internal Error     - Server error
```

### Example Error Response
```json
{
  "success": false,
  "error": "You must purchase this product to leave a testimonial"
}
```

---

## Testing

### Run Unit Tests
```bash
npm test -- testimonials.test.ts
```

### Run Integration Tests
```bash
npm test -- testimonials.integration.test.ts
```

### Run All Tests
```bash
npm test
```

### Test Coverage
```bash
npm test -- --coverage
```

---

## Performance Tips

1. **Use Pagination** - Always paginate large result sets
2. **Filter Early** - Filter in database, not in application
3. **Index Queries** - Use indexed fields (productId, vendorId, status)
4. **Cache Results** - Cache frequently accessed testimonials
5. **Optimize Media** - Compress media before upload

---

## Security Considerations

1. **Authentication** - All write operations require authentication
2. **Authorization** - Users can only modify their own testimonials
3. **Input Validation** - All inputs validated with Zod schemas
4. **File Validation** - Media files validated before upload
5. **Rate Limiting** - Consider adding rate limiting for API

---

## Troubleshooting

### Database Connection Error
```
Error: Can't reach database server
Solution: Ensure PostgreSQL is running and DATABASE_URL is set
```

### Migration Failed
```
Error: Prisma schema validation failed
Solution: Check schema.prisma for syntax errors
```

### Media Upload Failed
```
Error: Failed to upload media
Solution: Check file size and format, verify CDN credentials
```

---

## Resources

- **Prisma Docs:** https://www.prisma.io/docs/
- **Next.js Docs:** https://nextjs.org/docs
- **Zod Docs:** https://zod.dev/
- **TypeScript Docs:** https://www.typescriptlang.org/docs/

---

**Document Version:** 1.0
**Last Updated:** 2025-11-02

