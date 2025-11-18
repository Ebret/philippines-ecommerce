# Phase 23 Subtask 3: CORRECTED DEPLOYMENT GUIDE

## ⚠️ IMPORTANT: CORRECT APPLICATION DIRECTORY

**Correct Path**: `/var/www/html/ecom/app`  
**Incorrect Path**: `/var/www/extremelifeherbal.com` (does not exist)

---

## 🚀 DEPLOYMENT COMMANDS (Execute on VPS)

### Step 1: Navigate to Correct App Directory
```bash
cd /var/www/html/ecom/app
```

### Step 2: Pull Latest Changes
```bash
git pull origin master
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
pm2 restart all
pm2 status
```

---

## 📋 QUICK DEPLOYMENT (Copy & Paste)

```bash
cd /var/www/html/ecom/app && \
git pull origin master && \
npm install && \
npm run build && \
pm2 restart all && \
pm2 status
```

---

## ✅ VERIFICATION COMMANDS

### Check Git Commit
```bash
git log --oneline -1
```
**Expected**: `e119449` or later

### Check Website
```bash
curl -I https://extremelifeherbal.com
```
**Expected**: `HTTP/2 200`

### Check Rate Limit Headers
```bash
curl -I https://extremelifeherbal.com/api/products
```
**Expected**: x-ratelimit-limit, x-ratelimit-remaining, x-ratelimit-reset

### Test Rate Limit Enforcement
```bash
for i in {1..101}; do curl -s https://extremelifeherbal.com/api/products > /dev/null; done; curl -I https://extremelifeherbal.com/api/products
```
**Expected**: `HTTP/2 429` (Too Many Requests)

### Check PM2 Status
```bash
pm2 status
```
**Expected**: Both processes "online"

### Check PM2 Logs
```bash
pm2 logs --lines 50
```
**Expected**: No errors

---

## 🔄 ROLLBACK (If Needed)

```bash
cd /var/www/html/ecom/app && \
git revert HEAD && \
npm run build && \
pm2 restart all
```

---

## 📝 NOTES

- Application is running from `/var/www/html/ecom/app`
- PM2 process name: `philippines-ecommerce`
- Website: https://extremelifeherbal.com
- Latest commit: `e119449`

