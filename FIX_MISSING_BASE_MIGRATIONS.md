# Fix Missing Base Migrations

**Date:** November 10, 2025  
**Status:** 🔧 FIXING MISSING MIGRATIONS  
**Version:** 1.0

---

## 🔴 **ISSUE IDENTIFIED**

The migration `add_testimonials_feature` is the ONLY migration, but it depends on the `Product` table which should have been created by earlier migrations. The base migrations are missing!

```
Error: P3018
ERROR: relation "Product" does not exist
```

**Root Cause:** The migration files are incomplete or corrupted. Only `add_testimonials_feature` exists, but it depends on tables that should be created by earlier migrations.

---

## 🚀 **SOLUTION: Delete Failed Migration and Regenerate from Schema**

### **Complete Fix Workflow**

Copy and paste this entire command block:

```bash
# 1. Navigate to app directory
cd /var/www/html/ecom/app && \
echo "=== Current directory ===" && \
pwd && \
echo "" && \

# 2. Export DATABASE_URL
echo "=== Exporting DATABASE_URL ===" && \
export DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce" && \
echo "DATABASE_URL=$DATABASE_URL" && \
echo "" && \

# 3. Delete the failed migration directory
echo "=== Deleting failed migration ===" && \
rm -rf /var/www/html/ecom/app/prisma/migrations/*/add_testimonials_feature* 2>/dev/null || true && \
rm -rf /var/www/html/ecom/app/prisma/migrations/* && \
echo "Deleted all migrations" && \
echo "" && \

# 4. Drop and recreate database
echo "=== Dropping database ===" && \
PGPASSWORD=password psql -h localhost -U postgres -c "DROP DATABASE IF EXISTS philippines_ecommerce;" && \
sleep 1 && \
echo "=== Creating database ===" && \
PGPASSWORD=password psql -h localhost -U postgres -c "CREATE DATABASE philippines_ecommerce OWNER user;" && \
sleep 1 && \
echo "" && \

# 5. Generate migrations from schema
echo "=== Generating migrations from schema ===" && \
npx prisma migrate dev --name init && \
echo "" && \

# 6. Verify migrations
echo "=== Verifying migrations ===" && \
npx prisma migrate status && \
echo "" && \

# 7. Verify tables
echo "=== Verifying tables ===" && \
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "\dt"
```

**Time:** ~10-15 minutes

---

## 🔧 **DETAILED STEPS**

### **Step 1: Navigate to App Directory** (1-2 seconds)

```bash
cd /var/www/html/ecom/app
pwd
```

---

### **Step 2: Export DATABASE_URL** (1-2 seconds)

```bash
export DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce"
echo "DATABASE_URL=$DATABASE_URL"
```

---

### **Step 3: Delete Failed Migration** (1-2 seconds)

```bash
rm -rf /var/www/html/ecom/app/prisma/migrations/*
echo "Deleted all migrations"
```

---

### **Step 4: Drop and Recreate Database** (5-10 seconds)

```bash
PGPASSWORD=password psql -h localhost -U postgres -c "DROP DATABASE IF EXISTS philippines_ecommerce;"
sleep 1
PGPASSWORD=password psql -h localhost -U postgres -c "CREATE DATABASE philippines_ecommerce OWNER user;"
sleep 1
```

---

### **Step 5: Generate Migrations from Schema** (10-20 seconds)

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

---

### **Step 6: Verify Migration Status** (5-10 seconds)

```bash
npx prisma migrate status
```

**Expected Output:**
```
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "philippines_ecommerce", schema "public" at "localhost:5432"

Following migration have been applied:
  migrations/
    └─ 20250101000000_init/
       └─ migration.sql

All migrations have been successfully applied.
```

---

### **Step 7: Verify Tables Created** (1-2 seconds)

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
 public | _prisma_migrations        | table | user
 ...
```

---

## 📋 **WHY THIS WORKS**

### **The Problem**

- Only `add_testimonials_feature` migration exists
- It depends on `Product` table
- No base migrations to create `Product` table
- Migration fails because `Product` doesn't exist

### **The Solution**

1. Delete the broken migration
2. Drop and recreate the database
3. Generate a new migration from the current Prisma schema
4. This creates all tables at once

---

## 📞 **TROUBLESHOOTING**

### **Issue: Can't drop database**

**Solution:** Use postgres user:
```bash
PGPASSWORD=password psql -h localhost -U postgres -c "DROP DATABASE IF EXISTS philippines_ecommerce;"
```

---

### **Issue: Migration generation fails**

**Solution:** Check Prisma schema:
```bash
cat /var/www/html/ecom/app/prisma/schema.prisma | head -20
```

---

### **Issue: Tables still not created**

**Solution:** Verify migration was applied:
```bash
npx prisma migrate status
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "\dt"
```

---

## ✅ **VERIFICATION CHECKLIST**

- [ ] In correct directory (/var/www/html/ecom/app)
- [ ] DATABASE_URL exported to shell
- [ ] Failed migration deleted
- [ ] Database dropped and recreated
- [ ] New migration generated
- [ ] Migration applied successfully
- [ ] All tables created
- [ ] Migration status shows success

---

## 🎯 **IMMEDIATE ACTION**

### **Run This Command Now:**

```bash
cd /var/www/html/ecom/app && \
export DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce" && \
rm -rf /var/www/html/ecom/app/prisma/migrations/* && \
PGPASSWORD=password psql -h localhost -U postgres -c "DROP DATABASE IF EXISTS philippines_ecommerce;" && \
sleep 1 && \
PGPASSWORD=password psql -h localhost -U postgres -c "CREATE DATABASE philippines_ecommerce OWNER user;" && \
sleep 1 && \
npx prisma migrate dev --name init
```

---

## 📊 **MIGRATION PROCESS**

### **What Happens**

1. **Delete Failed Migration**
   - Removes corrupted migration files

2. **Drop Database**
   - Removes all tables and data

3. **Recreate Database**
   - Creates fresh empty database

4. **Generate Migration**
   - Reads Prisma schema
   - Creates migration SQL
   - Applies migration
   - Creates all tables

---

## 🚀 **NEXT STEPS**

After migrations are applied:

1. ✓ DATABASE_URL environment variable set
2. ✓ Database recreated
3. ✓ All migrations generated and applied
4. ✓ All tables created
5. ⏳ Deploy application

---

**Last Updated:** November 10, 2025  
**Version:** 1.0

---

**Next Command:**
```bash
cd /var/www/html/ecom/app && export DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce" && rm -rf /var/www/html/ecom/app/prisma/migrations/* && PGPASSWORD=password psql -h localhost -U postgres -c "DROP DATABASE IF EXISTS philippines_ecommerce;" && sleep 1 && PGPASSWORD=password psql -h localhost -U postgres -c "CREATE DATABASE philippines_ecommerce OWNER user;" && sleep 1 && npx prisma migrate dev --name init
```

