# Deployment Instructions - Currency Fixes & Sample Products

**Date**: November 14, 2025  
**VPS**: 109.205.181.119  
**URL**: https://extremelifeherbal.com  
**Commit**: b31c24d (includes currency fixes from d437ec2)

---

## Quick Start (Copy & Paste)

### For Linux/Mac Users:
```bash
ssh root@109.205.181.119
cd /var/www/philippines-ecommerce
git pull origin master
npm install
npm run build
pm2 restart all
sleep 5
npx ts-node scripts/add-sample-products.ts
pm2 status
```

### For Windows Users (PowerShell):
```powershell
# Run from local machine or VPS
cd C:\path\to\philippines-ecommerce
.\scripts\deploy-to-production.ps1
```

---

## Step-by-Step Instructions

### Step 1: SSH into VPS
```bash
ssh root@109.205.181.119
```

### Step 2: Navigate to Application
```bash
cd /var/www/philippines-ecommerce
```

### Step 3: Pull Latest Code
```bash
git pull origin master
```
**Expected**: Shows commit b31c24d with currency fixes

### Step 4: Install Dependencies
```bash
npm install
```

### Step 5: Build Application
```bash
npm run build
```
**Expected**: Build completes with 0 errors

### Step 6: Restart PM2
```bash
pm2 restart all
pm2 status
```
**Expected**: All processes show "online"

### Step 7: Wait for Startup
```bash
sleep 10
```

### Step 8: Verify Currency Symbols
```bash
curl -s https://extremelifeherbal.com | grep -o "₱[0-9]*\.[0-9]*"
```
**Expected Output**:
```
₱19.99
₱29.99
₱39.99
```

### Step 9: Add Sample Products
```bash
npx ts-node scripts/add-sample-products.ts
```
**Expected**: 10 products created successfully

### Step 10: Final Verification
```bash
pm2 status
pm2 logs --lines 20
```

---

## Verification Checklist

After deployment, verify:

- [ ] Homepage shows ₱19.99, ₱29.99, ₱39.99
- [ ] /products page shows 10+ products
- [ ] All prices display with ₱ symbol
- [ ] Search functionality works
- [ ] Category filtering works
- [ ] No 502 Bad Gateway errors
- [ ] HTTPS certificate valid
- [ ] PM2 all processes online
- [ ] No critical errors in logs

---

## Troubleshooting

### Currency Symbols Still Show $
```bash
git log --oneline -1  # Verify commit b31c24d
git pull origin master
npm run build
pm2 restart all
```

### Build Fails
```bash
rm -rf node_modules .next
npm install
npm run build
```

### Products Script Fails
```bash
npx prisma db push
npx ts-node scripts/add-sample-products.ts
```

### PM2 Issues
```bash
pm2 logs
pm2 restart all
pm2 status
```

---

## Files Provided

1. **PRODUCTION_DEPLOYMENT_GUIDE.md** - Detailed deployment guide
2. **scripts/deploy-to-production.sh** - Bash deployment script
3. **scripts/deploy-to-production.ps1** - PowerShell deployment script
4. **scripts/add-sample-products.ts** - Sample products creation script
5. **DEPLOYMENT_INSTRUCTIONS.md** - This file

---

## Support

- **GitHub**: https://github.com/Ebret/philippines-ecommerce
- **VPS**: 109.205.181.119
- **Application**: https://extremelifeherbal.com

---

**Status**: READY FOR DEPLOYMENT  
**Estimated Time**: 30-40 minutes  
**Risk Level**: LOW

