# Quick Fix - Prisma & PostgreSQL

**Date:** November 4, 2025  
**Status:** 🔧 QUICK FIX GUIDE  
**Version:** 1.0

---

## ⚡ **ONE-COMMAND FIX**

Copy and paste this entire command:

```bash
cp /var/www/html/ecom/app/.env.production /var/www/html/ecom/app/.env.local && \
sudo service postgresql start && \
sudo service postgresql status && \
sleep 2 && \
psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1" && \
cd /var/www/html/ecom/app && npx prisma migrate deploy
```

**Time:** ~2-5 minutes

---

## 📋 **WHAT THIS DOES**

1. ✓ Copies `.env.production` to `.env.local` (Prisma reads this)
2. ✓ Starts PostgreSQL service
3. ✓ Verifies PostgreSQL is running
4. ✓ Tests database connection
5. ✓ Runs Prisma migrations

---

## 🚀 **STEP-BY-STEP**

### **Step 1: Copy Environment File**
```bash
cp /var/www/html/ecom/app/.env.production /var/www/html/ecom/app/.env.local
```

### **Step 2: Start PostgreSQL**
```bash
sudo service postgresql start
```

### **Step 3: Verify PostgreSQL**
```bash
sudo service postgresql status
```

### **Step 4: Test Connection**
```bash
psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1"
```

### **Step 5: Run Migrations**
```bash
cd /var/www/html/ecom/app && npx prisma migrate deploy
```

---

## ✅ **EXPECTED OUTPUT**

### **After Step 1:**
```
(no output - file copied)
```

### **After Step 2:**
```
(no output - service started)
```

### **After Step 3:**
```
● postgresql.service - PostgreSQL RDBMS
   Loaded: loaded
   Active: active (running)
```

### **After Step 4:**
```
 ?column?
----------
        1
(1 row)
```

### **After Step 5:**
```
Prisma schema loaded from prisma/schema.prisma
All migrations have been applied successfully.
```

---

## 🎯 **IMMEDIATE ACTION**

### **Run This Now:**

```bash
cp /var/www/html/ecom/app/.env.production /var/www/html/ecom/app/.env.local && \
sudo service postgresql start && \
cd /var/www/html/ecom/app && npx prisma migrate deploy
```

---

## 📞 **IF SOMETHING FAILS**

### **PostgreSQL won't start:**
```bash
sudo service postgresql restart
```

### **Database connection fails:**
```bash
psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1"
```

### **Prisma still can't find DATABASE_URL:**
```bash
cat /var/www/html/ecom/app/.env.local | grep DATABASE_URL
```

---

**For detailed guide:** See `PRISMA_MIGRATION_TROUBLESHOOTING.md`

**Last Updated:** November 4, 2025

