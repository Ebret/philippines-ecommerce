# Quick Deployment Guide - Enhanced Botanical Theme

**Target:** VPS 109.205.181.119  
**URL:** https://extremelifeherbal.com  
**Branch:** feature/relivator-ui-integration  
**Latest Commit:** 5d1c5fe

---

## 🚀 Quick Deployment (5 Minutes)

### **Option 1: Using PuTTY or SSH Client**

1. **Open PuTTY or your SSH client**
   - Host: `109.205.181.119`
   - Port: `22`
   - Username: `root`
   - Connect

2. **Copy and paste these commands:**

```bash
# Navigate to app directory
cd /var/www/html/ecom/app

# Create backup
git branch backup-theme-$(date +%Y%m%d-%H%M%S)

# Fetch and checkout
git fetch origin
git checkout feature/relivator-ui-integration
git pull origin feature/relivator-ui-integration

# Build
npm run build

# Restart
pm2 kill && sleep 3 && pm2 start ecosystem.config.js && pm2 save

# Check status
pm2 status
```

3. **Verify deployment:**
   - Open https://extremelifeherbal.com in your browser
   - You should see the new warm cream background (#F7F5F0)
   - Text should be deep forest green (#1E2E24)
   - Headings should use Libre Baskerville serif font

---

## 📋 Detailed Step-by-Step

### **Step 1: Connect to VPS**
```bash
ssh root@109.205.181.119
```

### **Step 2: Navigate to Application**
```bash
cd /var/www/html/ecom/app
pwd
# Should show: /var/www/html/ecom/app
```

### **Step 3: Check Current Status**
```bash
git branch --show-current
git log -1 --oneline
pm2 status
```

### **Step 4: Create Backup Branch**
```bash
BACKUP_BRANCH="backup-theme-$(date +%Y%m%d-%H%M%S)"
git branch $BACKUP_BRANCH
echo "Backup created: $BACKUP_BRANCH"
```

### **Step 5: Fetch Latest Changes**
```bash
git fetch origin
```

### **Step 6: Checkout Feature Branch**
```bash
git checkout feature/relivator-ui-integration
```

### **Step 7: Pull Latest Changes**
```bash
git pull origin feature/relivator-ui-integration
```

### **Step 8: Verify Commit**
```bash
git log -3 --oneline
# Should show commit 5d1c5fe or later with message about deployment script
```

### **Step 9: Install Dependencies (if needed)**
```bash
npm install
```

### **Step 10: Build Application**
```bash
npm run build
# This will take 1-2 minutes
# Wait for "✓ Compiled successfully"
```

### **Step 11: Stop PM2**
```bash
pm2 kill
```

### **Step 12: Wait 3 Seconds**
```bash
sleep 3
```

### **Step 13: Start PM2**
```bash
pm2 start ecosystem.config.js
```

### **Step 14: Save PM2 Configuration**
```bash
pm2 save
```

### **Step 15: Check PM2 Status**
```bash
pm2 status
# Both processes should show "online"
```

### **Step 16: Check Logs**
```bash
pm2 logs --lines 20
# Press Ctrl+C to exit
```

### **Step 17: Test Local Access**
```bash
curl -I http://localhost:3000
# Should return HTTP 200 or 304
```

### **Step 18: Test External Access**
```bash
curl -I https://extremelifeherbal.com
# Should return HTTP 200 or 304
```

---

## ✅ Visual Verification Checklist

Open https://extremelifeherbal.com in your browser and verify:

### **Light Mode (Default)**
- [ ] Background is warm cream (#F7F5F0), not pure white
- [ ] Text is deep forest green (#1E2E24), very dark and readable
- [ ] Headings use Libre Baskerville serif font (elegant, traditional)
- [ ] Primary buttons are forest green (#214A38) with white text
- [ ] Cards have 2px sage green borders (thicker than before)
- [ ] Hover effects work (cards lift up, buttons darken)

### **Dark Mode**
- [ ] Click the theme toggle (moon/sun icon)
- [ ] Background changes to deep forest night (#0F1812)
- [ ] Text changes to warm cream (#F2EDE3)
- [ ] Primary color is bright forest green (#45A370)
- [ ] Cards are slightly lighter than background
- [ ] All text remains highly readable

### **Typography**
- [ ] Body text has comfortable line-height (1.7)
- [ ] Headings are bold and use serif font
- [ ] Text is easy to read at all sizes
- [ ] Links underline on hover

### **Components**
- [ ] Product cards have visible 2px borders
- [ ] Buttons have pill shape (fully rounded)
- [ ] Form inputs have 2px borders
- [ ] Focus rings appear when tabbing (3px solid)
- [ ] Shopee badge is vibrant orange
- [ ] Lazada badge is deep blue

---

## 🔄 Rollback (If Needed)

If something goes wrong, rollback to the backup:

```bash
# List backup branches
git branch | grep backup-theme

# Checkout the backup (replace with your backup name)
git checkout backup-theme-YYYYMMDD-HHMMSS

# Rebuild
npm run build

# Restart
pm2 restart all

# Verify
pm2 status
```

---

## 🐛 Troubleshooting

### **Build Fails**
```bash
# Check Node.js version
node -v
# Should be v20.x or higher

# Clear cache and rebuild
rm -rf .next
npm run build
```

### **PM2 Won't Start**
```bash
# Check if port 3000 is in use
netstat -tulpn | grep :3000

# Kill any process on port 3000
kill -9 $(lsof -t -i:3000)

# Try starting again
pm2 start ecosystem.config.js
```

### **Site Not Accessible**
```bash
# Check Nginx status
systemctl status nginx

# Restart Nginx if needed
systemctl restart nginx

# Check Nginx error logs
tail -50 /var/log/nginx/error.log
```

### **Old Theme Still Showing**
```bash
# Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
# Or clear browser cache

# Check if build completed
ls -la .next/
# Should show recent timestamps

# Check PM2 is running latest code
pm2 restart all
```

---

## 📊 Expected Results

### **Build Output**
```
✓ Compiled successfully in 10-15s
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (97/97)
✓ Finalizing page optimization
```

### **PM2 Status**
```
┌─────┬──────────┬─────────┬─────────┬─────────┬──────────┐
│ id  │ name     │ mode    │ ↺       │ status  │ cpu      │
├─────┼──────────┼─────────┼─────────┼─────────┼──────────┤
│ 0   │ ecom-app │ cluster │ 0       │ online  │ 0%       │
│ 1   │ ecom-app │ cluster │ 0       │ online  │ 0%       │
└─────┴──────────┴─────────┴─────────┴─────────┴──────────┘
```

### **Curl Test**
```
HTTP/2 200
content-type: text/html; charset=utf-8
```

---

## 🎉 Success Indicators

✅ **Build completed successfully**  
✅ **PM2 shows 2 processes online**  
✅ **Site returns HTTP 200**  
✅ **New color palette visible in browser**  
✅ **Dark mode toggle works**  
✅ **No console errors in browser DevTools**

---

## 📞 Need Help?

If you encounter any issues:

1. **Check PM2 logs:** `pm2 logs --lines 50`
2. **Check Nginx logs:** `tail -50 /var/log/nginx/error.log`
3. **Check build output:** Look for error messages during `npm run build`
4. **Rollback if needed:** Use the backup branch created in Step 4

---

**Deployment Time:** ~5 minutes  
**Downtime:** ~10 seconds (during PM2 restart)  
**Risk Level:** Low (backup created automatically)

**Ready to deploy!** 🚀

