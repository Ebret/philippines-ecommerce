# Production Dependencies Installation Guide

**Date:** November 4, 2025  
**Status:** 🔧 INSTALLING DEPENDENCIES  
**Version:** 1.0

---

## ⚠️ **HEALTH CHECK RESULTS**

Your health check shows these missing dependencies:

```
✗ Node.js not found
✗ PostgreSQL client not found
✗ .env.production missing
```

This guide will help you install them.

---

## 🚀 **QUICK INSTALL (All Dependencies)**

Run this command to install everything at once:

```bash
sudo apt update && \
sudo apt install -y nodejs npm postgresql-client && \
node --version && \
npm --version && \
psql --version
```

**Expected Output:**
```
v18.x.x or higher
9.x.x or higher
psql (PostgreSQL) 14.x or higher
```

---

## 📋 **Step-by-Step Installation**

### **Step 1: Update Package Manager**

```bash
sudo apt update
```

**Expected Output:**
```
Get:1 http://archive.ubuntu.com/ubuntu focal InRelease [265 kB]
...
Reading package lists... Done
```

✅ **Status:** COMPLETE

---

### **Step 2: Install Node.js and npm**

```bash
sudo apt install -y nodejs npm
```

**Expected Output:**
```
Reading package lists... Done
Building dependency tree
...
Setting up nodejs (18.x.x-1nodesource1~focal1) ...
Setting up npm (9.x.x-1nodesource1~focal1) ...
```

✅ **Status:** COMPLETE

---

### **Step 3: Install PostgreSQL Client**

```bash
sudo apt install -y postgresql-client
```

**Expected Output:**
```
Reading package lists... Done
Building dependency tree
...
Setting up postgresql-client (14.x) ...
```

✅ **Status:** COMPLETE

---

### **Step 4: Verify Installations**

Check Node.js:
```bash
node --version
```

**Expected Output:**
```
v18.x.x or higher
```

Check npm:
```bash
npm --version
```

**Expected Output:**
```
9.x.x or higher
```

Check PostgreSQL:
```bash
psql --version
```

**Expected Output:**
```
psql (PostgreSQL) 14.x or higher
```

✅ **Status:** COMPLETE

---

## 🔧 **Optional: Install Additional Tools**

### **Docker (Optional but Recommended)**

```bash
sudo apt install -y docker.io docker-compose
```

### **Git (Optional)**

```bash
sudo apt install -y git
```

### **Curl (Optional)**

```bash
sudo apt install -y curl
```

---

## 📝 **Configure Environment Variables**

Now create the `.env.production` file:

```bash
nano /var/www/html/ecom/app/.env.production
```

**Add these variables:**

```env
# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce"

# NextAuth Configuration
NEXTAUTH_SECRET="your-secret-key-here-min-32-chars"
NEXTAUTH_URL="https://your-domain.com"

# Payment Gateway
PAYMENT_GATEWAY_KEY="your-payment-key"
PAYMENT_GATEWAY_SECRET="your-payment-secret"

# Storage Configuration (Contabo Object Storage)
STORAGE_ENDPOINT="https://your-endpoint.contabo.com"
STORAGE_ACCESS_KEY="your-access-key"
STORAGE_SECRET_KEY="your-secret-key"
STORAGE_BUCKET="your-bucket-name"
STORAGE_REGION="us-east-1"

# Email Service
EMAIL_SERVICE="sendgrid"
EMAIL_FROM="noreply@your-domain.com"
EMAIL_API_KEY="your-email-api-key"

# SMS Service (Philippines)
SMS_SERVICE="your-sms-service"
SMS_API_KEY="your-sms-api-key"

# Application Configuration
NODE_ENV="production"
LOG_LEVEL="info"
MONITORING_ENABLED="true"

# Optional: Stripe Configuration
STRIPE_PUBLIC_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."

# Optional: AWS Configuration
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
```

