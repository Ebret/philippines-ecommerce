#!/bin/bash

# Admin Products Feature Deployment Script
# Deploy to VPS 109.205.181.119

echo "=========================================="
echo "Admin Products Feature Deployment"
echo "=========================================="
echo ""

# Step 1: Update code
echo "[1/6] Updating code from GitHub..."
cd /var/www/html/ecom/app
git fetch origin
git checkout feature/relivator-ui-integration
git pull origin feature/relivator-ui-integration

# Step 2: Install dependencies
echo "[2/6] Installing dependencies..."
npm install

# Step 3: Kill existing processes
echo "[3/6] Killing existing processes..."
pm2 kill
sleep 3
pkill -9 node
sleep 2

# Step 4: Rebuild application
echo "[4/6] Rebuilding application..."
npm run build
sleep 30

# Step 5: Start PM2
echo "[5/6] Starting PM2..."
pm2 start ecosystem.config.js
sleep 10

# Step 6: Verify deployment
echo "[6/6] Verifying deployment..."
pm2 status
echo ""
echo "=========================================="
echo "Deployment Complete!"
echo "=========================================="
echo ""
echo "Verify with:"
echo "  curl -I https://extremelifeherbal.com/admin/products"
echo "  pm2 logs --lines 50"

