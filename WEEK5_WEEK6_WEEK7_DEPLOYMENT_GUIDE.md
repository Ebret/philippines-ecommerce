# Complete Deployment Guide: Weeks 5, 6, 7

**Target**: Production VPS at 109.205.181.119
**Domain**: https://extremelifeherbal.com
**Latest Commit**: 54e9d14

---

## 🎯 What's Being Deployed

### Week 5: Order Management System
- 4 order pages with tracking, cancellation, returns
- 5+ API endpoints for order operations
- Logistics integration (LBC, 2GO, JRS Express)

### Week 6: Vendor Dashboard & Analytics
- 5 vendor management pages
- 8+ API endpoints for vendor operations
- Real-time analytics and earnings tracking

### Week 7: Advanced Search & Filtering
- Advanced search page with filters
- 3 search API endpoints
- 5 filter components (price, category, brand, rating, condition)

---

## 📋 Quick Deployment (Copy & Paste)

```bash
# SSH into VPS
ssh root@109.205.181.119

# Navigate to project
cd /var/www/philippines-ecommerce

# Pull latest code
git pull origin master

# Install dependencies
npm install

# Build application
npm run build

# Restart services
pm2 restart all
pm2 save

# Verify
pm2 status
```

---

## ✅ Verification Tests

After deployment, run these commands:

```bash
# Test Week 5 - Order Pages
curl -s https://extremelifeherbal.com/orders/test-1 -o /dev/null -w "Orders Page: %{http_code}\n"
curl -s https://extremelifeherbal.com/orders/test-1/tracking -o /dev/null -w "Tracking: %{http_code}\n"
curl -s https://extremelifeherbal.com/orders/test-1/cancel -o /dev/null -w "Cancel: %{http_code}\n"
curl -s https://extremelifeherbal.com/orders/test-1/return -o /dev/null -w "Return: %{http_code}\n"

# Test Week 6 - Vendor Pages
curl -s https://extremelifeherbal.com/vendor/dashboard -o /dev/null -w "Vendor Dashboard: %{http_code}\n"
curl -s https://extremelifeherbal.com/vendor/analytics -o /dev/null -w "Analytics: %{http_code}\n"
curl -s https://extremelifeherbal.com/vendor/products -o /dev/null -w "Products: %{http_code}\n"
curl -s https://extremelifeherbal.com/vendor/orders -o /dev/null -w "Orders: %{http_code}\n"
curl -s https://extremelifeherbal.com/vendor/earnings -o /dev/null -w "Earnings: %{http_code}\n"

# Test Week 7 - Search
curl -s https://extremelifeherbal.com/search -o /dev/null -w "Search: %{http_code}\n"
curl -s "https://extremelifeherbal.com/api/search/suggestions?query=test" -o /dev/null -w "Suggestions API: %{http_code}\n"
curl -s "https://extremelifeherbal.com/api/search/filters" -o /dev/null -w "Filters API: %{http_code}\n"
curl -s "https://extremelifeherbal.com/api/search/results?query=test" -o /dev/null -w "Results API: %{http_code}\n"
```

---

## 🔧 Troubleshooting

**502 Bad Gateway**
```bash
pm2 restart all
pm2 logs
```

**Build Errors**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Port Already in Use**
```bash
pm2 kill
pm2 start ecosystem.config.js
```

---

## 📊 Expected Results

All pages should return **HTTP 200** after deployment.

---

**Status**: Ready for deployment
**Estimated Time**: 10-15 minutes

