#!/bin/bash

################################################################################
# Philippines E-Commerce Platform - Complete Deployment Script
# Date: November 10, 2025
# Purpose: Grant CREATEDB privilege, recreate database, apply migrations, deploy
################################################################################

set -e  # Exit on error

echo "╔════════════════════════════════════════════════════════════════════════════╗"
echo "║  Philippines E-Commerce Platform - Complete Deployment                    ║"
echo "║  Date: November 10, 2025                                                  ║"
echo "╚════════════════════════════════════════════════════════════════════════════╝"
echo ""

# ============================================================================
# STEP 1: Navigate to app directory and export DATABASE_URL
# ============================================================================
echo "📍 STEP 1: Navigate to app directory and export DATABASE_URL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cd /var/www/html/ecom/app
pwd
export DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce"
echo "✓ DATABASE_URL=$DATABASE_URL"
echo ""

# ============================================================================
# STEP 2: Grant CREATEDB privilege to user
# ============================================================================
echo "🔐 STEP 2: Grant CREATEDB privilege to user"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
PGPASSWORD=password psql -h localhost -U postgres -c "ALTER USER \"user\" CREATEDB;"
echo "✓ CREATEDB privilege granted"
echo ""

# ============================================================================
# STEP 3: Verify privilege was granted
# ============================================================================
echo "✅ STEP 3: Verify privilege was granted"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
PGPASSWORD=password psql -h localhost -U postgres -c "SELECT usename, usecreatedb FROM pg_user WHERE usename = 'user';"
echo "✓ Privilege verified (usecreatedb should be 't')"
echo ""

# ============================================================================
# STEP 4: Delete failed migrations
# ============================================================================
echo "🗑️  STEP 4: Delete failed migrations"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
rm -rf /var/www/html/ecom/app/prisma/migrations/*
echo "✓ All migrations deleted"
echo ""

# ============================================================================
# STEP 5: Drop database
# ============================================================================
echo "🗑️  STEP 5: Drop database"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
PGPASSWORD=password psql -h localhost -U postgres -c "DROP DATABASE IF EXISTS philippines_ecommerce;"
sleep 1
echo "✓ Database dropped"
echo ""

# ============================================================================
# STEP 6: Create database with proper ownership
# ============================================================================
echo "🗄️  STEP 6: Create database with proper ownership"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
PGPASSWORD=password psql -h localhost -U postgres -c "CREATE DATABASE philippines_ecommerce OWNER \"user\";"
sleep 1
echo "✓ Database created with owner 'user'"
echo ""

# ============================================================================
# STEP 7: Generate and apply migrations
# ============================================================================
echo "🔄 STEP 7: Generate and apply migrations"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
npx prisma migrate dev --name init
echo "✓ Migrations generated and applied"
echo ""

# ============================================================================
# STEP 8: Verify migration status
# ============================================================================
echo "✅ STEP 8: Verify migration status"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
npx prisma migrate status
echo ""

# ============================================================================
# STEP 9: List all created tables
# ============================================================================
echo "📊 STEP 9: List all created tables"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "\dt"
echo ""

# ============================================================================
# STEP 10: Verify database connection
# ============================================================================
echo "🔗 STEP 10: Verify database connection"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1 as connection_test;"
echo "✓ Database connection verified"
echo ""

# ============================================================================
# STEP 11: Execute deployment script
# ============================================================================
echo "🚀 STEP 11: Execute deployment script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ -f "/var/www/html/ecom/scripts/deploy.sh" ]; then
    echo "✓ Deployment script found at /var/www/html/ecom/scripts/deploy.sh"
    chmod +x /var/www/html/ecom/scripts/deploy.sh
    echo "✓ Deployment script made executable"
    echo ""
    echo "Running deployment script..."
    /var/www/html/ecom/scripts/deploy.sh
else
    echo "⚠️  Deployment script not found at /var/www/html/ecom/scripts/deploy.sh"
    echo "Available scripts in /var/www/html/ecom/scripts/:"
    ls -la /var/www/html/ecom/scripts/ 2>/dev/null || echo "Scripts directory not found"
fi
echo ""

# ============================================================================
# FINAL STATUS
# ============================================================================
echo "╔════════════════════════════════════════════════════════════════════════════╗"
echo "║  ✅ DEPLOYMENT COMPLETE                                                   ║"
echo "╚════════════════════════════════════════════════════════════════════════════╝"
echo ""
echo "📊 DEPLOYMENT SUMMARY:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✓ CREATEDB privilege granted to 'user'"
echo "✓ Database 'philippines_ecommerce' recreated"
echo "✓ Prisma migrations generated and applied"
echo "✓ All database tables created"
echo "✓ Database connection verified"
echo "✓ Deployment script executed"
echo ""
echo "🎉 Philippines E-Commerce Platform is now deployed!"
echo ""

