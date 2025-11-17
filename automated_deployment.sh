#!/bin/bash

# Phase 23 Subtask 3: Automated Deployment Script
# Target: https://extremelifeherbal.com (VPS: 109.205.181.119)
# Date: November 17, 2025

set -e

VPS_IP="109.205.181.119"
VPS_USER="root"
APP_DIR="/var/www/extremelifeherbal.com"

echo "=========================================="
echo "Phase 23 Subtask 3: Automated Deployment"
echo "=========================================="
echo ""
echo "Target: https://extremelifeherbal.com"
echo "VPS: $VPS_IP"
echo "Date: $(date)"
echo ""

# Task 1: Review Current Deployment Status
echo "TASK 1: REVIEW CURRENT DEPLOYMENT STATUS"
echo "=========================================="
echo ""

echo "[1] Checking current git commit on VPS..."
CURRENT_COMMIT=$(ssh -o StrictHostKeyChecking=no $VPS_USER@$VPS_IP "cd $APP_DIR && git log --oneline -1")
echo "Current commit: $CURRENT_COMMIT"
echo ""

echo "[2] Checking for Phase 23 Subtask 3 files..."
ssh -o StrictHostKeyChecking=no $VPS_USER@$VPS_IP "cd $APP_DIR && ls -la src/lib/rate-limit-config.ts src/middleware/rate-limit.ts __tests__/rate-limit.test.ts RATE_LIMITING_GUIDE.md 2>&1 | grep -E '(rate-limit|RATE_LIMITING)' || echo 'Some files may be missing'"
echo ""

echo "[3] Checking PM2 status..."
ssh -o StrictHostKeyChecking=no $VPS_USER@$VPS_IP "pm2 status"
echo ""

# Task 2: Deploy
echo "TASK 2: DEPLOYMENT EXECUTION"
echo "============================="
echo ""

echo "[1/4] Pulling latest changes from GitHub..."
ssh -o StrictHostKeyChecking=no $VPS_USER@$VPS_IP "cd $APP_DIR && git pull origin master"
echo ""

echo "[2/4] Installing dependencies..."
ssh -o StrictHostKeyChecking=no $VPS_USER@$VPS_IP "cd $APP_DIR && npm install"
echo ""

echo "[3/4] Building application..."
ssh -o StrictHostKeyChecking=no $VPS_USER@$VPS_IP "cd $APP_DIR && npm run build"
echo ""

echo "[4/4] Restarting PM2 processes..."
ssh -o StrictHostKeyChecking=no $VPS_USER@$VPS_IP "pm2 restart all"
echo ""

# Task 3: Verification
echo "TASK 3: DEPLOYMENT VERIFICATION"
echo "================================"
echo ""

echo "[1] Final git commit hash:"
ssh -o StrictHostKeyChecking=no $VPS_USER@$VPS_IP "cd $APP_DIR && git log --oneline -1"
echo ""

echo "[2] PM2 Status:"
ssh -o StrictHostKeyChecking=no $VPS_USER@$VPS_IP "pm2 status"
echo ""

echo "[3] Website accessibility test:"
curl -I https://extremelifeherbal.com 2>&1 | head -5
echo ""

echo "[4] Rate limiting headers test:"
curl -I https://extremelifeherbal.com/api/products 2>&1 | grep -i "x-ratelimit\|http" || echo "Headers check completed"
echo ""

echo "[5] Rate limit enforcement test (101 requests)..."
for i in {1..101}; do
  curl -s https://extremelifeherbal.com/api/products > /dev/null
done
echo "Final request (should be 429):"
curl -I https://extremelifeherbal.com/api/products 2>&1 | head -5
echo ""

echo "[6] PM2 Logs (last 30 lines):"
ssh -o StrictHostKeyChecking=no $VPS_USER@$VPS_IP "pm2 logs --lines 30 --nostream"
echo ""

echo "=========================================="
echo "DEPLOYMENT COMPLETE"
echo "=========================================="

