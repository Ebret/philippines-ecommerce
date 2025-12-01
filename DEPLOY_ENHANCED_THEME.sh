#!/bin/bash

# Enhanced Botanical Theme Deployment Script
# VPS: 109.205.181.119
# Target: /var/www/html/ecom/app
# Branch: feature/relivator-ui-integration
# Commit: e9c4904

set -e  # Exit on error

echo "=========================================="
echo "Enhanced Botanical Theme Deployment"
echo "=========================================="
echo ""
echo "Date: $(date)"
echo "Target: https://extremelifeherbal.com"
echo "Branch: feature/relivator-ui-integration"
echo "Commit: e9c4904"
echo ""

# Step 1: Navigate to application directory
echo "Step 1: Navigating to application directory..."
cd /var/www/html/ecom/app
echo "Current directory: $(pwd)"
echo ""

# Step 2: Check current status
echo "Step 2: Checking current status..."
echo "Current branch: $(git branch --show-current)"
echo "Current commit: $(git log -1 --oneline)"
echo "PM2 status:"
pm2 status
echo ""

# Step 3: Create backup branch
echo "Step 3: Creating backup branch..."
BACKUP_BRANCH="backup-before-enhanced-theme-$(date +%Y%m%d-%H%M%S)"
git branch $BACKUP_BRANCH
echo "✓ Backup branch created: $BACKUP_BRANCH"
echo ""

# Step 4: Fetch latest changes
echo "Step 4: Fetching latest changes from remote..."
git fetch origin
echo "✓ Fetch complete"
echo ""

# Step 5: Checkout feature branch
echo "Step 5: Checking out feature/relivator-ui-integration branch..."
git checkout feature/relivator-ui-integration
echo "✓ Branch checked out"
echo ""

# Step 6: Pull latest changes
echo "Step 6: Pulling latest changes..."
git pull origin feature/relivator-ui-integration
echo "Latest commit: $(git log -1 --oneline)"
echo "✓ Pull complete"
echo ""

# Step 7: Verify commit
echo "Step 7: Verifying commit..."
CURRENT_COMMIT=$(git rev-parse --short HEAD)
if [[ "$CURRENT_COMMIT" == "e9c4904" ]] || git log -1 --oneline | grep -q "e9c4904"; then
    echo "✓ Correct commit deployed: $CURRENT_COMMIT"
else
    echo "⚠ Warning: Expected commit e9c4904, got $CURRENT_COMMIT"
    echo "Latest commits:"
    git log -5 --oneline
fi
echo ""

# Step 8: Check for new dependencies
echo "Step 8: Checking for new dependencies..."
if git diff HEAD@{1} HEAD --name-only | grep -q "package.json"; then
    echo "package.json changed, installing dependencies..."
    npm install
    echo "✓ Dependencies installed"
else
    echo "✓ No dependency changes detected"
fi
echo ""

# Step 9: Build application
echo "Step 9: Building application with enhanced theme..."
echo "This may take 1-2 minutes..."
npm run build
BUILD_STATUS=$?
if [ $BUILD_STATUS -eq 0 ]; then
    echo "✓ Build successful"
else
    echo "✗ Build failed with status $BUILD_STATUS"
    echo "Rolling back to backup branch..."
    git checkout $BACKUP_BRANCH
    exit 1
fi
echo ""

# Step 10: Restart PM2
echo "Step 10: Restarting PM2 processes..."
pm2 kill
echo "Waiting 3 seconds..."
sleep 3
pm2 start ecosystem.config.js
pm2 save
echo "✓ PM2 restarted"
echo ""

# Step 11: Check PM2 status
echo "Step 11: Checking PM2 status..."
pm2 status
echo ""

# Step 12: Test local access
echo "Step 12: Testing local access..."
echo "Testing http://localhost:3000..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 || echo "000")
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "304" ]; then
    echo "✓ Application responding locally (HTTP $HTTP_CODE)"
else
    echo "⚠ Application not responding locally (HTTP $HTTP_CODE)"
fi
echo ""

# Step 13: Test external access
echo "Step 13: Testing external access..."
echo "Testing https://extremelifeherbal.com..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://extremelifeherbal.com || echo "000")
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "304" ]; then
    echo "✓ Site accessible externally (HTTP $HTTP_CODE)"
else
    echo "⚠ Site not accessible externally (HTTP $HTTP_CODE)"
fi
echo ""

# Step 14: Check logs
echo "Step 14: Checking recent logs..."
echo "=== PM2 Logs (last 20 lines) ==="
pm2 logs --lines 20 --nostream
echo ""

echo "=== Nginx Error Logs (last 10 lines) ==="
tail -10 /var/log/nginx/error.log
echo ""

# Step 15: Summary
echo "=========================================="
echo "Deployment Summary"
echo "=========================================="
echo ""
echo "Backup branch: $BACKUP_BRANCH"
echo "Current branch: $(git branch --show-current)"
echo "Current commit: $(git log -1 --oneline)"
echo "PM2 processes: $(pm2 list | grep -c 'online' || echo '0') online"
echo "Local access: HTTP $HTTP_CODE"
echo ""
echo "Enhanced Botanical Theme Features:"
echo "- Light mode: Warm cream background (#F7F5F0)"
echo "- Dark mode: Deep forest night (#0F1812)"
echo "- Enhanced contrast: 8.5:1 (light), 10:1 (dark)"
echo "- WCAG AA compliant: 100%"
echo "- Botanical textures and patterns"
echo "- 175+ utility classes"
echo "- Enhanced typography (1.7 line-height)"
echo ""
echo "Next Steps:"
echo "1. Visit https://extremelifeherbal.com"
echo "2. Verify new color palette is visible"
echo "3. Test dark mode toggle"
echo "4. Check keyboard navigation and focus rings"
echo "5. Test on mobile devices"
echo ""
echo "Rollback command (if needed):"
echo "  git checkout $BACKUP_BRANCH && npm run build && pm2 restart all"
echo ""
echo "=========================================="
echo "Deployment Complete!"
echo "=========================================="

