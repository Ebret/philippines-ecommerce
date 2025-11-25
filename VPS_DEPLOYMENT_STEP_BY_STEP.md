# 🚀 VPS DEPLOYMENT - STEP BY STEP GUIDE

**Status:** ✅ READY FOR MANUAL EXECUTION  
**Latest Commit:** cc27731  
**Date:** 2025-11-25

---

## 📋 STEP-BY-STEP DEPLOYMENT

### Step 1: Navigate to App Directory
```bash
cd /var/www/html/ecom/app
pwd
```
**Expected Output:** `/var/www/html/ecom/app`

---

### Step 2: Pull Latest Code
```bash
git pull origin feature/relivator-ui-integration
```
**Expected Output:**
```
From github.com:Ebret/philippines-ecommerce
 * branch            feature/relivator-ui-integration -> FETCH_HEAD
Updating [hash]...[hash]
Fast-forward
 FIX_CRITICAL_ISSUES.ts | 20 ++++++++++++++------
 1 file changed, 16 insertions(+), 4 deletions(-)
```

---

### Step 3: Run Database Fix Script
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

📋 Issue 2: Checking seller@test.com vendor profile...
✅ seller@test.com found
   Creating vendor profile...
✅ Vendor profile created

📋 Issue 3: Checking buyer@test.com...
✅ buyer@test.com found
   Role: BUYER

==================================================
✅ ALL CRITICAL ISSUES FIXED!
```

---

### Step 4: Stop Existing Processes
```bash
pm2 kill
sleep 3
pkill -9 node
sleep 2
```
**Expected Output:** PM2 processes stopped

---

### Step 5: Clean Build
```bash
rm -rf .next
npm run build
```
**Expected Output:** Build completes successfully

---

### Step 6: Start PM2
```bash
pm2 start ecosystem.config.js
sleep 10
pm2 status
```
**Expected Output:** PM2 processes online

---

### Step 7: Verify Deployment
```bash
curl -s https://extremelifeherbal.com | head -20
```
**Expected Output:** HTML content from homepage

---

## 🧪 TESTING URLS

After deployment, test these URLs in your browser:

1. **Admin Dashboard**
   - https://extremelifeherbal.com/admin
   - Login: admin@test.com / Admin123!

2. **Vendor Dashboard**
   - https://extremelifeherbal.com/vendor/dashboard
   - Login: seller@test.com / Seller123!

3. **Live Streams**
   - https://extremelifeherbal.com/live

4. **Vendor Live**
   - https://extremelifeherbal.com/vendor/live
   - Login: seller@test.com / Seller123!

---

## ⚠️ TROUBLESHOOTING

If Step 3 fails:
```bash
pm2 logs
npm run build 2>&1 | tail -50
```

If Step 5 fails:
```bash
npm install
npm run build
```

---

**Execute these steps in order on the VPS!**

