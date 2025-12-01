# 🎉 Complete Deployment Guide - December 2025

**Date:** December 1, 2025  
**VPS:** 109.205.181.119  
**Status:** ✅ Ready for Deployment

---

## 📦 **What We've Accomplished**

### **✅ Phase 1: UI/UX Integration (100% COMPLETE)**
- Integrated Extreme Life brand identity into Philippines E-Commerce Platform
- Updated **32 files** across **25 pages**
- **15 git commits**
- Latest commit: `dc82792`
- Branch: `feature/relivator-ui-integration`
- Build status: ✓ Compiled successfully

### **✅ Phase 2: Deployment Scripts (100% COMPLETE)**
- Created 4 deployment files (679 lines total)
- Automated deployment scripts
- Comprehensive documentation
- Quick reference guides

---

## 🌐 **Two Sites Available for Deployment**

### **Site 1: Philippines E-Commerce Platform** ⭐ RECOMMENDED
**Domain:** https://extremelifeherbal.com  
**Port:** 3000  
**Location:** `/var/www/html/ecom/app`  
**Branch:** `feature/relivator-ui-integration`

**What's New:**
- ✅ Complete Extreme Life styling (cream/beige background, forest green primary)
- ✅ Serif fonts (Libre Baskerville) for headings
- ✅ Rounded-xl cards with hover effects
- ✅ Rounded-full buttons
- ✅ All 25 pages updated (homepage, products, cart, checkout, account, vendor, admin)

**Features:**
- Full e-commerce (products, cart, checkout, orders)
- User authentication and account management
- Vendor dashboard (products, orders, analytics, earnings)
- Admin dashboard (reports, system, live streams)
- Live selling platform
- Dark mode support
- Mobile responsive

---

### **Site 2: Standalone Extreme Life** (Original Marketing Site)
**Domain:** original.extremelifeherbal.com (configure as needed)  
**Port:** 5000  
**Location:** `/opt/extremelife`  
**Repository:** https://github.com/aurexgold/extremelife.git

**Purpose:**
- Original Extreme Life marketing/informational site
- Lightweight static site
- Can run alongside e-commerce platform

---

## 🚀 **Quick Deployment Instructions**

### **Option A: Deploy E-Commerce Platform** (Recommended First)

```bash
# 1. Connect to VPS
ssh root@109.205.181.119

# 2. Navigate to app directory
cd /var/www/html/ecom/app

# 3. Backup current state (optional)
git branch backup-$(date +%Y%m%d)

# 4. Fetch and checkout new branch
git fetch origin
git checkout feature/relivator-ui-integration
git pull origin feature/relivator-ui-integration

# 5. Verify commit
git log -1 --oneline
# Should show: dc82792 docs: add Extreme Life standalone deployment scripts

# 6. Install dependencies (if needed)
npm install

# 7. Build application
npm run build

# 8. Restart PM2
pm2 kill && sleep 3 && pm2 start ecosystem.config.js

# 9. Check status
pm2 status

# 10. Test site
curl -I https://extremelifeherbal.com
```

**Expected Result:** Site loads with Extreme Life styling (cream background, forest green colors, serif fonts)

---

### **Option B: Deploy Standalone Extreme Life Site**

```bash
# 1. Upload deployment scripts from local machine
scp DEPLOY_EXTREME_LIFE_STANDALONE.sh SETUP_SSL_EXTREME_LIFE.sh root@109.205.181.119:/root/

# 2. Connect to VPS
ssh root@109.205.181.119

# 3. Run deployment script
cd /root
chmod +x DEPLOY_EXTREME_LIFE_STANDALONE.sh
bash DEPLOY_EXTREME_LIFE_STANDALONE.sh

# 4. Configure DNS (Important!)
# Create A record: original.extremelifeherbal.com → 109.205.181.119
# Wait 5-10 minutes for propagation

# 5. Setup SSL certificate
chmod +x SETUP_SSL_EXTREME_LIFE.sh
bash SETUP_SSL_EXTREME_LIFE.sh original.extremelifeherbal.com

# 6. Verify
pm2 status
curl -I https://original.extremelifeherbal.com
```

