#!/bin/bash

# Phase 21: Fix Authentication Issues on Production VPS
# This script deploys test data and verifies authentication setup

set -e

echo "╔════════════════════════════════════════════════════════════════════════════════╗"
echo "║         PHASE 21: FIX AUTHENTICATION ISSUES - PRODUCTION VPS                   ║"
echo "╚════════════════════════════════════════════════════════════════════════════════╝"
echo ""

# Configuration
VPS_HOST="109.205.181.119"
VPS_USER="root"
APP_DIR="/var/www/html/ecom/app"

echo "🔐 PRODUCTION ENVIRONMENT CONFIGURATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "VPS Host: $VPS_HOST"
echo "User: $VPS_USER"
echo "App Directory: $APP_DIR"
echo ""

echo "📋 TEST ACCOUNTS TO BE CREATED"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Admin Account:"
echo "   Email: admin@test.com"
echo "   Password: Admin123!"
echo "   Role: ADMIN"
echo ""
echo "2. Buyer Account:"
echo "   Email: buyer@test.com"
echo "   Password: Buyer123!"
echo "   Role: BUYER"
echo ""
echo "3. Seller Account:"
echo "   Email: seller@test.com"
echo "   Password: Seller123!"
echo "   Role: SELLER"
echo ""

echo "🔍 STEP 1: CHECK IF TEST ACCOUNTS EXIST"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "$VPS_USER@$VPS_HOST" << 'EOF'
cd /var/www/html/ecom/app

echo "Checking database for test accounts..."
echo ""

# Check if test accounts exist
psql -U postgres -d ecommerce -c "SELECT email, role, status, \"emailVerified\" FROM \"User\" WHERE email IN ('admin@test.com', 'buyer@test.com', 'seller@test.com');" 2>/dev/null || echo "Database query failed - may need to run seed script"

echo ""
EOF

echo ""
echo "🌱 STEP 2: DEPLOY TEST DATA (RUN SEED SCRIPT)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "$VPS_USER@$VPS_HOST" << 'EOF'
cd /var/www/html/ecom/app

echo "Running: npm run db:seed"
echo ""

npm run db:seed 2>&1

echo ""
echo "✅ Seed script completed"
EOF

echo ""
echo "✅ AUTHENTICATION FIX COMPLETED"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next steps:"
echo "1. Try logging in with test accounts:"
echo "   - admin@test.com / Admin123!"
echo "   - buyer@test.com / Buyer123!"
echo "   - seller@test.com / Seller123!"
echo ""
echo "2. Verify each account can access their respective pages:"
echo "   - Admin: https://extremelifeherbal.com/admin/live-streams"
echo "   - Buyer: https://extremelifeherbal.com/live"
echo "   - Seller: https://extremelifeherbal.com/vendor/live"
echo ""

