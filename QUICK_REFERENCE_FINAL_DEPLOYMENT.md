# Philippines E-Commerce Platform - Quick Reference Final Deployment

**Date:** November 10, 2025  
**Status:** 🚀 READY TO DEPLOY  
**Version:** 1.0

---

## ⚡ **OPTION 1: QUICK START (Testing)**

```bash
pkill -9 node && sleep 2 && \
rm -f /var/www/html/ecom/app/logs/app.log && \
cd /var/www/html/ecom/app && \
export NODE_ENV=production && \
export DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce" && \
nohup npm start > /var/www/html/ecom/app/logs/app.log 2>&1 & && \
sleep 5 && \
echo "=== Process Status ===" && \
ps aux | grep node | grep -v grep && \
echo "" && \
echo "=== Port Status ===" && \
(lsof -i :3000 || ss -tlnp | grep 3000) && \
echo "" && \
echo "=== Logs ===" && \
tail -20 /var/www/html/ecom/app/logs/app.log && \
echo "" && \
echo "=== Local Test ===" && \
curl -s http://localhost:3000 | head -10
```

**Time:** 2-3 minutes

---

## ⚡ **OPTION 2: PRODUCTION SETUP (PM2)**

```bash
npm install -g pm2 && \
cd /var/www/html/ecom/app && \
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: "philippines-ecommerce",
    script: "npm",
    args: "start",
    env: {
      NODE_ENV: "production",
      DATABASE_URL: "postgresql://user:password@localhost:5432/philippines_ecommerce"
    },
    error_file: "/var/www/html/ecom/app/logs/pm2-error.log",
    out_file: "/var/www/html/ecom/app/logs/pm2-out.log",
    autorestart: true,
    max_memory_restart: "1G",
  }]
};
EOF
pm2 start ecosystem.config.js && \
pm2 save && \
pm2 startup && \
pm2 status && \
pm2 logs philippines-ecommerce
```

**Time:** 3-5 minutes

---

## 📋 **VERIFICATION COMMANDS**

```bash
# Check if running
ps aux | grep node | grep -v grep

# Check port
lsof -i :3000

# Check logs
tail -f /var/www/html/ecom/app/logs/app.log

# Test locally
curl http://localhost:3000

# Test externally
curl http://109.205.181.119:3000
```

---

## 🔧 **TROUBLESHOOTING**

### **Kill all processes:**
```bash
pkill -9 node
```

### **Check port in use:**
```bash
lsof -i :3000
```

### **View logs:**
```bash
tail -f /var/www/html/ecom/app/logs/app.log
```

### **Run in foreground (debug):**
```bash
cd /var/www/html/ecom/app && \
export NODE_ENV=production && \
export DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce" && \
npm start
```

---

## 📊 **EXPECTED OUTPUT**

### **Process Running:**
```
root      12345  0.0  2.5 1234567 89012 ?  Sl   14:45   0:05 node ...
```

### **Port Listening:**
```
COMMAND   PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
node    12345 root   20u  IPv6  12345      0t0  TCP *:3000 (LISTEN)
```

### **Logs:**
```
> next start
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

### **Curl Test:**
```
<!DOCTYPE html>
<html>
...
```

---

## 🎯 **DEPLOYMENT CHECKLIST**

- [ ] Kill all node processes
- [ ] Remove old logs
- [ ] Set environment variables
- [ ] Start application (nohup or PM2)
- [ ] Wait 5 seconds
- [ ] Verify process running
- [ ] Verify port listening
- [ ] Check logs
- [ ] Test locally
- [ ] Test externally

---

## 📈 **DEPLOYMENT PROGRESS**

```
✅ Database: COMPLETE
✅ Build: COMPLETE
✅ Environment: COMPLETE
⏳ Start Application: NEXT
⏳ Verify Running: NEXT
⏳ Test Connectivity: NEXT
```

---

## 🚀 **NEXT STEP**

Choose Option 1 or 2 above and run the command.

---

**Last Updated:** November 10, 2025

