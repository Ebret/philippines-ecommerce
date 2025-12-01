#!/bin/bash

# Quick Fix Script for extremelifeherbal.com
# VPS: 109.205.181.119
# Purpose: Restart all services and fix common issues

set -e  # Exit on error

echo "=========================================="
echo "Quick Fix - extremelifeherbal.com"
echo "=========================================="
echo ""

# Step 1: Check if application directory exists
echo "Step 1: Checking application directory..."
if [ ! -d "/var/www/html/ecom/app" ]; then
    echo "ERROR: Application directory not found!"
    echo "Please deploy the application first."
    exit 1
fi

cd /var/www/html/ecom/app
echo "✓ Application directory found"
echo ""

# Step 2: Check current branch
echo "Step 2: Checking git branch..."
CURRENT_BRANCH=$(git branch --show-current)
echo "Current branch: $CURRENT_BRANCH"
echo ""

# Step 3: Check if .next build exists
echo "Step 3: Checking build directory..."
if [ ! -d ".next" ]; then
    echo "⚠ Build directory not found. Running build..."
    npm run build
else
    echo "✓ Build directory exists"
fi
echo ""

# Step 4: Stop all PM2 processes
echo "Step 4: Stopping PM2 processes..."
pm2 kill
sleep 3
echo "✓ PM2 processes stopped"
echo ""

# Step 5: Start PM2 with ecosystem config
echo "Step 5: Starting PM2 processes..."
if [ -f "ecosystem.config.js" ]; then
    pm2 start ecosystem.config.js
    echo "✓ PM2 started with ecosystem.config.js"
else
    echo "⚠ ecosystem.config.js not found, starting manually..."
    pm2 start npm --name "ecommerce" -- start
fi
echo ""

# Step 6: Save PM2 configuration
echo "Step 6: Saving PM2 configuration..."
pm2 save
echo "✓ PM2 configuration saved"
echo ""

# Step 7: Check PM2 status
echo "Step 7: Checking PM2 status..."
pm2 status
echo ""

# Step 8: Restart Nginx
echo "Step 8: Restarting Nginx..."
systemctl restart nginx
echo "✓ Nginx restarted"
echo ""

# Step 9: Check Nginx status
echo "Step 9: Checking Nginx status..."
systemctl status nginx --no-pager -l | head -10
echo ""

# Step 10: Test local access
echo "Step 10: Testing local access..."
echo "Testing http://localhost:3000..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 || echo "000")
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "304" ]; then
    echo "✓ Application responding (HTTP $HTTP_CODE)"
else
    echo "⚠ Application not responding (HTTP $HTTP_CODE)"
fi
echo ""

# Step 11: Test Nginx proxy
echo "Step 11: Testing Nginx proxy..."
echo "Testing http://localhost..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost || echo "000")
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "304" ]; then
    echo "✓ Nginx proxy working (HTTP $HTTP_CODE)"
else
    echo "⚠ Nginx proxy not working (HTTP $HTTP_CODE)"
fi
echo ""

# Step 12: Test external access
echo "Step 12: Testing external access..."
echo "Testing https://extremelifeherbal.com..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://extremelifeherbal.com || echo "000")
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "304" ]; then
    echo "✓ Site accessible externally (HTTP $HTTP_CODE)"
else
    echo "⚠ Site not accessible externally (HTTP $HTTP_CODE)"
    echo "  This might be due to DNS propagation or SSL issues"
fi
echo ""

# Step 13: Check logs for errors
echo "Step 13: Checking recent logs..."
echo "=== PM2 Logs (last 20 lines) ==="
pm2 logs --lines 20 --nostream
echo ""

echo "=== Nginx Error Logs (last 10 lines) ==="
tail -10 /var/log/nginx/error.log
echo ""

echo "=========================================="
echo "Quick Fix Complete!"
echo "=========================================="
echo ""
echo "Summary:"
echo "- PM2 Status: $(pm2 list | grep -c 'online' || echo '0') processes online"
echo "- Nginx Status: $(systemctl is-active nginx)"
echo "- Local Access: HTTP $HTTP_CODE"
echo ""
echo "Next Steps:"
echo "1. Check PM2 logs: pm2 logs"
echo "2. Check Nginx logs: tail -f /var/log/nginx/error.log"
echo "3. Test site: curl -I https://extremelifeherbal.com"
echo "4. If still not working, run: bash CHECK_VPS_STATUS.sh"
echo ""

