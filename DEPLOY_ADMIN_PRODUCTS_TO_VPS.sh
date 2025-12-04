#!/bin/bash

# Admin Products Feature Deployment Script
# Deploys the admin product management feature to production VPS
# Usage: bash DEPLOY_ADMIN_PRODUCTS_TO_VPS.sh

set -e

echo "=========================================="
echo "Admin Products Feature Deployment"
echo "=========================================="
echo ""

# Configuration
VPS_IP="109.205.181.119"
VPS_USER="root"
APP_DIR="/var/www/html/ecom/app"
BRANCH="feature/relivator-ui-integration"

echo "📋 Deployment Configuration:"
echo "   VPS IP: $VPS_IP"
echo "   App Directory: $APP_DIR"
echo "   Branch: $BRANCH"
echo ""

# Step 1: Connect to VPS and pull latest changes
echo "Step 1️⃣ : Pulling latest changes from $BRANCH..."
ssh $VPS_USER@$VPS_IP "cd $APP_DIR && git fetch origin && git checkout $BRANCH && git pull origin $BRANCH"
echo "✅ Latest changes pulled successfully"
echo ""

# Step 2: Install dependencies
echo "Step 2️⃣ : Installing dependencies..."
ssh $VPS_USER@$VPS_IP "cd $APP_DIR && npm install"
echo "✅ Dependencies installed successfully"
echo ""

# Step 3: Build the application
echo "Step 3️⃣ : Building Next.js application..."
ssh $VPS_USER@$VPS_IP "cd $APP_DIR && npm run build"
echo "✅ Build completed successfully"
echo ""

# Step 4: Stop PM2 processes
echo "Step 4️⃣ : Stopping PM2 processes..."
ssh $VPS_USER@$VPS_IP "pm2 kill"
sleep 3
echo "✅ PM2 processes stopped"
echo ""

# Step 5: Clean up old processes
echo "Step 5️⃣ : Cleaning up old Node processes..."
ssh $VPS_USER@$VPS_IP "pkill -9 node || true"
sleep 2
echo "✅ Old processes cleaned up"
echo ""

# Step 6: Remove .next cache
echo "Step 6️⃣ : Removing .next cache..."
ssh $VPS_USER@$VPS_IP "cd $APP_DIR && rm -rf .next"
echo "✅ Cache removed"
echo ""

# Step 7: Start PM2 processes
echo "Step 7️⃣ : Starting PM2 processes..."
ssh $VPS_USER@$VPS_IP "cd $APP_DIR && pm2 start ecosystem.config.js"
sleep 5
echo "✅ PM2 processes started"
echo ""

# Step 8: Verify deployment
echo "Step 8️⃣ : Verifying deployment..."
ssh $VPS_USER@$VPS_IP "pm2 status"
echo ""

# Step 9: Test admin products page
echo "Step 9️⃣ : Testing admin products page..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://extremelifeherbal.com/admin/products)
if [ "$RESPONSE" = "200" ] || [ "$RESPONSE" = "307" ]; then
    echo "✅ Admin products page is accessible (HTTP $RESPONSE)"
else
    echo "⚠️  Admin products page returned HTTP $RESPONSE"
fi
echo ""

# Step 10: Display PM2 logs
echo "Step 🔟 : Recent PM2 logs:"
ssh $VPS_USER@$VPS_IP "pm2 logs --lines 20 --nostream"
echo ""

echo "=========================================="
echo "✅ Deployment Complete!"
echo "=========================================="
echo ""
echo "📍 Access the admin products page:"
echo "   URL: https://extremelifeherbal.com/admin/products"
echo "   Login: admin@test.com / Admin123!"
echo ""
echo "📊 Verify deployment:"
echo "   1. Check PM2 status: pm2 status"
echo "   2. View logs: pm2 logs"
echo "   3. Test page: curl https://extremelifeherbal.com/admin/products"
echo ""

