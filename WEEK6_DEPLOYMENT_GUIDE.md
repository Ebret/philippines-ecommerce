# Week 6: Vendor Dashboard & Analytics - Deployment Guide

## Overview
This guide provides step-by-step instructions for deploying Week 6: Vendor Dashboard & Analytics to the production VPS at 109.205.181.119.

## Deployment Steps

### 1. Build the Application
```bash
cd philippines-ecommerce
npm run build
```

Expected output: Build completes successfully with all vendor pages compiled.

### 2. Run All Tests
```bash
npm test -- --run
```

Expected: All Week 6 tests pass (180+ tests):
- week6-vendor-dashboard.test.ts: 60 tests ✓
- week6-vendor-api.test.ts: 60 tests ✓
- week6-vendor-pages.test.ts: 60 tests ✓

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

**Vendor Dashboard:**
```bash
curl -s https://extremelifeherbal.com/vendor/dashboard -o /dev/null -w "HTTP Status: %{http_code}\n"
```

**Vendor Analytics:**
```bash
curl -s https://extremelifeherbal.com/vendor/analytics -o /dev/null -w "HTTP Status: %{http_code}\n"
```

**Vendor Products:**
```bash
curl -s https://extremelifeherbal.com/vendor/products -o /dev/null -w "HTTP Status: %{http_code}\n"
```

**Vendor Orders:**
```bash
curl -s https://extremelifeherbal.com/vendor/orders -o /dev/null -w "HTTP Status: %{http_code}\n"
```

**Vendor Earnings:**
```bash
curl -s https://extremelifeherbal.com/vendor/earnings -o /dev/null -w "HTTP Status: %{http_code}\n"
```

**API Endpoints:**
```bash
# Get dashboard KPIs
curl -s https://extremelifeherbal.com/api/vendor/dashboard -H "Authorization: Bearer [token]"

# Get analytics
curl -s https://extremelifeherbal.com/api/vendor/analytics -H "Authorization: Bearer [token]"

# Get product performance
curl -s https://extremelifeherbal.com/api/vendor/products/performance -H "Authorization: Bearer [token]"

# Get vendor orders
curl -s https://extremelifeherbal.com/api/vendor/orders -H "Authorization: Bearer [token]"

# Get earnings
curl -s https://extremelifeherbal.com/api/vendor/earnings -H "Authorization: Bearer [token]"
```

### 5. Verify All Pages Return HTTP 200

All pages should return HTTP 200 status code when accessed by authenticated vendor users.

## New Features Deployed

### Pages
- `/vendor/dashboard` - Main vendor dashboard with KPIs
- `/vendor/analytics` - Detailed analytics dashboard
- `/vendor/products` - Product performance tracking
- `/vendor/orders` - Order management dashboard
- `/vendor/earnings` - Earnings and payout tracking

### API Endpoints
- `GET /api/vendor/dashboard` - Dashboard KPIs
- `GET /api/vendor/analytics` - Detailed analytics
- `GET /api/vendor/products/performance` - Product metrics
- `GET /api/vendor/orders` - Order list with filtering
- `GET /api/vendor/earnings` - Earnings summary
- `POST /api/vendor/earnings/request-payout` - Request payout

### Features
- Real-time KPI display
- Sales trends visualization
- Revenue breakdown
- Customer insights
- Product performance tracking
- Order management
- Earnings tracking
- Payout management

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
✓ Dashboard displays KPIs correctly
✓ Analytics data loads
✓ Product performance displays
✓ Orders list works
✓ Earnings tracking works
✓ All 180+ tests pass
✓ No console errors
✓ Application responds within 2 seconds

## Support

For issues, check:
1. PM2 logs: `pm2 logs`
2. Nginx logs: `/var/log/nginx/error.log`
3. Application logs: Check PM2 process output

