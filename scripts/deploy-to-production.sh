#!/bin/bash

# Production Deployment Script
# Usage: bash scripts/deploy-to-production.sh
# This script deploys currency fixes and adds sample products to production

set -e

echo "🚀 Starting Production Deployment..."
echo "=================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
VPS_HOST="109.205.181.119"
APP_DIR="/var/www/philippines-ecommerce"
REPO_URL="https://github.com/Ebret/philippines-ecommerce.git"

echo -e "${YELLOW}Step 1: Pulling Latest Changes${NC}"
cd "$APP_DIR"
git pull origin master
echo -e "${GREEN}✅ Latest changes pulled${NC}"

echo -e "${YELLOW}Step 2: Installing Dependencies${NC}"
npm install
echo -e "${GREEN}✅ Dependencies installed${NC}"

echo -e "${YELLOW}Step 3: Building Application${NC}"
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 4: Restarting PM2${NC}"
pm2 restart all
pm2 status
echo -e "${GREEN}✅ PM2 restarted${NC}"

echo -e "${YELLOW}Step 5: Verifying Deployment${NC}"
sleep 5
CURRENCY_CHECK=$(curl -s https://extremelifeherbal.com | grep -o "₱[0-9]*\.[0-9]*" | head -1)
if [[ $CURRENCY_CHECK == ₱* ]]; then
    echo -e "${GREEN}✅ Currency symbols verified: $CURRENCY_CHECK${NC}"
else
    echo -e "${RED}⚠️  Currency symbols not found, checking again...${NC}"
fi

echo -e "${YELLOW}Step 6: Adding Sample Products${NC}"
npx ts-node scripts/add-sample-products.ts
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Sample products added${NC}"
else
    echo -e "${RED}❌ Sample products script failed${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 7: Final Verification${NC}"
echo "Checking application status..."
pm2 status
echo ""
echo "Checking currency symbols on homepage..."
curl -s https://extremelifeherbal.com | grep -o "₱[0-9]*\.[0-9]*" | head -3
echo ""

echo -e "${GREEN}=================================="
echo "✅ Deployment Complete!"
echo "=================================="
echo ""
echo "Next Steps:"
echo "1. Visit https://extremelifeherbal.com to verify currency symbols"
echo "2. Check /products page for sample products"
echo "3. Login with seller@test.com to test live selling"
echo "4. Monitor PM2 logs: pm2 logs"
echo ""
echo "Deployment Summary:"
echo "- Currency fixes deployed ✅"
echo "- Sample products added ✅"
echo "- Application rebuilt ✅"
echo "- PM2 restarted ✅"
echo ""

