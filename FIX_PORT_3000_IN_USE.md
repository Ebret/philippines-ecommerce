# 🔧 FIX PORT 3000 IN USE ERROR

**Issue:** `Error: listen EADDRINUSE: address already in use :::3000`  
**Cause:** Old Node.js process still running on port 3000  
**Solution:** Kill the process and restart PM2

---

## 🚀 QUICK FIX (Run on VPS)

```bash
cd /var/www/html/ecom/app

# Step 1: Kill all Node processes
pkill -f "node"
pkill -f "next"

# Step 2: Wait a moment
sleep 3

# Step 3: Verify port 3000 is free
lsof -i :3000

# Step 4: Kill PM2 daemon
pm2 kill

# Step 5: Wait
sleep 2

# Step 6: Start fresh
pm2 start ecosystem.config.js

# Step 7: Wait for startup
sleep 10

# Step 8: Check status
pm2 status

# Step 9: Verify deployment
curl -I https://extremelifeherbal.com/
curl -I https://extremelifeherbal.com/account/profile
curl -I https://extremelifeherbal.com/vendor/dashboard
curl -I https://extremelifeherbal.com/admin

# Step 10: Check logs
pm2 logs philippines-ecommerce --lines 30
```

---

## 📝 ALTERNATIVE: Force Kill Port 3000

If the above doesn't work:

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process (replace PID with actual process ID)
kill -9 <PID>

# Or use fuser
fuser -k 3000/tcp

# Then restart PM2
pm2 kill
sleep 2
pm2 start ecosystem.config.js
```

---

## ✅ VERIFICATION

After fix:
```bash
# Check port 3000 is free
lsof -i :3000

# Check PM2 status
pm2 status

# Test homepage
curl -I https://extremelifeherbal.com/
```

---

**Run the quick fix above to resolve the port conflict!**

