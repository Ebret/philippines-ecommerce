# Phase 21 Week 1: Manual Testing Guide

**Production URL:** https://extremelifeherbal.com  
**Test Accounts:** 3 (admin, buyer, seller)  
**Test Products:** 10 (across 3 categories)  
**Duration:** 2-3 hours for complete testing

---

## 🔐 Test Account Credentials

| Role | Email | Password | Purpose |
|------|-------|----------|---------|
| Admin | admin@test.com | Admin123! | Monitor sessions, view analytics |
| Buyer | buyer@test.com | Buyer123! | Browse, join sessions, purchase |
| Seller | seller@test.com | Seller123! | Create sessions, manage products |

---

## 📋 Pre-Testing Checklist

- [ ] Test data deployed to production database
- [ ] All 3 test accounts created and verified
- [ ] All 10 test products created
- [ ] 2 vendor stores created
- [ ] Production URL accessible (https://extremelifeherbal.com)
- [ ] HTTPS certificate valid
- [ ] Database connection working
- [ ] PM2 processes running

---

## 🧪 Test Scenarios

### Scenario 1: Seller Flow (30 minutes)

**Objective:** Create and manage live selling sessions

**Steps:**
1. Login as seller@test.com at /auth/login
2. Navigate to /vendor/live dashboard
3. Click "Create New Session"
4. Fill in session details:
   - Title: "Live Product Showcase - Herbal Tea"
   - Description: "Exclusive live demonstration of our premium herbal tea collection"
   - Start Time: Current time + 5 minutes
   - End Time: Current time + 1 hour
5. Add 3-4 products from test products
6. Configure flash sale (20% discount)
7. Click "Start Session"
8. Verify session appears in active sessions list
9. Test session controls (pause, resume, end)
10. Document any issues

**Expected Results:**
- ✅ Session created successfully
- ✅ Products added to session
- ✅ Flash sale configured
- ✅ Session status updates correctly
- ✅ No console errors

---

### Scenario 2: Buyer Flow (30 minutes)

**Objective:** Browse, join, and purchase from live sessions

**Steps:**
1. Login as buyer@test.com at /auth/login
2. Navigate to /live (browse live sessions)
3. Find active session created by seller
4. Click "Join Session"
5. Verify session details load correctly
6. Send 3-5 chat messages
7. View products in session
8. Add 2-3 products to cart
9. Navigate to /cart
10. Proceed to checkout
11. Complete purchase
12. Verify order confirmation

**Expected Results:**
- ✅ Session loads correctly
- ✅ Chat messages send/receive in real-time
- ✅ Products display with correct prices
- ✅ Cart updates correctly
- ✅ Checkout completes successfully
- ✅ Order confirmation shows

---

### Scenario 3: Admin Flow (20 minutes)

**Objective:** Monitor sessions and view analytics

**Steps:**
1. Login as admin@test.com at /auth/login
2. Navigate to /admin/live-selling
3. View all active sessions
4. Click on seller's session
5. View session analytics:
   - Viewer count
   - Chat message count
   - Products sold
   - Revenue generated
6. View buyer's order in order management
7. Check payment status
8. Verify order details

**Expected Results:**
- ✅ All sessions visible
- ✅ Analytics display correctly
- ✅ Viewer count updates in real-time
- ✅ Orders appear in admin panel
- ✅ Payment status shows correctly

---

### Scenario 4: Real-Time Multi-User Test (30 minutes)

**Objective:** Test real-time functionality with multiple concurrent users

**Setup:**
- Window 1: Seller (seller@test.com)
- Window 2: Buyer (buyer@test.com)
- Window 3: Admin (admin@test.com)

**Steps:**
1. Seller: Start a new live session
2. Buyer: Join the session
3. Admin: Monitor the session
4. Seller: Send chat message "Welcome to our live session!"
5. Buyer: Send chat message "Great products!"
6. Verify all messages appear in real-time
7. Seller: Update flash sale discount
8. Buyer: Verify discount updates immediately
9. Buyer: Add product to cart
10. Seller: Verify viewer count updates
11. Admin: Verify all activity in analytics

**Expected Results:**
- ✅ Chat messages appear in real-time
- ✅ Viewer count updates immediately
- ✅ Flash sale updates propagate
- ✅ No WebSocket connection errors
- ✅ No duplicate messages

---

### Scenario 5: Performance Testing (20 minutes)

**Objective:** Measure performance metrics

**Tools:** Browser DevTools (F12)

**Tests:**
1. **Page Load Times:**
   - /live: Target < 2s
   - /vendor/live: Target < 2s
   - /vendor/live/create: Target < 2s

2. **API Response Times:**
   - GET /api/live-streams: Target < 500ms
   - POST /api/live-streams: Target < 500ms
   - GET /api/live-streams/[id]/chat: Target < 300ms

3. **Network Analysis:**
   - Check for failed requests
   - Verify HTTPS connections
   - Check for console errors

4. **Memory Usage:**
   - Monitor memory during session
   - Check for memory leaks
   - Verify cleanup on session end

**Expected Results:**
- ✅ All pages load < 2s
- ✅ All APIs respond < 500ms
- ✅ No failed requests
- ✅ No console errors
- ✅ No memory leaks

---

## 📊 Issue Reporting Template

**Issue Title:** [Brief description]

**Severity:** 🔴 Critical / 🟠 High / 🟡 Medium / 🟢 Low

**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Result:** [What should happen]

**Actual Result:** [What actually happened]

**Screenshots/Logs:** [Attach if applicable]

**Browser/Device:** [Browser and OS]

---

## ✅ Sign-Off Checklist

- [ ] All test scenarios completed
- [ ] No critical issues found
- [ ] Performance metrics acceptable
- [ ] Real-time functionality working
- [ ] All test accounts functional
- [ ] All test products visible
- [ ] Chat functionality working
- [ ] Checkout process working
- [ ] Admin dashboard functional
- [ ] No console errors

---

**Testing Date:** _______________  
**Tester Name:** _______________  
**Status:** ✅ PASS / ⚠️ PASS WITH ISSUES / ❌ FAIL


