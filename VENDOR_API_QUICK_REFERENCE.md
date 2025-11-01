# Vendor API Quick Reference Guide

## Base URL
```
http://localhost:3001/api
```

## Authentication
All endpoints (except search) require Bearer token:
```
Authorization: Bearer <jwt_token>
```

---

## Vendor Registration

### Register New Vendor
```bash
POST /vendors/register
Content-Type: application/json

{
  "storeName": "My Store",
  "storeSlug": "my-store",
  "businessType": "SOLE_PROPRIETORSHIP",
  "businessName": "My Store Business",
  "tin": "123456789012",
  "bankName": "BDO",
  "bankAccountNumber": "123456789",
  "bankAccountName": "My Store",
  "gcashNumber": "09123456789"
}

Response: 201 Created
{
  "vendor": {
    "id": "vendor-123",
    "userId": "user-123",
    "storeName": "My Store",
    "storeSlug": "my-store",
    "status": "PENDING",
    "commissionRate": 5,
    "createdAt": "2025-11-01T00:00:00Z"
  }
}
```

### Check Slug Availability
```bash
GET /vendors/check-slug?slug=my-store

Response: 200 OK
{
  "available": true,
  "slug": "my-store"
}
```

---

## Vendor Management

### Get Vendor Details
```bash
GET /vendors/vendor-123
Authorization: Bearer <token>

Response: 200 OK
{
  "id": "vendor-123",
  "storeName": "My Store",
  "storeSlug": "my-store",
  "status": "APPROVED",
  "commissionRate": 5,
  "subscriptionPlan": "professional",
  "profile": {
    "businessType": "SOLE_PROPRIETORSHIP",
    "businessName": "My Store Business",
    "tin": "123456789012"
  }
}
```

### Update Vendor Profile
```bash
PATCH /vendors/vendor-123
Content-Type: application/json
Authorization: Bearer <token>

{
  "businessType": "CORPORATION",
  "businessName": "My Store Corp",
  "tin": "123456789012"
}

Response: 200 OK
{
  "message": "Vendor profile updated",
  "vendor": { ... }
}
```

---

## Store Management

### Get Store Details
```bash
GET /vendors/vendor-123/store
Authorization: Bearer <token>

Response: 200 OK
{
  "storeName": "My Store",
  "description": "Best electronics store",
  "subscriptionPlan": "professional",
  "policies": {
    "returnPolicy": "30 days",
    "shippingPolicy": "Free shipping over ₱500"
  }
}
```

### Update Store Settings
```bash
PATCH /vendors/vendor-123/store
Content-Type: application/json
Authorization: Bearer <token>

{
  "storeName": "Updated Store Name",
  "description": "Updated description",
  "subscriptionPlan": "enterprise"
}

Response: 200 OK
{
  "message": "Store settings updated",
  "store": { ... }
}
```

---

## Dashboard & Analytics

### Get Vendor Dashboard
```bash
GET /vendors/vendor-123/dashboard
Authorization: Bearer <token>

Response: 200 OK
{
  "totalSales": 50000,
  "totalOrders": 125,
  "totalProducts": 45,
  "averageRating": 4.5,
  "recentOrders": [ ... ],
  "topProducts": [ ... ],
  "earnings": {
    "thisMonth": 45000,
    "thisYear": 450000
  }
}
```

### Get Earnings Summary
```bash
GET /vendors/vendor-123/earnings?days=30
Authorization: Bearer <token>

Response: 200 OK
{
  "period": "30 days",
  "totalEarnings": 45000,
  "totalCommission": 2500,
  "totalOrders": 50,
  "averageOrderValue": 900,
  "breakdown": {
    "byDay": [ ... ],
    "byProduct": [ ... ]
  }
}
```

### Get Commission History
```bash
GET /vendors/vendor-123/commissions?limit=50
Authorization: Bearer <token>

Response: 200 OK
{
  "commissions": [
    {
      "orderId": "order-123",
      "orderTotal": 1000,
      "commissionRate": 5,
      "commissionAmount": 50,
      "vendorEarnings": 950,
      "date": "2025-11-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 150
  }
}
```

