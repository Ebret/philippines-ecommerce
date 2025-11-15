# Phase 21 - Test Data Deployment Execution Guide

**Date:** November 15, 2025  
**Status:** READY FOR EXECUTION  
**Environment:** Production (https://extremelifeherbal.com)  
**VPS:** 109.205.181.119

---

## 🚀 Quick Start - Deploy Test Data Now

### Method 1: SSH Direct Execution (Recommended)

```bash
# Step 1: SSH into production VPS
ssh root@109.205.181.119
# Password: 4K-6GsnA$3pQ5931

# Step 2: Navigate to application directory
cd /var/www/html/ecom/app

# Step 3: Run database seed script
npm run db:seed

# Expected output:
# ✅ Admin account created: admin@test.com / Admin123!
# ✅ Buyer account created: buyer@test.com / Buyer123!
# ✅ Seller account created: seller@test.com / Seller123!
# ✅ Created 10 products
# ✅ Created 3 categories
# ✅ Created 2 vendor stores
```

### Method 2: Using Bash Script

```bash
# Copy script to VPS
scp scripts/deploy-test-data.sh root@109.205.181.119:/var/www/html/ecom/app/

# SSH into VPS
ssh root@109.205.181.119

# Run script
cd /var/www/html/ecom/app
chmod +x deploy-test-data.sh
./deploy-test-data.sh
```

### Method 3: Using PM2 (If available)

```bash
# SSH into VPS
ssh root@109.205.181.119

# Run seed via PM2
pm2 exec "npm run db:seed" --name "seed-test-data"

# Monitor execution
pm2 logs seed-test-data
```

---

## ✅ Verification Steps (After Deployment)

### Step 1: Verify Test Accounts

```bash
# Test admin login
curl -X POST https://extremelifeherbal.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"Admin123!"}'

# Expected response: 200 OK with user data

# Test buyer login
curl -X POST https://extremelifeherbal.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"buyer@test.com","password":"Buyer123!"}'

# Test seller login
curl -X POST https://extremelifeherbal.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"seller@test.com","password":"Seller123!"}'
```

### Step 2: Verify Test Products

```bash
# Get products list
curl https://extremelifeherbal.com/api/products?limit=10

# Expected: 10+ products with prices in PHP (₱)
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

## 🧪 Run E2E Tests (After Verification)

### Step 1: Run E2E Test Suite

```bash
# From local machine in project directory
npm run test:e2e

# Expected: 95%+ pass rate (171/180 tests)
```

### Step 2: Generate HTML Report

```bash
# Generate report
npm run test:e2e:report

# View report
open playwright-report/index.html
```

### Step 3: Review Test Results

Expected improvements:
- Authentication Tests: 35.7% → 100% (+64.3%)
- Shopping Cart Tests: 78.3% → 100% (+21.7%)
- Critical Path Tests: 67.3% → 100% (+32.7%)
- Overall: 56.7% → 95%+ (+38.3%)

---

## 📋 Test Data Details

### Test Accounts (3 Total)

| Email | Password | Role | Status |
|-------|----------|------|--------|
| admin@test.com | Admin123! | ADMIN | ACTIVE |
| buyer@test.com | Buyer123! | BUYER | ACTIVE |
| seller@test.com | Seller123! | SELLER | ACTIVE |

### Test Products (10 Total)

**Herbal Tea (4 products)**
- Premium Herbal Tea Blend - ₱1,999
- Ginger Turmeric Tea - ₱1,599
- Chamomile Sleep Tea - ₱1,799
- Green Tea Extract - ₱1,899

**Supplements (3 products)**
- Natural Vitamin Supplement - ₱2,999
- Immune Boost Supplement - ₱2,499
- Calcium & Magnesium - ₱2,199

**Herbal Oils (3 products)**
- Pure Herbal Oil Extract - ₱3,999
- Lavender Essential Oil - ₱1,299
- Peppermint Oil - ₱1,499

---

## 🔍 Troubleshooting

### Issue: npm command not found
**Solution:**
```bash
# Check Node.js installation
node --version
npm --version

# If not found, install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Issue: Database connection error
**Solution:**
```bash
# Check database connection
psql -h localhost -U postgres -d ecommerce_db -c "SELECT 1"

# Check Prisma migrations
npm run db:migrate

# Check database status
pm2 logs
```

### Issue: Seed script fails
**Solution:**
```bash
# Check seed script logs
npm run db:seed 2>&1 | tee seed.log

# Review log file
cat seed.log

# Check database permissions
psql -h localhost -U postgres -d ecommerce_db -c "\dt"
```

### Issue: Test accounts cannot login
**Solution:**
```bash
# Verify accounts exist in database
psql -h localhost -U postgres -d ecommerce_db -c "SELECT email, role FROM users WHERE email LIKE '%test.com'"

# Check password hashing
npm run db:seed --verbose

# Verify NextAuth configuration
cat .env.local | grep NEXTAUTH
```

---

## 📊 Deployment Checklist

- [ ] SSH access to VPS verified
- [ ] Database connection working
- [ ] Prisma migrations up to date
- [ ] Seed script ready
- [ ] Run: npm run db:seed
- [ ] Test admin login
- [ ] Test buyer login
- [ ] Test seller login
- [ ] Verify 10 products visible
- [ ] Verify all pages accessible
- [ ] Run E2E tests
- [ ] Review test results
- [ ] Document deployment

---

## 📞 Support

### VPS Access
- **Host:** 109.205.181.119
- **User:** root
- **Password:** 4K-6GsnA$3pQ5931
- **App Directory:** /var/www/html/ecom/app

### Database Access
- **Host:** localhost (on VPS)
- **User:** postgres
- **Database:** ecommerce_db
- **Port:** 5432

### Application URLs
- **Production:** https://extremelifeherbal.com
- **API Base:** https://extremelifeherbal.com/api
- **Admin Dashboard:** https://extremelifeherbal.com/admin
- **Vendor Dashboard:** https://extremelifeherbal.com/vendor/dashboard

---

## 🎯 Next Steps

1. ✅ Deploy test data using `npm run db:seed`
2. ✅ Verify test accounts and products
3. ✅ Run E2E tests
4. ✅ Fix any failing tests
5. ✅ Document results
6. ✅ Proceed with Phase 21 Week 2

---

**Status:** ✅ READY FOR EXECUTION  
**Estimated Time:** 15-30 minutes  
**Expected Outcome:** 95%+ E2E pass rate  
**Latest Commit:** 71aff65

