#!/bin/bash

# VPS Status Check Script
# VPS: 109.205.181.119
# Purpose: Diagnose current state of the server

echo "=========================================="
echo "VPS Status Check - extremelifeherbal.com"
echo "=========================================="
echo ""

# System Information
echo "=== System Information ==="
echo "Hostname: $(hostname)"
echo "IP Address: $(hostname -I | awk '{print $1}')"
echo "Uptime: $(uptime -p)"
echo "Date: $(date)"
echo ""

# Check PM2 Status
echo "=== PM2 Process Status ==="
pm2 status
echo ""

# Check PM2 List
echo "=== PM2 Process List ==="
pm2 list
echo ""

# Check Nginx Status
echo "=== Nginx Status ==="
systemctl status nginx --no-pager -l
echo ""

# Check Nginx Configuration
echo "=== Nginx Configuration Test ==="
nginx -t
echo ""

# Check Active Nginx Sites
echo "=== Active Nginx Sites ==="
ls -la /etc/nginx/sites-enabled/
echo ""

# Show Nginx Configurations
echo "=== Nginx Site Configurations ==="
for site in /etc/nginx/sites-enabled/*; do
    echo "--- Configuration: $site ---"
    cat "$site"
    echo ""
done

# Check Listening Ports
echo "=== Listening Ports ==="
netstat -tulpn | grep LISTEN
echo ""

# Check Port 80 and 443
echo "=== Port 80 Status ==="
netstat -tulpn | grep :80
echo ""

echo "=== Port 443 Status ==="
netstat -tulpn | grep :443
echo ""

echo "=== Port 3000 Status (Next.js) ==="
netstat -tulpn | grep :3000
echo ""

echo "=== Port 5000 Status (Extreme Life) ==="
netstat -tulpn | grep :5000
echo ""

# Check PostgreSQL
echo "=== PostgreSQL Status ==="
systemctl status postgresql --no-pager -l
echo ""

# Check Application Directory
echo "=== E-Commerce Application Directory ==="
if [ -d "/var/www/html/ecom/app" ]; then
    echo "Directory exists: /var/www/html/ecom/app"
    cd /var/www/html/ecom/app
    echo "Current branch: $(git branch --show-current)"
    echo "Latest commit: $(git log -1 --oneline)"
    echo "Node modules: $([ -d "node_modules" ] && echo "Installed" || echo "Not installed")"
    echo "Build directory: $([ -d ".next" ] && echo "Exists" || echo "Not found")"
else
    echo "Directory not found: /var/www/html/ecom/app"
fi
echo ""

# Check Extreme Life Directory
echo "=== Extreme Life Standalone Directory ==="
if [ -d "/opt/extremelife" ]; then
    echo "Directory exists: /opt/extremelife"
    cd /opt/extremelife
    echo "Latest commit: $(git log -1 --oneline)"
    echo "Node modules: $([ -d "node_modules" ] && echo "Installed" || echo "Not installed")"
else
    echo "Directory not found: /opt/extremelife"
fi
echo ""

# Test Local Access
echo "=== Local Access Tests ==="
echo "Testing http://localhost:3000 (E-Commerce):"
curl -I http://localhost:3000 2>&1 | head -5
echo ""

echo "Testing http://localhost:5000 (Extreme Life):"
curl -I http://localhost:5000 2>&1 | head -5
echo ""

echo "Testing http://localhost (Nginx):"
curl -I http://localhost 2>&1 | head -5
echo ""

echo "Testing https://extremelifeherbal.com:"
curl -I https://extremelifeherbal.com 2>&1 | head -5
echo ""

# Check SSL Certificates
echo "=== SSL Certificates ==="
if command -v certbot &> /dev/null; then
    certbot certificates
else
    echo "Certbot not installed"
fi
echo ""

# Check Recent Logs
echo "=== Recent Nginx Error Logs ==="
tail -20 /var/log/nginx/error.log
echo ""

echo "=== Recent Nginx Access Logs ==="
tail -20 /var/log/nginx/access.log
echo ""

# Check Disk Space
echo "=== Disk Space ==="
df -h
echo ""

# Check Memory Usage
echo "=== Memory Usage ==="
free -h
echo ""

echo "=========================================="
echo "Status Check Complete!"
echo "=========================================="
echo ""
echo "Summary:"
echo "- PM2 processes: $(pm2 list | grep -c 'online' || echo '0') online"
echo "- Nginx status: $(systemctl is-active nginx)"
echo "- PostgreSQL status: $(systemctl is-active postgresql)"
echo ""

