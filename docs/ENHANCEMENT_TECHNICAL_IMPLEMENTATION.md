# Technical Implementation Guide
## Phase 20 Enhancements - Philippines E-Commerce Platform

---

## Architecture Overview

### Technology Stack
- **Backend:** Next.js 16.0.1, Node.js 20+, TypeScript
- **Database:** PostgreSQL 15+ with Prisma ORM
- **Media Processing:** Sharp (image), FFmpeg (video)
- **Storage:** AWS S3 / Cloudinary (CDN)
- **APIs:** RESTful with validation schemas
- **Testing:** Vitest with 95%+ coverage target

### Integration Points
```
┌─────────────────────────────────────────────────────┐
│         Philippines E-Commerce Platform             │
├─────────────────────────────────────────────────────┤
│  Testimonials │ Promotions │ Social │ Recommendations│
├─────────────────────────────────────────────────────┤
│  Existing Systems (Reviews, Cart, Orders, etc.)     │
├─────────────────────────────────────────────────────┤
│  PostgreSQL │ Redis Cache │ CDN │ External APIs    │
└─────────────────────────────────────────────────────┘
```

---

## Feature 1: Testimonials & Media System

### Database Schema
```prisma
model Testimonial {
  id String @id @default(cuid())
  productId String
  vendorId String
  userId String
  rating Int @db.SmallInt
  title String
  content String @db.Text
  mediaUrls String[]
  mediaTypes String[] // "video" | "photo"
  beforeAfterComparison Json?
  isVerified Boolean @default(false)
  isFeatured Boolean @default(false)
  status TestimonialStatus @default(PENDING)
  viewCount Int @default(0)
  helpfulCount Int @default(0)
  notHelpfulCount Int @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  product Product @relation(fields: [productId], references: [id])
  vendor Vendor @relation(fields: [vendorId], references: [id])
  user User @relation(fields: [userId], references: [id])
  
  @@index([productId])
  @@index([vendorId])
  @@index([status])
  @@index([isFeatured])
}

model TestimonialMedia {
  id String @id @default(cuid())
  testimonialId String
  mediaUrl String
  mediaType String // "video" | "photo"
  duration Int? // seconds for video
  fileSize Int
  mimeType String
  uploadedAt DateTime @default(now())
  
  testimonial Testimonial @relation(fields: [testimonialId], references: [id], onDelete: Cascade)
  
  @@index([testimonialId])
}

enum TestimonialStatus {
  PENDING
  APPROVED
  REJECTED
  FEATURED
}
```

### API Implementation Structure
```typescript
// src/app/api/testimonials/route.ts
export async function POST(request: Request) {
  // 1. Validate request
  // 2. Check authentication
  // 3. Validate testimonial data
  // 4. Create testimonial record
  // 5. Handle media uploads
  // 6. Return response
}

// src/app/api/testimonials/[id]/upload-media/route.ts
export async function POST(request: Request) {
  // 1. Validate file
  // 2. Process media (compress, transcode)
  // 3. Upload to CDN
  // 4. Store metadata
  // 5. Return media URL
}
```

### Media Processing Pipeline
```typescript
// src/lib/media-processor.ts
export async function processVideo(file: File): Promise<ProcessedVideo> {
  // 1. Validate format (MP4, WebM, MOV)
  // 2. Transcode to multiple resolutions
  // 3. Generate thumbnail
  // 4. Extract metadata
  // 5. Upload to CDN
  // 6. Return URLs
}

export async function processPhoto(file: File): Promise<ProcessedPhoto> {
  // 1. Validate format (JPG, PNG, WebP)
  // 2. Compress and optimize
  // 3. Generate WebP version
  // 4. Create thumbnail
  // 5. Upload to CDN
  // 6. Return URLs
}
```

