#!/bin/bash

# Capture PM2 Logs and Diagnostics

cd /var/www/html/ecom/app

echo "=========================================="
echo "📋 CAPTURING PM2 LOGS AND DIAGNOSTICS"
echo "=========================================="
echo ""

# Kill and restart
echo "Killing PM2..."
pm2 kill 2>/dev/null
sleep 3
pkill -9 node 2>/dev/null
sleep 2

# Start PM2
echo "Starting PM2..."
pm2 start ecosystem.config.js
sleep 5

# Get status
echo ""
echo "=========================================="
echo "PM2 STATUS"
echo "=========================================="
pm2 status

# Get logs
echo ""
echo "=========================================="
echo "PM2 LOGS (last 100 lines)"
echo "=========================================="
pm2 logs philippines-ecommerce --lines 100 --nostream

# Check error log file
echo ""
echo "=========================================="
echo "ERROR LOG FILE"
echo "=========================================="
if [ -f "/root/.pm2/logs/philippines-ecommerce-error.log" ]; then
  echo "File: /root/.pm2/logs/philippines-ecommerce-error.log"
  echo "Size: $(wc -c < /root/.pm2/logs/philippines-ecommerce-error.log) bytes"
  echo "Content:"
  cat /root/.pm2/logs/philippines-ecommerce-error.log
else
  echo "Error log file not found"
fi

# Check output log file
echo ""
echo "=========================================="
echo "OUTPUT LOG FILE"
echo "=========================================="
if [ -f "/root/.pm2/logs/philippines-ecommerce-out.log" ]; then
  echo "File: /root/.pm2/logs/philippines-ecommerce-out.log"
  echo "Size: $(wc -c < /root/.pm2/logs/philippines-ecommerce-out.log) bytes"
  echo "Content:"
  cat /root/.pm2/logs/philippines-ecommerce-out.log
else
  echo "Output log file not found"
fi

# Check if process is running
echo ""
echo "=========================================="
echo "PROCESS CHECK"
echo "=========================================="
ps aux | grep -E "node|npm" | grep -v grep

# Check port
echo ""
echo "=========================================="
echo "PORT CHECK"
echo "=========================================="
lsof -i :3000 2>/dev/null || echo "Port 3000 not in use"

echo ""
echo "=========================================="
echo "✅ CAPTURE COMPLETE"
echo "=========================================="

