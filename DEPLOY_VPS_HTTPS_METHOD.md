# 🚀 DEPLOY USING HTTPS METHOD (No SSH Keys Needed)

**Status:** Alternative deployment method using HTTPS  
**VPS:** 109.205.181.119  
**Branch:** feature/relivator-ui-integration

---

## 🎯 DEPLOYMENT STEPS (HTTPS Method)

### Step 1: Configure Git to Use HTTPS
```bash
cd /var/www/html/ecom/app
git remote set-url origin https://github.com/Ebret/philippines-ecommerce.git
```

### Step 2: Verify Remote URL
```bash
git remote -v
```

**Expected output:**
```
origin  https://github.com/Ebret/philippines-ecommerce.git (fetch)
origin  https://github.com/Ebret/philippines-ecommerce.git (push)
```

### Step 3: Fetch Latest Changes
```bash
git fetch origin
```

### Step 4: Checkout Feature Branch
```bash
git checkout feature/relivator-ui-integration
```

### Step 5: Pull Latest Changes
```bash
git pull origin feature/relivator-ui-integration
```

### Step 6: Install Dependencies
```bash
npm install --production
```

### Step 7: Build Application
```bash
npm run build
```

### Step 8: Restart PM2
```bash
pm2 restart ecom-app
sleep 5
pm2 status
```

### Step 9: Verify Deployment
```bash
# Test all pages
curl -I https://extremelifeherbal.com/
curl -I https://extremelifeherbal.com/account/profile
curl -I https://extremelifeherbal.com/vendor/dashboard
curl -I https://extremelifeherbal.com/admin
```

---

## 📝 COMPLETE DEPLOYMENT SCRIPT

Copy and paste this entire block:

```bash
#!/bin/bash
set -e

cd /var/www/html/ecom/app

echo "🔄 Configuring Git for HTTPS..."
git remote set-url origin https://github.com/Ebret/philippines-ecommerce.git

echo "🔄 Fetching latest changes..."
git fetch origin

echo "🔄 Checking out feature branch..."
git checkout feature/relivator-ui-integration

echo "🔄 Pulling latest changes..."
git pull origin feature/relivator-ui-integration

echo "📦 Installing dependencies..."
npm install --production

echo "🔨 Building application..."
npm run build

echo "🔄 Restarting PM2..."
pm2 restart ecom-app
sleep 5

echo "✅ Deployment complete!"
pm2 status

echo ""
echo "🔍 Verifying deployment..."
curl -I https://extremelifeherbal.com/
curl -I https://extremelifeherbal.com/account/profile
curl -I https://extremelifeherbal.com/vendor/dashboard
curl -I https://extremelifeherbal.com/admin
```

---

## ✅ VERIFICATION CHECKLIST

After deployment:
- [ ] All pages return HTTP 200
- [ ] Homepage loads: https://extremelifeherbal.com/
- [ ] Account profile: https://extremelifeherbal.com/account/profile
- [ ] Vendor dashboard: https://extremelifeherbal.com/vendor/dashboard
- [ ] Admin dashboard: https://extremelifeherbal.com/admin
- [ ] Dark mode works
- [ ] No console errors
- [ ] PM2 status shows "online"

---

## 🆘 TROUBLESHOOTING

### If Git Still Fails
```bash
# Check current remote
git remote -v

# Reset to HTTPS if needed
git remote set-url origin https://github.com/Ebret/philippines-ecommerce.git

# Try again
git fetch origin
```

### If Build Fails
```bash
cd /var/www/html/ecom/app
rm -rf node_modules .next
npm install --production
npm run build
```

### If PM2 Won't Restart
```bash
pm2 stop ecom-app
pm2 delete ecom-app
pm2 start ecosystem.config.js
```

---

**Status:** Ready for HTTPS-based deployment

