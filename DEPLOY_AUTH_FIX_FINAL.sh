#!/bin/bash

# Final Authentication Fix Deployment Script
# Deploys to VPS 109.205.181.119

set -e

echo "🚀 DEPLOYING AUTHENTICATION FIX TO PRODUCTION VPS..."
echo ""

# Step 1: Pull latest changes
echo "📥 Step 1: Pulling latest changes from GitHub..."
cd /var/www/html/ecom/app
git pull origin feature/relivator-ui-integration
echo "✅ Git pull completed"
echo ""

# Step 2: Update DATABASE_URL with connection pooling
echo "🔧 Step 2: Updating DATABASE_URL with connection pooling..."
# Backup original
cp .env.production .env.production.backup

# Update DATABASE_URL
sed -i 's|DATABASE_URL=postgresql://postgres:password@localhost:5432/philippines_ecommerce|DATABASE_URL=postgresql://postgres:password@localhost:5432/philippines_ecommerce?schema=public\&connection_limit=5\&pool_timeout=10|g' .env.production

# Verify update
echo "Current DATABASE_URL:"
grep DATABASE_URL .env.production
echo "✅ DATABASE_URL updated with connection pooling"
echo ""

# Step 3: Install dependencies
echo "📦 Step 3: Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Step 4: Build application
echo "🔨 Step 4: Building application..."
npm run build
echo "✅ Build completed"
echo ""

# Step 5: Restart PM2
echo "🔄 Step 5: Restarting PM2 process..."
pm2 restart ecosystem.config.js
sleep 10
echo "✅ PM2 restarted"
echo ""

# Step 6: Verify deployment
echo "✅ Step 6: Verifying deployment..."
pm2 status
echo ""

# Step 7: Test homepage
echo "🌐 Testing homepage..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://extremelifeherbal.com)
echo "Homepage HTTP Status: $HTTP_STATUS"
echo ""

# Step 8: Test database connection
echo "🗄️ Testing database connection..."
psql postgresql://postgres:password@localhost:5432/philippines_ecommerce -c "SELECT COUNT(*) as user_count FROM \"User\";"
echo ""

# Step 9: Verify test accounts
echo "👥 Verifying test accounts..."
psql postgresql://postgres:password@localhost:5432/philippines_ecommerce -c "SELECT email, role, status FROM \"User\" WHERE email LIKE '%test.com%' ORDER BY email;"
echo ""

echo "✅ DEPLOYMENT COMPLETED SUCCESSFULLY!"
echo ""
echo "📋 Test Accounts Ready:"
echo "   Admin:  admin@test.com / Admin123!"
echo "   Buyer:  buyer@test.com / Buyer123!"
echo "   Seller: seller@test.com / Seller123!"
echo ""
echo "🔗 Login URL: https://extremelifeherbal.com/auth/login"
echo ""
echo "📊 Next Steps:"
echo "   1. Test login with each account"
echo "   2. Verify dashboards load correctly"
echo "   3. Check for 'fetch failed' errors"
echo "   4. Review PM2 logs if issues occur"

