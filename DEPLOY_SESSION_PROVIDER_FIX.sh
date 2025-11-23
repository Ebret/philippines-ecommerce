#!/bin/bash

# Session Provider Fix Deployment Script
# Deploys to VPS 109.205.181.119

set -e

echo "🚀 DEPLOYING SESSION PROVIDER FIX TO PRODUCTION VPS..."
echo ""

# Step 1: Pull latest changes
echo "📥 Step 1: Pulling latest changes from GitHub..."
cd /var/www/html/ecom/app
git pull origin feature/relivator-ui-integration
echo "✅ Git pull completed"
echo ""

# Step 2: Install dependencies
echo "📦 Step 2: Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Step 3: Build application
echo "🔨 Step 3: Building application..."
npm run build
echo "✅ Build completed"
echo ""

# Step 4: Restart PM2
echo "🔄 Step 4: Restarting PM2 process..."
pm2 restart ecosystem.config.js
sleep 10
echo "✅ PM2 restarted"
echo ""

# Step 5: Verify deployment
echo "✅ Step 5: Verifying deployment..."
pm2 status
echo ""

# Step 6: Test homepage
echo "🌐 Testing homepage..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://extremelifeherbal.com)
echo "Homepage HTTP Status: $HTTP_STATUS"
echo ""

echo "✅ DEPLOYMENT COMPLETED SUCCESSFULLY!"
echo ""
echo "🧪 Test URLs:"
echo "   Admin:   https://extremelifeherbal.com/admin"
echo "   Vendor:  https://extremelifeherbal.com/vendor/dashboard"
echo "   Account: https://extremelifeherbal.com/account/profile"
echo ""
echo "📊 Next Steps:"
echo "   1. Test each URL in browser"
echo "   2. Verify no 'Application error' messages"
echo "   3. Check browser console for errors"
echo "   4. Review PM2 logs if issues occur"

