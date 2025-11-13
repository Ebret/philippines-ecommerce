#!/bin/bash

# Week 8 Deployment Script
# Deploys Week 8 code to production VPS

set -e

VPS_IP="109.205.181.119"
VPS_USER="root"
VPS_PATH="/var/www/html/philippines-ecommerce"
LOCAL_PATH="."

echo "🚀 Starting Week 8 Deployment..."
echo "Target: $VPS_IP:$VPS_PATH"

# Step 1: Build the application locally
echo "📦 Building application..."
npm run build

# Step 2: Copy .next folder
echo "📤 Copying .next folder..."
scp -r .next "$VPS_USER@$VPS_IP:$VPS_PATH/"

# Step 3: Copy public folder
echo "📤 Copying public folder..."
scp -r public "$VPS_USER@$VPS_IP:$VPS_PATH/"

# Step 4: Copy package.json and package-lock.json
echo "📤 Copying package files..."
scp package.json package-lock.json "$VPS_USER@$VPS_IP:$VPS_PATH/"

# Step 5: Copy .env file (if exists)
if [ -f .env.production ]; then
  echo "📤 Copying .env.production..."
  scp .env.production "$VPS_USER@$VPS_IP:$VPS_PATH/.env"
fi

# Step 6: Copy prisma folder
echo "📤 Copying prisma folder..."
scp -r prisma "$VPS_USER@$VPS_IP:$VPS_PATH/"

# Step 7: Copy src folder
echo "📤 Copying src folder..."
scp -r src "$VPS_USER@$VPS_IP:$VPS_PATH/"

# Step 8: SSH into VPS and install dependencies
echo "🔧 Installing dependencies on VPS..."
ssh "$VPS_USER@$VPS_IP" "cd $VPS_PATH && npm install --production"

# Step 9: Run Prisma migration
echo "🗄️  Running Prisma migration..."
ssh "$VPS_USER@$VPS_IP" "cd $VPS_PATH && npx prisma migrate deploy"

# Step 10: Restart PM2
echo "🔄 Restarting PM2..."
ssh "$VPS_USER@$VPS_IP" "pm2 restart all && pm2 save"

# Step 11: Verify deployment
echo "✅ Verifying deployment..."
sleep 5
ssh "$VPS_USER@$VPS_IP" "pm2 status"

echo "🎉 Week 8 Deployment Complete!"
echo "Check https://extremelifeherbal.com"

