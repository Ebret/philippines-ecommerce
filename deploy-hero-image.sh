#!/bin/bash

# Deployment script for hero banner image fix
# This script deploys the hero banner image to production

set -e

VPS_HOST="root@109.205.181.119"
VPS_APP_DIR="/var/www/html/ecom/app"

echo "🚀 Starting deployment of hero banner image..."
echo ""

# Step 1: Pull latest changes from GitHub
echo "📥 Step 1: Pulling latest changes from GitHub..."
ssh -o StrictHostKeyChecking=no $VPS_HOST "cd $VPS_APP_DIR && git pull origin master"
echo "✅ Git pull completed"
echo ""

# Step 2: Install dependencies
echo "📦 Step 2: Installing dependencies..."
ssh -o StrictHostKeyChecking=no $VPS_HOST "cd $VPS_APP_DIR && npm install"
echo "✅ Dependencies installed"
echo ""

# Step 3: Build the application
echo "🔨 Step 3: Building the application..."
ssh -o StrictHostKeyChecking=no $VPS_HOST "cd $VPS_APP_DIR && npm run build"
echo "✅ Build completed"
echo ""

# Step 4: Restart PM2 processes
echo "🔄 Step 4: Restarting PM2 processes..."
ssh -o StrictHostKeyChecking=no $VPS_HOST "pm2 restart all"
echo "✅ PM2 processes restarted"
echo ""

# Step 5: Verify deployment
echo "✔️ Step 5: Verifying deployment..."
ssh -o StrictHostKeyChecking=no $VPS_HOST "pm2 status"
echo ""

echo "🎉 Deployment completed successfully!"
echo ""
echo "📍 Website: https://extremelifeherbal.com"
echo "🖼️  Hero banner image deployed: /public/hero-banner.png"

