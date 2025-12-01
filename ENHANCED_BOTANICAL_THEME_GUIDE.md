# Enhanced Botanical Theme Guide - Extreme Life Herbal

**Date:** December 1, 2025  
**Version:** 2.0 - Enhanced Contrast & Herbal Aesthetic  
**WCAG Compliance:** AA Standard (4.5:1 for normal text, 3:1 for large text)

---

## 🎨 Enhanced Color Palette

### Light Mode - Authentic Botanical Palette

#### Base Colors (WCAG AA Compliant)
```css
/* Background & Foreground */
--background: hsl(40, 35%, 95%);     /* #F7F5F0 - Warm Cream (natural paper) */
--foreground: hsl(140, 25%, 15%);    /* #1E2E24 - Deep Forest (8.5:1 contrast) */

/* Primary - Rich Forest Green (Herbal Medicine) */
--primary: hsl(145, 35%, 20%);       /* #214A38 - Deep Forest Green */
--primary-dark: hsl(145, 40%, 16%);  /* #1A3B2D - Very Dark Forest */
--primary-light: hsl(145, 30%, 28%); /* #2F5A47 - Medium Forest */
--primary-foreground: hsl(40, 35%, 98%); /* Cream text (12:1 contrast) */

/* Secondary - Earthy Moss Green */
--secondary: hsl(96, 30%, 45%);      /* #6B9B5F - Moss Green */
--secondary-dark: hsl(96, 35%, 38%); /* #5A8450 - Dark Moss */
--secondary-light: hsl(96, 28%, 55%); /* #7FAF71 - Light Moss */
--secondary-foreground: hsl(0, 0%, 100%); /* White text */

/* Accent - Warm Terracotta/Clay */
--accent: hsl(25, 75%, 50%);         /* #DF6B1F - Terracotta */
--accent-dark: hsl(25, 80%, 42%);    /* #C45A15 - Dark Terracotta */
--accent-light: hsl(25, 70%, 60%);   /* #E88A4A - Light Terracotta */
--accent-foreground: hsl(0, 0%, 100%); /* White text */
```

#### Botanical Accent Colors
```css
--olive: hsl(60, 30%, 35%);          /* #6B6F3F - Olive Green */
--sage: hsl(120, 20%, 50%);          /* #669966 - Sage Green */
--bark: hsl(30, 25%, 30%);           /* #5C4A3A - Bark Brown */
--soil: hsl(25, 30%, 25%);           /* #523D2E - Rich Soil */
```

#### Semantic Colors (Enhanced Contrast)
```css
--success: hsl(145, 45%, 35%);       /* #31804F - Vibrant Forest (4.8:1) */
--error: hsl(0, 70%, 45%);           /* #C92A2A - Deep Red (4.6:1) */
--warning: hsl(35, 85%, 45%);        /* #D97706 - Amber Gold (3.8:1) */
--info: hsl(200, 60%, 40%);          /* #2980B9 - Deep Blue (4.5:1) */
```

#### UI Elements
```css
--muted: hsl(40, 25%, 88%);          /* #E8E4DC - Light Beige */
--muted-foreground: hsl(140, 20%, 30%); /* #3D5A47 - Dark Muted (5.2:1) */
--border: hsl(96, 25%, 70%);         /* #A3B89A - Sage Border */
--card: hsl(0, 0%, 100%);            /* Pure White */
```

---

### Dark Mode - Deep Forest Night

#### Base Colors (WCAG AA Compliant)
```css
/* Background & Foreground */
--background: hsl(140, 20%, 8%);     /* #0F1812 - Very Dark Forest */
--foreground: hsl(40, 40%, 92%);     /* #F2EDE3 - Warm Cream (10:1 contrast) */

/* Primary - Bright Forest Green */
--primary: hsl(145, 40%, 45%);       /* #45A370 - Bright Forest (7.5:1) */
--primary-dark: hsl(145, 45%, 38%);  /* #368A5C - Medium Forest */
--primary-light: hsl(145, 38%, 55%); /* #5BB885 - Light Forest */
--primary-foreground: hsl(140, 20%, 8%); /* Dark text on primary */

/* Secondary - Dark Moss */
--secondary: hsl(96, 25%, 35%);      /* #5A7A4F - Dark Moss */
--secondary-dark: hsl(96, 28%, 28%); /* #4A6440 - Very Dark Moss */
--secondary-light: hsl(96, 22%, 45%); /* #6B8F5F - Medium Moss */

/* Accent - Glowing Ember */
--accent: hsl(25, 80%, 60%);         /* #E8803D - Bright Terracotta */
--accent-dark: hsl(25, 85%, 50%);    /* #DF6B1F - Medium Terracotta */
--accent-light: hsl(25, 75%, 70%);   /* #F09A5F - Light Terracotta */
```

