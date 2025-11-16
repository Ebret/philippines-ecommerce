# Phase 22 Manual Production Deployment Steps

## 📋 CURRENT STATUS

✅ **Production Server**: Online (HTTP 200)
✅ **All URLs Accessible**:
- https://extremelifeherbal.com (HTTP 200)
- https://extremelifeherbal.com/about (HTTP 200)
- https://extremelifeherbal.com/contact (HTTP 200)
- https://extremelifeherbal.com/products (HTTP 200)
- https://extremelifeherbal.com/cart (HTTP 200)
- https://extremelifeherbal.com/checkout (HTTP 200)

---

## 🚀 MANUAL DEPLOYMENT INSTRUCTIONS

### **Step 1: SSH into Production Server**
```bash
ssh root@109.205.181.119
# Enter password when prompted
```

### **Step 2: Navigate to Project Directory**
```bash
cd /var/www/philippines-ecommerce
pwd  # Verify you're in the correct directory
```

### **Step 3: Pull Latest Changes from GitHub**
```bash
git pull origin master
```

Expected output:
```
From https://github.com/Ebret/philippines-ecommerce
 * branch            master     -> FETCH_HEAD
Already up to date.
# OR
Updating 55fc421..75f25df
Fast-forward
 deploy-to-production.ps1                    | 50 ++++++++++++++++++++++
 PHASE_22_DEPLOYMENT_SUMMARY.md              | 145 ++++++++++++++++++++++
 2 files changed, 195 insertions(+)
```

### **Step 4: Install Dependencies**
```bash
npm install
```

### **Step 5: Build the Application**
```bash
npm run build
```

Expected output:
```
✓ Compiled successfully
✓ 97 static pages generated
```

### **Step 6: Restart PM2 Process**
```bash
pm2 restart philippines-ecommerce
pm2 save
```

### **Step 7: Verify Deployment**
```bash
pm2 logs philippines-ecommerce --lines 20
```

---

## ✅ POST-DEPLOYMENT VERIFICATION

### **Check PM2 Status**
```bash
pm2 status
```

### **Check Application Logs**
```bash
pm2 logs philippines-ecommerce
```

### **Test URLs**
```bash
curl -I https://extremelifeherbal.com
curl -I https://extremelifeherbal.com/about
curl -I https://extremelifeherbal.com/contact
```

---

## 📊 DEPLOYMENT CHECKLIST

- [ ] SSH connection successful
- [ ] Navigated to /var/www/philippines-ecommerce
- [ ] git pull completed
- [ ] npm install completed
- [ ] npm run build completed
- [ ] pm2 restart completed
- [ ] pm2 save completed
- [ ] PM2 logs show no errors
- [ ] All URLs return HTTP 200
- [ ] Dark/light theme working
- [ ] Responsive design verified

---

## ⏱️ ESTIMATED TIME

- git pull: 1-2 minutes
- npm install: 2-3 minutes
- npm run build: 5-10 minutes
- pm2 restart: 1 minute
- **Total: 10-15 minutes**

---

## 🔄 ROLLBACK PROCEDURE

If deployment fails:
```bash
git reset --hard HEAD~1
npm run build
pm2 restart philippines-ecommerce
```

---

## 📝 NOTES

- All changes are backward compatible
- No database migrations required
- HTTPS certificate already installed
- PM2 auto-restart enabled
- Monitoring script running 24/7

**Status**: Ready for manual deployment

