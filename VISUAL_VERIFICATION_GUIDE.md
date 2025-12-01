# Visual Verification Guide - Enhanced Botanical Theme

**Date:** December 1, 2025  
**Deployment:** Enhanced Botanical Theme System  
**URL:** https://extremelifeherbal.com

---

## 🎨 Color Palette Verification

### Light Mode Colors

#### Background & Text
- [ ] **Background:** Warm cream `#F7F5F0` (not pure white)
- [ ] **Body text:** Deep forest green `#1E2E24` (very dark, high contrast)
- [ ] **Headings:** Use Libre Baskerville serif font
- [ ] **Heading color:** Forest green `#214A38`

#### Buttons
- [ ] **Primary button:** Forest green `#214A38` background, white text
- [ ] **Primary button hover:** Darker shade, lifts up 2px
- [ ] **Secondary button:** Moss green `#6B9B5F` background, white text
- [ ] **Accent button:** Terracotta `#DF6B1F` background, white text

#### Cards & Borders
- [ ] **Card background:** Pure white `#FFFFFF`
- [ ] **Card borders:** 2px sage green `#A3B89A` (thicker than before)
- [ ] **Card hover:** Lifts up 4-6px, enhanced shadow
- [ ] **Input borders:** 2px sage green, visible and clear

#### Semantic Colors
- [ ] **Success:** Vibrant forest green `#31804F`
- [ ] **Error:** Deep red `#C92A2A`
- [ ] **Warning:** Amber gold `#D97706`
- [ ] **Info:** Deep blue `#2980B9`

---

### Dark Mode Colors

#### Background & Text
- [ ] **Background:** Deep forest night `#0F1812` (very dark green, not black)
- [ ] **Body text:** Warm cream `#F2EDE3` (high contrast)
- [ ] **Headings:** Still use Libre Baskerville serif
- [ ] **Heading color:** Bright forest green `#45A370`

#### Buttons
- [ ] **Primary button:** Bright forest green `#45A370`, dark text
- [ ] **Secondary button:** Dark moss `#5A7A4F`, cream text
- [ ] **Accent button:** Glowing ember `#E8803D`, dark text

#### Cards & Borders
- [ ] **Card background:** Slightly lighter than background `#1A2620`
- [ ] **Card borders:** Medium forest `#2F4A3D` (visible in dark mode)
- [ ] **Input borders:** Same medium forest color

---

## 📝 Typography Verification

### Font Families
- [ ] **Headings (h1-h6):** Libre Baskerville serif font
- [ ] **Body text:** DM Sans sans-serif font
- [ ] **Buttons:** DM Sans with font-weight 600

### Readability
- [ ] **Body text line-height:** 1.7 (comfortable reading)
- [ ] **Heading line-height:** 1.1-1.35 (tighter for headings)
- [ ] **Paragraph spacing:** Visible margin-bottom
- [ ] **Link hover:** Underline appears on hover

### Font Sizes
- [ ] **h1:** 2.5rem (40px) - Hero headings
- [ ] **h2:** 2rem (32px) - Section headings
- [ ] **h3:** 1.75rem (28px) - Subsection headings
- [ ] **Body:** 1rem (16px) - Comfortable reading size

---

## 🎭 Component Verification

### Product Cards
- [ ] **Border:** 2px sage green border visible
- [ ] **Corners:** Rounded-xl (12px radius)
- [ ] **Shadow:** Visible shadow at rest
- [ ] **Hover effect:** Card lifts up 6px
- [ ] **Image hover:** Image scales to 1.08x (zoom effect)
- [ ] **Border hover:** Changes to primary color

### Buttons
- [ ] **Border:** 2px border visible
- [ ] **Shape:** Fully rounded (pill shape)
- [ ] **Padding:** Comfortable padding (0.75rem 2rem)
- [ ] **Hover:** Darkens and lifts up 2px
- [ ] **Shadow:** Enhanced shadow on hover
- [ ] **Active:** Presses down (translateY(0))

### Form Inputs
- [ ] **Border:** 2px border (thicker than before)
- [ ] **Border color:** Sage green `#A3B89A`
- [ ] **Focus state:** 3px ring shadow appears
- [ ] **Focus color:** Primary forest green
- [ ] **Placeholder:** Muted foreground color, 70% opacity
- [ ] **Hover:** Border lightens to primary-light

### Navigation
- [ ] **Nav links:** Proper spacing and padding
- [ ] **Hover:** Background changes to muted color
- [ ] **Active state:** 3px bottom border in primary color
- [ ] **Active text:** Bold and primary color
- [ ] **Navbar background:** Backdrop blur effect

### Footer
- [ ] **Background:** Gradient from primary to primary-dark
- [ ] **Top border:** 4px accent (terracotta) border
- [ ] **Text color:** White/cream on dark background
- [ ] **Link hover:** Underline appears

### Badges
- [ ] **Shopee badge:** Vibrant orange `#FF6600`, white text
- [ ] **Lazada badge:** Deep blue `#0F156D`, white text
- [ ] **Flash Sale badge:** Purple gradient with pulse animation
- [ ] **Status badges:** Success (green), Error (red), Warning (amber), Info (blue)

---

## ♿ Accessibility Verification

