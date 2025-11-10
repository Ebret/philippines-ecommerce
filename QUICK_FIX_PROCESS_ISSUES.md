# Philippines E-Commerce Platform - Quick Fix Process Issues

**Date:** November 10, 2025  
**Status:** 🔧 FIXING PROCESS AND STARTUP ISSUES  
**Version:** 1.0

---

## ⚡ **FASTEST FIX (Copy & Paste)**

```bash
# Kill all node processes
pkill -9 node
sleep 2

# Remove old logs
rm -f /var/www/html/ecom/app/logs/app.log

# Navigate and set environment
cd /var/www/html/ecom/app && \
export NODE_ENV=production && \
export DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce" && \
nohup npm start > /var/www/html/ecom/app/logs/app.log 2>&1 &

# Wait for startup
sleep 5

# Verify running
echo "=== Checking if application is running ===" && \
ps aux | grep node | grep -v grep && \
echo "" && \
echo "=== Checking port 3000 ===" && \
(lsof -i :3000 || ss -tlnp | grep 3000) && \
echo "" && \
echo "=== Checking logs ===" && \
tail -20 /var/www/html/ecom/app/logs/app.log && \
echo "" && \
echo "=== Testing locally ===" && \
curl -s http://localhost:3000 | head -20
```

**Time:** ~2-3 minutes

---

## 📋 **STEP-BY-STEP FIX**

### **Step 1: Kill All Node Processes**

```bash
pkill -9 node
sleep 2
```

**Verify:**
```bash
ps aux | grep node | grep -v grep
```

Should return nothing.

---

### **Step 2: Remove Old Logs**

```bash
rm -f /var/www/html/ecom/app/logs/app.log
```

---

### **Step 3: Navigate to App Directory**

```bash
cd /var/www/html/ecom/app
pwd
```

---

### **Step 4: Set Environment Variables**

```bash
export NODE_ENV=production
export DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce"
```

---

### **Step 5: Start Application with nohup**

```bash
nohup npm start > /var/www/html/ecom/app/logs/app.log 2>&1 &
```

**Why nohup?**
- Prevents process from being stopped
- Continues running even if terminal closes
- Logs output to file

---

### **Step 6: Wait for Startup**

```bash
sleep 5
```

---

### **Step 7: Verify Application is Running**

```bash
ps aux | grep node | grep -v grep
```

**Expected Output:**
```
root      12345  0.0  2.5 1234567 89012 ?  Sl   14:45   0:05 node /var/www/html/ecom/app/.next/standalone/server.js
```

---

### **Step 8: Check Port 3000 (Alternative to netstat)**

```bash
# Try lsof first
lsof -i :3000

# If lsof not available, try ss
ss -tlnp | grep 3000

# If neither works, try curl
curl -v http://localhost:3000
```

**Expected Output:**
```
COMMAND   PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
node    12345 root   20u  IPv6  12345      0t0  TCP *:3000 (LISTEN)
```

---

### **Step 9: Check Application Logs**

```bash
tail -20 /var/www/html/ecom/app/logs/app.log
```

**Expected Output:**
```
> next start
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

---

### **Step 10: Test Application Locally**

```bash
curl http://localhost:3000
```

Should return HTML content.

---

### **Step 11: Test Application Externally**

```bash
curl http://109.205.181.119:3000
```

Should return HTML content.

---

## 🎯 **WHAT'S HAPPENING**

1. ✅ Killing all node processes (cleanup)
2. ✅ Removing old logs (fresh start)
3. ✅ Setting production environment
4. ✅ Starting with nohup (prevents stopping)
5. ✅ Logging to file (debugging)
6. ✅ Running in background (&)

---

## ✅ **SUCCESS INDICATORS**

You'll see:
```
✓ No node processes before start
✓ Node process running after start
✓ Port 3000 listening
✓ Logs showing "ready - started server"
✓ curl returns HTML content
✓ External access works
```

---

## 📞 **TROUBLESHOOTING**

### **If application still won't start:**

Run in foreground to see errors:
```bash
cd /var/www/html/ecom/app && \
export NODE_ENV=production && \
export DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce" && \
npm start
```

---

### **If port 3000 shows "Address already in use":**

```bash
# Find process using port 3000
lsof -i :3000

# Kill it
kill -9 <PID>
```

---

### **If logs show errors:**

```bash
tail -f /var/www/html/ecom/app/logs/app.log
```

---

### **If curl returns connection refused:**

```bash
# Check if port is listening
lsof -i :3000

# Check if process is running
ps aux | grep node

# Check logs
tail -f /var/www/html/ecom/app/logs/app.log
```

---

## 🚀 **NEXT STEP**

Run the "FASTEST FIX" command above to start the application.

---

**Last Updated:** November 10, 2025

