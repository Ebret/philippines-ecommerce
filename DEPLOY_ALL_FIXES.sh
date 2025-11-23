#!/bin/bash

# Complete Deployment Script - All Fixes
# Deploys Session Provider Fix + Auth Fixes + Connection Pooling

set -e

APP_DIR="/var/www/html/ecom/app"
BRANCH="feature/relivator-ui-integration"

echo "=========================================="
echo "🚀 DEPLOYING ALL FIXES TO PRODUCTION"
echo "=========================================="
echo ""

# Step 1: Navigate to app directory
echo "📂 Step 1: Navigating to app directory..."
cd "$APP_DIR"
echo "✅ Current directory: $(pwd)"
echo ""

# Step 2: Pull latest changes
echo "📥 Step 2: Pulling latest changes from GitHub..."
git fetch origin
git pull origin "$BRANCH"
echo "✅ Git pull completed"
echo ""

# Step 3: Update DATABASE_URL with connection pooling
echo "🔧 Step 3: Updating DATABASE_URL with connection pooling..."
if grep -q "connection_limit" .env.production; then
    echo "✅ Connection pooling already configured"
else
    # Backup original
    cp .env.production .env.production.backup
    
    # Update DATABASE_URL
    sed -i 's/DATABASE_URL=postgresql:\/\/\([^?]*\)$/DATABASE_URL=postgresql:\/\/\1?schema=public\&connection_limit=5\&pool_timeout=10/' .env.production
    echo "✅ DATABASE_URL updated with connection pooling"
fi
echo ""

# Step 4: Install dependencies
echo "📦 Step 4: Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Step 5: Build application
echo "🔨 Step 5: Building application..."
npm run build
echo "✅ Build completed"
echo ""

# Step 6: Restart PM2
echo "🔄 Step 6: Restarting PM2 process..."
pm2 restart ecosystem.config.js
sleep 15
echo "✅ PM2 restarted"
echo ""

# Step 7: Verify PM2 status
echo "📊 Step 7: Verifying PM2 status..."
pm2 status
echo ""

# Step 8: Test homepage
echo "🌐 Step 8: Testing homepage..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://extremelifeherbal.com)
echo "Homepage HTTP Status: $HTTP_STATUS"
echo ""

# Step 9: Check PM2 logs
echo "📋 Step 9: Checking PM2 logs (last 20 lines)..."
pm2 logs philippines-ecommerce --lines 20 --nostream
echo ""

echo "=========================================="
echo "✅ DEPLOYMENT COMPLETED SUCCESSFULLY!"
echo "=========================================="
echo ""
echo "🧪 TEST URLS:"
echo "   Admin:   https://extremelifeherbal.com/admin"
echo "   Vendor:  https://extremelifeherbal.com/vendor/dashboard"
echo "   Account: https://extremelifeherbal.com/account/profile"
echo ""
echo "📊 NEXT STEPS:"
echo "   1. Test each URL in browser"
echo "   2. Verify no 'Application error' messages"
echo "   3. Check browser console for errors"
echo "   4. Review PM2 logs if issues occur"
echo ""

