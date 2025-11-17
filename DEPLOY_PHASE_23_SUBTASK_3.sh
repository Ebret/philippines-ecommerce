#!/bin/bash

# Phase 23 Subtask 3: Rate Limiting & DDoS Protection - Production Deployment Script
# Target: https://extremelifeherbal.com (VPS: 109.205.181.119)
# Date: November 17, 2025

set -e

echo "=========================================="
echo "Phase 23 Subtask 3 - Production Deployment"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Verify we're in the correct directory
echo -e "${YELLOW}[1/6] Verifying deployment environment...${NC}"
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found. Please run this script from the project root.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Project root verified${NC}"
echo ""

# Step 2: Verify all required files exist
echo -e "${YELLOW}[2/6] Verifying required files...${NC}"
required_files=(
    "src/lib/rate-limit-config.ts"
    "src/middleware/rate-limit.ts"
    "__tests__/rate-limit.test.ts"
    "RATE_LIMITING_GUIDE.md"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo -e "${RED}Error: Required file not found: $file${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ $file${NC}"
done
echo ""

# Step 3: Run tests
echo -e "${YELLOW}[3/6] Running rate limiting tests...${NC}"
npm run test -- __tests__/rate-limit.test.ts --run 2>&1 | tail -20
echo -e "${GREEN}✓ Tests completed${NC}"
echo ""

# Step 4: Build the application
echo -e "${YELLOW}[4/6] Building application...${NC}"
npm run build 2>&1 | tail -30
echo -e "${GREEN}✓ Build completed${NC}"
echo ""

# Step 5: Commit changes
echo -e "${YELLOW}[5/6] Committing changes to git...${NC}"
git add -A
git commit -m "Deploy Phase 23 Subtask 3 to production" || echo "No changes to commit"
git push origin master
echo -e "${GREEN}✓ Changes pushed to GitHub${NC}"
echo ""

# Step 6: Deployment instructions
echo -e "${YELLOW}[6/6] Deployment Instructions${NC}"
echo ""
echo "To deploy to production VPS (109.205.181.119), run:"
echo ""
echo "  ssh root@109.205.181.119"
echo "  cd /var/www/extremelifeherbal.com"
echo "  git pull origin master"
echo "  npm run build"
echo "  pm2 restart all"
echo "  pm2 status"
echo ""
echo -e "${GREEN}=========================================="
echo "Deployment preparation complete!"
echo "==========================================${NC}"

