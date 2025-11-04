# Production Troubleshooting Commands Guide

**Philippines E-Commerce Platform - Phase 20.1**  
**Date:** November 3, 2025

---

## 🔍 Quick Diagnostics

### System Information
```bash
# Check OS and kernel
uname -a

# Check system resources
free -h                    # Memory
df -h                      # Disk space
top -b -n 1 | head -20    # CPU usage

# Check uptime
uptime
```

### User and Permissions
```bash
# Current user
whoami

# User groups
groups

# Check if sudo available
sudo -l
```

---

## 📁 Permission Issues & Fixes

### Problem: Permission Denied

**Diagnosis:**
```bash
# Check current permissions
ls -la /var/www/html/ecom/

# Check file ownership
stat /var/www/html/ecom/app/

# Check if user in correct group
id $USER
```

**Fix - Ownership Issues:**
```bash
# Fix ownership to current user
sudo chown -R $USER:$USER /var/www/html/ecom/

# Fix ownership to www-data (for web server)
sudo chown -R www-data:www-data /var/www/html/ecom/

# Fix ownership to specific user
sudo chown -R username:groupname /var/www/html/ecom/
```

**Fix - Permission Issues:**
```bash
# Fix base permissions (755 = rwxr-xr-x)
sudo chmod -R 755 /var/www/html/ecom/

# Fix writable directories (777 = rwxrwxrwx)
sudo chmod -R 777 /var/www/html/ecom/logs
sudo chmod -R 777 /var/www/html/ecom/uploads
sudo chmod -R 777 /var/www/html/ecom/deployment-logs

# Fix config permissions (700 = rwx------)
sudo chmod -R 700 /var/www/html/ecom/config

# Fix specific file permissions
sudo chmod 644 /var/www/html/ecom/app/.env.production
sudo chmod 755 /var/www/html/ecom/scripts/deploy.sh
```

**Fix - ACL (Advanced):**
```bash
# Set ACL for specific user
sudo setfacl -R -m u:$USER:rwx /var/www/html/ecom/

# Set default ACL for new files
sudo setfacl -R -d -m u:$USER:rwx /var/www/html/ecom/

# View ACL
getfacl /var/www/html/ecom/
```

### Problem: Cannot Write to Logs

**Diagnosis:**
```bash
# Check log directory
ls -la /var/www/html/ecom/logs/

# Try to write test file
touch /var/www/html/ecom/logs/test.txt 2>&1

# Check disk space
df -h /var/www/html/ecom/
```

**Fix:**
```bash
# Make logs writable
sudo chmod 777 /var/www/html/ecom/logs/
sudo chmod 777 /var/www/html/ecom/deployment-logs/

# Create log files with correct permissions
sudo touch /var/www/html/ecom/logs/application.log
sudo chmod 666 /var/www/html/ecom/logs/application.log

# Fix ownership
sudo chown -R $USER:$USER /var/www/html/ecom/logs/
```

### Problem: Cannot Execute Script

**Diagnosis:**
```bash
# Check script permissions
ls -la /var/www/html/ecom/scripts/deploy.sh

# Check if executable
file /var/www/html/ecom/scripts/deploy.sh
```

**Fix:**
```bash
# Make script executable
chmod +x /var/www/html/ecom/scripts/deploy.sh

# Make all scripts executable
chmod +x /var/www/html/ecom/scripts/*.sh

# Verify
ls -la /var/www/html/ecom/scripts/
```

---

## 💾 Disk Space Issues

### Check Disk Usage

```bash
# Overall disk usage
df -h

# Directory size
du -sh /var/www/html/ecom/
du -sh /var/www/html/ecom/*

# Find large files
find /var/www/html/ecom/ -type f -size +100M

# Find old files
find /var/www/html/ecom/ -type f -mtime +30
```

### Clean Up Space

```bash
# Remove old backups (older than 30 days)
find /var/www/html/ecom/backups/ -type f -mtime +30 -delete

# Remove old logs (older than 7 days)
find /var/www/html/ecom/logs/ -type f -mtime +7 -delete

# Clear node_modules cache
cd /var/www/html/ecom/app
npm cache clean --force

# Remove old deployment logs
find /var/www/html/ecom/deployment-logs/ -type f -mtime +14 -delete
```

---

## 🗄️ Database Issues

### Connection Problems

```bash
# Test database connection
psql $DATABASE_URL -c "SELECT 1;"

# Check PostgreSQL service
sudo systemctl status postgresql

# Start PostgreSQL if stopped
sudo systemctl start postgresql

# Check PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql.log
```

### Migration Issues

```bash
# Check migration status
cd /var/www/html/ecom/app
npx prisma migrate status

# Run pending migrations
npx prisma migrate deploy

# Resolve failed migration
npx prisma migrate resolve --rolled-back migration_name

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset
```

### Data Issues

```bash
# Check table exists
psql $DATABASE_URL -c "\dt"

# Check TestimonialMedia table
psql $DATABASE_URL -c "SELECT * FROM \"TestimonialMedia\" LIMIT 5;"

# Count records
psql $DATABASE_URL -c "SELECT COUNT(*) FROM \"TestimonialMedia\";"

# Backup database
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
```

---

## 🎬 Media Processing Issues

### FFmpeg Problems

```bash
# Check FFmpeg installation
ffmpeg -version
ffprobe -version

# Install FFmpeg (Ubuntu/Debian)
sudo apt-get update
sudo apt-get install -y ffmpeg

# Install FFmpeg (CentOS/RHEL)
sudo yum install -y ffmpeg

# Test FFmpeg
ffmpeg -i /path/to/video.mp4 -f null -
```

### Image Processing Issues

