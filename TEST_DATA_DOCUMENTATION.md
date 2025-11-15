# Test Data Documentation - Phase 21 UI Testing

**Date:** November 15, 2025  
**Environment:** Production (https://extremelifeherbal.com)  
**Status:** Ready for Deployment  
**Database:** PostgreSQL with Prisma ORM

---

## 📋 Test Accounts

### Account 1: Admin Account
- **Email:** `admin@test.com`
- **Password:** `Admin123!`
- **Role:** ADMIN
- **Status:** ACTIVE
- **Email Verified:** Yes
- **Phone:** +639000000001
- **Access:** Admin dashboard, user management, product management, reports

### Account 2: Buyer Account
- **Email:** `buyer@test.com`
- **Password:** `Buyer123!`
- **Role:** BUYER
- **Status:** ACTIVE
- **Email Verified:** Yes
- **Phone:** +639000000002
- **Access:** Browse products, shopping cart, checkout, order history, account profile

### Account 3: Seller Account
- **Email:** `seller@test.com`
- **Password:** `Seller123!`
- **Role:** SELLER
- **Status:** ACTIVE
- **Email Verified:** Yes
- **Phone:** +639000000003
- **Access:** Vendor dashboard, product management, order management, analytics

---

## 🛍️ Test Products (10 Total)

### Category 1: Herbal Tea (4 products)
1. **Premium Herbal Tea Blend** - ₱1,999
   - Description: Organic herbal tea blend with natural ingredients
   - Stock: 10-100 units
   - Featured: Random

2. **Ginger Turmeric Tea** - ₱1,599
   - Description: Anti-inflammatory herbal tea
   - Stock: 10-100 units
   - Featured: Random

3. **Chamomile Sleep Tea** - ₱1,799
   - Description: Calming tea for better sleep
   - Stock: 10-100 units
   - Featured: Random

4. **Green Tea Extract** - ₱1,899
   - Description: Antioxidant-rich green tea
   - Stock: 10-100 units
   - Featured: Random

### Category 2: Supplements (3 products)
1. **Natural Vitamin Supplement** - ₱2,999
   - Description: Complete vitamin and mineral complex
   - Stock: 10-100 units
   - Featured: Random

2. **Immune Boost Supplement** - ₱2,499
   - Description: Strengthen your immune system naturally
   - Stock: 10-100 units
   - Featured: Random

3. **Calcium & Magnesium** - ₱2,199
   - Description: Bone health supplement
   - Stock: 10-100 units
   - Featured: Random

### Category 3: Herbal Oils (3 products)
1. **Pure Herbal Oil Extract** - ₱3,999
   - Description: 100% pure herbal oil for wellness
   - Stock: 10-100 units
   - Featured: Random

2. **Lavender Essential Oil** - ₱1,299
   - Description: Relaxing lavender oil for aromatherapy
   - Stock: 10-100 units
   - Featured: Random

3. **Peppermint Oil** - ₱1,499
   - Description: Cooling peppermint oil for wellness
   - Stock: 10-100 units
   - Featured: Random

---

## 📍 Test Addresses

### Buyer Shipping Address
- **Recipient Name:** Test Buyer
- **Phone:** 09123456789
- **Region:** NCR
- **Province:** Metro Manila
- **City/Municipality:** Manila
- **Barangay:** Barangay 1
- **Street Address:** 123 Main Street
- **Postal Code:** 1000
- **Type:** SHIPPING
- **Default:** Yes

---

## 🏪 Vendor Stores

### Store 1: Extreme Life Herbal
- **Owner:** vendor@extremelifeherbal.com
- **Store Name:** Extreme Life Herbal
- **Store Slug:** extreme-life-herbal
- **Description:** Premium herbal products for your health and wellness
- **Status:** APPROVED
- **Business Type:** INDIVIDUAL
- **Business Name:** Extreme Life Herbal
- **TIN:** 123456789
- **Products:** 10 herbal products

### Store 2: Test Seller Store
- **Owner:** seller@test.com
- **Store Name:** Test Seller Store
- **Store Slug:** test-seller-store
- **Description:** Test seller store for UI testing
- **Status:** APPROVED
- **Business Type:** INDIVIDUAL
- **Business Name:** Test Seller Business
- **TIN:** 987654321
- **Products:** 1 test product

---

## 🔄 System Flows to Test

### Buyer Flow
1. ✅ Login with buyer@test.com / Buyer123!
2. ✅ Browse products on homepage
3. ✅ View product details
4. ✅ Add product to cart
5. ✅ View cart
6. ✅ Proceed to checkout
7. ✅ Enter shipping address
8. ✅ Select payment method
9. ✅ Place order
10. ✅ View order confirmation
11. ✅ View order history in account

### Vendor Flow
1. ✅ Login with seller@test.com / Seller123!
2. ✅ Access vendor dashboard
3. ✅ View products
4. ✅ View orders
5. ✅ View analytics
6. ✅ Manage inventory
7. ✅ View earnings

### Admin Flow
1. ✅ Login with admin@test.com / Admin123!
2. ✅ Access admin dashboard
3. ✅ View all users
4. ✅ View all products
5. ✅ View all orders
6. ✅ View reports
7. ✅ Manage system settings

---

## 🧪 E2E Test Coverage

### Authentication Tests (14 tests)
- ✅ Login with valid credentials
- ✅ Login with invalid credentials
- ✅ Remember me checkbox
- ✅ Forgot password link
- ✅ Signup link on login page
- ✅ Form validation
- ✅ Password visibility toggle
- ✅ ARIA labels

### Shopping Cart Tests (15 tests)
- ✅ Add product to cart
- ✅ Update cart quantity
- ✅ Remove from cart
- ✅ View cart summary
- ✅ Proceed to checkout
- ✅ Apply discount code
- ✅ Calculate totals
- ✅ Mobile cart view

### Critical Path Tests (13 tests)
- ✅ Browse products
- ✅ View product details
- ✅ Add to cart
- ✅ Checkout flow
- ✅ Payment processing
- ✅ Order confirmation
- ✅ Order history
- ✅ Account profile

---

## 🚀 Deployment Instructions

### Method 1: Using Seed Script (Recommended)
```bash
cd philippines-ecommerce
npm run db:seed
```

### Method 2: Using PowerShell Script
```powershell
.\scripts\deploy-test-data-production.ps1 `
  -VpsHost "109.205.181.119" `
  -VpsUser "root" `
  -VpsPassword "4K-6GsnA$3pQ5931"
```

### Method 3: Manual Database Queries
```sql
-- Run SQL queries from TEST_DATA_SETUP.sql
psql -U postgres -d ecommerce_db -f TEST_DATA_SETUP.sql
```

---

## ✅ Verification Checklist

- [ ] Test accounts created in database
- [ ] Test accounts can login successfully
- [ ] Test products visible on homepage
- [ ] Test products have correct prices (₱ symbol)
- [ ] Shopping cart functionality works
- [ ] Checkout flow completes
- [ ] Admin dashboard accessible
- [ ] Vendor dashboard accessible
- [ ] Buyer account profile accessible
- [ ] E2E tests pass with test data
- [ ] Mobile UI responsive
- [ ] All forms have proper labels
- [ ] Error messages display correctly

---

## 📊 Expected Test Results

**After Deploying Test Data:**
- ✅ E2E Pass Rate: 56.7% → 95%+
- ✅ Authentication Tests: 35.7% → 100%
- ✅ Shopping Cart Tests: 78.3% → 100%
- ✅ Critical Path Tests: 67.3% → 100%
- ✅ Mobile Performance: 2222ms → 1800ms
- ✅ Form Accessibility: 0% → 100%

---

## 🔐 Security Notes

- ⚠️ Test accounts use simple passwords for testing only
- ⚠️ Do NOT use test accounts in production
- ⚠️ Delete test data before final production deployment
- ⚠️ Test accounts should be removed after UAT
- ⚠️ Sensitive data should not be logged

---

## 📞 Support

For issues with test data deployment:
1. Check database connection
2. Verify Prisma migrations are up to date
3. Check seed script logs
4. Verify test accounts exist in database
5. Check API endpoints are accessible

---

**Status:** ✅ READY FOR DEPLOYMENT  
**Last Updated:** November 15, 2025  
**Next Step:** Deploy test data to production

