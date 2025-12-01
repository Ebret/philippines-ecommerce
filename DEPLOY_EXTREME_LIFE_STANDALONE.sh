#!/bin/bash

# Extreme Life Standalone Deployment Script
# VPS: 109.205.181.119
# Repository: https://github.com/aurexgold/extremelife.git
# Port: 5000
# Domain: original.extremelifeherbal.com (or configure as needed)

set -e  # Exit on error

echo "=========================================="
echo "Extreme Life Standalone Deployment"
echo "=========================================="
echo ""

# Step 1: Update System
echo "Step 1: Updating system packages..."
apt update && apt upgrade -y

# Step 2: Install Node.js 20.x, npm, and PM2
echo ""
echo "Step 2: Installing Node.js 20.x, npm, and PM2..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs npm
npm install -g pm2

# Verify installations
echo ""
echo "Verifying installations..."
node --version
npm --version
pm2 --version

# Step 3: Clone Repository
echo ""
echo "Step 3: Cloning Extreme Life repository..."
cd /opt

# Remove existing directory if it exists
if [ -d "extremelife" ]; then
    echo "Removing existing extremelife directory..."
    rm -rf extremelife
fi

git clone https://github.com/aurexgold/extremelife.git
cd extremelife

# Step 4: Install Dependencies
echo ""
echo "Step 4: Installing dependencies..."
npm install

# Step 5: Build Frontend
echo ""
echo "Step 5: Building frontend..."
npm run build:client

# Step 6: Configure PM2
echo ""
echo "Step 6: Starting application with PM2..."

# Stop existing PM2 process if running
pm2 delete extreme-life 2>/dev/null || true

# Start with PM2
pm2 start npm --name "extreme-life" -- run dev:client

# Configure PM2 to start on system boot
pm2 startup
pm2 save

# Show PM2 status
pm2 status

# Step 7: Install and Configure Nginx
echo ""
echo "Step 7: Installing and configuring Nginx..."
apt install nginx -y

# Create Nginx configuration
echo ""
echo "Creating Nginx configuration..."
cat > /etc/nginx/sites-available/extremelife << 'EOF'
server {
    listen 80;
    server_name original.extremelifeherbal.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # SPA routing fix
        try_files $uri $uri/ /index.html;
    }
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/extremelife /etc/nginx/sites-enabled/

# Test Nginx configuration
nginx -t

# Restart Nginx
systemctl restart nginx
systemctl enable nginx

echo ""
echo "=========================================="
echo "Deployment Complete!"
echo "=========================================="
echo ""
echo "Application Status:"
pm2 status
echo ""
echo "Next Steps:"
echo "1. Configure DNS: Point original.extremelifeherbal.com to 109.205.181.119"
echo "2. Install SSL certificate: Run the SSL setup script"
echo "3. Test the site: http://original.extremelifeherbal.com"
echo ""
echo "To install SSL certificate, run:"
echo "  bash /opt/extremelife/setup_ssl.sh"
echo ""