### Validation Schemas
```typescript
// src/lib/validations/testimonials.ts
export const TestimonialCreationSchema = z.object({
  productId: z.string().cuid(),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(5).max(100),
  content: z.string().min(20).max(2000),
  mediaUrls: z.array(z.string().url()).optional(),
  beforeAfterComparison: z.object({
    before: z.string().url(),
    after: z.string().url()
  }).optional(),
  isAnonymous: z.boolean().optional()
});
```

---

## Feature 2: Promotions & Marketing System

### Database Schema
```prisma
model Promotion {
  id String @id @default(cuid())
  vendorId String
  type PromotionType
  name String
  description String? @db.Text
  discountType String // PERCENTAGE | FIXED | BOGO | FREE_SHIPPING
  discountValue Decimal @db.Decimal(10, 2)
  minOrderValue Decimal? @db.Decimal(10, 2)
  maxDiscount Decimal? @db.Decimal(10, 2)
  startDate DateTime
  endDate DateTime
  isActive Boolean @default(true)
  usageLimit Int?
  usageCount Int @default(0)
  perCustomerLimit Int?
  applicableProducts String[]
  excludedProducts String[]
  applicableCategories String[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  vendor Vendor @relation(fields: [vendorId], references: [id])
  codes PromotionCode[]
  
  @@index([vendorId])
  @@index([type])
  @@index([isActive])
  @@index([startDate])
  @@index([endDate])
}

model PromotionCode {
  id String @id @default(cuid())
  promotionId String
  code String @unique
  usageLimit Int?
  usageCount Int @default(0)
  expiresAt DateTime?
  isActive Boolean @default(true)
  createdAt DateTime @default(now())
  
  promotion Promotion @relation(fields: [promotionId], references: [id], onDelete: Cascade)
  
  @@index([code])
  @@index([promotionId])
}

enum PromotionType {
  FLASH_SALE
  BOGO
  PERCENTAGE_DISCOUNT
  FIXED_DISCOUNT
  FREE_SHIPPING
  BUNDLE_DEAL
  SEASONAL
  FIRST_TIME_BUYER
  LOYALTY_REWARD
}
```

### Promotion Logic
```typescript
// src/lib/promotion-utils.ts
export function calculatePromotionDiscount(
  promotion: Promotion,
  cartTotal: Decimal,
  cartItems: CartItem[]
): PromotionResult {
  // 1. Check eligibility
  // 2. Validate conditions
  // 3. Calculate discount
  // 4. Apply limits
  // 5. Return result
}

export function validatePromotionCode(
  code: string,
  cartTotal: Decimal
): Promise<PromotionCode | null> {
  // 1. Find code
  // 2. Check active
  // 3. Check expiration
  // 4. Check usage limits
  // 5. Return code or null
}

export function generatePromotionCodes(
  promotionId: string,
  count: number,
  options?: CodeGenerationOptions
): Promise<string[]> {
  // 1. Generate unique codes
  // 2. Store in database
  // 3. Return codes
}
```

---

## Feature 3: Social Media Integration

### Platform Adapters
```typescript
// src/lib/social-adapters/shopee-adapter.ts
export class ShopeeAdapter implements SocialMediaAdapter {
  async syncInventory(products: Product[]): Promise<SyncResult> {
    // 1. Authenticate with Shopee API
    // 2. Map products to Shopee format
    // 3. Update inventory
    // 4. Handle errors
    // 5. Return sync result
  }
  
  async syncOrders(): Promise<Order[]> {
    // 1. Fetch orders from Shopee
    // 2. Map to platform format
    // 3. Create/update orders
    // 4. Return orders
  }
}

// Similar adapters for Lazada, TikTok, Facebook, Instagram
```

### Inventory Sync Engine
```typescript
// src/lib/inventory-sync.ts
export class InventorySyncEngine {
  async syncAllPlatforms(): Promise<SyncReport> {
    // 1. Get all connected accounts
    // 2. Sync each platform
    // 3. Handle conflicts
    // 4. Log results
    // 5. Return report
  }
  
  async handleInventoryConflict(
    productId: string,
    platformInventories: Map<string, number>
  ): Promise<number> {
    // 1. Determine authoritative inventory
    // 2. Update all platforms
    // 3. Log conflict
    // 4. Return final quantity
  }
}
```

