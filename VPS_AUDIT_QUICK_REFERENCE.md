# VPS Audit Quick Reference
## Philippines E-Commerce Platform - Command Cheat Sheet

**Date:** November 6, 2025  
**VPS IP:** 109.205.181.119

---

## 🚀 Quick Start

```bash
# SSH to VPS
ssh root@109.205.181.119

# Navigate to app
cd /var/www/html/ecom/app

# Run full audit
bash /var/www/html/ecom/scripts/comprehensive-audit.sh

# View report
cat /var/www/html/ecom/deployment-logs/audit-report-*.txt
```

---

## 📊 System Commands

```bash
# System info
uname -a
cat /etc/os-release
hostnamectl

# Disk space
df -h
du -sh /var/www/html/ecom/

# Memory
free -h
vmstat 1 5

# CPU
nproc
lscpu
top -bn1 | head -20

# Uptime
uptime
systemctl status
```

---

## 🔧 Node.js & npm

```bash
# Versions
node -v
npm -v
npx -v

# Package info
npm list --depth=0
npm outdated
npm audit
npm audit --fix

# Cache
npm cache verify
npm cache clean --force

# Install/Update
npm ci
npm install
npm update
```

---

## 🗄️ PostgreSQL

```bash
# Version & status
psql --version
systemctl status postgresql

# Connection test
psql $DATABASE_URL -c "SELECT 1;"

# Database info
psql $DATABASE_URL -c "\l"
psql $DATABASE_URL -c "\dt"
psql $DATABASE_URL -c "\di"

# Database size
psql $DATABASE_URL -c "SELECT pg_size_pretty(pg_database_size(current_database()));"

# Backup
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql

# Migrations
npx prisma migrate status
npx prisma migrate deploy
npx prisma db push
```

---

## 💾 Redis

```bash
# Version & status
redis-server --version
systemctl status redis-server

# Connection test
redis-cli ping

# Info
redis-cli INFO
redis-cli INFO memory
redis-cli INFO stats

# Keys
redis-cli DBSIZE
redis-cli KEYS "*"
redis-cli FLUSHDB

# Monitor
redis-cli MONITOR
redis-cli --stat
```

---

## 📹 FFmpeg

```bash
# Version
ffmpeg -version
ffprobe -version

# Test
ffmpeg -f lavfi -i testsrc=duration=1:size=320x240:rate=1 -f null -

# Paths
which ffmpeg
which ffprobe

# Install
sudo apt-get install -y ffmpeg
```

---

## 🔐 Environment & Security

```bash
# Environment
source /var/www/html/ecom/app/.env.production
env | grep DATABASE_URL

# File permissions
ls -la /var/www/html/ecom/app/.env.production
chmod 600 /var/www/html/ecom/app/.env.production

# SSL certificate
openssl s_client -connect domain:443
echo | openssl s_client -servername domain -connect domain:443 2>/dev/null | openssl x509 -noout -dates

# Firewall
sudo ufw status
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

---

## 🚀 Service Management

```bash
# Status
systemctl status postgresql
systemctl status redis-server
systemctl status philippines-ecommerce
systemctl status nginx

# Start/Stop/Restart
systemctl start postgresql
systemctl stop postgresql
systemctl restart postgresql

# Enable/Disable
systemctl enable postgresql
systemctl disable postgresql

# Logs
journalctl -u postgresql -n 50
journalctl -u philippines-ecommerce -f
tail -f /var/www/html/ecom/logs/application.log
```

---

## 🏥 Health Checks

```bash
# API health
curl http://localhost:3000/api/health

# Database health
curl http://localhost:3000/api/health/db

# Cache health
curl http://localhost:3000/api/health/cache

# Full response
curl -v http://localhost:3000/api/health

# Response time
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3000/
```

---

## 📦 Dependency Checks

```bash
# List packages
npm list
npm list --depth=0
npm list --global

# Check specific package
npm list react
npm view react versions

# Audit
npm audit
npm audit --audit-level=moderate
npm audit fix
npm audit fix --force

# Dedupe
npm dedupe
npm dedupe --dry-run
```

---

## 📈 Performance Monitoring

```bash
# Process info
ps aux | grep node
ps aux | grep postgres
ps aux | grep redis

# Memory usage
ps aux --sort=-%mem | head -10

# CPU usage
ps aux --sort=-%cpu | head -10

# Network connections
netstat -an | grep ESTABLISHED | wc -l
ss -s

# Disk I/O
iostat -x 1 5
iotop -b -n 1

# System load
cat /proc/loadavg
```

---

## 🔍 Troubleshooting

```bash
# Check logs
tail -f /var/www/html/ecom/logs/application.log
tail -f /var/www/html/ecom/deployment-logs/*.log

# Check processes
lsof -i :3000
lsof -i :5432
lsof -i :6379

# Check ports
netstat -tlnp | grep 3000
netstat -tlnp | grep 5432
netstat -tlnp | grep 6379

# DNS resolution
nslookup domain.com
dig domain.com

# Network connectivity
ping 8.8.8.8
curl -I https://domain.com
```

---

## 📋 Audit Workflow

```bash
# 1. Connect
ssh root@109.205.181.119

# 2. Run audit
bash /var/www/html/ecom/scripts/comprehensive-audit.sh

# 3. Check results
cat /var/www/html/ecom/deployment-logs/audit-report-*.txt

# 4. Review issues
grep -i "error\|warning\|failed" /var/www/html/ecom/deployment-logs/audit-report-*.txt

# 5. Generate report
cp /var/www/html/ecom/deployment-logs/audit-report-*.txt ~/audit-report.txt

# 6. Download report
scp root@109.205.181.119:~/audit-report.txt ./
```

---

## 🎯 Common Issues & Fixes

```bash
# Permission denied
sudo chmod -R 755 /var/www/html/ecom/
sudo chown -R $USER:$USER /var/www/html/ecom/

# Database connection failed
systemctl restart postgresql
psql $DATABASE_URL -c "SELECT 1;"

# Redis connection failed
systemctl restart redis-server
redis-cli ping

# FFmpeg not found
sudo apt-get install -y ffmpeg
which ffmpeg

# Disk space full
df -h
du -sh /var/www/html/ecom/*
find /var/www/html/ecom/logs -type f -mtime +30 -delete

# Memory issues
free -h
ps aux --sort=-%mem | head -10
```

---

**Last Updated:** November 6, 2025  
**Version:** 1.0

