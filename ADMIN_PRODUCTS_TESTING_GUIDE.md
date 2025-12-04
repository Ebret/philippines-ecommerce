# Admin Products Testing Guide

## Quick Start

### 1. Access the Admin Products Page
- **URL**: http://localhost:3001/admin/products
- **Login**: admin@test.com / Admin123!
- **Expected**: Product management interface loads successfully

### 2. Test Product Listing
- [ ] Page displays product grid
- [ ] Products show: image, name, vendor, price, stock
- [ ] Product count is displayed
- [ ] Loading state appears initially

### 3. Test Search Functionality
- [ ] Type in search box
- [ ] Products filter by name in real-time
- [ ] Products filter by description in real-time
- [ ] Case-insensitive search works
- [ ] Clear search shows all products

### 4. Test Edit Product
- [ ] Click Edit button on any product
- [ ] Edit dialog opens
- [ ] Form fields are pre-populated with current values
- [ ] Edit product name
- [ ] Edit product description
- [ ] Edit product price
- [ ] Edit product stock
- [ ] Click "Save Changes"
- [ ] Success toast notification appears
- [ ] Dialog closes
- [ ] Product list refreshes with new values
- [ ] Verify changes in database

### 5. Test Delete Product
- [ ] Click Delete button on any product
- [ ] Confirmation dialog appears
- [ ] Dialog shows product name
- [ ] Click "Cancel" - dialog closes without deleting
- [ ] Click Delete button again
- [ ] Click "Delete" in confirmation
- [ ] Success toast notification appears
- [ ] Dialog closes
- [ ] Product is removed from list
- [ ] Verify product is deleted from database

### 6. Test Error Handling
- [ ] Try editing with invalid price (negative)
- [ ] Try editing with invalid stock (negative)
- [ ] Verify error messages appear
- [ ] Network error handling (disconnect network, try edit)
- [ ] Verify error toast appears

### 7. Test UI/UX
- [ ] Dark mode toggle works
- [ ] Light mode toggle works
- [ ] Responsive design on mobile
- [ ] Responsive design on tablet
- [ ] Responsive design on desktop
- [ ] All buttons are clickable
- [ ] All form fields are editable
- [ ] Loading spinner appears during operations

### 8. Test Authentication
- [ ] Logout and try accessing /admin/products
- [ ] Should redirect to login
- [ ] Login with buyer account
- [ ] Should show unauthorized error
- [ ] Login with seller account
- [ ] Should show unauthorized error
- [ ] Login with admin account
- [ ] Should show products page

## Test Data

### Sample Products to Create
```
1. Herbal Tea
   - Price: ₱250.00
   - Stock: 100
   - Description: Premium herbal tea blend

2. Vitamin Supplement
   - Price: ₱500.00
   - Stock: 50
   - Description: Daily vitamin supplement

3. Skincare Product
   - Price: ₱1,200.00
   - Stock: 25
   - Description: Natural skincare cream
```

## Browser DevTools Checks

### Network Tab
- [ ] GET /api/admin/products returns 200
- [ ] PATCH /api/products/:id returns 200
- [ ] DELETE /api/products/:id returns 200
- [ ] No 401/403 errors
- [ ] Response times < 1 second

### Console Tab
- [ ] No JavaScript errors
- [ ] No TypeScript errors
- [ ] No warnings about missing components
- [ ] No hydration mismatches

### Application Tab
- [ ] Session token is stored
- [ ] Theme preference is stored
- [ ] No console errors on page load

## Performance Checks

- [ ] Page loads in < 2 seconds
- [ ] Search filters in < 500ms
- [ ] Edit dialog opens in < 300ms
- [ ] Delete confirmation in < 300ms
- [ ] Product update completes in < 1 second
- [ ] Product deletion completes in < 1 second

## Accessibility Checks

- [ ] Tab navigation works
- [ ] Form labels are associated with inputs
- [ ] Buttons have proper ARIA labels
- [ ] Dialog has proper focus management
- [ ] Keyboard shortcuts work (Escape to close)
- [ ] Screen reader compatible

## Sign-Off Checklist

- [ ] All 8 test categories passed
- [ ] No errors in console
- [ ] Performance acceptable
- [ ] Accessibility compliant
- [ ] Ready for production deployment

**Tested By**: _______________  
**Date**: _______________  
**Status**: ✅ APPROVED / ❌ NEEDS FIXES

