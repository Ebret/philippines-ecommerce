# 🔧 FIX VPS DEPLOYMENT CONFLICT

**Issue:** Untracked files conflict + missing tailwindcss dependency  
**Solution:** Clean up and reinstall properly

---

## 🚀 QUICK FIX (Run on VPS)

```bash
cd /var/www/html/ecom/app

# Step 1: Stash any local changes
git stash

# Step 2: Clean untracked files
git clean -fd

# Step 3: Reset to feature branch
git reset --hard origin/feature/relivator-ui-integration

# Step 4: Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Step 5: Build
npm run build

# Step 6: Restart PM2
pm2 restart philippines-ecommerce
sleep 5
pm2 status

# Step 7: Verify
curl -I https://extremelifeherbal.com/
```

---

## 📝 DETAILED EXPLANATION

### What went wrong:
1. VPS had untracked local files (ecosystem.config.js, package.json, etc.)
2. Git couldn't checkout feature branch due to conflicts
3. Build failed because tailwindcss wasn't installed

### What the fix does:
1. `git stash` - Saves any local changes
2. `git clean -fd` - Removes untracked files
3. `git reset --hard` - Forces checkout of feature branch
4. `rm -rf node_modules` - Clears old dependencies
5. `npm install` - Installs all dependencies including tailwindcss
6. `npm run build` - Builds the application
7. `pm2 restart` - Restarts the application

---

## ✅ VERIFICATION

After running the fix, verify:
```bash
# Check PM2 status
pm2 status

# Check if app is running
curl -I https://extremelifeherbal.com/

# Check logs
pm2 logs philippines-ecommerce --lines 50
```

---

**Status:** Run the quick fix above to resolve the deployment conflict!

