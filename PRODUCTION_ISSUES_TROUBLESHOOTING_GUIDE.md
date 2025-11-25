# 🔧 PRODUCTION ISSUES - TROUBLESHOOTING & FIX GUIDE

**Status:** READY FOR DEPLOYMENT  
**Latest Commit:** 7373143

---

## 🎯 QUICK FIX (5 MINUTES)

### Step 1: SSH to VPS
```bash
ssh root@109.205.181.119
cd /var/www/html/ecom/app
```

### Step 2: Run Database Fix Script
```bash
npx ts-node FIX_CRITICAL_ISSUES.ts
```

**Expected Output:**
```
🔧 FIXING CRITICAL DATABASE ISSUES
==================================================

📋 Issue 1: Checking admin@test.com...
✅ admin@test.com found
   Role: ADMIN
   Status: ACTIVE

📋 Issue 2: Checking seller@test.com vendor profile...
✅ seller@test.com found
   Has Vendor Profile: true
   Vendor ID: [id]

📋 Issue 3: Checking buyer@test.com...
✅ buyer@test.com found
   Role: BUYER

==================================================
✅ ALL CRITICAL ISSUES FIXED!
```

### Step 3: Restart PM2
```bash
pm2 kill && sleep 3 && pkill -9 node && sleep 2
rm -rf .next && npm run build
pm2 start ecosystem.config.js && sleep 10 && pm2 status
```

### Step 4: Verify
```bash
curl -s https://extremelifeherbal.com | head -20
```

---

## 📊 WHAT THE SCRIPT FIXES

| Issue | Before | After |
|-------|--------|-------|
| admin@test.com role | May be BUYER | ADMIN ✅ |
| seller@test.com vendor | Missing | Created ✅ |
| buyer@test.com role | May be SELLER | BUYER ✅ |

---

## ✅ TESTING AFTER FIX

### Test 1: Admin Dashboard
```
URL: https://extremelifeherbal.com/admin
Login: admin@test.com / Admin123!
Expected: Dashboard loads (no redirect)
```

### Test 2: Vendor Dashboard
```
URL: https://extremelifeherbal.com/vendor/dashboard
Login: seller@test.com / Seller123!
Expected: Real data (not fallback UI)
```

### Test 3: Live Streams
```
URL: https://extremelifeherbal.com/live
Expected: Page loads (empty state is OK)
```

---

## 🐛 IF ISSUES PERSIST

### Check Database Directly
```bash
psql -U postgres -d ecommerce -c "
SELECT email, role FROM \"User\" WHERE email IN ('admin@test.com', 'seller@test.com', 'buyer@test.com');
SELECT u.email, v.storeName FROM \"User\" u LEFT JOIN \"Vendor\" v ON u.id = v.\"userId\" WHERE u.email = 'seller@test.com';
"
```

### Check PM2 Logs
```bash
pm2 logs
```

### Check Build Errors
```bash
npm run build 2>&1 | tail -50
```

---

**Status:** ✅ READY FOR PRODUCTION DEPLOYMENT

