# Phase 23 Subtask 3: VPS Manual Deployment Guide

## 🎯 DEPLOYMENT OVERVIEW

**Phase**: Phase 23 Subtask 3: Rate Limiting & DDoS Protection  
**Target**: https://extremelifeherbal.com (VPS: 109.205.181.119)  
**Date**: November 17, 2025  
**Status**: Ready for manual deployment

---

## 🔐 STEP 0: SSH CONNECTION

```bash
ssh root@109.205.181.119
```

**Password**: `4K-6GsnA$3pQ5931`

**Success Indicator**: Prompt shows `root@extremelifeherbal:~#`

---

## 📋 TASK 1: REVIEW CURRENT DEPLOYMENT STATUS

### Command 1: Navigate to App Directory

```bash
cd /var/www/extremelifeherbal.com
```

**Expected**: No output (command succeeds silently)

---

### Command 2: Check Current Git Commit

```bash
git log --oneline -1
```

**Expected Output**:
```
cff082d (HEAD -> master, origin/master) Add final deployment summary for Phase 23 Subtask 3
```

**Success Indicator**: Commit hash is `cff082d` (latest)

---

### Command 3: Check for Phase 23 Subtask 3 Files

```bash
ls -la src/lib/rate-limit-config.ts src/middleware/rate-limit.ts __tests__/rate-limit.test.ts RATE_LIMITING_GUIDE.md
```

**Expected Output**:
```
-rw-r--r-- 1 root root  200 Nov 17 12:00 src/lib/rate-limit-config.ts
-rw-r--r-- 1 root root  180 Nov 17 12:00 src/middleware/rate-limit.ts
-rw-r--r-- 1 root root  380 Nov 17 12:00 __tests__/rate-limit.test.ts
-rw-r--r-- 1 root root  200 Nov 17 12:00 RATE_LIMITING_GUIDE.md
```

**Success Indicator**: All 4 files present

---

### Command 4: Check PM2 Status

```bash
pm2 status
```

**Expected Output**:
```
┌─────┬──────────────┬─────────────┬─────────┬─────────┬──────────┐
│ id  │ name         │ namespace   │ version │ mode    │ status   │
├─────┼──────────────┼─────────────┼─────────┼─────────┼──────────┤
│ 0   │ extremelife  │ default     │ 1.0.0   │ cluster │ online   │
│ 1   │ extremelife  │ default     │ 1.0.0   │ cluster │ online   │
└─────┴──────────────┴─────────────┴─────────┴─────────┴──────────┘
```

**Success Indicator**: Both processes show "online"

---

### Command 5: Check Recent Logs

```bash
pm2 logs --lines 50
```

**Expected**: No ERROR or FATAL messages

---

## 📋 TASK 2: DEPLOYMENT EXECUTION (If Needed)

### If Behind Latest Commit, Execute:

```bash
git pull origin master
npm install
npm run build
pm2 restart all
pm2 status
```

---

## 📋 TASK 3: VERIFICATION

### Command 1: Final Git Commit

```bash
git log --oneline -1
```

**Expected**: `cff082d`

---

### Command 2: Website Accessibility

```bash
curl -I https://extremelifeherbal.com
```

**Expected**: `HTTP/2 200`

---

### Command 3: Rate Limit Headers

```bash
curl -I https://extremelifeherbal.com/api/products
```

**Expected**:
```
HTTP/2 200
x-ratelimit-limit: 100
x-ratelimit-remaining: 99
x-ratelimit-reset: <timestamp>
```

---

### Command 4: Rate Limit Enforcement

```bash
for i in {1..101}; do curl -s https://extremelifeherbal.com/api/products > /dev/null; done; curl -I https://extremelifeherbal.com/api/products
```

**Expected**:
```
HTTP/2 429
x-ratelimit-limit: 100
x-ratelimit-remaining: 0
x-ratelimit-reset: <timestamp>
retry-after: 60
```

---

### Command 5: PM2 Logs

```bash
pm2 logs --lines 50
```

**Expected**: No errors

---

## ✅ SUCCESS CHECKLIST

- [ ] SSH connected to 109.205.181.119
- [ ] Navigated to /var/www/extremelifeherbal.com
- [ ] Git commit is cff082d
- [ ] All 4 files present
- [ ] PM2 status shows both "online"
- [ ] Website returns HTTP 200
- [ ] Rate limit headers present
- [ ] Rate limit enforcement working (429)
- [ ] PM2 logs show no errors

---

## 🔄 ROLLBACK

```bash
git revert HEAD
npm run build
pm2 restart all
pm2 status
```

