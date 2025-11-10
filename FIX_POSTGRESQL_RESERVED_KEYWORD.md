# Fix PostgreSQL Reserved Keyword Error

**Date:** November 10, 2025  
**Status:** 🔧 FIXING RESERVED KEYWORD ERROR  
**Version:** 1.0

---

## 🔴 **ISSUE IDENTIFIED**

PostgreSQL error when creating database:

```
ERROR:  syntax error at or near "user"
LINE 1: CREATE DATABASE philippines_ecommerce OWNER user;
                                                    ^
```

**Root Cause:** `user` is a reserved keyword in PostgreSQL. We need to quote it with double quotes.

---

## 🚀 **SOLUTION: Use Quoted Username and Recreate Database**

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
rm -rf /var/www/html/ecom/app/prisma/migrations/* && \
echo "Deleted all migrations" && \
echo "" && \

# 4. Drop database
echo "=== Dropping database ===" && \
PGPASSWORD=password psql -h localhost -U postgres -c "DROP DATABASE IF EXISTS philippines_ecommerce;" && \
sleep 1 && \
echo "" && \

# 5. Create database with quoted username
echo "=== Creating database with quoted username ===" && \
PGPASSWORD=password psql -h localhost -U postgres -c "CREATE DATABASE philippines_ecommerce OWNER \"user\";" && \
sleep 1 && \
echo "" && \

# 6. Generate migrations from schema
echo "=== Generating migrations from schema ===" && \
npx prisma migrate dev --name init && \
echo "" && \

# 7. Verify migrations
echo "=== Verifying migrations ===" && \
npx prisma migrate status && \
echo "" && \

# 8. Verify tables
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

### **Step 4: Drop Database** (2-3 seconds)

```bash
PGPASSWORD=password psql -h localhost -U postgres -c "DROP DATABASE IF EXISTS philippines_ecommerce;"
sleep 1
```

**Expected Output:**
```
NOTICE:  database "philippines_ecommerce" does not exist, skipping
DROP DATABASE
```

---

### **Step 5: Create Database with Quoted Username** (2-3 seconds)

```bash
PGPASSWORD=password psql -h localhost -U postgres -c "CREATE DATABASE philippines_ecommerce OWNER \"user\";"
sleep 1
```

**Expected Output:**
```
CREATE DATABASE
```

**Key Point:** Notice the double quotes around `user`: `OWNER \"user\"`

---

### **Step 6: Generate Migration from Schema** (10-20 seconds)

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

### **Step 7: Verify Migration Status** (5-10 seconds)

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

### **Step 8: Verify Tables Created** (1-2 seconds)

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

PostgreSQL has reserved keywords like `user`, `password`, `table`, etc. When used as identifiers (usernames, table names), they must be quoted with double quotes.

### **The Solution**

Use double quotes around the username:
```sql
CREATE DATABASE philippines_ecommerce OWNER "user";
```

---

## 📞 **TROUBLESHOOTING**

### **Issue: Still getting syntax error**

**Solution:** Make sure to use double quotes:
```bash
PGPASSWORD=password psql -h localhost -U postgres -c "CREATE DATABASE philippines_ecommerce OWNER \"user\";"
```

---

### **Issue: Permission denied to create database**

**Solution:** Make sure database was dropped first:
```bash
PGPASSWORD=password psql -h localhost -U postgres -c "DROP DATABASE IF EXISTS philippines_ecommerce;"
sleep 1
PGPASSWORD=password psql -h localhost -U postgres -c "CREATE DATABASE philippines_ecommerce OWNER \"user\";"
```

---

### **Issue: Migration generation fails**

**Solution:** Check Prisma schema:
```bash
cat /var/www/html/ecom/app/prisma/schema.prisma | head -20
```

---

## ✅ **VERIFICATION CHECKLIST**

- [ ] In correct directory (/var/www/html/ecom/app)
- [ ] DATABASE_URL exported to shell
- [ ] Failed migration deleted
- [ ] Database dropped
- [ ] Database created with quoted username
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
PGPASSWORD=password psql -h localhost -U postgres -c "CREATE DATABASE philippines_ecommerce OWNER \"user\";" && \
sleep 1 && \
npx prisma migrate dev --name init
```

---

## 📊 **POSTGRESQL RESERVED KEYWORDS**

Common reserved keywords that need quoting:

- `user` → `"user"`
- `password` → `"password"`
- `table` → `"table"`
- `order` → `"order"`
- `group` → `"group"`
- `select` → `"select"`
- `from` → `"from"`
- `where` → `"where"`

---

## 🚀 **NEXT STEPS**

After migrations are applied:

1. ✓ DATABASE_URL environment variable set
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
cd /var/www/html/ecom/app && export DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce" && rm -rf /var/www/html/ecom/app/prisma/migrations/* && PGPASSWORD=password psql -h localhost -U postgres -c "DROP DATABASE IF EXISTS philippines_ecommerce;" && sleep 1 && PGPASSWORD=password psql -h localhost -U postgres -c "CREATE DATABASE philippines_ecommerce OWNER \"user\";" && sleep 1 && npx prisma migrate dev --name init
```

