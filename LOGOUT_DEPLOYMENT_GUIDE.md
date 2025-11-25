# 🚀 LOGOUT & USER MENU - DEPLOYMENT GUIDE

**Status:** ✅ READY FOR DEPLOYMENT  
**Latest Commit:** 754b7c7  
**Date:** 2025-11-25

---

## 📋 DEPLOYMENT STEPS

### Step 1: SSH to VPS
```bash
ssh root@109.205.181.119
```

### Step 2: Navigate to App Directory
```bash
cd /var/www/html/ecom/app
```

### Step 3: Pull Latest Changes
```bash
git pull origin feature/relivator-ui-integration
```

### Step 4: Install Dependencies (if needed)
```bash
npm install
```

### Step 5: Build Application
```bash
npm run build
```

### Step 6: Restart PM2
```bash
pm2 kill
sleep 3
pm2 start ecosystem.config.js
sleep 10
pm2 status
```

### Step 7: Verify Deployment
```bash
curl -s https://extremelifeherbal.com | head -20
```

---

## 🧪 QUICK TESTING

After deployment, test these URLs:

1. **Homepage:** https://extremelifeherbal.com
2. **Products:** https://extremelifeherbal.com/products
3. **Live Selling:** https://extremelifeherbal.com/live
4. **Vendor Live:** https://extremelifeherbal.com/vendor/live

---

## ✅ VERIFICATION CHECKLIST

- [ ] Navbar appears on all pages
- [ ] User menu shows when logged in
- [ ] Logout button works
- [ ] Redirect to homepage after logout
- [ ] Can login with different account
- [ ] Theme switcher works
- [ ] Mobile menu responsive
- [ ] No console errors

---

## 🔧 TROUBLESHOOTING

### Build Fails
```bash
npm install
npm run build
```

### PM2 Won't Start
```bash
pm2 kill
pm2 start ecosystem.config.js
pm2 logs
```

### Session Issues
```bash
# Clear browser cache and cookies
# Then test login/logout again
```

---

**Ready to deploy!** 🚀

