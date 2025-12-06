#!/bin/bash

# VPS Complete Fix Script - Philippines E-Commerce Platform
# This script fixes the missing files issue and rebuilds the application

set -e

echo "=========================================="
echo "🔧 VPS COMPLETE FIX - Starting..."
echo "=========================================="

# Step 1: Kill all processes
echo "Step 1: Killing all processes..."
pm2 kill || true
sleep 3
pkill -9 node || true
sleep 2

# Step 2: Navigate to app directory
echo "Step 2: Navigating to app directory..."
cd /var/www/html/ecom/app

# Step 3: Check git status
echo "Step 3: Checking git status..."
git status

# Step 4: Fetch latest from remote
echo "Step 4: Fetching latest from remote..."
git fetch origin

# Step 5: Check current branch
echo "Step 5: Checking current branch..."
git branch -a

# Step 6: Checkout feature branch
echo "Step 6: Checking out feature/relivator-ui-integration..."
git checkout feature/relivator-ui-integration

# Step 7: Pull latest changes
echo "Step 7: Pulling latest changes..."
git pull origin feature/relivator-ui-integration

# Step 8: Verify critical files exist
echo "Step 8: Verifying critical files..."
if [ ! -f "src/lib/auth.ts" ]; then
  echo "❌ ERROR: src/lib/auth.ts not found!"
  exit 1
fi
if [ ! -f "src/components/layout/navbar.tsx" ]; then
  echo "❌ ERROR: src/components/layout/navbar.tsx not found!"
  exit 1
fi
if [ ! -f "src/components/ui/button.tsx" ]; then
  echo "❌ ERROR: src/components/ui/button.tsx not found!"
  exit 1
fi
echo "✅ All critical files found!"

# Step 9: Clean up old build
echo "Step 9: Cleaning up old build..."
rm -rf .next
rm -rf node_modules/.cache

# Step 10: Install dependencies
echo "Step 10: Installing dependencies..."
npm install

# Step 11: Build application
echo "Step 11: Building application..."
npm run build

# Step 12: Verify build
echo "Step 12: Verifying build..."
if [ ! -f ".next/build-manifest.json" ]; then
  echo "❌ ERROR: Build failed - build-manifest.json not found!"
  exit 1
fi
echo "✅ Build successful!"

# Step 13: Start PM2
echo "Step 13: Starting PM2..."
pm2 start ecosystem.config.js
sleep 10

# Step 14: Check status
echo "Step 14: Checking PM2 status..."
pm2 status

# Step 15: Check logs
echo "Step 15: Checking logs..."
pm2 logs --lines 50

echo "=========================================="
echo "✅ VPS COMPLETE FIX - SUCCESS!"
echo "=========================================="

