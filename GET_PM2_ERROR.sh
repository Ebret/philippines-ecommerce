#!/bin/bash

# Get PM2 Error Details

echo "=========================================="
echo "🔍 GETTING PM2 ERROR DETAILS"
echo "=========================================="
echo ""

cd /var/www/html/ecom/app

# Kill and restart
echo "Killing PM2..."
pm2 kill
sleep 3
pkill -9 node
sleep 2

# Start fresh
echo "Starting PM2..."
pm2 start ecosystem.config.js
sleep 5

# Get error logs
echo ""
echo "=========================================="
echo "📋 PM2 ERROR LOGS"
echo "=========================================="
pm2 logs philippines-ecommerce --lines 200 --nostream

echo ""
echo "=========================================="
echo "📊 PM2 STATUS"
echo "=========================================="
pm2 status

echo ""
echo "=========================================="
echo "📁 CHECKING ERROR LOG FILE"
echo "=========================================="
if [ -f "/root/.pm2/logs/philippines-ecommerce-error.log" ]; then
  echo "Error log file exists:"
  tail -100 /root/.pm2/logs/philippines-ecommerce-error.log
else
  echo "Error log file not found"
fi

echo ""
echo "=========================================="
echo "📁 CHECKING OUTPUT LOG FILE"
echo "=========================================="
if [ -f "/root/.pm2/logs/philippines-ecommerce-out.log" ]; then
  echo "Output log file exists:"
  tail -100 /root/.pm2/logs/philippines-ecommerce-out.log
else
  echo "Output log file not found"
fi

echo ""
echo "=========================================="
echo "✅ DIAGNOSTIC COMPLETE"
echo "=========================================="

