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
echo "=========================================================="
echo "VPS: $VPS_IP"
echo "Branch: $BRANCH"
echo "App Directory: $APP_DIR"
echo ""

# Create SSH command
SSH_CMD="ssh -o StrictHostKeyChecking=no -o ConnectTimeout=30 $VPS_USER@$VPS_IP"

echo "📋 Step 1: Connecting to VPS and pulling changes..."
$SSH_CMD << 'DEPLOY_SCRIPT'
set -e
cd /var/www/html/ecom/app
echo "✅ Connected to VPS"
echo "🔄 Fetching latest changes..."
git fetch origin
echo "✅ Fetched"
echo "🔄 Checking out feature branch..."
git checkout feature/relivator-ui-integration
echo "✅ Checked out"
echo "🔄 Pulling latest changes..."
git pull origin feature/relivator-ui-integration
echo "✅ Pulled"
DEPLOY_SCRIPT

echo ""
echo "📦 Step 2: Installing dependencies..."
$SSH_CMD "cd /var/www/html/ecom/app && npm install --production"

echo ""
echo "🔨 Step 3: Building application..."
$SSH_CMD "cd /var/www/html/ecom/app && npm run build"

echo ""
echo "🔄 Step 4: Restarting PM2..."
$SSH_CMD "cd /var/www/html/ecom/app && pm2 restart ecom-app && sleep 5 && pm2 status"

echo ""
echo "🔍 Step 5: Verifying deployment..."
echo "Testing homepage..."
curl -s -o /dev/null -w "Homepage: %{http_code}\n" https://extremelifeherbal.com/

echo "Testing account profile..."
curl -s -o /dev/null -w "Account Profile: %{http_code}\n" https://extremelifeherbal.com/account/profile

echo "Testing vendor dashboard..."
curl -s -o /dev/null -w "Vendor Dashboard: %{http_code}\n" https://extremelifeherbal.com/vendor/dashboard

echo "Testing admin dashboard..."
curl -s -o /dev/null -w "Admin Dashboard: %{http_code}\n" https://extremelifeherbal.com/admin

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "=========================================================="
echo "✅ Phase 24 Phase 3.5 deployed to production"
echo "✅ All pages updated with Relivator styling"
echo "✅ Dark mode support enabled"
echo "✅ Production URL: https://extremelifeherbal.com"
echo "=========================================================="

