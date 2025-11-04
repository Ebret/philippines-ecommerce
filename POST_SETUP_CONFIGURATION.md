# Post-Setup Configuration Guide

**Date:** November 4, 2025  
**Status:** ✅ SETUP COMPLETE - CONFIGURATION IN PROGRESS  
**Version:** 1.0

---

## 🎉 Setup Completed Successfully!

The production setup script has completed. Now you need to configure the environment and start the deployment.

---

## 📋 Post-Setup Tasks (In Order)

### **Task 1: Run Health Check** ⭐ START HERE

Verify the setup was successful:

```bash
/var/www/html/ecom/scripts/health-check.sh
```

**Expected Output:**
```
=== Production Health Check ===
1. Directory Structure:
   ✓ App directory exists
   ✓ Logs directory exists
   ✓ Uploads directory exists
   ✓ Scripts directory exists
2. Permissions:
   App directory: 755
3. Disk Space:
   /dev/xxx  XXX GB  XXX GB  XXX GB  XX% /var/www/html/ecom
4. Deployment Scripts:
   ✓ deploy.sh exists
   ✓ deploy.sh is executable
=== Health Check Complete ===
```

✅ **If all checks pass, proceed to Task 2**

---

### **Task 2: Configure Environment Variables**

Copy the environment template:

```bash
cp /var/www/html/ecom/config/.env.production.template \
   /var/www/html/ecom/app/.env.production
```

Edit the environment file:

```bash
nano /var/www/html/ecom/app/.env.production
```

**Key Variables to Configure:**

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="https://your-domain.com"

# Payment Gateway
PAYMENT_GATEWAY_KEY="your-payment-key"
PAYMENT_GATEWAY_SECRET="your-payment-secret"

# Storage (Contabo Object Storage)
STORAGE_ENDPOINT="https://your-endpoint.contabo.com"
STORAGE_ACCESS_KEY="your-access-key"
STORAGE_SECRET_KEY="your-secret-key"
STORAGE_BUCKET="your-bucket-name"

# Email Service
EMAIL_SERVICE="your-email-service"
EMAIL_FROM="noreply@your-domain.com"
EMAIL_API_KEY="your-email-api-key"

# SMS Service (Philippines)
SMS_SERVICE="your-sms-service"
SMS_API_KEY="your-sms-api-key"

# Monitoring
MONITORING_ENABLED="true"
LOG_LEVEL="info"
```

**Save and Exit:** Press `Ctrl+X`, then `Y`, then `Enter`

✅ **Environment configured**

---

### **Task 3: Install Dependencies**

Navigate to the app directory:

```bash
cd /var/www/html/ecom/app
```

Install npm dependencies:

```bash
npm install
```

**Expected Output:**
```
added XXX packages in X.XXs
```

✅ **Dependencies installed**

---

### **Task 4: Run Database Migrations**

Apply database migrations:

```bash
npx prisma migrate deploy
```

**Expected Output:**
```
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database at "localhost:5432"

1 migration found in prisma/migrations

Applying migration `XXXXXXX_init`

The following migration(s) have been applied:

migrations/
  └─ XXXXXXX_init/
    └─ migration.sql

All migrations have been applied successfully.
```

✅ **Database migrations applied**

---

### **Task 5: Start Deployment**

Run the deployment script:

```bash
/var/www/html/ecom/scripts/deploy.sh
```

**Expected Output:**
```
╔════════════════════════════════════════════════════════════════╗
║  Philippines E-Commerce Platform - Deployment Script          ║
║  Version 1.0 | Date: November 4, 2025                        ║
╚════════════════════════════════════════════════════════════════╝

[2025-11-04 XX:XX:XX] Starting deployment...
✓ Pre-deployment checks passed
✓ Building Docker image...
✓ Starting Docker containers...
✓ Running database migrations...
✓ Starting application server...
✓ Deployment completed successfully!

Application is running at: https://your-domain.com
```

✅ **Deployment started**

---

## 🔧 Complete Command Sequence

Run all tasks in order:

```bash
# Task 1: Health Check
/var/www/html/ecom/scripts/health-check.sh

# Task 2: Configure Environment
cp /var/www/html/ecom/config/.env.production.template \
   /var/www/html/ecom/app/.env.production
nano /var/www/html/ecom/app/.env.production

# Task 3: Install Dependencies
cd /var/www/html/ecom/app
npm install

# Task 4: Run Migrations
npx prisma migrate deploy

