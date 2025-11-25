# 🚀 MANUAL DEPLOYMENT INSTRUCTIONS

**Status:** ✅ READY FOR MANUAL EXECUTION  
**Latest Commit:** b4fa9d4  
**Date:** 2025-11-25

---

## 📋 COPY & PASTE COMMANDS

Execute these commands one by one on the VPS terminal:

### Command 1: Navigate to App Directory
```bash
cd /var/www/html/ecom/app
```

### Command 2: Pull Latest Code
```bash
git pull origin feature/relivator-ui-integration
```

### Command 3: Run Database Fix Script
```bash
npx ts-node FIX_CRITICAL_ISSUES.ts
```

**Wait for output showing:**
```
✅ ALL CRITICAL ISSUES FIXED!
```

### Command 4: Stop Existing Processes
```bash
pm2 kill
sleep 3
pkill -9 node
sleep 2
```

### Command 5: Clean Build
```bash
rm -rf .next
npm run build
```

**Wait for build to complete (5-10 minutes)**

### Command 6: Start PM2
```bash
pm2 start ecosystem.config.js
sleep 10
pm2 status
```

### Command 7: Verify Deployment
```bash
curl -s https://extremelifeherbal.com | head -10
```

---

## 🧪 TESTING URLS

After deployment, test in browser:

1. **Admin:** https://extremelifeherbal.com/admin
   - Login: admin@test.com / Admin123!

2. **Vendor:** https://extremelifeherbal.com/vendor/dashboard
   - Login: seller@test.com / Seller123!

3. **Live:** https://extremelifeherbal.com/live

4. **Vendor Live:** https://extremelifeherbal.com/vendor/live
   - Login: seller@test.com / Seller123!

---

## ⚠️ TROUBLESHOOTING

If Step 3 fails:
```bash
npm install
npx ts-node FIX_CRITICAL_ISSUES.ts
```

If Step 5 fails:
```bash
npm install
npm run build
```

If PM2 won't start:
```bash
pm2 kill
pm2 start ecosystem.config.js
pm2 logs
```

---

**Execute these commands on the VPS!**

