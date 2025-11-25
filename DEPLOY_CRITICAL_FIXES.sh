#!/bin/bash

# DEPLOY_CRITICAL_FIXES.sh
# Deployment script for critical issues fixes
# Usage: bash DEPLOY_CRITICAL_FIXES.sh

set -e

echo "🚀 DEPLOYING CRITICAL ISSUES FIXES"
echo "===================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Pull latest changes
echo -e "${YELLOW}Step 1: Pulling latest changes...${NC}"
cd /var/www/html/ecom/app
git pull origin feature/relivator-ui-integration
echo -e "${GREEN}✅ Latest changes pulled${NC}"
echo ""

# Step 2: Run database fixes
echo -e "${YELLOW}Step 2: Running database fixes...${NC}"
npx ts-node FIX_CRITICAL_ISSUES.ts
echo -e "${GREEN}✅ Database fixes applied${NC}"
echo ""

# Step 3: Kill all processes
echo -e "${YELLOW}Step 3: Killing all Node processes...${NC}"
pm2 kill && sleep 3 && pkill -9 node && sleep 3 && pkill -9 npm && sleep 2
echo -e "${GREEN}✅ All processes killed${NC}"
echo ""

# Step 4: Clean build
echo -e "${YELLOW}Step 4: Building application...${NC}"
rm -rf .next
npm run build
echo -e "${GREEN}✅ Build completed${NC}"
echo ""

# Step 5: Start PM2
echo -e "${YELLOW}Step 5: Starting PM2...${NC}"
pm2 start ecosystem.config.js
sleep 10
pm2 status
echo -e "${GREEN}✅ PM2 started${NC}"
echo ""

# Step 6: Verify deployment
echo -e "${YELLOW}Step 6: Verifying deployment...${NC}"
sleep 5
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://extremelifeherbal.com)
if [ "$RESPONSE" = "200" ]; then
  echo -e "${GREEN}✅ Website is online (HTTP $RESPONSE)${NC}"
else
  echo -e "${RED}❌ Website returned HTTP $RESPONSE${NC}"
fi
echo ""

echo -e "${GREEN}🎉 DEPLOYMENT COMPLETE!${NC}"
echo ""
echo "📋 Next Steps:"
echo "1. Test Admin Dashboard: https://extremelifeherbal.com/admin"
echo "2. Test Vendor Dashboard: https://extremelifeherbal.com/vendor/dashboard"
echo "3. Test Account Pages: https://extremelifeherbal.com/account/profile"
echo "4. Check browser console for errors (F12)"
echo ""

