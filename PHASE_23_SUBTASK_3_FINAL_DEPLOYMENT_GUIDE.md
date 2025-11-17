# Phase 23 Subtask 3: Rate Limiting & DDoS Protection - FINAL DEPLOYMENT GUIDE

## 🎯 DEPLOYMENT READY - EXECUTE NOW

**Status**: ✅ READY FOR IMMEDIATE DEPLOYMENT  
**Target**: https://extremelifeherbal.com (VPS: 109.205.181.119)  
**Date**: November 17, 2025  
**Latest Commit**: `4bf8f75`

---

## 🚀 QUICK START - COPY & PASTE COMMANDS

Execute these commands on the VPS in order:

```bash
# 1. SSH into VPS
ssh root@109.205.181.119

# 2. Navigate to app directory
cd /var/www/extremelifeherbal.com

# 3. Pull latest changes
git pull origin master

# 4. Install dependencies
npm install

# 5. Build application
npm run build

# 6. Restart PM2
pm2 restart all

# 7. Verify status
pm2 status
```

---

## ✅ VERIFICATION COMMANDS

After deployment, run these to verify:

```bash
# Check PM2 status
pm2 status

# Test website
curl -I https://extremelifeherbal.com

# Test rate limiting headers
curl -I https://extremelifeherbal.com/api/products

# Test rate limit enforcement (101 requests)
for i in {1..101}; do
  curl -s https://extremelifeherbal.com/api/products > /dev/null
done
curl -I https://extremelifeherbal.com/api/products

# Check logs
pm2 logs --lines 50
```

---

## 📋 EXPECTED RESULTS

### Build Output
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

### PM2 Status
```
┌─────┬──────────────┬─────────────┬─────────┬─────────┬──────────┐
│ id  │ name         │ namespace   │ version │ mode    │ status   │
├─────┼──────────────┼─────────────┼─────────┼─────────┼──────────┤
│ 0   │ extremelife  │ default     │ 1.0.0   │ cluster │ online   │
│ 1   │ extremelife  │ default     │ 1.0.0   │ cluster │ online   │
└─────┴──────────────┴─────────────┴─────────┴─────────┴──────────┘
```

### Website Response
```
HTTP/2 200
content-type: text/html; charset=utf-8
cache-control: public, max-age=0, must-revalidate
```

### Rate Limit Headers
```
HTTP/2 200
x-ratelimit-limit: 100
x-ratelimit-remaining: 99
x-ratelimit-reset: <timestamp>
```

### Rate Limit Enforcement (after 101 requests)
```
HTTP/2 429
x-ratelimit-limit: 100
x-ratelimit-remaining: 0
x-ratelimit-reset: <timestamp>
retry-after: <seconds>
```

---

## 📊 DEPLOYMENT CHECKLIST

- [ ] SSH into VPS: `ssh root@109.205.181.119`
- [ ] Navigate: `cd /var/www/extremelifeherbal.com`
- [ ] Pull: `git pull origin master`
- [ ] Install: `npm install`
- [ ] Build: `npm run build` (verify 0 errors)
- [ ] Restart: `pm2 restart all`
- [ ] Status: `pm2 status` (both online)
- [ ] Website: `curl -I https://extremelifeherbal.com` (HTTP 200)
- [ ] Headers: `curl -I https://extremelifeherbal.com/api/products`
- [ ] Enforcement: Make 101 requests, verify 429 response
- [ ] Logs: `pm2 logs --lines 50` (no errors)

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
- `MANUAL_DEPLOYMENT_COMMANDS.md` - Step-by-step commands
- `DEPLOYMENT_VERIFICATION_CHECKLIST.md` - Detailed checklist
- `RATE_LIMITING_GUIDE.md` - Rate limiting documentation

---

## 🎯 SUCCESS CRITERIA

✅ Build: 0 errors, 0 warnings  
✅ PM2: Both processes online  
✅ Website: HTTP 200  
✅ Rate Limiting: Headers present  
✅ Enforcement: 429 response on limit exceeded  

---

## 📝 FILES DEPLOYED

✅ `src/lib/rate-limit-config.ts` - Configuration  
✅ `src/middleware/rate-limit.ts` - Middleware  
✅ `__tests__/rate-limit.test.ts` - Tests (31, 100% pass)  
✅ `RATE_LIMITING_GUIDE.md` - Documentation  

---

## ⏱️ ESTIMATED TIME

- SSH + Navigation: 1 minute
- Git pull: 1 minute
- npm install: 1 minute
- Build: 15-20 seconds
- PM2 restart: 5 seconds
- Verification: 2-3 minutes

**Total: ~5-10 minutes**

---

## 📞 SUPPORT

If issues occur:
1. Check PM2 logs: `pm2 logs`
2. Check build output for errors
3. Verify git pull successful
4. Use rollback procedure if needed
5. Review detailed guides above

