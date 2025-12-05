# 🚀 Quick Fix: 404 Error on Admin Products Page

## ❌ Problem: 404 Error

**URL**: https://extremelifeherbal.com/admin/products  
**Status**: Page not found  
**Cause**: Admin products feature not deployed to production

---

## ✅ Quick Fix (Copy & Paste)

Run this command in your SSH terminal on the VPS:

```bash
cd /var/www/html/ecom/app && \
git fetch origin && \
git checkout feature/relivator-ui-integration && \
git pull origin feature/relivator-ui-integration && \
npm install && \
npm run build && \
pm2 kill && sleep 3 && \
pkill -9 node || true && sleep 2 && \
rm -rf .next && \
pm2 start ecosystem.config.js && sleep 5 && \
pm2 status
```

**⏱️ This will take 5-7 minutes**

---

## 🔍 Diagnostic Script (Alternative)

If you prefer a step-by-step approach with diagnostics:

```bash
# Create the script
cat > /tmp/deploy.sh << 'EOF'
#!/bin/bash
cd /var/www/html/ecom/app
git fetch origin
git checkout feature/relivator-ui-integration
git pull origin feature/relivator-ui-integration
npm install
npm run build
pm2 kill && sleep 3
pkill -9 node || true && sleep 2
rm -rf .next
pm2 start ecosystem.config.js && sleep 5
pm2 status
EOF

# Run the script
bash /tmp/deploy.sh
```

---

## ✅ Verification

After deployment, run these commands:

```bash
# Check HTTP status
curl -I https://extremelifeherbal.com/admin/products

# Check PM2 status
pm2 status

# View logs
pm2 logs --lines 50
```

**Expected**: HTTP 200 status

---

## 📱 Browser Testing

1. Open: https://extremelifeherbal.com/admin/products
2. Login: admin@test.com / Admin123!
3. Verify:
   - [ ] Product grid displays
   - [ ] Search works
   - [ ] Edit dialog opens
   - [ ] Delete dialog opens

---

## 🔧 Troubleshooting

### Build Fails
```bash
npm cache clean --force
rm -rf node_modules
npm install
npm run build
```

### PM2 Won't Start
```bash
pkill -9 node
pm2 kill
pm2 start ecosystem.config.js
```

### Check Current State
```bash
git branch
git status
ls -la src/app/admin/products/
pm2 status
pm2 logs --lines 100
```

---

## 📊 Expected Results

✅ Build completes with 0 errors  
✅ PM2 processes online  
✅ HTTP 200 status  
✅ Page loads in browser  
✅ Product grid displays  

---

**Execute the quick fix command and report results!**

