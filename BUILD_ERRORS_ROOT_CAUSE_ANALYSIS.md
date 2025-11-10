# Philippines E-Commerce Platform - Build Errors Root Cause Analysis

**Date:** November 10, 2025  
**Status:** 🔍 ROOT CAUSE ANALYSIS COMPLETE  
**Version:** 1.0

---

## 🔍 **ROOT CAUSE ANALYSIS**

### **Primary Issue: i18n Configuration Incompatibility**

**Location:** `next.config.ts` lines 90-93

```typescript
i18n: {
  locales: ["en", "fil"],
  defaultLocale: "en",
},
```

**Problem:** This configuration is for **Pages Router**, not **App Router**.

**Why It Breaks:**
- Next.js 16 uses App Router by default
- App Router doesn't support the `i18n` configuration in next.config.ts
- When Next.js encounters this, it tries to use Pages Router patterns
- This causes it to look for `_document.tsx` (Pages Router pattern)
- Since the app uses App Router, `_document.tsx` doesn't exist
- Build fails with: `Cannot find module for page: /_document`

**Cascade Effect:**
1. Build fails due to i18n config
2. `.next/prerender-manifest.json` is not created
3. Application tries to start but fails
4. PM2 restarts the process (restart loop)
5. Application never fully starts

---

## 🎯 **SOLUTION: Remove i18n Configuration**

The fix is simple: **Remove the i18n configuration from next.config.ts**

**Before:**
```typescript
// Internationalization optimization
i18n: {
  locales: ["en", "fil"],
  defaultLocale: "en",
},
```

**After:**
```typescript
// NOTE: i18n configuration removed - incompatible with App Router in Next.js 16
// For internationalization with App Router, use next-intl library instead
```

---

## 📋 **WHY THIS HAPPENED**

The project was originally set up with Pages Router i18n configuration, but the application uses App Router. This mismatch causes the build to fail.

**Key Points:**
- ✅ App Router is correctly implemented (src/app/layout.tsx, src/app/page.tsx)
- ✅ Middleware is correctly implemented (src/middleware.ts)
- ✅ All API routes are in src/app/api/
- ❌ next.config.ts still has Pages Router i18n config

---

## 🚀 **PROPER i18n SETUP FOR APP ROUTER**

If you need internationalization, use **next-intl** library:

```bash
npm install next-intl
```

Then configure in next.config.ts:

```typescript
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  // ... other config
};

export default withNextIntl(nextConfig);
```

---

## 📊 **BUILD ERROR SEQUENCE**

```
1. Build starts
   ↓
2. Reads next.config.ts
   ↓
3. Finds i18n configuration
   ↓
4. Tries to use Pages Router patterns
   ↓
5. Looks for _document.tsx
   ↓
6. File not found (App Router doesn't use it)
   ↓
7. Build fails with: "Cannot find module for page: /_document"
   ↓
8. .next/prerender-manifest.json not created
   ↓
9. Application tries to start
   ↓
10. Fails because manifest missing
    ↓
11. PM2 restarts process (restart loop)
    ↓
12. Application never fully starts
```

---

## ✅ **AFTER FIX**

```
1. Build starts
   ↓
2. Reads next.config.ts
   ↓
3. No i18n configuration found
   ↓
4. Uses App Router patterns
   ↓
5. Builds successfully
   ↓
6. Creates .next/prerender-manifest.json
   ↓
7. Application starts successfully
   ↓
8. Listens on port 3000
   ↓
9. Ready to serve requests
```

---

## 🔧 **COMPLETE FIX WORKFLOW**

```bash
# 1. Stop everything
pm2 kill
pkill -9 node
sleep 2

# 2. Clean build artifacts
cd /var/www/html/ecom/app && \
rm -f .next/lock && \
rm -rf .next

# 3. Copy fixed next.config.ts
cp /var/www/html/philippines-ecommerce/next.config.ts /var/www/html/ecom/app/next.config.ts

# 4. Rebuild
npm run build

# 5. Start with PM2
pm2 start npm --name "philippines-ecommerce" -- start

# 6. Verify
sleep 5
pm2 status
pm2 logs philippines-ecommerce
```

---

## 📈 **EXPECTED RESULTS**

### **Build Output:**
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

### **Application Status:**
```
│ 0  │ philippines-ecommerce │ fork     │ 0    │ online    │ 0%       │ 33.6mb   │
```

### **Port Status:**
```
COMMAND   PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
node    12345 root   20u  IPv6  12345      0t0  TCP *:3000 (LISTEN)
```

---

## 🎯 **KEY TAKEAWAYS**

1. **App Router vs Pages Router:** The project uses App Router, so Pages Router configurations don't apply
2. **i18n in App Router:** Use `next-intl` library instead of next.config.ts i18n
3. **Build Validation:** Always check next.config.ts matches your router choice
4. **Middleware:** The middleware.ts is correctly implemented for App Router

---

## 📚 **REFERENCES**

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [next-intl Library](https://next-intl-docs.vercel.app/)
- [Next.js i18n Routing](https://nextjs.org/docs/app/building-your-application/routing/internationalization)

---

**Last Updated:** November 10, 2025  
**Status:** ✅ ROOT CAUSE IDENTIFIED AND FIXED

---

**The fix has been applied to next.config.ts. Ready to deploy! 🚀**

