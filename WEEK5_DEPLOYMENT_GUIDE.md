# Week 5: Order Management System - Deployment Guide

## Overview
This guide provides step-by-step instructions for deploying Week 5: Order Management System to the production VPS at 109.205.181.119.

## Deployment Steps

### 1. Build the Application
```bash
cd philippines-ecommerce
npm run build
```

Expected output: Build completes successfully with all pages compiled.

### 2. Run All Tests
```bash
npm test -- --run
```

Expected: All Week 5 tests pass (108 tests):
- week5-order-management.test.ts: 33 tests ✓
- week5-order-pages.test.ts: 37 tests ✓
- week5-order-api.test.ts: 38 tests ✓

### 3. Copy Files to Production
```bash
# SSH into VPS
ssh root@109.205.181.119

# Navigate to application directory
cd /var/www/philippines-ecommerce

# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Build application
npm run build

# Restart PM2 processes
pm2 restart all
pm2 save
```

### 4. Verify Deployment

Test the following endpoints:

**Order Details Page:**
```bash
curl -s https://extremelifeherbal.com/orders/[order-id] -o /dev/null -w "HTTP Status: %{http_code}\n"
```

**Order Tracking Page:**
```bash
curl -s https://extremelifeherbal.com/orders/[order-id]/tracking -o /dev/null -w "HTTP Status: %{http_code}\n"
```

**Order Cancellation Page:**
```bash
curl -s https://extremelifeherbal.com/orders/[order-id]/cancel -o /dev/null -w "HTTP Status: %{http_code}\n"
```

**Order Return Page:**
```bash
curl -s https://extremelifeherbal.com/orders/[order-id]/return -o /dev/null -w "HTTP Status: %{http_code}\n"
```

**API Endpoints:**
```bash
# Get order details
curl -s https://extremelifeherbal.com/api/orders/[order-id] -H "Authorization: Bearer [token]"

# Get tracking information
curl -s https://extremelifeherbal.com/api/orders/[order-id]/tracking -H "Authorization: Bearer [token]"
```

### 5. Verify All Pages Return HTTP 200

All pages should return HTTP 200 status code when accessed by authenticated users.

## New Features Deployed

### Pages
- `/orders/[id]` - Order details with items, pricing, and shipping info
- `/orders/[id]/tracking` - Real-time shipment tracking with timeline
- `/orders/[id]/cancel` - Order cancellation with reason and refund method
- `/orders/[id]/return` - Return request with item selection and condition

### API Endpoints
- `GET /api/orders/[id]` - Get order details
- `GET /api/orders/[id]/tracking` - Get shipment tracking
- `POST /api/orders/[id]/cancel` - Cancel order
- `POST /api/orders/[id]/return` - Request return

### Features
- Order status tracking with visual timeline
- Shipment tracking integration (LBC, 2GO, JRS Express)
- Order cancellation with refund processing
- Return request management
- Philippines-specific logistics support

## Rollback Instructions

If deployment fails, rollback to previous version:

```bash
cd /var/www/philippines-ecommerce
git revert HEAD
npm run build
pm2 restart all
```

## Monitoring

Monitor application logs:
```bash
pm2 logs
```

Check PM2 status:
```bash
pm2 status
```

## Success Criteria

✓ All pages return HTTP 200 status
✓ Order details display correctly
✓ Tracking information loads
✓ Cancellation form works
✓ Return request form works
✓ All 108 tests pass
✓ No console errors
✓ Application responds within 2 seconds

## Support

For issues, check:
1. PM2 logs: `pm2 logs`
2. Nginx logs: `/var/log/nginx/error.log`
3. Application logs: Check PM2 process output

