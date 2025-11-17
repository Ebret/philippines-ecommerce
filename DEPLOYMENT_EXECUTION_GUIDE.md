# Phase 23 Subtask 3: Deployment Execution Guide

## 🎯 DEPLOYMENT OVERVIEW

**Phase**: Phase 23 Subtask 3: Rate Limiting & DDoS Protection  
**Target**: https://extremelifeherbal.com (VPS: 109.205.181.119)  
**Date**: November 17, 2025  
**Estimated Time**: 5-10 minutes  
**Build Status**: ✅ 0 errors, 0 warnings  
**Test Status**: ✅ 31/31 passing (100%)  
**Latest Commit**: `8be096e`

---

## 🔐 STEP 0: SSH CONNECTION

```bash
ssh root@109.205.181.119
```

**Password**: `4K-6GsnA$3pQ5931`

**Success Indicator**: Prompt shows `root@extremelifeherbal:~#`

---

## 📋 DEPLOYMENT COMMANDS (Copy & Paste Sequentially)

### Command 1: Navigate to App Directory
```bash
cd /var/www/extremelifeherbal.com
```

### Command 2: Pull Latest Changes
```bash
git pull origin master
```

**Expected**: Fast-forward, no conflicts

### Command 3: Install Dependencies
```bash
npm install
```

**Expected**: "up to date" or "added X packages"

### Command 4: Build Application
```bash
npm run build
```

**Expected**: "✓ Compiled successfully", 0 errors, 0 warnings

### Command 5: Restart PM2
```bash
pm2 restart all
```

**Expected**: "✓ Process restarted"

### Command 6: Check PM2 Status
```bash
pm2 status
```

**Expected**: Both processes show "online"

---

## ✅ VERIFICATION COMMANDS (Run After Deployment)

### Verify 1: Git Commit
```bash
git log --oneline -1
```
**Expected**: `8be096e`

### Verify 2: Files Present
```bash
ls -la src/lib/rate-limit-config.ts src/middleware/rate-limit.ts __tests__/rate-limit.test.ts RATE_LIMITING_GUIDE.md
```
**Expected**: All 4 files listed

### Verify 3: Website Accessibility
```bash
curl -I https://extremelifeherbal.com
```
**Expected**: `HTTP/2 200`

### Verify 4: Rate Limit Headers
```bash
curl -I https://extremelifeherbal.com/api/products
```
**Expected**: `x-ratelimit-limit: 100`, `x-ratelimit-remaining: 99`, `x-ratelimit-reset: <timestamp>`

### Verify 5: Rate Limit Enforcement
```bash
for i in {1..101}; do curl -s https://extremelifeherbal.com/api/products > /dev/null; done; curl -I https://extremelifeherbal.com/api/products
```
**Expected**: `HTTP/2 429`, `x-ratelimit-remaining: 0`, `retry-after: <seconds>`

### Verify 6: PM2 Logs
```bash
pm2 logs --lines 50
```
**Expected**: No ERROR or FATAL messages

---

## 📋 DEPLOYMENT CHECKLIST

**Pre-Deployment**:
- [ ] SSH connection successful
- [ ] Password entered correctly
- [ ] Prompt shows: `root@extremelifeherbal:~#`

**Deployment Steps**:
- [ ] Command 1: Navigated to app directory
- [ ] Command 2: git pull successful (Fast-forward)
- [ ] Command 3: npm install completed
- [ ] Command 4: npm run build successful (0 errors, 0 warnings)
- [ ] Command 5: pm2 restart all successful
- [ ] Command 6: pm2 status shows both "online"

**Verification**:
- [ ] Verify 1: Git commit is 8be096e
- [ ] Verify 2: All 4 files present
- [ ] Verify 3: Website returns HTTP 200
- [ ] Verify 4: Rate limit headers present
- [ ] Verify 5: Rate limit enforcement working (429)
- [ ] Verify 6: No errors in PM2 logs

**Final Status**:
- [ ] All checks passed
- [ ] Deployment successful
- [ ] Ready for Phase 23 Subtask 4

---

## 🎯 SUCCESS CRITERIA

✅ Build: 0 errors, 0 warnings  
✅ PM2: Both processes online  
✅ Website: HTTP 200  
✅ Rate Limiting: Headers present  
✅ Enforcement: 429 response on limit exceeded  
✅ Logs: No errors  

---

## 🔄 ROLLBACK (if needed)

```bash
git revert HEAD
npm run build
pm2 restart all
pm2 status
```

---

## 📚 DETAILED GUIDES

For more information, see:
- `PHASE_23_SUBTASK_3_STEP_BY_STEP_DEPLOYMENT.md` - Full guide with expected outputs
- `PHASE_23_QUICK_REFERENCE.md` - Quick reference card
- `MANUAL_DEPLOYMENT_COMMANDS.md` - Detailed commands
- `DEPLOYMENT_VERIFICATION_CHECKLIST.md` - Comprehensive checklist
- `RATE_LIMITING_GUIDE.md` - Rate limiting documentation

---

## ⏱️ TIMING BREAKDOWN

- SSH + Navigation: 1 minute
- git pull: 1 minute
- npm install: 1 minute
- Build: 15-20 seconds
- PM2 restart: 5 seconds
- Verification: 2-3 minutes

**Total: 5-10 minutes**

---

## 📝 DEPLOYMENT INFO

**Implementation Files**:
- `src/lib/rate-limit-config.ts` (200 lines)
- `src/middleware/rate-limit.ts` (180 lines)
- `__tests__/rate-limit.test.ts` (380 lines, 31 tests)
- `RATE_LIMITING_GUIDE.md` (200 lines)

**Git Commits**:
- `20a1679` - Implementation
- `25c5214` - Progress Update
- `9424bbc` - Deployment guides
- `327b8bf` - Deployment status
- `4bf8f75` - Manual commands
- `a08ac09` - Final guide
- `541b238` - Ready summary
- `8be096e` - Step-by-step guides

---

## ✅ READY FOR DEPLOYMENT

All files committed to GitHub. Execute the deployment commands above.

