# Phase 21 - Live Selling Platform Test Execution Guide

**Date:** November 15, 2025  
**Environment:** Production (https://extremelifeherbal.com)  
**VPS:** 109.205.181.119  
**Status:** ✅ READY FOR EXECUTION

---

## 📋 Pre-Execution Checklist

- ✅ Production environment accessible
- ✅ All API endpoints verified (8/8 working)
- ✅ Test accounts created (admin, buyer, seller)
- ✅ Database schema verified
- ✅ Test data infrastructure ready
- ✅ Deployment scripts available

---

## 🚀 Step 1: Deploy Test Data to Production

### Option A: SSH Direct Execution (Recommended)

```bash
# SSH into production VPS
ssh root@109.205.181.119
# Password: 4K-6GsnA$3pQ5931

# Navigate to application directory
cd /var/www/html/ecom/app

# Run database seed script
npm run db:seed

# Expected output:
# ✅ Admin account created: admin@test.com
# ✅ Buyer account created: buyer@test.com
# ✅ Seller account created: seller@test.com
# ✅ 10 test products created
# ✅ 2 vendor stores created
# ✅ Test shipping address created
```

### Option B: Using Bash Script

```bash
# From local machine
bash scripts/deploy-test-data.sh

# Script will:
# 1. SSH into VPS
# 2. Run npm run db:seed
# 3. Verify test accounts
# 4. Verify test products
# 5. Generate deployment report
```

### Option C: Using PowerShell Script

```powershell
# From Windows machine
powershell -ExecutionPolicy Bypass -File scripts/deploy-test-data-production.ps1 `
  -VpsHost "109.205.181.119" `
  -VpsUser "root" `
  -VpsPassword "4K-6GsnA`$3pQ5931" `
  -AppDir "/var/www/html/ecom/app"
```

---

## ✅ Step 2: Verify Test Data Deployment

### Verify Test Accounts

```bash
# Test admin login
curl -X POST https://extremelifeherbal.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"Admin123!"}'

# Expected response: HTTP 200 with user data

# Test buyer login
curl -X POST https://extremelifeherbal.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"buyer@test.com","password":"Buyer123!"}'

# Test seller login
curl -X POST https://extremelifeherbal.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"seller@test.com","password":"Seller123!"}'
```

### Verify Test Products

```bash
# Get all products
curl -X GET https://extremelifeherbal.com/api/products \
  -H "Content-Type: application/json"

# Expected: 10 test products returned
```

### Verify Live Sessions Table

```bash
# Get all live sessions (should be empty initially)
curl -X GET https://extremelifeherbal.com/api/live-streams \
  -H "Content-Type: application/json"

# Expected: Empty array or pagination info
```

---

## 🧪 Step 3: Test Seller Flow

### 3.1 Login as Seller

```bash
# Login
curl -X POST https://extremelifeherbal.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"seller@test.com","password":"Seller123!"}'

# Save the session token from response
```

### 3.2 Create Live Session

```bash
# Create new live session
curl -X POST https://extremelifeherbal.com/api/live-streams \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <SESSION_TOKEN>" \
  -d '{
    "title": "Test Live Selling Session",
    "description": "Testing live selling platform",
    "startTime": "2025-11-15T14:00:00Z",
    "endTime": "2025-11-15T15:00:00Z",
    "isPublic": true,
    "allowComments": true,
    "allowGifts": true
  }'

# Save the session ID from response
```

### 3.3 Add Products to Session

```bash
# Add product to live session
curl -X POST https://extremelifeherbal.com/api/live-streams/<SESSION_ID>/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <SESSION_TOKEN>" \
  -d '{
    "productId": "<PRODUCT_ID>",
    "specialPrice": 1299.99,
    "stockLimit": 50
  }'
```

### 3.4 Start Live Session

```bash
# Start the session
curl -X POST https://extremelifeherbal.com/api/live-streams/<SESSION_ID>/start \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <SESSION_TOKEN>"

# Expected: Status changed to "live"
```

### 3.5 End Live Session

```bash
# End the session
curl -X POST https://extremelifeherbal.com/api/live-streams/<SESSION_ID>/end \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <SESSION_TOKEN>"

# Expected: Status changed to "ended"
```

---

## 🛍️ Step 4: Test Buyer Flow

### 4.1 Login as Buyer

```bash
# Login
curl -X POST https://extremelifeherbal.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"buyer@test.com","password":"Buyer123!"}'

# Save the session token
```

### 4.2 Browse Live Sessions

```bash
# Get active live sessions
curl -X GET "https://extremelifeherbal.com/api/live-streams?status=live" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <SESSION_TOKEN>"

# Expected: List of active sessions
```

### 4.3 Join Live Session

```bash
# Join a live session
curl -X POST https://extremelifeherbal.com/api/live-streams/<SESSION_ID>/viewers/join \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <SESSION_TOKEN>"

# Expected: Viewer record created
```

### 4.4 Send Chat Message

```bash
# Send message in live chat
curl -X POST https://extremelifeherbal.com/api/live-streams/<SESSION_ID>/chat/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <SESSION_TOKEN>" \
  -d '{"message": "Great products!"}'

# Expected: Message created
```

### 4.5 Add Product to Cart

```bash
# Add product to cart
curl -X POST https://extremelifeherbal.com/api/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <SESSION_TOKEN>" \
  -d '{
    "productId": "<PRODUCT_ID>",
    "quantity": 1,
    "variantId": "<VARIANT_ID>"
  }'

# Expected: Product added to cart
```

---

## 👨‍💼 Step 5: Test Admin Flow

### 5.1 Login as Admin

```bash
# Login
curl -X POST https://extremelifeherbal.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"Admin123!"}'

# Save the session token
```

### 5.2 View All Live Sessions

```bash
# Get all sessions (admin view)
curl -X GET "https://extremelifeherbal.com/api/admin/live-streams" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <SESSION_TOKEN>"

# Expected: All sessions visible
```

### 5.3 Monitor Analytics

```bash
# Get session analytics
curl -X GET https://extremelifeherbal.com/api/live-streams/<SESSION_ID>/analytics \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <SESSION_TOKEN>"

# Expected: Analytics data (viewers, messages, sales)
```

---

## 📊 Step 6: API Endpoint Verification

### Test All Endpoints

```bash
# 1. GET /api/live-streams
curl -X GET https://extremelifeherbal.com/api/live-streams

# 2. POST /api/live-streams
curl -X POST https://extremelifeherbal.com/api/live-streams \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"title":"Test","startTime":"2025-11-15T14:00:00Z"}'

# 3. GET /api/live-streams/[id]
curl -X GET https://extremelifeherbal.com/api/live-streams/<SESSION_ID>

# 4. PATCH /api/live-streams/[id]
curl -X PATCH https://extremelifeherbal.com/api/live-streams/<SESSION_ID> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"title":"Updated Title"}'

# 5. POST /api/live-streams/[id]/start
curl -X POST https://extremelifeherbal.com/api/live-streams/<SESSION_ID>/start \
  -H "Authorization: Bearer <TOKEN>"

# 6. POST /api/live-streams/[id]/end
curl -X POST https://extremelifeherbal.com/api/live-streams/<SESSION_ID>/end \
  -H "Authorization: Bearer <TOKEN>"

# 7. GET /api/live-streams/[id]/chat
curl -X GET https://extremelifeherbal.com/api/live-streams/<SESSION_ID>/chat

# 8. POST /api/live-streams/[id]/flash-sales
curl -X POST https://extremelifeherbal.com/api/live-streams/<SESSION_ID>/flash-sales \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"productId":"<ID>","specialPrice":999.99}'
```

---

## 📝 Step 7: Document Results

### Create Test Report

1. Document all test results
2. Record HTTP status codes
3. Note any errors or issues
4. Capture response times
5. Document feature status

### Report Template

```markdown
# Test Execution Report

## Test Date: [DATE]
## Tester: [NAME]
## Environment: Production

### Test Results
- Seller Flow: [PASS/FAIL]
- Buyer Flow: [PASS/FAIL]
- Admin Flow: [PASS/FAIL]
- API Endpoints: [PASS/FAIL]

### Issues Found
1. [Issue 1]
2. [Issue 2]

### Recommendations
1. [Recommendation 1]
2. [Recommendation 2]
```

---

## ✅ Success Criteria

- ✅ All test accounts login successfully
- ✅ All API endpoints return correct status codes
- ✅ Live sessions can be created and managed
- ✅ Products can be added to sessions
- ✅ Buyers can join sessions and chat
- ✅ Orders can be placed during live sessions
- ✅ Admin can view all sessions and analytics

---

## 🔧 Troubleshooting

### Issue: SSH Connection Failed
**Solution:** Verify VPS credentials and network connectivity

### Issue: npm run db:seed fails
**Solution:** Check Node.js version and npm dependencies

### Issue: API endpoints return 404
**Solution:** Verify application is running and routes are correct

### Issue: Authentication fails
**Solution:** Verify test accounts exist in database

---

## 📞 Support

For issues or questions:
1. Check PHASE_21_LIVE_SELLING_TEST_REPORT.md
2. Review API_ENDPOINTS.md
3. Check application logs on VPS
4. Contact development team

---

**Status:** ✅ READY FOR EXECUTION  
**Last Updated:** November 15, 2025  
**Production URL:** https://extremelifeherbal.com

