#!/bin/bash

# Complete PM2 Fix Script

echo "=========================================="
echo "🔧 COMPLETE PM2 FIX"
echo "=========================================="
echo ""

cd /var/www/html/ecom/app

# Step 1: Kill everything
echo "Step 1: Killing PM2 and Node processes..."
pm2 kill 2>/dev/null
sleep 3
pkill -9 node 2>/dev/null
sleep 2
echo "✅ Killed"
echo ""

# Step 2: Pull latest changes
echo "Step 2: Pulling latest changes..."
git pull origin feature/relivator-ui-integration
echo "✅ Pulled"
echo ""

# Step 3: Verify environment
echo "Step 3: Verifying environment variables..."
echo "DATABASE_URL: $(cat .env.production | grep DATABASE_URL | cut -c1-80)..."
echo "NEXTAUTH_URL: $(cat .env.production | grep NEXTAUTH_URL)"
echo "NODE_ENV: $(cat .env.production | grep NODE_ENV)"
echo ""

# Step 4: Clean and rebuild
echo "Step 4: Cleaning and rebuilding..."
rm -rf .next
npm run build
echo "✅ Build complete"
echo ""

# Step 5: Start PM2
echo "Step 5: Starting PM2..."
pm2 start ecosystem.config.js
sleep 10
echo ""

# Step 6: Check status
echo "Step 6: Checking PM2 status..."
pm2 status
echo ""

# Step 7: Check logs
echo "Step 7: Checking PM2 logs..."
pm2 logs philippines-ecommerce --lines 50 --nostream
echo ""

# Step 8: Test application
echo "Step 8: Testing application..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://extremelifeherbal.com)
echo "Homepage HTTP Status: $HTTP_STATUS"
echo ""

echo "=========================================="
echo "✅ FIX COMPLETE"
echo "=========================================="

