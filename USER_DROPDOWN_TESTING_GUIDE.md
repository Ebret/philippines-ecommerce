# User Dropdown Menu - Testing Guide
## Philippines E-Commerce Platform

**Test Date**: December 3, 2025  
**Domain**: https://extremelifeherbal.com  
**Test Accounts**: admin@test.com, buyer@test.com, seller@test.com

---

## 🧪 TEST ACCOUNTS

### Admin Account
- **Email**: admin@test.com
- **Password**: Admin123!
- **Role**: ADMIN
- **Expected Menu**: Profile, Orders, Settings, Admin Dashboard, Logout

### Buyer Account
- **Email**: buyer@test.com
- **Password**: Buyer123!
- **Role**: BUYER
- **Expected Menu**: Profile, Orders, Settings, Logout

### Seller Account
- **Email**: seller@test.com
- **Password**: Seller123!
- **Role**: SELLER
- **Expected Menu**: Profile, Orders, Settings, Seller Dashboard, Logout

---

## ✅ TEST CASE 1: Admin User Dropdown

### Setup
1. [ ] Navigate to https://extremelifeherbal.com
2. [ ] Click login link
3. [ ] Enter admin@test.com / Admin123!
4. [ ] Click login button

### Test Steps
1. [ ] Verify avatar displays in top-right
2. [ ] Click avatar to open dropdown
3. [ ] Verify user name displays: "Admin User"
4. [ ] Verify email displays: "admin@test.com"
5. [ ] Verify role badge displays: "ADMIN"
6. [ ] Verify menu items:
   - [ ] My Profile (visible)
   - [ ] My Orders (visible)
   - [ ] Settings (visible)
   - [ ] Admin Dashboard (visible)
   - [ ] Logout (visible)
7. [ ] Click "Admin Dashboard"
8. [ ] Verify navigation to /admin
9. [ ] Go back to homepage
10. [ ] Click avatar again
11. [ ] Click "Logout"
12. [ ] Verify redirect to home page
13. [ ] Verify user is logged out

---

## ✅ TEST CASE 2: Buyer User Dropdown

### Setup
1. [ ] Navigate to https://extremelifeherbal.com
2. [ ] Click login link
3. [ ] Enter buyer@test.com / Buyer123!
4. [ ] Click login button

### Test Steps
1. [ ] Verify avatar displays
2. [ ] Click avatar to open dropdown
3. [ ] Verify user name displays: "Buyer User"
4. [ ] Verify email displays: "buyer@test.com"
5. [ ] Verify role badge displays: "BUYER"
6. [ ] Verify menu items:
   - [ ] My Profile (visible)
   - [ ] My Orders (visible)
   - [ ] Settings (visible)
   - [ ] Admin Dashboard (NOT visible)
   - [ ] Seller Dashboard (NOT visible)
   - [ ] Logout (visible)
7. [ ] Click "My Profile"
8. [ ] Verify navigation to /account/profile
9. [ ] Go back to homepage
10. [ ] Click avatar again
11. [ ] Click "My Orders"
12. [ ] Verify navigation to /account/orders
13. [ ] Go back and test logout

---

## ✅ TEST CASE 3: Seller User Dropdown

### Setup
1. [ ] Navigate to https://extremelifeherbal.com
2. [ ] Click login link
3. [ ] Enter seller@test.com / Seller123!
4. [ ] Click login button

### Test Steps
1. [ ] Verify avatar displays
2. [ ] Click avatar to open dropdown
3. [ ] Verify user name displays: "Seller User"
4. [ ] Verify email displays: "seller@test.com"
5. [ ] Verify role badge displays: "SELLER"
6. [ ] Verify menu items:
   - [ ] My Profile (visible)
   - [ ] My Orders (visible)
   - [ ] Settings (visible)
   - [ ] Admin Dashboard (NOT visible)
   - [ ] Seller Dashboard (visible)
   - [ ] Logout (visible)
7. [ ] Click "Seller Dashboard"
8. [ ] Verify navigation to /vendor/dashboard
9. [ ] Go back and test logout

---

## ✅ TEST CASE 4: Unauthenticated User

### Setup
1. [ ] Navigate to https://extremelifeherbal.com
2. [ ] Ensure logged out

### Test Steps
1. [ ] Verify user icon displays (not avatar)
2. [ ] Click user icon
3. [ ] Verify navigation to /auth/login
4. [ ] Verify login page displays

---

## ✅ TEST CASE 5: Interactions & Animations

### Setup
1. [ ] Login with any test account
2. [ ] Navigate to homepage

### Test Steps
1. [ ] Click avatar to open dropdown
2. [ ] Verify chevron rotates 180 degrees
3. [ ] Verify menu fades in smoothly
4. [ ] Verify menu slides down from top
5. [ ] Hover over menu items
6. [ ] Verify hover background color changes
7. [ ] Click outside dropdown
8. [ ] Verify menu closes
9. [ ] Verify chevron rotates back to 0 degrees
10. [ ] Open dropdown again
11. [ ] Verify smooth animation

---

## ✅ TEST CASE 6: Dark Mode

### Setup
1. [ ] Login with any test account
2. [ ] Toggle dark mode (if available)

### Test Steps
1. [ ] Verify dropdown styling in dark mode
2. [ ] Verify text is readable
3. [ ] Verify colors match theme
4. [ ] Verify no visual glitches
5. [ ] Verify animations smooth
6. [ ] Toggle back to light mode
7. [ ] Verify styling correct

---

## ✅ TEST CASE 7: Mobile Responsiveness

### Setup
1. [ ] Open DevTools (F12)
2. [ ] Toggle device toolbar (Ctrl+Shift+M)
3. [ ] Select mobile device (iPhone 12)
4. [ ] Login with test account

### Test Steps
1. [ ] Verify avatar displays correctly
2. [ ] Click avatar to open dropdown
3. [ ] Verify dropdown displays on mobile
4. [ ] Verify dropdown width appropriate
5. [ ] Verify menu items readable
6. [ ] Verify no horizontal scroll
7. [ ] Test all menu items
8. [ ] Test logout
9. [ ] Test on tablet size
10. [ ] Test on different mobile devices

---

## 📊 TEST RESULTS SUMMARY

| Test Case | Status | Notes |
|-----------|--------|-------|
| Admin Dropdown | [ ] Pass / [ ] Fail | |
| Buyer Dropdown | [ ] Pass / [ ] Fail | |
| Seller Dropdown | [ ] Pass / [ ] Fail | |
| Unauthenticated | [ ] Pass / [ ] Fail | |
| Interactions | [ ] Pass / [ ] Fail | |
| Dark Mode | [ ] Pass / [ ] Fail | |
| Mobile | [ ] Pass / [ ] Fail | |

---

## 🐛 ISSUES FOUND

1. **Issue**: _______________
   - **Severity**: Critical / High / Medium / Low
   - **Steps to Reproduce**: _______________
   - **Expected**: _______________
   - **Actual**: _______________

---

## ✅ SIGN-OFF

- [ ] All test cases passed
- [ ] No critical issues
- [ ] Ready for production
- [ ] User feedback positive

**Tester**: _______________  
**Date**: _______________  
**Status**: ✅ APPROVED FOR PRODUCTION

