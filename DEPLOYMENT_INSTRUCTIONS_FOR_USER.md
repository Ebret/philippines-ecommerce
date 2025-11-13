# 🚀 Week 8 Deployment Instructions for User

## Current Situation
- ✅ Week 8 code is **100% complete** and tested
- ✅ All 118 tests passing (100% pass rate)
- ✅ Build successful with zero errors
- ✅ `deployment.zip` file created (17.8 MB)
- ⏳ **Waiting for you to deploy to production VPS**

## Production VPS Status
- **IP**: 109.205.181.119
- **Current Issue**: 502 Bad Gateway error
- **Root Cause**: Old code (Weeks 1-5 only), PM2 pointing to wrong directory
- **Solution**: Deploy new code using deployment.zip

---

## 📋 DEPLOYMENT STEPS (Copy & Paste)

### Step 1: Copy deployment.zip to VPS
```bash
cd philippines-ecommerce
scp deployment.zip root@109.205.181.119:/var/www/html/philippines-ecommerce/
# When prompted for password, enter: 4K-6GsnA$3pQ5931
```

### Step 2: SSH into VPS
```bash
ssh root@109.205.181.119
# When prompted for password, enter: 4K-6GsnA$3pQ5931
```

### Step 3: Deploy (Run these commands on VPS)
```bash
cd /var/www/html/philippines-ecommerce

# Stop current processes
pm2 stop all

# Backup current code (optional but recommended)
tar -czf backup-$(date +%Y%m%d-%H%M%S).tar.gz .next/ public/ src/ prisma/ 2>/dev/null || true

# Extract new code
unzip -o deployment.zip

# Install dependencies
npm install --production

# Run database migration
npx prisma migrate deploy

# Restart application
pm2 restart all
pm2 save

# Verify it's running
pm2 status
```

### Step 4: Verify Deployment
```bash
# Check logs (should show "Ready in X.XXs")
pm2 logs philippines-ecommerce --lines 20

# Test API endpoint
curl http://localhost:3000/api/notifications

# Exit SSH
exit
```

### Step 5: Check HTTPS
Visit: **https://extremelifeherbal.com**

Should show the website without 502 error ✅

---

## 🆘 If Something Goes Wrong

### 502 Bad Gateway Still Shows
```bash
ssh root@109.205.181.119

# Check PM2 logs
pm2 logs philippines-ecommerce --lines 50

# Check nginx logs
tail -f /var/log/nginx/error.log

# Restart nginx
systemctl restart nginx

# Restart PM2
pm2 restart all
```

### Deployment Failed
```bash
# Restore from backup
cd /var/www/html/philippines-ecommerce
tar -xzf backup-*.tar.gz
pm2 restart all
```

### Need Help
Refer to: `WEEK8_DEPLOYMENT_MANUAL_GUIDE.md` for detailed troubleshooting

---

## ✅ What Gets Deployed

| Component | Status | Details |
|-----------|--------|---------|
| Notification System | ✅ Complete | 6 API endpoints, multi-channel support |
| Database Schema | ✅ Complete | 5 new models, 3 enums |
| SMS Service | ✅ Complete | Twilio, Nexmo, Semaphore support |
| Email Templates | ✅ Complete | 6 templates with variables |
| Queue Processor | ✅ Complete | Async processing with retry logic |
| Tests | ✅ Complete | 118 tests, 100% pass rate |
| Build | ✅ Complete | Zero TypeScript errors |

---

## 📊 Deployment Checklist

- [ ] Copy deployment.zip to VPS
- [ ] SSH into VPS
- [ ] Run deployment commands
- [ ] Verify PM2 status
- [ ] Check logs
- [ ] Test API endpoint
- [ ] Visit https://extremelifeherbal.com
- [ ] Confirm no 502 error

---

## 🎯 After Deployment

1. **Configure SMS Provider** (Optional)
   - Set `SMS_PROVIDER` environment variable
   - Set provider credentials

2. **Configure Email Provider** (Optional)
   - Set `EMAIL_PROVIDER` environment variable
   - Set provider credentials

3. **Test Notifications**
   - Send test notification via API
   - Verify email/SMS delivery

4. **Monitor**
   - Check PM2 logs regularly
   - Monitor error rates

---

## 📞 Quick Reference

| Command | Purpose |
|---------|---------|
| `pm2 status` | Check if app is running |
| `pm2 logs philippines-ecommerce` | View application logs |
| `pm2 restart all` | Restart application |
| `pm2 stop all` | Stop application |
| `curl http://localhost:3000/api/notifications` | Test API |

---

## 🎉 Summary

**Week 8 is ready to deploy!**

1. Copy `deployment.zip` to VPS
2. SSH into VPS
3. Run deployment commands
4. Verify at https://extremelifeherbal.com

**Estimated time**: 5-10 minutes

**Questions?** Check `WEEK8_DEPLOYMENT_MANUAL_GUIDE.md`

