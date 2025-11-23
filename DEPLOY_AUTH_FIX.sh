#!/bin/bash

# Deploy Authentication Fix to Production VPS
# Fixes: "Cannot fetch data from service: fetch failed" error

set -e

echo "🚀 Deploying Authentication Fix to Production VPS..."
echo ""

# SSH into VPS and deploy
ssh root@109.205.181.119 << 'EOF'

cd /var/www/html/ecom/app

echo "📥 Pulling latest changes from GitHub..."
git pull origin feature/relivator-ui-integration

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building application..."
npm run build

echo "🔄 Restarting PM2 process..."
pm2 restart ecosystem.config.js
sleep 5

echo "✅ Verifying deployment..."
pm2 status

echo ""
echo "🌐 Testing homepage..."
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" https://extremelifeherbal.com

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Test Accounts:"
echo "   Admin:  admin@test.com / Admin123!"
echo "   Buyer:  buyer@test.com / Buyer123!"
echo "   Seller: seller@test.com / Seller123!"
echo ""
echo "🔗 Login URL: https://extremelifeherbal.com/auth/login"

EOF

echo ""
echo "✅ Deployment script completed!"

