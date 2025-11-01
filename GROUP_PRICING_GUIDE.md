# Phase 10: Group Pricing & Social Commerce Implementation Guide

## Overview

The Group Pricing & Social Commerce system for the Philippines E-Commerce Platform provides comprehensive group buying features, bulk discounts, referral programs, social sharing, and community management tailored for the Philippines market.

## Key Features

### 1. Group Buying Features
- Create and manage group deals with minimum quantity requirements
- Time-limited group deals with countdown timers
- Target quantity tracking and progress visualization
- Automatic deal completion when target reached
- Barangay-level group purchasing support

### 2. Bulk Discount Tiers
- Multi-tier discount structure based on quantity
- Automatic tier application based on order quantity
- Flexible discount percentage or fixed amount options
- Date-based discount scheduling
- Vendor-managed discount configuration

### 3. Referral Program System
- Unique referral code generation
- Commission tracking per referral
- Redemption limit management
- Expiry date handling
- Referral earnings dashboard

### 4. Social Sharing & Viral Marketing
- Multi-platform social sharing (Facebook, TikTok, Instagram, WhatsApp, Viber, Telegram)
- Share tracking and analytics
- Social proof metrics (participant count, total quantity)
- Viral marketing incentives
- Share URL generation with tracking

### 5. Community Features
- Barangay-level community groups
- Neighborhood and workplace communities
- Community member management
- Exclusive community deals
- Community engagement tracking

### 6. Participation Tracking
- Real-time participant count updates
- Engagement rate calculation
- Social proof display
- Urgency indicators (countdown timers)
- Participation analytics

## API Endpoints

### Group Deals
- `GET /api/group-deals` - List group deals with filtering
- `POST /api/group-deals` - Create new group deal
- `GET /api/group-deals/[id]` - Get deal details
- `PATCH /api/group-deals/[id]` - Update deal
- `DELETE /api/group-deals/[id]` - Delete deal
- `POST /api/group-deals/[id]/join` - Join group deal

### Bulk Discounts
- `GET /api/bulk-discounts` - List bulk discounts
- `POST /api/bulk-discounts` - Create bulk discount
- `PATCH /api/bulk-discounts/[id]` - Update discount
- `GET /api/bulk-discounts/calculate` - Calculate discount

### Referral Program
- `GET /api/referrals` - List user referrals
- `POST /api/referrals/generate-code` - Generate referral code
- `GET /api/referrals/[code]` - Get referral details
- `POST /api/referrals/[code]/redeem` - Redeem referral code
- `GET /api/referrals/earnings` - Get referral earnings
- `GET /api/referrals/commissions` - Get commission history

### Social Sharing
- `POST /api/social-sharing/share` - Share deal
- `GET /api/social-sharing/[id]/stats` - Get share statistics
- `POST /api/social-sharing/track-click` - Track share clicks
- `GET /api/social-sharing/trending` - Get trending shares

### Communities
- `GET /api/communities` - List communities
- `POST /api/communities` - Create community
- `GET /api/communities/[id]` - Get community details
- `PATCH /api/communities/[id]` - Update community
- `POST /api/communities/[id]/members` - Add member
- `GET /api/communities/[id]/deals` - Get community deals

## Validation Schemas

All endpoints use Zod validation schemas:

- `GroupDealCreationSchema` - Group deal creation validation
- `GroupDealUpdateSchema` - Group deal update validation
- `GroupDealJoinSchema` - Join group deal validation
- `BulkDiscountCreationSchema` - Bulk discount creation
- `BulkDiscountCalculateSchema` - Discount calculation
- `ReferralCodeGenerationSchema` - Referral code generation
- `ReferralRedeemSchema` - Referral redemption
- `SocialShareSchema` - Social sharing validation
- `CommunityCreationSchema` - Community creation
- `ParticipationSchema` - Participation tracking

## Utility Functions

### Group Deal Management
- `generateGroupDealId()` - Generate unique deal ID
- `calculateGroupDiscount()` - Calculate discounted price
- `calculateGroupSavings()` - Calculate total savings
- `getGroupDealStatus()` - Get current deal status
- `isGroupDealActive()` - Check if deal is active
- `getGroupDealTimeRemaining()` - Get time remaining
- `calculateGroupProgress()` - Calculate progress percentage
- `isMinimumQuantityReached()` - Check minimum quantity

### Bulk Discount Management
- `generateBulkDiscountId()` - Generate discount ID
- `calculateBulkDiscountPrice()` - Calculate discounted price
- `getApplicableDiscountTier()` - Get applicable tier
- `calculateBulkOrderTotal()` - Calculate order total

