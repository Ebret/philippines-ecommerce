# Multi-Vendor Marketplace Core Implementation Guide

## Overview
This document describes the complete Multi-Vendor Marketplace Core system implementation for the Philippines E-Commerce Platform, including vendor registration, store management, commission tracking, and vendor verification.

## Architecture

### Core Components

#### 1. Validation Schemas (`src/lib/validations/vendor.ts`)
- **VendorRegistrationSchema** - Vendor registration validation
- **VendorProfileUpdateSchema** - Profile update validation
- **VendorStoreSettingsSchema** - Store settings validation
- **VendorCommissionSchema** - Commission rate validation
- **VendorPayoutRequestSchema** - Payout request validation
- **VendorSearchSchema** - Vendor search and filtering
- **VendorVerificationSchema** - Admin verification validation
- **VendorAnalyticsQuerySchema** - Analytics query validation
- **VendorStorePoliciesSchema** - Store policies validation

#### 2. Utility Functions (`src/lib/vendor-utils.ts`)
- **generateVendorSlug()** - Generate URL-friendly store slugs
- **isVendorSlugUnique()** - Verify slug uniqueness
- **getVendorWithRelations()** - Fetch vendor with all relations
- **calculateCommission()** - Calculate commission from order total
- **calculateVendorEarnings()** - Calculate vendor earnings after commission
- **getVendorStats()** - Get vendor statistics (products, sales, orders)
- **getVendorEarnings()** - Get vendor earnings summary
- **getVendorDashboard()** - Get complete dashboard data
- **updateVendorStatus()** - Update vendor approval status
- **getPendingVendors()** - Get vendors awaiting approval
- **getVendorBySlug()** - Fetch vendor by store slug
- **searchVendors()** - Search and filter vendors
- **getVendorCommissionHistory()** - Get commission history

#### 3. API Routes

##### Vendor Registration (`/api/vendors`)
- **POST /register** - Register new vendor
- **GET /check-slug** - Check slug availability
- **GET /search** - Search vendors

##### Vendor Profile (`/api/vendors/[id]`)
- **GET** - Get vendor details
- **PATCH** - Update vendor profile
- **GET /profile** - Get vendor profile details

##### Vendor Store (`/api/vendors/[id]/store`)
- **GET** - Get store details
- **PATCH** - Update store settings

##### Vendor Dashboard (`/api/vendors/[id]/dashboard`)
- **GET** - Get dashboard data

##### Vendor Earnings (`/api/vendors/[id]/earnings`)
- **GET** - Get earnings summary
- **GET /commissions** - Get commission history

##### Admin Verification (`/api/admin/vendors`)
- **GET /pending** - Get pending vendors
- **PATCH /[id]/verify** - Approve/reject vendor

## Features

### Vendor Registration & Onboarding
✅ Self-service vendor registration
✅ Store slug generation and uniqueness validation
✅ Business information collection
✅ Tax ID (TIN) validation
✅ Payment method setup (GCash, PayMaya, Bank Transfer)
✅ Email verification
✅ Pending approval status

### Vendor Profile Management
✅ Business type selection (Individual, Sole Proprietorship, Partnership, Corporation)
✅ Business registration details
✅ Tax compliance documents
✅ Bank account information
✅ Payment method management
✅ Profile update capabilities

### Store Management
✅ Store name and description
✅ Store logo and banner
✅ Subscription plan management
✅ Store policies (return, shipping, refund, warranty)
✅ Store customization

### Commission System
✅ Configurable commission rates per vendor
✅ Automatic commission calculation
✅ Commission tracking per order
✅ Earnings calculation (order total - commission)
✅ Commission history reporting

### Vendor Dashboard
✅ Sales statistics
✅ Product management overview
✅ Recent orders
✅ Top performing products
✅ Earnings summary
✅ Commission tracking

### Vendor Verification (Admin)
✅ Pending vendor approval workflow
✅ Document verification
✅ Approval/rejection with reasons
✅ Vendor status management
✅ Suspension capabilities

### Vendor Search & Discovery
✅ Full-text search by store name
✅ Filter by status (pending, approved, suspended)
✅ Filter by subscription plan
✅ Filter by minimum rating
✅ Sort by newest, rating, sales, name
✅ Pagination support

### Authorization & Security
✅ Role-based access control (BUYER, SELLER, ADMIN, SUPER_ADMIN)
✅ Vendors can only manage own stores
✅ Admins can manage all vendors
✅ Seller role assignment on registration
✅ Input validation with Zod
✅ Unique slug enforcement

## Database Schema

### Key Models
- **Vendor** - Main vendor entity with store info
- **VendorProfile** - Detailed business and payment information
- **User** - User account linked to vendor
- **Product** - Products owned by vendor
- **Order** - Orders from vendor

## API Usage Examples

### Register as Vendor
```bash
POST /api/vendors/register
Content-Type: application/json
Authorization: Bearer <token>

{
  "storeName": "My Electronics Store",
  "storeSlug": "my-electronics-store",
  "businessType": "SOLE_PROPRIETORSHIP",
  "businessName": "My Electronics",
  "tin": "123456789012",
  "bankName": "BDO",
  "bankAccountNumber": "123456789",
  "bankAccountName": "My Electronics",
  "gcashNumber": "09123456789"
}
```

