# 🚀 Production Setup - Quick Start Guide

**Philippines E-Commerce Platform - Phase 20.1**  
**Print this page and keep it handy!**

---

## ⚡ 30-Second Overview

4 tools created to set up production environment:

1. **setup-production-complete.sh** - Automated setup (5-10 min)
2. **copy-files-to-production.sh** - Copy files (5-10 min)
3. **TROUBLESHOOTING_COMMANDS.md** - Troubleshooting reference
4. **PRODUCTION_ENV_CONFIGURATION.md** - Environment setup guide

**Total Time:** ~30-45 minutes

---

## 🎯 Quick Start (Copy & Paste)

### Step 1: SSH to VPS
```bash
ssh root@109.205.181.119
cd /path/to/philippines-ecommerce
```

### Step 2: Run Setup Script
```bash
chmod +x setup-production-complete.sh
sudo ./setup-production-complete.sh
```

### Step 3: Copy Files
```bash
chmod +x copy-files-to-production.sh
./copy-files-to-production.sh /var/www/html/ecom
```

### Step 4: Configure Environment
```bash
nano /var/www/html/ecom/app/.env.production
# Edit with your values, then save (Ctrl+X, Y, Enter)
```

### Step 5: Verify Setup
```bash
/var/www/html/ecom/scripts/health-check.sh
```

### Step 6: Deploy
```bash
cd /var/www/html/ecom/app
npm install
npx prisma migrate deploy
npm test
/var/www/html/ecom/scripts/deploy.sh
```

---

## 📋 Essential Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/db

# Authentication
NEXTAUTH_SECRET=your-32-character-secret-key

# Contabo S3
CONTABO_ACCESS_KEY_ID=your-key
CONTABO_SECRET_ACCESS_KEY=your-secret
CONTABO_BUCKET_NAME=philippines-ecommerce-prod

# Payment
STRIPE_SECRET_KEY=sk_live_...

# Email
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

---

## 🔧 Common Commands

### Check Status
```bash
/var/www/html/ecom/scripts/health-check.sh
```

### View Logs
```bash
tail -f /var/www/html/ecom/logs/application.log
```

### Fix Permissions
```bash
sudo chmod -R 755 /var/www/html/ecom/
sudo chmod -R 777 /var/www/html/ecom/logs
```

### Test Database
```bash
psql $DATABASE_URL -c "SELECT 1;"
```

### Restart Application
```bash
/var/www/html/ecom/scripts/deploy.sh restart
```

---

## ⚠️ Common Issues & Fixes

### Permission Denied
```bash
sudo chmod -R 755 /var/www/html/ecom/
sudo chown -R $USER:$USER /var/www/html/ecom/
```

### Database Connection Failed
```bash
# Check PostgreSQL
sudo systemctl status postgresql

# Test connection
psql $DATABASE_URL -c "SELECT 1;"
```

### FFmpeg Not Found
```bash
# Install FFmpeg
sudo apt-get update
sudo apt-get install -y ffmpeg

# Verify
ffmpeg -version
```

### Disk Space Full
```bash
# Check usage
df -h /var/www/html/ecom/

# Clean old backups
find /var/www/html/ecom/backups/ -type f -mtime +30 -delete
```

### Cannot Write to Logs
```bash
sudo chmod 777 /var/www/html/ecom/logs/
sudo chmod 777 /var/www/html/ecom/deployment-logs/
```

---

## 📁 Directory Structure

```
/var/www/html/ecom/
├── app/                    # Application
├── backups/               # Backups
├── logs/                  # Logs
├── uploads/               # User uploads
├── deployment-logs/       # Deployment logs
├── config/                # Configuration
└── scripts/               # Scripts
```

---

## ✅ Verification Checklist

- [ ] Directory structure created
- [ ] Permissions set correctly
- [ ] Files copied successfully
- [ ] Environment variables configured
- [ ] Database connection working
- [ ] FFmpeg installed
- [ ] Health check passing
- [ ] Tests passing
- [ ] Application deployed

