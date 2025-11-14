# Admin API Endpoints Documentation

## Authentication

All admin endpoints require:
- Valid session with ADMIN or SUPER_ADMIN role
- NextAuth session cookie

## Endpoints

### 1. GET /api/admin/reports/sales

Generates sales report with optional filtering.

**Query Parameters:**
- `startDate` (optional): ISO date string (e.g., "2024-01-01")
- `endDate` (optional): ISO date string (e.g., "2024-12-31")
- `vendor` (optional): Vendor ID or name
- `category` (optional): Product category
- `status` (optional): Order status (pending, processing, delivered, cancelled)

**Response:**
```json
{
  "success": true,
  "data": {
    "totalSales": 150000,
    "orderCount": 45,
    "averageOrderValue": 3333.33,
    "topProducts": [
      {
        "id": "prod-1",
        "name": "Product Name",
        "quantity": 25,
        "revenue": 50000
      }
    ],
    "salesByStatus": {
      "delivered": 40000,
      "processing": 30000,
      "pending": 20000
    }
  }
}
```

**Example:**
```bash
curl -X GET "https://extremelifeherbal.com/api/admin/reports/sales?startDate=2024-01-01&endDate=2024-12-31" \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN"
```

### 2. GET /api/admin/reports/revenue

Generates revenue report with payment method breakdown.

**Query Parameters:**
- `startDate` (optional): ISO date string
- `endDate` (optional): ISO date string
- `paymentMethod` (optional): gcash, paymaya, bank_transfer, cod

**Response:**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 150000,
    "deliveredOrders": 40,
    "averageOrderValue": 3750,
    "revenueByPaymentMethod": {
      "gcash": 75000,
      "paymaya": 50000,
      "bank_transfer": 20000,
      "cod": 5000
    },
    "revenueByDate": [
      {
        "date": "2024-01-01",
        "revenue": 5000
      }
    ]
  }
}
```

**Example:**
```bash
curl -X GET "https://extremelifeherbal.com/api/admin/reports/revenue?startDate=2024-01-01" \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN"
```

### 3. POST /api/admin/reports/export

Exports reports in various formats.

**Request Body:**
```json
{
  "reportType": "sales",
  "format": "csv",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "filters": {
    "vendor": "vendor-id",
    "category": "category-id",
    "status": "delivered"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "downloadUrl": "https://cdn.example.com/reports/sales-2024.csv",
    "fileName": "sales-2024.csv",
    "format": "csv",
    "size": 102400,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Example:**
```bash
curl -X POST "https://extremelifeherbal.com/api/admin/reports/export" \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN" \
  -d '{
    "reportType": "sales",
    "format": "csv",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31"
  }'
```

### 4. GET /api/admin/system/health

Returns current system health status.

**Query Parameters:** None

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-15T10:30:00Z",
    "database": {
      "status": "healthy",
      "responseTime": "45ms"
    },
    "api": {
      "responseTime": "12ms"
    },
    "metrics": {
      "totalUsers": 1250,
      "totalOrders": 450,
      "totalProducts": 850
    },
    "uptime": 99.95,
    "memory": {
      "used": 512,
      "total": 1024
    }
  }
}
```

**Example:**
```bash
curl -X GET "https://extremelifeherbal.com/api/admin/system/health" \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN"
```

### 5. GET /api/admin/system/logs

Retrieves system logs with filtering and pagination.

**Query Parameters:**
- `level` (optional): info, warning, error, all (default: all)
- `limit` (optional): Number of logs per page (default: 50, max: 100)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "log-1",
        "level": "info",
        "message": "User logged in",
        "timestamp": "2024-01-15T10:30:00Z"
      },
      {
        "id": "log-2",
        "level": "error",
        "message": "Payment processing failed",
        "timestamp": "2024-01-15T10:29:00Z"
      }
    ],
    "total": 1250,
    "limit": 50,
    "offset": 0
  }
}
```

**Example:**
```bash
curl -X GET "https://extremelifeherbal.com/api/admin/system/logs?level=error&limit=20" \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN"
```

## Error Responses

All endpoints return error responses in this format:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

**Common Error Codes:**
- `UNAUTHORIZED`: User not authenticated
- `FORBIDDEN`: User lacks required permissions
- `INVALID_PARAMS`: Invalid query parameters
- `DATABASE_ERROR`: Database connection error
- `INTERNAL_ERROR`: Server error

**Example Error Response:**
```json
{
  "success": false,
  "error": "Unauthorized access",
  "code": "UNAUTHORIZED"
}
```

## Rate Limiting

- 100 requests per minute per user
- 1000 requests per minute per IP

## Response Headers

All responses include:
- `Content-Type: application/json`
- `X-Request-ID: unique-request-id`
- `X-Response-Time: milliseconds`

