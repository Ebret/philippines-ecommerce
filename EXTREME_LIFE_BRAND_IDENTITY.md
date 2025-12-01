# Extreme Life Herbal - Brand Identity Extraction

**Date:** December 1, 2025  
**Source Repository:** https://github.com/aurexgold/extremelife  
**Analysis Status:** COMPLETE

---

## 🎨 Color Palette

### Primary Colors (Earthy, Organic Palette)

#### Light Mode
```css
--background: 40 33% 96%;        /* #F9F7F2 - Cream/Beige */
--foreground: 140 15% 18%;       /* #27352B - Dark Green/Charcoal */
--primary: 145 24% 23%;          /* #2D4A3E - Deep Forest Green */
--primary-foreground: 40 33% 96%; /* Cream text on primary */
--secondary: 96 24% 65%;         /* #8FBC8F - Sage Green */
--secondary-foreground: 140 15% 18%;
--accent: 28 87% 67%;            /* #F4A460 - Sandy Brown/Orange (Vitality) */
--accent-foreground: 140 15% 18%;
```

#### Dark Mode
```css
--background: 140 15% 10%;       /* Very Dark Green */
--foreground: 40 33% 96%;        /* Cream */
--primary: 145 24% 35%;          /* Lighter Forest Green */
--primary-foreground: 40 33% 96%;
--secondary: 145 20% 20%;        /* Dark Green */
--secondary-foreground: 40 33% 96%;
--accent: 28 87% 67%;            /* Sandy Brown/Orange */
--accent-foreground: 40 33% 96%;
```

### Semantic Colors
```css
--destructive: 0 84% 60%;        /* Red for errors */
--destructive-foreground: 0 0% 98%;
--muted: 40 20% 90%;             /* Light beige */
--muted-foreground: 140 10% 40%; /* Muted green */
--border: 96 24% 85%;            /* Light sage border */
--input: 96 24% 85%;             /* Light sage input */
--ring: 145 24% 23%;             /* Deep forest green focus ring */
```

### Platform-Specific Colors
- **Shopee:** Orange (#FF6600) - `bg-orange-100 text-orange-800`
- **Lazada:** Blue (#0F156D) - `bg-blue-100 text-blue-800`
- **Flash Sale:** Purple - `bg-purple-100 text-purple-800`

---

## 📝 Typography

### Font Families
```css
--font-sans: 'DM Sans', sans-serif;    /* Body text */
--font-serif: 'Libre Baskerville', serif; /* Headings */
```

### Font Weights & Styles
- **Headings (h1-h6):** `font-serif font-bold tracking-tight`
- **Body Text:** `font-sans antialiased`
- **Buttons:** `font-medium`
- **Product Names:** `font-serif text-lg font-bold`
- **Prices:** `text-2xl font-bold text-primary`

### Font Sizes
- **Hero Heading:** `text-4xl sm:text-5xl xl:text-6xl`
- **Section Headings:** `text-3xl font-bold font-serif`
- **Product Card Title:** `text-lg font-bold`
- **Body Text:** `text-base` or `text-lg`
- **Small Text:** `text-sm` or `text-xs`

---

## 🔲 Spacing & Layout

### Border Radius
```css
--radius: 0.75rem;               /* 12px - Default */
--radius-sm: calc(var(--radius) - 4px); /* 8px */
--radius-md: calc(var(--radius) - 2px); /* 10px */
--radius-lg: var(--radius);      /* 12px */
```

### Common Spacing Patterns
- **Container Padding:** `px-4 md:px-8`
- **Section Padding:** `py-12 md:py-24 lg:py-32`
- **Card Padding:** `p-5` or `p-6`
- **Button Padding:** `px-4 py-2` (default), `px-8` (large)
- **Gap Between Elements:** `gap-2`, `gap-4`, `gap-6`, `gap-8`

---

## 🎭 Component Styling

### Buttons
```tsx
// Default Button
className="bg-primary text-primary-foreground border border-primary-border hover-elevate active-elevate-2"

// Rounded Full (Primary Style)
className="rounded-full px-8 text-base h-12"

// Outline Button
className="border shadow-xs active:shadow-none"

// Ghost Button
className="border border-transparent"
```

### Cards
```tsx
// Product Card
className="group overflow-hidden border-border/60 bg-card transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer rounded-xl"

// Image Hover Effect
className="transition-transform duration-500 group-hover:scale-105"
```

### Navbar
```tsx
// Sticky Navbar with Blur
className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"

// Logo
className="flex items-center gap-2 font-serif text-xl font-bold tracking-tight text-primary md:text-2xl"
```

### Hero Section
```tsx
// Hero Container
className="relative overflow-hidden bg-background py-12 md:py-24 lg:py-32"

// Hero Heading
className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl xl:text-6xl mb-6"

// Decorative Blur Elements
className="absolute -bottom-6 -left-6 -z-10 h-64 w-64 rounded-full bg-secondary/30 blur-3xl"
className="absolute -top-6 -right-6 -z-10 h-64 w-64 rounded-full bg-accent/20 blur-3xl"
```

---

## 🌟 Design Patterns

### 1. Rounded Corners
- **Buttons:** `rounded-full` for primary actions
- **Cards:** `rounded-xl` (12px)
- **Badges:** `rounded-full`
- **Images:** `rounded-2xl` for hero images

### 2. Shadows
- **Cards:** `shadow` (default), `hover:shadow-lg` (on hover)
- **Buttons:** `shadow-xs` for outline buttons
- **Product Images:** `shadow-2xl` for hero images

### 3. Transitions
- **Default:** `transition-colors` or `transition-all`
- **Image Zoom:** `transition-transform duration-500`
- **Card Hover:** `hover:-translate-y-1` (lift effect)

### 4. Backdrop Effects
- **Navbar:** `backdrop-blur` with `bg-background/95`
- **Badges:** `bg-background/80 backdrop-blur`

### 5. Gradient Overlays
```tsx
// Image Overlay
className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent mix-blend-multiply"
```

---

## 🏷️ Badge Styles

### Stock Status
- **In Stock:** `bg-green-600 text-white`
- **Low Stock:** `bg-orange-600 text-white` (< 10 items)
- **Out of Stock:** `bg-red-600 text-white`

### Discount Badge
```tsx
className="absolute top-3 left-3 rounded bg-red-600 text-white px-2 py-1 text-xs font-bold shadow-sm"
```

### Category Badge
```tsx
className="absolute top-3 right-3 rounded-full bg-background/80 backdrop-blur px-2 py-1 text-xs font-bold text-primary shadow-sm"
```

---

## 🎯 Key Design Principles

1. **Earthy & Organic:** Use forest green, sage green, cream, and sandy brown colors
2. **Serif Headings:** All headings use Libre Baskerville serif font for elegance
3. **Rounded Corners:** Generous use of rounded corners (12px default)
4. **Hover Effects:** Cards lift up (`-translate-y-1`) and images zoom (`scale-105`)
5. **Backdrop Blur:** Navbar and badges use backdrop blur for modern feel
6. **Filipino Touch:** Mix of English and Filipino text ("para sa Pamilya")
7. **Platform Integration:** Shopee (orange), Lazada (blue) badges
8. **Accessibility:** High contrast text, focus rings, semantic HTML

---

**End of Brand Identity Document**

