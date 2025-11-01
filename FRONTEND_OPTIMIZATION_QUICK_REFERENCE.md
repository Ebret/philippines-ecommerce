# Frontend Optimization - Quick Reference Guide

## 🚀 Quick Start

### 1. Dynamic Imports (Code Splitting)

**Import a component dynamically:**
```typescript
import { DynamicLoginForm } from "@/lib/dynamic-imports";

export default function LoginPage() {
  return <DynamicLoginForm />;
}
```

**Create custom dynamic import:**
```typescript
import { createDynamicImport } from "@/lib/dynamic-imports";

const DynamicComponent = createDynamicImport(
  () => import("@/components/MyComponent"),
  { loading: () => <div>Loading...</div> }
);
```

**Prefetch on hover:**
```typescript
import { usePrefetchOnHover } from "@/lib/dynamic-imports";

export function Link() {
  const ref = usePrefetchOnHover(() => import("@/pages/About"));
  return <a ref={ref} href="/about">About</a>;
}
```

### 2. Image Optimization

**Network-aware images:**
```typescript
import { useNetworkAwareImage } from "@/lib/image-optimization";

export function ProductImage() {
  const { src, srcSet, quality } = useNetworkAwareImage("/product.jpg");
  
  return (
    <img
      src={src}
      srcSet={srcSet}
      alt="Product"
      loading="lazy"
    />
  );
}
```

**Responsive images:**
```typescript
import { useResponsiveImage } from "@/lib/image-optimization";

export function HeroImage() {
  const { src, srcSet, sizes } = useResponsiveImage("/hero.jpg", "hero");
  
  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt="Hero"
    />
  );
}
```

**Lazy load images:**
```typescript
import { useLazyLoadImage } from "@/lib/image-optimization";

export function LazyImage() {
  const { ref, isLoaded } = useLazyLoadImage();
  
  return (
    <img
      ref={ref}
      src="/image.jpg"
      alt="Lazy loaded"
      className={isLoaded ? "loaded" : "loading"}
    />
  );
}
```

**Generate responsive srcset:**
```typescript
import { generateImageSrcsetWithQuality } from "@/lib/image-optimization";

const srcSet = generateImageSrcsetWithQuality("/image.jpg", [320, 640, 1024], "4g");
// Returns: /image.jpg?w=320&q=85 320w, /image.jpg?w=640&q=85 640w, ...
```

### 3. Critical CSS

**Inject critical CSS:**
```typescript
import { injectCriticalCSS } from "@/lib/critical-css";

useEffect(() => {
  injectCriticalCSS();
}, []);
```

**Get route-specific CSS:**
```typescript
import { getCriticalCSSForRoute } from "@/lib/critical-css";

const css = getCriticalCSSForRoute("/products");
```

**Defer non-critical CSS:**
```typescript
import { deferNonCriticalCSS } from "@/lib/critical-css";

useEffect(() => {
  deferNonCriticalCSS();
}, []);
```

**Preload fonts:**
```typescript
import { preloadFont } from "@/lib/critical-css";

useEffect(() => {
  preloadFont("https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700");
}, []);
```

### 4. Bundle Analysis

**Generate optimization report:**
```typescript
import { generateBundleOptimizationReport } from "@/lib/bundle-analyzer";

const report = generateBundleOptimizationReport();
console.log(report.analysis.recommendations);
console.log(report.reduction.potentialReduction);
```

**Get bundle health score:**
```typescript
import { getBundleHealthScore } from "@/lib/bundle-analyzer";

const { score, rating, issues } = getBundleHealthScore(modules);
// score: 0-100
// rating: "excellent" | "good" | "fair" | "poor"
// issues: string[]
```

**Identify lazy loadable modules:**
```typescript
import { identifyLazyLoadablModules } from "@/lib/bundle-analyzer";

const lazyModules = identifyLazyLoadablModules(modules);
```

**Identify code split modules:**
```typescript
import { identifyCodeSplitModules } from "@/lib/bundle-analyzer";

const splitModules = identifyCodeSplitModules(modules);
```

## 📊 Configuration

### Image Quality by Network Speed
```typescript
// 2G: 60% quality
// 3G: 75% quality
// 4G: 85% quality
// 5G: 95% quality
```

### Device Sizes
```typescript
// Mobile: 320px, 375px, 425px
// Tablet: 640px, 768px, 1024px
// Desktop: 1280px, 1536px
```

