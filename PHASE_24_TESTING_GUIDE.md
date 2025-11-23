# 🧪 PHASE 24 PHASE 3.5 - COMPREHENSIVE TESTING GUIDE

**Purpose:** Complete testing guide for Relivator UI Integration Phase 3.5  
**Status:** ✅ READY FOR TESTING  
**Date:** November 23, 2025

---

## 🚀 SETUP INSTRUCTIONS

### Step 1: Create Test Accounts
```bash
# On local machine
npx ts-node prisma/seed-comprehensive-test-accounts.ts

# On production VPS
ssh root@109.205.181.119
cd /var/www/html/ecom/app
npx prisma db seed
```

### Step 2: Verify Accounts Created
```bash
# Check database
npx prisma studio

# Or query directly
SELECT email, role FROM "User" WHERE email LIKE '%test.com%';
```

### Step 3: Start Application
```bash
# Local development
npm run dev

# Production (already running)
pm2 status
```

---

## 📋 TESTING MATRIX

### Admin Testing (3 Accounts)

| Account | Email | Password | Test |
|---------|-------|----------|------|
| Super Admin | admin@test.com | Admin123! | Full admin access |
| Content Manager | admin.content@test.com | AdminContent123! | Content management |
| Analytics Manager | admin.analytics@test.com | AdminAnalytics123! | Analytics access |

**Admin Dashboard Tests:**
- [ ] Login successful
- [ ] Dashboard loads
- [ ] All KPI cards visible
- [ ] Dark mode works
- [ ] Relivator colors applied
- [ ] Navigation works
- [ ] Logout works

---

### Vendor Testing (3 Accounts)

| Account | Email | Password | Test |
|---------|-------|----------|------|
| Premium | vendor.premium@test.com | VendorPremium123! | Full vendor access |
| Standard | vendor.standard@test.com | VendorStandard123! | Standard vendor |
| New | vendor.new@test.com | VendorNew123! | New vendor |

**Vendor Dashboard Tests:**
- [ ] Login successful
- [ ] Dashboard loads
- [ ] KPI cards display
- [ ] Recent orders visible
- [ ] Dark mode works
- [ ] Relivator colors applied
- [ ] Navigation works

---

### Buyer Testing (5 Accounts)

| Account | Email | Password | Test |
|---------|-------|----------|------|
| Premium | buyer.premium@test.com | BuyerPremium123! | Premium buyer |
| Regular | buyer.regular@test.com | BuyerRegular123! | Regular buyer |
| New | buyer.new@test.com | BuyerNew123! | New buyer |
| International | buyer.international@test.com | BuyerIntl123! | International |
| Bulk | buyer.bulk@test.com | BuyerBulk123! | Bulk buyer |

**Account Pages Tests:**
- [ ] Profile page loads
- [ ] Orders page displays
- [ ] Addresses page works
- [ ] Settings page accessible
- [ ] Dark mode works
- [ ] Relivator colors applied
- [ ] Forms submit successfully

---

## 🎨 RELIVATOR STYLING VERIFICATION

### Color Verification
- [ ] Primary (Emerald #10b981) on buttons
- [ ] Secondary (Blue #2563eb) on links
- [ ] Accent (Amber #f59e0b) on highlights
- [ ] Success (Green #22c55e) on status
- [ ] Error (Red #ef4444) on errors
- [ ] Warning (Amber #f59e0b) on warnings

### Dark Mode Verification
- [ ] Toggle button visible
- [ ] Dark mode applies correctly
- [ ] Colors adjust for dark mode
- [ ] Text readable in dark mode
- [ ] Theme persists on refresh

### Responsive Design
- [ ] Desktop (1920x1080) - all elements visible
- [ ] Tablet (768x1024) - responsive layout
- [ ] Mobile (375x667) - mobile-optimized

---

## 🔍 DETAILED PAGE TESTING

### Account Profile Page
```
URL: https://extremelifeherbal.com/account/profile
Test with: buyer.premium@test.com / BuyerPremium123!

Checklist:
- [ ] Page loads without errors
- [ ] Profile information displays
- [ ] Edit button works
- [ ] Avatar displays
- [ ] Dark mode works
- [ ] Relivator styling applied
- [ ] Form validation works
- [ ] Submit button works
```

### Account Orders Page
```
URL: https://extremelifeherbal.com/account/orders
Test with: buyer.premium@test.com / BuyerPremium123!

Checklist:
- [ ] Page loads without errors
- [ ] Orders list displays
- [ ] Status badges show correct colors
- [ ] Pagination works
- [ ] Filtering works
- [ ] Dark mode works
- [ ] Relivator styling applied
- [ ] Order details accessible
```

### Account Addresses Page
```
URL: https://extremelifeherbal.com/account/addresses
Test with: buyer.premium@test.com / BuyerPremium123!

Checklist:
- [ ] Page loads without errors
- [ ] Addresses list displays
- [ ] Add address button works
- [ ] Edit address works
- [ ] Delete address works
- [ ] Form validation works
- [ ] Dark mode works
- [ ] Relivator styling applied
```

### Account Settings Page
```
URL: https://extremelifeherbal.com/account/settings
Test with: buyer.premium@test.com / BuyerPremium123!

Checklist:
- [ ] Page loads without errors
- [ ] Password change form works
- [ ] Notification preferences work
- [ ] Logout button works
- [ ] Form validation works
- [ ] Dark mode works
- [ ] Relivator styling applied
- [ ] Error messages display
```

### Vendor Dashboard Page
```
URL: https://extremelifeherbal.com/vendor/dashboard
Test with: vendor.premium@test.com / VendorPremium123!

Checklist:
- [ ] Page loads without errors
- [ ] KPI cards display
- [ ] Recent orders table shows
- [ ] Charts display correctly
- [ ] Dark mode works
- [ ] Relivator styling applied
- [ ] Navigation works
- [ ] Data updates correctly
```

### Admin Dashboard Page
```
URL: https://extremelifeherbal.com/admin
Test with: admin@test.com / Admin123!

Checklist:
- [ ] Page loads without errors
- [ ] Quick link cards display
- [ ] All sections accessible
- [ ] Dark mode works
- [ ] Relivator styling applied
- [ ] Navigation works
- [ ] Admin functions available
- [ ] System status visible
```

---

## 🆘 TROUBLESHOOTING

### Login Issues
```bash
# Check user exists
npx prisma studio

# Verify password hash
SELECT email, passwordHash FROM "User" WHERE email = 'admin@test.com';

# Check user status
SELECT email, status, emailVerified FROM "User" WHERE email = 'admin@test.com';
```

### Page Not Loading
```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs philippines-ecommerce --lines 50

# Check build
npm run build
```

### Styling Not Applied
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+Shift+R)
- Check dark mode toggle
- Verify Tailwind CSS loaded

---

**Status:** ✅ READY FOR COMPREHENSIVE TESTING

