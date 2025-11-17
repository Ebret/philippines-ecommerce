#!/bin/bash
set -e

echo "=========================================="
echo "Phase 23 Subtask 3 Deployment"
echo "Target: https://extremelifeherbal.com"
echo "Date: November 17, 2025"
echo "=========================================="
echo ""

# Step 1: Navigate to app directory
echo "[STEP 1] Navigating to application directory..."
cd /var/www/extremelifeherbal.com
echo "Current directory: $(pwd)"
echo ""

# Step 2: Pull latest changes
echo "[STEP 2] Pulling latest changes from GitHub..."
git pull origin master
echo ""

# Step 3: Install dependencies
echo "[STEP 3] Installing dependencies..."
npm install
echo ""

# Step 4: Build application
echo "[STEP 4] Building application..."
npm run build
echo ""

# Step 5: Restart PM2
echo "[STEP 5] Restarting PM2 processes..."
pm2 restart all
echo ""

# Step 6: Check PM2 status
echo "[STEP 6] Checking PM2 status..."
pm2 status
echo ""

# Verification 1: Git commit
echo "=========================================="
echo "VERIFICATION TESTS"
echo "=========================================="
echo ""
echo "[VERIFY 1] Git commit hash:"
git log --oneline -1
echo ""

# Verification 2: Files present
echo "[VERIFY 2] Checking implementation files:"
ls -la src/lib/rate-limit-config.ts src/middleware/rate-limit.ts __tests__/rate-limit.test.ts RATE_LIMITING_GUIDE.md
echo ""

# Verification 3: Website accessibility
echo "[VERIFY 3] Testing website accessibility:"
curl -I https://extremelifeherbal.com 2>&1 | head -5
echo ""

# Verification 4: Rate limit headers
echo "[VERIFY 4] Checking rate limit headers:"
curl -I https://extremelifeherbal.com/api/products 2>&1 | grep -i 'x-ratelimit\|http'
echo ""

# Verification 5: Rate limit enforcement
echo "[VERIFY 5] Testing rate limit enforcement (101 requests)..."
for i in {1..101}; do
  curl -s https://extremelifeherbal.com/api/products > /dev/null
done
echo "Making final request to check 429 response:"
curl -I https://extremelifeherbal.com/api/products 2>&1 | head -5
echo ""

# Verification 6: PM2 logs
echo "[VERIFY 6] Checking PM2 logs (last 20 lines):"
pm2 logs --lines 20 --nostream
echo ""

echo "=========================================="
echo "DEPLOYMENT COMPLETE"
echo "=========================================="

