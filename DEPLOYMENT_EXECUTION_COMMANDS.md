# UI/UX Enhancement Deployment - Execution Commands
## Philippines E-Commerce Platform

**VPS**: 109.205.181.119  
**Branch**: feature/relivator-ui-integration  
**Date**: December 3, 2025

---

## DEPLOYMENT STEPS

### Step 1: SSH into VPS
```bash
ssh root@109.205.181.119
```

### Step 2: Navigate to App Directory
```bash
cd /var/www/html/ecom/app
```

### Step 3: Verify Current Status
```bash
git log --oneline -1
pm2 status
```

### Step 4: Pull Latest Changes
```bash
git pull origin feature/relivator-ui-integration
```

**Expected Output:**
```
From github.com:Ebret/philippines-ecommerce
 * branch            feature/relivator-ui-integration -> FETCH_HEAD
Already up to date.
```

### Step 5: Clean Build Cache
```bash
rm -rf .next
```

### Step 6: Build Application
```bash
npm run build
```

**Expected Output:**
```
Creating an optimized production build ...
✓ Compiled successfully in 13.0s
Running TypeScript ...
Collecting page data ...
✓ Generating static pages (97/97)
✓ Finalizing page optimization
```

### Step 7: Restart PM2
```bash
pm2 restart all
sleep 3
pm2 status
```

**Expected Output:**
```
[PM2] Restarting app in cluster mode ...
[PM2] App successfully started
┌─────┬──────────┬──────────┬──────┬───────────┬──────────┐
│ id  │ name     │ mode     │ ↺    │ status    │ cpu      │
├─────┼──────────┼──────────┼──────┼───────────┼──────────┤
│ 0   │ app      │ cluster  │ 0    │ online    │ 0%       │
│ 1   │ app      │ cluster  │ 0    │ online    │ 0%       │
└─────┴──────────┴──────────┴──────┴───────────┴──────────┘
```

### Step 8: Verify Deployment
```bash
curl -I https://extremelifeherbal.com
```

**Expected Output:**
```
HTTP/2 200
content-type: text/html; charset=utf-8
cache-control: public, max-age=0, must-revalidate
```

### Step 9: Check Logs
```bash
pm2 logs
```

---

## POST-DEPLOYMENT VERIFICATION

### Browser Testing
1. **Hard Refresh**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. **Check Console**: F12 → Console tab (should be no errors)
3. **Test Features**:
   - Hover over logo (should show underline animation)
   - Hover over navigation items (should show gradient underline)
   - Click mobile menu (should slide in smoothly)
   - Test search bar (should show focus glow)
   - Navigate to /admin (should show KPI cards with icons)
   - Toggle dark/light mode (should update all colors)

### Performance Check
```bash
# Monitor PM2
pm2 monit

# Check logs for errors
pm2 logs | grep -i error

# Verify build output
ls -la .next
```

---

## ROLLBACK PROCEDURE (If Needed)

If issues occur, rollback to previous commit:

```bash
cd /var/www/html/ecom/app
git log --oneline -5
git reset --hard <previous-commit-hash>
rm -rf .next
npm run build
pm2 restart all
```

---

## DEPLOYMENT CHECKLIST

- [ ] SSH into VPS successfully
- [ ] Navigated to app directory
- [ ] Verified current status
- [ ] Pulled latest changes
- [ ] Cleaned build cache
- [ ] Build completed successfully
- [ ] PM2 restarted
- [ ] Deployment verified (HTTP 200)
- [ ] Browser testing completed
- [ ] No console errors
- [ ] All features working

---

## SUPPORT

For issues:
1. Check PM2 logs: `pm2 logs`
2. Verify git status: `git status`
3. Check build output: `npm run build`
4. Review browser console for errors

**Status**: ✅ READY FOR DEPLOYMENT

