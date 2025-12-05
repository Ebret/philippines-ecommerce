#!/bin/bash

# VPS Diagnostic and Deployment Script
# Run this on VPS to diagnose and fix 404 error

echo "=========================================="
echo "VPS Diagnostic and Deployment Script"
echo "=========================================="
echo ""

# Configuration
APP_DIR="/var/www/html/ecom/app"
BRANCH="feature/relivator-ui-integration"

echo "📋 PHASE 1: DIAGNOSTIC CHECKS"
echo "=========================================="
echo ""

# Check current directory
echo "1. Current Directory:"
pwd
echo ""

# Navigate to app directory
cd $APP_DIR || exit 1
echo "2. App Directory: $APP_DIR"
echo ""

# Check current branch
echo "3. Current Git Branch:"
git branch
echo ""

# Check git status
echo "4. Git Status:"
git status
echo ""

# Check if admin/products files exist
echo "5. Admin Products Files:"
ls -la src/app/admin/products/ 2>/dev/null || echo "❌ Files not found!"
echo ""

# Check if build exists
echo "6. Build Directory:"
ls -la .next/server/app/admin/ 2>/dev/null || echo "❌ Build not found!"
echo ""

# Check PM2 status
echo "7. PM2 Status:"
pm2 status
echo ""

# Check PM2 logs
echo "8. Recent PM2 Logs (last 20 lines):"
pm2 logs --lines 20 --nostream
echo ""

echo "=========================================="
echo "📋 PHASE 2: DEPLOYMENT"
echo "=========================================="
echo ""

# Pull latest changes
echo "Step 1: Pulling latest changes from $BRANCH..."
git fetch origin
git checkout $BRANCH
git pull origin $BRANCH
echo "✅ Latest changes pulled"
echo ""

# Install dependencies
echo "Step 2: Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Build application
echo "Step 3: Building application..."
npm run build
echo "✅ Build completed"
echo ""

# Stop PM2
echo "Step 4: Stopping PM2..."
pm2 kill
sleep 3
echo "✅ PM2 stopped"
echo ""

# Clean up processes
echo "Step 5: Cleaning up old processes..."
pkill -9 node || true
sleep 2
echo "✅ Processes cleaned"
echo ""

# Remove cache
echo "Step 6: Removing .next cache..."
rm -rf .next
echo "✅ Cache removed"
echo ""

# Start PM2
echo "Step 7: Starting PM2..."
pm2 start ecosystem.config.js
sleep 5
echo "✅ PM2 started"
echo ""

echo "=========================================="
echo "📋 PHASE 3: VERIFICATION"
echo "=========================================="
echo ""

# Check PM2 status
echo "1. PM2 Status:"
pm2 status
echo ""

# Check if files exist
echo "2. Admin Products Files:"
ls -la src/app/admin/products/ 2>/dev/null || echo "❌ Files not found!"
echo ""

# Check if build exists
echo "3. Build Directory:"
ls -la .next/server/app/admin/ 2>/dev/null || echo "❌ Build not found!"
echo ""

# Check PM2 logs
echo "4. Recent PM2 Logs (last 50 lines):"
pm2 logs --lines 50 --nostream
echo ""

# Check HTTP status
echo "5. HTTP Status Check:"
curl -I https://extremelifeherbal.com/admin/products 2>/dev/null || echo "❌ Connection failed"
echo ""

echo "=========================================="
echo "✅ Deployment Complete!"
echo "=========================================="
echo ""
echo "Next Steps:"
echo "1. Open: https://extremelifeherbal.com/admin/products"
echo "2. Login: admin@test.com / Admin123!"
echo "3. Verify product grid displays"
echo "4. Test search, edit, delete"
echo ""