# Task 5: Start Deployment
/var/www/html/ecom/scripts/deploy.sh
```

---

## 📊 Configuration Checklist

- [ ] Health check passed
- [ ] Environment variables configured
- [ ] Database URL set correctly
- [ ] Payment gateway credentials added
- [ ] Storage credentials configured
- [ ] Email service configured
- [ ] SMS service configured
- [ ] Dependencies installed
- [ ] Database migrations applied
- [ ] Deployment script executed

---

## 📍 Important Directories

```
/var/www/html/ecom/
├── app/                          # Application files
│   ├── .env.production          # Environment variables (CONFIGURE THIS)
│   ├── src/                     # Source code
│   ├── public/                  # Static files
│   └── node_modules/            # Dependencies
├── scripts/                     # Deployment scripts
│   ├── deploy.sh               # Main deployment script
│   ├── health-check.sh         # Health check script
│   └── docker-compose.production.yml
├── logs/                        # Application logs
├── uploads/                     # User uploads
├── backups/                     # Backup files
└── config/                      # Configuration templates
```

---

## 🔐 Security Notes

⚠️ **Important Security Considerations:**

1. **Environment Variables**
   - Never commit `.env.production` to version control
   - Keep secrets secure
   - Use strong passwords
   - Rotate keys regularly

2. **File Permissions**
   - `.env.production` should have 600 permissions
   - Scripts should have 755 permissions
   - Logs should have 644 permissions

3. **Database**
   - Use strong database password
   - Enable SSL for database connections
   - Regular backups
   - Monitor database performance

4. **SSL/TLS**
   - Install SSL certificate
   - Enable HTTPS
   - Redirect HTTP to HTTPS
   - Keep certificates updated

---

## 📞 Troubleshooting

### Issue: "npm install fails"
**Solution:** Check Node.js version:
```bash
node --version  # Should be v18+
npm --version   # Should be v9+
```

### Issue: "Database connection fails"
**Solution:** Verify database credentials:
```bash
psql -h localhost -U user -d philippines_ecommerce
```

### Issue: "Deployment script fails"
**Solution:** Check logs:
```bash
cat /var/www/html/ecom/logs/deployment.log
```

### Issue: "Health check fails"
**Solution:** Check directory permissions:
```bash
ls -la /var/www/html/ecom/
```

---

## ✅ Verification Steps

After completing all tasks:

1. **Check Application is Running**
   ```bash
   curl https://your-domain.com
   ```

2. **Check Logs**
   ```bash
   tail -f /var/www/html/ecom/logs/app.log
   ```

3. **Check Docker Containers**
   ```bash
   docker ps
   ```

4. **Check Database Connection**
   ```bash
   psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1"
   ```

---

## 📚 Related Documentation

- **PRODUCTION_DEPLOYMENT_COMPLETE_GUIDE.md** - Deployment guide
- **DEPLOYMENT_GUIDE.md** - Detailed deployment procedures
- **TROUBLESHOOTING_COMMANDS.md** - Troubleshooting reference
- **MONITORING_GUIDE.md** - Production monitoring

---

## 🎯 Next Steps After Configuration

1. **Monitor Application**
   - Check logs regularly
   - Monitor performance
   - Set up alerts

2. **Configure Backups**
   - Database backups
   - File backups
   - Backup schedule

3. **Setup Monitoring**
   - Application monitoring
   - Server monitoring
   - Error tracking

4. **Configure CDN**
   - Static file delivery
   - Image optimization
   - Cache configuration

---

## 📊 Status Summary

| Task | Status |
|------|--------|
| Setup Script | ✅ COMPLETE |
| Health Check | ⏳ NEXT |
| Environment Config | ⏳ PENDING |
| Dependencies | ⏳ PENDING |
| Database Migrations | ⏳ PENDING |
| Deployment | ⏳ PENDING |

---

## 🚀 Quick Start Commands

```bash
# All tasks in one go (with manual env config)
/var/www/html/ecom/scripts/health-check.sh && \
cp /var/www/html/ecom/config/.env.production.template \
   /var/www/html/ecom/app/.env.production && \
echo "Edit .env.production with: nano /var/www/html/ecom/app/.env.production" && \
cd /var/www/html/ecom/app && \
npm install && \
npx prisma migrate deploy && \
/var/www/html/ecom/scripts/deploy.sh
```

---

**Status:** ✅ SETUP COMPLETE - READY FOR CONFIGURATION

**Last Updated:** November 4, 2025  
**Version:** 1.0

---

**Next Step:** Run the health check!
```bash
/var/www/html/ecom/scripts/health-check.sh
```

