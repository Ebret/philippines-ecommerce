# Product Catalog Management System Guide

## Overview
This document describes the complete Product Catalog Management system implementation for the Philippines E-Commerce Platform, including product management, categories, variants, images, and search functionality.

## Architecture

### Core Components

#### 1. Validation Schemas (`src/lib/validations/product.ts`)
- **ProductSchema** - Product creation and validation
- **ProductVariantSchema** - Product variant validation
- **CategorySchema** - Category management validation
- **ProductImageSchema** - Image management validation
- **ProductSearchSchema** - Search and filtering validation
- **ProductTranslationSchema** - Multi-language support
- **CategoryTranslationSchema** - Category translations

#### 2. Utility Functions (`src/lib/product-utils.ts`)
- **generateSlug()** - Generate URL-friendly slugs
- **isSlugUnique()** - Verify slug uniqueness
- **isSkuUnique()** - Verify SKU uniqueness
- **isCategorySlugUnique()** - Verify category slug uniqueness
- **getProductWithRelations()** - Fetch product with all relations
- **getCategoryWithHierarchy()** - Fetch category with hierarchy
- **buildProductSearchQuery()** - Build search queries
- **calculateProductStats()** - Calculate product statistics
- **updateProductStatus()** - Update product status based on stock
- **getLowStockProducts()** - Get low stock products
- **getFeaturedProducts()** - Get featured products

#### 3. API Routes

##### Categories (`/api/categories`)
- **GET** - List all categories with filtering
- **POST** - Create new category (Admin only)
- **GET /[id]** - Get specific category with hierarchy
- **PATCH /[id]** - Update category (Admin only)
- **DELETE /[id]** - Delete category (Admin only)

##### Products (`/api/products`)
- **GET** - List products with pagination
- **POST** - Create new product (Seller/Admin)
- **GET /[id]** - Get product details with relations
- **PATCH /[id]** - Update product (Seller/Admin)
- **DELETE /[id]** - Delete product (Seller/Admin)

##### Product Variants (`/api/products/[id]/variants`)
- **GET** - List product variants
- **POST** - Create variant (Seller/Admin)
- **GET /[variantId]** - Get specific variant
- **PATCH /[variantId]** - Update variant (Seller/Admin)
- **DELETE /[variantId]** - Delete variant (Seller/Admin)

##### Product Images (`/api/products/[id]/images`)
- **GET** - List product images
- **POST** - Add image (Seller/Admin)
- **GET /[imageId]** - Get specific image
- **PATCH /[imageId]** - Update image (Seller/Admin)
- **DELETE /[imageId]** - Delete image (Seller/Admin)

##### Product Search (`/api/products/search`)
- **GET** - Search and filter products with advanced options

## Features

### Product Management
- Create, read, update, delete products
- Product status management (DRAFT, ACTIVE, INACTIVE, OUT_OF_STOCK)
- Product conditions (NEW, USED, REFURBISHED)
- Featured products support
- Digital products support
- Product tags and SEO metadata
- View count tracking
- Sales tracking

### Category Management
- Hierarchical category structure
- Parent-child relationships
- Category translations for multi-language support
- Category images
- Active/inactive status
- Sort order management

### Product Variants
- Multiple variants per product
- SKU management with uniqueness validation
- Barcode support
- Price management (regular, compare, cost)
- Stock quantity tracking
- Low stock threshold alerts
- Variant-specific attributes
- Variant images

### Product Images
- Multiple images per product
- Primary image designation
- Image sorting
- Variant-specific images
- Alt text for accessibility
- URL-based image storage (Cloudinary/S3 ready)

### Search & Filtering
- Full-text search across product names, descriptions, and tags
- Filter by category
- Filter by vendor
- Price range filtering
- Rating-based filtering
- Product condition filtering
- Featured products filtering
- Multiple sort options (newest, price asc/desc, rating, sales)
- Pagination support

### Authorization & Security
- Role-based access control (BUYER, SELLER, ADMIN, SUPER_ADMIN)
- Sellers can only manage their own products
- Admins can manage all products
- Buyers have read-only access
- Vendor verification for seller operations

## Database Schema

### Key Models
- **Product** - Main product entity
- **ProductVariant** - Product variants with pricing and stock
- **ProductImage** - Product images with sorting
- **ProductTranslation** - Multi-language product data
- **Category** - Product categories with hierarchy
- **CategoryTranslation** - Multi-language category data

## API Usage Examples

