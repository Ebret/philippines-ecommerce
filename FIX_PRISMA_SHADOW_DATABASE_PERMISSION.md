# Fix Prisma Shadow Database Permission Error

**Date:** November 10, 2025  
**Status:** 🔧 FIXING SHADOW DATABASE PERMISSION ERROR  
**Version:** 1.0

---

## 🔴 **ISSUE IDENTIFIED**

Prisma Migrate fails because the `user` account doesn't have permission to create databases:

```
Error: P3014

Prisma Migrate could not create the shadow database. Please make sure the database user has permission to create databases.

Original error:
ERROR: permission denied to create database
```

**Root Cause:** Prisma Migrate needs to create a temporary "shadow database" for schema validation during development. The `user` account needs the `CREATEDB` privilege.

---

## 🚀 **SOLUTION: Grant CREATEDB Privilege to User**

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

# 3. Grant CREATEDB privilege to user
echo "=== Granting CREATEDB privilege to user ===" && \
PGPASSWORD=password psql -h localhost -U postgres -c "ALTER USER \"user\" CREATEDB;" && \
echo "" && \

# 4. Verify privilege was granted
echo "=== Verifying privilege ===" && \
PGPASSWORD=password psql -h localhost -U postgres -c "SELECT usename, usecreatedb FROM pg_user WHERE usename = 'user';" && \
echo "" && \

# 5. Delete the failed migration directory
echo "=== Deleting failed migration ===" && \
rm -rf /var/www/html/ecom/app/prisma/migrations/* && \
echo "Deleted all migrations" && \
echo "" && \

# 6. Drop database
echo "=== Dropping database ===" && \
PGPASSWORD=password psql -h localhost -U postgres -c "DROP DATABASE IF EXISTS philippines_ecommerce;" && \
sleep 1 && \
echo "" && \

# 7. Create database with quoted username
echo "=== Creating database with quoted username ===" && \
PGPASSWORD=password psql -h localhost -U postgres -c "CREATE DATABASE philippines_ecommerce OWNER \"user\";" && \
sleep 1 && \
echo "" && \

# 8. Generate migrations from schema
echo "=== Generating migrations from schema ===" && \
npx prisma migrate dev --name init && \
echo "" && \

# 9. Verify migrations
echo "=== Verifying migrations ===" && \
npx prisma migrate status && \
echo "" && \

# 10. Verify tables
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

### **Step 3: Grant CREATEDB Privilege** (1-2 seconds)

```bash
PGPASSWORD=password psql -h localhost -U postgres -c "ALTER USER \"user\" CREATEDB;"
```

**Expected Output:**
```
ALTER ROLE
```

---

### **Step 4: Verify Privilege** (1-2 seconds)

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

**Key:** `usecreatedb` should be `t` (true)

---

### **Step 5: Delete Failed Migration** (1-2 seconds)

```bash
rm -rf /var/www/html/ecom/app/prisma/migrations/*
echo "Deleted all migrations"
```

---

### **Step 6: Drop Database** (2-3 seconds)

```bash
PGPASSWORD=password psql -h localhost -U postgres -c "DROP DATABASE IF EXISTS philippines_ecommerce;"
sleep 1
```

---

### **Step 7: Create Database with Quoted Username** (2-3 seconds)

```bash
PGPASSWORD=password psql -h localhost -U postgres -c "CREATE DATABASE philippines_ecommerce OWNER \"user\";"
sleep 1
```

---

### **Step 8: Generate Migration from Schema** (10-20 seconds)

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

### **Step 9: Verify Migration Status** (5-10 seconds)

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

### **Step 10: Verify Tables Created** (1-2 seconds)

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

Prisma Migrate creates a temporary "shadow database" during development to validate schema changes. This requires the database user to have the `CREATEDB` privilege.

### **The Solution**

Grant the `CREATEDB` privilege to the `user` account:

```sql
ALTER USER "user" CREATEDB;
```

This allows the `user` account to create databases, which Prisma Migrate needs for the shadow database.

---

## 📞 **TROUBLESHOOTING**

### **Issue: Still getting permission denied**

**Solution:** Verify the privilege was granted:
```bash
PGPASSWORD=password psql -h localhost -U postgres -c "SELECT usename, usecreatedb FROM pg_user WHERE usename = 'user';"
```

Should show `usecreatedb = t`

---

### **Issue: Migration generation still fails**

**Solution:** Check if privilege is actually set:
```bash
PGPASSWORD=password psql -h localhost -U postgres -c "\du user"
```

Should show `Create DB` in the output

---

### **Issue: Shadow database not being cleaned up**

**Solution:** Prisma will automatically clean up shadow databases. If you see them:
```bash
PGPASSWORD=password psql -h localhost -U postgres -c "\l | grep shadow"
```

---

## ✅ **VERIFICATION CHECKLIST**

- [ ] In correct directory (/var/www/html/ecom/app)
- [ ] DATABASE_URL exported to shell
- [ ] CREATEDB privilege granted to user
- [ ] Privilege verified (usecreatedb = t)
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
PGPASSWORD=password psql -h localhost -U postgres -c "ALTER USER \"user\" CREATEDB;" && \
rm -rf /var/www/html/ecom/app/prisma/migrations/* && \
PGPASSWORD=password psql -h localhost -U postgres -c "DROP DATABASE IF EXISTS philippines_ecommerce;" && \
sleep 1 && \
PGPASSWORD=password psql -h localhost -U postgres -c "CREATE DATABASE philippines_ecommerce OWNER \"user\";" && \
sleep 1 && \
npx prisma migrate dev --name init
```

---

## 📊 **POSTGRESQL PRIVILEGES**

Common privileges for database users:

- `CREATEDB` - Can create databases
- `CREATEUSER` - Can create other users
- `SUPERUSER` - Has all privileges
- `LOGIN` - Can log in (default)
- `INHERIT` - Inherits role privileges (default)

---

## 🚀 **NEXT STEPS**

After migrations are applied:

1. ✓ CREATEDB privilege granted
2. ✓ Database recreated with correct owner
3. ✓ All migrations generated and applied
4. ✓ All tables created
5. ⏳ Deploy application

---

**Last Updated:** November 10, 2025  
**Version:** 1.0

---

**Next Command:**
```bash
cd /var/www/html/ecom/app && export DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce" && PGPASSWORD=password psql -h localhost -U postgres -c "ALTER USER \"user\" CREATEDB;" && rm -rf /var/www/html/ecom/app/prisma/migrations/* && PGPASSWORD=password psql -h localhost -U postgres -c "DROP DATABASE IF EXISTS philippines_ecommerce;" && sleep 1 && PGPASSWORD=password psql -h localhost -U postgres -c "CREATE DATABASE philippines_ecommerce OWNER \"user\";" && sleep 1 && npx prisma migrate dev --name init
```

