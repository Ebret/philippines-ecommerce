# Extreme Life Design Integration Plan

**Date:** December 1, 2025  
**Target:** Philippines E-Commerce Platform  
**Source:** Extreme Life Herbal Repository

---

## 📋 Integration Strategy

### Phase 1: Color System Update
**Goal:** Replace current Relivator colors with Extreme Life earthy palette

#### Current Colors (Relivator)
- Primary: Emerald Green #10b981
- Secondary: Blue #2563eb
- Accent: Amber Gold #f59e0b

#### New Colors (Extreme Life)
- Primary: Deep Forest Green #2D4A3E (HSL: 145 24% 23%)
- Secondary: Sage Green #8FBC8F (HSL: 96 24% 65%)
- Accent: Sandy Brown/Orange #F4A460 (HSL: 28 87% 67%)
- Background: Cream/Beige #F9F7F2 (HSL: 40 33% 96%)
- Foreground: Dark Green/Charcoal #27352B (HSL: 140 15% 18%)

#### Files to Update
1. `tailwind.config.ts` - Update color definitions
2. `src/app/globals.css` - Update CSS variables
3. All component files using `primary-600`, `primary-700` classes

---

### Phase 2: Typography Update
**Goal:** Integrate Libre Baskerville serif font for headings

#### Changes Required
1. Add Google Fonts import for:
   - DM Sans (body text)
   - Libre Baskerville (headings)
2. Update `tailwind.config.ts` font families
3. Apply `font-serif` to all h1-h6 elements
4. Update product card titles to use serif font

---

### Phase 3: Component Styling Updates

#### 3.1 Buttons
- Change from gradient buttons to solid with border
- Add `rounded-full` to primary action buttons
- Add `hover-elevate` and `active-elevate-2` classes
- Remove gradient backgrounds, use solid `bg-primary`

#### 3.2 Cards
- Update border radius from `rounded-lg` to `rounded-xl`
- Add hover lift effect: `hover:-translate-y-1`
- Add image zoom on hover: `group-hover:scale-105`
- Update shadows: `shadow` default, `hover:shadow-lg`

#### 3.3 Navbar
- Add backdrop blur: `backdrop-blur`
- Update background: `bg-background/95`
- Change logo to use Leaf icon
- Update text to "Extreme Life" or "Extreme Life Herbal"

#### 3.4 Product Cards
- Add category badge (top-right, rounded-full)
- Add discount badge (top-left, red background)
- Add stock status badge (bottom-left)
- Update price styling to use `text-primary`
- Add platform badges (Shopee, Lazada)

---

### Phase 4: Page-Specific Updates

#### 4.1 Homepage
- Add Hero section with decorative blur elements
- Add Features section with icons (100% Organic, Lab Tested, Fast Shipping, Satisfaction)
- Add "Available sa Popular Platforms" section
- Update background colors to cream/beige

#### 4.2 Product Pages
- Add serif font to product names
- Add rounded-full buttons
- Update color scheme to forest green
- Add backdrop blur to badges

#### 4.3 Account Pages
- Update card styling to rounded-xl
- Change button colors to forest green
- Add serif headings

#### 4.4 Vendor Pages
- Update dashboard cards to rounded-xl
- Change primary color to forest green
- Update charts to use new color palette

#### 4.5 Admin Pages
- Keep sidebar but update colors
- Change hover border to forest green
- Update card styling

---

## 🎨 CSS Variables Mapping

### Old → New Color Mapping
```css
/* Primary Colors */
--primary-600: #10b981 → hsl(145 24% 23%)  /* Deep Forest Green */
--primary-700: #059669 → hsl(145 24% 20%)  /* Darker Forest Green */
--primary-500: #34d399 → hsl(145 24% 35%)  /* Lighter Forest Green */

/* Secondary Colors */
--secondary-600: #2563eb → hsl(96 24% 65%)  /* Sage Green */
--secondary-700: #1d4ed8 → hsl(96 24% 55%)  /* Darker Sage */

/* Accent Colors */
--accent-600: #f59e0b → hsl(28 87% 67%)  /* Sandy Brown */
--accent-700: #d97706 → hsl(28 87% 57%)  /* Darker Sandy Brown */

/* Neutral Colors */
--neutral-50: #fafafa → hsl(40 33% 96%)   /* Cream */
--neutral-900: #171717 → hsl(140 15% 18%) /* Dark Green/Charcoal */
--neutral-950: #0a0a0a → hsl(140 15% 10%) /* Very Dark Green */
```

---

## 🔧 Implementation Steps

### Step 1: Update Global Styles (30 min)
1. Update `tailwind.config.ts` with new colors
2. Update `src/app/globals.css` with CSS variables
3. Add Google Fonts imports
4. Test build to ensure no errors

### Step 2: Update UI Components (60 min)
1. Update `src/components/ui/button.tsx`
2. Update `src/components/ui/card.tsx`
3. Update `src/components/ui/badge.tsx`
4. Update `src/components/layout/navbar.tsx`

### Step 3: Update Pages (120 min)
1. Homepage - Add Hero, Features sections
2. Product pages - Update cards, badges
3. Account pages - Update styling
4. Vendor pages - Update dashboard
5. Admin pages - Update sidebar colors

### Step 4: Testing (30 min)
1. Build locally: `npm run build`
2. Test light/dark modes
3. Test responsive design
4. Check accessibility

### Step 5: Documentation (15 min)
1. Update UI_UX_AUDIT_SUMMARY.md
2. Create before/after comparison
3. Document new components

---

## ⚠️ Compatibility Notes

### What to Keep
- ✅ Next.js 16 App Router structure
- ✅ React 19 components
- ✅ TypeScript types
- ✅ Existing API endpoints
- ✅ Authentication system
- ✅ Dark mode functionality
- ✅ Responsive design
- ✅ Accessibility features

### What to Change
- ❌ Color palette (emerald → forest green)
- ❌ Button gradients (gradient → solid)
- ❌ Border radius (lg → xl)
- ❌ Font family (sans → serif for headings)
- ❌ Navbar logo (generic → Leaf icon)
- ❌ Background colors (white → cream/beige)

---

## 📊 Expected Impact

### Visual Changes
- More earthy, organic feel
- Warmer color palette
- Elegant serif headings
- Softer, rounded corners
- Subtle backdrop blur effects

### User Experience
- Consistent with Extreme Life brand
- Filipino-friendly design
- Platform integration (Shopee, Lazada)
- Better product presentation
- Enhanced trust signals

### Technical
- Zero breaking changes
- All tests still passing
- Same performance
- Same accessibility
- Same responsiveness

---

**Total Estimated Time:** 4-5 hours  
**Risk Level:** Low (no breaking changes)  
**Rollback Plan:** Git revert to previous commit

---

**End of Integration Plan**

