# Application Files Copy Guide

**Date:** November 4, 2025  
**Status:** 🔧 COPYING APPLICATION FILES  
**Version:** 1.0

---

## ⚠️ **ISSUE IDENTIFIED**

The `/var/www/html/ecom/app/` directory is empty. We need to copy the application files from the source directory.

**Error Encountered:**
```
npm ERR! path /var/www/html/ecom/app/package.json
npm ERR! enoent ENOENT: no such file or directory
```

**Root Cause:** Application files haven't been copied to production yet.

---

## 🚀 **SOLUTION: Copy Application Files**

### **Quick Command (Recommended)**

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

## 📋 **STEP-BY-STEP INSTRUCTIONS**

### **Step 1: Navigate to Source Directory**

```bash
cd /var/www/html/philippines-ecommerce
```

### **Step 2: Copy Application Files**

```bash
cp -r src prisma public /var/www/html/ecom/app/
cp package*.json tsconfig.json next.config.ts /var/www/html/ecom/app/
```

### **Step 3: Verify Files Were Copied**

```bash
ls -la /var/www/html/ecom/app/
```

**Expected Output:**
```
drwxr-xr-x  src
drwxr-xr-x  prisma
drwxr-xr-x  public
-rw-r--r--  package.json
-rw-r--r--  package-lock.json
-rw-r--r--  tsconfig.json
-rw-r--r--  next.config.ts
```

### **Step 4: Verify Prisma Schema**

```bash
ls -la /var/www/html/ecom/app/prisma/
```

**Expected Output:**
```
-rw-r--r--  schema.prisma
```

---

## 📊 **FILES TO COPY**

| File/Directory | Purpose | Size | Required |
|---|---|---|---|
| `src/` | Source code | ~50MB | ✓ YES |
| `prisma/` | Database schema | ~1MB | ✓ YES |
| `public/` | Static files | ~5MB | ✓ YES |
| `package.json` | Dependencies | ~5KB | ✓ YES |
| `package-lock.json` | Lock file | ~500KB | ✓ YES |
| `tsconfig.json` | TypeScript config | ~1KB | ✓ YES |
| `next.config.ts` | Next.js config | ~2KB | ✓ YES |

**Total Size:** ~60MB

---

## 🔧 **COMPLETE WORKFLOW**

```bash
# 1. Copy files
cd /var/www/html/philippines-ecommerce && \
cp -r src prisma public /var/www/html/ecom/app/ && \
cp package*.json tsconfig.json next.config.ts /var/www/html/ecom/app/

# 2. Verify
ls -la /var/www/html/ecom/app/

# 3. Create environment file
nano /var/www/html/ecom/app/.env.production

# 4. Install dependencies
cd /var/www/html/ecom/app && npm install

# 5. Run migrations
npx prisma migrate deploy

# 6. Deploy
/var/www/html/ecom/scripts/deploy.sh
```

---

## ✅ **VERIFICATION CHECKLIST**

After copying files:

- [ ] `src/` directory exists
- [ ] `prisma/` directory exists
- [ ] `prisma/schema.prisma` exists
- [ ] `public/` directory exists
- [ ] `package.json` exists
- [ ] `package-lock.json` exists
- [ ] `tsconfig.json` exists
- [ ] `next.config.ts` exists

**Verify with:**
```bash
ls -la /var/www/html/ecom/app/
cat /var/www/html/ecom/app/package.json | head -10
ls -la /var/www/html/ecom/app/prisma/
```

---

## 📍 **DIRECTORY STRUCTURE AFTER COPY**

```
/var/www/html/ecom/
├── app/
│   ├── src/                    # Source code
│   ├── prisma/                 # Database schema
│   │   └── schema.prisma      # Prisma schema
│   ├── public/                 # Static files
│   ├── package.json           # Dependencies
│   ├── package-lock.json      # Lock file
│   ├── tsconfig.json          # TypeScript config
│   ├── next.config.ts         # Next.js config
│   └── .env.production        # Environment (to be created)
├── scripts/                    # Deployment scripts
├── logs/                       # Application logs
├── uploads/                    # User uploads
└── backups/                    # Backups
```

---

## 🔐 **PERMISSIONS**

After copying, ensure proper permissions:

```bash
# Set directory permissions
chmod -R 755 /var/www/html/ecom/app/

# Set file permissions
chmod 644 /var/www/html/ecom/app/package.json
chmod 644 /var/www/html/ecom/app/tsconfig.json
chmod 644 /var/www/html/ecom/app/next.config.ts
```

---

## 📞 **TROUBLESHOOTING**

### **Issue: "No such file or directory"**

**Solution:** Verify source directory exists:
```bash
ls -la /var/www/html/philippines-ecommerce/
```

### **Issue: "Permission denied"**

**Solution:** Use sudo if needed:
```bash
sudo cp -r src prisma public /var/www/html/ecom/app/
```

### **Issue: "package.json not found"**

**Solution:** Verify file exists in source:
```bash
ls -la /var/www/html/philippines-ecommerce/package.json
```

### **Issue: "prisma/schema.prisma not found"**

**Solution:** Verify prisma directory exists:
```bash
ls -la /var/www/html/philippines-ecommerce/prisma/
```

---

## 🚀 **NEXT STEPS AFTER COPYING**

### **Step 1: Create Environment File**
```bash
nano /var/www/html/ecom/app/.env.production
```

**Add:**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://your-domain.com"
# ... other variables
```

### **Step 2: Install Dependencies**
```bash
cd /var/www/html/ecom/app && npm install
```

### **Step 3: Run Migrations**
```bash
npx prisma migrate deploy
```

### **Step 4: Deploy**
```bash
/var/www/html/ecom/scripts/deploy.sh
```

---

## 📊 **TIMELINE**

| Phase | Task | Duration | Status |
|-------|------|----------|--------|
| 1 | Setup | 30 min | ✅ COMPLETE |
| 2 | Dependencies | 10 min | ✅ COMPLETE |
| 3 | Copy Files | 1-2 min | ⏳ NEXT |
| 4 | Configuration | 5 min | ⏳ PENDING |
| 5 | npm Install | 5-10 min | ⏳ PENDING |
| 6 | Migrations | 2-5 min | ⏳ PENDING |
| 7 | Deployment | 5-10 min | ⏳ PENDING |

**Total Remaining:** ~25-35 minutes

---

## 🎯 **IMMEDIATE ACTION**

### **Copy Files Now:**

```bash
cd /var/www/html/philippines-ecommerce && \
cp -r src prisma public /var/www/html/ecom/app/ && \
cp package*.json tsconfig.json next.config.ts /var/www/html/ecom/app/ && \
echo "✓ Files copied!" && \
ls -la /var/www/html/ecom/app/
```

---

## ✨ **WHAT HAPPENS NEXT**

After copying files:

1. ✓ Files will be in `/var/www/html/ecom/app/`
2. ✓ npm install will work
3. ✓ Prisma migrations will work
4. ✓ Application will be ready to deploy

---

**Last Updated:** November 4, 2025  
**Version:** 1.0

---

**Next Step:** Copy the application files!

```bash
cd /var/www/html/philippines-ecommerce && \
cp -r src prisma public /var/www/html/ecom/app/ && \
cp package*.json tsconfig.json next.config.ts /var/www/html/ecom/app/
```

