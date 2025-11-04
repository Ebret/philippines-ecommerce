# Quick PostgreSQL Fix

**Date:** November 4, 2025  
**Status:** 🔧 QUICK FIX  
**Version:** 1.0

---

## ⚡ **ONE-COMMAND FIX**

Copy and paste this entire command:

```bash
sudo systemctl stop postgresql && \
sleep 2 && \
sudo systemctl start postgresql && \
sleep 3 && \
sudo -u postgres psql -c "ALTER USER \"user\" WITH PASSWORD 'password';" && \
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1" && \
cd /var/www/html/ecom/app && npx prisma migrate deploy
```

**Time:** ~5-10 minutes

---

## 📋 **WHAT THIS DOES**

1. ✓ Stops PostgreSQL service
2. ✓ Waits 2 seconds
3. ✓ Starts PostgreSQL service
4. ✓ Waits 3 seconds
5. ✓ Resets user password to "password"
6. ✓ Tests database connection
7. ✓ Runs Prisma migrations

---

## 🚀 **STEP-BY-STEP**

### **Step 1: Stop PostgreSQL**
```bash
sudo systemctl stop postgresql
sleep 2
```

### **Step 2: Start PostgreSQL**
```bash
sudo systemctl start postgresql
sleep 3
```

### **Step 3: Check Status**
```bash
sudo systemctl status postgresql
```

**Expected Output:**
```
● postgresql.service - PostgreSQL RDBMS
   Active: active (running)
```

### **Step 4: Reset Password**
```bash
sudo -u postgres psql -c "ALTER USER \"user\" WITH PASSWORD 'password';"
```

**Expected Output:**
```
ALTER ROLE
```

### **Step 5: Test Connection**
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

### **Step 6: Run Migrations**
```bash
cd /var/www/html/ecom/app && npx prisma migrate deploy
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
sudo systemctl stop postgresql && \
sleep 2 && \
sudo systemctl start postgresql && \
sleep 3 && \
sudo systemctl status postgresql
```

Then:

```bash
sudo -u postgres psql -c "ALTER USER \"user\" WITH PASSWORD 'password';"
```

Then:

```bash
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1"
```

Then:

```bash
cd /var/www/html/ecom/app && npx prisma migrate deploy
```

---

## 📞 **QUICK TROUBLESHOOTING**

### **PostgreSQL still not running:**
```bash
sudo systemctl restart postgresql
sudo systemctl status postgresql
```

### **Connection still fails:**
```bash
sudo -u postgres psql -c "ALTER USER \"user\" WITH PASSWORD 'password';"
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1"
```

### **Prisma still can't find DATABASE_URL:**
```bash
cat /var/www/html/ecom/app/.env.local | grep DATABASE_URL
```

---

**For detailed guide:** See `POSTGRESQL_SERVICE_FIX.md`

**Last Updated:** November 4, 2025

