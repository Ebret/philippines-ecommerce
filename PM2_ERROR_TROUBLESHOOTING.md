# 🔧 PM2 ERROR TROUBLESHOOTING GUIDE

**Status:** PM2 showing "errored" after restart

**Issue:** Application crashed after build

---

## 🚨 IMMEDIATE FIX - EXECUTE ON VPS

### Step 1: Kill PM2 Completely
```bash
pm2 kill
sleep 5
pkill -9 node
sleep 2
```

### Step 2: Check PM2 Logs
```bash
cd /var/www/html/ecom/app
pm2 logs philippines-ecommerce --lines 100 --nostream
```

**Look for error messages like:**
- `Cannot find module`
- `ENOENT: no such file or directory`
- `SyntaxError`
- `TypeError`
- `ReferenceError`

### Step 3: Verify Build Artifacts
```bash
ls -la .next/
ls -la node_modules/ | head -20
```

### Step 4: Restart PM2
```bash
pm2 start ecosystem.config.js
sleep 10
pm2 status
```

### Step 5: Check Application Status
```bash
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" https://extremelifeherbal.com
```

---

## 🔍 COMMON ISSUES & FIXES

### Issue 1: Missing Dependencies
**Error:** `Cannot find module`

**Fix:**
```bash
npm install
npm run build
pm2 restart ecosystem.config.js
```

### Issue 2: Build Artifacts Corrupted
**Error:** `.next` directory issues

**Fix:**
```bash
rm -rf .next
npm run build
pm2 restart ecosystem.config.js
```

### Issue 3: Port Already in Use
**Error:** `EADDRINUSE: address already in use`

**Fix:**
```bash
lsof -i :3000
kill -9 <PID>
pm2 start ecosystem.config.js
```

### Issue 4: Environment Variables Missing
**Error:** `undefined` or `null` values

**Fix:**
```bash
cat .env.production | grep -E "DATABASE_URL|NEXTAUTH"
# Verify all required variables are set
```

---

## 📋 VERIFICATION CHECKLIST

- [ ] PM2 killed successfully
- [ ] Node processes killed
- [ ] PM2 logs checked for errors
- [ ] Build artifacts verified
- [ ] PM2 restarted
- [ ] PM2 status shows "online"
- [ ] Homepage returns HTTP 200
- [ ] No errors in PM2 logs

---

**Status:** Ready for troubleshooting

