# Philippines E-Commerce Platform - Fix Build Errors for Production

**Date:** November 10, 2025  
**Status:** 🔧 FIXING BUILD ERRORS  
**Version:** 1.0

---

## 🔍 **BUILD ERRORS IDENTIFIED**

### **Error 1: i18n Configuration Incompatible with App Router**
```
⚠ i18n configuration in next.config.ts is unsupported in App Router.
```

**Cause:** The `i18n` configuration in `next.config.ts` (lines 90-93) is for Pages Router, not App Router.  
**Fix:** Remove the i18n configuration from next.config.ts.

---

### **Error 2: Cannot Find Module for Page: /_document**
```
Error [PageNotFoundError]: Cannot find module for page: /_document
```

**Cause:** Build is looking for `_document.tsx` which doesn't exist in App Router.  
**Fix:** This is automatically handled by App Router - no _document needed.

---

### **Error 3: Missing prerender-manifest.json**
```
Error: ENOENT: no such file or directory, open '/var/www/html/ecom/app/.next/prerender-manifest.json'
```

**Cause:** Build failed, so manifest file wasn't created.  
**Fix:** Fix the build errors above, then rebuild.

---

### **Error 4: Middleware Deprecation Warning**
```
⚠ The "middleware" file convention is deprecated. Please use "proxy" instead.
```

**Cause:** Using deprecated middleware pattern.  
**Fix:** Update middleware to use new pattern (optional for now).

---

## 🚀 **SOLUTION: FIX next.config.ts**

The issue is the i18n configuration. Remove it:

```bash
cat > /var/www/html/ecom/app/next.config.ts << 'EOF'
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack configuration for Next.js 16
  turbopack: {
    resolveAlias: {
      "@": "./src",
    },
  },

  // Image Optimization
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 375, 425, 640, 768, 1024, 1280, 1536],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Bundle Optimization
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

  // REMOVED: i18n configuration (incompatible with App Router)
  // i18n: {
  //   locales: ["en", "fil"],
  //   defaultLocale: "en",
  // },

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

---

## 🔧 **COMPLETE FIX WORKFLOW**

```bash
# 1. Stop PM2
pm2 kill
sleep 2

# 2. Kill all node processes
pkill -9 node
sleep 2

# 3. Clean build artifacts
cd /var/www/html/ecom/app && \
rm -f .next/lock && \
rm -rf .next

# 4. Update next.config.ts (copy the fixed version above)
cat > next.config.ts << 'EOF'
[PASTE THE FIXED CONFIG FROM ABOVE]
EOF

# 5. Rebuild
npm run build

# 6. Start with PM2
pm2 start npm --name "philippines-ecommerce" -- start

# 7. Wait and verify
sleep 5
pm2 status
pm2 logs philippines-ecommerce
```

---

## ✅ **EXPECTED OUTPUT AFTER FIX**

```
✓ Compiled successfully in 12.7s
✓ Collecting page data in 2.5s
✓ Finalizing page optimization
✓ Collecting Web Vitals
✓ Collecting build cache
✓ Collecting telemetry
✓ Prerendering 1 route with ISR/PPR
✓ Prerendering complete
```

---

## 📋 **VERIFICATION STEPS**

```bash
# 1. Check PM2 status
pm2 status

# 2. Check port 3000
lsof -i :3000

# 3. Check logs
pm2 logs philippines-ecommerce

# 4. Test locally
curl http://localhost:3000

# 5. Test externally
curl http://109.205.181.119:3000
```

---

## 🎯 **NEXT STEPS**

1. Update next.config.ts with the fixed version
2. Run the complete fix workflow
3. Verify application is running
4. Test connectivity

---

**Last Updated:** November 10, 2025

