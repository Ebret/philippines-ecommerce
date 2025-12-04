# 🚀 Admin Products Feature - VPS Deployment Steps

## ✅ DEPLOYMENT EXECUTION GUIDE

You are connected to VPS 109.205.181.119 via SSH. Execute these commands in order:

---

## Step 1: Navigate to App Directory
```bash
cd /var/www/html/ecom/app
```

---

## Step 2: Pull Latest Changes from feature/relivator-ui-integration
```bash
git fetch origin
git checkout feature/relivator-ui-integration
git pull origin feature/relivator-ui-integration
```

**Expected Output**: Latest commits pulled from branch

---

## Step 3: Install Dependencies
```bash
npm install
```

**Expected Output**: All packages installed successfully

---

## Step 4: Build Application
```bash
npm run build
```

**Expected Output**: Build successful with 0 errors

---

## Step 5: Stop PM2 Processes
```bash
pm2 kill
sleep 3
```

**Expected Output**: PM2 processes stopped

---

## Step 6: Clean Up Old Node Processes
```bash
pkill -9 node || true
sleep 2
```

**Expected Output**: Old processes cleaned

---

## Step 7: Remove .next Cache
```bash
rm -rf .next
```

**Expected Output**: Cache directory removed

---

## Step 8: Start PM2 Processes
```bash
pm2 start ecosystem.config.js
sleep 5
```

**Expected Output**: PM2 processes started

---

## Step 9: Verify PM2 Status
```bash
pm2 status
```

**Expected Output**: Both processes showing "online"

---

## Step 10: View Recent Logs
```bash
pm2 logs --lines 50
```

**Expected Output**: No error messages

---

## ✅ Verification Commands

### Check HTTP Status
```bash
curl -I https://extremelifeherbal.com/admin/products
```
**Expected**: HTTP 200 or 307

### Check Page Content
```bash
curl -s https://extremelifeherbal.com/admin/products | head -20
```

### Check PM2 Processes
```bash
pm2 list
```

---

## 📱 Browser Testing

After deployment:
1. Open: https://extremelifeherbal.com/admin/products
2. Login: admin@test.com / Admin123!
3. Verify product grid displays
4. Test search, edit, delete

---

## 🔍 Troubleshooting

### If Build Fails
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm run build
```

### If PM2 Won't Start
```bash
pkill -9 node
pm2 kill
pm2 start ecosystem.config.js
```

### View Full Logs
```bash
pm2 logs --lines 200
```

---

**Execute these steps in order. Report any errors!**

