# VPS Deployment Troubleshooting Guide - Philippines E-Commerce Platform

**Date:** November 10, 2025  
**VPS IP:** 109.205.181.119  
**App Directory:** /var/www/html/ecom/app  
**Status:** 🔧 TROUBLESHOOTING IN PROGRESS

---

## 📋 **STEP 1: CONNECT TO VPS VIA SSH**

### **Option A: Windows (PowerShell)**
```powershell
# Connect to VPS
ssh root@109.205.181.119

# When prompted, enter your VPS password
```

### **Option B: Windows (PuTTY)**
1. Open PuTTY
2. Host Name: `109.205.181.119`
3. Port: `22`
4. Connection type: SSH
5. Click "Open"
6. Login as: `root`
7. Password: (enter your VPS password)

### **Option C: Windows (WSL/Git Bash)**
```bash
ssh root@109.205.181.119
```

---

## 🔍 **STEP 2: DIAGNOSE THE PROBLEM**

Once connected to VPS, run these commands:

### **Check PM2 Status**
```bash
pm2 status
```

**Expected Output:**
```
│ 0  │ philippines-ecommerce │ fork     │ 27   │ online    │ 0%       │ 33.6mb   │
                                              ↑
                                         27 restarts = CRASHING
```

### **Check PM2 Logs (Last 50 lines)**
```bash
pm2 logs philippines-ecommerce --lines 50
```

**Look for:**
- TypeScript compilation errors
- Module not found errors
- Port already in use
- Memory issues

### **Check Full Error Output**
```bash
pm2 logs philippines-ecommerce --lines 200 | tail -100
```

### **Check if Port 3000 is Listening**
```bash
lsof -i :3000
```

### **Check Node Process**
```bash
ps aux | grep node
```

### **Check Disk Space**
```bash
df -h
```

### **Check Memory**
```bash
free -h
```

---

## 🛑 **STEP 3: STOP EVERYTHING**

```bash
# Kill PM2
pm2 kill

# Kill all node processes
pkill -9 node

# Wait 2 seconds
sleep 2

# Verify all stopped
ps aux | grep node
```

**Expected:** No node processes running

---

## 📂 **STEP 4: NAVIGATE TO APP DIRECTORY**

```bash
cd /var/www/html/ecom/app

# Verify you're in the right place
pwd
# Should output: /var/www/html/ecom/app

# List files
ls -la
```

---

## 🔧 **STEP 5: BACKUP CURRENT CONFIG**

```bash
# Backup current next.config.ts
cp next.config.ts next.config.ts.backup

# Backup current route handlers
cp -r src/app/api src/app/api.backup

# Verify backups
ls -la next.config.ts.backup
ls -la src/app/api.backup
```

---

## 📝 **STEP 6: FIX next.config.ts**

### **Option A: Using cat (Recommended)**

```bash
cat > next.config.ts << 'EOF'
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      "@": "./src",
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 375, 425, 640, 768, 1024, 1280, 1536],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  webpack: (config, { isServer }) => {
    config.optimization = {
      ...config.optimization,
      usedExports: true,
      sideEffects: false,
    };
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            priority: 10,
            reuseExistingChunk: true,
          },
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom|react-hook-form)[\\/]/,
            name: "react-vendors",
            priority: 20,
            reuseExistingChunk: true,
          },
          ui: {
            test: /[\\/]node_modules[\\/](@radix-ui|lucide-react|tailwindcss)[\\/]/,
            name: "ui-vendors",
            priority: 15,
            reuseExistingChunk: true,
          },
          common: {
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
            name: "common",
          },
        },
      };
    }
    return config;
  },
  compress: true,
  productionBrowserSourceMaps: false,
  experimental: {
    optimizePackageImports: [
      "@radix-ui/react-accordion",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-select",
      "@radix-ui/react-tabs",
      "@radix-ui/react-toast",
      "lucide-react",
    ],
  },
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [];
  },
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
EOF
```

### **Verify the file was created**
```bash
cat next.config.ts | head -20
```

---

## 🧹 **STEP 7: CLEAN BUILD ARTIFACTS**

```bash
# Remove lock file
rm -f .next/lock

# Remove entire .next directory
rm -rf .next

# Verify cleaned
ls -la | grep next
# Should show nothing
```

---

## 🔨 **STEP 8: REBUILD APPLICATION**

```bash
# Run build
npm run build

# This will take 30-60 seconds
# Watch for: ✓ Compiled successfully
```

**Expected Output:**
```
✓ Compiled successfully in 12.7s
✓ Collecting page data in 2.5s
✓ Finalizing page optimization
✓ Prerendering complete
```

**If build fails:**
```bash
# Check error details
npm run build 2>&1 | tail -50
```

---

## 🚀 **STEP 9: START WITH PM2**

```bash
# Start application
pm2 start npm --name "philippines-ecommerce" -- start

# Wait 5 seconds
sleep 5

# Check status
pm2 status
```

**Expected:**
```
│ 0  │ philippines-ecommerce │ fork     │ 0    │ online    │ 0%       │ 33.6mb   │
                                              ↑
                                         0 restarts = GOOD!
```

---

## ✅ **STEP 10: VERIFY APPLICATION**

### **Check PM2 Logs**
```bash
pm2 logs philippines-ecommerce --lines 20
```

**Look for:**
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

### **Check Port 3000**
```bash
lsof -i :3000
```

**Expected:**
```
COMMAND   PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
node    12345 root   20u  IPv6  12345      0t0  TCP *:3000 (LISTEN)
```

### **Test Locally**
```bash
curl http://localhost:3000
```

**Expected:** HTML content (not error)

### **Test Externally**
```bash
curl http://109.205.181.119:3000
```

**Expected:** HTML content

---

## 🆘 **TROUBLESHOOTING**

### **If Build Fails**
```bash
# Check Node version
node --version

# Check npm version
npm --version

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try build again
npm run build
```

### **If Application Still Crashes**
```bash
# Check detailed logs
pm2 logs philippines-ecommerce --lines 100

# Check system resources
free -h
df -h

# Check for port conflicts
lsof -i :3000
```

### **If Port 3000 Already in Use**
```bash
# Kill process on port 3000
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Wait 2 seconds
sleep 2

# Try starting again
pm2 start npm --name "philippines-ecommerce" -- start
```

---

## 📊 **FINAL VERIFICATION CHECKLIST**

- [ ] Connected to VPS via SSH
- [ ] Checked PM2 logs for errors
- [ ] Stopped all processes (pm2 kill, pkill -9 node)
- [ ] Backed up current config
- [ ] Fixed next.config.ts (removed i18n)
- [ ] Cleaned build artifacts
- [ ] Ran npm run build successfully
- [ ] Started with PM2
- [ ] PM2 status shows 0 restarts
- [ ] Port 3000 listening
- [ ] Logs show "ready - started server"
- [ ] Local curl test passes
- [ ] External curl test passes

---

## 🎉 **SUCCESS INDICATORS**

✅ PM2 status shows "online" with 0 restarts  
✅ Port 3000 is listening  
✅ Logs show "ready - started server"  
✅ curl http://localhost:3000 returns HTML  
✅ curl http://109.205.181.119:3000 returns HTML  

---

**Last Updated:** November 10, 2025

