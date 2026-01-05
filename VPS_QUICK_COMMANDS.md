# VPS Quick Commands Reference

## After Fresh Ubuntu Install

### Option 1: Run Full Setup Script
```bash
# Download and run the setup script
wget https://raw.githubusercontent.com/Ebret/philippines-ecommerce/feature/relivator-ui-integration/SECURE_VPS_SETUP.sh
chmod +x SECURE_VPS_SETUP.sh
./SECURE_VPS_SETUP.sh
```

### Option 2: Manual Commands (Step by Step)

#### 1. Update System
```bash
apt update && apt upgrade -y
apt install -y curl wget git unzip ufw fail2ban
```

#### 2. Create Deploy User
```bash
useradd -m -s /bin/bash deploy
passwd deploy
usermod -aG sudo deploy
echo "deploy ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/deploy
```

#### 3. Configure Firewall
```bash
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow http
ufw allow https
ufw deny out 25/tcp  # Block SMTP to prevent spam
ufw enable
```

#### 4. Install Node.js 20
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
npm install -g pm2
```

#### 5. Install Nginx
```bash
apt install -y nginx
systemctl enable nginx
```

#### 6. Clone & Setup Application
```bash
su - deploy
mkdir -p /var/www/html/philippines-ecommerce
cd /var/www/html/philippines-ecommerce
git clone -b feature/relivator-ui-integration https://github.com/Ebret/philippines-ecommerce.git .
```

#### 7. Create .env File
```bash
nano .env
```

Add these variables (replace with YOUR values):
```env
# App
NODE_ENV=production
NEXTAUTH_URL=https://extremelifeherbal.com
NEXTAUTH_SECRET=generate_a_new_32_char_secret_here

# Database
DATABASE_URL=postgresql://postgres:YOUR_NEW_PASSWORD@localhost:5432/philippines_ecommerce

# Google OAuth (get from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

#### 8. Build & Start
```bash
npm install
npm run build
pm2 start npm --name philippines-ecommerce -- start
pm2 save
pm2 startup
```

#### 9. Setup SSL
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d extremelifeherbal.com -d www.extremelifeherbal.com
```

---

## Security Monitoring Commands

```bash
# Check banned IPs
sudo fail2ban-client status sshd

# Check auth logs for suspicious activity
sudo tail -50 /var/log/auth.log

# Check running processes
ps aux --sort=-%cpu | head -20

# Check cron jobs (should be clean)
crontab -l
ls -la /etc/cron.d/

# Check listening ports
ss -tulpn

# Check firewall status
sudo ufw status verbose

# Check nginx error log
sudo tail -50 /var/log/nginx/error.log

# Check PM2 status
pm2 status
pm2 logs philippines-ecommerce --lines 50
```

---

## Generate New Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate secure password
openssl rand -base64 24
```

---

## Emergency: If Compromised Again

```bash
# Immediately block all network except SSH
sudo ufw reset
sudo ufw default deny incoming
sudo ufw default deny outgoing
sudo ufw allow ssh
sudo ufw enable

# Kill suspicious processes
sudo pkill -9 -f "suspicious_process_name"

# Check and remove malicious cron
sudo crontab -r
sudo rm -rf /etc/cron.d/*

# Then reinstall from scratch via Contabo panel
```

