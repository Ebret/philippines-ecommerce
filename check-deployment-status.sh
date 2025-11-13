#!/bin/bash

# Deployment Status Check Script
echo "=========================================="
echo "Week 5-7 Deployment Status Check"
echo "=========================================="
echo ""

cd /var/www/html/philippines-ecommerce

echo "[1] Checking if .next directory exists..."
if [ -d ".next" ]; then
    echo "✓ .next directory found"
    echo "  Size: $(du -sh .next | cut -f1)"
    echo "  Last modified: $(stat -c %y .next | cut -d' ' -f1,2)"
else
    echo "✗ .next directory NOT found"
fi

echo ""
echo "[2] Checking if node_modules exists..."
if [ -d "node_modules" ]; then
    echo "✓ node_modules directory found"
    echo "  Size: $(du -sh node_modules | cut -f1)"
    echo "  Package count: $(ls node_modules | wc -l)"
else
    echo "✗ node_modules directory NOT found"
fi

echo ""
echo "[3] Checking PM2 status..."
pm2 status

echo ""
echo "[4] Checking application logs..."
pm2 logs philippines-ecommerce --lines 10 --nostream

echo ""
echo "[5] Testing localhost:3000..."
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✓ Application responding on localhost:3000"
else
    echo "✗ Application NOT responding on localhost:3000"
fi

echo ""
echo "=========================================="
echo "Status Check Complete"
echo "=========================================="