### Responsive Image Sizes
```typescript
// Hero: 100vw
// Product cards: 50vw (mobile), 33.3vw (tablet), 25vw (desktop)
// Thumbnails: 64px (mobile), 96px (tablet), 128px (desktop)
// Avatars: 40px (mobile), 48px (tablet), 56px (desktop)
```

## 🎯 Performance Tips

### 1. Use Dynamic Imports for Routes
```typescript
// ✅ Good - Code split by route
const ProductPage = dynamic(() => import("@/pages/products"));

// ❌ Avoid - All code in main bundle
import ProductPage from "@/pages/products";
```

### 2. Use Network-Aware Images
```typescript
// ✅ Good - Adapts to connection speed
const { src, srcSet } = useNetworkAwareImage("/image.jpg");

// ❌ Avoid - Same quality for all speeds
<img src="/image.jpg" />
```

### 3. Lazy Load Below-the-Fold Content
```typescript
// ✅ Good - Lazy load
<img src="/image.jpg" loading="lazy" />

// ❌ Avoid - Load everything
<img src="/image.jpg" />
```

### 4. Use Critical CSS
```typescript
// ✅ Good - Inject critical CSS
useEffect(() => { injectCriticalCSS(); }, []);

// ❌ Avoid - Load all CSS at once
<link rel="stylesheet" href="/styles.css" />
```

### 5. Analyze Bundle Size
```typescript
// ✅ Good - Monitor bundle size
const report = generateBundleOptimizationReport();

// ❌ Avoid - Ignore bundle size
// No monitoring
```

## 🔍 Debugging

### Check Network Speed
```typescript
import { detectNetworkSpeed } from "@/lib/image-optimization";

const speed = detectNetworkSpeed();
console.log(speed); // "2g" | "3g" | "4g" | "5g" | undefined
```

### Get Image Quality
```typescript
import { getImageQuality } from "@/lib/image-optimization";

const quality = getImageQuality("4g");
console.log(quality); // 85
```

### Measure CSS Performance
```typescript
import { measureCSSPerformance } from "@/lib/critical-css";

const metrics = measureCSSPerformance();
console.log(metrics);
```

### Generate CSS Report
```typescript
import { generateCSSReport } from "@/lib/critical-css";

const report = generateCSSReport();
console.log(report);
```

## 📱 Mobile Optimization

### Mobile-First Approach
```typescript
// Start with mobile styles
const sizes = "100vw"; // Mobile

// Add tablet breakpoint
const sizes = "(min-width: 768px) 50vw";

// Add desktop breakpoint
const sizes = "(min-width: 1024px) 33.3vw";
```

### Touch-Friendly Components
```typescript
// Use larger touch targets (48px minimum)
<button className="w-12 h-12">Click me</button>

// Use hover/focus states
<button className="hover:bg-gray-100 focus:ring-2">Click me</button>
```

### Responsive Images
```typescript
// Use srcSet for responsive images
<img
  src="/image.jpg"
  srcSet="/image-320w.jpg 320w, /image-640w.jpg 640w"
  sizes="(max-width: 640px) 100vw, 50vw"
  alt="Responsive"
/>
```

## 🧪 Testing

### Run Tests
```bash
npm test -- --run src/__tests__/frontend-optimization.test.ts
```

### Test Results
```
Test Files  1 passed (1)
Tests  54 passed (54)
Duration  2.00s
Status  ✅ PASS
```

## 📚 Documentation

- **FRONTEND_OPTIMIZATION_GUIDE.md** - Complete implementation guide
- **FRONTEND_OPTIMIZATION_PROGRESS.md** - Detailed progress report
- **FRONTEND_OPTIMIZATION_SUMMARY.md** - Executive summary

## 🆘 Common Issues

### Issue: Images not loading on slow networks
**Solution:** Use `useNetworkAwareImage` hook to adapt quality

### Issue: Large bundle size
**Solution:** Use dynamic imports and code splitting

### Issue: Slow first paint
**Solution:** Use `injectCriticalCSS` to inject above-the-fold CSS

### Issue: Slow image loading
**Solution:** Use `useLazyLoadImage` hook for lazy loading

## 📞 Support

For more information, see the complete documentation files or check the test file for usage examples.

## ✅ Checklist

- [ ] Use dynamic imports for routes
- [ ] Use network-aware images
- [ ] Lazy load below-the-fold content
- [ ] Inject critical CSS
- [ ] Monitor bundle size
- [ ] Test on slow networks
- [ ] Test on mobile devices
- [ ] Measure Core Web Vitals

## 🎉 You're Ready!

All frontend optimization features are production-ready and fully tested. Start using them in your components today!

