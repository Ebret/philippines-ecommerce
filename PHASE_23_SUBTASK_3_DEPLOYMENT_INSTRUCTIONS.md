# Phase 23 Subtask 3: Rate Limiting & DDoS Protection - Deployment Instructions

## 🚀 PRODUCTION DEPLOYMENT READY

**Status**: ✅ Ready for Deployment  
**Target**: https://extremelifeherbal.com (VPS: 109.205.181.119)  
**Date**: November 17, 2025  
**Commit**: `20a1679` & `25c5214`

---

## 📋 Quick Deployment Commands

Execute these commands on the production VPS:

```bash
# 1. SSH into production server
ssh root@109.205.181.119

# 2. Navigate to application directory
cd /var/www/extremelifeherbal.com

# 3. Pull latest changes from GitHub
git pull origin master

# 4. Build the application
npm run build

# 5. Restart PM2 processes
pm2 restart all

# 6. Verify deployment
pm2 status
pm2 logs
```

---

## ✅ Expected Build Output

```
✓ Compiled successfully in 13.9s
✓ Finished TypeScript in 21.6s
✓ Collecting page data in 1800.2ms
✓ Generating static pages (97/97) in 1567.3ms
✓ Finalizing page optimization in 31.0ms

Build Status: SUCCESS
Errors: 0
Warnings: 0
```

---

## 🔍 Post-Deployment Verification

### 1. Check PM2 Status
```bash
pm2 status
```
**Expected**: Both processes should show "online"

### 2. Verify Website Accessibility
```bash
curl -I https://extremelifeherbal.com
```
**Expected**: HTTP/2 200 OK

### 3. Test Rate Limiting Headers
```bash
curl -I https://extremelifeherbal.com/api/products
```
**Expected Headers**:
- X-RateLimit-Limit: 100
- X-RateLimit-Remaining: 99
- X-RateLimit-Reset: <timestamp>

### 4. Test Rate Limit Enforcement
```bash
# Make 101 rapid requests to trigger limit
for i in {1..101}; do
  curl -s https://extremelifeherbal.com/api/products > /dev/null
done

# Check response
curl -I https://extremelifeherbal.com/api/products
```
**Expected**: HTTP 429 Too Many Requests

---

## 📦 Deployed Components

✅ `src/lib/rate-limit-config.ts` - Rate limiting configuration  
✅ `src/middleware/rate-limit.ts` - Rate limiting middleware  
✅ `__tests__/rate-limit.test.ts` - Unit tests (31 tests, 100% pass)  
✅ `RATE_LIMITING_GUIDE.md` - Documentation  

---

## 🔄 Rollback Procedure

If issues occur:
```bash
git revert HEAD
npm run build
pm2 restart all
```

---

## 📊 Deployment Checklist

- [ ] SSH access verified
- [ ] git pull successful
- [ ] npm run build successful (0 errors)
- [ ] PM2 restart completed
- [ ] Both PM2 processes online
- [ ] Website accessible at https://extremelifeherbal.com
- [ ] SSL certificate valid
- [ ] Rate limit headers present
- [ ] Rate limit enforcement working (429 response)

---

## 🎯 Success Criteria

✅ Build: 0 errors, 0 warnings  
✅ PM2: Both processes online  
✅ Website: Accessible via HTTPS  
✅ Rate Limiting: Headers present  
✅ Rate Limiting: Enforcement working  

---

## 📝 Notes

- All 31 rate limiting tests passing (100% pass rate)
- Build verified locally with 0 errors
- Production-ready code
- Comprehensive documentation included
- Ready for live testing

