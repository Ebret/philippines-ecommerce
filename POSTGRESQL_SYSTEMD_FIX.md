# PostgreSQL Systemd Configuration Fix

**Date:** November 4, 2025  
**Status:** 🔧 FIXING POSTGRESQL SYSTEMD CONFIGURATION  
**Version:** 1.0

---

## 🔴 **CRITICAL ISSUE IDENTIFIED**

PostgreSQL systemd service is misconfigured:

```
ExecStart=/bin/true (code=exited, status=0/SUCCESS)
Active: active (exited)
```

**Problem:** The service is configured to run `/bin/true` (a dummy command) instead of starting the actual PostgreSQL server.

**Root Cause:** Incorrect systemd service file configuration

---

## 🚀 **SOLUTION: Fix Systemd Configuration**

### **Option 1: Use postgresql-16 Service (Recommended)**

PostgreSQL 16 should have a proper service file. Use that instead:

```bash
# Stop the broken service
sudo systemctl stop postgresql

# Start the correct PostgreSQL 16 service
sudo systemctl start postgresql-16

# Check status
sudo systemctl status postgresql-16
```

**Expected Output:**
```
● postgresql-16.service - PostgreSQL 16 database server
   Active: active (running)
```

---

### **Option 2: Fix the Systemd Service File**

If Option 1 doesn't work, fix the service file:

```bash
# 1. Stop PostgreSQL
sudo systemctl stop postgresql

# 2. Edit the service file
sudo nano /lib/systemd/system/postgresql.service
```

**Find this line:**
```
ExecStart=/bin/true
```

**Replace with:**
```
ExecStart=/bin/sh -c '/usr/lib/postgresql/16/bin/postgres -D /var/lib/postgresql/16/main -c config_file=/etc/postgresql/16/main/postgresql.conf'
```

**Save and exit:** Press `Ctrl+X`, then `Y`, then `Enter`

**Then reload and restart:**
```bash
sudo systemctl daemon-reload
sudo systemctl start postgresql
sudo systemctl status postgresql
```

---

## 📋 **COMPLETE FIX WORKFLOW**

Copy and paste this entire command block:

```bash
# 1. Stop the broken service
echo "=== Stopping postgresql service ===" && \
sudo systemctl stop postgresql && \
sleep 2 && \

# 2. Try to start postgresql-16 service
echo "=== Starting postgresql-16 service ===" && \
sudo systemctl start postgresql-16 && \
sleep 3 && \

# 3. Check status
echo "=== Checking postgresql-16 status ===" && \
sudo systemctl status postgresql-16 && \
echo "" && \

# 4. Reset user password
echo "=== Resetting user password ===" && \
sudo -u postgres psql -c "ALTER USER \"user\" WITH PASSWORD 'password';" && \
echo "" && \

# 5. Test connection
echo "=== Testing connection ===" && \
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1" && \
echo "" && \

# 6. Run Prisma migrations
echo "=== Running Prisma migrations ===" && \
cd /var/www/html/ecom/app && npx prisma migrate deploy
```

**Time:** ~5-10 minutes

---

## 🔧 **DETAILED STEPS**

### **Step 1: Stop PostgreSQL Service**

```bash
sudo systemctl stop postgresql
sleep 2
```

---

### **Step 2: Start PostgreSQL 16 Service**

```bash
sudo systemctl start postgresql-16
sleep 3
```

**Verify:**
```bash
sudo systemctl status postgresql-16
```

**Expected Output:**
```
● postgresql-16.service - PostgreSQL 16 database server
   Loaded: loaded
   Active: active (running)
```

---

### **Step 3: Reset User Password**

```bash
sudo -u postgres psql -c "ALTER USER \"user\" WITH PASSWORD 'password';"
```

**Expected Output:**
```
ALTER ROLE
```

---

### **Step 4: Test Connection**

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

---

### **Step 5: Run Prisma Migrations**

```bash
cd /var/www/html/ecom/app && npx prisma migrate deploy
```

**Expected Output:**
```
Prisma schema loaded from prisma/schema.prisma
All migrations have been applied successfully.
```

---

## 📞 **TROUBLESHOOTING**

### **Issue: postgresql-16 service not found**

**Solution:** Check available PostgreSQL services:
```bash
sudo systemctl list-unit-files | grep postgresql
```

**Then start the correct one:**
```bash
sudo systemctl start postgresql-16
```

---

### **Issue: Still shows "active (exited)"**

**Solution:** Check PostgreSQL logs:
```bash
sudo tail -50 /var/log/postgresql/postgresql-16-main.log
```

Or check systemd journal:
```bash
sudo journalctl -u postgresql-16 -n 50
```

---

### **Issue: Connection still fails**

**Solution:** Verify PostgreSQL is actually running:
```bash
ps aux | grep postgres
```

Should show multiple postgres processes running.

---

## ✅ **VERIFICATION CHECKLIST**

- [ ] PostgreSQL service stopped
- [ ] PostgreSQL-16 service started
- [ ] PostgreSQL-16 service running (not exited)
- [ ] PostgreSQL processes running
- [ ] User password reset
- [ ] Connection test successful
- [ ] Prisma migrations applied

---

## 🎯 **IMMEDIATE ACTION**

### **Run This Command Now:**

```bash
sudo systemctl stop postgresql && \
sleep 2 && \
sudo systemctl start postgresql-16 && \
sleep 3 && \
sudo systemctl status postgresql-16
```

---

## 📊 **POSTGRESQL SERVICES**

### **Check Available Services**

```bash
sudo systemctl list-unit-files | grep postgresql
```

**Expected Output:**
```
postgresql.service                          enabled
postgresql-16.service                       enabled
```

---

### **Service Management**

```bash
# Start PostgreSQL 16
sudo systemctl start postgresql-16

# Stop PostgreSQL 16
sudo systemctl stop postgresql-16

# Restart PostgreSQL 16
sudo systemctl restart postgresql-16

# Check status
sudo systemctl status postgresql-16
```

---

## 🚀 **NEXT STEPS**

After PostgreSQL is fixed:

1. ✓ PostgreSQL-16 service running
2. ✓ User password reset
3. ✓ Connection test successful
4. ✓ Run Prisma migrations
5. ⏳ Deploy application

---

**Last Updated:** November 4, 2025  
**Version:** 1.0

---

**Next Command:**
```bash
sudo systemctl stop postgresql && sleep 2 && sudo systemctl start postgresql-16 && sleep 3 && sudo systemctl status postgresql-16
```