### Focus Indicators
- [ ] **Focus ring:** 3px solid primary color
- [ ] **Focus offset:** 2px offset from element
- [ ] **Visibility:** Clearly visible in both light and dark modes
- [ ] **All interactive elements:** Buttons, links, inputs, selects

### Keyboard Navigation
- [ ] **Tab order:** Logical and sequential
- [ ] **Skip to main:** Link appears on first tab
- [ ] **All buttons:** Accessible via keyboard
- [ ] **All links:** Accessible via keyboard
- [ ] **Form inputs:** Can be focused and filled

### Contrast Testing
- [ ] **Body text:** Use WebAIM Contrast Checker
  - Light mode: Should show 8.5:1 or higher
  - Dark mode: Should show 10:1 or higher
- [ ] **Headings:** Should show 7.2:1 (light) or 7.5:1 (dark)
- [ ] **Buttons:** Should show 4.2:1 or higher
- [ ] **UI elements:** Should show 3:1 or higher

### Screen Reader Testing (if available)
- [ ] **Headings:** Properly announced
- [ ] **Buttons:** Labeled correctly
- [ ] **Links:** Descriptive text
- [ ] **Form inputs:** Labels associated
- [ ] **Images:** Alt text present

---

## 📱 Responsive Verification

### Desktop (1920x1080)
- [ ] **Layout:** Proper spacing and alignment
- [ ] **Typography:** All text readable
- [ ] **Images:** Proper scaling
- [ ] **Navigation:** Full menu visible
- [ ] **Footer:** Multi-column layout
- [ ] **Cards:** Grid layout (3-4 columns)

### Tablet (768x1024)
- [ ] **Layout:** Adapts to smaller width
- [ ] **Navigation:** May collapse to hamburger
- [ ] **Cards:** 2-3 column grid
- [ ] **Typography:** Still readable
- [ ] **Touch targets:** Minimum 44x44px
- [ ] **Spacing:** Adjusted for tablet

### Mobile (375x667)
- [ ] **Layout:** Single column
- [ ] **Navigation:** Hamburger menu
- [ ] **Buttons:** Full width where appropriate
- [ ] **Forms:** Easy to fill
- [ ] **Typography:** Scales down appropriately
- [ ] **Touch targets:** Easy to tap (44x44px minimum)
- [ ] **Cards:** Single column stack

---

## 🌐 Browser Verification

### Chrome/Edge
- [ ] **Colors:** Render correctly
- [ ] **Fonts:** Load properly
- [ ] **Animations:** Smooth transitions
- [ ] **Focus rings:** Visible
- [ ] **Dark mode:** Switches correctly

### Firefox
- [ ] **Colors:** Match Chrome
- [ ] **CSS Grid:** Works correctly
- [ ] **Backdrop blur:** Supported
- [ ] **Custom properties:** Applied
- [ ] **Animations:** Smooth

### Safari (Desktop)
- [ ] **Colors:** Render correctly
- [ ] **Webkit prefixes:** Working
- [ ] **Smooth scrolling:** Enabled
- [ ] **Focus rings:** Visible
- [ ] **Fonts:** Load correctly

### Safari (iOS)
- [ ] **Touch:** Responsive
- [ ] **Viewport:** Correct scaling
- [ ] **Fonts:** Load correctly
- [ ] **Dark mode:** System preference respected
- [ ] **Animations:** Smooth

---

## 🔍 Specific Page Checks

### Homepage
- [ ] **Hero section:** Cream background, forest green text
- [ ] **Product cards:** 2px borders, hover effects
- [ ] **CTA buttons:** Terracotta accent color
- [ ] **Footer:** Gradient background

### Products Page
- [ ] **Product grid:** Proper spacing
- [ ] **Filter sidebar:** Readable text
- [ ] **Product cards:** Consistent styling
- [ ] **Pagination:** Clear and accessible

### Product Detail Page
- [ ] **Product images:** Proper scaling
- [ ] **Add to cart button:** Primary forest green
- [ ] **Price:** Large, bold, primary color
- [ ] **Description:** 1.7 line-height

### Cart Page
- [ ] **Cart items:** Card styling with borders
- [ ] **Quantity controls:** Clear buttons
- [ ] **Total:** Prominent display
- [ ] **Checkout button:** Accent terracotta

### Checkout Page
- [ ] **Form inputs:** 2px borders, focus rings
- [ ] **Step indicators:** Clear progression
- [ ] **Submit button:** Primary color
- [ ] **Validation:** Error messages visible

### Account Pages
- [ ] **Profile:** Card layout
- [ ] **Orders:** Table or card layout
- [ ] **Addresses:** Card grid
- [ ] **Settings:** Form inputs styled

---

## ✅ Final Checklist

- [ ] **All colors verified** in light and dark modes
- [ ] **Typography** uses correct fonts and sizes
- [ ] **Components** have enhanced styling
- [ ] **Accessibility** features working
- [ ] **Responsive** on all screen sizes
- [ ] **Browser compatibility** confirmed
- [ ] **No console errors** in browser DevTools
- [ ] **PM2 processes** online and stable
- [ ] **Performance** acceptable (page loads < 3s)

---

**Verification Date:** _________________  
**Verified By:** _________________  
**Status:** _________________  
**Issues Found:** _________________

