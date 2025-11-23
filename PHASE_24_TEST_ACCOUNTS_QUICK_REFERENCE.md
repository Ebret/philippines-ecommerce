# 🧪 PHASE 24 TEST ACCOUNTS - QUICK REFERENCE

**Purpose:** Quick reference for testing Phase 24 Phase 3.5 Relivator UI Integration  
**Status:** ✅ READY FOR TESTING

---

## 🚀 QUICK START

### Create Test Accounts
```bash
# Option 1: Run comprehensive seed script
npx ts-node prisma/seed-comprehensive-test-accounts.ts

# Option 2: Run standard seed
npm run db:seed

# Option 3: On production VPS
ssh root@109.205.181.119
cd /var/www/html/ecom/app
npx prisma db seed
```

---

## 📋 TEST ACCOUNTS SUMMARY

| Role | Email | Password | Dashboard |
|------|-------|----------|-----------|
| **ADMIN** | admin@test.com | Admin123! | /admin |
| **ADMIN** | admin.content@test.com | AdminContent123! | /admin |
| **ADMIN** | admin.analytics@test.com | AdminAnalytics123! | /admin |
| **VENDOR** | vendor.premium@test.com | VendorPremium123! | /vendor/dashboard |
| **VENDOR** | vendor.standard@test.com | VendorStandard123! | /vendor/dashboard |
| **VENDOR** | vendor.new@test.com | VendorNew123! | /vendor/dashboard |
| **BUYER** | buyer.premium@test.com | BuyerPremium123! | /account/profile |
| **BUYER** | buyer.regular@test.com | BuyerRegular123! | /account/profile |
| **BUYER** | buyer.new@test.com | BuyerNew123! | /account/profile |
| **BUYER** | buyer.international@test.com | BuyerIntl123! | /account/profile |
| **BUYER** | buyer.bulk@test.com | BuyerBulk123! | /account/profile |

---

## ✅ TESTING CHECKLIST

### Phase 3.5 Pages to Test

**Account Pages (Buyer):**
- [ ] `/account/profile` - Profile management
- [ ] `/account/orders` - Order history
- [ ] `/account/addresses` - Address management
- [ ] `/account/settings` - Account settings

**Vendor Pages:**
- [ ] `/vendor/dashboard` - Vendor dashboard with KPIs

**Admin Pages:**
- [ ] `/admin` - Admin dashboard

### Relivator Styling Verification

- [ ] Primary color (Emerald #10b981) applied
- [ ] Secondary color (Blue #2563eb) applied
- [ ] Accent color (Amber #f59e0b) applied
- [ ] Dark mode toggle works
- [ ] Responsive design on mobile
- [ ] Gradient buttons visible
- [ ] Semantic colors for status badges
- [ ] Form inputs styled correctly

### Functionality Testing

- [ ] Login works for all roles
- [ ] Logout works
- [ ] Navigation works
- [ ] Forms submit successfully
- [ ] Data displays correctly
- [ ] Dark mode persists
- [ ] No console errors
- [ ] All pages load in < 3 seconds

---

## 🔍 TESTING WORKFLOW

### 1. Login Test
```bash
# Visit login page
https://extremelifeherbal.com/auth/login

# Test with each account
Email: admin@test.com
Password: Admin123!
```

### 2. Dashboard Test
```bash
# Admin
https://extremelifeherbal.com/admin

# Vendor
https://extremelifeherbal.com/vendor/dashboard

# Buyer
https://extremelifeherbal.com/account/profile
```

### 3. Dark Mode Test
- Click theme toggle in header
- Verify colors change
- Refresh page - verify theme persists

### 4. Responsive Test
- Test on desktop (1920x1080)
- Test on tablet (768x1024)
- Test on mobile (375x667)

---

## 📊 SAMPLE DATA INCLUDED

**Admin Accounts:**
- 50+ orders
- 100+ products
- System logs
- Analytics data

**Vendor Accounts:**
- 5-50 products
- 10-100 orders
- Live streams
- Earnings data

**Buyer Accounts:**
- 2-100 orders
- 1-10 saved addresses
- Wishlist items
- Cart items

---

## 🆘 TROUBLESHOOTING

### Accounts Not Created
```bash
# Check database connection
echo $DATABASE_URL

# Run seed with verbose output
npx prisma db seed --verbose

# Check Prisma logs
npx prisma studio
```

### Login Fails
- Verify email is correct
- Verify password is correct
- Check user status in database
- Verify emailVerified = true

### Pages Not Loading
- Check PM2 status: `pm2 status`
- Check logs: `pm2 logs philippines-ecommerce`
- Verify NEXTAUTH_SECRET is set
- Clear browser cache

---

**Status:** ✅ READY FOR TESTING

