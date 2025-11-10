# Philippines E-Commerce Platform - Quick Deployment Fix

**Date:** November 10, 2025
**Status:** 🔧 FIXING DEPLOYMENT ISSUES
**Version:** 1.0

---

## ⚡ **FASTEST FIX (Copy & Paste)**

```bash
cd /var/www/html/ecom/app && \
mkdir -p /var/www/html/ecom/scripts/deployment-logs && \
mkdir -p /var/www/html/ecom/app/logs && \
chmod 755 /var/www/html/ecom/scripts/deployment-logs && \
chmod 755 /var/www/html/ecom/app/logs && \
export NODE_ENV=production && \
export DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce" && \
npm run build && \
npm start > /var/www/html/ecom/app/logs/app.log 2>&1 &
```

**Time:** ~5-10 minutes

---

## 📋 **STEP-BY-STEP FIX**

### **Step 1: Create Missing Directories**

```bash
mkdir -p /var/www/html/ecom/scripts/deployment-logs
mkdir -p /var/www/html/ecom/app/logs
chmod 755 /var/www/html/ecom/scripts/deployment-logs
chmod 755 /var/www/html/ecom/app/logs
```

---

### **Step 2: Navigate to App Directory**

```bash
cd /var/www/html/ecom/app
pwd
```

---

### **Step 3: Set Environment Variables**

```bash
export NODE_ENV=production
export DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce"
```

---

### **Step 4: Build Application**

```bash
npm run build
```

**Expected Output:**
```
> next build
...
✓ Compiled successfully
```

---

### **Step 5: Start Application**

```bash
npm start > /var/www/html/ecom/app/logs/app.log 2>&1 &
```

---

### **Step 6: Wait for Application to Start**

```bash
sleep 5
```

---

### **Step 7: Verify Application is Running**

```bash
ps aux | grep node
```

**Expected Output:**
```
root      12345  0.0  2.5 1234567 89012 ?  Sl   14:45   0:05 node /var/www/html/ecom/app/.next/standalone/server.js
```

---

### **Step 8: Check Application Logs**

```bash
tail -f /var/www/html/ecom/app/logs/app.log
```

**Expected Output:**
```
> next start
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

---

### **Step 9: Test Application**

```bash
curl http://localhost:3000
```

---

### **Step 10: Check Port 3000**

```bash
sudo netstat -tlnp | grep 3000
```

**Expected Output:**
```
tcp        0      0 0.0.0.0:3000            0.0.0.0:*               LISTEN      12345/node
```

---

## 🎯 **WHAT'S HAPPENING**

1. ✅ Creating missing log directories
2. ✅ Setting production environment
3. ✅ Building Next.js application
4. ✅ Starting Node.js server
5. ✅ Application running on port 3000

---

## ✅ **SUCCESS INDICATORS**

You'll see:
```
✓ Directories created
✓ Build complete
✓ Application started
✓ Application is running
✓ Port 3000 listening
```

---

## 📞 **TROUBLESHOOTING**

### **If build fails:**
```bash
npm install
npm run build
```

### **If application won't start:**
```bash
npm start
```

Check the error output.

### **If port 3000 is in use:**
```bash
sudo lsof -i :3000
sudo kill -9 <PID>
```

### **Check logs:**
```bash
tail -f /var/www/html/ecom/app/logs/app.log
```

---

## 🚀 **NEXT STEP**

Run the "FASTEST FIX" command above to deploy the application.

---

**Last Updated:** November 10, 2025


