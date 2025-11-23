#!/bin/bash

# Troubleshoot PM2 Error Script

echo "=========================================="
echo "🔧 TROUBLESHOOTING PM2 ERROR"
echo "=========================================="
echo ""

# Step 1: Check PM2 logs
echo "📋 Step 1: Checking PM2 logs..."
pm2 logs philippines-ecommerce --lines 50 --nostream
echo ""

# Step 2: Kill PM2
echo "🔄 Step 2: Killing PM2..."
pm2 kill
sleep 5
echo "✅ PM2 killed"
echo ""

# Step 3: Check if node processes are running
echo "📊 Step 3: Checking node processes..."
ps aux | grep node | grep -v grep
echo ""

# Step 4: Kill any remaining node processes
echo "🔪 Step 4: Killing remaining node processes..."
pkill -9 node
sleep 2
echo "✅ Node processes killed"
echo ""

# Step 5: Start PM2 fresh
echo "🚀 Step 5: Starting PM2 fresh..."
cd /var/www/html/ecom/app
pm2 start ecosystem.config.js
sleep 10
echo ""

# Step 6: Check PM2 status
echo "📊 Step 6: Checking PM2 status..."
pm2 status
echo ""

# Step 7: Check logs again
echo "📋 Step 7: Checking logs after restart..."
pm2 logs philippines-ecommerce --lines 20 --nostream
echo ""

echo "=========================================="
echo "✅ TROUBLESHOOTING COMPLETE"
echo "=========================================="

