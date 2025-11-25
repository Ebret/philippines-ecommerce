#!/bin/bash

# Quick Fix Script for Application Error - FINAL VERSION
# This script deploys the admin layout hydration fix

set -e

echo "🚀 Starting Final Deployment..."
echo ""

# Step 1: Pull latest changes
echo "📥 Step 1: Pulling latest changes from feature/relivator-ui-integration..."
cd /var/www/html/ecom/app
git pull origin feature/relivator-ui-integration
echo "✅ Git pull complete"
echo ""

# Step 2: Kill all processes
echo "🛑 Step 2: Killing all processes..."
pm2 kill 2>/dev/null || true
sleep 3
pkill -9 node 2>/dev/null || true
sleep 3
pkill -9 npm 2>/dev/null || true
sleep 2
echo "✅ All processes killed"
echo ""

# Step 3: Clean build
echo "🔨 Step 3: Cleaning and rebuilding..."
rm -rf .next
npm run build
echo "✅ Build complete"
echo ""

# Step 4: Start PM2
echo "🚀 Step 4: Starting PM2..."
pm2 start ecosystem.config.js
sleep 10
echo ""

# Step 5: Check PM2 status
echo "📊 Step 5: Checking PM2 status..."
pm2 status
echo ""

# Step 6: Verify application
echo "✅ Step 6: Verifying application..."
sleep 5
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://extremelifeherbal.com)
echo "HTTP Status: $HTTP_STATUS"
echo ""

# Step 7: Show PM2 logs
echo "📋 Step 7: PM2 Logs (last 30 lines):"
pm2 logs philippines-ecommerce --lines 30 --nostream 2>/dev/null || echo "No logs available yet"
echo ""

echo "✅ Deployment Complete!"
echo ""
echo "🧪 Next Steps:"
echo "1. Open https://extremelifeherbal.com in browser"
echo "2. Check browser console (F12) for any errors"
echo "3. Test login with: admin@test.com / Admin123!"
echo "4. Test vendor dashboard: seller@test.com / Seller123!"
echo "5. Test account pages: buyer@test.com / Buyer123!"

