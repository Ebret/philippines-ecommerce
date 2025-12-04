# Admin Product Management Guide

## Overview

The Admin Product Management interface allows administrators to manage products in the Philippines E-Commerce Platform. This feature provides a comprehensive interface for viewing, editing, and deleting products.

## Access

**URL**: `https://extremelifeherbal.com/admin/products` (Production)  
**Local**: `http://localhost:3001/admin/products` (Development)

**Requirements**:
- Must be logged in with ADMIN or SUPER_ADMIN role
- Test account: `admin@test.com` / `Admin123!`

## Features

### 1. Product Listing
- View all products in a grid layout
- Display product image, name, vendor, price, and stock
- Shows total product count
- Real-time product updates

### 2. Search & Filter
- Search products by name or description
- Real-time filtering as you type
- Case-insensitive search

### 3. Edit Product
- Click the **Edit** button on any product card
- Edit the following fields:
  - **Product Name**: Product title
  - **Description**: Detailed product description
  - **Price (₱)**: Product price in Philippine Pesos
  - **Stock**: Available inventory quantity
- Changes are saved immediately to the database
- Success/error notifications provided

### 4. Delete Product
- Click the **Delete** button on any product card
- Confirmation dialog appears before deletion
- Product is permanently removed from the database
- Success/error notifications provided

## API Endpoints Used

### List Products
```
GET /api/admin/products?limit=100
```
Returns paginated list of products with filtering options.

### Get Product Details
```
GET /api/products/:id
```
Returns full product details including images and variants.

### Update Product
```
PATCH /api/products/:id
Content-Type: application/json

{
  "name": "Updated Product Name",
  "description": "Updated description",
  "price": 150.00,
  "stock": 30
}
```

### Delete Product
```
DELETE /api/products/:id
```
Permanently deletes the product.

## UI Components

### Dialog Components
- **Dialog**: Used for edit product form
- **AlertDialog**: Used for delete confirmation

### Form Components
- **Input**: Text fields for name, price, stock
- **Textarea**: Multi-line field for description
- **Button**: Action buttons (Save, Cancel, Delete)

### Notifications
- **Toast**: Success/error messages using use-toast hook

## File Structure

```
src/app/admin/products/
├── page.tsx                    # Server component with auth
├── products-client.tsx         # Client component with UI
├── product-edit-dialog.tsx     # Edit dialog component
├── product-delete-dialog.tsx   # Delete confirmation dialog
└── __tests__/
    └── admin-products.test.ts  # Unit tests
```

## Testing

Run tests:
```bash
npm test -- src/app/admin/products/__tests__/admin-products.test.ts
```

Test coverage includes:
- Product listing and fetching
- Product editing via PATCH
- Product deletion via DELETE
- Search and filter functionality
- Error handling

## Troubleshooting

### Products not loading
- Check network tab in browser DevTools
- Verify admin authentication
- Check `/api/admin/products` endpoint

### Edit/Delete not working
- Verify ADMIN role in user session
- Check browser console for errors
- Ensure product ID is valid

### Toast notifications not showing
- Verify use-toast hook is imported
- Check if toast function is called correctly
- Verify Dialog/AlertDialog components are rendered

## Future Enhancements

- [ ] Product image upload/management
- [ ] Bulk edit/delete operations
- [ ] Advanced filtering (category, vendor, status)
- [ ] Product creation interface
- [ ] Inventory tracking and alerts
- [ ] Product analytics dashboard

## Support

For issues or questions, contact the development team or check the project documentation.

