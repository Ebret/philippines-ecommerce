# 🔧 PM2 PERSISTENT ERROR FIX

**Status:** PM2 still showing "errored" - Advanced troubleshooting

**Latest Commit:** 632b4e8

---

## 🔍 DIAGNOSIS

PM2 is crashing immediately after startup. This suggests:
1. Application startup error
2. Missing environment variables
3. Database connection issue
4. Port conflict

---

## 🚀 ADVANCED FIX - EXECUTE ON VPS

### Step 1: Pull Latest Fix
```bash
cd /var/www/html/ecom/app
git pull origin feature/relivator-ui-integration
```

### Step 2: Kill Everything
```bash
pm2 kill
sleep 3
pkill -9 node
sleep 2
```

### Step 3: Check Error Logs Directly
```bash
tail -100 /root/.pm2/logs/philippines-ecommerce-error.log
tail -100 /root/.pm2/logs/philippines-ecommerce-out.log
```

**Copy the error output and share it!**

### Step 4: Test npm start Manually
```bash
cd /var/www/html/ecom/app
npm start
```

**This will show the actual error. Press Ctrl+C after 10 seconds.**

### Step 5: Check Port 3000
```bash
lsof -i :3000
netstat -tlnp | grep 3000
```

### Step 6: Verify .env.production
```bash
cat .env.production
```

**Ensure all required variables are present:**
- DATABASE_URL
- NEXTAUTH_SECRET
- NEXTAUTH_URL
- NODE_ENV=production

### Step 7: Clean Rebuild
```bash
rm -rf .next
npm run build
```

### Step 8: Start PM2 with Verbose Logging
```bash
pm2 start ecosystem.config.js --no-daemon
```

**This will show real-time output. Press Ctrl+C after 30 seconds.**

---

## 🎯 NEXT STEPS

1. Execute Steps 1-3 above
2. **Share the error output** from the log files
3. I will provide specific fix based on the error

---

**Status:** Awaiting error logs for diagnosis

