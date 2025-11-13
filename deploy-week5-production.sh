#!/bin/bash

# Week 5: Order Management System - Production Deployment Script
# Deploys Week 5 order management features to production VPS

set -e

echo "=========================================="
echo "Week 5: Order Management System Deployment"
echo "=========================================="

# Configuration
VPS_IP="109.205.181.119"
VPS_USER="root"
APP_DIR="/var/www/philippines-ecommerce"
DOMAIN="extremelifeherbal.com"

echo ""
echo "Step 1: Connecting to VPS..."
ssh -o StrictHostKeyChecking=no $VPS_USER@$VPS_IP << 'EOF'

echo "Step 2: Navigating to application directory..."
cd $APP_DIR

echo "Step 3: Pulling latest changes..."
git pull origin main

echo "Step 4: Installing dependencies..."
npm install

echo "Step 5: Building application..."
npm run build

echo "Step 6: Restarting PM2 processes..."
pm2 restart all
pm2 save

echo "Step 7: Verifying deployment..."
sleep 5

# Test order pages
echo ""
echo "Testing Order Pages:"
curl -s https://$DOMAIN/orders/test-order-1 -o /dev/null -w "Order Details: %{http_code}\n"
curl -s https://$DOMAIN/orders/test-order-1/tracking -o /dev/null -w "Order Tracking: %{http_code}\n"
curl -s https://$DOMAIN/orders/test-order-1/cancel -o /dev/null -w "Order Cancel: %{http_code}\n"
curl -s https://$DOMAIN/orders/test-order-1/return -o /dev/null -w "Order Return: %{http_code}\n"

echo ""
echo "=========================================="
echo "Week 5 Deployment Complete!"
echo "=========================================="
echo ""
echo "Deployed Features:"
echo "✓ Order Details Page (/orders/[id])"
echo "✓ Order Tracking Page (/orders/[id]/tracking)"
echo "✓ Order Cancellation Page (/orders/[id]/cancel)"
echo "✓ Order Return Page (/orders/[id]/return)"
echo ""
echo "API Endpoints:"
echo "✓ GET /api/orders/[id]"
echo "✓ GET /api/orders/[id]/tracking"
echo "✓ POST /api/orders/[id]/cancel"
echo "✓ POST /api/orders/[id]/return"
echo ""
echo "Verify at: https://$DOMAIN/orders/[order-id]"

EOF

echo ""
echo "Deployment script completed!"

