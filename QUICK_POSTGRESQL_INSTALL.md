# Quick PostgreSQL Installation

**Date:** November 4, 2025  
**Status:** 🔧 INSTALLING POSTGRESQL  
**Version:** 1.0

---

## ⚡ **ONE-COMMAND INSTALLATION**

Copy and paste this entire command:

```bash
sudo apt update && \
sudo apt install -y postgresql postgresql-contrib && \
sudo service postgresql start && \
sudo -u postgres createuser -P user && \
sudo -u postgres createdb -O user philippines_ecommerce && \
psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1" && \
cd /var/www/html/ecom/app && npx prisma migrate deploy
```

**Time:** ~10-15 minutes

---

## 📋 **WHAT THIS DOES**

1. ✓ Updates package manager
2. ✓ Installs PostgreSQL server
3. ✓ Starts PostgreSQL service
4. ✓ Creates database user `user`
5. ✓ Creates database `philippines_ecommerce`
6. ✓ Tests database connection
7. ✓ Runs Prisma migrations

---

## 🚀 **STEP-BY-STEP**

### **Step 1: Update & Install** (5-10 minutes)
```bash
sudo apt update && sudo apt install -y postgresql postgresql-contrib
```

### **Step 2: Start Service** (5-10 seconds)
```bash
sudo service postgresql start
```

### **Step 3: Create User** (10-20 seconds)
```bash
sudo -u postgres createuser -P user
```
**Enter password:** `password`

### **Step 4: Create Database** (5-10 seconds)
```bash
sudo -u postgres createdb -O user philippines_ecommerce
```

### **Step 5: Test Connection** (1-2 seconds)
```bash
psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1"
```

### **Step 6: Run Migrations** (2-5 minutes)
```bash
cd /var/www/html/ecom/app && npx prisma migrate deploy
```

---

## ✅ **EXPECTED OUTPUT**

### **After Installation:**
```
Setting up postgresql-16 ...
Processing triggers for postgresql-common ...
```

### **After Service Start:**
```
● postgresql.service - PostgreSQL RDBMS
   Active: active (running)
```

### **After Connection Test:**
```
 ?column?
----------
        1
(1 row)
```

### **After Migrations:**
```
Prisma schema loaded from prisma/schema.prisma
All migrations have been applied successfully.
```

---

## 🎯 **IMMEDIATE ACTION**

### **Run This Now:**

```bash
sudo apt update && \
sudo apt install -y postgresql postgresql-contrib && \
sudo service postgresql start
```

Then create user and database:

```bash
sudo -u postgres createuser -P user
sudo -u postgres createdb -O user philippines_ecommerce
```

Then test and migrate:

```bash
psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1"
cd /var/www/html/ecom/app && npx prisma migrate deploy
```

---

## 📞 **QUICK TROUBLESHOOTING**

### **PostgreSQL won't start:**
```bash
sudo service postgresql restart
```

### **Connection fails:**
```bash
psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1"
```

### **User creation fails:**
```bash
sudo -u postgres createuser -P user
```

---

**For detailed guide:** See `POSTGRESQL_INSTALLATION_GUIDE.md`

**Last Updated:** November 4, 2025

