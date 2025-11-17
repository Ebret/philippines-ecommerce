# Phase 23 Subtask 3: Manual Deployment Commands

## 🚀 MANUAL DEPLOYMENT STEPS FOR VPS (109.205.181.119)

Execute these commands on the production VPS in order:

---

## STEP 1: SSH into Production Server

```bash
ssh root@109.205.181.119
```

**Expected**: You will be prompted for the VPS password

---

## STEP 2: Navigate to Application Directory

```bash
cd /var/www/extremelifeherbal.com
```

**Expected**: No output, command succeeds

---

## STEP 3: Pull Latest Changes from GitHub

```bash
git pull origin master
```

**Expected Output**:
```
remote: Enumerating objects: ...
remote: Counting objects: 100% ...
Unpacking objects: 100% ...
From https://github.com/Ebret/philippines-ecommerce
   327b8bf..HEAD  master     -> origin/master
Updating 327b8bf..HEAD
Fast-forward
 src/lib/rate-limit-config.ts                    | 200 ++++
 src/middleware/rate-limit.ts                    | 180 ++++
 __tests__/rate-limit.test.ts                    | 380 +++++++
 RATE_LIMITING_GUIDE.md                          | 200 ++++
 4 files changed, 960 insertions(+)
```

---

## STEP 4: Install Dependencies (if needed)

```bash
npm install
```

**Expected**: Dependencies installed or "up to date"

---

## STEP 5: Build the Application

```bash
npm run build
```

**Expected Output** (last 30 lines):
```
✓ Compiled successfully in 13.9s
✓ Finished TypeScript in 21.6s
✓ Collecting page data in 1800.2ms
✓ Generating static pages (97/97) in 1567.3ms
✓ Finalizing page optimization in 31.0ms

Route (app)
...
ƒ Proxy (Middleware)

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

**Critical**: Verify "0 errors" and "0 warnings"

---

## STEP 6: Restart PM2 Processes

```bash
pm2 restart all
```

**Expected Output**:
```
[PM2] Applying action restartAll on app [all]
[PM2] ✓ Process restarted
```

---

## STEP 7: Verify PM2 Status

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

**Critical**: Both processes must show "online"

---

## VERIFICATION COMMANDS

### Test 1: Website Accessibility

```bash
curl -I https://extremelifeherbal.com
```

**Expected Output**:
```
HTTP/2 200
content-type: text/html; charset=utf-8
cache-control: public, max-age=0, must-revalidate
```

---

### Test 2: Rate Limiting Headers

```bash
curl -I https://extremelifeherbal.com/api/products
```

**Expected Output** (should include):
```
HTTP/2 200
x-ratelimit-limit: 100
x-ratelimit-remaining: 99
x-ratelimit-reset: <timestamp>
```

---

### Test 3: Rate Limit Enforcement

```bash
# Make 101 rapid requests
for i in {1..101}; do
  curl -s https://extremelifeherbal.com/api/products > /dev/null
done

# Check response (should be 429)
curl -I https://extremelifeherbal.com/api/products
```

**Expected Output**:
```
HTTP/2 429
content-type: application/json
x-ratelimit-limit: 100
x-ratelimit-remaining: 0
x-ratelimit-reset: <timestamp>
retry-after: <seconds>
```

---

### Test 4: Check PM2 Logs

```bash
pm2 logs --lines 50
```

**Expected**: No error messages, application running normally

---

## ✅ DEPLOYMENT CHECKLIST

- [ ] SSH connection successful
- [ ] Navigated to `/var/www/extremelifeherbal.com`
- [ ] `git pull origin master` successful
- [ ] `npm install` completed
- [ ] `npm run build` successful (0 errors, 0 warnings)
- [ ] `pm2 restart all` successful
- [ ] `pm2 status` shows both processes "online"
- [ ] `curl -I https://extremelifeherbal.com` returns HTTP 200
- [ ] Rate limit headers present in API response
- [ ] Rate limit enforcement working (429 response)
- [ ] PM2 logs show no errors

---

## 🔄 ROLLBACK PROCEDURE

If deployment fails:

```bash
git revert HEAD
npm run build
pm2 restart all
pm2 status
```

---

## 📝 NOTES

- All files are already committed to GitHub
- Build should complete in ~15-20 seconds
- PM2 restart should complete in ~5 seconds
- Rate limiting will be active immediately after restart
- No database migrations required
- No environment variable changes needed

