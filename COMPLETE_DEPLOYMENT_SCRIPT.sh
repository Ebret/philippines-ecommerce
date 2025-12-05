#!/bin/bash

# Complete Deployment Script for Admin Products Feature
# Run this on VPS: bash COMPLETE_DEPLOYMENT_SCRIPT.sh

echo "=========================================="
echo "🚀 COMPLETE DEPLOYMENT SCRIPT"
echo "=========================================="
echo ""

cd /var/www/html/ecom/app

echo "Step 1: Kill PM2"
pm2 kill
sleep 3

echo "Step 2: Kill all node processes"
pkill -9 node
sleep 2

echo "Step 3: Rebuild application"
npm run build

echo "Step 4: Wait for build"
sleep 30

echo "Step 5: Start PM2"
pm2 start ecosystem.config.js

echo "Step 6: Wait for startup"
sleep 10

echo "Step 7: Check status"
pm2 status

echo "Step 8: View logs"
pm2 logs --lines 100

echo ""
echo "=========================================="
echo "✅ DEPLOYMENT COMPLETE"
echo "=========================================="
echo ""
echo "Verification:"
echo "1. Check HTTP status:"
echo "   curl -I https://extremelifeherbal.com/admin/products"
echo ""
echo "2. Check PM2 status:"
echo "   pm2 status"
echo ""
echo "3. View logs:"
echo "   pm2 logs --lines 50"
echo ""

