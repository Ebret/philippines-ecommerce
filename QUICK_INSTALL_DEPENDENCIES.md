# Quick Install - Production Dependencies

**Date:** November 4, 2025  
**Status:** 🔧 READY TO INSTALL  
**Version:** 1.0

---

## ⚡ **ONE-COMMAND INSTALL**

Copy and paste this entire command:

```bash
sudo apt update && \
sudo apt install -y nodejs npm postgresql-client && \
echo "✓ Node.js: $(node --version)" && \
echo "✓ npm: $(npm --version)" && \
echo "✓ PostgreSQL: $(psql --version)"
```

**Time:** ~5-10 minutes

---

## ✅ **What Gets Installed**

- ✓ Node.js (v18+)
- ✓ npm (v9+)
- ✓ PostgreSQL Client (v14+)

---

## 📝 **After Installation**

### **1. Configure Environment**
```bash
nano /var/www/html/ecom/app/.env.production
```

### **2. Run Health Check**
```bash
/var/www/html/ecom/scripts/health-check.sh
```

### **3. Install npm Dependencies**
```bash
cd /var/www/html/ecom/app && npm install
```

### **4. Run Migrations**
```bash
npx prisma migrate deploy
```

### **5. Deploy**
```bash
/var/www/html/ecom/scripts/deploy.sh
```

---

## 🎯 **Complete Workflow**

```bash
# Install dependencies
sudo apt update && \
sudo apt install -y nodejs npm postgresql-client

# Verify
node --version && npm --version && psql --version

# Configure
nano /var/www/html/ecom/app/.env.production

# Health check
/var/www/html/ecom/scripts/health-check.sh

# Install npm packages
cd /var/www/html/ecom/app && npm install

# Migrations
npx prisma migrate deploy

# Deploy
/var/www/html/ecom/scripts/deploy.sh
```

---

## 📊 **Status**

| Component | Status |
|-----------|--------|
| Node.js | ⏳ INSTALL |
| npm | ⏳ INSTALL |
| PostgreSQL | ⏳ INSTALL |
| Environment | ⏳ CONFIGURE |
| Health Check | ⏳ VERIFY |
| Deployment | ⏳ PENDING |

---

## 🚀 **Start Now**

```bash
sudo apt update && \
sudo apt install -y nodejs npm postgresql-client
```

---

**For detailed guide:** See `PRODUCTION_DEPENDENCIES_INSTALL.md`

**Last Updated:** November 4, 2025

