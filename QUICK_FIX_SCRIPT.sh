#!/bin/bash

# Quick Fix Script for Application Error

set -e

echo "🚀 Starting Quick Fix..."
echo ""

# Step 1: Pull latest changes
echo "📥 Step 1: Pulling latest changes..."
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
npm run build 2>&1 | tail -20
echo "✅ Build complete"
echo ""

# Step 4: Start PM2
echo "🚀 Step 4: Starting PM2..."
pm2 start ecosystem.config.js
sleep 10
pm2 status
echo "✅ PM2 started"
echo ""

# Step 5: Verify
echo "✅ Step 5: Verifying application..."
sleep 5
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" https://extremelifeherbal.com
echo ""

# Step 6: Check PM2 logs
echo "📋 PM2 Logs (last 50 lines):"
pm2 logs philippines-ecommerce --lines 50 --nostream
echo ""

echo "✅ Quick Fix Complete!"

