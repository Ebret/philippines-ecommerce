# Quick Copy - Application Files

**Date:** November 4, 2025  
**Status:** 🔧 READY TO COPY  
**Version:** 1.0

---

## ⚡ **ONE-COMMAND COPY**

Copy and paste this entire command:

```bash
cd /var/www/html/philippines-ecommerce && \
cp -r src prisma public /var/www/html/ecom/app/ && \
cp package*.json tsconfig.json next.config.ts /var/www/html/ecom/app/ && \
echo "✓ Files copied successfully!" && \
ls -la /var/www/html/ecom/app/
```

**Time:** ~1-2 minutes

---

## ✅ **WHAT GETS COPIED**

- ✓ `src/` - Source code
- ✓ `prisma/` - Database schema
- ✓ `public/` - Static files
- ✓ `package.json` - Dependencies
- ✓ `package-lock.json` - Lock file
- ✓ `tsconfig.json` - TypeScript config
- ✓ `next.config.ts` - Next.js config

---

## 📝 **AFTER COPYING**

### **1. Create Environment File**
```bash
nano /var/www/html/ecom/app/.env.production
```

### **2. Install Dependencies**
```bash
cd /var/www/html/ecom/app && npm install
```

### **3. Run Migrations**
```bash
npx prisma migrate deploy
```

### **4. Deploy**
```bash
/var/www/html/ecom/scripts/deploy.sh
```

---

## 🎯 **COMPLETE WORKFLOW**

```bash
# Copy files
cd /var/www/html/philippines-ecommerce && \
cp -r src prisma public /var/www/html/ecom/app/ && \
cp package*.json tsconfig.json next.config.ts /var/www/html/ecom/app/

# Verify
ls -la /var/www/html/ecom/app/

# Configure
nano /var/www/html/ecom/app/.env.production

# Install & Deploy
cd /var/www/html/ecom/app && \
npm install && \
npx prisma migrate deploy && \
/var/www/html/ecom/scripts/deploy.sh
```

---

## 📊 **STATUS**

| Task | Status |
|------|--------|
| Copy Files | ⏳ NEXT |
| Configure Env | ⏳ PENDING |
| Install Deps | ⏳ PENDING |
| Run Migrations | ⏳ PENDING |
| Deploy | ⏳ PENDING |

---

## 🚀 **START NOW**

```bash
cd /var/www/html/philippines-ecommerce && \
cp -r src prisma public /var/www/html/ecom/app/ && \
cp package*.json tsconfig.json next.config.ts /var/www/html/ecom/app/
```

---

**For detailed guide:** See `COPY_APPLICATION_FILES.md`

**Last Updated:** November 4, 2025

