# Phase 23 Subtask 3: Deployment Verification Checklist

## 📋 PRE-DEPLOYMENT CHECKLIST

### Environment Verification
- [ ] SSH access to VPS (109.205.181.119) available
- [ ] VPS password ready
- [ ] Terminal/SSH client available
- [ ] Internet connection stable

### Code Verification
- [ ] All files committed to GitHub
- [ ] Commits visible: 20a1679, 25c5214, 9424bbc, 327b8bf
- [ ] Local build successful (0 errors)
- [ ] All 31 tests passing locally

---

## 🚀 DEPLOYMENT EXECUTION CHECKLIST

### Step 1: SSH Connection
- [ ] Execute: `ssh root@109.205.181.119`
- [ ] Enter VPS password when prompted
- [ ] Verify prompt shows: `root@extremelifeherbal:~#`

### Step 2: Navigate to Application
- [ ] Execute: `cd /var/www/extremelifeherbal.com`
- [ ] Verify directory exists
- [ ] Verify `package.json` present: `ls -la package.json`

### Step 3: Pull Latest Changes
- [ ] Execute: `git pull origin master`
- [ ] Verify output shows files changed:
  - [ ] `src/lib/rate-limit-config.ts`
  - [ ] `src/middleware/rate-limit.ts`
  - [ ] `__tests__/rate-limit.test.ts`
  - [ ] `RATE_LIMITING_GUIDE.md`
- [ ] Verify no merge conflicts

### Step 4: Install Dependencies
- [ ] Execute: `npm install`
- [ ] Verify completion (should be quick if no changes)
- [ ] No error messages

### Step 5: Build Application
- [ ] Execute: `npm run build`
- [ ] Verify output contains:
  - [ ] "✓ Compiled successfully"
  - [ ] "✓ Finished TypeScript"
  - [ ] "✓ Collecting page data"
  - [ ] "✓ Generating static pages"
  - [ ] "✓ Finalizing page optimization"
- [ ] **CRITICAL**: Verify "0 errors" and "0 warnings"
- [ ] Build completes in ~15-20 seconds

### Step 6: Restart PM2
- [ ] Execute: `pm2 restart all`
- [ ] Verify output shows restart successful
- [ ] No error messages

### Step 7: Verify PM2 Status
- [ ] Execute: `pm2 status`
- [ ] Verify output shows:
  - [ ] Process 0: status = "online"
  - [ ] Process 1: status = "online"
- [ ] Both processes must be "online"

---

## ✅ POST-DEPLOYMENT VERIFICATION

### Test 1: Website Accessibility
- [ ] Execute: `curl -I https://extremelifeherbal.com`
- [ ] Verify response:
  - [ ] HTTP/2 200 (or HTTP/1.1 200)
  - [ ] No 404 or 500 errors
  - [ ] SSL certificate valid

### Test 2: Rate Limiting Headers
- [ ] Execute: `curl -I https://extremelifeherbal.com/api/products`
- [ ] Verify response headers include:
  - [ ] `x-ratelimit-limit: 100`
  - [ ] `x-ratelimit-remaining: 99` (or less)
  - [ ] `x-ratelimit-reset: <timestamp>`
- [ ] Verify HTTP 200 response

### Test 3: Rate Limit Enforcement
- [ ] Execute rate limit test:
  ```bash
  for i in {1..101}; do
    curl -s https://extremelifeherbal.com/api/products > /dev/null
  done
  curl -I https://extremelifeherbal.com/api/products
  ```
- [ ] Verify response:
  - [ ] HTTP 429 (Too Many Requests)
  - [ ] `x-ratelimit-limit: 100`
  - [ ] `x-ratelimit-remaining: 0`
  - [ ] `retry-after: <seconds>`

### Test 4: PM2 Logs
- [ ] Execute: `pm2 logs --lines 50`
- [ ] Verify:
  - [ ] No error messages
  - [ ] No "FATAL" or "ERROR" entries
  - [ ] Application running normally

### Test 5: Login Endpoint Rate Limiting
- [ ] Execute: `curl -I https://extremelifeherbal.com/api/auth/login`
- [ ] Verify rate limit headers present
- [ ] Verify HTTP 200 or 405 (method not allowed)

---

## 📊 DEPLOYMENT SUMMARY

### Build Status
- [ ] Build completed successfully
- [ ] Errors: 0
- [ ] Warnings: 0
- [ ] Build time: ~15-20 seconds

### PM2 Status
- [ ] Process 0: online
- [ ] Process 1: online
- [ ] No crashed processes
- [ ] No pending restarts

### Website Status
- [ ] Accessible via HTTPS
- [ ] SSL certificate valid
- [ ] HTTP 200 responses
- [ ] No 404 or 500 errors

### Rate Limiting Status
- [ ] Headers present in responses
- [ ] Rate limit enforcement working
- [ ] 429 response on limit exceeded
- [ ] Retry-After header present

### Application Status
- [ ] No errors in PM2 logs
- [ ] All endpoints responding
- [ ] Rate limiting active
- [ ] Ready for production use

---

## 🔄 ROLLBACK CHECKLIST (if needed)

- [ ] Execute: `git revert HEAD`
- [ ] Execute: `npm run build`
- [ ] Verify build successful (0 errors)
- [ ] Execute: `pm2 restart all`
- [ ] Verify both processes online
- [ ] Verify website accessible
- [ ] Verify rate limiting disabled

---

## 📝 NOTES

- Deployment should take ~5-10 minutes total
- Build is the longest step (~15-20 seconds)
- No database migrations required
- No environment variable changes needed
- Rate limiting active immediately after restart
- All changes can be rolled back if needed

---

## ✅ FINAL SIGN-OFF

- [ ] All deployment steps completed
- [ ] All verification tests passed
- [ ] Website fully functional
- [ ] Rate limiting working correctly
- [ ] Ready for Phase 23 Subtask 4: CSRF Protection

