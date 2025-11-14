#!/bin/bash

# Test Accounts Creation Script
# This script creates test accounts via API calls

BASE_URL="${1:-http://localhost:3001}"

echo "🚀 Creating test accounts at $BASE_URL"
echo ""

# Admin Account
echo "📝 Creating Admin account..."
curl -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "Admin123!",
    "firstName": "Admin",
    "lastName": "User",
    "role": "BUYER"
  }' \
  -w "\nStatus: %{http_code}\n\n"

# Buyer Account
echo "📝 Creating Buyer account..."
curl -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "buyer@test.com",
    "password": "Buyer123!",
    "firstName": "Buyer",
    "lastName": "User",
    "role": "BUYER"
  }' \
  -w "\nStatus: %{http_code}\n\n"

# Seller Account
echo "📝 Creating Seller account..."
curl -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seller@test.com",
    "password": "Seller123!",
    "firstName": "Seller",
    "lastName": "User",
    "role": "SELLER"
  }' \
  -w "\nStatus: %{http_code}\n\n"

echo "✅ Test accounts creation script completed!"
echo ""
echo "📋 Test Accounts:"
echo "   Admin:  admin@test.com / Admin123!"
echo "   Buyer:  buyer@test.com / Buyer123!"
echo "   Seller: seller@test.com / Seller123!"
echo ""
echo "⚠️  Note: Admin role needs to be set manually in database"
echo "    UPDATE \"User\" SET role = 'ADMIN' WHERE email = 'admin@test.com';"

