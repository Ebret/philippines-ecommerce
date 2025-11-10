# Quick Fix Prisma Migration Error

**Date:** November 10, 2025  
**Status:** 🔧 QUICK FIX  
**Version:** 1.0

---

## ⚡ **ONE-COMMAND FIX**

Copy and paste this entire command:

```bash
cd /var/www/html/ecom/app && \
export DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce" && \
npx prisma migrate reset --force && \
npx prisma migrate status && \
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "\dt"
```

**Time:** ~5-10 minutes

---

## ⚠️ **WARNING**

This command will:
- ✓ Drop the entire database
- ✓ Recreate the database
- ✓ Reapply all migrations
- ✓ Delete all existing data

---

## 📋 **WHAT THIS DOES**

1. ✓ Navigates to app directory
2. ✓ Exports DATABASE_URL
3. ✓ Resets database and reapplies migrations
4. ✓ Verifies migration status
5. ✓ Lists all created tables

---

## 🚀 **STEP-BY-STEP**

### **Step 1: Navigate & Export**
```bash
cd /var/www/html/ecom/app && \
export DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce"
```

### **Step 2: Reset Database**
```bash
npx prisma migrate reset --force
```

**Expected Output:**
```
✔ Dropped the database
✔ Created the database
✔ Ran all pending migrations
```

### **Step 3: Verify Migrations**
```bash
npx prisma migrate status
```

**Expected Output:**
```
All migrations have been successfully applied.
```

### **Step 4: List Tables**
```bash
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "\dt"
```

**Expected Output:**
```
                 List of relations
 Schema |           Name            | Type  | Owner
--------+---------------------------+-------+-------
 public | Product                   | table | user
 public | Testimonial               | table | user
 ...
```

---

## 🎯 **IMMEDIATE ACTION**

### **Run This Now:**

```bash
cd /var/www/html/ecom/app && \
export DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce" && \
npx prisma migrate reset --force
```

---

## 📞 **QUICK TROUBLESHOOTING**

### **Reset fails:**
```bash
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1"
```

### **Migrations still fail:**
```bash
ls -la /var/www/html/ecom/app/prisma/migrations/
```

### **Tables not created:**
```bash
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "\dt"
```

---

**For detailed guide:** See `FIX_PRISMA_MIGRATION_ERROR.md`

**Last Updated:** November 10, 2025

