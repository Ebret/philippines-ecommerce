# Quick PostgreSQL Reinstall

**Date:** November 4, 2025  
**Status:** 🔧 QUICK REINSTALL  
**Version:** 1.0

---

## ⚡ **ONE-COMMAND REINSTALL**

Copy and paste this entire command:

```bash
sudo apt remove -y postgresql postgresql-contrib && \
sudo apt autoremove -y && \
sleep 2 && \
sudo rm -rf /var/lib/postgresql/* && \
sudo rm -rf /etc/postgresql/* && \
sleep 1 && \
sudo apt update && \
sleep 2 && \
sudo apt install -y postgresql postgresql-contrib && \
sleep 3 && \
sudo systemctl start postgresql && \
sleep 3 && \
sudo systemctl status postgresql && \
sudo -u postgres createuser -P user && \
sudo -u postgres createdb -O user philippines_ecommerce && \
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1" && \
cd /var/www/html/ecom/app && npx prisma migrate deploy
```

**Time:** ~15-20 minutes

---

## 📋 **WHAT THIS DOES**

1. ✓ Removes broken PostgreSQL
2. ✓ Cleans PostgreSQL data
3. ✓ Updates package manager
4. ✓ Installs PostgreSQL fresh
5. ✓ Starts PostgreSQL service
6. ✓ Creates database user
7. ✓ Creates database
8. ✓ Tests connection
9. ✓ Runs Prisma migrations

---

## 🚀 **STEP-BY-STEP**

### **Step 1: Remove & Clean** (5-10 minutes)
```bash
sudo apt remove -y postgresql postgresql-contrib
sudo apt autoremove -y
sudo rm -rf /var/lib/postgresql/*
sudo rm -rf /etc/postgresql/*
```

### **Step 2: Update & Install** (5-10 minutes)
```bash
sudo apt update
sudo apt install -y postgresql postgresql-contrib
```

### **Step 3: Start Service** (5-10 seconds)
```bash
sudo systemctl start postgresql
sleep 3
sudo systemctl status postgresql
```

**Expected Output:**
```
● postgresql.service - PostgreSQL RDBMS
   Active: active (running)
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
sudo apt remove -y postgresql postgresql-contrib && \
sudo apt autoremove -y && \
sleep 2 && \
sudo rm -rf /var/lib/postgresql/* && \
sudo rm -rf /etc/postgresql/* && \
sleep 1 && \
sudo apt update && \
sleep 2 && \
sudo apt install -y postgresql postgresql-contrib && \
sleep 3 && \
sudo systemctl start postgresql && \
sleep 3 && \
sudo systemctl status postgresql
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
ps aux | grep postgres
```

### **Connection fails:**
```bash
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1"
```

### **Migrations fail:**
```bash
cd /var/www/html/ecom/app && npx prisma migrate deploy
```

---

**For detailed guide:** See `POSTGRESQL_COMPLETE_REINSTALL.md`

**Last Updated:** November 4, 2025

