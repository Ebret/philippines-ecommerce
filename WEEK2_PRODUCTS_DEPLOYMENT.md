# Week 2: Products Page Development - Deployment Guide

## Overview
This guide covers the deployment of the Products Listing and Product Detail pages for the Philippines E-Commerce Platform.

## What's New

### 1. Products Listing Page (`/products`)
- **Location**: `src/app/products/page.tsx`
- **Features**:
  - Grid layout with responsive design (1-3 columns)
  - Product cards with images, prices, ratings
  - Category filtering
  - Search functionality
  - Sort options (newest, price, popularity, rating)
  - Pagination support
  - Green theme consistent with homepage

### 2. Product Detail Page (`/products/[slug]`)
- **Location**: `src/app/products/[slug]/page.tsx`
- **Features**:
  - Detailed product information
  - Image gallery with multiple images
  - Product specifications
  - Customer reviews section
  - Add to Cart and Buy Now buttons
  - Quantity selector
  - Vendor information
  - Breadcrumb navigation

### 3. Reusable Components Used
- `ProductCard`: Individual product card component
- `ProductGrid`: Grid layout for products
- `ProductDetail`: Detailed product view
- `ProductImageGallery`: Image gallery for product images
- `ReviewList`: Display customer reviews
- `ReviewForm`: Form for adding reviews

## Local Testing

### 1. Install Dependencies
```bash
cd philippines-ecommerce
npm install
```

### 2. Seed Test Data
```bash
npm run seed:products
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Test URLs
- Products Listing: http://localhost:3000/products
- Product Detail: http://localhost:3000/products/herbal-tea
- Homepage: http://localhost:3000

### 5. Run Tests
```bash
npm run test -- products-page.test.tsx
npm run test -- product-detail-page.test.tsx
```

## Deployment Steps

### Step 1: Build Locally
```bash
npm run build
```

### Step 2: Verify Build Success
```bash
npm run start
```

### Step 3: Deploy to VPS

#### Option A: Using SCP (Recommended)
```bash
# Copy updated files to VPS
scp -r src/app/products root@109.205.181.119:/var/www/html/ecom/app/src/app/
scp -r src/components/products root@109.205.181.119:/var/www/html/ecom/app/src/components/
```

#### Option B: Using Git
```bash
# On VPS
cd /var/www/html/ecom/app
git pull origin main
```

### Step 4: Restart Application
```bash
ssh root@109.205.181.119 "cd /var/www/html/ecom/app && pm2 restart all && sleep 3 && pm2 status"
```

### Step 5: Verify Deployment
```bash
# Check HTTPS response
curl -I https://extremelifeherbal.com/products

# Expected: HTTP/2 200
```

## File Structure

```
philippines-ecommerce/
├── src/
│   ├── app/
│   │   ├── products/
│   │   │   ├── page.tsx              # Products listing page
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # Product detail page
│   │   └── page.tsx                  # Homepage (updated with links)
│   ├── components/
│   │   └── products/
│   │       ├── product-card.tsx      # Product card component
│   │       ├── product-grid.tsx      # Product grid component
│   │       ├── product-detail.tsx    # Product detail component
│   │       └── product-image-gallery.tsx
│   └── __tests__/
│       ├── products-page.test.tsx    # Products page tests
│       └── product-detail-page.test.tsx
├── scripts/
│   └── seed-products.ts              # Seed test data
└── WEEK2_PRODUCTS_DEPLOYMENT.md      # This file
```

## API Endpoints Used

### GET /api/products
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 20)
  - `categoryId`: Filter by category
  - `search`: Search query
  - `isFeatured`: Filter featured products

### GET /api/products/search
- **Query Parameters**:
  - `q`: Search query

### GET /api/categories
- Returns all product categories

## Testing Checklist

- [ ] Products page loads without errors
- [ ] Product cards display correctly
- [ ] Search functionality works
- [ ] Category filtering works
- [ ] Sorting options work
- [ ] Pagination works
- [ ] Product detail page loads
- [ ] Product images display
- [ ] Add to Cart button visible
- [ ] Reviews section displays
- [ ] Navigation links work
- [ ] Responsive design works on mobile
- [ ] HTTPS works correctly
- [ ] Green lock icon shows

## Troubleshooting

### Products Not Loading
1. Check API endpoint: `curl https://extremelifeherbal.com/api/products`
2. Verify database connection
3. Check PM2 logs: `pm2 logs`

### Images Not Displaying
1. Verify image URLs in database
2. Check placeholder image URL
3. Verify image permissions

### Build Errors
1. Clear node_modules: `rm -rf node_modules && npm install`
2. Clear Next.js cache: `rm -rf .next`
3. Run build again: `npm run build`

## Performance Optimization

- Product images use Next.js Image component for optimization
- Pagination limits API responses to 12 items per page
- Category data cached on component mount
- Responsive grid layout (1-3 columns)

## Next Steps (Week 3)

- Implement shopping cart functionality
- Add product variants (sizes, colors)
- Implement wishlist feature
- Add product comparison
- Implement advanced filtering
- Add product reviews and ratings

## Support

For issues or questions, check:
1. PM2 logs: `pm2 logs`
2. Nginx logs: `/var/log/nginx/error.log`
3. Application logs: `/var/www/html/ecom/app/logs/`

