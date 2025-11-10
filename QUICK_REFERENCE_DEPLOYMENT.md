# Quick Reference - Philippines E-Commerce Platform Deployment

**Date:** November 10, 2025  
**Status:** 🚀 READY TO DEPLOY  
**Current Location:** `/var/www/html/ecom/app` on VPS

---

## ⚡ **FASTEST DEPLOYMENT (Copy & Paste)**

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
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "\dt" && \
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1 as connection_test;" && \
chmod +x /var/www/html/ecom/scripts/deploy.sh && \
/var/www/html/ecom/scripts/deploy.sh
```

**Time:** ~15-25 minutes

---

## 📋 **STEP-BY-STEP (If you prefer individual commands)**

```bash
# 1. Export DATABASE_URL
export DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce"

# 2. Grant CREATEDB privilege
PGPASSWORD=password psql -h localhost -U postgres -c "ALTER USER \"user\" CREATEDB;"

# 3. Delete failed migrations
rm -rf /var/www/html/ecom/app/prisma/migrations/*

# 4. Drop database
PGPASSWORD=password psql -h localhost -U postgres -c "DROP DATABASE IF EXISTS philippines_ecommerce;"
sleep 1

# 5. Create database
PGPASSWORD=password psql -h localhost -U postgres -c "CREATE DATABASE philippines_ecommerce OWNER \"user\";"
sleep 1

# 6. Generate and apply migrations
npx prisma migrate dev --name init

# 7. Verify migration status
npx prisma migrate status

# 8. List all tables
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "\dt"

# 9. Test connection
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1 as connection_test;"

# 10. Deploy application
chmod +x /var/www/html/ecom/scripts/deploy.sh
/var/www/html/ecom/scripts/deploy.sh
```

---

## ✅ **WHAT TO EXPECT**

| Command | Expected Output |
|---------|-----------------|
| Grant CREATEDB | `ALTER ROLE` |
| Verify Privilege | `usecreatedb \| t` |
| Drop Database | `DROP DATABASE` |
| Create Database | `CREATE DATABASE` |
| Generate Migrations | `✔ Ran all pending migrations` |
| Verify Status | `All migrations have been successfully applied` |
| List Tables | Multiple tables (Product, Testimonial, etc.) |
| Test Connection | `connection_test \| 1` |
| Deploy | Application running successfully |

---

## 🔧 **QUICK TROUBLESHOOTING**

### **Privilege not granted?**
```bash
PGPASSWORD=password psql -h localhost -U postgres -c "\du user"
```

### **Migration failed?**
```bash
npx prisma migrate status
cat /var/www/html/ecom/app/prisma/schema.prisma | head -20
```

### **Tables not created?**
```bash
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "\dt"
```

### **Connection failed?**
```bash
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1"
```

### **Deployment script failed?**
```bash
ls -la /var/www/html/ecom/scripts/deploy.sh
bash -x /var/www/html/ecom/scripts/deploy.sh
```

---

## 📊 **CURRENT STATUS**

```
✅ READY:
  ✓ PostgreSQL running
  ✓ Database user created
  ✓ Application files copied
  ✓ npm packages installed
  ✓ .env.local configured

⏳ PENDING:
  ⏳ Grant CREATEDB privilege
  ⏳ Recreate database
  ⏳ Apply migrations
  ⏳ Deploy application
```

---

## 🎯 **NEXT STEP**

**Copy and paste the "FASTEST DEPLOYMENT" command above into your VPS terminal.**

---

## 📞 **IF SOMETHING GOES WRONG**

1. Check the error message carefully
2. Run the troubleshooting command for that step
3. Review the detailed guides:
   - `DEPLOYMENT_STEP_BY_STEP.md`
   - `DEPLOYMENT_FINAL_SUMMARY.md`
   - `FIX_PRISMA_SHADOW_DATABASE_PERMISSION.md`

---

## 🎉 **SUCCESS LOOKS LIKE**

```
✓ ALTER ROLE
✓ usecreatedb | t
✓ DROP DATABASE
✓ CREATE DATABASE
✓ ✔ Ran all pending migrations
✓ All migrations have been successfully applied
✓ Product | table | user
✓ Testimonial | table | user
✓ connection_test | 1
✓ [Deployment script output]
✓ Application running!
```

---

**You're ready! Deploy now! 🚀**

