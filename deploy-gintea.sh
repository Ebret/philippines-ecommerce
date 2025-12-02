#!/bin/bash

# GinTea Theme Deployment Script
# VPS: 109.205.181.119
# Path: /var/www/html/ecom/app

echo "=== GinTea Theme Deployment ==="
echo ""

# Step 1: Navigate to app directory
echo "Step 1: Navigating to app directory..."
cd /var/www/html/ecom/app || exit 1
pwd
echo ""

# Step 2: Check current status
echo "Step 2: Current Git Status..."
git branch --show-current
git log -1 --oneline
echo ""

# Step 3: Create backup branch
echo "Step 3: Creating backup branch..."
BACKUP_BRANCH="backup-gintea-$(date +%Y%m%d-%H%M%S)"
git branch "$BACKUP_BRANCH"
echo "Created backup: $BACKUP_BRANCH"
echo ""

# Step 4: Fetch latest changes
echo "Step 4: Fetching latest changes from GitHub..."
git fetch origin
echo ""

# Step 5: Checkout feature branch
echo "Step 5: Checking out feature/relivator-ui-integration..."
git checkout feature/relivator-ui-integration
echo ""

# Step 6: Pull latest changes
echo "Step 6: Pulling latest changes..."
git pull origin feature/relivator-ui-integration
echo ""

# Step 7: Show latest commit
echo "Step 7: Latest commit..."
git log -1 --oneline
echo ""

# Step 8: Clear build cache
echo "Step 8: Clearing Next.js build cache..."
rm -rf .next
echo "Build cache cleared"
echo ""

# Step 9: Install dependencies (if needed)
echo "Step 9: Checking dependencies..."
npm install
echo ""

# Step 10: Build application
echo "Step 10: Building application with new GinTea theme..."
npm run build
BUILD_STATUS=$?
echo ""

if [ $BUILD_STATUS -ne 0 ]; then
    echo "❌ Build failed! Rolling back..."
    git checkout "$BACKUP_BRANCH"
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Step 11: Restart PM2
echo "Step 11: Restarting PM2 processes..."
pm2 restart all
echo ""

# Step 12: Check PM2 status
echo "Step 12: Verifying PM2 status..."
pm2 status
echo ""

# Step 13: Save PM2 configuration
echo "Step 13: Saving PM2 configuration..."
pm2 save
echo ""

echo "=== Deployment Complete ==="
echo ""
echo "✅ GinTea theme deployed successfully!"
echo ""
echo "Next steps:"
echo "1. Open https://extremelifeherbal.com"
echo "2. Hard refresh (Ctrl + Shift + R)"
echo "3. Verify colors:"
echo "   - Background: Soft cream #FAF8F3"
echo "   - Text: Deep tea leaf green #213B2E"
echo "   - Buttons: Matcha green #368A5C"
echo "   - Accents: Honey gold #E8B84D"
echo "4. Test dark mode toggle"
echo ""
echo "If colors don't show, clear browser cache and hard refresh again."
echo ""

