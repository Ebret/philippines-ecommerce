#!/bin/bash

# SSL Certificate Setup for Extreme Life Standalone
# Domain: original.extremelifeherbal.com
# VPS: 109.205.181.119

set -e  # Exit on error

echo "=========================================="
echo "SSL Certificate Setup"
echo "=========================================="
echo ""

# Check if domain is provided
DOMAIN=${1:-original.extremelifeherbal.com}

echo "Setting up SSL for: $DOMAIN"
echo ""

# Step 1: Install Certbot
echo "Step 1: Installing Certbot..."
apt install certbot python3-certbot-nginx -y

# Step 2: Obtain SSL Certificate
echo ""
echo "Step 2: Obtaining SSL certificate..."
echo "Note: Make sure DNS is configured to point $DOMAIN to 109.205.181.119"
echo ""

# Run certbot
certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@extremelifeherbal.com --redirect

# Step 3: Test SSL renewal
echo ""
echo "Step 3: Testing SSL certificate renewal..."
certbot renew --dry-run

# Step 4: Update Nginx configuration for better SSL settings
echo ""
echo "Step 4: Updating Nginx SSL configuration..."
cat > /etc/nginx/sites-available/extremelife << EOF
server {
    listen 80;
    server_name $DOMAIN;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # SPA routing fix
        try_files \$uri \$uri/ /index.html;
    }
}
EOF

# Test Nginx configuration
nginx -t

# Reload Nginx
systemctl reload nginx

echo ""
echo "=========================================="
echo "SSL Setup Complete!"
echo "=========================================="
echo ""
echo "Your site is now available at:"
echo "  https://$DOMAIN"
echo ""
echo "SSL Certificate Details:"
certbot certificates
echo ""
echo "Certificate will auto-renew. Check renewal with:"
echo "  certbot renew --dry-run"
echo ""

