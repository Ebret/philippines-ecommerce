# 🔍 Admin Products 404 Error - Troubleshooting Guide

## ❌ Issue: 404 Error on https://extremelifeherbal.com/admin/products

**Status**: Page not found  
**Cause**: Deployment not completed or code not deployed to production

---

## 🔧 TROUBLESHOOTING STEPS

### Step 1: Check Current Branch on VPS
```bash
cd /var/www/html/ecom/app
git branch
git status
```

**Expected**: Should show `feature/relivator-ui-integration` as current branch

### Step 2: Check if Files Exist on VPS
```bash
ls -la src/app/admin/products/
```

**Expected**: Should show page.tsx, products-client.tsx, etc.

### Step 3: Check if Build Exists
```bash
ls -la .next/server/app/admin/
```

**Expected**: Should show products directory

### Step 4: Check PM2 Status
```bash
pm2 status
pm2 logs --lines 100
```

**Expected**: Both processes online, no errors

### Step 5: Check if Port 3000 is Running
```bash
lsof -i :3000
```

**Expected**: Node process listening on port 3000

---

## 🚀 COMPLETE DEPLOYMENT PROCEDURE

If files don't exist or build is missing, execute full deployment:

```bash
cd /var/www/html/ecom/app

# 1. Pull latest changes
git fetch origin
git checkout feature/relivator-ui-integration
git pull origin feature/relivator-ui-integration

# 2. Install dependencies
npm install

# 3. Build
npm run build

# 4. Stop PM2
pm2 kill
sleep 3

# 5. Clean processes
pkill -9 node || true
sleep 2

# 6. Remove cache
rm -rf .next

# 7. Start PM2
pm2 start ecosystem.config.js
sleep 5

# 8. Verify
pm2 status
pm2 logs --lines 50
```

---

## ✅ VERIFICATION AFTER DEPLOYMENT

### Check HTTP Status
```bash
curl -I https://extremelifeherbal.com/admin/products
```

### Check Page Content
```bash
curl -s https://extremelifeherbal.com/admin/products | grep -i "admin\|product" | head -5
```

### Check Build Output
```bash
npm run build 2>&1 | grep -i "admin/products"
```

---

## 🔍 COMMON ISSUES

### Issue 1: Branch Not Checked Out
**Solution**:
```bash
git checkout feature/relivator-ui-integration
git pull origin feature/relivator-ui-integration
```

### Issue 2: Build Cache Issue
**Solution**:
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Issue 3: PM2 Not Running
**Solution**:
```bash
pm2 kill
pkill -9 node || true
pm2 start ecosystem.config.js
```

### Issue 4: Port Already in Use
**Solution**:
```bash
lsof -i :3000
kill -9 <PID>
pm2 start ecosystem.config.js
```

---

## 📊 VERIFICATION CHECKLIST

- [ ] Branch is feature/relivator-ui-integration
- [ ] Files exist in src/app/admin/products/
- [ ] Build completed successfully
- [ ] .next directory exists
- [ ] PM2 processes online
- [ ] Port 3000 listening
- [ ] HTTP 200 status
- [ ] Page loads in browser

---

**Execute troubleshooting steps and report results!**

