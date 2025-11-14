#!/bin/bash

# Production Database Seeding Script
# This script runs the database seed on the production server

set -e

echo "🌱 Starting production database seeding..."
echo "=========================================="

# SSH into production server and run seed
ssh -i ~/.ssh/id_rsa root@109.205.181.119 << 'EOF'
  set -e
  
  echo "📍 Connected to production server"
  echo "📂 Navigating to application directory..."
  cd /var/www/html/philippines-ecommerce
  
  echo "🔍 Checking environment..."
  echo "Node version: $(node --version)"
  echo "NPM version: $(npm --version)"
  
  echo "📦 Installing dependencies (if needed)..."
  npm install --legacy-peer-deps 2>&1 | tail -5
  
  echo "🌱 Running database seed..."
  npm run db:seed
  
  echo "✅ Seed completed successfully!"
  
  echo "📊 Verifying data..."
  npx prisma studio --browser none &
  sleep 2
  
  echo "✅ Production database seeding completed!"
EOF

echo "=========================================="
echo "✅ Production seeding script completed!"

