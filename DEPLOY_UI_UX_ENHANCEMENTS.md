# 🚀 Deploy UI/UX Enhancements to Production VPS

**Date:** November 26, 2025
**Branch:** `feature/relivator-ui-integration`
**Latest Commit:** `bca7813`
**VPS:** 109.205.181.119
**Website:** https://extremelifeherbal.com

---

## 📋 Quick Deployment (Copy & Paste)

### Option 1: Use PowerShell Script (Recommended)
```powershell
cd philippines-ecommerce
.\deploy-to-vps.ps1
```

### Option 2: Use Bash Script
```bash
ssh root@109.205.181.119 'bash -s' < deploy-to-vps.sh
```

### Option 3: Manual Commands (Step-by-Step)
Copy and paste these commands one by one:

```bash
# Step 1: SSH to VPS
ssh root@109.205.181.119

# Step 2: Navigate to app directory
cd /var/www/html/ecom/app

# Step 3: Check current status
git status
git log -1 --oneline

# Step 4: Pull latest changes
git pull origin feature/relivator-ui-integration

# Step 5: Verify latest commit (should be bca7813 or later)
git log -1 --oneline

# Step 6: Install dependencies
npm install

# Step 7: Build application
npm run build

# Step 8: Stop PM2 processes
pm2 kill

# Step 9: Wait 3 seconds
sleep 3

# Step 10: Start PM2 processes
pm2 start ecosystem.config.js

# Step 11: Check PM2 status
pm2 status

# Step 12: Check website HTTP status
curl -I https://extremelifeherbal.com

# Step 13: Check PM2 logs
pm2 logs --lines 20 --nostream
```

---

## ✅ Expected Results

### Build Output
```
✓ Compiled successfully in 8-10s
✓ Generating static pages (97/97)
Route (app)
├ ○ /
├ ƒ /account/addresses
├ ƒ /account/orders
├ ƒ /account/profile
├ ƒ /account/settings
├ ƒ /vendor/products
├ ƒ /vendor/orders
├ ƒ /vendor/analytics
├ ƒ /vendor/earnings
├ ƒ /admin
... (97 total routes)
```

### PM2 Status
```
┌─────┬──────────┬─────────┬─────────┬─────────┬──────────┐
│ id  │ name     │ mode    │ ↺      │ status  │ cpu      │
├─────┼──────────┼─────────┼─────────┼─────────┼──────────┤
│ 0   │ app      │ cluster │ 0       │ online  │ 0%       │
│ 1   │ app      │ cluster │ 0       │ online  │ 0%       │
└─────┴──────────┴─────────┴─────────┴─────────┴──────────┘
```

### HTTP Status
```
HTTP/2 200
server: nginx
content-type: text/html; charset=utf-8
```

---

## 🧪 Post-Deployment Testing

### 1. Quick Verification (5 minutes)
```bash
# On VPS, check these:
pm2 status                    # Both processes should be "online"
pm2 logs --lines 50          # Check for any errors
curl -I https://extremelifeherbal.com  # Should return HTTP 200
```

### 2. Browser Testing (10 minutes)
1. **Open Website:** https://extremelifeherbal.com
2. **Verify Navbar:** Should see new navigation bar at top with:
   - Logo/brand name
   - Search button
   - Cart button
   - User menu (login/register or user avatar)
   - Theme switcher (sun/moon icon)
3. **Test Login:** Use `buyer@test.com` (Buyer123!)
4. **Test Theme Switcher:** Click theme icon, toggle between Light/Dark/System
5. **Check Console:** Open browser DevTools (F12), check Console tab for errors

### 3. Comprehensive Testing (30 minutes)
Follow the complete testing checklist in `DEPLOYMENT_AND_TESTING_GUIDE.md`

---

## 🐛 Troubleshooting

### Issue: Git pull fails
```bash
# Check git status
git status

# If there are local changes, stash them
git stash

# Try pull again
git pull origin feature/relivator-ui-integration

# If still fails, reset to remote
git fetch origin
git reset --hard origin/feature/relivator-ui-integration
```

### Issue: Build fails
```bash
# Check Node.js version (should be 18+)
node --version

# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Try build again
npm run build
```

### Issue: PM2 processes not starting
```bash
# Check if ecosystem.config.js exists
ls -la ecosystem.config.js

# Check PM2 version
pm2 --version

# Try starting with verbose logging
pm2 start ecosystem.config.js --log-date-format 'YYYY-MM-DD HH:mm:ss'

# Check logs
pm2 logs
```

### Issue: Website returns 502 Bad Gateway
```bash
# Check PM2 status
pm2 status

# Check PM2 logs
pm2 logs --lines 100

# Restart PM2
pm2 restart all

# Check nginx status
systemctl status nginx

# Restart nginx if needed
systemctl restart nginx
```

### Issue: White screen or React errors
```bash
# Check PM2 logs for errors
pm2 logs --lines 100

# Check if .env file exists
ls -la .env

# Verify environment variables
cat .env | grep -v PASSWORD | grep -v SECRET

# Restart application
pm2 restart all
```

---

## 📊 What's Being Deployed

### Pages Updated (22 total)
- ✅ 4 Account pages (profile, orders, addresses, settings)
- ✅ 4 Auth pages (login, register, forgot-password, reset-password)
- ✅ 4 Vendor pages (products, orders, analytics, earnings)
- ✅ 4 Admin pages (dashboard, reports, system, live-streams)
- ✅ 3 Shopping pages (cart, checkout, order-confirmation)
- ✅ 2 Other pages (product detail, footer)
- ✅ 1 New component (Navbar)

### Key Features
- ✅ Modern Navbar with user menu and theme switcher
- ✅ Full dark mode support across all pages
- ✅ Emerald gradient buttons (primary color)
- ✅ Semantic status colors (success, warning, error, info)
- ✅ Smooth transitions on all interactive elements
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ WCAG AA compliant accessibility

---

## 📞 Support

If you encounter any issues:
1. Check PM2 logs: `pm2 logs --lines 100`
2. Check nginx logs: `tail -f /var/log/nginx/error.log`
3. Check build output for specific errors
4. Verify environment variables are set correctly
5. Report issues with screenshots and error messages

---

**Ready to deploy? Run the PowerShell script or follow the manual steps above!** 🚀
