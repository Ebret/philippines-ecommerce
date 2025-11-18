# Phase 23 Subtask 3: VPS Deployment Commands

## 🚀 EXECUTE ON VPS (109.205.181.119)

### Step 1: Navigate to App Directory
```bash
cd /var/www/extremelifeherbal.com
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

## ✅ VERIFICATION COMMANDS

### Check Git Commit
```bash
git log --oneline -1
```
**Expected**: `f3512b4` or later

### Check Website
```bash
curl -I https://extremelifeherbal.com
```
**Expected**: `HTTP/2 200`

### Check Rate Limit Headers
```bash
curl -I https://extremelifeherbal.com/api/products
```
**Expected**:
```
x-ratelimit-limit: 100
x-ratelimit-remaining: 99
x-ratelimit-reset: <timestamp>
```

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
**Expected**: No ERROR or FATAL messages

---

## 📋 QUICK DEPLOYMENT (Copy & Paste)

```bash
cd /var/www/extremelifeherbal.com && \
git pull origin master && \
npm install && \
npm run build && \
pm2 restart all && \
pm2 status
```

---

## 🔄 ROLLBACK (If Needed)

```bash
cd /var/www/extremelifeherbal.com && \
git revert HEAD && \
npm run build && \
pm2 restart all
```

