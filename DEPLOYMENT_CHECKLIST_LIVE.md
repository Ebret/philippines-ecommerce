# 🚀 Admin Products Feature - LIVE DEPLOYMENT CHECKLIST

## 📋 DEPLOYMENT EXECUTION CHECKLIST

**Date**: December 4, 2025  
**Feature**: Admin Product Management  
**Target**: Production VPS (109.205.181.119)  
**Status**: EXECUTING NOW

---

## ✅ PRE-DEPLOYMENT

- [x] Build verified locally
- [x] All tests passing (8/8)
- [x] Code committed to feature/relivator-ui-integration
- [x] Documentation complete
- [x] SSH connection established to VPS

---

## 🚀 DEPLOYMENT STEPS

### Step 1: Navigate to App Directory
```bash
cd /var/www/html/ecom/app
```
- [ ] Command executed
- [ ] No errors

### Step 2: Pull Latest Changes
```bash
git fetch origin
git checkout feature/relivator-ui-integration
git pull origin feature/relivator-ui-integration
```
- [ ] Command executed
- [ ] Latest commits pulled
- [ ] No errors

### Step 3: Install Dependencies
```bash
npm install
```
- [ ] Command executed
- [ ] All packages installed
- [ ] No errors

### Step 4: Build Application
```bash
npm run build
```
- [ ] Command executed
- [ ] Build successful
- [ ] 0 errors
- [ ] /admin/products route included

### Step 5: Stop PM2
```bash
pm2 kill
sleep 3
```
- [ ] Command executed
- [ ] PM2 stopped
- [ ] No errors

### Step 6: Clean Up Processes
```bash
pkill -9 node || true
sleep 2
```
- [ ] Command executed
- [ ] Old processes cleaned
- [ ] No errors

### Step 7: Remove Cache
```bash
rm -rf .next
```
- [ ] Command executed
- [ ] Cache removed
- [ ] No errors

### Step 8: Start PM2
```bash
pm2 start ecosystem.config.js
sleep 5
```
- [ ] Command executed
- [ ] PM2 started
- [ ] No errors

### Step 9: Verify PM2 Status
```bash
pm2 status
```
- [ ] Command executed
- [ ] Both processes online
- [ ] No errors

### Step 10: View Logs
```bash
pm2 logs --lines 50
```
- [ ] Command executed
- [ ] No error messages
- [ ] Application running

---

## ✅ POST-DEPLOYMENT VERIFICATION

### HTTP Status Check
```bash
curl -I https://extremelifeherbal.com/admin/products
```
- [ ] Command executed
- [ ] HTTP 200 or 307 status
- [ ] Page accessible

### Browser Testing
- [ ] URL loads: https://extremelifeherbal.com/admin/products
- [ ] Login works: admin@test.com / Admin123!
- [ ] Product grid displays
- [ ] Search functionality works
- [ ] Edit dialog opens
- [ ] Delete dialog opens
- [ ] Toast notifications appear

### Mobile Testing
- [ ] Desktop (1920px) - Full interface
- [ ] Tablet (768px) - Responsive layout
- [ ] Mobile (375px) - Touch-friendly

---

## 📊 EXPECTED RESULTS

✅ HTTP 200 status  
✅ PM2 processes online  
✅ Product grid displays  
✅ Search works  
✅ Edit/Delete dialogs open  
✅ Mobile responsive  
✅ No errors in logs  

---

## 🎯 DEPLOYMENT STATUS

**Overall Status**: ⏳ IN PROGRESS  
**Current Step**: Awaiting execution  
**Issues**: None yet  

---

## 📞 SUPPORT

If you encounter any issues:
1. Check PM2 logs: `pm2 logs`
2. Review DEPLOYMENT_STEPS_FOR_VPS.md
3. Check troubleshooting section

---

**Execute the deployment steps above and report results!**

