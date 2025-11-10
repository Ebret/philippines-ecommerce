# Fix Prisma Migration Error - Product Table Missing

**Date:** November 10, 2025  
**Status:** 🔧 FIXING MIGRATION ERROR  
**Version:** 1.0

---

## 🔴 **ISSUE IDENTIFIED**

Migration failed because the `Product` table doesn't exist:

```
Error: P3018
A migration failed to apply. New migrations cannot be applied before the error is recovered from.

Migration name: add_testimonials_feature
Database error code: 42P01
Database error: ERROR: relation "Product" does not exist
```

**Root Cause:** The `add_testimonials_feature` migration depends on the `Product` table, but the base migrations that create it haven't been applied yet.

---

## 🚀 **SOLUTION: Reset Database and Reapply Migrations**

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

# 3. Reset the database (WARNING: This will delete all data!)
echo "=== Resetting database ===" && \
npx prisma migrate reset --force && \
echo "" && \

# 4. Verify migrations applied
echo "=== Verifying migrations ===" && \
npx prisma migrate status && \
echo "" && \

# 5. Test connection
echo "=== Testing connection ===" && \
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1" && \
echo "" && \

# 6. Verify tables created
echo "=== Verifying tables ===" && \
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "\dt"
```

**Time:** ~5-10 minutes

---

## ⚠️ **WARNING: DATABASE RESET**

The `npx prisma migrate reset --force` command will:

1. ✓ Drop the entire database
2. ✓ Recreate the database
3. ✓ Reapply all migrations from scratch
4. ✓ Seed the database (if seed script exists)

**This will DELETE all existing data!**

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

### **Step 3: Reset Database** (10-30 seconds)

```bash
npx prisma migrate reset --force
```

**Expected Output:**
```
✔ Dropped the database
✔ Created the database
✔ Ran all pending migrations
✔ Seeded the database (if seed script exists)
```

---

### **Step 4: Verify Migrations** (5-10 seconds)

```bash
npx prisma migrate status
```

**Expected Output:**
```
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "philippines_ecommerce", schema "public" at "localhost:5432"

Following migration have been applied:
  migrations/
    └─ 20250101000000_add_testimonials_feature/
       └─ migration.sql

All migrations have been successfully applied.
```

---

### **Step 5: Test Connection** (1-2 seconds)

```bash
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1"
```

**Expected Output:**
```
 ?column?
----------
        1
(1 row)
```

---

### **Step 6: Verify Tables Created** (1-2 seconds)

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

## 📋 **ALTERNATIVE: Manual Migration Recovery**

If you want to keep existing data, use this approach:

### **Step 1: Mark Migration as Resolved**

```bash
cd /var/www/html/ecom/app && \
export DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce" && \
npx prisma migrate resolve --rolled-back add_testimonials_feature
```

### **Step 2: Check Migration Status**

```bash
npx prisma migrate status
```

### **Step 3: Reapply Migrations**

```bash
npx prisma migrate deploy
```

---

## 📞 **TROUBLESHOOTING**

### **Issue: Reset fails**

**Solution:** Check database connection:
```bash
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1"
```

---

### **Issue: Migrations still fail**

**Solution:** Check migration files:
```bash
ls -la /var/www/html/ecom/app/prisma/migrations/
```

---

### **Issue: Tables not created**

**Solution:** Verify Prisma schema:
```bash
cat /var/www/html/ecom/app/prisma/schema.prisma | grep -A 10 "model Product"
```

---

## ✅ **VERIFICATION CHECKLIST**

- [ ] In correct directory (/var/www/html/ecom/app)
- [ ] DATABASE_URL exported to shell
- [ ] Database reset successfully
- [ ] All migrations applied
- [ ] Connection test successful
- [ ] All tables created
- [ ] Migration status shows success

---

## 🎯 **IMMEDIATE ACTION**

### **Run This Command Now:**

```bash
cd /var/www/html/ecom/app && \
export DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce" && \
npx prisma migrate reset --force
```

---

## 📊 **MIGRATION PROCESS**

### **What Happens During Reset**

1. **Drop Database**
   ```sql
   DROP DATABASE philippines_ecommerce;
   ```

2. **Create Database**
   ```sql
   CREATE DATABASE philippines_ecommerce;
   ```

3. **Apply All Migrations**
   - Creates all tables
   - Creates all indexes
   - Creates all constraints
   - Applies all schema changes

4. **Seed Database** (if seed script exists)
   - Inserts initial data
   - Sets up default values

---

## 🚀 **NEXT STEPS**

After migrations are applied:

1. ✓ DATABASE_URL environment variable set
2. ✓ Database reset successfully
3. ✓ All migrations applied
4. ✓ All tables created
5. ⏳ Deploy application

---

**Last Updated:** November 10, 2025  
**Version:** 1.0

---

**Next Command:**
```bash
cd /var/www/html/ecom/app && export DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce" && npx prisma migrate reset --force
```

