#!/bin/bash

#===============================================================================
# SECURE VPS SETUP SCRIPT
# For Philippines E-Commerce Platform (Extreme Life Herbal)
# 
# RUN THIS ON A FRESH Ubuntu 22.04/24.04 INSTALLATION ONLY
# 
# Usage: 
#   1. SSH into fresh VPS as root
#   2. Copy this script to server
#   3. chmod +x SECURE_VPS_SETUP.sh
#   4. ./SECURE_VPS_SETUP.sh
#===============================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}   SECURE VPS SETUP - Extreme Life Herbal${NC}"
echo -e "${GREEN}================================================${NC}"

#-------------------------------------------------------------------------------
# CONFIGURATION - CHANGE THESE VALUES
#-------------------------------------------------------------------------------
DEPLOY_USER="deploy"
DOMAIN="extremelifeherbal.com"
APP_DIR="/var/www/html/philippines-ecommerce"
NODE_VERSION="20"
GITHUB_REPO="https://github.com/Ebret/philippines-ecommerce.git"
GITHUB_BRANCH="feature/relivator-ui-integration"

# Prompt for passwords
echo -e "${YELLOW}Enter password for deploy user:${NC}"
read -s DEPLOY_PASSWORD
echo -e "${YELLOW}Enter your SSH public key (or press Enter to skip):${NC}"
read SSH_PUBLIC_KEY

#-------------------------------------------------------------------------------
# STEP 1: System Update
#-------------------------------------------------------------------------------
echo -e "\n${GREEN}[1/12] Updating system packages...${NC}"
apt update && apt upgrade -y
apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release

#-------------------------------------------------------------------------------
# STEP 2: Create Deploy User (Non-Root)
#-------------------------------------------------------------------------------
echo -e "\n${GREEN}[2/12] Creating deploy user...${NC}"
if id "$DEPLOY_USER" &>/dev/null; then
    echo "User $DEPLOY_USER already exists"
else
    useradd -m -s /bin/bash "$DEPLOY_USER"
    echo "$DEPLOY_USER:$DEPLOY_PASSWORD" | chpasswd
    usermod -aG sudo "$DEPLOY_USER"
    echo "$DEPLOY_USER ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/$DEPLOY_USER
    chmod 440 /etc/sudoers.d/$DEPLOY_USER
fi

# Setup SSH keys for deploy user
if [ -n "$SSH_PUBLIC_KEY" ]; then
    mkdir -p /home/$DEPLOY_USER/.ssh
    echo "$SSH_PUBLIC_KEY" >> /home/$DEPLOY_USER/.ssh/authorized_keys
    chmod 700 /home/$DEPLOY_USER/.ssh
    chmod 600 /home/$DEPLOY_USER/.ssh/authorized_keys
    chown -R $DEPLOY_USER:$DEPLOY_USER /home/$DEPLOY_USER/.ssh
fi

#-------------------------------------------------------------------------------
# STEP 3: Configure SSH Security
#-------------------------------------------------------------------------------
echo -e "\n${GREEN}[3/12] Hardening SSH configuration...${NC}"
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup

cat > /etc/ssh/sshd_config.d/hardening.conf << 'EOF'
# SSH Hardening Configuration
Port 22
Protocol 2
PermitRootLogin prohibit-password
PasswordAuthentication no
PubkeyAuthentication yes
PermitEmptyPasswords no
X11Forwarding no
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2
AllowUsers deploy
EOF

# Only disable password auth if SSH key was provided
if [ -z "$SSH_PUBLIC_KEY" ]; then
    sed -i 's/PasswordAuthentication no/PasswordAuthentication yes/' /etc/ssh/sshd_config.d/hardening.conf
    echo -e "${YELLOW}WARNING: Password authentication enabled (no SSH key provided)${NC}"
    echo -e "${YELLOW}Add SSH key later and disable password auth for better security${NC}"
fi

systemctl restart sshd

