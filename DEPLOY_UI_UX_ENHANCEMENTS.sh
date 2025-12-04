#!/bin/bash

# UI/UX Enhancement Deployment Script
# Philippines E-Commerce Platform
# VPS: 109.205.181.119

echo "=========================================="
echo "UI/UX Enhancement Deployment"
echo "=========================================="
echo ""

# Configuration
VPS_HOST="109.205.181.119"
VPS_USER="root"
APP_DIR="/var/www/html/ecom/app"
BRANCH="feature/relivator-ui-integration"

echo "📋 Deployment Configuration:"
echo "   VPS: $VPS_HOST"
echo "   User: $VPS_USER"
echo "   App Directory: $APP_DIR"
echo "   Branch: $BRANCH"
echo ""

# Step 1: Connect to VPS and pull latest changes
echo "🔄 Step 1: Pulling latest changes from GitHub..."
ssh $VPS_USER@$VPS_HOST "cd $APP_DIR && git pull origin $BRANCH"

if [ $? -ne 0 ]; then
    echo "❌ Failed to pull changes"
    exit 1
fi

echo "✅ Changes pulled successfully"
echo ""

# Step 2: Clean build cache
echo "🧹 Step 2: Cleaning build cache..."
ssh $VPS_USER@$VPS_HOST "cd $APP_DIR && rm -rf .next"

echo "✅ Build cache cleaned"
echo ""

# Step 3: Build application
echo "🔨 Step 3: Building application..."
ssh $VPS_USER@$VPS_HOST "cd $APP_DIR && npm run build"

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build completed successfully"
echo ""

# Step 4: Restart PM2
echo "🚀 Step 4: Restarting PM2..."
ssh $VPS_USER@$VPS_HOST "cd $APP_DIR && pm2 restart all && sleep 3 && pm2 status"

echo "✅ PM2 restarted"
echo ""

# Step 5: Verify deployment
echo "✔️ Step 5: Verifying deployment..."
ssh $VPS_USER@$VPS_HOST "curl -I https://extremelifeherbal.com | head -5"

echo ""
echo "=========================================="
echo "✅ DEPLOYMENT COMPLETE"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Hard refresh your browser (Ctrl+Shift+R)"
echo "2. Check browser console for errors"
echo "3. Test header animations"
echo "4. Verify admin dashboard"
echo "5. Test dark/light mode"
echo ""

