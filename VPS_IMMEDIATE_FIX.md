# 🚨 VPS IMMEDIATE FIX - RUN NOW

## The Issue
VPS has old code. Build fails because files are missing.

## The Fix
Run these commands **ONE BY ONE** in your SSH terminal:

---

## ✅ COMMAND 1: Kill all processes
```bash
pm2 kill
sleep 3
pkill -9 node
sleep 2
```

---

## ✅ COMMAND 2: Navigate to app
```bash
cd /var/www/html/ecom/app
```

---

## ✅ COMMAND 3: Check current branch
```bash
git branch
```

**Expected output:** Should show `feature/relivator-ui-integration` or `main`

---

## ✅ COMMAND 4: Fetch latest
```bash
git fetch origin
```

---

## ✅ COMMAND 5: Reset to latest
```bash
git reset --hard origin/feature/relivator-ui-integration
```

This will **overwrite** any local changes and get the exact code from GitHub.

---

## ✅ COMMAND 6: Verify files exist
```bash
ls -la src/lib/auth.ts
ls -la src/components/layout/navbar.tsx
ls -la src/components/ui/button.tsx
ls -la src/hooks/use-toast.ts
```

All 4 should show "No such file or directory" is WRONG. They should exist.

---

## ✅ COMMAND 7: Clean build
```bash
rm -rf .next node_modules/.cache
```

---

## ✅ COMMAND 8: Install
```bash
npm install
```

---

## ✅ COMMAND 9: Build
```bash
npm run build
```

**Watch for:** "Compiled successfully" at the end

---

## ✅ COMMAND 10: Start PM2
```bash
pm2 start ecosystem.config.js
sleep 10
pm2 status
```

---

## ✅ COMMAND 11: Check logs
```bash
pm2 logs --lines 50
```

---

## 🎯 Expected Results
- ✅ All 4 files exist
- ✅ Build completes successfully
- ✅ PM2 shows "online"
- ✅ No errors in logs

---

## 🚨 If Still Fails
Run this to see the error:
```bash
npm run build 2>&1 | tail -50
```

Share the output.