#-------------------------------------------------------------------------------
# STEP 4: Configure Firewall (UFW)
#-------------------------------------------------------------------------------
echo -e "\n${GREEN}[4/12] Configuring firewall...${NC}"
apt install -y ufw

ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow http
ufw allow https
# Block outgoing SMTP to prevent spam (use external email service instead)
ufw deny out 25/tcp
ufw --force enable

echo -e "${GREEN}Firewall configured. Outgoing SMTP (port 25) is BLOCKED.${NC}"

#-------------------------------------------------------------------------------
# STEP 5: Install Fail2Ban (Brute Force Protection)
#-------------------------------------------------------------------------------
echo -e "\n${GREEN}[5/12] Installing Fail2Ban...${NC}"
apt install -y fail2ban

cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3
ignoreip = 127.0.0.1/8

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 86400

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 3

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 5
EOF

systemctl enable fail2ban
systemctl restart fail2ban

#-------------------------------------------------------------------------------
# STEP 6: Install Node.js 20
#-------------------------------------------------------------------------------
echo -e "\n${GREEN}[6/12] Installing Node.js ${NODE_VERSION}...${NC}"
curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
apt install -y nodejs
npm install -g pm2

#-------------------------------------------------------------------------------
# STEP 7: Install Nginx
#-------------------------------------------------------------------------------
echo -e "\n${GREEN}[7/12] Installing Nginx...${NC}"
apt install -y nginx

# Security headers for Nginx
cat > /etc/nginx/snippets/security-headers.conf << 'EOF'
# Security Headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
EOF

# Rate limiting configuration
cat > /etc/nginx/snippets/rate-limit.conf << 'EOF'
# Rate Limiting Zones (defined in nginx.conf http block)
# limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
# limit_req_zone $binary_remote_addr zone=api:10m rate=5r/s;
# limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;
EOF

# Add rate limit zones to nginx.conf
sed -i '/http {/a \    limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;\n    limit_req_zone $binary_remote_addr zone=api:10m rate=5r/s;\n    limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;' /etc/nginx/nginx.conf

systemctl enable nginx

#-------------------------------------------------------------------------------
# STEP 8: Install PostgreSQL (Optional - if using database)
#-------------------------------------------------------------------------------
echo -e "\n${GREEN}[8/12] Installing PostgreSQL...${NC}"
apt install -y postgresql postgresql-contrib

# Secure PostgreSQL
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'CHANGE_THIS_PASSWORD';"
echo -e "${YELLOW}Remember to change PostgreSQL password!${NC}"

#-------------------------------------------------------------------------------
# STEP 9: Install Certbot for SSL
#-------------------------------------------------------------------------------
echo -e "\n${GREEN}[9/12] Installing Certbot...${NC}"
apt install -y certbot python3-certbot-nginx

#-------------------------------------------------------------------------------
# STEP 10: Setup Application Directory
#-------------------------------------------------------------------------------
echo -e "\n${GREEN}[10/12] Setting up application directory...${NC}"
mkdir -p $APP_DIR
chown -R $DEPLOY_USER:$DEPLOY_USER /var/www/html

#-------------------------------------------------------------------------------
# STEP 11: Configure Nginx for the Application
#-------------------------------------------------------------------------------
echo -e "\n${GREEN}[11/12] Configuring Nginx...${NC}"
cat > /etc/nginx/sites-available/$DOMAIN << EOF
# Rate limiting
limit_req_status 429;

server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    # Security headers
    include snippets/security-headers.conf;

    # Rate limiting for general requests
    limit_req zone=general burst=20 nodelay;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }

    # API rate limiting
    location /api/ {
        limit_req zone=api burst=10 nodelay;
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Strict rate limiting for auth endpoints
    location /api/auth/ {
        limit_req zone=login burst=3 nodelay;
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Block sensitive files
    location ~ /\. {
        deny all;
    }

    location ~ ^/(\.env|\.git|\.htaccess) {
        deny all;
    }
}
EOF

ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

#-------------------------------------------------------------------------------
# STEP 12: Additional Security Hardening
#-------------------------------------------------------------------------------
echo -e "\n${GREEN}[12/12] Additional security hardening...${NC}"

# Disable unnecessary services
systemctl disable --now cups-browsed 2>/dev/null || true
systemctl disable --now avahi-daemon 2>/dev/null || true

# Secure shared memory
echo "tmpfs /run/shm tmpfs defaults,noexec,nosuid 0 0" >> /etc/fstab

# Set secure permissions
chmod 700 /root
chmod 700 /home/$DEPLOY_USER

# Install and configure automatic security updates
apt install -y unattended-upgrades
dpkg-reconfigure -plow unattended-upgrades

# Setup log rotation
cat > /etc/logrotate.d/pm2 << EOF
/home/$DEPLOY_USER/.pm2/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 0640 $DEPLOY_USER $DEPLOY_USER
}
EOF

