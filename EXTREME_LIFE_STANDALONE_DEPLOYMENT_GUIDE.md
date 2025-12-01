# Extreme Life Standalone Deployment Guide

**VPS IP:** 109.205.181.119  
**Repository:** https://github.com/aurexgold/extremelife.git  
**Port:** 5000  
**Recommended Domain:** original.extremelifeherbal.com  
**Date:** December 1, 2025

---

## 📋 **Prerequisites**

- VPS with Ubuntu/Debian (109.205.181.119)
- Root access to the VPS
- Domain name configured (optional, can use IP initially)
- SSH access

---

## 🚀 **Quick Deployment (Automated)**

### **Step 1: Upload Deployment Script to VPS**

From your local machine:

```bash
# Upload the deployment script
scp DEPLOY_EXTREME_LIFE_STANDALONE.sh root@109.205.181.119:/root/

# Upload the SSL setup script
scp SETUP_SSL_EXTREME_LIFE.sh root@109.205.181.119:/root/
```

### **Step 2: Connect to VPS**

```bash
ssh root@109.205.181.119
```

### **Step 3: Run Deployment Script**

```bash
cd /root
chmod +x DEPLOY_EXTREME_LIFE_STANDALONE.sh
bash DEPLOY_EXTREME_LIFE_STANDALONE.sh
```

This will:
- ✅ Update system packages
- ✅ Install Node.js 20.x, npm, PM2
- ✅ Clone the Extreme Life repository
- ✅ Install dependencies
- ✅ Build the frontend
- ✅ Start with PM2
- ✅ Configure Nginx reverse proxy

### **Step 4: Configure DNS (Important!)**

Before setting up SSL, configure your DNS:

**Option A: Subdomain (Recommended)**
- Create an A record: `original.extremelifeherbal.com` → `109.205.181.119`

**Option B: Different Domain**
- Create an A record: `yourdomain.com` → `109.205.181.119`

**Option C: Use IP Only (Testing)**
- Skip DNS configuration, access via http://109.205.181.119:5000

### **Step 5: Setup SSL Certificate (After DNS is configured)**

```bash
cd /root
chmod +x SETUP_SSL_EXTREME_LIFE.sh

# For subdomain
bash SETUP_SSL_EXTREME_LIFE.sh original.extremelifeherbal.com

# Or for different domain
bash SETUP_SSL_EXTREME_LIFE.sh yourdomain.com
```

---

## 🔧 **Manual Deployment (Step-by-Step)**

If you prefer to run commands manually:

### **1. Update System**
```bash
apt update && apt upgrade -y
```

### **2. Install Node.js 20.x**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs npm
npm install -g pm2
```

### **3. Clone Repository**
```bash
cd /opt
git clone https://github.com/aurexgold/extremelife.git
cd extremelife
npm install
```

### **4. Build Frontend**
```bash
npm run build:client
```

### **5. Start with PM2**
```bash
pm2 start npm --name "extreme-life" -- run dev:client
pm2 startup
pm2 save
pm2 status
```

### **6. Install Nginx**
```bash
apt install nginx -y
```

### **7. Configure Nginx**
```bash
nano /etc/nginx/sites-available/extremelife
```

Paste this configuration:

```nginx
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
    }
}
```

Save and exit (Ctrl+X, Y, Enter)

### **8. Enable Site**
```bash
ln -s /etc/nginx/sites-available/extremelife /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### **9. Install SSL**
```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d original.extremelifeherbal.com
```

---

## ✅ **Verification**

### **Check PM2 Status**
```bash
pm2 status
# Should show "extreme-life" as "online"
```

### **Check Nginx Status**
```bash
systemctl status nginx
# Should show "active (running)"
```

### **Test Application**
```bash
# Test local port
curl http://localhost:5000

# Test via Nginx
curl http://original.extremelifeherbal.com

# Test HTTPS (after SSL setup)
curl https://original.extremelifeherbal.com
```

---

## 📊 **Post-Deployment**

### **View Logs**
```bash
# PM2 logs
pm2 logs extreme-life

# Nginx access logs
tail -f /var/log/nginx/access.log

# Nginx error logs
tail -f /var/log/nginx/error.log
```

### **Restart Application**
```bash
pm2 restart extreme-life
```

### **Stop Application**
```bash
pm2 stop extreme-life
```

### **Update Application**
```bash
cd /opt/extremelife
git pull origin main
npm install
npm run build:client
pm2 restart extreme-life
```

---

## 🔄 **Managing Both Sites**

You now have two sites running:

1. **Philippines E-Commerce Platform** (Port 3000)
   - Domain: https://extremelifeherbal.com
   - Location: /var/www/html/ecom/app
   - PM2 Process: Check with `pm2 status`

2. **Extreme Life Standalone** (Port 5000)
   - Domain: https://original.extremelifeherbal.com
   - Location: /opt/extremelife
   - PM2 Process: extreme-life

---

## 🆘 **Troubleshooting**

### **Port 5000 Already in Use**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### **PM2 Process Not Starting**
```bash
# Check logs
pm2 logs extreme-life --lines 100

# Delete and restart
pm2 delete extreme-life
pm2 start npm --name "extreme-life" -- run dev:client
```

### **Nginx Configuration Error**
```bash
# Test configuration
nginx -t

# Check syntax errors in config file
nano /etc/nginx/sites-available/extremelife
```

### **SSL Certificate Issues**
```bash
# Check certificate status
certbot certificates

# Renew certificate manually
certbot renew

# Test renewal
certbot renew --dry-run
```

---

## 📞 **Support**

If you encounter issues:
1. Check PM2 logs: `pm2 logs extreme-life`
2. Check Nginx logs: `tail -f /var/log/nginx/error.log`
3. Verify DNS configuration
4. Ensure port 5000 is not blocked by firewall

---

**Deployment scripts created:**
- `DEPLOY_EXTREME_LIFE_STANDALONE.sh` - Main deployment script
- `SETUP_SSL_EXTREME_LIFE.sh` - SSL certificate setup script

