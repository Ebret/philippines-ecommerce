# 🔧 Authentication Fix - Deployment Guide

**Issue:** `Invalid prisma.user.findUnique() invocation: Cannot fetch data from service: fetch failed`

**Status:** ✅ FIXED AND READY FOR DEPLOYMENT

---

## 🚀 DEPLOYMENT STEPS

### Step 1: SSH into VPS

```bash
ssh root@109.205.181.119
cd /var/www/html/ecom/app
```

### Step 2: Pull Latest Changes

```bash
git pull origin feature/relivator-ui-integration
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Build Application

```bash
npm run build
```

### Step 5: Restart PM2

```bash
pm2 restart ecosystem.config.js
sleep 5
```

### Step 6: Verify Deployment

```bash
pm2 status
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" https://extremelifeherbal.com
```

---

## ✅ WHAT WAS FIXED

### 1. Prisma Client Caching (src/lib/prisma.ts)
- Cache Prisma client in both development and production
- Prevents multiple PrismaClient instances
- Fixes connection pool exhaustion

### 2. Error Handling (src/lib/auth.ts)
- Added try-catch to authorize callback
- Added try-catch to signIn callback
- Added try-catch to events.signIn
- Improved error logging for debugging

---

## 🧪 TEST AFTER DEPLOYMENT

### Test Accounts

```
Admin:  admin@test.com / Admin123!
Buyer:  buyer@test.com / Buyer123!
Seller: seller@test.com / Seller123!
```

### Test URLs

1. **Homepage:** https://extremelifeherbal.com
2. **Login:** https://extremelifeherbal.com/auth/login
3. **Admin Dashboard:** https://extremelifeherbal.com/admin
4. **Vendor Dashboard:** https://extremelifeherbal.com/vendor/dashboard
5. **Account Profile:** https://extremelifeherbal.com/account/profile

### Test Steps

1. Go to https://extremelifeherbal.com/auth/login
2. Enter: admin@test.com / Admin123!
3. Click "Sign In"
4. Should redirect to /admin dashboard
5. Verify no "fetch failed" error

---

## 📊 DEPLOYMENT CHECKLIST

- [ ] SSH into VPS
- [ ] Pull latest changes
- [ ] Install dependencies
- [ ] Build application
- [ ] Restart PM2
- [ ] Verify PM2 status
- [ ] Test homepage (HTTP 200)
- [ ] Test login with admin account
- [ ] Test login with buyer account
- [ ] Test login with seller account
- [ ] Verify dashboards load correctly
- [ ] Check PM2 logs for errors

---

## 🔍 TROUBLESHOOTING

### If login still fails:

```bash
# Check PM2 logs
pm2 logs philippines-ecommerce --lines 100

# Check database connection
psql postgresql://postgres:password@localhost:5432/philippines_ecommerce -c "SELECT COUNT(*) FROM \"User\";"

# Restart PM2 completely
pm2 stop philippines-ecommerce
pm2 delete philippines-ecommerce
pm2 start ecosystem.config.js
```

---

**Status:** Ready for deployment ✅

