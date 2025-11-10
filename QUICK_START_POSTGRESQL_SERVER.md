# Quick Start PostgreSQL Server

**Date:** November 4, 2025  
**Status:** 🔧 STARTING POSTGRESQL SERVER  
**Version:** 1.0

---

## ⚡ **ONE-COMMAND START**

Copy and paste this entire command:

```bash
sudo systemctl start postgresql && \
sleep 3 && \
sudo systemctl status postgresql && \
ps aux | grep postgres && \
sudo -u postgres createuser -P user && \
sudo -u postgres createdb -O user philippines_ecommerce && \
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1" && \
cd /var/www/html/ecom/app && npx prisma migrate deploy
```

**Time:** ~5-10 minutes

---

## 📋 **WHAT THIS DOES**

1. ✓ Starts PostgreSQL service
2. ✓ Waits 3 seconds
3. ✓ Checks status
4. ✓ Verifies processes running
5. ✓ Creates database user
6. ✓ Creates database
7. ✓ Tests connection
8. ✓ Runs Prisma migrations

---

## 🚀 **STEP-BY-STEP**

### **Step 1: Start PostgreSQL**
```bash
sudo systemctl start postgresql
sleep 3
```

### **Step 2: Check Status**
```bash
sudo systemctl status postgresql
```

**Expected Output:**
```
● postgresql.service - PostgreSQL RDBMS
   Active: active (running)
```

### **Step 3: Verify Processes**
```bash
ps aux | grep postgres
```

**Expected Output:**
```
postgres   1234  0.0  0.5 ...
postgres   1235  0.0  0.3 ...
```

### **Step 4: Create User**
```bash
sudo -u postgres createuser -P user
```
**Enter password:** `password`

### **Step 5: Create Database**
```bash
sudo -u postgres createdb -O user philippines_ecommerce
```

### **Step 6: Test Connection**
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

### **Step 7: Run Migrations**
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

### **Still shows "active (exited)":**
```bash
sudo systemctl restart postgresql
sudo systemctl status postgresql
```

### **No processes running:**
```bash
ps aux | grep postgres
```

### **Connection fails:**
```bash
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1"
```

### **Check logs:**
```bash
sudo tail -50 /var/log/postgresql/postgresql-16-main.log
```

---

**For detailed guide:** See `POSTGRESQL_SERVER_NOT_RUNNING_FIX.md`

**Last Updated:** November 4, 2025

