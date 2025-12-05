# 🔧 Force Kill Port 3000 - Complete Solution

## ❌ Problem

Port 3000 is still in use by an old process. Need to force kill it completely.

---

## ✅ Complete Fix

Execute these commands on VPS:

```bash
# Find what's using port 3000
lsof -i :3000

# Kill all node processes
pkill -9 node

# Kill all npm processes
pkill -9 npm

# Kill PM2
pm2 kill

# Wait
sleep 5

# Force kill anything on port 3000
fuser -k 3000/tcp

# Wait
sleep 3

# Check if port is free
lsof -i :3000

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

