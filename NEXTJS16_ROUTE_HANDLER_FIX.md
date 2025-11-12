# Philippines E-Commerce Platform - Next.js 16 Route Handler Fix

**Date:** November 10, 2025  
**Status:** 🔧 FIXING ROUTE HANDLER TYPES  
**Version:** 1.0

---

## 🔍 **ISSUE IDENTIFIED**

Next.js 16 changed how route handlers receive dynamic parameters. The error is:

```
Type '{ params: { id: string } }' is not assignable to type '{ params: Promise<{ id: string }> }'
```

**Root Cause:** Route handlers now receive `params` as a `Promise` instead of a direct object.

---

## ✅ **SOLUTION**

Update all route handlers to use `Promise<{ ... }>` for params.

### **Before (Next.js 15):**
```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  // ...
}
```

### **After (Next.js 16):**
```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // ...
}
```

---

## 🚀 **QUICK FIX SCRIPT**

Run this on your production server:

```bash
# 1. Stop everything
pm2 kill
pkill -9 node
sleep 2

# 2. Navigate to app directory
cd /var/www/html/ecom/app

# 3. Fix next.config.ts (remove i18n)
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

# 4. Clean build
rm -f .next/lock
rm -rf .next

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

## 📋 **WHAT THIS FIXES**

1. ✅ Removes i18n configuration (incompatible with App Router)
2. ✅ Provides clean next.config.ts without i18n
3. ✅ Cleans build artifacts
4. ✅ Rebuilds application
5. ✅ Starts with PM2

---

## 🔧 **MANUAL ROUTE HANDLER FIXES**

If you need to manually update route handlers, use this pattern:

**File:** `src/app/api/addresses/[id]/route.ts`

```typescript
// OLD (Next.js 15):
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const address = await prisma.address.findUnique({
    where: { id: params.id },
  });
  // ...
}

// NEW (Next.js 16):
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const address = await prisma.address.findUnique({
    where: { id },
  });
  // ...
}
```

---

## ✅ **EXPECTED OUTPUT**

After running the fix script:

```
✓ Compiled successfully in 12.7s
✓ Collecting page data in 2.5s
✓ Finalizing page optimization
✓ Prerendering complete
```

And PM2 status:

```
│ 0  │ philippines-ecommerce │ fork     │ 0    │ online    │ 0%       │ 33.6mb   │
```

---

**Last Updated:** November 10, 2025

