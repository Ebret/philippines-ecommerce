# Philippines E-Commerce Platform - Simple Recovery Steps

**Date:** November 10, 2025  
**Status:** 🔧 SIMPLE STEP-BY-STEP RECOVERY  
**Version:** 1.0

---

## ⚠️ **CURRENT PROBLEM**

- Next.js build still running (1GB memory)
- Zombie process exists
- PM2 started but app not responding
- Port 3000 not listening

---

## ✅ **SOLUTION: 5 SIMPLE STEPS**

### **STEP 1: Kill Everything**

Copy and paste this EXACTLY:

```bash
pkill -9 node
```

Wait 2 seconds.

---

### **STEP 2: Verify Clean**

```bash
ps aux | grep node | grep -v grep
```

Should show NOTHING. If it shows processes, run Step 1 again.

---

### **STEP 3: Stop PM2**

```bash
pm2 kill
```

---

### **STEP 4: Clean Build**

```bash
cd /var/www/html/ecom/app && \
rm -f .next/lock && \
rm -rf .next && \
npm run build
```

Wait for build to complete. Should see:
```
✓ Compiled successfully
```

---

### **STEP 5: Start Application**

```bash
pm2 start npm --name "philippines-ecommerce" -- start && \
sleep 5 && \
pm2 status
```

Should show:
```
│ 0  │ philippines-ecommerce │ fork     │ 0    │ online    │ 0%       │ 33.6mb   │
```

---

## ✅ **VERIFY IT WORKS**

```bash
# Check port
lsof -i :3000

# Check logs
pm2 logs philippines-ecommerce

# Test locally
curl http://localhost:3000

# Test externally
curl http://109.205.181.119:3000
```

---

## 🎯 **THAT'S IT!**

If all steps complete successfully, your application is running!

---

**Last Updated:** November 10, 2025

