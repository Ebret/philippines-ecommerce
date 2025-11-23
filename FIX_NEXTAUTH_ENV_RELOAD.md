# 🔧 FIX NEXTAUTH ENV RELOAD

**Issue:** NEXTAUTH_SECRET added to .env.production but PM2 not reloading it  
**Solution:** Kill PM2 process and restart with env reload

---

## 🚀 QUICK FIX (Run on VPS)

```bash
cd /var/www/html/ecom/app

# Step 1: Stop PM2 process
pm2 stop philippines-ecommerce

# Step 2: Delete PM2 process
pm2 delete philippines-ecommerce

# Step 3: Verify .env.production has NEXTAUTH_SECRET
cat .env.production | grep NEXTAUTH_SECRET

# Step 4: Start with ecosystem.config.js
pm2 start ecosystem.config.js

# Step 5: Wait for startup
sleep 10

# Step 6: Check status
pm2 status

# Step 7: Verify deployment
curl -I https://extremelifeherbal.com/
curl -I https://extremelifeherbal.com/account/profile
curl -I https://extremelifeherbal.com/vendor/dashboard
curl -I https://extremelifeherbal.com/admin
```

---

## 📝 ALTERNATIVE: Direct Environment Variable

If the above doesn't work, set env var directly:

```bash
cd /var/www/html/ecom/app

# Stop current process
pm2 stop philippines-ecommerce
pm2 delete philippines-ecommerce

# Export env var and start
export NEXTAUTH_SECRET=$(cat .env.production | grep NEXTAUTH_SECRET | cut -d= -f2)
export NEXTAUTH_URL=https://extremelifeherbal.com
pm2 start ecosystem.config.js

# Verify
pm2 status
curl -I https://extremelifeherbal.com/
```

---

## ✅ VERIFICATION

After fix:
```bash
# Check PM2 status
pm2 status

# Check logs (should have no NO_SECRET errors)
pm2 logs philippines-ecommerce --lines 30

# Test all pages
curl -I https://extremelifeherbal.com/
curl -I https://extremelifeherbal.com/account/profile
curl -I https://extremelifeherbal.com/vendor/dashboard
curl -I https://extremelifeherbal.com/admin
```

---

## 🎯 EXPECTED RESULTS

- ✅ No more `[next-auth][error][NO_SECRET]` errors
- ✅ Homepage returns HTTP 200
- ✅ Account pages return HTTP 307 (redirect to login) - CORRECT
- ✅ PM2 status shows "online"

---

**Run the quick fix above!**

