# 🔧 VPS FIX INSTRUCTIONS - Missing Files Issue

## 🔴 Problem Identified

The VPS build is failing because it's missing critical files:
- ✗ `src/lib/auth.ts`
- ✗ `src/components/layout/navbar.tsx`
- ✗ `src/components/ui/button.tsx`, `dialog.tsx`, `input.tsx`, `textarea.tsx`, `alert-dialog.tsx`
- ✗ `src/hooks/use-toast.ts`

**Root Cause:** The VPS doesn't have the latest code from the `feature/relivator-ui-integration` branch.

---

## ✅ Solution: Pull Latest Code and Rebuild

Run these commands in your SSH terminal **in order**:

### **Step 1: Kill all processes**
```bash
pm2 kill
sleep 3
pkill -9 node
sleep 2
```

### **Step 2: Navigate to app directory**
```bash
cd /var/www/html/ecom/app
```

### **Step 3: Check git status**
```bash
git status
```

### **Step 4: Fetch latest from remote**
```bash
git fetch origin
```

### **Step 5: Checkout feature branch**
```bash
git checkout feature/relivator-ui-integration
```

### **Step 6: Pull latest changes**
```bash
git pull origin feature/relivator-ui-integration
```

### **Step 7: Verify critical files exist**
```bash
ls -la src/lib/auth.ts
ls -la src/components/layout/navbar.tsx
ls -la src/components/ui/button.tsx
```

All three should exist. If any are missing, the pull failed.

### **Step 8: Clean up old build**
```bash
rm -rf .next
rm -rf node_modules/.cache
```

### **Step 9: Install dependencies**
```bash
npm install
```

### **Step 10: Build application**
```bash
npm run build 2>&1 | tee build.log
```

**⚠️ IMPORTANT:** Watch the output. It should say "Compiled successfully" at the end.

### **Step 11: Verify build succeeded**
```bash
ls -la .next/build-manifest.json
```

This file should exist. If it doesn't, the build failed.

### **Step 12: Start PM2**
```bash
pm2 start ecosystem.config.js
sleep 10
pm2 status
```

### **Step 13: Check logs**
```bash
pm2 logs --lines 50
```

---

## 🎯 Expected Results

After running all steps:
- ✅ PM2 status shows "online"
- ✅ No errors in PM2 logs
- ✅ Application is running on port 3000
- ✅ https://extremelifeherbal.com is accessible

---

## 🚨 If Build Still Fails

If Step 10 shows build errors, run:

```bash
npm run build 2>&1 | grep -A 10 "error\|Error\|ERROR"
```

Share the output with me so I can identify the specific issue.

---

## 📋 Quick Copy-Paste (All Steps)

```bash
pm2 kill && sleep 3 && pkill -9 node && sleep 2
cd /var/www/html/ecom/app
git fetch origin
git checkout feature/relivator-ui-integration
git pull origin feature/relivator-ui-integration
ls -la src/lib/auth.ts src/components/layout/navbar.tsx src/components/ui/button.tsx
rm -rf .next node_modules/.cache
npm install
npm run build 2>&1 | tee build.log
ls -la .next/build-manifest.json
pm2 start ecosystem.config.js
sleep 10
pm2 status
pm2 logs --lines 50
```

---

**Please run these commands and share the output, especially from the build step!**

