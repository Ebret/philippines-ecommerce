# Admin Products Feature - Testing Guide

## Test Accounts

```
Admin Account:
Email: admin@test.com
Password: Admin123!
Role: ADMIN
```

---

## Unit Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test Suite
```bash
npm test product-image-upload
npm test products
```

### Test Coverage
```bash
npm test -- --coverage
```

---

## Manual Testing Checklist

### 1. Authentication & Access
- [ ] Navigate to `/admin/products` without login → redirects to login
- [ ] Login with admin@test.com / Admin123!
- [ ] Access `/admin/products` → page loads successfully
- [ ] Logout → redirects to login

### 2. Product Grid Display
- [ ] Products load and display in grid
- [ ] Product images display correctly
- [ ] Product names, prices, stock visible
- [ ] Vendor names display correctly
- [ ] Grid is responsive (desktop, tablet, mobile)

### 3. Search Functionality
- [ ] Search by product name works
- [ ] Search by description works
- [ ] Search is case-insensitive
- [ ] Clear search shows all products
- [ ] Search results update in real-time

### 4. Edit Product Dialog
- [ ] Click "Edit" button opens dialog
- [ ] Dialog shows current product data
- [ ] Can edit product name
- [ ] Can edit product description
- [ ] Can edit product price
- [ ] Can edit product stock
- [ ] Cancel button closes dialog without saving
- [ ] Save button updates product

### 5. Image Upload
- [ ] Click "Select Image" opens file picker
- [ ] Can select image file
- [ ] Image preview displays
- [ ] Can add alt text
- [ ] Upload button uploads image
- [ ] Success toast appears
- [ ] Image appears in grid after upload
- [ ] Can upload multiple images

### 6. Image Management
- [ ] Current images display in grid
- [ ] Hover shows delete and star buttons
- [ ] Click star sets image as primary
- [ ] Primary image shows star indicator
- [ ] Click X deletes image
- [ ] Confirmation appears before delete
- [ ] Image removed from grid after delete
- [ ] Success toast appears

### 7. Delete Product Dialog
- [ ] Click "Delete" button opens dialog
- [ ] Dialog shows confirmation message
- [ ] Cancel button closes dialog
- [ ] Confirm button deletes product
- [ ] Product removed from grid
- [ ] Success toast appears

### 8. Toast Notifications
- [ ] Success toast appears on product update
- [ ] Success toast appears on image upload
- [ ] Success toast appears on image delete
- [ ] Error toast appears on failed operations
- [ ] Toast auto-dismisses after 3 seconds
- [ ] Toast can be manually dismissed

### 9. Loading States
- [ ] Loading spinner shows while fetching products
- [ ] Loading spinner shows during upload
- [ ] Loading spinner shows during delete
- [ ] Buttons disabled during operations
- [ ] Loading states clear after completion

### 10. Error Handling
- [ ] Invalid image file shows error
- [ ] Image > 5MB shows error
- [ ] Network error shows error toast
- [ ] API error shows error toast
- [ ] Error messages are clear and helpful

---

## Mobile Responsiveness Testing

### Desktop (1920px)
```bash
DevTools → Toggle device toolbar (Ctrl+Shift+M)
```
- [ ] 3-column product grid
- [ ] All buttons visible
- [ ] Full upload interface
- [ ] No horizontal scroll

### Tablet (768px)
```bash
DevTools → Select iPad
```
- [ ] 2-column product grid
- [ ] Responsive layout
- [ ] Touch-friendly buttons
- [ ] No horizontal scroll

### Mobile (375px)
```bash
DevTools → Select iPhone 12
```
- [ ] 2-column product grid
- [ ] Stacked upload interface
- [ ] Large touch targets
- [ ] No horizontal scroll
- [ ] All features accessible

---

## Dark Mode Testing

### Enable Dark Mode
1. Open DevTools (F12)
2. Click theme toggle in header
3. Select "Dark"

### Verify
- [ ] Background is dark
- [ ] Text is readable
- [ ] Images display correctly
- [ ] Buttons are visible
- [ ] Form inputs are visible
- [ ] Dialogs have proper contrast

---

## Performance Testing

### Load Time
```bash
DevTools → Network tab
```
- [ ] Page loads in < 2 seconds
- [ ] Images load progressively
- [ ] No console errors

### Memory Usage
```bash
DevTools → Memory tab
```
- [ ] Memory usage stable
- [ ] No memory leaks
- [ ] Smooth scrolling

---

## Browser Compatibility

Test on:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab through all controls
- [ ] Enter activates buttons
- [ ] Escape closes dialogs
- [ ] Focus visible on all elements

### Screen Reader
- [ ] Images have alt text
- [ ] Buttons have labels
- [ ] Form fields have labels
- [ ] Dialogs announced properly

---

## Test Data

### Sample Products
```
Product 1: Herbal Tea - ₱299.99 - Stock: 50
Product 2: Supplement - ₱599.99 - Stock: 25
Product 3: Skincare - ₱899.99 - Stock: 10
```

### Sample Images
- Use 1-5 images per product
- Mix of different sizes
- Different formats (JPG, PNG)

---

## Regression Testing

After each deployment:
1. Run all unit tests
2. Complete manual testing checklist
3. Test on multiple browsers
4. Test on mobile devices
5. Verify dark mode
6. Check accessibility

---

## Known Issues

None currently documented.

---

## Related Documentation

- [Admin Products Feature Guide](./ADMIN_PRODUCTS_FEATURE_GUIDE.md)
- [Image Upload Guide](./ADMIN_PRODUCTS_IMAGE_UPLOAD_GUIDE.md)

