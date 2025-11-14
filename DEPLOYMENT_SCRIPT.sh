#!/bin/bash

# Phase 20.1 Production Deployment Script
# Deploys latest code to production VPS at 109.205.181.119

set -e

echo "=========================================="
echo "Phase 20.1 Production Deployment"
echo "=========================================="
echo ""

# Configuration
VPS_HOST="109.205.181.119"
VPS_USER="root"
APP_DIR="/var/www/html/ecom/app"
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

echo "[${TIMESTAMP}] Starting deployment to production VPS..."
echo ""

# Step 1: SSH and pull latest code
echo "Step 1: Pulling latest code from GitHub..."
ssh ${VPS_USER}@${VPS_HOST} "cd ${APP_DIR} && git pull origin master" || {
    echo "ERROR: Failed to pull from GitHub"
    exit 1
}
echo "✓ Code pulled successfully"
echo ""

# Step 2: Install dependencies
echo "Step 2: Installing dependencies..."
ssh ${VPS_USER}@${VPS_HOST} "cd ${APP_DIR} && npm install" || {
    echo "ERROR: Failed to install dependencies"
    exit 1
}
echo "✓ Dependencies installed successfully"
echo ""

# Step 3: Build application
echo "Step 3: Building application..."
ssh ${VPS_USER}@${VPS_HOST} "cd ${APP_DIR} && npm run build" || {
    echo "ERROR: Failed to build application"
    exit 1
}
echo "✓ Application built successfully"
echo ""

# Step 4: Restart PM2 processes
echo "Step 4: Restarting PM2 processes..."
ssh ${VPS_USER}@${VPS_HOST} "cd ${APP_DIR} && pm2 restart all" || {
    echo "ERROR: Failed to restart PM2"
    exit 1
}
echo "✓ PM2 processes restarted successfully"
echo ""

# Step 5: Verify deployment
echo "Step 5: Verifying deployment..."
ssh ${VPS_USER}@${VPS_HOST} "pm2 status" || {
    echo "ERROR: Failed to check PM2 status"
    exit 1
}
echo "✓ Deployment verified successfully"
echo ""

echo "=========================================="
echo "✓ Deployment completed successfully!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Test testimonials pages at https://extremelifeherbal.com/testimonials"
echo "2. Verify homepage currency symbols (should show ₱ not $$)"
echo "3. Check PM2 logs for any errors"
echo ""