### Referral Program
- `generateReferralCode()` - Generate referral code
- `calculateReferralCommission()` - Calculate commission
- `isReferralCodeValid()` - Check code validity
- `calculateReferralEarnings()` - Calculate total earnings
- `calculateReferralConversionRate()` - Calculate conversion rate

### Social Sharing
- `generateShareTrackingId()` - Generate tracking ID
- `generateSocialShareUrl()` - Generate share URL
- `calculateSocialProofScore()` - Calculate proof score
- `formatSocialProofMessage()` - Format proof message

### Community Management
- `generateCommunityId()` - Generate community ID
- `calculateCommunityEngagementRate()` - Calculate engagement
- `calculateCommunitySavings()` - Calculate total savings

### Analytics
- `calculateGroupDealConversionRate()` - Calculate conversion
- `calculateGroupDealAOV()` - Calculate average order value
- `calculateEngagementScore()` - Calculate engagement score
- `determineDealPerformanceLevel()` - Determine performance level

## Testing

### Test Coverage
- 41 comprehensive unit tests
- 100% pass rate
- Tests cover:
  - Group deal management
  - Bulk discount calculations
  - Referral code generation and validation
  - Social sharing functionality
  - Community management
  - Participation tracking
  - Analytics calculations
  - Validation schemas

### Running Tests
```bash
npm test -- --run src/__tests__/group-pricing.test.ts
```

## Usage Examples

### Create Group Deal
```typescript
POST /api/group-deals
{
  "productId": "prod-123",
  "title": "Bulk Electronics Deal",
  "description": "Group buying event for electronics",
  "minimumQuantity": 5,
  "basePrice": 1000,
  "groupPrice": 800,
  "discountPercent": 20,
  "startTime": "2025-01-15T10:00:00Z",
  "endTime": "2025-01-15T18:00:00Z",
  "targetQuantity": 100,
  "barangayLevel": true,
  "barangay": "Barangay 1"
}
```

### Join Group Deal
```typescript
POST /api/group-deals/deal-123/join
{
  "quantity": 10,
  "notes": "For office use"
}
```

### Create Bulk Discount
```typescript
POST /api/bulk-discounts
{
  "productId": "prod-123",
  "name": "Quantity Discount",
  "tiers": [
    { "minQuantity": 1, "maxQuantity": 10, "discountPercent": 5 },
    { "minQuantity": 11, "maxQuantity": 50, "discountPercent": 10 },
    { "minQuantity": 51, "discountPercent": 15 }
  ]
}
```

### Generate Referral Code
```typescript
POST /api/referrals/generate-code
{
  "referrerName": "Juan Dela Cruz",
  "referrerEmail": "juan@example.com",
  "commissionPercent": 5,
  "expiryDays": 90
}
```

### Redeem Referral Code
```typescript
POST /api/referrals/ABCD1234/redeem
{
  "referralCode": "ABCD1234",
  "refereeEmail": "maria@example.com",
  "refereeName": "Maria Santos"
}
```

### Share Deal on Social Media
```typescript
POST /api/social-sharing/share
{
  "dealId": "deal-123",
  "platform": "facebook",
  "message": "Check out this amazing group deal!"
}
```

### Create Community
```typescript
POST /api/communities
{
  "name": "Barangay 1 Buyers Club",
  "description": "Community for group buying in Barangay 1",
  "type": "barangay",
  "barangay": "Barangay 1",
  "isPublic": true
}
```

## Integration with Existing Systems

### Order Management Integration
- Group deal purchases create orders automatically
- Bulk discount application on checkout
- Order status tracking for group deals

### Inventory Management Integration
- Real-time stock updates during group deals
- Stock reservation for group participants
- Automatic inventory deduction on deal completion

### Payment Gateway Integration
- Payment processing for group deal purchases
- Referral commission payouts
- Transaction logging

### User Management Integration
- User profile information in communities
- Referral tracking per user
- Commission earnings tracking

## Philippines-Specific Features

- Barangay-level group purchasing support
- Local payment method integration
- WhatsApp and Viber social sharing (popular in Philippines)
- Mobile-optimized group buying interface
- Offline-capable community features
- Local language support

## Security & Authorization

- Role-based access control (RBAC)
- Vendors can only manage their own deals
- Community moderators for group management
- Referral code validation and expiry
- Rate limiting for social sharing
- Secure commission tracking

## Performance Considerations

- Indexed queries for fast lookups
- Pagination support for large datasets
- Real-time participant count updates
- Efficient discount tier lookup
- Caching for frequently accessed data
- Optimized social proof calculations

## Future Enhancements

- AI-powered deal recommendations
- Automated group deal creation
- Advanced referral analytics
- Influencer collaboration features
- Group deal notifications
- Community gamification
- Loyalty program integration
- Advanced social media analytics
- Automated commission payouts
- Deal performance predictions

