# 🧪 LOGOUT & USER MENU TESTING GUIDE

**Status:** ✅ READY FOR TESTING  
**Latest Commit:** 6472b85  
**Date:** 2025-11-25

---

## 📋 TEST ACCOUNTS

| Email | Password | Role |
|-------|----------|------|
| admin@test.com | Admin123! | ADMIN |
| seller@test.com | Seller123! | SELLER |
| buyer@test.com | Buyer123! | BUYER |

---

## 🧪 TEST CASES

### Test 1: Admin Logout
1. Navigate to https://extremelifeherbal.com
2. Click "Login" button
3. Enter: admin@test.com / Admin123!
4. Click user avatar in navbar
5. Verify dropdown shows "ADMIN" role
6. Click "Logout" button
7. Verify redirect to homepage
8. Verify "Login" button appears

### Test 2: Seller Logout & User Switching
1. Login with seller@test.com / Seller123!
2. Verify dropdown shows "SELLER" role
3. Verify "Dashboard" option appears
4. Click "Logout"
5. Verify redirect to homepage
6. Click "Login" again
7. Login with buyer@test.com / Buyer123!
8. Verify different user is logged in

### Test 3: Buyer Logout
1. Login with buyer@test.com / Buyer123!
2. Verify dropdown shows "BUYER" role
3. Verify "Dashboard" option does NOT appear
4. Click "Logout"
5. Verify redirect to homepage

### Test 4: Mobile Menu
1. Login on mobile device
2. Click hamburger menu
3. Verify user menu appears
4. Click user menu
5. Verify logout works on mobile

### Test 5: Theme Switching
1. Login to any account
2. Click moon/sun icon in navbar
3. Verify theme changes
4. Verify user menu styling updates
5. Verify logout button visible in both themes

### Test 6: Session Persistence
1. Login with admin@test.com
2. Refresh page
3. Verify still logged in
4. Verify user menu shows correct info
5. Logout and refresh
6. Verify logged out

---

## ✅ EXPECTED RESULTS

- ✅ Logout button visible when authenticated
- ✅ Logout works for all roles
- ✅ Redirect to homepage after logout
- ✅ Can login with different account
- ✅ User menu shows correct role
- ✅ Theme switcher works
- ✅ Mobile responsive
- ✅ Dark/light theme compatible

---

**Ready to test!** 🚀

