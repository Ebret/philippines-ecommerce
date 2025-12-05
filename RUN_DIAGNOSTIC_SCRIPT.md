# 🔧 Run Diagnostic and Deployment Script on VPS

## 📋 How to Run the Diagnostic Script

Since you're already connected to the VPS via SSH, follow these steps:

---

## Step 1: Download the Script

On your local machine, copy the script to the VPS:

```bash
scp philippines-ecommerce/VPS_DIAGNOSTIC_AND_DEPLOY.sh root@109.205.181.119:/tmp/
```

Or manually create it on the VPS:

```bash
cat > /tmp/VPS_DIAGNOSTIC_AND_DEPLOY.sh << 'EOF'
#!/bin/bash

echo "=========================================="
echo "VPS Diagnostic and Deployment Script"
echo "=========================================="
echo ""

APP_DIR="/var/www/html/ecom/app"
BRANCH="feature/relivator-ui-integration"

echo "📋 PHASE 1: DIAGNOSTIC CHECKS"
echo "=========================================="
cd $APP_DIR || exit 1

echo "1. Current Directory:"
pwd

echo "2. Git Branch:"
git branch

echo "3. Git Status:"
git status

echo "4. Admin Products Files:"
ls -la src/app/admin/products/ 2>/dev/null || echo "❌ Files not found!"

echo "5. Build Directory:"
ls -la .next/server/app/admin/ 2>/dev/null || echo "❌ Build not found!"

echo "6. PM2 Status:"
pm2 status

echo "7. Recent PM2 Logs:"
pm2 logs --lines 20 --nostream

echo ""
echo "=========================================="
echo "📋 PHASE 2: DEPLOYMENT"
echo "=========================================="

echo "Step 1: Pulling latest changes..."
git fetch origin
git checkout $BRANCH
git pull origin $BRANCH

echo "Step 2: Installing dependencies..."
npm install

echo "Step 3: Building application..."
npm run build

echo "Step 4: Stopping PM2..."
pm2 kill
sleep 3

echo "Step 5: Cleaning up processes..."
pkill -9 node || true
sleep 2

echo "Step 6: Removing cache..."
rm -rf .next

echo "Step 7: Starting PM2..."
pm2 start ecosystem.config.js
sleep 5

echo ""
echo "=========================================="
echo "📋 PHASE 3: VERIFICATION"
echo "=========================================="

echo "1. PM2 Status:"
pm2 status

echo "2. Admin Products Files:"
ls -la src/app/admin/products/

echo "3. Build Directory:"
ls -la .next/server/app/admin/

echo "4. Recent PM2 Logs:"
pm2 logs --lines 50 --nostream

echo "5. HTTP Status:"
curl -I https://extremelifeherbal.com/admin/products

echo ""
echo "=========================================="
echo "✅ Deployment Complete!"
echo "=========================================="
EOF
```

---

## Step 2: Make Script Executable

```bash
chmod +x /tmp/VPS_DIAGNOSTIC_AND_DEPLOY.sh
```

---

## Step 3: Run the Script

```bash
bash /tmp/VPS_DIAGNOSTIC_AND_DEPLOY.sh
```

**⏱️ This will take approximately 5-7 minutes**

---

## Step 4: Monitor Output

The script will output:

### Phase 1: Diagnostic Checks
- Current directory
- Git branch
- Git status
- Admin products files
- Build directory
- PM2 status
- Recent logs

### Phase 2: Deployment
- Pull latest changes
- Install dependencies
- Build application
- Stop PM2
- Clean processes
- Remove cache
- Start PM2

### Phase 3: Verification
- PM2 status
- Admin products files
- Build directory
- Recent logs
- HTTP status

---

## ✅ Expected Output

```
✅ Latest changes pulled
✅ Dependencies installed
✅ Build completed
✅ PM2 stopped
✅ Processes cleaned
✅ Cache removed
✅ PM2 started
```

---

## 🔍 If You See Errors

### Build Error
```
npm ERR! ...
```
**Solution**: Run `npm cache clean --force` and try again

### PM2 Error
```
PM2 error: ...
```
**Solution**: Run `pkill -9 node` and try again

### Git Error
```
fatal: ...
```
**Solution**: Check branch with `git branch` and verify connection

---

## 📱 After Deployment

1. Open: https://extremelifeherbal.com/admin/products
2. Login: admin@test.com / Admin123!
3. Verify product grid displays
4. Test search, edit, delete

---

## 📊 Verification Commands

After script completes, run these to verify:

```bash
# Check HTTP status
curl -I https://extremelifeherbal.com/admin/products

# Check PM2 status
pm2 status

# View logs
pm2 logs --lines 50
```

---

**Execute the script and report the output!**

