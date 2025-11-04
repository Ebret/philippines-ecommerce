# Copy Application Files to Production

**Date:** November 4, 2025  
**Status:** 🔧 COPYING APPLICATION FILES  
**Version:** 1.0

---

## ⚠️ **ISSUE IDENTIFIED**

The `/var/www/html/ecom/app/` directory is empty. We need to copy the application files from the source directory.

**Error:**
```
npm ERR! path /var/www/html/ecom/app/package.json
npm ERR! enoent ENOENT: no such file or directory
```

**Reason:** Application files haven't been copied to production yet.

---

## 🚀 **SOLUTION: Copy Application Files**

### **Option 1: Copy from Local Source (Recommended)**

If you have the source files locally:

```bash
# Navigate to source directory
cd /var/www/html/philippines-ecommerce

# Copy all application files to production
cp -r src/ /var/www/html/ecom/app/
cp -r prisma/ /var/www/html/ecom/app/
cp -r public/ /var/www/html/ecom/app/
cp package.json /var/www/html/ecom/app/
cp package-lock.json /var/www/html/ecom/app/
cp tsconfig.json /var/www/html/ecom/app/
cp next.config.ts /var/www/html/ecom/app/
cp .env.example /var/www/html/ecom/app/ 2>/dev/null || true
```

---

### **Option 2: Copy Everything at Once**

```bash
# Navigate to source directory
cd /var/www/html/philippines-ecommerce

# Copy all necessary files
cp -r src prisma public /var/www/html/ecom/app/
cp package*.json tsconfig.json next.config.ts /var/www/html/ecom/app/
```

---

### **Option 3: Use the Provided Script**

If you have `copy-files-to-production.sh`:

```bash
cd /var/www/html/philippines-ecommerce
chmod +x copy-files-to-production.sh
./copy-files-to-production.sh /var/www/html/ecom/app
```

---

## 📋 **COMPLETE WORKFLOW**

```bash
# 1. Navigate to source directory
cd /var/www/html/philippines-ecommerce

# 2. Copy application files
cp -r src prisma public /var/www/html/ecom/app/
cp package*.json tsconfig.json next.config.ts /var/www/html/ecom/app/

# 3. Verify files were copied
ls -la /var/www/html/ecom/app/

# 4. Create environment file
nano /var/www/html/ecom/app/.env.production

# 5. Install dependencies
cd /var/www/html/ecom/app && npm install

# 6. Run migrations
npx prisma migrate deploy

# 7. Deploy
/var/www/html/ecom/scripts/deploy.sh
```

---

## ✅ **VERIFICATION**

After copying files, verify they exist:

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

---

## 🔧 **STEP-BY-STEP INSTRUCTIONS**

### **Step 1: Navigate to Source Directory**

```bash
cd /var/www/html/philippines-ecommerce
```

### **Step 2: Copy Application Files**

```bash
cp -r src prisma public /var/www/html/ecom/app/
cp package*.json tsconfig.json next.config.ts /var/www/html/ecom/app/
```

### **Step 3: Verify Files**

```bash
ls -la /var/www/html/ecom/app/
```

### **Step 4: Check package.json**

```bash
cat /var/www/html/ecom/app/package.json | head -20
```

### **Step 5: Check prisma schema**

```bash
ls -la /var/www/html/ecom/app/prisma/
```

---

## 📊 **FILES TO COPY**

| File/Directory | Purpose | Required |
|---|---|---|
| `src/` | Source code | ✓ YES |
| `prisma/` | Database schema | ✓ YES |
| `public/` | Static files | ✓ YES |
| `package.json` | Dependencies | ✓ YES |
| `package-lock.json` | Lock file | ✓ YES |
| `tsconfig.json` | TypeScript config | ✓ YES |
| `next.config.ts` | Next.js config | ✓ YES |
| `.env.example` | Env template | ✗ NO |

---

## 🚀 **QUICK COMMAND**

Copy and paste this entire command:

```bash
cd /var/www/html/philippines-ecommerce && \
cp -r src prisma public /var/www/html/ecom/app/ && \
cp package*.json tsconfig.json next.config.ts /var/www/html/ecom/app/ && \
echo "✓ Files copied successfully!" && \
ls -la /var/www/html/ecom/app/
```

---

## ✨ **AFTER COPYING FILES**

Once files are copied, proceed with:

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

## 📍 **DIRECTORY STRUCTURE AFTER COPY**

```
/var/www/html/ecom/app/
├── src/                    # Source code
├── prisma/                 # Database schema
│   └── schema.prisma      # Prisma schema
├── public/                 # Static files
├── package.json           # Dependencies
├── package-lock.json      # Lock file
├── tsconfig.json          # TypeScript config
├── next.config.ts         # Next.js config
└── .env.production        # Environment (to be created)
```

---

## 🔐 **PERMISSIONS**

After copying, ensure proper permissions:

```bash
chmod -R 755 /var/www/html/ecom/app/
chmod 600 /var/www/html/ecom/app/.env.production
```

---

## 📞 **TROUBLESHOOTING**

### **Issue: "No such file or directory"**

**Solution:** Verify source directory exists:
```bash
ls -la /var/www/html/philippines-ecommerce/
```

### **Issue: "Permission denied"**

**Solution:** Use sudo:
```bash
sudo cp -r src prisma public /var/www/html/ecom/app/
```

### **Issue: "package.json not found"**

**Solution:** Verify file exists in source:
```bash
ls -la /var/www/html/philippines-ecommerce/package.json
```

---

## ✅ **CHECKLIST**

- [ ] Source directory verified
- [ ] Files copied to `/var/www/html/ecom/app/`
- [ ] `src/` directory exists
- [ ] `prisma/` directory exists
- [ ] `package.json` exists
- [ ] `package-lock.json` exists
- [ ] `tsconfig.json` exists
- [ ] `next.config.ts` exists
- [ ] Permissions set correctly
- [ ] Ready for npm install

---

## 🎯 **NEXT STEPS**

After copying files:

1. **Create environment file:**
   ```bash
   nano /var/www/html/ecom/app/.env.production
   ```

2. **Install dependencies:**
   ```bash
   cd /var/www/html/ecom/app && npm install
   ```

3. **Run migrations:**
   ```bash
   npx prisma migrate deploy
   ```

4. **Deploy:**
   ```bash
   /var/www/html/ecom/scripts/deploy.sh
   ```

---

## 🚀 **START NOW**

Copy files with this command:

```bash
cd /var/www/html/philippines-ecommerce && \
cp -r src prisma public /var/www/html/ecom/app/ && \
cp package*.json tsconfig.json next.config.ts /var/www/html/ecom/app/ && \
echo "✓ Files copied!" && \
ls -la /var/www/html/ecom/app/
```

---

**Last Updated:** November 4, 2025  
**Version:** 1.0

---

**Next Step:** Copy the application files!

