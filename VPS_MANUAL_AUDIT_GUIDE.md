# VPS Manual Audit Guide
## Philippines E-Commerce Platform - Step-by-Step Review

**Date:** November 6, 2025  
**VPS IP:** 109.205.181.119  
**Estimated Time:** 2-3 hours

---

## 🔗 Step 1: Connect to VPS

```bash
# SSH to VPS
ssh root@109.205.181.119

# Navigate to app directory
cd /var/www/html/ecom/app

# Verify you're in the right location
pwd
ls -la
```

---

## 📊 Step 2: System Information Audit

```bash
# Check OS and kernel
cat /etc/os-release
uname -a

# Check uptime
uptime

# Check disk space
df -h /var/www/html/ecom/

# Check memory
free -h

# Check CPU
nproc
lscpu
```

---

## 🔧 Step 3: Node.js & npm Audit

```bash
# Check Node.js version (Expected: v18+)
node -v

# Check npm version (Expected: v9+)
npm -v

# Check npm cache
npm cache verify

# Check for security vulnerabilities
npm audit

# List all installed packages
npm list --depth=0

# Check for outdated packages
npm outdated
```

---

## 🗄️ Step 4: Database Audit

```bash
# Check PostgreSQL version
psql --version

# Check if PostgreSQL is running
systemctl status postgresql

# Test database connection
psql $DATABASE_URL -c "SELECT 1;"

# Check database size
psql $DATABASE_URL -c "SELECT pg_size_pretty(pg_database_size(current_database()));"

# List all tables
psql $DATABASE_URL -c "\dt"

# Check migrations status
npx prisma migrate status

# View migration history
ls -la prisma/migrations/
```

---

## 💾 Step 5: Redis Audit

```bash
# Check Redis version
redis-server --version

# Check if Redis is running
systemctl status redis-server

# Test Redis connection
redis-cli ping

# Check Redis memory usage
redis-cli INFO memory

# Check Redis keys
redis-cli DBSIZE

# Check Redis configuration
redis-cli CONFIG GET "*"
```

---

## 📹 Step 6: Media Processing Audit

```bash
# Check FFmpeg
ffmpeg -version

# Check FFprobe
ffprobe -version

# Check FFmpeg path
which ffmpeg
which ffprobe

# Test FFmpeg
ffmpeg -f lavfi -i testsrc=duration=1:size=320x240:rate=1 -f null -
```

---

## 🔐 Step 7: Environment Variables Audit

```bash
# Check .env.production exists
ls -la /var/www/html/ecom/app/.env.production

# Check permissions (should be 600)
stat /var/www/html/ecom/app/.env.production

# Source environment
source /var/www/html/ecom/app/.env.production

# Verify critical variables
echo "NODE_ENV: $NODE_ENV"
echo "DATABASE_URL: $DATABASE_URL"
echo "NEXTAUTH_SECRET: ${NEXTAUTH_SECRET:0:10}..."
echo "REDIS_URL: $REDIS_URL"
```

---

## 🚀 Step 8: Service Status Audit

```bash
# Check application service
systemctl status philippines-ecommerce

# Check PostgreSQL
systemctl status postgresql

# Check Redis
systemctl status redis-server

# Check Nginx (if used)
systemctl status nginx

# View application logs
tail -f /var/www/html/ecom/logs/application.log

# View deployment logs
tail -f /var/www/html/ecom/deployment-logs/*.log
```

---

## 🏥 Step 9: Health Checks

```bash
# API health endpoint
curl http://localhost:3000/api/health

# Database health
curl http://localhost:3000/api/health/db

# Cache health
curl http://localhost:3000/api/health/cache

# Check application is responding
curl -I http://localhost:3000/
```

---

## 📦 Step 10: Dependency Verification

```bash
# Check package.json
cat package.json | grep -A 50 '"dependencies"'

# Check package-lock.json integrity
npm ci --dry-run

# Verify all packages installed
npm list

# Check for missing packages
npm ls --depth=0

# Audit for vulnerabilities
npm audit --audit-level=moderate
```

---

## 🔒 Step 11: Security Audit

```bash
# Check SSL certificate
openssl s_client -connect your-domain.com:443

# Check certificate expiry
echo | openssl s_client -servername your-domain.com -connect your-domain.com:443 2>/dev/null | openssl x509 -noout -dates

# Check firewall
sudo ufw status

# Check SSH configuration
sudo sshd -T

# Check file permissions
ls -la /var/www/html/ecom/app/.env.production
```

---

## 📈 Step 12: Performance Metrics

```bash
# CPU usage
top -bn1 | head -20

# Memory usage
free -h

# Disk I/O
iostat -x 1 5

# Network connections
netstat -an | grep ESTABLISHED | wc -l

# Process count
ps aux | wc -l

# Application memory usage
ps aux | grep node
```

---

## 📋 Step 13: Generate Audit Report

```bash
# Create comprehensive report
bash /var/www/html/ecom/scripts/comprehensive-audit.sh

# View report
cat /var/www/html/ecom/deployment-logs/audit-report-*.txt

# Export report
cp /var/www/html/ecom/deployment-logs/audit-report-*.txt ~/audit-report.txt
```

---

## ✅ Completion Checklist

- [ ] System information verified
- [ ] Node.js & npm versions correct
- [ ] Database connectivity confirmed
- [ ] Redis running and accessible
- [ ] FFmpeg installed and working
- [ ] Environment variables complete
- [ ] All services running
- [ ] Health checks passing
- [ ] Security checks passed
- [ ] Performance metrics acceptable
- [ ] Audit report generated

**Status:** ☐ COMPLETE ☐ ISSUES FOUND

