# 🔧 Fix Port 3000 Already in Use Error

## ❌ Problem

**Error**: `Error: listen EADDRINUSE: address already in use :::3000`

**Cause**: Old Node process still running on port 3000

**Good News**: The HTTP 307 redirect shows the page IS accessible! Just need to fix the port conflict.

---

## ✅ Quick Fix

Execute these commands on VPS:

```bash
# Kill all node processes
pkill -9 node

# Kill PM2
pm2 kill

# Wait a moment
sleep 3

# Find what's using port 3000
lsof -i :3000

# If still in use, kill it
kill -9 <PID>

# Start fresh
pm2 start ecosystem.config.js
sleep 5

# Verify
pm2 status
```

---

## 🚀 Complete Fix Script

```bash
# Kill everything
pkill -9 node
pm2 kill
sleep 3

# Remove PM2 cache
rm -rf /root/.pm2

# Wait
sleep 2

# Start PM2 fresh
pm2 start ecosystem.config.js
sleep 5

# Verify
pm2 status
pm2 logs --lines 50
```

---

## ✅ Verification

```bash
# Check port 3000
lsof -i :3000

# Check HTTP status
curl -I https://extremelifeherbal.com/admin/products

# Check PM2
pm2 status
```

**Expected**: HTTP 200 or 307 (redirect to login)

---

## 📱 Browser Test

1. Open: https://extremelifeherbal.com/admin/products
2. Should redirect to login
3. Login: admin@test.com / Admin123!
4. Should see product grid

---

## 🎯 Status

**HTTP 307**: ✅ Page is accessible!  
**Port Issue**: ⚠️ Need to kill old process  
**Solution**: Execute fix commands above

---

**Execute the fix commands now!**

