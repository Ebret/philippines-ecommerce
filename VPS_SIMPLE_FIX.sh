#!/bin/bash
# Simple VPS Fix - Pull Latest Code and Rebuild

set -e

echo "=========================================="
echo "🔧 VPS SIMPLE FIX - Starting..."
echo "=========================================="

# Kill all processes
echo "Step 1: Killing all processes..."
pm2 kill 2>/dev/null || true
sleep 3
pkill -9 node 2>/dev/null || true
sleep 2

# Navigate to app directory
echo "Step 2: Navigating to app directory..."
cd /var/www/html/ecom/app

# Check current status
echo "Step 3: Checking current git status..."
echo "Current branch:"
git branch
echo ""
echo "Last 5 commits:"
git log --oneline -5
echo ""

# Fetch latest
echo "Step 4: Fetching latest from GitHub..."
git fetch origin

# Checkout feature branch
echo "Step 5: Checking out feature/relivator-ui-integration..."
git checkout feature/relivator-ui-integration

# Pull latest
echo "Step 6: Pulling latest changes..."
git pull origin feature/relivator-ui-integration

# Verify files
echo "Step 7: Verifying critical files exist..."
echo "Checking src/lib/auth.ts..."
test -f "src/lib/auth.ts" && echo "✅ Found" || (echo "❌ NOT FOUND" && exit 1)

echo "Checking src/components/layout/navbar.tsx..."
test -f "src/components/layout/navbar.tsx" && echo "✅ Found" || (echo "❌ NOT FOUND" && exit 1)

echo "Checking src/components/ui/button.tsx..."
test -f "src/components/ui/button.tsx" && echo "✅ Found" || (echo "❌ NOT FOUND" && exit 1)

echo "Checking src/hooks/use-toast.ts..."
test -f "src/hooks/use-toast.ts" && echo "✅ Found" || (echo "❌ NOT FOUND" && exit 1)

# Clean old build
echo "Step 8: Cleaning old build..."
rm -rf .next
rm -rf node_modules/.cache

# Install dependencies
echo "Step 9: Installing dependencies..."
npm install

# Build
echo "Step 10: Building application..."
npm run build

# Verify build
echo "Step 11: Verifying build..."
test -f ".next/build-manifest.json" && echo "✅ Build successful!" || (echo "❌ Build failed!" && exit 1)

# Start PM2
echo "Step 12: Starting PM2..."
pm2 start ecosystem.config.js
sleep 10

# Check status
echo "Step 13: Checking PM2 status..."
pm2 status

# Show logs
echo "Step 14: Showing PM2 logs..."
pm2 logs --lines 50

echo "=========================================="
echo "✅ VPS FIX COMPLETE!"
echo "=========================================="

