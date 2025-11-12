# Step-by-Step VPS Deployment Fix Guide

**VPS IP:** 109.205.181.119  
**App Directory:** /var/www/html/ecom/app  
**Estimated Time:** 10-15 minutes

---

## 📋 **STEP 1: CONNECT TO VPS**

### **Windows PowerShell:**
```powershell
ssh root@109.205.181.119
```

### **Windows Command Prompt:**
```cmd
ssh root@109.205.181.119
```

### **Git Bash / WSL:**
```bash
ssh root@109.205.181.119
```

**When prompted:** Enter your VPS password

**Expected:** You should see a terminal prompt like:
```
root@vmi2622209:~#
```

---

## 🔍 **STEP 2: CHECK CURRENT STATUS**

```bash
pm2 status
```

**You should see:**
```
│ 0  │ philippines-ecommerce │ fork     │ 27   │ online    │ 0%       │ 33.6mb   │
```

The "27" means it has restarted 27 times (crashing repeatedly).

---

## 📋 **STEP 3: CHECK ERROR LOGS**

```bash
pm2 logs philippines-ecommerce --lines 50
```

**Look for error messages like:**
- `Type error: Type 'typeof import...`
- `Cannot find module`
- `i18n configuration`

---

## 🛑 **STEP 4: STOP EVERYTHING**

```bash
pm2 kill
```

**Wait for:**
```
[PM2] Applying action deleteProcessId on app [all]
[PM2] [v] All Applications Stopped
[PM2] [v] PM2 Daemon Stopped
```

Then:
```bash
pkill -9 node
sleep 2
```

Verify all stopped:
```bash
ps aux | grep node
```

**Expected:** Only the grep command itself appears (no node processes)

---

## 📂 **STEP 5: NAVIGATE TO APP DIRECTORY**

```bash
cd /var/www/html/ecom/app
```

Verify:
```bash
pwd
```

**Expected:**
```
/var/www/html/ecom/app
```

---

## 💾 **STEP 6: BACKUP CURRENT FILES**

```bash
cp next.config.ts next.config.ts.backup
cp -r src/app/api src/app/api.backup
```

Verify backups:
```bash
ls -la next.config.ts.backup
ls -la src/app/api.backup
```

---

## 🔧 **STEP 7: FIX next.config.ts**

Copy and paste this entire command (all at once):

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

Verify it was created:
```bash
head -20 next.config.ts
```

---

## 🧹 **STEP 8: CLEAN BUILD ARTIFACTS**

```bash
rm -f .next/lock
rm -rf .next
```

Verify:
```bash
ls -la | grep next
```

**Expected:** No output (nothing found)

---

## 🔨 **STEP 9: REBUILD APPLICATION**

```bash
npm run build
```

**This will take 30-60 seconds. Watch for:**

```
✓ Compiled successfully in 12.7s
✓ Collecting page data in 2.5s
✓ Finalizing page optimization
✓ Prerendering complete
```

**If you see errors, run:**
```bash
npm run build 2>&1 | tail -50
```

---

## 🚀 **STEP 10: START WITH PM2**

```bash
pm2 start npm --name "philippines-ecommerce" -- start
```

Wait 5 seconds:
```bash
sleep 5
```

Check status:
```bash
pm2 status
```

**Expected:**
```
│ 0  │ philippines-ecommerce │ fork     │ 0    │ online    │ 0%       │ 33.6mb   │
```

Notice the "0" restarts (not 27+)!

---

## ✅ **STEP 11: VERIFY APPLICATION**

### **Check Logs**
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

## 🎉 **SUCCESS CHECKLIST**

- [ ] Connected to VPS
- [ ] Checked PM2 status (showed 27+ restarts)
- [ ] Stopped all processes
- [ ] Backed up current files
- [ ] Fixed next.config.ts
- [ ] Cleaned build artifacts
- [ ] Ran npm run build (completed successfully)
- [ ] Started with PM2
- [ ] PM2 status shows 0 restarts
- [ ] Port 3000 listening
- [ ] Logs show "ready - started server"
- [ ] curl http://localhost:3000 works
- [ ] curl http://109.205.181.119:3000 works

---

## 🆘 **IF SOMETHING GOES WRONG**

### **Build Still Fails**
```bash
npm install
npm run build
```

### **Application Still Crashes**
```bash
pm2 logs philippines-ecommerce --lines 100
```

### **Port Already in Use**
```bash
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
sleep 2
pm2 start npm --name "philippines-ecommerce" -- start
```

### **Restore from Backup**
```bash
cp next.config.ts.backup next.config.ts
cp -r src/app/api.backup/* src/app/api/
```

---

## 📞 **NEED HELP?**

If you get stuck, provide:
1. The exact error message
2. Output of: `pm2 logs philippines-ecommerce --lines 50`
3. Output of: `pm2 status`
4. Output of: `lsof -i :3000`

---

**Last Updated:** November 10, 2025  
**Status:** Ready to Deploy

