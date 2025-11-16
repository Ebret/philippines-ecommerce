# Phase 22: Component Enhancement Specifications

## 1️⃣ HOMEPAGE HERO SECTION

### Current State
- Basic gradient background (green-500 to green-700)
- Simple text layout
- Basic button styling
- No visual hierarchy

### Proposed Enhancements
```
Layout:
- Full-width hero with background image/video
- Overlay gradient for text readability
- Centered content with max-width container
- Responsive padding (py-16 md:py-32)

Typography:
- H1: 32px md:48px, bold, white
- Subtitle: 18px md:24px, regular, white/gray-100
- CTA: 16px, bold, white

Colors:
- Background: Gradient overlay (primary-900/80)
- Text: White (#ffffff)
- Button: secondary-500 with hover effect

Components:
- Hero image/video background
- Trust signals section below
- Multiple CTA buttons
- Smooth scroll animation
```

### Files to Modify
- `src/app/page.tsx` - Main homepage
- Create: `src/components/hero/hero-section.tsx`

---

## 2️⃣ PRODUCT CARDS

### Current State
- Basic border and padding
- Simple hover shadow
- Minimal information display
- No visual feedback

### Proposed Enhancements
```
Layout:
- Image container (aspect-square)
- Product info section
- Price and discount display
- Action buttons

Image:
- Hover zoom effect (scale-105)
- Overlay on hover
- Placeholder for missing images
- Responsive sizing

Content:
- Product name (2-line truncate)
- Rating stars (1-5)
- Price with discount badge
- Verified seller badge
- Stock status indicator

Buttons:
- "Add to Cart" with loading state
- "Quick View" link
- Wishlist toggle
- Share button

Colors:
- Card: white dark:gray-800
- Hover: shadow-lg
- Price: primary-600
- Discount: secondary-500
```

### Files to Modify
- `src/components/product/product-card.tsx`

---

## 3️⃣ NAVIGATION HEADER

### Current State
- Basic gray background
- Simple text navigation
- No mobile menu
- No search functionality

### Proposed Enhancements
```
Layout:
- Sticky positioning
- Flex layout with logo, nav, actions
- Mobile hamburger menu
- Search bar integration

Logo:
- Brand logo/text
- Link to homepage
- Responsive sizing

Navigation:
- Horizontal menu (desktop)
- Dropdown menus for categories
- Mobile hamburger menu
- Active link highlighting

Search:
- Search input with icon
- Autocomplete suggestions
- Mobile-optimized search

Actions:
- User menu dropdown
- Cart icon with badge
- Notifications icon
- Theme toggle

Colors:
- Background: white dark:gray-900
- Text: gray-900 dark:white
- Hover: gray-100 dark:gray-800
- Active: primary-600
```

### Files to Modify
- `src/components/layout/header.tsx`

---

## 4️⃣ VENDOR LIVE STREAMS

### Current State
- Functional but basic styling
- Simple status badges
- Basic button styling
- Limited visual feedback

### Proposed Enhancements
```
Layout:
- Grid layout (1 md:2 lg:3 columns)
- Card-based design
- Thumbnail preview
- Status overlay

Card:
- Thumbnail image with play icon
- Title and description
- Viewer count badge
- Message count badge
- Status indicator (LIVE/SCHEDULED/ENDED)

Status Indicators:
- LIVE: Red badge with pulse animation
- SCHEDULED: Yellow badge with clock icon
- ENDED: Gray badge

Buttons:
- Start/End buttons (conditional)
- View button (primary)
- Edit button (secondary)
- Delete button (destructive)

Colors:
- Card: white dark:gray-800
- LIVE: error-500 with pulse
- SCHEDULED: warning-500
- ENDED: neutral-500
- Buttons: primary-600, secondary-500, error-600
```

### Files to Modify
- `src/app/vendor/live/vendor-live-streams-client.tsx`

---

## 5️⃣ PRODUCT DETAIL PAGE

### Current State
- Basic layout
- Simple image display
- Minimal product information
- Basic specifications

### Proposed Enhancements
```
Layout:
- Two-column layout (image + info)
- Image gallery on left
- Product info on right
- Related products below
- Reviews section below

Image Gallery:
- Main image display
- Thumbnail carousel
- Zoom on hover
- Lightbox view

Product Info:
- Title (H1)
- Rating and reviews count
- Price with discount
- Stock status
- Seller information
- Product specifications
- Description with tabs

CTA Section:
- Quantity selector
- Add to cart button
- Wishlist button
- Share buttons

Related Products:
- 4-column grid
- Similar products
- Recommendations

Reviews:
- Rating distribution
- Review list
- Write review button
```

### Files to Modify
- `src/app/products/[slug]/page.tsx`
- Create: `src/components/product/product-image-gallery.tsx`

