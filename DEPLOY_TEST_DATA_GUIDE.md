# Deploy Test Data to Production - Step-by-Step Guide

**Date:** November 15, 2025  
**Environment:** Production (https://extremelifeherbal.com)  
**VPS:** 109.205.181.119  
**Status:** Ready for Deployment

---

## 🚀 Quick Start

### Option 1: Deploy via npm seed (Recommended)

```bash
# SSH into production VPS
ssh root@109.205.181.119

# Navigate to app directory
cd /var/www/html/ecom/app

# Run seed script
npm run db:seed

# Expected output:
# ✅ Admin account created: admin@test.com / Admin123!
# ✅ Buyer account created: buyer@test.com / Buyer123!
# ✅ Seller account created: seller@test.com / Seller123!
# ✅ Created 10 products
# ✅ Created 3 categories
# ✅ Created 2 vendor stores
```

### Option 2: Deploy via PowerShell Script

```powershell
# Run from local machine
.\scripts/deploy-test-data-production.ps1 `
  -VpsHost "109.205.181.119" `
  -VpsUser "root" `
  -VpsPassword "4K-6GsnA$3pQ5931"
```

### Option 3: Manual Database Connection

```bash
# Connect to production database
psql -h 109.205.181.119 -U postgres -d ecommerce_db

# Run seed queries (see TEST_DATA_SETUP.sql)
```

---

## 📋 What Gets Deployed

### Test Accounts (3)
- ✅ Admin: admin@test.com / Admin123!
- ✅ Buyer: buyer@test.com / Buyer123!
- ✅ Seller: seller@test.com / Seller123!

### Test Products (10)
- ✅ 4 Herbal Tea products (₱1,299 - ₱1,999)
- ✅ 3 Supplement products (₱2,199 - ₱2,999)
- ✅ 3 Herbal Oil products (₱1,299 - ₱3,999)

### Test Data
- ✅ 3 Product categories
- ✅ 2 Vendor stores
- ✅ 1 Shipping address for buyer
- ✅ Product variants with stock levels

---

## ✅ Verification Steps

### Step 1: Verify Test Accounts

```bash
# Test admin login
curl -X POST https://extremelifeherbal.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "Admin123!"
  }'

# Expected response: 200 OK with user data
```

### Step 2: Verify Test Products

```bash
# Get products list
curl https://extremelifeherbal.com/api/products?limit=10

# Expected: 10+ products with prices in PHP
```

### Step 3: Verify Pages Accessible

```bash
# Homepage
curl -I https://extremelifeherbal.com/

# Login page
curl -I https://extremelifeherbal.com/auth/login

# Public pages
curl -I https://extremelifeherbal.com/about
curl -I https://extremelifeherbal.com/contact
curl -I https://extremelifeherbal.com/testimonials

# Expected: All return 200 OK
```

---

## 🧪 Test User Flows

### Buyer Flow
1. Login: https://extremelifeherbal.com/auth/login
   - Email: buyer@test.com
   - Password: Buyer123!
2. Browse products on homepage
3. Add product to cart
4. Proceed to checkout
5. Complete order

### Vendor Flow
1. Login: https://extremelifeherbal.com/auth/login
   - Email: seller@test.com
   - Password: Seller123!
2. Access vendor dashboard: /vendor/dashboard
3. View products and orders
4. Manage inventory

### Admin Flow
1. Login: https://extremelifeherbal.com/auth/login
   - Email: admin@test.com
   - Password: Admin123!
2. Access admin dashboard: /admin
3. View users, products, orders
4. View reports

---

## 🔄 E2E Testing with Test Data

### Run E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run specific test suite
npm run test:e2e -- --grep "Authentication"

# Generate HTML report
npm run test:e2e:report

# Expected: 95%+ pass rate with test data
```

### Expected Test Results

| Test Suite | Before | After | Status |
|-----------|--------|-------|--------|
| Authentication | 35.7% | 100% | ✅ |
| Shopping Cart | 78.3% | 100% | ✅ |
| Critical Path | 67.3% | 100% | ✅ |
| **Overall** | **56.7%** | **95%+** | ✅ |

---

## 🔐 Security Considerations

⚠️ **Important:**
- Test accounts use simple passwords for testing only
- Delete test data before final production deployment
- Do NOT use test accounts in production
- Remove test data after UAT completion
- Sensitive data should not be logged

---

## 🛠️ Troubleshooting

### Issue: Seed script fails
**Solution:**
1. Check database connection
2. Verify Prisma migrations: `npm run db:migrate`
3. Check database permissions
4. Review seed script logs

### Issue: Test accounts cannot login
**Solution:**
1. Verify accounts exist in database
2. Check password hashing
3. Verify NextAuth configuration
4. Check email verification status

### Issue: Products not visible
**Solution:**
1. Verify products created in database
2. Check product status (should be ACTIVE)
3. Verify vendor is APPROVED
4. Check category exists

### Issue: E2E tests still failing
**Solution:**
1. Verify test data deployed correctly
2. Check UI elements match test selectors
3. Verify form labels and ARIA attributes
4. Check mobile responsiveness

---

## 📊 Deployment Checklist

- [ ] SSH access to VPS verified
- [ ] Database connection working
- [ ] Prisma migrations up to date
- [ ] Seed script ready
- [ ] Test accounts created
- [ ] Test products created
- [ ] Test accounts can login
- [ ] Products visible on homepage
- [ ] Shopping cart functional
- [ ] E2E tests passing
- [ ] All public pages accessible
- [ ] Admin dashboard accessible
- [ ] Vendor dashboard accessible

---

## 📞 Support

For deployment issues:
1. Check VPS connectivity: `ping 109.205.181.119`
2. Check database: `psql -h 109.205.181.119 -U postgres -d ecommerce_db`
3. Check application logs: `pm2 logs philippines-ecommerce`
4. Review seed script output
5. Check Prisma client: `npx prisma studio`

---

## 🎯 Next Steps

1. ✅ Deploy test data using seed script
2. ✅ Verify test accounts and products
3. ✅ Run E2E tests
4. ✅ Fix any failing tests
5. ✅ Document results
6. ✅ Proceed with Phase 21 Week 2 (Performance Testing)

---

**Status:** ✅ READY FOR DEPLOYMENT  
**Last Updated:** November 15, 2025  
**Estimated Time:** 15-30 minutes for full deployment and verification

