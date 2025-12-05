#!/bin/bash

# Admin Products Feature Deployment Script
# Run this on the VPS: bash deploy_admin_products.sh

cd /var/www/html/ecom/app

echo "=========================================="
echo "📋 DIAGNOSTIC CHECKS"
echo "=========================================="
echo ""

echo "1. Current Directory:"
pwd
echo ""

echo "2. Git Branch:"
git branch
echo ""

echo "3. Git Status:"
git status
echo ""

echo "4. Admin Products Files:"
ls -la src/app/admin/products/ 2>/dev/null || echo "❌ Files not found!"
echo ""

echo "5. PM2 Status:"
pm2 status
echo ""

echo "=========================================="
echo "🚀 DEPLOYING..."
echo "=========================================="
echo ""

echo "Step 1: Fetching latest changes..."
git fetch origin
echo "✅ Fetch complete"
echo ""

echo "Step 2: Checking out branch..."
git checkout feature/relivator-ui-integration
echo "✅ Branch checked out"
echo ""

echo "Step 3: Pulling latest changes..."
git pull origin feature/relivator-ui-integration
echo "✅ Pull complete"
echo ""

echo "Step 4: Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

echo "Step 5: Building application..."
npm run build
echo "✅ Build complete"
echo ""

echo "Step 6: Stopping PM2..."
pm2 kill
sleep 3
echo "✅ PM2 stopped"
echo ""

echo "Step 7: Cleaning up processes..."
pkill -9 node || true
sleep 2
echo "✅ Processes cleaned"
echo ""

echo "Step 8: Removing cache..."
rm -rf .next
echo "✅ Cache removed"
echo ""

echo "Step 9: Starting PM2..."
pm2 start ecosystem.config.js
sleep 5
echo "✅ PM2 started"
echo ""

echo "=========================================="
echo "✅ VERIFICATION"
echo "=========================================="
echo ""

echo "1. PM2 Status:"
pm2 status
echo ""

echo "2. Admin Products Files:"
ls -la src/app/admin/products/
echo ""

echo "3. Build Directory:"
ls -la .next/server/app/admin/ 2>/dev/null || echo "❌ Build not found!"
echo ""

echo "4. Recent PM2 Logs:"
pm2 logs --lines 50 --nostream
echo ""

echo "5. HTTP Status Check:"
curl -I https://extremelifeherbal.com/admin/products
echo ""

echo "=========================================="
echo "✅ Deployment Complete!"
echo "=========================================="
echo ""
echo "Next Steps:"
echo "1. Open: https://extremelifeherbal.com/admin/products"
echo "2. Login: admin@test.com / Admin123!"
echo "3. Verify product grid displays"
echo "4. Test search, edit, delete"
echo ""

