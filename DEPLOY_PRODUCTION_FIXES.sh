#!/bin/bash

# DEPLOY_PRODUCTION_FIXES.sh
# Comprehensive deployment script for production fixes
# Run this on the VPS: bash DEPLOY_PRODUCTION_FIXES.sh

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}PRODUCTION FIXES DEPLOYMENT${NC}"
echo -e "${YELLOW}========================================${NC}\n"

# Step 1: Navigate to app directory
echo -e "${YELLOW}Step 1: Navigating to app directory...${NC}"
cd /var/www/html/ecom/app
echo -e "${GREEN}✅ Current directory: $(pwd)${NC}\n"

# Step 2: Pull latest code
echo -e "${YELLOW}Step 2: Pulling latest code from feature/relivator-ui-integration...${NC}"
git fetch origin
git pull origin feature/relivator-ui-integration
echo -e "${GREEN}✅ Code pulled successfully${NC}\n"

# Step 3: Run database fix script
echo -e "${YELLOW}Step 3: Running database fix script...${NC}"
npx ts-node FIX_CRITICAL_ISSUES.ts
echo -e "${GREEN}✅ Database fixes applied${NC}\n"

# Step 4: Kill existing processes
echo -e "${YELLOW}Step 4: Stopping existing PM2 processes...${NC}"
pm2 kill || true
sleep 3
pkill -9 node || true
sleep 2
echo -e "${GREEN}✅ Processes stopped${NC}\n"

# Step 5: Clean build
echo -e "${YELLOW}Step 5: Cleaning and rebuilding application...${NC}"
rm -rf .next
npm run build
echo -e "${GREEN}✅ Build completed${NC}\n"

# Step 6: Start PM2
echo -e "${YELLOW}Step 6: Starting PM2...${NC}"
pm2 start ecosystem.config.js
sleep 10
pm2 status
echo -e "${GREEN}✅ PM2 started${NC}\n"

# Step 7: Verify deployment
echo -e "${YELLOW}Step 7: Verifying deployment...${NC}"
curl -s https://extremelifeherbal.com | head -5
echo -e "${GREEN}✅ Deployment verified${NC}\n"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ DEPLOYMENT COMPLETE!${NC}"
echo -e "${GREEN}========================================${NC}\n"

echo -e "${YELLOW}Next steps:${NC}"
echo "1. Test Admin Dashboard: https://extremelifeherbal.com/admin"
echo "2. Test Vendor Dashboard: https://extremelifeherbal.com/vendor/dashboard"
echo "3. Test Live Streams: https://extremelifeherbal.com/live"
echo "4. Test Vendor Live: https://extremelifeherbal.com/vendor/live"
echo ""
echo -e "${YELLOW}Credentials:${NC}"
echo "Admin: admin@test.com / Admin123!"
echo "Seller: seller@test.com / Seller123!"
echo "Buyer: buyer@test.com / Buyer123!"

