# Quick Deploy Commands - Extreme Life Standalone

## 🚀 **One-Command Deployment**

### **From Your Local Machine:**

```bash
# 1. Upload scripts to VPS
scp DEPLOY_EXTREME_LIFE_STANDALONE.sh SETUP_SSL_EXTREME_LIFE.sh root@109.205.181.119:/root/

# 2. Connect and deploy
ssh root@109.205.181.119 "cd /root && chmod +x DEPLOY_EXTREME_LIFE_STANDALONE.sh && bash DEPLOY_EXTREME_LIFE_STANDALONE.sh"
```

### **Configure DNS First (Important!):**
- Create A record: `original.extremelifeherbal.com` → `109.205.181.119`
- Wait 5-10 minutes for DNS propagation

### **Then Setup SSL:**
```bash
ssh root@109.205.181.119 "cd /root && chmod +x SETUP_SSL_EXTREME_LIFE.sh && bash SETUP_SSL_EXTREME_LIFE.sh original.extremelifeherbal.com"
```

---

## 📋 **Manual Commands (If Automated Fails)**

```bash
# Connect to VPS
ssh root@109.205.181.119

# Update system
apt update && apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs npm
npm install -g pm2

# Clone and setup
cd /opt
git clone https://github.com/aurexgold/extremelife.git
cd extremelife
npm install
npm run build:client

# Start with PM2
pm2 start npm --name "extreme-life" -- run dev:client
pm2 startup
pm2 save

# Install Nginx
apt install nginx -y

# Create Nginx config
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
    }
}
EOF

# Enable and restart
ln -s /etc/nginx/sites-available/extremelife /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# Setup SSL (after DNS is configured)
apt install certbot python3-certbot-nginx -y
certbot --nginx -d original.extremelifeherbal.com
```

---

## ✅ **Verification Commands**

```bash
# Check PM2
pm2 status

# Check Nginx
systemctl status nginx

# Test local
curl http://localhost:5000

# Test domain
curl http://original.extremelifeherbal.com

# Test HTTPS
curl https://original.extremelifeherbal.com
```

---

## 🔧 **Useful Commands**

```bash
# View logs
pm2 logs extreme-life

# Restart app
pm2 restart extreme-life

# Update app
cd /opt/extremelife && git pull && npm install && npm run build:client && pm2 restart extreme-life

# Check ports
netstat -tulpn | grep :5000

# Nginx reload
systemctl reload nginx
```

---

## 🌐 **Access URLs**

- **HTTP:** http://original.extremelifeherbal.com
- **HTTPS:** https://original.extremelifeherbal.com (after SSL setup)
- **Direct IP:** http://109.205.181.119:5000 (if Nginx not configured)

---

## 📊 **Both Sites Running**

| Site | Domain | Port | Location | PM2 Name |
|------|--------|------|----------|----------|
| E-Commerce Platform | extremelifeherbal.com | 3000 | /var/www/html/ecom/app | (check pm2 status) |
| Standalone Extreme Life | original.extremelifeherbal.com | 5000 | /opt/extremelife | extreme-life |

