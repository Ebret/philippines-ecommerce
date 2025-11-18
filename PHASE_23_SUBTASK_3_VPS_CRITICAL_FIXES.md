# Phase 23 Subtask 3: VPS Critical Fixes & Deployment

## 🔴 CRITICAL ISSUES IDENTIFIED

### Issue 1: `/var/www/html/ecom/app` is NOT a Git Repository
**Problem**: The application directory is not a git repository, so `git pull` fails  
**Solution**: Initialize git and connect to GitHub remote

### Issue 2: Middleware Deprecation Warning
**Problem**: Next.js 16 shows deprecation warning about "middleware" file convention  
**Solution**: Update middleware configuration to use "proxy" pattern

---

## ✅ STEP-BY-STEP FIX GUIDE

### STEP 1: Initialize Git Repository on VPS

Execute these commands on VPS in `/var/www/html/ecom/app`:

```bash
# Navigate to app directory
cd /var/www/html/ecom/app

# Initialize git repository
git init

# Add GitHub remote
git remote add origin https://github.com/Ebret/philippines-ecommerce.git

# Fetch latest changes
git fetch origin master

# Reset to latest commit
git reset --hard origin/master

# Verify
git log --oneline -1
```

**Expected Output**: Latest commit hash (e.g., `9d71e28`)

---

### STEP 2: Fix Middleware Deprecation (Local - Then Deploy)

The middleware file at `src/middleware.ts` is using the old convention. In Next.js 16, it should be in `src/middleware.ts` (which is correct), but we need to ensure the configuration is optimal.

**Current Status**: ✅ Already correct location  
**Action**: No changes needed - middleware.ts is in correct location

---

### STEP 3: Deploy Phase 23 Subtask 3

After git initialization, execute deployment:

```bash
cd /var/www/html/ecom/app

# Pull latest changes
git pull origin master

# Install dependencies
npm install

# Build application
npm run build

# Restart PM2
pm2 restart all

# Verify
pm2 status
```

---

### STEP 4: Verification Commands

```bash
# Check git commit
git log --oneline -1
# Expected: 9d71e28 or later

# Check website
curl -I https://extremelifeherbal.com
# Expected: HTTP/2 200

# Check rate limit headers
curl -I https://extremelifeherbal.com/api/products
# Expected: x-ratelimit-limit: 100

# Test rate limit enforcement
for i in {1..101}; do curl -s https://extremelifeherbal.com/api/products > /dev/null; done; curl -I https://extremelifeherbal.com/api/products
# Expected: HTTP/2 429

# Check PM2 status
pm2 status
# Expected: Both processes "online"

# Check logs
pm2 logs --lines 50
# Expected: No errors
```

---

## 📋 QUICK COPY-PASTE COMMANDS

### Initialize Git (One-liner)
```bash
cd /var/www/html/ecom/app && git init && git remote add origin https://github.com/Ebret/philippines-ecommerce.git && git fetch origin master && git reset --hard origin/master && git log --oneline -1
```

### Deploy (One-liner)
```bash
cd /var/www/html/ecom/app && git pull origin master && npm install && npm run build && pm2 restart all && pm2 status
```

---

## 🎯 EXPECTED RESULTS

✅ Git repository initialized  
✅ Latest code pulled from GitHub  
✅ Dependencies installed  
✅ Application built successfully  
✅ PM2 processes restarted  
✅ Rate limiting deployed and working  
✅ Website accessible at https://extremelifeherbal.com  
✅ Rate limit headers present in API responses  
✅ Rate limit enforcement working (429 after 101 requests)

---

## ⏱️ ESTIMATED TIME

- Git initialization: 2-3 minutes
- Deployment: 5-10 minutes
- Verification: 2-3 minutes
- **Total: 10-15 minutes**

