# Phase 23 Subtask 3: Rate Limiting & DDoS Protection - Deployment Guide

## 📋 Deployment Overview

**Target**: https://extremelifeherbal.com (VPS: 109.205.181.119)  
**Date**: November 17, 2025  
**Components**: Rate Limiting & DDoS Protection  
**Status**: Ready for Production Deployment

---

## 🚀 Deployment Steps

### Step 1: SSH into Production Server

```bash
ssh root@109.205.181.119
```

### Step 2: Navigate to Application Directory

```bash
cd /var/www/extremelifeherbal.com
```

### Step 3: Pull Latest Changes

```bash
git pull origin master
```

### Step 4: Install Dependencies (if needed)

```bash
npm install
```

### Step 5: Build Application

```bash
npm run build
```

**Expected Output**:
- ✅ Compiled successfully
- ✅ Finished TypeScript
- ✅ Collecting page data
- ✅ Generating static pages
- ✅ 0 errors, 0 warnings

### Step 6: Restart PM2 Processes

```bash
pm2 restart all
pm2 status
```

**Expected Output**:
- Both processes should show "online" status
- No errors in PM2 logs

### Step 7: Verify Deployment

```bash
curl -I https://extremelifeherbal.com
```

**Expected Output**:
- HTTP/2 200 OK
- SSL certificate valid
- Rate limit headers present

---

## ✅ Post-Deployment Verification

### 1. Check PM2 Status

```bash
pm2 status
pm2 logs
```

### 2. Test Website Accessibility

```bash
curl -I https://extremelifeherbal.com
```

### 3. Verify Rate Limiting Headers

```bash
curl -I https://extremelifeherbal.com/api/products
```

Look for headers:
- `X-RateLimit-Limit: 100`
- `X-RateLimit-Remaining: 99`
- `X-RateLimit-Reset: <timestamp>`

### 4. Test Rate Limit Enforcement

```bash
# Make multiple rapid requests to trigger rate limit
for i in {1..101}; do
  curl -s https://extremelifeherbal.com/api/products > /dev/null
done

# Should receive 429 Too Many Requests
curl -I https://extremelifeherbal.com/api/products
```

---

## 📊 Deployment Checklist

- [ ] SSH access to VPS verified
- [ ] Git pull successful
- [ ] npm install completed
- [ ] npm run build successful (0 errors)
- [ ] PM2 restart completed
- [ ] Both PM2 processes online
- [ ] Website accessible at https://extremelifeherbal.com
- [ ] SSL certificate valid
- [ ] Rate limit headers present
- [ ] Rate limit enforcement working (429 response)

---

## 🔄 Rollback Procedure

If issues occur, rollback to previous version:

```bash
git revert HEAD
npm run build
pm2 restart all
```

---

## 📝 Files Deployed

- ✅ `src/lib/rate-limit-config.ts` - Configuration
- ✅ `src/middleware/rate-limit.ts` - Middleware
- ✅ `__tests__/rate-limit.test.ts` - Tests
- ✅ `RATE_LIMITING_GUIDE.md` - Documentation

---

## 🎯 Success Criteria

✅ Build completes with 0 errors  
✅ PM2 processes online  
✅ Website accessible  
✅ Rate limit headers present  
✅ Rate limit enforcement working  

---

## 📞 Support

For issues, check:
1. PM2 logs: `pm2 logs`
2. Application logs: `/var/www/extremelifeherbal.com/.next/logs`
3. System resources: `free -h`, `df -h`

