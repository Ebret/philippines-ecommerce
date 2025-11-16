#!/bin/bash

# Phase 22 Production Deployment Script
# This script deploys the latest changes to the production VPS

VPS_HOST="109.205.181.119"
VPS_USER="root"
VPS_PATH="/var/www/philippines-ecommerce"

echo "🚀 Phase 22 Production Deployment"
echo "=================================="
echo ""

# Step 1: Verify local build
echo "Step 1: Verifying local build..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Aborting deployment."
    exit 1
fi
echo "✅ Build successful"
echo ""

# Step 2: Execute deployment on VPS
echo "Step 2: Deploying to production..."
echo "VPS: $VPS_USER@$VPS_HOST:$VPS_PATH"
echo ""

ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_HOST" << 'EOF'
set -e

echo "📋 Deployment Steps:"
echo "===================="
echo ""

# Step 1: Navigate to project
echo "Step 1: Navigating to project directory..."
cd /var/www/philippines-ecommerce
pwd
echo "✅ In correct directory"
echo ""

# Step 2: Pull latest changes
echo "Step 2: Pulling latest changes from GitHub..."
git pull origin master
echo "✅ Git pull completed"
echo ""

# Step 3: Install dependencies
echo "Step 3: Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Step 4: Build application
echo "Step 4: Building application..."
npm run build
echo "✅ Build completed"
echo ""

# Step 5: Restart PM2
echo "Step 5: Restarting PM2 process..."
pm2 restart philippines-ecommerce
pm2 save
echo "✅ PM2 restarted"
echo ""

# Step 6: Verify deployment
echo "Step 6: Verifying deployment..."
pm2 logs philippines-ecommerce --lines 10
echo ""
echo "✅ Deployment completed successfully!"

EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Production deployment successful!"
    echo ""
    echo "📋 Post-Deployment Verification:"
    echo "================================"
    echo "Test these URLs:"
    echo "  - https://extremelifeherbal.com"
    echo "  - https://extremelifeherbal.com/about"
    echo "  - https://extremelifeherbal.com/contact"
    echo "  - https://extremelifeherbal.com/products"
    echo "  - https://extremelifeherbal.com/cart"
    echo "  - https://extremelifeherbal.com/checkout"
else
    echo ""
    echo "❌ Deployment failed!"
    exit 1
fi

