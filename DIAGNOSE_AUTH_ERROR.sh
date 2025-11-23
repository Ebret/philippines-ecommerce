#!/bin/bash

# Diagnostic script for authentication error

echo "🔍 DIAGNOSING AUTHENTICATION ERROR..."
echo ""

# Check PM2 status
echo "1️⃣ PM2 Status:"
pm2 status

echo ""
echo "2️⃣ PM2 Logs (Last 50 lines):"
pm2 logs philippines-ecommerce --lines 50 --nostream

echo ""
echo "3️⃣ Database Connection Test:"
psql postgresql://postgres:password@localhost:5432/philippines_ecommerce -c "SELECT COUNT(*) as user_count FROM \"User\" WHERE email LIKE '%test.com%';"

echo ""
echo "4️⃣ Test User Details:"
psql postgresql://postgres:password@localhost:5432/philippines_ecommerce -c "SELECT id, email, role, status, emailVerified FROM \"User\" WHERE email = 'admin@test.com';"

echo ""
echo "5️⃣ Environment Variables:"
echo "DATABASE_URL: $DATABASE_URL"
echo "NEXTAUTH_URL: $NEXTAUTH_URL"
echo "NODE_ENV: $NODE_ENV"

echo ""
echo "6️⃣ Application Health Check:"
curl -s -o /dev/null -w "Homepage Status: %{http_code}\n" https://extremelifeherbal.com

echo ""
echo "✅ Diagnostic complete!"

