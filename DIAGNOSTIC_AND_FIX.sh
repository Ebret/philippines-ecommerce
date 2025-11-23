#!/bin/bash

# Comprehensive Diagnostic and Fix Script for PM2 Error

echo "=========================================="
echo "🔧 COMPREHENSIVE PM2 DIAGNOSTIC & FIX"
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

# Step 2: Check environment
echo "Step 2: Checking environment variables..."
echo "DATABASE_URL: $(cat .env.production | grep DATABASE_URL)"
echo "NEXTAUTH_SECRET: $(cat .env.production | grep NEXTAUTH_SECRET | cut -c1-50)..."
echo "NEXTAUTH_URL: $(cat .env.production | grep NEXTAUTH_URL)"
echo ""

# Step 3: Verify build artifacts
echo "Step 3: Verifying build artifacts..."
if [ -d ".next" ]; then
  echo "✅ .next directory exists"
  echo "   Size: $(du -sh .next | cut -f1)"
else
  echo "❌ .next directory missing - rebuilding..."
  npm run build
fi
echo ""

# Step 4: Check node_modules
echo "Step 4: Checking node_modules..."
if [ -d "node_modules" ]; then
  echo "✅ node_modules exists"
  echo "   Packages: $(ls node_modules | wc -l)"
else
  echo "❌ node_modules missing - installing..."
  npm install
fi
echo ""

# Step 5: Check ecosystem.config.js
echo "Step 5: Checking ecosystem.config.js..."
if [ -f "ecosystem.config.js" ]; then
  echo "✅ ecosystem.config.js exists"
  cat ecosystem.config.js | head -20
else
  echo "❌ ecosystem.config.js missing"
fi
echo ""

# Step 6: Start PM2
echo "Step 6: Starting PM2..."
pm2 start ecosystem.config.js
sleep 10
echo ""

# Step 7: Check status
echo "Step 7: Checking PM2 status..."
pm2 status
echo ""

# Step 8: Show logs
echo "Step 8: Showing PM2 logs (last 50 lines)..."
pm2 logs philippines-ecommerce --lines 50 --nostream
echo ""

# Step 9: Test application
echo "Step 9: Testing application..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://extremelifeherbal.com)
echo "Homepage HTTP Status: $HTTP_STATUS"
echo ""

echo "=========================================="
echo "✅ DIAGNOSTIC COMPLETE"
echo "=========================================="