**Save:** Press `Ctrl+X`, then `Y`, then `Enter`

✅ **Status:** COMPLETE

---

## ✅ **Run Health Check Again**

After installing dependencies:

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
   /dev/sda1  XXX GB  X.X GB  XXX GB  X% /

4. Node.js:
   ✓ Node.js installed (v18.x.x)

5. FFmpeg:
   ✓ FFmpeg installed

6. PostgreSQL:
   ✓ PostgreSQL client installed

7. Environment Configuration:
   ✓ .env.production exists

8. Deployment Scripts:
   ✓ deploy.sh exists
   ✓ deploy.sh is executable

=== Health Check Complete ===
```

✅ **Status:** ALL CHECKS PASSED

---

## 🚀 **Next Steps After Dependencies**

### **Step 1: Install npm Dependencies**

```bash
cd /var/www/html/ecom/app
npm install
```

**Expected Output:**
```
added XXX packages in X.XXs
```

### **Step 2: Run Database Migrations**

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

### **Step 3: Start Deployment**

```bash
/var/www/html/ecom/scripts/deploy.sh
```

---

## 📊 **Installation Checklist**

- [ ] Package manager updated
- [ ] Node.js installed
- [ ] npm installed
- [ ] PostgreSQL client installed
- [ ] Node.js version verified (v18+)
- [ ] npm version verified (v9+)
- [ ] PostgreSQL version verified
- [ ] .env.production created
- [ ] Environment variables configured
- [ ] Health check passes

---

## 🔧 **Troubleshooting**

### **Issue: "npm: command not found"**

**Solution:** Reinstall Node.js and npm:
```bash
sudo apt remove -y nodejs npm
sudo apt install -y nodejs npm
```

### **Issue: "psql: command not found"**

**Solution:** Install PostgreSQL client:
```bash
sudo apt install -y postgresql-client
```

### **Issue: "Permission denied" when running scripts**

**Solution:** Make scripts executable:
```bash
chmod +x /var/www/html/ecom/scripts/*.sh
```

### **Issue: "Database connection failed"**

**Solution:** Verify database credentials in `.env.production`:
```bash
psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1"
```

---

## 📋 **Complete Installation Sequence**

```bash
# 1. Update package manager
sudo apt update

# 2. Install all dependencies
sudo apt install -y nodejs npm postgresql-client

# 3. Verify installations
node --version
npm --version
psql --version

# 4. Configure environment
nano /var/www/html/ecom/app/.env.production

# 5. Run health check
/var/www/html/ecom/scripts/health-check.sh

# 6. Install npm dependencies
cd /var/www/html/ecom/app
npm install

# 7. Run migrations
npx prisma migrate deploy

# 8. Start deployment
/var/www/html/ecom/scripts/deploy.sh
```

---

## ✨ **What Gets Installed**

| Package | Purpose | Version |
|---------|---------|---------|
| Node.js | JavaScript runtime | v18+ |
| npm | Package manager | v9+ |
| PostgreSQL Client | Database client | 14+ |
| FFmpeg | Media processing | Already installed ✓ |

---

## 🎯 **Status**

| Task | Status |
|------|--------|
| Node.js | ⏳ INSTALL NOW |
| npm | ⏳ INSTALL NOW |
| PostgreSQL Client | ⏳ INSTALL NOW |
| Environment Config | ⏳ CONFIGURE |
| Health Check | ⏳ VERIFY |
| npm Dependencies | ⏳ PENDING |
| Migrations | ⏳ PENDING |
| Deployment | ⏳ PENDING |

---

## 🚀 **Ready to Install?**

Run this command now:

```bash
sudo apt update && \
sudo apt install -y nodejs npm postgresql-client && \
node --version && \
npm --version && \
psql --version
```

---

**Status:** 🔧 READY TO INSTALL DEPENDENCIES

**Last Updated:** November 4, 2025  
**Version:** 1.0

---

**Next Step:** Run the installation command above!

