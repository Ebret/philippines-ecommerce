# Philippines E-Commerce Platform - Complete Deployment Guide

**Date:** November 10, 2025  
**Status:** 🚀 READY FOR DEPLOYMENT  
**Version:** 1.0

---

## 📋 **COMPLETE DEPLOYMENT WORKFLOW**

Run these commands in order on your VPS server. You're already in `/var/www/html/ecom/app`, so start from Step 1.

---

## 🔐 **STEP 1: Export DATABASE_URL**

```bash
export DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce"
echo "DATABASE_URL=$DATABASE_URL"
```

**Expected Output:**
```
DATABASE_URL=postgresql://user:password@localhost:5432/philippines_ecommerce
```

---

## 🔐 **STEP 2: Grant CREATEDB Privilege**

```bash
PGPASSWORD=password psql -h localhost -U postgres -c "ALTER USER \"user\" CREATEDB;"
```

**Expected Output:**
```
ALTER ROLE
```

---

## ✅ **STEP 3: Verify Privilege**

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

## 🗑️ **STEP 4: Delete Failed Migrations**

```bash
rm -rf /var/www/html/ecom/app/prisma/migrations/*
echo "Deleted all migrations"
```

**Expected Output:**
```
Deleted all migrations
```

---

## 🗑️ **STEP 5: Drop Database**

```bash
PGPASSWORD=password psql -h localhost -U postgres -c "DROP DATABASE IF EXISTS philippines_ecommerce;"
sleep 1
```

**Expected Output:**
```
DROP DATABASE
```

---

## 🗄️ **STEP 6: Create Database**

```bash
PGPASSWORD=password psql -h localhost -U postgres -c "CREATE DATABASE philippines_ecommerce OWNER \"user\";"
sleep 1
```

**Expected Output:**
```
CREATE DATABASE
```

---

## 🔄 **STEP 7: Generate and Apply Migrations**

```bash
npx prisma migrate dev --name init
```

**Expected Output:**
```
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "philippines_ecommerce", schema "public" at "localhost:5432"

✔ Created migration folder for new migration
✔ Generated migration file
✔ Ran all pending migrations
✔ Generated Prisma Client
```

---

## ✅ **STEP 8: Verify Migration Status**

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

## 📊 **STEP 9: List All Tables**

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

## 🔗 **STEP 10: Verify Database Connection**

```bash
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1 as connection_test;"
```

**Expected Output:**
```
 connection_test
-----------------
               1
(1 row)
```

---

## 🚀 **STEP 11: Execute Deployment Script**

```bash
chmod +x /var/www/html/ecom/scripts/deploy.sh
/var/www/html/ecom/scripts/deploy.sh
```

**Expected Output:**
```
Starting deployment...
[deployment output]
✓ Deployment complete
```

---

## 🎯 **QUICK COPY-PASTE: All Commands at Once**

If you want to run all commands together, copy and paste this:

```bash
cd /var/www/html/ecom/app && \
export DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce" && \
PGPASSWORD=password psql -h localhost -U postgres -c "ALTER USER \"user\" CREATEDB;" && \
PGPASSWORD=password psql -h localhost -U postgres -c "SELECT usename, usecreatedb FROM pg_user WHERE usename = 'user';" && \
rm -rf /var/www/html/ecom/app/prisma/migrations/* && \
PGPASSWORD=password psql -h localhost -U postgres -c "DROP DATABASE IF EXISTS philippines_ecommerce;" && \
sleep 1 && \
PGPASSWORD=password psql -h localhost -U postgres -c "CREATE DATABASE philippines_ecommerce OWNER \"user\";" && \
sleep 1 && \
npx prisma migrate dev --name init && \
npx prisma migrate status && \
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "\dt" && \
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1 as connection_test;" && \
chmod +x /var/www/html/ecom/scripts/deploy.sh && \
/var/www/html/ecom/scripts/deploy.sh
```

---

## 📞 **TROUBLESHOOTING**

### **If CREATEDB privilege fails:**
```bash
PGPASSWORD=password psql -h localhost -U postgres -c "\du user"
```

Should show `Create DB` in the output.

---

### **If migration generation fails:**
```bash
cat /var/www/html/ecom/app/prisma/schema.prisma | head -20
```

Check if schema is valid.

---

### **If tables are not created:**
```bash
npx prisma migrate status
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "\dt"
```

---

### **If deployment script fails:**
```bash
ls -la /var/www/html/ecom/scripts/
cat /var/www/html/ecom/scripts/deploy.sh | head -20
```

---

## ✅ **VERIFICATION CHECKLIST**

After completing all steps, verify:

- [ ] CREATEDB privilege granted (usecreatedb = t)
- [ ] Database created successfully
- [ ] Migrations generated and applied
- [ ] All tables created (Product, Testimonial, etc.)
- [ ] Database connection test passed
- [ ] Deployment script executed successfully
- [ ] Application is running

---

## 🎉 **SUCCESS INDICATORS**

You'll know deployment is complete when you see:

1. ✓ `ALTER ROLE` - Privilege granted
2. ✓ `usecreatedb | t` - Privilege verified
3. ✓ `DROP DATABASE` - Old database removed
4. ✓ `CREATE DATABASE` - New database created
5. ✓ `✔ Ran all pending migrations` - Migrations applied
6. ✓ `All migrations have been successfully applied` - Status verified
7. ✓ Multiple tables listed (Product, Testimonial, etc.)
8. ✓ `connection_test | 1` - Connection verified
9. ✓ Deployment script output shows success

---

## 📊 **ESTIMATED TIME**

- CREATEDB privilege: 1-2 seconds
- Database recreation: 5-10 seconds
- Migration generation: 10-20 seconds
- Migration application: 5-10 seconds
- Verification: 5-10 seconds
- Deployment: 5-10 minutes

**Total: ~15-25 minutes**

---

## 🚀 **NEXT STEPS**

After deployment completes:

1. ✓ Check application logs
2. ✓ Verify application is running
3. ✓ Test API endpoints
4. ✓ Monitor performance

---

**Last Updated:** November 10, 2025  
**Version:** 1.0

---

**You're ready to deploy! Run the commands above on your VPS server. 🚀**

