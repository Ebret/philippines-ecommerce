# Quick Fix PostgreSQL Reserved Keyword Error

**Date:** November 10, 2025  
**Status:** 🔧 QUICK FIX  
**Version:** 1.0

---

## ⚡ **ONE-COMMAND FIX**

Copy and paste this entire command:

```bash
cd /var/www/html/ecom/app && \
export DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce" && \
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

The issue is that `user` is a reserved keyword in PostgreSQL. Use double quotes:

```bash
# WRONG:
CREATE DATABASE philippines_ecommerce OWNER user;

# CORRECT:
CREATE DATABASE philippines_ecommerce OWNER "user";
```

---

## 📋 **WHAT THIS DOES**

1. ✓ Navigates to app directory
2. ✓ Exports DATABASE_URL
3. ✓ Deletes failed migration
4. ✓ Drops database
5. ✓ Recreates database with quoted username
6. ✓ Generates migration from schema
7. ✓ Applies migration
8. ✓ Verifies migration status
9. ✓ Lists all created tables

---

## 🚀 **STEP-BY-STEP**

### **Step 1: Navigate & Export**
```bash
cd /var/www/html/ecom/app && \
export DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce"
```

### **Step 2: Delete Failed Migration**
```bash
rm -rf /var/www/html/ecom/app/prisma/migrations/*
```

### **Step 3: Drop Database**
```bash
PGPASSWORD=password psql -h localhost -U postgres -c "DROP DATABASE IF EXISTS philippines_ecommerce;"
sleep 1
```

### **Step 4: Create Database (with quoted username)**
```bash
PGPASSWORD=password psql -h localhost -U postgres -c "CREATE DATABASE philippines_ecommerce OWNER \"user\";"
sleep 1
```

**Key:** Notice the double quotes around `user`: `OWNER \"user\"`

### **Step 5: Generate & Apply Migration**
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

### **Step 6: Verify Migration Status**
```bash
npx prisma migrate status
```

**Expected Output:**
```
All migrations have been successfully applied.
```

### **Step 7: List Tables**
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
rm -rf /var/www/html/ecom/app/prisma/migrations/* && \
PGPASSWORD=password psql -h localhost -U postgres -c "DROP DATABASE IF EXISTS philippines_ecommerce;" && \
sleep 1 && \
PGPASSWORD=password psql -h localhost -U postgres -c "CREATE DATABASE philippines_ecommerce OWNER \"user\";" && \
sleep 1 && \
npx prisma migrate dev --name init
```

---

## 📞 **QUICK TROUBLESHOOTING**

### **Still getting syntax error:**
```bash
# Make sure to use double quotes around "user"
PGPASSWORD=password psql -h localhost -U postgres -c "CREATE DATABASE philippines_ecommerce OWNER \"user\";"
```

### **Permission denied:**
```bash
# Drop database first
PGPASSWORD=password psql -h localhost -U postgres -c "DROP DATABASE IF EXISTS philippines_ecommerce;"
sleep 1
# Then create
PGPASSWORD=password psql -h localhost -U postgres -c "CREATE DATABASE philippines_ecommerce OWNER \"user\";"
```

### **Tables not created:**
```bash
npx prisma migrate status
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "\dt"
```

---

**For detailed guide:** See `FIX_POSTGRESQL_RESERVED_KEYWORD.md`

**Last Updated:** November 10, 2025