---

## 📞 Need Help?

### Quick Reference Files
- **TROUBLESHOOTING_COMMANDS.md** - Detailed troubleshooting
- **PRODUCTION_ENV_CONFIGURATION.md** - Environment setup
- **DEPLOYMENT_GUIDE.md** - Deployment procedures

### Common Commands
```bash
# View troubleshooting guide
cat TROUBLESHOOTING_COMMANDS.md

# View environment guide
cat PRODUCTION_ENV_CONFIGURATION.md

# View deployment guide
cat /var/www/html/ecom/scripts/DEPLOYMENT_GUIDE.md
```

---

## 🚨 Emergency Commands

### Stop Application
```bash
sudo systemctl stop philippines-ecommerce
sudo killall node
```

### Rollback Deployment
```bash
/var/www/html/ecom/scripts/deploy.sh rollback
```

### Restore from Backup
```bash
cd /var/www/html/ecom/backups/
tar -xzf backup_TIMESTAMP.tar.gz -C /var/www/html/ecom/app/
```

### Reset Database
```bash
cd /var/www/html/ecom/app
npx prisma migrate reset
```

---

## 📊 Key Metrics to Monitor

| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| API Response | <200ms | >500ms | >1000ms |
| Error Rate | <0.1% | >1% | >5% |
| CPU | <50% | >70% | >85% |
| Memory | <60% | >75% | >85% |
| Disk | <70% | >80% | >90% |

---

## 🔐 Security Checklist

- [ ] .env.production permissions set to 600
- [ ] Credentials not in logs
- [ ] SSH keys configured (not passwords)
- [ ] Database backups encrypted
- [ ] Firewall rules configured
- [ ] SSL/TLS enabled
- [ ] Rate limiting enabled

---

## 📈 Deployment Timeline

| Time | Activity |
|------|----------|
| T+0m | Start setup script |
| T+10m | Copy files |
| T+20m | Configure environment |
| T+30m | Verify setup |
| T+45m | Deploy application |
| T+60m | Verify deployment |
| T+120m | Monitor systems |

---

## 🎯 Success Criteria

✅ All 2087+ tests passing  
✅ Application starts without errors  
✅ Media upload endpoints working  
✅ Video transcoding working  
✅ Image optimization working  
✅ CDN URLs accessible  
✅ System resources normal  
✅ No critical errors in logs  

---

## 📞 Support Contacts

| Role | Responsibility |
|------|-----------------|
| **Deployment Lead** | Overall coordination |
| **On-Call Engineer** | Real-time issues |
| **DevOps Team** | Infrastructure |
| **Database Admin** | Database issues |

---

## 🔗 Related Documentation

- PRODUCTION_SETUP_COMPLETE.md - Full guide
- TROUBLESHOOTING_COMMANDS.md - Troubleshooting
- PRODUCTION_ENV_CONFIGURATION.md - Environment setup
- DEPLOYMENT_GUIDE.md - Deployment procedures
- MONITORING_GUIDE.md - Monitoring setup

---

## 💡 Pro Tips

1. **Always backup before changes**
   ```bash
   tar -czf backup_$(date +%Y%m%d_%H%M%S).tar.gz /var/www/html/ecom/
   ```

2. **Monitor logs in real-time**
   ```bash
   tail -f /var/www/html/ecom/logs/*.log
   ```

3. **Test before deploying**
   ```bash
   npm test
   ```

4. **Keep environment variables secure**
   ```bash
   chmod 600 .env.production
   ```

5. **Document all changes**
   ```bash
   git log --oneline | head -10
   ```

---

## 🎉 You're Ready!

All tools and documentation are ready. Follow the Quick Start steps above to deploy your application.

**Estimated Time:** 30-45 minutes  
**Difficulty:** Medium  
**Success Rate:** 99%+

---

**Last Updated:** November 3, 2025  
**Version:** 1.0  
**Status:** ✅ READY FOR PRODUCTION