### Create a Product
```bash
POST /api/products
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Samsung Galaxy S21",
  "slug": "samsung-galaxy-s21",
  "description": "Latest Samsung flagship phone",
  "categoryId": "cat-123",
  "status": "ACTIVE",
  "brand": "Samsung",
  "model": "S21",
  "condition": "NEW"
}
```

### Create a Product Variant
```bash
POST /api/products/prod-123/variants
Content-Type: application/json
Authorization: Bearer <token>

{
  "sku": "SGS21-128GB-BLACK",
  "name": "128GB Black",
  "price": 49999.99,
  "comparePrice": 59999.99,
  "costPrice": 30000,
  "stockQuantity": 100,
  "lowStockThreshold": 10
}
```

### Add Product Image
```bash
POST /api/products/prod-123/images
Content-Type: application/json
Authorization: Bearer <token>

{
  "url": "https://cdn.example.com/product-1.jpg",
  "altText": "Samsung Galaxy S21 Front View",
  "isPrimary": true,
  "sortOrder": 0
}
```

### Search Products
```bash
GET /api/products/search?query=laptop&minPrice=20000&maxPrice=100000&sortBy=price_asc&page=1&limit=20
```

### Get Product Details
```bash
GET /api/products/prod-123
```

### Update Product
```bash
PATCH /api/products/prod-123
Content-Type: application/json
Authorization: Bearer <token>

{
  "status": "ACTIVE",
  "isFeatured": true,
  "description": "Updated description"
}
```

### Delete Product
```bash
DELETE /api/products/prod-123
Authorization: Bearer <token>
```

## Testing

### Test Coverage
- 36 comprehensive tests for product catalog
- Slug generation and validation
- Product validation with all fields
- Variant validation and constraints
- Category validation and hierarchy
- Image validation
- Search and filtering logic
- Authorization checks
- Data integrity validation

### Running Tests
```bash
npm test                    # Run all tests
npm test -- --run          # Run tests once
npm test -- products.test  # Run specific test file
npm run test:ui            # Run tests with UI
```

### Test Results
- **Total Tests**: 36
- **Pass Rate**: 100%
- **Coverage**: All product management functionality

## Security Features

### Input Validation
- Zod schema validation for all inputs
- Email format validation
- URL validation for images
- Price validation (positive numbers)
- Stock quantity validation (non-negative)
- Rating validation (0-5 range)

### Authorization
- Role-based access control
- Seller can only manage own products
- Admin can manage all products
- Vendor verification for seller operations

### Data Protection
- Unique slug enforcement
- Unique SKU enforcement
- Circular hierarchy prevention
- Primary image management
- Soft delete support (via status)

## Performance Considerations

### Optimization Strategies
- Indexed database queries
- Pagination for large result sets
- Efficient search query building
- Relation loading optimization
- View count incremental updates

### Database Indexes
- Product slug (unique)
- Product vendor ID
- Product category ID
- Product status
- Product featured flag
- Variant SKU (unique)
- Category slug (unique)

## Multi-Language Support

### Translation Models
- ProductTranslation - Product name and description in multiple languages
- CategoryTranslation - Category name and description in multiple languages

### Supported Languages
- English (en)
- Filipino (fil)
- Cebuano (ceb)
- Ilocano (ilo)

## Future Enhancements

1. **Advanced Search**
   - Elasticsearch integration
   - Faceted search
   - Search suggestions
   - Typo tolerance

2. **Inventory Management**
   - Warehouse locations
   - Stock movements tracking
   - Inventory forecasting
   - Automated reorder points

3. **Product Analytics**
   - View analytics
   - Conversion tracking
   - Popular products
   - Trending products

4. **Bulk Operations**
   - Bulk product import/export
   - Bulk price updates
   - Bulk status changes
   - CSV import support

5. **Product Recommendations**
   - Related products
   - Frequently bought together
   - Personalized recommendations
   - AI-powered suggestions

## Troubleshooting

### Common Issues

1. **"Product slug already exists"**
   - Slug must be unique
   - Try a different slug
   - System auto-generates from name

2. **"SKU already exists"**
   - SKU must be unique across all variants
   - Check existing variants
   - Use different SKU

3. **"Category not found"**
   - Verify category ID exists
   - Check category is active
   - Ensure proper permissions

4. **"Unauthorized"**
   - Check user role
   - Verify vendor ownership
   - Ensure valid session

5. **"Cannot delete category"**
   - Category has subcategories
   - Category has products
   - Move products first

## Support

For issues or questions about the product catalog system, please refer to:
- Prisma Documentation: https://www.prisma.io/docs
- Next.js Documentation: https://nextjs.org/docs
- Zod Validation: https://zod.dev

