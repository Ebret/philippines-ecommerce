# Quick Prisma DATABASE_URL Fix

**Date:** November 10, 2025  
**Status:** 🔧 QUICK FIX  
**Version:** 1.0

---

## ⚡ **ONE-COMMAND FIX**

Copy and paste this entire command:

```bash
cd /var/www/html/ecom/app && \
export DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce" && \
echo "DATABASE_URL=$DATABASE_URL" && \
npx prisma migrate deploy
```

**Time:** ~5-10 minutes

---

## 📋 **WHAT THIS DOES**

1. ✓ Navigates to app directory
2. ✓ Exports DATABASE_URL to shell environment
3. ✓ Verifies environment variable is set
4. ✓ Runs Prisma migrations

---

## 🚀 **STEP-BY-STEP**

### **Step 1: Navigate to App Directory**
```bash
cd /var/www/html/ecom/app
pwd
```

### **Step 2: Export DATABASE_URL**
```bash
export DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce"
echo "DATABASE_URL=$DATABASE_URL"
```

**Expected Output:**
```
DATABASE_URL=postgresql://user:password@localhost:5432/philippines_ecommerce
```

### **Step 3: Run Migrations**
```bash
npx prisma migrate deploy
```

**Expected Output:**
```
Prisma schema loaded from prisma/schema.prisma
All migrations have been applied successfully.
```

---

## 🎯 **IMMEDIATE ACTION**

### **Run This Now:**

```bash
cd /var/www/html/ecom/app && \
export DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce" && \
npx prisma migrate deploy
```

---

## 📞 **QUICK TROUBLESHOOTING**

### **Still can't find DATABASE_URL:**
```bash
cd /var/www/html/ecom/app
export DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce"
echo "DATABASE_URL=$DATABASE_URL"
```

### **Connection fails:**
```bash
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1"
```

### **Check Prisma schema:**
```bash
cat /var/www/html/ecom/app/prisma/schema.prisma | grep -A 5 "datasource db"
```

---

**For detailed guide:** See `PRISMA_DATABASE_URL_FIX.md`

**Last Updated:** November 10, 2025