# Kernel hardening
cat > /etc/sysctl.d/99-security.conf << 'EOF'
# IP Spoofing protection
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1

# Ignore ICMP broadcast requests
net.ipv4.icmp_echo_ignore_broadcasts = 1

# Disable source packet routing
net.ipv4.conf.all.accept_source_route = 0
net.ipv6.conf.all.accept_source_route = 0

# Ignore send redirects
net.ipv4.conf.all.send_redirects = 0
net.ipv4.conf.default.send_redirects = 0

# Block SYN attacks
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_max_syn_backlog = 2048
net.ipv4.tcp_synack_retries = 2
net.ipv4.tcp_syn_retries = 5

# Log Martians
net.ipv4.conf.all.log_martians = 1
net.ipv4.icmp_ignore_bogus_error_responses = 1

# Disable IPv6 if not needed
net.ipv6.conf.all.disable_ipv6 = 1
net.ipv6.conf.default.disable_ipv6 = 1
EOF
sysctl -p /etc/sysctl.d/99-security.conf

#===============================================================================
# SETUP COMPLETE - DISPLAY SUMMARY
#===============================================================================
echo -e "\n${GREEN}================================================${NC}"
echo -e "${GREEN}   SECURE VPS SETUP COMPLETE!${NC}"
echo -e "${GREEN}================================================${NC}"
echo -e ""
echo -e "${YELLOW}IMPORTANT NEXT STEPS:${NC}"
echo -e ""
echo -e "1. ${GREEN}Test SSH access with deploy user:${NC}"
echo -e "   ssh $DEPLOY_USER@$DOMAIN"
echo -e ""
echo -e "2. ${GREEN}Clone your repository:${NC}"
echo -e "   su - $DEPLOY_USER"
echo -e "   cd $APP_DIR"
echo -e "   git clone -b $GITHUB_BRANCH $GITHUB_REPO ."
echo -e ""
echo -e "3. ${GREEN}Create .env file:${NC}"
echo -e "   nano $APP_DIR/.env"
echo -e "   # Add all your environment variables"
echo -e ""
echo -e "4. ${GREEN}Install dependencies and build:${NC}"
echo -e "   npm install"
echo -e "   npm run build"
echo -e ""
echo -e "5. ${GREEN}Start with PM2:${NC}"
echo -e "   pm2 start npm --name philippines-ecommerce -- start"
echo -e "   pm2 save"
echo -e "   pm2 startup"
echo -e ""
echo -e "6. ${GREEN}Setup SSL certificate:${NC}"
echo -e "   sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo -e ""
echo -e "7. ${GREEN}Change PostgreSQL password:${NC}"
echo -e "   sudo -u postgres psql"
echo -e "   ALTER USER postgres PASSWORD 'your_secure_password';"
echo -e ""
echo -e "${RED}SECURITY REMINDERS:${NC}"
echo -e "- Change all passwords (DB, API keys, OAuth secrets)"
echo -e "- Never commit .env to Git"
echo -e "- Outgoing SMTP (port 25) is blocked - use external email service"
echo -e "- Monitor /var/log/auth.log for suspicious activity"
echo -e "- Run 'sudo fail2ban-client status sshd' to check banned IPs"
echo -e ""
echo -e "${GREEN}Server IP: $(curl -s ifconfig.me)${NC}"
echo -e "${GREEN}Domain: $DOMAIN${NC}"
echo -e ""