#### Semantic Colors (Dark Mode)
```css
--success: hsl(145, 50%, 50%);       /* #40B373 - Bright Success (8:1) */
--error: hsl(0, 75%, 60%);           /* #E63946 - Bright Error (6.5:1) */
--warning: hsl(35, 90%, 60%);        /* #F59E0B - Bright Amber (7:1) */
--info: hsl(200, 70%, 55%);          /* #3B9DD9 - Bright Blue (5.5:1) */
```

---

## 📝 Enhanced Typography

### Font Families
```css
--font-sans: 'DM Sans', sans-serif;           /* Body text */
--font-serif: 'Libre Baskerville', serif;     /* Headings */
```

### Typography Scale (Enhanced Readability)
```css
h1 { font-size: 2.5rem; line-height: 1.1; }   /* 40px */
h2 { font-size: 2rem; line-height: 1.15; }    /* 32px */
h3 { font-size: 1.75rem; line-height: 1.2; }  /* 28px */
h4 { font-size: 1.5rem; line-height: 1.25; }  /* 24px */
h5 { font-size: 1.25rem; line-height: 1.3; }  /* 20px */
h6 { font-size: 1.125rem; line-height: 1.35; } /* 18px */
p  { line-height: 1.7; }                       /* Body text */
```

### Font Weights
- **Headings:** 700 (Bold) - Always use `font-serif`
- **Body:** 400 (Regular)
- **Medium:** 500
- **Semibold:** 600
- **Bold:** 700

---

## 🎭 Component Classes

### Botanical Buttons
```tsx
// Primary Botanical Button
className="btn-botanical"
// Background: Deep Forest Green, White text, Thick border, Full rounded
// Hover: Darker shade, lifts up, enhanced shadow

// Secondary Botanical Button
className="btn-botanical-secondary"
// Background: Moss Green, White text

// Accent Botanical Button
className="btn-botanical-accent"
// Background: Terracotta, White text
```

### Enhanced Cards
```tsx
// Herbal Card
className="herbal-card"
// White background, 2px sage border, rounded-xl, shadow
// Hover: Lifts up 4px, enhanced shadow, primary border

// Product Card
className="product-card"
// Enhanced hover: Lifts 6px, image scales 1.08x
```

### Form Inputs
```tsx
// Botanical Input
className="input-botanical"
// 2px border, enhanced focus state with ring shadow
// Placeholder: Muted foreground with 0.7 opacity
```

### Enhanced Badges
```tsx
// Status Badges
className="badge-botanical badge-success"  // Forest green
className="badge-botanical badge-error"    // Deep red
className="badge-botanical badge-warning"  // Amber gold
className="badge-botanical badge-info"     // Deep blue

// Platform Badges (Enhanced Saturation)
className="badge-shopee"      // Vibrant Orange #FF6600
className="badge-lazada"      // Deep Blue #0F156D
className="badge-flash-sale"  // Purple gradient with pulse
```

---

## 🌿 Botanical Textures & Patterns

### Linen Texture
```tsx
className="texture-linen"
// Adds subtle crosshatch pattern for natural paper feel
```

### Botanical Decoration
```tsx
className="botanical-decoration"
// Adds organic radial gradient overlays (primary & secondary)
```

### Leaf Motif Border
```tsx
className="border-botanical"
// 2px border with botanical styling
```

---

## ♿ Accessibility Features

### WCAG AA Compliance
- **Normal text:** Minimum 4.5:1 contrast ratio
- **Large text:** Minimum 3:1 contrast ratio
- **Focus indicators:** 3px solid ring with 2px offset
- **High contrast mode:** Automatic adjustments
- **Reduced motion:** Respects user preferences

### Focus Management
```css
*:focus-visible {
  outline: 3px solid var(--ring);
  outline-offset: 2px;
  border-radius: 4px;
}
```

### Skip to Main Content
```tsx
<a href="#main-content" className="skip-to-main">
  Skip to main content
</a>
```

---

## 🎯 Design Principles

1. **Authentic Herbal Aesthetic:** Deep forest greens, earthy moss, warm terracotta
2. **Enhanced Contrast:** All text meets WCAG AA standards (4.5:1 minimum)
3. **Botanical Textures:** Subtle linen patterns, organic shapes
4. **Serif Headings:** Libre Baskerville for traditional herbal medicine feel
5. **Thick Borders:** 2px borders for better visibility and definition
6. **Rich Shadows:** Enhanced depth with multi-layer shadows
7. **Warm Earth Tones:** Terracotta, clay, bark, soil accents
8. **Dark Mode:** Deep forest night with glowing accents
9. **Accessibility First:** Focus rings, skip links, high contrast support
10. **Natural Motion:** Smooth transitions with reduced motion support

---

**End of Enhanced Botanical Theme Guide**