### Database Schema
```prisma
model SocialMediaAccount {
  id String @id @default(cuid())
  vendorId String
  platform String // SHOPEE | LAZADA | TIKTOK | FACEBOOK | INSTAGRAM
  accountId String
  accountName String
  accessToken String @db.Text
  refreshToken String? @db.Text
  expiresAt DateTime?
  isActive Boolean @default(true)
  syncSettings Json
  lastSyncAt DateTime?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  vendor Vendor @relation(fields: [vendorId], references: [id])
  
  @@unique([vendorId, platform])
  @@index([platform])
}

model CrossPlatformOrder {
  id String @id @default(cuid())
  orderId String
  platform String
  platformOrderId String
  status String
  syncedAt DateTime
  createdAt DateTime @default(now())
  
  order Order @relation(fields: [orderId], references: [id])
  
  @@index([orderId])
  @@index([platform])
}
```

---

## Feature 4: AI Recommendations & Insights

### Recommendation Engine
```typescript
// src/lib/recommendation-engine.ts
export class RecommendationEngine {
  async getPersonalizedRecommendations(
    userId: string,
    limit: number = 10
  ): Promise<Product[]> {
    // 1. Get user history
    // 2. Calculate similarity scores
    // 3. Rank products
    // 4. Apply filters
    // 5. Return recommendations
  }
  
  async getCollaborativeRecommendations(
    userId: string
  ): Promise<Product[]> {
    // 1. Find similar users
    // 2. Get their purchases
    // 3. Rank by popularity
    // 4. Return recommendations
  }
}
```

### Business Intelligence
```typescript
// src/lib/business-intelligence.ts
export class BusinessIntelligence {
  async forecastSales(
    vendorId: string,
    days: number = 30
  ): Promise<SalesForecast> {
    // 1. Get historical data
    // 2. Apply forecasting model
    // 3. Return predictions
  }
  
  async optimizeInventory(
    vendorId: string
  ): Promise<InventoryRecommendation[]> {
    // 1. Analyze sales velocity
    // 2. Calculate optimal levels
    // 3. Return recommendations
  }
}
```

---

## Testing Strategy

### Unit Tests (180+ tests)
```typescript
// Test structure for each feature
describe('Testimonials', () => {
  describe('Media Processing', () => {
    it('should process video correctly')
    it('should compress photos')
    it('should generate thumbnails')
  })
  
  describe('Validation', () => {
    it('should validate testimonial data')
    it('should check media formats')
  })
})
```

### Integration Tests (60+ tests)
```typescript
describe('Testimonials Integration', () => {
  it('should create testimonial with media')
  it('should update vendor dashboard')
  it('should display on product page')
})
```

### Performance Tests (25+ tests)
```typescript
describe('Performance', () => {
  it('should handle concurrent uploads')
  it('should sync inventory within SLA')
  it('should generate recommendations in <500ms')
})
```

---

## Deployment Strategy

### Phase 1: Staging Deployment
- Deploy to staging environment
- Run full test suite
- Performance testing
- Security audit

### Phase 2: Canary Deployment
- Deploy to 10% of production
- Monitor metrics
- Collect feedback
- Gradual rollout

### Phase 3: Full Deployment
- Deploy to 100% of production
- Monitor performance
- Support team ready
- Rollback plan active

---

## Monitoring & Observability

### Key Metrics
- API response times
- Error rates
- Media processing times
- Sync success rates
- Recommendation accuracy

### Alerts
- API latency > 500ms
- Error rate > 1%
- Sync failures
- Media processing failures

---

**Document Version:** 1.0
**Last Updated:** 2025-11-02
**Status:** Ready for Development

