# Quick Fix Prisma Shadow Database Permission Error

**Date:** November 10, 2025  
**Status:** 🔧 QUICK FIX  
**Version:** 1.0

---

## ⚡ **ONE-COMMAND FIX**

Copy and paste this entire command:

```bash
cd /var/www/html/ecom/app && \
export DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce" && \
PGPASSWORD=password psql -h localhost -U postgres -c "ALTER USER \"user\" CREATEDB;" && \
rm -rf /var/www/html/ecom/app/prisma/migrations/* && \
PGPASSWORD=password psql -h localhost -U postgres -c "DROP DATABASE IF EXISTS philippines_ecommerce;" && \
sleep 1 && \
PGPASSWORD=password psql -h localhost -U postgres -c "CREATE DATABASE philippines_ecommerce OWNER \"user\";" && \
sleep 1 && \
npx prisma migrate dev --name init && \
npx prisma migrate status && \
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "\dt"
```

**Time:** ~10-15 minutes

---

## 🔑 **KEY FIX**

The issue is that Prisma Migrate needs to create a "shadow database" for development, but the `user` account doesn't have permission. Grant the `CREATEDB` privilege:

```bash
PGPASSWORD=password psql -h localhost -U postgres -c "ALTER USER \"user\" CREATEDB;"
```

---

## 📋 **WHAT THIS DOES**

1. ✓ Navigates to app directory
2. ✓ Exports DATABASE_URL
3. ✓ Grants CREATEDB privilege to user
4. ✓ Deletes failed migration
5. ✓ Drops database
6. ✓ Recreates database with quoted username
7. ✓ Generates migration from schema
8. ✓ Applies migration
9. ✓ Verifies migration status
10. ✓ Lists all created tables

---

## 🚀 **STEP-BY-STEP**

### **Step 1: Navigate & Export**
```bash
cd /var/www/html/ecom/app && \
export DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce"
```

### **Step 2: Grant CREATEDB Privilege**
```bash
PGPASSWORD=password psql -h localhost -U postgres -c "ALTER USER \"user\" CREATEDB;"
```

**Expected Output:**
```
ALTER ROLE
```

### **Step 3: Verify Privilege**
```bash
PGPASSWORD=password psql -h localhost -U postgres -c "SELECT usename, usecreatedb FROM pg_user WHERE usename = 'user';"
```

**Expected Output:**
```
 usename | usecreatedb
---------+-------------
 user    | t
(1 row)
```

### **Step 4: Delete Failed Migration**
```bash
rm -rf /var/www/html/ecom/app/prisma/migrations/*
```

### **Step 5: Drop Database**
```bash
PGPASSWORD=password psql -h localhost -U postgres -c "DROP DATABASE IF EXISTS philippines_ecommerce;"
sleep 1
```

### **Step 6: Create Database**
```bash
PGPASSWORD=password psql -h localhost -U postgres -c "CREATE DATABASE philippines_ecommerce OWNER \"user\";"
sleep 1
```

### **Step 7: Generate & Apply Migration**
```bash
npx prisma migrate dev --name init
```

**Expected Output:**
```
✔ Created migration folder for new migration
✔ Generated migration file
✔ Ran all pending migrations
✔ Generated Prisma Client
```

### **Step 8: Verify Migration Status**
```bash
npx prisma migrate status
```

**Expected Output:**
```
All migrations have been successfully applied.
```

### **Step 9: List Tables**
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
PGPASSWORD=password psql -h localhost -U postgres -c "ALTER USER \"user\" CREATEDB;" && \
rm -rf /var/www/html/ecom/app/prisma/migrations/* && \
PGPASSWORD=password psql -h localhost -U postgres -c "DROP DATABASE IF EXISTS philippines_ecommerce;" && \
sleep 1 && \
PGPASSWORD=password psql -h localhost -U postgres -c "CREATE DATABASE philippines_ecommerce OWNER \"user\";" && \
sleep 1 && \
npx prisma migrate dev --name init
```

---

## 📞 **QUICK TROUBLESHOOTING**

### **Still getting permission denied:**
```bash
# Verify privilege was granted
PGPASSWORD=password psql -h localhost -U postgres -c "SELECT usename, usecreatedb FROM pg_user WHERE usename = 'user';"
```

### **Migration still fails:**
```bash
# Check user privileges
PGPASSWORD=password psql -h localhost -U postgres -c "\du user"
```

### **Tables not created:**
```bash
npx prisma migrate status
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "\dt"
```

---

**For detailed guide:** See `FIX_PRISMA_SHADOW_DATABASE_PERMISSION.md`

**Last Updated:** November 10, 2025

