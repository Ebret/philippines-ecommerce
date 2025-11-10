# Philippines E-Commerce Platform - Emergency Deployment Recovery

**Date:** November 10, 2025  
**Status:** 🚨 EMERGENCY RECOVERY PROCEDURE  
**Version:** 1.0

---

## 🚨 **CURRENT SITUATION**

```
❌ Next.js build still running (1GB memory)
❌ Zombie process exists
❌ PM2 started but app not running
❌ Log file not created
❌ Port 3000 not responding
```

---

## 🔧 **STEP 1: COMPLETE CLEANUP**

Run these commands ONE AT A TIME and wait for each to complete:

```bash
# Kill all node processes
pkill -9 node
```

Wait 2 seconds, then:

```bash
# Verify all killed
ps aux | grep node | grep -v grep
```

Should return NOTHING.

---

## 🔧 **STEP 2: STOP PM2**

```bash
pm2 kill
```

Wait for it to complete.

---

## 🔧 **STEP 3: VERIFY CLEAN STATE**

```bash
# Check no node processes
ps aux | grep node | grep -v grep

# Check no PM2 processes
ps aux | grep pm2 | grep -v grep

# Check port 3000 is free
lsof -i :3000
```

All should return NOTHING.

---

## 🔧 **STEP 4: REMOVE OLD BUILD LOCK**

```bash
rm -f /var/www/html/ecom/app/.next/lock
```

---

## 🔧 **STEP 5: CLEAN BUILD ARTIFACTS**

```bash
rm -rf /var/www/html/ecom/app/.next
```

---

## 🔧 **STEP 6: NAVIGATE TO APP**

```bash
cd /var/www/html/ecom/app
pwd
```

Should show: `/var/www/html/ecom/app`

---

## 🔧 **STEP 7: VERIFY ENVIRONMENT**

```bash
# Check Node.js
node --version

# Check npm
npm --version

# Check package.json exists
ls -la package.json
```

---

## 🔧 **STEP 8: FRESH BUILD**

```bash
npm run build
```

Wait for it to complete. You should see:
```
✓ Compiled successfully
```

---

## 🔧 **STEP 9: START WITH PM2**

```bash
pm2 start npm --name "philippines-ecommerce" -- start
```

---

## 🔧 **STEP 10: VERIFY RUNNING**

```bash
pm2 status
```

Should show:
```
│ 0  │ philippines-ecommerce │ fork     │ 0    │ online    │ 0%       │ 33.6mb   │
```

---

## 🔧 **STEP 11: CHECK PORT**

```bash
lsof -i :3000
```

Should show node listening on port 3000.

---

## 🔧 **STEP 12: CHECK LOGS**

```bash
pm2 logs philippines-ecommerce
```

Should show:
```
> next start
ready - started server on 0.0.0.0:3000
```

---

## 🔧 **STEP 13: TEST LOCALLY**

```bash
curl http://localhost:3000
```

Should return HTML content.

---

## 🔧 **STEP 14: TEST EXTERNALLY**

```bash
curl http://109.205.181.119:3000
```

Should return HTML content.

---

## 📋 **COMPLETE RECOVERY SCRIPT**

If you want to run everything at once:

```bash
# 1. Kill everything
pkill -9 node
pm2 kill
sleep 2

# 2. Clean up
rm -f /var/www/html/ecom/app/.next/lock
rm -rf /var/www/html/ecom/app/.next

# 3. Navigate
cd /var/www/html/ecom/app

# 4. Build
npm run build

# 5. Start with PM2
pm2 start npm --name "philippines-ecommerce" -- start

# 6. Wait
sleep 5

# 7. Verify
pm2 status
lsof -i :3000
pm2 logs philippines-ecommerce
```

---

## ✅ **SUCCESS INDICATORS**

You'll see:
```
✓ No node processes before cleanup
✓ Build completes with "✓ Compiled successfully"
✓ PM2 shows "online" status
✓ Port 3000 listening
✓ curl returns HTML content
```

---

## 📞 **IF STILL HAVING ISSUES**

### **If build fails:**
```bash
npm install
npm run build
```

### **If PM2 won't start:**
```bash
pm2 kill
pm2 start npm --name "philippines-ecommerce" -- start
```

### **If port 3000 still in use:**
```bash
lsof -i :3000
kill -9 <PID>
pm2 start npm --name "philippines-ecommerce" -- start
```

### **Check real-time logs:**
```bash
pm2 logs philippines-ecommerce --lines 100
```

---

## 🎯 **NEXT STEPS**

1. Run Step 1-7 first to verify clean state
2. Run Step 8 to build
3. Run Step 9-14 to verify running
4. If all successful, application is live!

---

**Last Updated:** November 10, 2025