---

## 📋 **Deployment Files Reference**

| File | Purpose | Location |
|------|---------|----------|
| `DEPLOY_EXTREME_LIFE_STANDALONE.sh` | Automated deployment | philippines-ecommerce/ |
| `SETUP_SSL_EXTREME_LIFE.sh` | SSL setup | philippines-ecommerce/ |
| `EXTREME_LIFE_STANDALONE_DEPLOYMENT_GUIDE.md` | Full guide | philippines-ecommerce/ |
| `QUICK_DEPLOY_COMMANDS.md` | Quick reference | philippines-ecommerce/ |

---

## ✅ **Post-Deployment Verification**

### **E-Commerce Platform Checklist:**
- [ ] Homepage: https://extremelifeherbal.com (cream background visible)
- [ ] Products: https://extremelifeherbal.com/products (forest green filters)
- [ ] Cart: https://extremelifeherbal.com/cart (rounded-xl cards)
- [ ] Checkout: https://extremelifeherbal.com/checkout (serif headings)
- [ ] Login: https://extremelifeherbal.com/auth/login (rounded-full buttons)
- [ ] Account: https://extremelifeherbal.com/account/profile (requires login)
- [ ] Vendor: https://extremelifeherbal.com/vendor/dashboard (requires vendor account)
- [ ] Admin: https://extremelifeherbal.com/admin (requires admin account)
- [ ] Dark mode toggle works
- [ ] Mobile responsive
- [ ] No console errors
- [ ] PM2 status: online

### **Standalone Site Checklist:**
- [ ] Site loads: https://original.extremelifeherbal.com
- [ ] HTTPS certificate valid
- [ ] PM2 process "extreme-life" online
- [ ] Port 5000 accessible
- [ ] Nginx reverse proxy working

---

## 🎨 **Visual Changes to Expect**

**Before (Relivator):**
- White background
- Emerald green primary (#10b981)
- Sans-serif fonts throughout
- Rounded-lg cards
- Gradient buttons

**After (Extreme Life):**
- Cream/beige background (#F9F7F2)
- Deep forest green primary (#2D4A3E)
- Serif fonts for headings (Libre Baskerville)
- Rounded-xl cards (12px)
- Solid rounded-full buttons
- Sage green secondary (#8FBC8F)
- Sandy brown accent (#F4A460)

---

## 🔄 **Rollback Plan**

If issues occur:

```bash
ssh root@109.205.181.119
cd /var/www/html/ecom/app
git checkout backup-$(date +%Y%m%d)
npm run build
pm2 kill && sleep 3 && pm2 start ecosystem.config.js
```

---

## 📊 **Site Comparison**

| Aspect | E-Commerce Platform | Standalone Site |
|--------|-------------------|-----------------|
| **URL** | extremelifeherbal.com | original.extremelifeherbal.com |
| **Port** | 3000 | 5000 |
| **Purpose** | Full e-commerce | Marketing/Info |
| **Features** | 25 pages, full functionality | Static pages |
| **Styling** | Extreme Life (integrated) | Extreme Life (original) |
| **Tech** | Next.js 16, React 19 | Vite, React |

---

## 🆘 **Troubleshooting**

**Build fails:**
```bash
cd /var/www/html/ecom/app
rm -rf .next node_modules
npm install
npm run build
```

**PM2 not starting:**
```bash
pm2 delete all
pm2 start ecosystem.config.js
pm2 logs
```

**Port conflict:**
```bash
lsof -i :5000
kill -9 <PID>
```

---

## 📞 **Ready to Deploy!**

**Recommended Order:**
1. Deploy E-Commerce Platform first (30 min)
2. Test thoroughly
3. Deploy Standalone Site if needed (20 min)

**All files are in:** `philippines-ecommerce/` directory  
**Latest commit:** `dc82792`  
**Branch:** `feature/relivator-ui-integration`

🚀 **Let me know when you're ready to start!**

