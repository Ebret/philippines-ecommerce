# Quick PostgreSQL Data Corruption Fix

**Date:** November 10, 2025  
**Status:** 🔧 QUICK FIX  
**Version:** 1.0

---

## ⚡ **ONE-COMMAND FIX**

Copy and paste this entire command:

```bash
sudo systemctl stop postgresql && \
sleep 2 && \
sudo mv /var/lib/postgresql/16/main /var/lib/postgresql/16/main.backup && \
sleep 1 && \
sudo mkdir -p /var/lib/postgresql/16/main && \
sudo chown postgres:postgres /var/lib/postgresql/16/main && \
sudo chmod 700 /var/lib/postgresql/16/main && \
sleep 1 && \
sudo -u postgres /usr/lib/postgresql/16/bin/initdb -D /var/lib/postgresql/16/main && \
sleep 2 && \
sudo systemctl start postgresql && \
sleep 3 && \
sudo systemctl status postgresql && \
ps aux | grep postgres && \
sudo -u postgres createuser -P user && \
sudo -u postgres createdb -O user philippines_ecommerce && \
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1" && \
cd /var/www/html/ecom/app && npx prisma migrate deploy
```

**Time:** ~10-15 minutes

---

## 📋 **WHAT THIS DOES**

1. ✓ Stops PostgreSQL service
2. ✓ Backs up corrupted data
3. ✓ Creates new data directory
4. ✓ Sets correct permissions
5. ✓ Initializes database cluster
6. ✓ Starts PostgreSQL service
7. ✓ Verifies status and processes
8. ✓ Creates database user
9. ✓ Creates database
10. ✓ Tests connection
11. ✓ Runs Prisma migrations

---

## 🚀 **STEP-BY-STEP**

### **Step 1: Stop & Backup** (10-15 seconds)
```bash
sudo systemctl stop postgresql
sleep 2
sudo mv /var/lib/postgresql/16/main /var/lib/postgresql/16/main.backup
sleep 1
```

### **Step 2: Create & Initialize** (15-25 seconds)
```bash
sudo mkdir -p /var/lib/postgresql/16/main
sudo chown postgres:postgres /var/lib/postgresql/16/main
sudo chmod 700 /var/lib/postgresql/16/main
sleep 1
sudo -u postgres /usr/lib/postgresql/16/bin/initdb -D /var/lib/postgresql/16/main
sleep 2
```

### **Step 3: Start & Verify** (10-15 seconds)
```bash
sudo systemctl start postgresql
sleep 3
sudo systemctl status postgresql
ps aux | grep postgres
```

**Expected Output:**
```
● postgresql.service - PostgreSQL RDBMS
   Active: active (running)

postgres   1234  0.0  0.5 ...
postgres   1235  0.0  0.3 ...
```

### **Step 4: Create User** (10-20 seconds)
```bash
sudo -u postgres createuser -P user
```
**Enter password:** `password`

### **Step 5: Create Database** (5-10 seconds)
```bash
sudo -u postgres createdb -O user philippines_ecommerce
```

### **Step 6: Test Connection** (1-2 seconds)
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

### **Step 7: Run Migrations** (2-5 minutes)
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
sudo mv /var/lib/postgresql/16/main /var/lib/postgresql/16/main.backup && \
sleep 1 && \
sudo mkdir -p /var/lib/postgresql/16/main && \
sudo chown postgres:postgres /var/lib/postgresql/16/main && \
sudo chmod 700 /var/lib/postgresql/16/main && \
sleep 1 && \
sudo -u postgres /usr/lib/postgresql/16/bin/initdb -D /var/lib/postgresql/16/main && \
sleep 2 && \
sudo systemctl start postgresql && \
sleep 3 && \
sudo systemctl status postgresql
```

Then verify processes:

```bash
ps aux | grep postgres
```

Then create user:

```bash
sudo -u postgres createuser -P user
```

Then create database:

```bash
sudo -u postgres createdb -O user philippines_ecommerce
```

Then test:

```bash
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1"
```

Then migrate:

```bash
cd /var/www/html/ecom/app && npx prisma migrate deploy
```

---

## 📞 **QUICK TROUBLESHOOTING**

### **initdb fails:**
```bash
ls -la /var/lib/postgresql/16/
sudo chown postgres:postgres /var/lib/postgresql/16/main
sudo chmod 700 /var/lib/postgresql/16/main
```

### **PostgreSQL won't start:**
```bash
sudo tail -50 /var/log/postgresql/postgresql-16-main.log
```

### **Connection fails:**
```bash
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1"
```

---

**For detailed guide:** See `POSTGRESQL_DATA_CORRUPTION_FIX.md`

**Last Updated:** November 10, 2025

