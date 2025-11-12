# VPS Quick Fix Commands - Copy & Paste Ready

**VPS IP:** 109.205.181.119  
**App Directory:** /var/www/html/ecom/app

---

## 🚀 **COMPLETE DEPLOYMENT FIX (Copy & Paste All)**

```bash
# 1. CONNECT TO VPS
ssh root@109.205.181.119

# 2. STOP EVERYTHING
pm2 kill
pkill -9 node
sleep 2

# 3. NAVIGATE TO APP
cd /var/www/html/ecom/app

# 4. BACKUP CURRENT CONFIG
cp next.config.ts next.config.ts.backup
cp -r src/app/api src/app/api.backup

# 5. FIX next.config.ts (Remove i18n)
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

# 6. CLEAN BUILD
rm -f .next/lock
rm -rf .next

# 7. REBUILD
npm run build

# 8. START WITH PM2
pm2 start npm --name "philippines-ecommerce" -- start

# 9. WAIT AND VERIFY
sleep 5
pm2 status
pm2 logs philippines-ecommerce --lines 20
```

---

## 🔍 **DIAGNOSTIC COMMANDS**

### **Check Status**
```bash
pm2 status
```

### **Check Logs (Last 50 lines)**
```bash
pm2 logs philippines-ecommerce --lines 50
```

### **Check Port 3000**
```bash
lsof -i :3000
```

### **Test Locally**
```bash
curl http://localhost:3000
```

### **Test Externally**
```bash
curl http://109.205.181.119:3000
```

### **Check System Resources**
```bash
free -h
df -h
```

---

## 🛑 **EMERGENCY STOP**

```bash
pm2 kill
pkill -9 node
sleep 2
ps aux | grep node
```

---

## 🔄 **RESTART AFTER FIX**

```bash
cd /var/www/html/ecom/app
pm2 start npm --name "philippines-ecommerce" -- start
sleep 5
pm2 status
pm2 logs philippines-ecommerce --lines 20
```

---

## ✅ **SUCCESS CHECKLIST**

- [ ] PM2 status shows "online" with 0 restarts
- [ ] Port 3000 listening
- [ ] Logs show "ready - started server"
- [ ] curl http://localhost:3000 works
- [ ] curl http://109.205.181.119:3000 works

---

## 🆘 **IF STILL FAILING**

```bash
# Check detailed error
pm2 logs philippines-ecommerce --lines 200 | tail -100

# Reinstall dependencies
cd /var/www/html/ecom/app
rm -rf node_modules package-lock.json
npm install

# Try build again
npm run build

# Start again
pm2 start npm --name "philippines-ecommerce" -- start
```

---

**Last Updated:** November 10, 2025

