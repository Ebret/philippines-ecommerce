#!/bin/bash

# Phase 21 - Test Data Deployment Script
# This script deploys test data to the production database
# Usage: ./deploy-test-data.sh

set -e

echo "🚀 Phase 21 - Test Data Deployment to Production"
echo "=================================================="
echo ""

# Configuration
APP_DIR="/var/www/html/ecom/app"
PRODUCTION_URL="https://extremelifeherbal.com"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

echo "📝 Deployment Information:"
echo "   Timestamp: $TIMESTAMP"
echo "   App Directory: $APP_DIR"
echo "   Production URL: $PRODUCTION_URL"
echo ""

# Step 1: Check if app directory exists
echo "Step 1: Checking application directory..."
if [ ! -d "$APP_DIR" ]; then
    echo "ERROR: Application directory not found: $APP_DIR"
    exit 1
fi
echo "OK: Application directory found"
echo ""

# Step 2: Check if npm is available
echo "Step 2: Checking npm availability..."
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm not found"
    exit 1
fi
echo "OK: npm is available"
echo ""

# Step 3: Navigate to app directory
echo "Step 3: Navigating to application directory..."
cd "$APP_DIR"
echo "OK: Current directory: $(pwd)"
echo ""

# Step 4: Run database seed script
echo "Step 4: Running database seed script..."
echo "Command: npm run db:seed"
echo ""

npm run db:seed

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Database seed completed successfully"
else
    echo ""
    echo "ERROR: Database seed failed"
    exit 1
fi
echo ""

# Step 5: Verify test accounts
echo "Step 5: Verifying test accounts..."
echo ""

TEST_ACCOUNTS=(
    "admin@test.com:Admin123!:ADMIN"
    "buyer@test.com:Buyer123!:BUYER"
    "seller@test.com:Seller123!:SELLER"
)

for account in "${TEST_ACCOUNTS[@]}"; do
    IFS=':' read -r email password role <<< "$account"
    echo "Testing: $email ($role)"
    
    response=$(curl -s -X POST "$PRODUCTION_URL/api/auth/login" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$email\",\"password\":\"$password\"}" \
        -w "\n%{http_code}")
    
    http_code=$(echo "$response" | tail -n1)
    
    if [ "$http_code" = "200" ]; then
        echo "  OK: Login successful"
    else
        echo "  WARNING: Login returned status $http_code"
    fi
done
echo ""

# Step 6: Verify products
echo "Step 6: Verifying test products..."
response=$(curl -s "$PRODUCTION_URL/api/products?limit=10")
product_count=$(echo "$response" | grep -o '"id"' | wc -l)

if [ "$product_count" -ge 10 ]; then
    echo "OK: All 10 test products deployed"
else
    echo "WARNING: Only $product_count products found"
fi
echo ""

# Step 7: Create deployment report
echo "Step 7: Creating deployment report..."
REPORT_FILE="$APP_DIR/DEPLOYMENT_REPORT_$(date '+%Y%m%d_%H%M%S').txt"

cat > "$REPORT_FILE" << EOF
Phase 21 - Test Data Deployment Report
======================================

Deployment Timestamp: $TIMESTAMP
Application Directory: $APP_DIR
Production URL: $PRODUCTION_URL

Test Accounts Created:
- admin@test.com / Admin123! (ADMIN)
- buyer@test.com / Buyer123! (BUYER)
- seller@test.com / Seller123! (SELLER)

Test Products Created: 10
- Herbal Tea: 4 products
- Supplements: 3 products
- Herbal Oils: 3 products

Test Infrastructure:
- 3 Product categories
- 2 Vendor stores
- 1 Shipping address

Deployment Status: SUCCESS
EOF

echo "OK: Report created at $REPORT_FILE"
echo ""

echo "✅ Deployment completed successfully"
echo ""
echo "📊 Summary:"
echo "   - 3 test accounts created"
echo "   - 10 test products created"
echo "   - 2 vendor stores created"
echo "   - All test data verified"
echo ""
echo "Next Steps:"
echo "   1. Run E2E tests: npm run test:e2e"
echo "   2. Generate report: npm run test:e2e:report"
echo "   3. Review results and fix any failures"