### Check Store Slug Availability
```bash
GET /api/vendors/check-slug?slug=my-store
```

### Get Vendor Details
```bash
GET /api/vendors/vendor-123
```

### Update Store Settings
```bash
PATCH /api/vendors/vendor-123/store
Content-Type: application/json
Authorization: Bearer <token>

{
  "storeName": "Updated Store Name",
  "description": "Updated description",
  "subscriptionPlan": "professional"
}
```

### Get Vendor Dashboard
```bash
GET /api/vendors/vendor-123/dashboard
Authorization: Bearer <token>
```

### Get Earnings Summary
```bash
GET /api/vendors/vendor-123/earnings?days=30
Authorization: Bearer <token>
```

### Get Commission History
```bash
GET /api/vendors/vendor-123/commissions?limit=50
Authorization: Bearer <token>
```

### Search Vendors
```bash
GET /api/vendors/search?query=electronics&minRating=4&sortBy=rating&page=1&limit=20
```

### Get Pending Vendors (Admin)
```bash
GET /api/admin/vendors/pending?page=1&limit=20
Authorization: Bearer <admin-token>
```

### Approve Vendor (Admin)
```bash
PATCH /api/admin/vendors/vendor-123/verify
Content-Type: application/json
Authorization: Bearer <admin-token>

{
  "status": "APPROVED",
  "reason": "All documents verified"
}
```

## Testing

### Test Coverage
- 38 comprehensive tests for vendor marketplace
- Slug generation and validation
- Vendor registration validation
- Profile update validation
- Store settings validation
- Commission calculations
- Payout request validation
- Vendor search validation
- Verification workflow
- Authorization checks
- Data integrity validation

### Running Tests
```bash
npm test                    # Run all tests
npm test -- --run          # Run tests once
npm test -- vendors.test   # Run specific test file
npm run test:ui            # Run tests with UI
```

### Test Results
- **Total Tests**: 38
- **Pass Rate**: 100%
- **Coverage**: All vendor marketplace functionality

## Security Features

### Input Validation
- Zod schema validation for all inputs
- Store slug format validation
- TIN format validation (12 digits)
- Phone number validation (Philippine format)
- URL validation for images
- Commission rate validation (0-100%)

### Authorization
- Role-based access control
- Vendor can only manage own store
- Admin can manage all vendors
- Seller role assignment on registration

### Data Protection
- Unique slug enforcement
- Commission rate tracking
- Earnings calculation verification
- Vendor status management
- Approval workflow

## Commission System Details

### Commission Calculation
```
Commission = Order Total × Commission Rate / 100
Vendor Earnings = Order Total - Commission
```

### Example
```
Order Total: ₱1,000
Commission Rate: 5%
Commission: ₱50
Vendor Earnings: ₱950
```

### Commission Tracking
- Per-order commission calculation
- Commission history reporting
- Earnings summary by period
- Payment method tracking

## Vendor Status Workflow

```
PENDING → APPROVED → ACTIVE
   ↓
REJECTED

APPROVED → SUSPENDED (by admin)
SUSPENDED → APPROVED (by admin)
```

## Multi-Language Support

### Supported Languages
- English (en)
- Filipino (fil)
- Cebuano (ceb)
- Ilocano (ilo)

### Vendor Information
- Store name translations
- Store description translations
- Store policies translations

## Performance Considerations

### Optimization Strategies
- Indexed database queries
- Pagination for large result sets
- Efficient vendor search
- Commission calculation caching
- Dashboard data aggregation

### Database Indexes
- Vendor slug (unique)
- Vendor user ID (unique)
- Vendor status
- Vendor rating
- Vendor creation date

## Future Enhancements

1. **Advanced Analytics**
   - Sales trends
   - Customer insights
   - Product performance
   - Revenue forecasting

2. **Vendor Tools**
   - Bulk product import
   - Automated pricing
   - Inventory management
   - Marketing tools

3. **Payment Processing**
   - Automated payouts
   - Multiple payment methods
   - Tax reporting
   - Financial statements

4. **Vendor Support**
   - Help center
   - Ticket system
   - Live chat support
   - Training materials

## Troubleshooting

### Common Issues

1. **"Store slug already exists"**
   - Slug must be unique
   - Try a different slug
   - System auto-generates from name

2. **"Invalid TIN format"**
   - TIN must be 12 digits
   - Format: NNNNNNNNNNNN
   - Check for leading zeros

3. **"Vendor not found"**
   - Verify vendor ID exists
   - Check vendor status
   - Ensure proper permissions

4. **"Unauthorized"**
   - Check user role
   - Verify vendor ownership
   - Ensure valid session

5. **"Commission calculation error"**
   - Check commission rate (0-100%)
   - Verify order total
   - Check decimal precision

## Support

For issues or questions about the vendor marketplace system, please refer to:
- Prisma Documentation: https://www.prisma.io/docs
- Next.js Documentation: https://nextjs.org/docs
- Zod Validation: https://zod.dev

