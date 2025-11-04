# Quick PostgreSQL Systemd Fix

**Date:** November 4, 2025  
**Status:** 🔧 QUICK FIX  
**Version:** 1.0

---

## ⚡ **ONE-COMMAND FIX**

Copy and paste this entire command:

```bash
sudo systemctl stop postgresql && \
sleep 2 && \
sudo systemctl start postgresql-16 && \
sleep 3 && \
sudo systemctl status postgresql-16 && \
sudo -u postgres psql -c "ALTER USER \"user\" WITH PASSWORD 'password';" && \
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1" && \
cd /var/www/html/ecom/app && npx prisma migrate deploy
```

**Time:** ~5-10 minutes

---

## 📋 **WHAT THIS DOES**

1. ✓ Stops the broken postgresql service
2. ✓ Waits 2 seconds
3. ✓ Starts the correct postgresql-16 service
4. ✓ Waits 3 seconds
5. ✓ Checks status (should show "active (running)")
6. ✓ Resets user password
7. ✓ Tests database connection
8. ✓ Runs Prisma migrations

---

## 🚀 **STEP-BY-STEP**

### **Step 1: Stop Broken Service**
```bash
sudo systemctl stop postgresql
sleep 2
```

### **Step 2: Start PostgreSQL 16**
```bash
sudo systemctl start postgresql-16
sleep 3
```

### **Step 3: Check Status**
```bash
sudo systemctl status postgresql-16
```

**Expected Output:**
```
● postgresql-16.service - PostgreSQL 16 database server
   Active: active (running)
```

### **Step 4: Reset Password**
```bash
sudo -u postgres psql -c "ALTER USER \"user\" WITH PASSWORD 'password';"
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
sudo systemctl start postgresql-16 && \
sleep 3 && \
sudo systemctl status postgresql-16
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

### **Still shows "active (exited)":**
```bash
sudo systemctl list-unit-files | grep postgresql
sudo systemctl start postgresql-16
sudo systemctl status postgresql-16
```

### **Connection fails:**
```bash
ps aux | grep postgres
```

Should show multiple postgres processes.

### **Migrations fail:**
```bash
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1"
```

---

**For detailed guide:** See `POSTGRESQL_SYSTEMD_FIX.md`

**Last Updated:** November 4, 2025

