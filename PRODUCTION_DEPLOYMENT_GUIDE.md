# Production Deployment Guide - Currency Fixes & Sample Products

**Date**: November 14, 2025  
**VPS**: 109.205.181.119  
**Application**: https://extremelifeherbal.com  
**Status**: READY FOR DEPLOYMENT

---

## Prerequisites

- SSH access to VPS (109.205.181.119)
- Root or sudo privileges
- Node.js 18+ installed
- PM2 installed globally
- Git configured

---

## Task 1: Deploy Currency Symbol Fixes

### Step 1: SSH into VPS
```bash
ssh root@109.205.181.119
```

### Step 2: Navigate to Application Directory
```bash
cd /var/www/philippines-ecommerce
```

### Step 3: Pull Latest Changes
```bash
git pull origin master
```
**Expected Output**: Should show commit b31c24d and previous commits

### Step 4: Check Node Version
```bash
node --version
npm --version
```
**Expected**: Node v18+ and npm v9+

### Step 5: Install Dependencies (if needed)
```bash
npm install
```

### Step 6: Build Application
```bash
npm run build
```
**Expected**: Build completes with 0 errors, generates .next folder

### Step 7: Restart PM2
```bash
pm2 restart all
pm2 status
```
**Expected**: All processes show "online" status

### Step 8: Verify Deployment
```bash
curl -s https://extremelifeherbal.com | grep -o "₱[0-9]*\.[0-9]*" | head -3
```
**Expected Output**:
```
₱19.99
₱29.99
₱39.99
```

### Step 9: Visual Verification
Open browser and visit: https://extremelifeherbal.com
- Check Featured Products section
- Verify all 3 products show ₱ symbol
- Herbal Tea: ₱19.99
- Vitamin Supplement: ₱29.99
- Herbal Oil: ₱39.99

---

## Task 2: Add Sample Products

### Step 1: Verify Database Connection
```bash
cd /var/www/philippines-ecommerce
npx prisma db push
```

### Step 2: Run Sample Products Script
```bash
npx ts-node scripts/add-sample-products.ts
```

**Expected Output**:
```
🛍️ Adding sample products to production database...

✅ Created: Organic Chamomile Tea (₱249.99)
✅ Created: Ginger Turmeric Tea (₱299.99)
✅ Created: Vitamin C Supplement (₱349.99)
✅ Created: Magnesium Complex (₱399.99)
✅ Created: Eucalyptus Essential Oil (₱449.99)
✅ Created: Lavender Essential Oil (₱499.99)
✅ Created: Peppermint Tea (₱199.99)
✅ Created: Zinc Supplement (₱299.99)
✅ Created: Tea Tree Oil (₱399.99)
✅ Created: Green Tea Extract (₱349.99)

✅ Sample products added successfully!
```

### Step 3: Verify Products in Database
```bash
npx prisma studio
```
Or query directly:
```bash
sqlite3 prisma/dev.db "SELECT name, price FROM products LIMIT 10;"
```

### Step 4: Verify on Website
Visit: https://extremelifeherbal.com/products
- Check all 10 products are visible
- Verify prices show ₱ symbol
- Test search functionality
- Test category filtering

---

## Task 3: Verify Live Selling Features

### Step 1: Login to Production
1. Visit: https://extremelifeherbal.com
2. Click "Login" or navigate to /auth/signin
3. Enter credentials:
   - Email: seller@test.com
   - Password: Seller123!

### Step 2: Navigate to Live Selling
- Click on "Vendor Dashboard" or navigate to /vendor/dashboard
- Look for "Live Selling" or "Go Live" option
- Click to create new live stream

### Step 3: Create Test Live Stream
- Fill in stream details:
  - Title: "Test Live Selling Session"
  - Description: "Testing live selling features"
  - Thumbnail: (optional)
- Click "Create Stream"

### Step 4: Verify Stream Created
- Check if stream appears in /live or /vendor/live
- Verify stream details are correct
- Check if stream can be started

### Step 5: Document Results
- Note any errors encountered
- Screenshot stream creation page
- Record stream ID for reference

---

## Task 4: Final Verification

### Verification Checklist

#### Currency Symbols
- [ ] Homepage shows ₱19.99 for Herbal Tea
- [ ] Homepage shows ₱29.99 for Vitamin Supplement
- [ ] Homepage shows ₱39.99 for Herbal Oil
- [ ] All prices use ₱ symbol (not $)

#### Sample Products
- [ ] All 10 products visible on /products page
- [ ] Products display with ₱ currency symbol
- [ ] Search functionality works
- [ ] Category filtering works
- [ ] Product details page loads correctly

#### Live Selling
- [ ] Login with seller@test.com successful
- [ ] Can navigate to live selling section
- [ ] Can create new live stream
- [ ] Stream appears in listings
- [ ] No critical errors in console

#### Build & Performance
- [ ] Build completed with 0 errors
- [ ] PM2 processes all online
- [ ] HTTPS certificate valid
- [ ] Page load time acceptable
- [ ] No 502 Bad Gateway errors

### Troubleshooting

#### If Currency Symbols Still Show $
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
pm2 restart all
```

#### If Products Script Fails
```bash
# Check database connection
npx prisma db push
# Check for errors
npx prisma studio
```

#### If Live Selling Not Working
```bash
# Check logs
pm2 logs
# Restart specific process
pm2 restart app
```

---

## Rollback Instructions

If deployment fails, rollback to previous version:

```bash
cd /var/www/philippines-ecommerce
git revert HEAD
npm run build
pm2 restart all
```

---

## Success Criteria

✅ Currency symbols display as ₱ (not $)  
✅ All 10 sample products created  
✅ Products visible on /products page  
✅ Live selling features accessible  
✅ No critical errors in logs  
✅ HTTPS working correctly  
✅ Performance acceptable  

---

## Post-Deployment

1. Monitor PM2 logs for errors
2. Test all major features
3. Verify analytics tracking
4. Check email notifications
5. Monitor database performance
6. Document any issues
7. Commit fixes to GitHub
8. Proceed with Phase 20.1

---

## Support

For issues:
- Check PM2 logs: `pm2 logs`
- Check application logs: `tail -f /var/log/app.log`
- SSH into VPS and debug manually
- Contact development team

---

**Status**: READY FOR DEPLOYMENT  
**Estimated Time**: 15-30 minutes  
**Risk Level**: LOW (non-breaking changes)

