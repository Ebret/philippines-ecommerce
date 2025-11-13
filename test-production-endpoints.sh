#!/bin/bash

# Production Testing Script
# Tests all deployed API endpoints

BASE_URL="https://extremelifeherbal.com"
RESULTS_FILE="/tmp/production-test-results.txt"

echo "=========================================="
echo "Production API Testing"
echo "=========================================="
echo "Base URL: $BASE_URL"
echo "Results: $RESULTS_FILE"
echo ""

# Initialize results file
> $RESULTS_FILE

# Function to test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local description=$3
    
    echo -n "Testing $description... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" -k "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -k -X $method "$BASE_URL$endpoint")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    
    if [ "$http_code" = "200" ] || [ "$http_code" = "201" ] || [ "$http_code" = "400" ]; then
        echo "✓ ($http_code)"
        echo "✓ $description - HTTP $http_code" >> $RESULTS_FILE
    else
        echo "✗ ($http_code)"
        echo "✗ $description - HTTP $http_code" >> $RESULTS_FILE
    fi
}

# Test main pages
echo "Testing Main Pages..."
test_endpoint "GET" "/" "Home Page"
test_endpoint "GET" "/products" "Products Page"
test_endpoint "GET" "/cart" "Cart Page"
test_endpoint "GET" "/checkout" "Checkout Page"
test_endpoint "GET" "/search" "Search Page"

# Test authentication pages
echo ""
echo "Testing Authentication Pages..."
test_endpoint "GET" "/auth/login" "Login Page"
test_endpoint "GET" "/auth/register" "Register Page"

# Test account pages
echo ""
echo "Testing Account Pages..."
test_endpoint "GET" "/account/profile" "Account Profile"
test_endpoint "GET" "/account/orders" "Account Orders"
test_endpoint "GET" "/account/addresses" "Account Addresses"
test_endpoint "GET" "/account/settings" "Account Settings"

# Test vendor pages
echo ""
echo "Testing Vendor Pages..."
test_endpoint "GET" "/vendor/dashboard" "Vendor Dashboard"
test_endpoint "GET" "/vendor/analytics" "Vendor Analytics"
test_endpoint "GET" "/vendor/earnings" "Vendor Earnings"
test_endpoint "GET" "/vendor/orders" "Vendor Orders"

# Test API endpoints
echo ""
echo "Testing API Endpoints..."
test_endpoint "GET" "/api/products" "Products API"
test_endpoint "GET" "/api/categories" "Categories API"
test_endpoint "GET" "/api/cart" "Cart API"
test_endpoint "GET" "/api/orders" "Orders API"
test_endpoint "GET" "/api/vendors" "Vendors API"
test_endpoint "GET" "/api/notifications" "Notifications API"

echo ""
echo "=========================================="
echo "Testing Complete"
echo "=========================================="
echo ""
echo "Results saved to: $RESULTS_FILE"
cat $RESULTS_FILE