```bash
# Check Sharp installation
cd /var/www/html/ecom/app
npm list sharp

# Reinstall Sharp
npm uninstall sharp
npm install sharp

# Test image processing
node -e "const sharp = require('sharp'); console.log('Sharp OK');"
```

### Media Upload Issues

```bash
# Check upload directory permissions
ls -la /var/www/html/ecom/uploads/

# Check upload directory size
du -sh /var/www/html/ecom/uploads/

# Check media processing logs
tail -f /var/www/html/ecom/logs/media-processing.log
```

---

## 🌐 Network & Connectivity Issues

### Contabo S3 Connectivity

```bash
# Test endpoint connectivity
curl -I https://usc1.contabostorage.com

# Test with credentials
aws s3 ls s3://your-bucket-name --endpoint-url https://usc1.contabostorage.com

# Check environment variables
echo $CONTABO_ENDPOINT
echo $CONTABO_BUCKET_NAME
```

### DNS Issues

```bash
# Check DNS resolution
nslookup usc1.contabostorage.com
dig usc1.contabostorage.com

# Check network connectivity
ping -c 4 usc1.contabostorage.com

# Check firewall rules
sudo iptables -L -n
```

---

## 🚀 Application Issues

### Application Logs

```bash
# View application logs
tail -f /var/www/html/ecom/logs/application.log
tail -f /var/www/html/ecom/logs/error.log

# View last 100 lines
tail -100 /var/www/html/ecom/logs/application.log

# Search logs for errors
grep -i error /var/www/html/ecom/logs/application.log

# Real-time log monitoring
tail -f /var/www/html/ecom/logs/*.log
```

### Process Management

```bash
# Check if Node.js running
ps aux | grep node

# Check port usage
lsof -i :3000
netstat -tlnp | grep 3000

# Kill process on port
sudo kill -9 $(lsof -t -i:3000)

# Check service status
sudo systemctl status philippines-ecommerce
```

### Restart Application

```bash
# Restart via script
/var/www/html/ecom/scripts/deploy.sh restart

# Manual restart
cd /var/www/html/ecom/app
npm run build
npm start

# Restart with PM2
pm2 restart philippines-ecommerce
```

---

## 🧪 Testing & Verification

### Run Tests

```bash
# Run all tests
cd /var/www/html/ecom/app
npm test

# Run specific test file
npm test -- media-processor

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch
```

### API Testing

```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Test media upload endpoint
curl -X POST http://localhost:3000/api/testimonials/1/upload-media \
  -F "file=@test-video.mp4"

# Test with authentication
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/testimonials
```

### Performance Testing

```bash
# Check response time
time curl http://localhost:3000/api/health

# Load testing with Apache Bench
ab -n 1000 -c 10 http://localhost:3000/api/health

# Load testing with wrk
wrk -t4 -c100 -d30s http://localhost:3000/api/health
```

---

## 🔐 Security Issues

### Check File Permissions

```bash
# Find world-writable files
find /var/www/html/ecom/ -type f -perm -002

# Find world-readable sensitive files
find /var/www/html/ecom/config/ -type f -perm -004

# Fix sensitive file permissions
chmod 600 /var/www/html/ecom/app/.env.production
chmod 600 /var/www/html/ecom/config/.env.production.template
```

### Check Environment Variables

```bash
# Verify sensitive variables not in logs
grep -r "CONTABO_SECRET" /var/www/html/ecom/logs/

# Check for exposed credentials
grep -r "password\|secret\|key" /var/www/html/ecom/app/ --include="*.log"

# Verify .env file not in git
git check-ignore /var/www/html/ecom/app/.env.production
```

---

## 📊 Monitoring & Health Checks

### System Health

```bash
# Run health check script
/var/www/html/ecom/scripts/health-check.sh

# Check all services
sudo systemctl status postgresql
sudo systemctl status redis-server
sudo systemctl status nginx
```

### Resource Monitoring

```bash
# Real-time monitoring
top

# Memory usage
free -h

# Disk usage
df -h

# Network usage
nethogs

# Process monitoring
htop
```

---

## 🆘 Emergency Procedures

### Rollback Deployment

```bash
# Automatic rollback
/var/www/html/ecom/scripts/deploy.sh rollback

# Manual rollback from backup
cd /var/www/html/ecom/backups/
tar -xzf backup_TIMESTAMP.tar.gz -C /var/www/html/ecom/app/
```

### Emergency Stop

```bash
# Stop application
sudo systemctl stop philippines-ecommerce

# Kill Node.js process
sudo killall node

# Stop Docker containers
docker-compose -f /var/www/html/ecom/scripts/docker-compose.production.yml down
```

### Database Recovery

```bash
# Restore from backup
psql $DATABASE_URL < backup_TIMESTAMP.sql

# Check database integrity
psql $DATABASE_URL -c "REINDEX DATABASE philippines_ecommerce_prod;"
```

---

## 📞 Getting Help

### Collect Diagnostic Information

```bash
# Create diagnostic bundle
mkdir -p /tmp/diagnostics
cp /var/www/html/ecom/logs/* /tmp/diagnostics/
cp /var/www/html/ecom/SETUP_SUMMARY_*.txt /tmp/diagnostics/
tar -czf diagnostics_$(date +%Y%m%d_%H%M%S).tar.gz /tmp/diagnostics/
```

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| Permission denied | Wrong file permissions | `chmod` and `chown` |
| ENOENT: no such file | Missing file/directory | Check path, create directory |
| EADDRINUSE | Port already in use | Kill process on port |
| ENOMEM | Out of memory | Increase swap, reduce processes |
| ENOSPC | No space left | Clean up disk space |

---

**Last Updated:** November 3, 2025  
**Version:** 1.0

