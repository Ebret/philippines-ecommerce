# Design System Specification
## Extreme Life Herbal + Relivator Integration

**Date:** November 22, 2025  
**Status:** Complete  
**Version:** 1.0

---

## 🎨 Color System

### Primary Palette
```
Primary Green (Emerald):
  - 50: #f0fdf4
  - 100: #dcfce7
  - 200: #bbf7d0
  - 300: #86efac
  - 400: #4ade80
  - 500: #22c55e (Base)
  - 600: #16a34a
  - 700: #15803d
  - 800: #166534
  - 900: #145231

Secondary Blue:
  - 50: #eff6ff
  - 100: #dbeafe
  - 200: #bfdbfe
  - 300: #93c5fd
  - 400: #60a5fa
  - 500: #3b82f6 (Base)
  - 600: #2563eb
  - 700: #1d4ed8
  - 800: #1e40af
  - 900: #1e3a8a

Accent Amber:
  - 50: #fffbeb
  - 100: #fef3c7
  - 200: #fde68a
  - 300: #fcd34d
  - 400: #fbbf24
  - 500: #f59e0b (Base)
  - 600: #d97706
  - 700: #b45309
  - 800: #92400e
  - 900: #78350f
```

### Semantic Colors
- **Success:** `#22c55e` (emerald-500)
- **Warning:** `#f59e0b` (amber-500)
- **Error:** `#ef4444` (red-500)
- **Info:** `#3b82f6` (blue-500)

### Neutral Palette
- **Gray-50:** `#f9fafb`
- **Gray-100:** `#f3f4f6`
- **Gray-200:** `#e5e7eb`
- **Gray-300:** `#d1d5db`
- **Gray-400:** `#9ca3af`
- **Gray-500:** `#6b7280`
- **Gray-600:** `#4b5563`
- **Gray-700:** `#374151`
- **Gray-800:** `#1f2937`
- **Gray-900:** `#111827`

---

## 🔤 Typography System

### Font Stack
```
Sans-serif (Primary):
-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
Helvetica, Arial, sans-serif

Mono (Secondary):
"Fira Code", "Courier New", monospace
```

### Font Sizes
- **xs:** 12px (0.75rem)
- **sm:** 14px (0.875rem)
- **base:** 16px (1rem)
- **lg:** 18px (1.125rem)
- **xl:** 20px (1.25rem)
- **2xl:** 24px (1.5rem)
- **3xl:** 30px (1.875rem)
- **4xl:** 36px (2.25rem)
- **5xl:** 48px (3rem)

### Font Weights
- **Light:** 300
- **Regular:** 400
- **Medium:** 500
- **Semibold:** 600
- **Bold:** 700
- **Extrabold:** 800

### Line Heights
- **Tight:** 1.25
- **Snug:** 1.375
- **Normal:** 1.5
- **Relaxed:** 1.625
- **Loose:** 2

---

## 📏 Spacing System

### Scale (8px base)
- **0:** 0px
- **1:** 4px
- **2:** 8px
- **3:** 12px
- **4:** 16px
- **5:** 20px
- **6:** 24px
- **8:** 32px
- **10:** 40px
- **12:** 48px
- **16:** 64px
- **20:** 80px
- **24:** 96px

---

## 🎯 Component Styles

### Buttons
- **Primary:** Emerald gradient, white text
- **Secondary:** Blue, white text
- **Outline:** Border only, transparent background
- **Ghost:** No border, text only
- **Sizes:** sm (32px), md (40px), lg (48px)
- **Radius:** 8px
- **Hover:** Scale 105%, shadow increase

### Cards
- **Background:** White (light), gray-800 (dark)
- **Border:** 1px gray-200 (light), gray-700 (dark)
- **Radius:** 12px
- **Shadow:** md (light), none (dark)
- **Hover:** Shadow increase, border color change

### Inputs
- **Background:** White (light), gray-800 (dark)
- **Border:** 1px gray-300 (light), gray-600 (dark)
- **Radius:** 8px
- **Focus:** Emerald border, shadow
- **Padding:** 12px 16px

### Badges
- **Popular:** Emerald background, emerald text
- **Best Seller:** Amber background, amber text
- **Premium:** Blue background, blue text
- **Radius:** 9999px (full)
- **Padding:** 6px 12px

---

## 🔲 Breakpoints

- **xs:** 320px
- **sm:** 640px
- **md:** 768px
- **lg:** 1024px
- **xl:** 1280px
- **2xl:** 1536px

---

## 🎬 Animations

### Transitions
- **Fast:** 150ms
- **Base:** 200ms
- **Slow:** 300ms
- **Slower:** 500ms

### Easing
- **ease-in:** cubic-bezier(0.4, 0, 1, 1)
- **ease-out:** cubic-bezier(0, 0, 0.2, 1)
- **ease-in-out:** cubic-bezier(0.4, 0, 0.2, 1)

### Effects
- **Fade:** Opacity transition
- **Scale:** Transform scale
- **Slide:** Transform translate
- **Bounce:** Spring animation

---

## 🌙 Dark Mode

### Implementation
- CSS variables with theme context
- Automatic system preference detection
- Manual toggle option
- Smooth transitions (300ms)

### Dark Mode Colors
- **Background:** `#111827` (gray-950)
- **Surface:** `#1f2937` (gray-800)
- **Text:** `#f3f4f6` (gray-100)
- **Border:** `#374151` (gray-700)

---

## ♿ Accessibility

### WCAG AA Compliance
- **Contrast Ratio:** 4.5:1 minimum for text
- **Focus States:** Visible outline (2px)
- **Keyboard Navigation:** Full support
- **Screen Readers:** Semantic HTML

### Color Contrast
- **Text on Primary:** White on emerald ✅
- **Text on Secondary:** White on blue ✅
- **Text on Accent:** Dark on amber ✅

---

## 📱 Responsive Design

### Mobile-First Approach
- **Base:** Mobile (320px)
- **Tablet:** 768px+
- **Desktop:** 1024px+
- **Large:** 1280px+

### Grid System
- **Mobile:** 1 column
- **Tablet:** 2 columns
- **Desktop:** 3-4 columns
- **Gap:** 16px (mobile), 24px (desktop)

---

## 🎨 Design Tokens

### Token Naming Convention
```
{category}-{property}-{variant}

Examples:
- color-primary-500
- spacing-md
- font-size-lg
- shadow-md
- radius-lg
```

---

## ✅ Implementation Checklist

- [x] Color palette defined
- [x] Typography system specified
- [x] Spacing scale established
- [x] Component styles documented
- [x] Breakpoints defined
- [x] Animations specified
- [x] Dark mode configured
- [x] Accessibility standards met
- [x] Responsive design planned
- [x] Design tokens created

---

**Status:** ✅ Design System Specification Complete

**Next Steps:** Component mapping and Phase 2 backend alignment

