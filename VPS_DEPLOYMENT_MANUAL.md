# 🚀 VPS DEPLOYMENT MANUAL - EXECUTE DIRECTLY ON VPS

**Status:** Ready for Manual Execution

**VPS IP:** 109.205.181.119

**App Directory:** /var/www/html/ecom/app

---

## 📋 DEPLOYMENT STEPS (Copy & Paste on VPS Terminal)

### Step 1: Navigate to App Directory
```bash
cd /var/www/html/ecom/app
pwd
```

### Step 2: Pull Latest Changes
```bash
git fetch origin
git pull origin feature/relivator-ui-integration
```

**Expected Output:**
```
From github.com:Ebret/philippines-ecommerce
 * branch            feature/relivator-ui-integration -> FETCH_HEAD
Updating 17f1420..9df6bf8
Fast-forward
 CRITICAL_FIX_SUMMARY.md                    | 112 +++++++++++++++++++++++
 DEPLOY_ALL_FIXES.sh                        | 93 +++++++++++++++++++++
 DEPLOY_SESSION_PROVIDER_FIX.sh             | 60 ++++++++++++
 SESSION_PROVIDER_FIX.md                    | 128 ++++++++++++++++++++++++++
 src/components/providers.tsx               | 11 +++
 src/app/layout.tsx                         | 6 +-
```

### Step 3: Update DATABASE_URL with Connection Pooling
```bash
nano .env.production
```

**Find this line:**
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/philippines_ecommerce
```

**Replace with:**
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/philippines_ecommerce?schema=public&connection_limit=5&pool_timeout=10
```

**Save:** Press `Ctrl+O`, then `Enter`, then `Ctrl+X`

### Step 4: Install Dependencies
```bash
npm install
```

### Step 5: Build Application
```bash
npm run build
```

**Expected Output:**
```
✓ Compiled successfully in 9.7s
✓ Generating static pages (97/97)
```

### Step 6: Restart PM2
```bash
pm2 restart ecosystem.config.js
sleep 15
pm2 status
```

**Expected Output:**
```
│ 0  │ philippines-ecommerce    │ default     │ N/A     │ fork    │ 3820310  │ 5s     │ 3    │ online    │ 0%       │ 60.1mb   │ root     │ disabled │
```

### Step 7: Verify Deployment
```bash
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" https://extremelifeherbal.com
```

**Expected Output:**
```
HTTP Status: 200
```

### Step 8: Check PM2 Logs
```bash
pm2 logs philippines-ecommerce --lines 50 --nostream
```

---

## 🧪 TEST AFTER DEPLOYMENT

### Test 1: Admin Dashboard
```
URL: https://extremelifeherbal.com/admin
Login: admin@test.com / Admin123!
Expected: Page loads without "Application error"
```

### Test 2: Vendor Dashboard
```
URL: https://extremelifeherbal.com/vendor/dashboard
Login: seller@test.com / Seller123!
Expected: Page loads without "Application error"
```

### Test 3: Account Profile
```
URL: https://extremelifeherbal.com/account/profile
Login: buyer@test.com / Buyer123!
Expected: Page loads without "Application error"
```

---

## ✅ DEPLOYMENT CHECKLIST

- [ ] Navigated to /var/www/html/ecom/app
- [ ] Pulled latest changes from GitHub
- [ ] Updated DATABASE_URL with connection pooling
- [ ] Installed dependencies
- [ ] Built application successfully
- [ ] Restarted PM2
- [ ] Verified PM2 status (online)
- [ ] Tested homepage (HTTP 200)
- [ ] Tested admin dashboard (no errors)
- [ ] Tested vendor dashboard (no errors)
- [ ] Tested account profile (no errors)

---

**Status:** ✅ READY FOR MANUAL DEPLOYMENT

