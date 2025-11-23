# 🔧 STEP-BY-STEP PM2 FIX GUIDE

**Status:** PM2 showing "errored" - Follow these steps exactly

---

## 📋 STEP 1: KILL PM2 & NODE PROCESSES

```bash
pm2 kill
sleep 3
pkill -9 node
sleep 2
```

**Expected:** No output or "PM2 killed"

---

## 📋 STEP 2: CHECK ENVIRONMENT VARIABLES

```bash
cat .env.production | grep -E "DATABASE_URL|NEXTAUTH_SECRET|NEXTAUTH_URL"
```

**Expected Output:**
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/philippines_ecommerce?schema=public&connection_limit=5&pool_timeout=10
NEXTAUTH_SECRET=<your-secret>
NEXTAUTH_URL=https://extremelifeherbal.com
```

**If missing:** Add them to .env.production

---

## 📋 STEP 3: VERIFY BUILD ARTIFACTS

```bash
ls -la .next/ | head -10
du -sh .next/
```

**Expected:** .next directory with size > 50MB

**If missing:** Run `npm run build`

---

## 📋 STEP 4: CHECK NODE_MODULES

```bash
ls -la node_modules | head -10
ls node_modules | wc -l
```

**Expected:** 700+ packages

**If missing:** Run `npm install`

---

## 📋 STEP 5: VERIFY ECOSYSTEM.CONFIG.JS

```bash
cat ecosystem.config.js | head -30
```

**Expected:** Valid PM2 configuration

---

## 📋 STEP 6: START PM2

```bash
pm2 start ecosystem.config.js
sleep 10
pm2 status
```

**Expected:** Status shows "online"

---

## 📋 STEP 7: CHECK LOGS

```bash
pm2 logs philippines-ecommerce --lines 100 --nostream
```

**Look for errors like:**
- `Cannot find module`
- `SyntaxError`
- `TypeError`
- `ReferenceError`
- `ENOENT`

---

## 📋 STEP 8: TEST APPLICATION

```bash
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" https://extremelifeherbal.com
```

**Expected:** HTTP Status: 200

---

## ✅ SUCCESS INDICATORS

- ✅ PM2 status shows "online"
- ✅ Homepage returns HTTP 200
- ✅ No errors in PM2 logs
- ✅ Application responding

---

**If still errored:** Share the PM2 logs output

