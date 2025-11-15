# Phase 21 Week 1: Manual Execution Steps

**Date:** November 15, 2025  
**Duration:** 2-3 hours  
**Production URL:** https://extremelifeherbal.com

---

## 📋 STEP 1: DEPLOY TEST DATA (5-10 minutes)

### 1.1 SSH into VPS
```bash
ssh root@109.205.181.119
# Password: 4K-6GsnA$3pQ5931
```

### 1.2 Navigate to App Directory
```bash
cd /var/www/html/ecom/app
```

### 1.3 Run Seed Script
```bash
npm run db:seed
```

### 1.4 Verify Output
Look for:
- ✓ 3 test accounts created
- ✓ 10 test products created
- ✓ 2 vendor stores created
- ✓ No errors

### 1.5 Document Results
Record:
- Execution time
- Any warnings/errors
- Database status

---

## 🎯 STEP 2: CREATE LIVE SESSIONS (15-20 minutes)

### 2.1 Login as Seller
- URL: https://extremelifeherbal.com/auth/signin
- Email: seller@test.com
- Password: Seller123!

### 2.2 Navigate to Create Session
- URL: https://extremelifeherbal.com/vendor/live/create

### 2.3 Create Session 1 (Scheduled)
- Title: "Herbal Tea Showcase - Scheduled"
- Description: "Exclusive herbal tea demonstration"
- Start Time: Tomorrow 10:00 AM
- End Time: Tomorrow 11:00 AM
- Add 2 products

### 2.4 Create Session 2 (Active)
- Title: "Live Herbal Products Demo"
- Description: "Real-time product showcase"
- Start Time: Now
- End Time: 1 hour from now
- Add 3 products
- Configure flash sale (20% off)

### 2.5 Create Session 3 (Ended)
- Title: "Previous Herbal Session"
- Description: "Completed session"
- Start Time: 2 hours ago
- End Time: 1 hour ago
- Add 2 products

### 2.6 Document Session IDs
Record:
- Session 1 ID: ___________
- Session 2 ID: ___________
- Session 3 ID: ___________

---

## 👥 STEP 3: REAL-TIME MULTI-USER TEST (30 minutes)

### 3.1 Open 3 Browser Windows

**Window 1 - Seller:**
- Login: seller@test.com / Seller123!
- URL: https://extremelifeherbal.com/vendor/live

**Window 2 - Buyer:**
- Login: buyer@test.com / Buyer123!
- URL: https://extremelifeherbal.com/live

**Window 3 - Admin:**
- Login: admin@test.com / Admin123!
- URL: https://extremelifeherbal.com/admin/live-streams

### 3.2 Start Live Session (Seller)
- Click "Start Session" on Session 2
- Verify status changes to "Active"

### 3.3 Join Session (Buyer)
- Find active session in list
- Click "Join Session"
- Verify viewer count increases

### 3.4 Test Real-Time Chat
- Seller sends: "Welcome to live session!"
- Buyer sends: "Great products!"
- Verify messages appear instantly
- Record any delays

### 3.5 Test Viewer Updates
- Monitor viewer count in real-time
- Verify updates when users join/leave
- Record any delays

### 3.6 Test Flash Sale
- Seller activates flash sale
- Verify notification appears for buyer
- Record any delays

### 3.7 Document Results
Record:
- Chat latency: _____ ms
- Viewer update latency: _____ ms
- Flash sale notification latency: _____ ms
- Any WebSocket errors: _____

---

## 🛒 STEP 4: BUYER FLOW (30 minutes)

### 4.1 Browse Sessions (Buyer)
- URL: https://extremelifeherbal.com/live
- Verify page loads < 2s
- Record load time: _____ ms
- Verify 3 sessions visible

### 4.2 Join Active Session
- Click on Session 2
- Verify page loads < 2s
- Record load time: _____ ms
- Verify session details display

### 4.3 Send Chat Message
- Type: "I'm interested in this product"
- Click Send
- Verify message appears
- Record response time: _____ ms

### 4.4 Add Product to Cart
- Click "Add to Cart" on product
- Verify cart updates
- Record response time: _____ ms

### 4.5 Proceed to Checkout
- Click "View Cart"
- Verify cart page loads < 2s
- Record load time: _____ ms
- Click "Checkout"

### 4.6 Complete Order
- Fill shipping address
- Select payment method
- Click "Place Order"
- Verify order confirmation
- Record order ID: ___________

### 4.7 Verify Confirmation
- Check email for order confirmation
- Verify order in account page
- Record HTTP status codes

---

## ⚡ STEP 5: PERFORMANCE TESTING (20-30 minutes)

### 5.1 Page Load Times
Test each page 3 times, record average:

**Page 1: /live**
- Load 1: _____ ms
- Load 2: _____ ms
- Load 3: _____ ms
- Average: _____ ms (Target: < 2000ms)

**Page 2: /vendor/live**
- Load 1: _____ ms
- Load 2: _____ ms
- Load 3: _____ ms
- Average: _____ ms (Target: < 2000ms)

**Page 3: /vendor/live/create**
- Load 1: _____ ms
- Load 2: _____ ms
- Load 3: _____ ms
- Average: _____ ms (Target: < 2000ms)

### 5.2 API Response Times
Test each endpoint, record response time:

```bash
# GET /api/live-streams
curl -w "@curl-format.txt" -o /dev/null -s https://extremelifeherbal.com/api/live-streams
Response time: _____ ms (Target: < 500ms)

# POST /api/live-streams/[id]/chat/messages
Response time: _____ ms (Target: < 500ms)
```

### 5.3 Document Results
Record:
- Average page load time: _____ ms
- Average API response time: _____ ms
- Cache hit rate: _____ %
- Any performance issues: _____

---

## 📋 ISSUES FOUND

### Critical Issues
1. _____________________
2. _____________________

### Medium Issues
1. _____________________
2. _____________________

### Low Issues
1. _____________________
2. _____________________

---

## ✅ SIGN-OFF

- [ ] All 5 actions completed
- [ ] All results documented
- [ ] No critical issues
- [ ] Performance targets met
- [ ] Ready for Phase 21 Week 2

**Tester Name:** _____________________  
**Date:** _____________________  
**Time:** _____________________

---

**Status:** Ready for manual execution  
**Duration:** 2-3 hours  
**Date:** November 15, 2025


