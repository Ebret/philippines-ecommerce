#!/bin/bash

# Philippines E-Commerce Platform - Production Deployment Script
# Date: November 26, 2025
# Branch: feature/relivator-ui-integration
# Latest Commit: bca7813

echo "=========================================="
echo "Philippines E-Commerce Platform"
echo "UI/UX Enhancement Deployment"
echo "=========================================="
echo ""

# Step 1: Navigate to app directory
echo "Step 1: Navigating to app directory..."
cd /var/www/html/ecom/app || { echo "Error: App directory not found"; exit 1; }
echo "✓ Current directory: $(pwd)"
echo ""

# Step 2: Check current git status
echo "Step 2: Checking current git status..."
git status
echo ""

# Step 3: Pull latest changes
echo "Step 3: Pulling latest changes from GitHub..."
git pull origin feature/relivator-ui-integration || { echo "Error: Git pull failed"; exit 1; }
echo ""

# Step 4: Verify latest commit
echo "Step 4: Verifying latest commit..."
LATEST_COMMIT=$(git log -1 --oneline)
echo "Latest commit: $LATEST_COMMIT"
echo ""

# Step 5: Install dependencies
echo "Step 5: Installing dependencies..."
npm install || { echo "Error: npm install failed"; exit 1; }
echo "✓ Dependencies installed"
echo ""

# Step 6: Build application
echo "Step 6: Building application..."
npm run build || { echo "Error: Build failed"; exit 1; }
echo "✓ Build completed successfully"
echo ""

# Step 7: Kill existing PM2 processes
echo "Step 7: Stopping existing PM2 processes..."
pm2 kill
echo "✓ PM2 processes stopped"
echo ""

# Step 8: Wait 3 seconds
echo "Step 8: Waiting 3 seconds..."
sleep 3
echo "✓ Wait complete"
echo ""

# Step 9: Start PM2 with ecosystem config
echo "Step 9: Starting PM2 processes..."
pm2 start ecosystem.config.js || { echo "Error: PM2 start failed"; exit 1; }
echo "✓ PM2 processes started"
echo ""

# Step 10: Check PM2 status
echo "Step 10: Checking PM2 status..."
pm2 status
echo ""

# Step 11: Check website HTTP status
echo "Step 11: Checking website HTTP status..."
curl -I https://extremelifeherbal.com
echo ""

# Step 12: Check PM2 logs
echo "Step 12: Checking PM2 logs (last 20 lines)..."
pm2 logs --lines 20 --nostream
echo ""

echo "=========================================="
echo "Deployment Complete!"
echo "=========================================="
echo ""
echo "Next Steps:"
echo "1. Open https://extremelifeherbal.com in your browser"
echo "2. Verify new Navbar appears at top of page"
echo "3. Test login with: buyer@test.com (Buyer123!)"
echo "4. Test theme switcher (Light/Dark/System modes)"
echo "5. Check browser console for any errors"
echo ""
echo "For comprehensive testing, see:"
echo "DEPLOYMENT_AND_TESTING_GUIDE.md"
echo ""

