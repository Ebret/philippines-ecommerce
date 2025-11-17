#!/bin/bash

echo "=========================================="
echo "Phase 23 Subtask 3: VPS Deployment Review"
echo "=========================================="
echo ""

# Task 1: Review Current Deployment Status
echo "TASK 1: REVIEW CURRENT DEPLOYMENT STATUS"
echo "=========================================="
echo ""

# Step 1: Navigate to app directory
echo "[1] Navigating to application directory..."
cd /var/www/extremelifeherbal.com
echo "Current directory: $(pwd)"
echo ""

# Step 2: Check current git commit
echo "[2] Current git commit hash:"
CURRENT_COMMIT=$(git log --oneline -1)
echo "$CURRENT_COMMIT"
echo ""

# Step 3: Check if files are present
echo "[3] Checking for Phase 23 Subtask 3 implementation files:"
echo ""
echo "Checking src/lib/rate-limit-config.ts:"
if [ -f "src/lib/rate-limit-config.ts" ]; then
  echo "✓ PRESENT"
else
  echo "✗ MISSING"
fi

echo "Checking src/middleware/rate-limit.ts:"
if [ -f "src/middleware/rate-limit.ts" ]; then
  echo "✓ PRESENT"
else
  echo "✗ MISSING"
fi

echo "Checking __tests__/rate-limit.test.ts:"
if [ -f "__tests__/rate-limit.test.ts" ]; then
  echo "✓ PRESENT"
else
  echo "✗ MISSING"
fi

echo "Checking RATE_LIMITING_GUIDE.md:"
if [ -f "RATE_LIMITING_GUIDE.md" ]; then
  echo "✓ PRESENT"
else
  echo "✗ MISSING"
fi
echo ""

# Step 4: Check PM2 status
echo "[4] PM2 Status:"
pm2 status
echo ""

# Step 5: Check recent logs
echo "[5] Recent PM2 Logs (last 20 lines):"
pm2 logs --lines 20 --nostream
echo ""

# Task 2: Deploy if needed
echo "=========================================="
echo "TASK 2: DEPLOYMENT EXECUTION"
echo "=========================================="
echo ""

# Check if we need to deploy
EXPECTED_COMMIT="cff082d"
if [[ "$CURRENT_COMMIT" == *"$EXPECTED_COMMIT"* ]]; then
  echo "✓ Already at latest commit ($EXPECTED_COMMIT)"
  echo "Skipping deployment..."
else
  echo "⚠ Behind latest commit (expected: $EXPECTED_COMMIT)"
  echo "Executing deployment..."
  echo ""
  
  echo "[1/4] Pulling latest changes from GitHub..."
  git pull origin master
  echo ""
  
  echo "[2/4] Installing dependencies..."
  npm install
  echo ""
  
  echo "[3/4] Building application..."
  npm run build
  echo ""
  
  echo "[4/4] Restarting PM2 processes..."
  pm2 restart all
  echo ""
fi

# Task 3: Verification
echo "=========================================="
echo "TASK 3: DEPLOYMENT VERIFICATION"
echo "=========================================="
echo ""

echo "[1] Final git commit hash:"
git log --oneline -1
echo ""

echo "[2] PM2 Status:"
pm2 status
echo ""

echo "[3] Website accessibility test:"
curl -I https://extremelifeherbal.com 2>&1 | head -5
echo ""

echo "[4] Rate limiting headers test:"
curl -I https://extremelifeherbal.com/api/products 2>&1 | grep -i "x-ratelimit\|http"
echo ""

echo "[5] Rate limit enforcement test (101 requests)..."
for i in {1..101}; do
  curl -s https://extremelifeherbal.com/api/products > /dev/null
done
echo "Final request (should be 429):"
curl -I https://extremelifeherbal.com/api/products 2>&1 | head -5
echo ""

echo "[6] PM2 Logs (last 30 lines):"
pm2 logs --lines 30 --nostream
echo ""

echo "=========================================="
echo "DEPLOYMENT REVIEW COMPLETE"
echo "=========================================="