---

## Vendor Search

### Search Vendors
```bash
GET /vendors/search?query=electronics&minRating=4&sortBy=rating&page=1&limit=20

Response: 200 OK
{
  "vendors": [
    {
      "id": "vendor-123",
      "storeName": "My Electronics Store",
      "storeSlug": "my-electronics-store",
      "rating": 4.5,
      "totalSales": 50000,
      "subscriptionPlan": "professional"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  },
  "filters": {
    "query": "electronics",
    "minRating": 4,
    "sortBy": "rating"
  }
}
```

### Search Parameters
- `query` - Search by store name
- `status` - Filter by status (PENDING, APPROVED, SUSPENDED)
- `minRating` - Minimum rating (0-5)
- `sortBy` - Sort by: newest, rating, sales, name
- `page` - Page number (default: 1)
- `limit` - Results per page (max: 100)

---

## Admin Operations

### Get Pending Vendors
```bash
GET /admin/vendors/pending?page=1&limit=20
Authorization: Bearer <admin-token>

Response: 200 OK
{
  "vendors": [
    {
      "id": "vendor-123",
      "storeName": "New Store",
      "businessType": "SOLE_PROPRIETORSHIP",
      "status": "PENDING",
      "createdAt": "2025-11-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "pages": 1
  }
}
```

### Approve/Reject Vendor
```bash
PATCH /admin/vendors/vendor-123/verify
Content-Type: application/json
Authorization: Bearer <admin-token>

{
  "status": "APPROVED",
  "reason": "All documents verified"
}

Response: 200 OK
{
  "message": "Vendor approved",
  "vendor": {
    "id": "vendor-123",
    "status": "APPROVED"
  }
}
```

### Verification Status Options
- `APPROVED` - Vendor approved and active
- `REJECTED` - Vendor rejected
- `SUSPENDED` - Vendor suspended

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid registration data",
  "details": "Store name must be at least 3 characters"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "You can only manage your own store"
}
```

### 404 Not Found
```json
{
  "error": "Vendor not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to process request"
}
```

---

## Commission Calculation

### Formula
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

---

## Validation Rules

### Store Name
- Minimum 3 characters
- Maximum 100 characters
- Required

### Store Slug
- Lowercase letters, numbers, hyphens only
- Minimum 3 characters
- Maximum 50 characters
- Must be unique

### TIN (Tax ID)
- Exactly 12 digits
- Format: NNNNNNNNNNNN

### GCash/PayMaya Number
- 11 digits
- Starts with 09
- Format: 09NNNNNNNNN

### Commission Rate
- Minimum: 0%
- Maximum: 100%
- Decimal allowed (e.g., 5.5%)

---

## Rate Limiting

- **Default**: 100 requests per minute per user
- **Search**: 1000 requests per minute per IP
- **Admin**: 500 requests per minute per admin

---

## Pagination

All list endpoints support pagination:
```
?page=1&limit=20
```

- `page` - Page number (default: 1)
- `limit` - Results per page (default: 20, max: 100)

Response includes:
```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

---

## Testing

### Run All Tests
```bash
npm test
```

### Run Vendor Tests Only
```bash
npm test -- vendors.test
```

### Run Tests with UI
```bash
npm run test:ui
```

---

## Common Issues

| Issue | Solution |
|-------|----------|
| "Store slug already exists" | Choose a different slug |
| "Invalid TIN format" | TIN must be 12 digits |
| "Unauthorized" | Check authentication token |
| "Forbidden" | Verify vendor ownership |
| "Vendor not found" | Check vendor ID |

---

## Support

For more information, see:
- VENDOR_MARKETPLACE_GUIDE.md - Complete guide
- PHASE_4_FINAL_REPORT.md - Implementation details
- PHASE_4_IMPLEMENTATION_CHECKLIST.md - Feature checklist

