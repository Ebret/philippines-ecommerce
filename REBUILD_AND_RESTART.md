# 🔧 Rebuild and Restart - Final Solution

## ❌ Problem

The `.next` build directory was deleted but not rebuilt. Need to rebuild the application.

---

## ✅ Complete Fix

Execute these commands on VPS:

```bash
# Kill PM2
pm2 kill

# Wait
sleep 3

# Kill all node processes
pkill -9 node

# Wait
sleep 2

# Navigate to app directory
cd /var/www/html/ecom/app

# Rebuild the application
npm run build

# Wait for build to complete (2-3 minutes)
sleep 30

# Start PM2
pm2 start ecosystem.config.js

# Wait for startup
sleep 10

# Check status
pm2 status

# View logs
pm2 logs --lines 100
```

---

## ✅ Verification

```bash
# Check HTTP status
curl -I https://extremelifeherbal.com/admin/products

# Check PM2 status
pm2 status

# View logs
pm2 logs --lines 50
```

**Expected**: 
- HTTP 200 or 307
- PM2 status: "online"
- No errors in logs

---

## 📱 Browser Test

1. Open: https://extremelifeherbal.com/admin/products
2. Login: admin@test.com / Admin123!
3. Verify product grid displays

---

**Execute the commands above!**

