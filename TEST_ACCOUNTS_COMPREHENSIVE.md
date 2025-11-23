# 🧪 COMPREHENSIVE TEST ACCOUNTS - Philippines E-Commerce Platform

**Purpose:** Test accounts for Phase 24 Phase 3.5 Relivator UI Integration verification  
**Status:** ✅ READY FOR TESTING  
**Last Updated:** November 23, 2025

---

## 👥 ADMIN ACCOUNTS (3 Total)

### Admin Account 1 - Super Admin
- **Email:** `admin@test.com`
- **Password:** `Admin123!`
- **Role:** ADMIN
- **Access Level:** Full admin privileges
- **Permissions:** User management, vendor verification, reports, system settings, analytics
- **Sample Data:** 50+ orders, 100+ products, system logs, analytics data
- **Dashboard:** https://extremelifeherbal.com/admin

### Admin Account 2 - Content Manager
- **Email:** `admin.content@test.com`
- **Password:** `AdminContent123!`
- **Role:** ADMIN
- **Access Level:** Content and product management
- **Permissions:** Product management, category management, content moderation
- **Sample Data:** 30+ products, 20+ categories, moderation queue
- **Dashboard:** https://extremelifeherbal.com/admin

### Admin Account 3 - Analytics Manager
- **Email:** `admin.analytics@test.com`
- **Password:** `AdminAnalytics123!`
- **Role:** ADMIN
- **Access Level:** Analytics and reporting
- **Permissions:** View reports, analytics, sales data, user statistics
- **Sample Data:** 6 months of analytics, sales reports, user metrics
- **Dashboard:** https://extremelifeherbal.com/admin

---

## 🏪 VENDOR/SELLER ACCOUNTS (3 Total)

### Vendor Account 1 - Premium Seller
- **Email:** `vendor.premium@test.com`
- **Password:** `VendorPremium123!`
- **Role:** SELLER
- **Access Level:** Full vendor capabilities
- **Permissions:** Product management, order management, live streams, analytics, earnings
- **Sample Data:** 50+ products, 100+ orders, 10+ live streams, ₱500,000+ earnings
- **Dashboard:** https://extremelifeherbal.com/vendor/dashboard

### Vendor Account 2 - Standard Seller
- **Email:** `vendor.standard@test.com`
- **Password:** `VendorStandard123!`
- **Role:** SELLER
- **Access Level:** Standard vendor capabilities
- **Permissions:** Product management, order management, analytics
- **Sample Data:** 20+ products, 50+ orders, ₱100,000+ earnings
- **Dashboard:** https://extremelifeherbal.com/vendor/dashboard

### Vendor Account 3 - New Seller
- **Email:** `vendor.new@test.com`
- **Password:** `VendorNew123!`
- **Role:** SELLER
- **Access Level:** Limited vendor capabilities
- **Permissions:** Product management, order management
- **Sample Data:** 5+ products, 10+ orders, ₱10,000+ earnings
- **Dashboard:** https://extremelifeherbal.com/vendor/dashboard

---

## 👤 BUYER/CLIENT ACCOUNTS (5 Total)

### Buyer Account 1 - Premium Customer
- **Email:** `buyer.premium@test.com`
- **Password:** `BuyerPremium123!`
- **Role:** BUYER
- **Access Level:** Full customer capabilities
- **Sample Data:** 50+ orders, 10+ saved addresses, wishlist, cart items
- **Dashboard:** https://extremelifeherbal.com/account/profile

### Buyer Account 2 - Regular Customer
- **Email:** `buyer.regular@test.com`
- **Password:** `BuyerRegular123!`
- **Role:** BUYER
- **Access Level:** Standard customer capabilities
- **Sample Data:** 20+ orders, 5+ saved addresses, wishlist
- **Dashboard:** https://extremelifeherbal.com/account/profile

### Buyer Account 3 - New Customer
- **Email:** `buyer.new@test.com`
- **Password:** `BuyerNew123!`
- **Role:** BUYER
- **Access Level:** Basic customer capabilities
- **Sample Data:** 2+ orders, 1+ saved address
- **Dashboard:** https://extremelifeherbal.com/account/profile

### Buyer Account 4 - International Customer
- **Email:** `buyer.international@test.com`
- **Password:** `BuyerIntl123!`
- **Role:** BUYER
- **Access Level:** Full customer capabilities
- **Sample Data:** 15+ orders, international addresses, multiple payment methods
- **Dashboard:** https://extremelifeherbal.com/account/profile

### Buyer Account 5 - Bulk Buyer
- **Email:** `buyer.bulk@test.com`
- **Password:** `BuyerBulk123!`
- **Role:** BUYER
- **Access Level:** Full customer capabilities
- **Sample Data:** 100+ orders, bulk purchase history, group deals
- **Dashboard:** https://extremelifeherbal.com/account/profile

---

## 🔐 ACCOUNT CREATION METHODS

### Method 1: Database Seed (Recommended)
```bash
npm run db:seed
```

### Method 2: Manual API Registration
```bash
curl -X POST https://extremelifeherbal.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!",
    "firstName": "Test",
    "lastName": "User",
    "role": "BUYER"
  }'
```

### Method 3: Direct Database Insert
See `prisma/seed.ts` for SQL examples

---

## ✅ VERIFICATION CHECKLIST

- [ ] All admin accounts can log in
- [ ] All vendor accounts can access vendor dashboard
- [ ] All buyer accounts can access account profile
- [ ] Dark mode works on all pages
- [ ] Relivator styling applied correctly
- [ ] Sample data displays properly
- [ ] Navigation works correctly
- [ ] Forms submit successfully

---

**Status:** ✅ READY FOR PHASE 3.5 UI TESTING

