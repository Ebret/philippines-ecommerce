# Fix Philippines E-Commerce Platform Deployment Issues

**Date:** November 10, 2025  
**Status:** 🔧 FIXING DEPLOYMENT ISSUES  
**Version:** 1.0

---

## 🔍 **ISSUES IDENTIFIED**

1. ❌ Deployment logs directory missing: `/var/www/html/ecom/scripts/deployment-logs/`
2. ❌ Application logs directory missing: `/var/www/html/ecom/app/logs/`
3. ❌ Node.js application not running
4. ⚠️ Nginx showing default page (not configured for app)

---

## 🚀 **COMPLETE FIX WORKFLOW**

### **Step 1: Create Missing Directories**

```bash
mkdir -p /var/www/html/ecom/scripts/deployment-logs
mkdir -p /var/www/html/ecom/app/logs
chmod 755 /var/www/html/ecom/scripts/deployment-logs
chmod 755 /var/www/html/ecom/app/logs
echo "✓ Directories created"
```

---

### **Step 2: Verify Node.js Installation**

```bash
which node
node --version
npm --version
```

**Expected Output:**
```
/usr/bin/node
v18.19.1
9.8.1
```

---

### **Step 3: Check Environment Configuration**

```bash
cat /var/www/html/ecom/app/.env.local
```

**Expected Output:**
```
DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce"
```

---

### **Step 4: Check Application Files**

```bash
ls -la /var/www/html/ecom/app/ | grep -E "package.json|next.config|tsconfig"
```

**Expected Output:**
```
-rw-r--r-- 1 root root  1792 Nov 10 12:00 package.json
-rw-r--r-- 1 root root  3140 Nov 10 12:00 next.config.ts
-rw-r--r-- 1 root root   670 Nov 10 12:00 tsconfig.json
```

---

### **Step 5: Check Deployment Script**

```bash
cat /var/www/html/ecom/scripts/deploy.sh | head -100
```

---

### **Step 6: Run Deployment Script with Verbose Output**

```bash
bash -x /var/www/html/ecom/scripts/deploy.sh 2>&1 | tee /tmp/deploy_debug.log
```

---

## 🎯 **QUICK FIX: All Steps at Once**

```bash
cd /var/www/html/ecom/app && \
echo "=== Creating missing directories ===" && \
mkdir -p /var/www/html/ecom/scripts/deployment-logs && \
mkdir -p /var/www/html/ecom/app/logs && \
chmod 755 /var/www/html/ecom/scripts/deployment-logs && \
chmod 755 /var/www/html/ecom/app/logs && \
echo "✓ Directories created" && \
echo "" && \
echo "=== Verifying Node.js ===" && \
node --version && \
npm --version && \
echo "" && \
echo "=== Checking environment ===" && \
cat /var/www/html/ecom/app/.env.local && \
echo "" && \
echo "=== Checking application files ===" && \
ls -la /var/www/html/ecom/app/ | grep -E "package.json|next.config|tsconfig" && \
echo "" && \
echo "=== Running deployment script ===" && \
bash -x /var/www/html/ecom/scripts/deploy.sh 2>&1 | tee /tmp/deploy_debug.log
```

---

## 📋 **WHAT DEPLOY.SH SHOULD DO**

The deployment script should:

1. ✅ Create necessary directories
2. ✅ Set environment variables
3. ✅ Build Next.js application
4. ✅ Start Node.js application
5. ✅ Configure Nginx (if needed)
6. ✅ Verify application is running
7. ✅ Log all output

---

## 🔧 **IF DEPLOY.SH IS INCOMPLETE**

If the deploy.sh script is missing or incomplete, create a new one:

```bash
cat > /var/www/html/ecom/scripts/deploy.sh << 'EOF'
#!/bin/bash

set -e

echo "Starting Philippines E-Commerce Platform Deployment"
echo "=================================================="
echo ""

# Create directories
mkdir -p /var/www/html/ecom/scripts/deployment-logs
mkdir -p /var/www/html/ecom/app/logs

# Set environment
export NODE_ENV=production
export DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce"

# Navigate to app directory
cd /var/www/html/ecom/app

# Build application
echo "Building Next.js application..."
npm run build

# Start application
echo "Starting application..."
npm start > /var/www/html/ecom/app/logs/app.log 2>&1 &

# Wait for application to start
sleep 5

# Verify application is running
if ps aux | grep -q "[n]ode"; then
    echo "✓ Application started successfully"
    echo "✓ Application is running on port 3000"
else
    echo "✗ Application failed to start"
    exit 1
fi

echo ""
echo "Deployment complete!"
EOF

chmod +x /var/www/html/ecom/scripts/deploy.sh
```

---

## 🚀 **MANUAL APPLICATION START**

If the deployment script fails, start the application manually:

```bash
cd /var/www/html/ecom/app && \
export NODE_ENV=production && \
export DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce" && \
npm run build && \
npm start > /var/www/html/ecom/app/logs/app.log 2>&1 &
```

---

## ✅ **VERIFICATION STEPS**

### **Check if application is running:**

```bash
ps aux | grep node
```

### **Check application logs:**

```bash
tail -f /var/www/html/ecom/app/logs/app.log
```

### **Test application:**

```bash
curl http://localhost:3000
```

### **Check if port 3000 is listening:**

```bash
sudo netstat -tlnp | grep 3000
```

---

## 🔧 **CONFIGURE NGINX**

If Nginx is showing default page, configure it:

```bash
cat > /etc/nginx/sites-available/default << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

sudo nginx -t
sudo systemctl reload nginx
```

---

## 📊 **TROUBLESHOOTING**

### **If npm run build fails:**

```bash
cd /var/www/html/ecom/app
npm install
npm run build
```

### **If application won't start:**

```bash
cd /var/www/html/ecom/app
npm start
```

Check the error output.

### **If port 3000 is already in use:**

```bash
sudo lsof -i :3000
sudo kill -9 <PID>
```

---

## 🎯 **NEXT STEPS**

1. Run the "QUICK FIX" command above
2. Verify application is running
3. Check logs for any errors
4. Configure Nginx if needed
5. Test application

---

**Last Updated:** November 10, 2025

