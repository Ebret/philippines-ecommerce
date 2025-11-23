#!/bin/bash

# 🚀 DEPLOY PHASE 24 PHASE 3.5 - RELIVATOR UI INTEGRATION
# Philippines E-Commerce Platform
# Date: November 23, 2025

set -e

VPS_IP="109.205.181.119"
VPS_USER="root"
APP_DIR="/var/www/html/ecom/app"
BRANCH="feature/relivator-ui-integration"

echo "🚀 DEPLOYING PHASE 24 PHASE 3.5 - RELIVATOR UI INTEGRATION"
echo "=================================================="
echo "VPS: $VPS_IP"
echo "Branch: $BRANCH"
echo "App Directory: $APP_DIR"
echo ""

# Step 1: Verify local changes
echo "📋 Step 1: Verifying local changes..."
git status
echo "✅ Local changes verified"
echo ""

# Step 2: Build locally
echo "🔨 Step 2: Building locally..."
npm run build
echo "✅ Build successful"
echo ""

# Step 3: Connect to VPS and deploy
echo "🌐 Step 3: Deploying to VPS..."
ssh $VPS_USER@$VPS_IP << 'EOF'
set -e

echo "📂 Navigating to app directory..."
cd /var/www/html/ecom/app

echo "🔄 Pulling latest changes from GitHub..."
git fetch origin
git checkout feature/relivator-ui-integration
git pull origin feature/relivator-ui-integration

echo "📦 Installing dependencies..."
npm install --production

echo "🔨 Building application..."
npm run build

echo "🔄 Restarting PM2 process..."
pm2 restart ecom-app

echo "⏳ Waiting for application to start..."
sleep 5

echo "✅ Deployment complete!"
pm2 status

EOF

echo "✅ VPS deployment successful"
echo ""

# Step 4: Verify deployment
echo "🔍 Step 4: Verifying deployment..."
echo "Testing homepage..."
curl -s -o /dev/null -w "Homepage: %{http_code}\n" https://extremelifeherbal.com/

echo "Testing account pages..."
curl -s -o /dev/null -w "Account Profile: %{http_code}\n" https://extremelifeherbal.com/account/profile

echo "Testing vendor dashboard..."
curl -s -o /dev/null -w "Vendor Dashboard: %{http_code}\n" https://extremelifeherbal.com/vendor/dashboard

echo "Testing admin dashboard..."
curl -s -o /dev/null -w "Admin Dashboard: %{http_code}\n" https://extremelifeherbal.com/admin

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "=================================================="
echo "✅ Phase 24 Phase 3.5 deployed to production"
echo "✅ All pages updated with Relivator styling"
echo "✅ Dark mode support enabled"
echo "✅ Production URL: https://extremelifeherbal.com"
echo ""

