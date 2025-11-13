#!/bin/bash

# Week 5-7 Deployment Script
# This script deploys Weeks 5-7 features to production

set -e

echo "=========================================="
echo "Week 5-7 Deployment Script"
echo "=========================================="

cd /var/www/html/philippines-ecommerce

echo "[1/5] Stopping PM2 process..."
pm2 stop philippines-ecommerce || true
sleep 2

echo "[2/5] Installing dependencies..."
npm install --production

echo "[3/5] Starting PM2 with ecosystem config..."
pm2 start ecosystem.config.js

echo "[4/5] Saving PM2 configuration..."
pm2 save

echo "[5/5] Checking PM2 status..."
pm2 status

echo ""
echo "=========================================="
echo "Deployment Complete!"
echo "=========================================="
echo ""
echo "Verifying application..."
sleep 3

# Check if application is responding
if curl -s http://localhost:3000 > /dev/null; then
    echo "✓ Application is responding on localhost:3000"
else
    echo "✗ Application is NOT responding on localhost:3000"
    echo "Checking PM2 logs..."
    pm2 logs philippines-ecommerce --lines 20 --nostream
fi

echo ""
echo "Deployment Summary:"
echo "- Weeks 5-7 features deployed"
echo "- PM2 process restarted"
echo "- Application should be accessible at https://extremelifeherbal.com"

