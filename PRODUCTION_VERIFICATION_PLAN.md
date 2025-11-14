# Production Verification & Testing Plan

**Date**: November 14, 2025  
**Status**: IN PROGRESS

---

## Task 1: Verify Currency Symbol Display on Live Site

### Objective
Verify if currency symbol fixes from commit d437ec2 have been deployed to production.

### Findings
- **Local Code**: ✅ Shows ₱ symbols correctly (src/app/page.tsx lines 36, 44, 52)
- **Production Site**: ❌ Shows $ symbols (screenshot provided)
- **Root Cause**: Changes committed locally but not deployed to production VPS

### Investigation Steps
1. Check git status and commits
2. Verify deployment status on VPS
3. Determine if rebuild/redeploy needed
4. Check PM2 process status

### Expected Result
All currency displays on https://extremelifeherbal.com should show ₱ symbol

---

## Task 2: Add Sample Products to Production Database

### Objective
Create 10 sample products for testing purposes on production database.

### Products to Add
1. Organic Chamomile Tea - ₱249.99
2. Ginger Turmeric Tea - ₱299.99
3. Vitamin C Supplement - ₱349.99
4. Magnesium Complex - ₱399.99
5. Eucalyptus Essential Oil - ₱449.99
6. Lavender Essential Oil - ₱499.99
7. Peppermint Tea - ₱199.99
8. Zinc Supplement - ₱299.99
9. Tea Tree Oil - ₱399.99
10. Green Tea Extract - ₱349.99

### Implementation
- Created: scripts/add-sample-products.ts
- Method: Direct database insertion via Prisma
- Categories: Herbal Teas, Supplements, Herbal Oils
- Vendor: Use existing seller or create default vendor

### Expected Result
- 10 products visible on /products page
- All prices display with ₱ symbol
- Products searchable and filterable

---

## Task 3: Test Live Selling Features

### Objective
Verify live selling functionality works correctly.

### Test Account
- Email: seller@test.com
- Password: Seller123!
- Role: SELLER

### Features to Test
1. Stream Creation
   - Create new live stream
   - Set title, description, thumbnail
   - Start/end stream

2. Real-Time Chat
   - Send messages during stream
   - Verify message display
   - Test moderation features

3. Flash Sales
   - Create flash sale during stream
   - Set special price and stock limit
   - Verify inventory updates

4. Viewer Tracking
   - Monitor viewer count
   - Track viewer engagement
   - Verify analytics

5. Social Sharing
   - Share stream on social media
   - Track share statistics
   - Verify share links

### Expected Result
All live selling features operational and bug-free

---

## Task 4: Continue Next Steps

### Deliverables
1. Currency verification report
2. Sample products list
3. Live selling test report
4. GitHub commits
5. Production readiness confirmation

### Next Phase
- Phase 20.1: Media Processing Infrastructure
- Deployment to production VPS
- Performance optimization
- Security hardening

---

## Status Tracking

| Task | Status | Commit | Notes |
|------|--------|--------|-------|
| Task 1 | IN PROGRESS | - | Investigating deployment |
| Task 2 | READY | - | Script created, ready to run |
| Task 3 | READY | - | Test account available |
| Task 4 | PENDING | - | Awaiting task completion |

---

## Notes
- Production VPS: 109.205.181.119
- Production URL: https://extremelifeherbal.com
- Local Dev: http://localhost:3001
- Database: Prisma Data Proxy (PostgreSQL)

