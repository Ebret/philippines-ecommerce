#!/bin/bash

# Phase 21 Week 1: Deploy Test Data to Production
# This script deploys test data to the production database

set -e

echo "╔════════════════════════════════════════════════════════════════════════════════╗"
echo "║         PHASE 21 WEEK 1: DEPLOY TEST DATA TO PRODUCTION DATABASE              ║"
echo "╚════════════════════════════════════════════════════════════════════════════════╝"
echo ""

# Configuration
VPS_HOST="109.205.181.119"
VPS_USER="root"
APP_DIR="/var/www/html/ecom/app"

echo "🚀 DEPLOYMENT CONFIGURATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Target VPS: $VPS_HOST"
echo "User: $VPS_USER"
echo "App Directory: $APP_DIR"
echo ""

echo "📋 TEST DATA TO BE DEPLOYED"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Test Accounts (3):"
echo "  • admin@test.com / Admin123!"
echo "  • buyer@test.com / Buyer123!"
echo "  • seller@test.com / Seller123!"
echo ""
echo "Test Products (10):"
echo "  • Herbal Tea: 4 products (₱1,599-₱1,999)"
echo "  • Supplements: 3 products (₱2,199-₱2,999)"
echo "  • Herbal Oils: 3 products (₱1,299-₱3,999)"
echo ""
echo "Vendor Stores (2):"
echo "  • Extreme Life Herbal Store"
echo "  • Premium Wellness Store"
echo ""

echo "🔐 CONNECTING TO VPS AND DEPLOYING TEST DATA"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Execute seed script on VPS
ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "$VPS_USER@$VPS_HOST" << 'EOF'
cd /var/www/html/ecom/app
echo "Running: npm run db:seed"
echo ""
npm run db:seed 2>&1
SEED_EXIT_CODE=$?
echo ""
echo "Seed script exit code: $SEED_EXIT_CODE"
EOF

echo ""
echo "✅ DEPLOYMENT COMPLETED"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next steps:"
echo "1. Verify test data in production database"
echo "2. Login as seller@test.com to create live sessions"
echo "3. Follow manual testing guide for comprehensive testing"
echo ""

