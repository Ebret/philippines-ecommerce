# PostgreSQL Server Not Running - Fix

**Date:** November 4, 2025  
**Status:** 🔧 FIXING POSTGRESQL SERVER  
**Version:** 1.0

---

## 🔴 **ISSUE IDENTIFIED**

PostgreSQL server is not running:

```
error: connection to server on socket "/var/run/postgresql/.s.PGSQL.5432" failed: No such file or directory
Is the server running locally and accepting connections on that socket?
```

**Problem:** PostgreSQL service is installed but the server process is not running

---

## 🚀 **SOLUTION: Start PostgreSQL Server**

### **Step 1: Check PostgreSQL Status**

```bash
sudo systemctl status postgresql
```

---

### **Step 2: Start PostgreSQL Server**

```bash
sudo systemctl start postgresql
```

---

### **Step 3: Verify Server is Running**

```bash
sudo systemctl status postgresql
```

**Expected Output:**
```
● postgresql.service - PostgreSQL RDBMS
   Loaded: loaded
   Active: active (running)
```

---

### **Step 4: Verify PostgreSQL Processes**

```bash
ps aux | grep postgres
```

**Expected Output:**
```
postgres   1234  0.0  0.5 ...
postgres   1235  0.0  0.3 ...
postgres   1236  0.0  0.2 ...
```

---

## 📋 **COMPLETE FIX WORKFLOW**

Copy and paste this entire command block:

```bash
# 1. Check status
echo "=== Checking PostgreSQL status ===" && \
sudo systemctl status postgresql && \
echo "" && \

# 2. Start PostgreSQL
echo "=== Starting PostgreSQL ===" && \
sudo systemctl start postgresql && \
sleep 3 && \

# 3. Verify status
echo "=== Verifying PostgreSQL status ===" && \
sudo systemctl status postgresql && \
echo "" && \

# 4. Verify processes
echo "=== Verifying PostgreSQL processes ===" && \
ps aux | grep postgres && \
echo "" && \

# 5. Create user
echo "=== Creating database user ===" && \
sudo -u postgres createuser -P user && \
echo "" && \

# 6. Create database
echo "=== Creating database ===" && \
sudo -u postgres createdb -O user philippines_ecommerce && \
echo "" && \

# 7. Test connection
echo "=== Testing connection ===" && \
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1" && \
echo "" && \

# 8. Run Prisma migrations
echo "=== Running Prisma migrations ===" && \
cd /var/www/html/ecom/app && npx prisma migrate deploy
```

**Time:** ~5-10 minutes

---

## 🔧 **DETAILED STEPS**

### **Step 1: Check Current Status**

```bash
sudo systemctl status postgresql
```

---

### **Step 2: Start PostgreSQL Server**

```bash
sudo systemctl start postgresql
sleep 3
```

---

### **Step 3: Verify Server Running**

```bash
sudo systemctl status postgresql
```

**Expected Output:**
```
● postgresql.service - PostgreSQL RDBMS
   Loaded: loaded (/lib/systemd/system/postgresql.service; enabled; preset: enabled)
   Active: active (running) since ...
```

---

### **Step 4: Verify Processes Running**

```bash
ps aux | grep postgres
```

**Expected Output:**
```
postgres   1234  0.0  0.5 ... /usr/lib/postgresql/16/bin/postgres
postgres   1235  0.0  0.3 ... postgres: 16/main: checkpointer
postgres   1236  0.0  0.2 ... postgres: 16/main: background writer
```

---

### **Step 5: Create Database User**

```bash
sudo -u postgres createuser -P user
```

**When prompted:**
```
Enter password for new role: password
Enter it again: password
```

---

### **Step 6: Create Database**

```bash
sudo -u postgres createdb -O user philippines_ecommerce
```

---

### **Step 7: Test Connection**

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

### **Step 8: Run Prisma Migrations**

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

### **Issue: "Active: active (exited)" still appears**

**Solution:** Check PostgreSQL logs:
```bash
sudo tail -50 /var/log/postgresql/postgresql-16-main.log
```

Or check systemd journal:
```bash
sudo journalctl -u postgresql -n 50
```

---

### **Issue: PostgreSQL won't start**

**Solution:** Try restarting:
```bash
sudo systemctl restart postgresql
sudo systemctl status postgresql
```

---

### **Issue: Still no socket file**

**Solution:** Check if PostgreSQL data directory exists:
```bash
ls -la /var/lib/postgresql/16/main/
```

If not, reinitialize:
```bash
sudo -u postgres /usr/lib/postgresql/16/bin/initdb -D /var/lib/postgresql/16/main
sudo systemctl start postgresql
```

---

## ✅ **VERIFICATION CHECKLIST**

- [ ] PostgreSQL service status checked
- [ ] PostgreSQL service started
- [ ] PostgreSQL service running (not exited)
- [ ] PostgreSQL processes running
- [ ] Socket file exists
- [ ] Database user created
- [ ] Database created
- [ ] Connection test successful
- [ ] Prisma migrations applied

---

## 🎯 **IMMEDIATE ACTION**

### **Run This Command Now:**

```bash
sudo systemctl start postgresql && \
sleep 3 && \
sudo systemctl status postgresql && \
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

## 📊 **POSTGRESQL COMMANDS**

### **Service Management**

```bash
# Start service
sudo systemctl start postgresql

# Stop service
sudo systemctl stop postgresql

# Restart service
sudo systemctl restart postgresql

# Check status
sudo systemctl status postgresql

# Check logs
sudo tail -50 /var/log/postgresql/postgresql-16-main.log
```

---

### **Process Verification**

```bash
# Check running processes
ps aux | grep postgres

# Check socket file
ls -la /var/run/postgresql/

# Check data directory
ls -la /var/lib/postgresql/16/main/
```

---

## 🚀 **NEXT STEPS**

After PostgreSQL server is running:

1. ✓ PostgreSQL service running
2. ✓ Database user created
3. ✓ Database created
4. ✓ Connection test successful
5. ✓ Run Prisma migrations
6. ⏳ Deploy application

---

**Last Updated:** November 4, 2025  
**Version:** 1.0

---

**Next Command:**
```bash
sudo systemctl start postgresql && sleep 3 && sudo systemctl status postgresql
```

