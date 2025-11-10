# PostgreSQL Data Corruption Fix

**Date:** November 10, 2025  
**Status:** 🔧 FIXING POSTGRESQL DATA CORRUPTION  
**Version:** 1.0

---

## 🔴 **CRITICAL ISSUE IDENTIFIED**

PostgreSQL data directory is corrupted:

```
ERROR:  could not open file "global/1262": No such file or directory
LOG:  could not open file "postmaster.pid": No such file or directory
LOG:  performing immediate shutdown because data directory lock file is invalid
```

**Problem:** PostgreSQL database files are missing or corrupted. The data directory needs to be reinitalized.

---

## 🚀 **SOLUTION: Reinitialize PostgreSQL Data Directory**

### **Complete Fix Workflow**

Copy and paste this entire command block:

```bash
# 1. Stop PostgreSQL
echo "=== Stopping PostgreSQL ===" && \
sudo systemctl stop postgresql && \
sleep 2 && \

# 2. Backup corrupted data
echo "=== Backing up corrupted data ===" && \
sudo mv /var/lib/postgresql/16/main /var/lib/postgresql/16/main.backup && \
sleep 1 && \

# 3. Create new data directory
echo "=== Creating new data directory ===" && \
sudo mkdir -p /var/lib/postgresql/16/main && \
sudo chown postgres:postgres /var/lib/postgresql/16/main && \
sudo chmod 700 /var/lib/postgresql/16/main && \
sleep 1 && \

# 4. Initialize database cluster
echo "=== Initializing database cluster ===" && \
sudo -u postgres /usr/lib/postgresql/16/bin/initdb -D /var/lib/postgresql/16/main && \
sleep 2 && \

# 5. Start PostgreSQL
echo "=== Starting PostgreSQL ===" && \
sudo systemctl start postgresql && \
sleep 3 && \

# 6. Verify status
echo "=== Verifying PostgreSQL status ===" && \
sudo systemctl status postgresql && \
echo "" && \

# 7. Verify processes
echo "=== Verifying PostgreSQL processes ===" && \
ps aux | grep postgres && \
echo "" && \

# 8. Create user
echo "=== Creating database user ===" && \
sudo -u postgres createuser -P user && \
echo "" && \

# 9. Create database
echo "=== Creating database ===" && \
sudo -u postgres createdb -O user philippines_ecommerce && \
echo "" && \

# 10. Test connection
echo "=== Testing connection ===" && \
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1" && \
echo "" && \

# 11. Run Prisma migrations
echo "=== Running Prisma migrations ===" && \
cd /var/www/html/ecom/app && npx prisma migrate deploy
```

**Time:** ~10-15 minutes

---

## 🔧 **DETAILED STEPS**

### **Step 1: Stop PostgreSQL** (5-10 seconds)

```bash
sudo systemctl stop postgresql
sleep 2
```

---

### **Step 2: Backup Corrupted Data** (5-10 seconds)

```bash
sudo mv /var/lib/postgresql/16/main /var/lib/postgresql/16/main.backup
sleep 1
```

---

### **Step 3: Create New Data Directory** (5-10 seconds)

```bash
sudo mkdir -p /var/lib/postgresql/16/main
sudo chown postgres:postgres /var/lib/postgresql/16/main
sudo chmod 700 /var/lib/postgresql/16/main
sleep 1
```

---

### **Step 4: Initialize Database Cluster** (10-20 seconds)

```bash
sudo -u postgres /usr/lib/postgresql/16/bin/initdb -D /var/lib/postgresql/16/main
sleep 2
```

**Expected Output:**
```
The files belonging to this database system will be owned by user "postgres".
This user must also own the server process.

The database cluster will be initialized with locale "en_US.UTF-8".
The default database encoding has accordingly been set to "UTF8".
...
Success. You can now start the database server using:

    /usr/lib/postgresql/16/bin/pg_ctl -D /var/lib/postgresql/16/main -l logfile start
```

---

### **Step 5: Start PostgreSQL** (5-10 seconds)

```bash
sudo systemctl start postgresql
sleep 3
```

---

### **Step 6: Verify Status** (1-2 seconds)

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

### **Step 7: Verify Processes** (1-2 seconds)

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

### **Step 8: Create Database User** (10-20 seconds)

```bash
sudo -u postgres createuser -P user
```

**When prompted:**
```
Enter password for new role: password
Enter it again: password
```

---

### **Step 9: Create Database** (5-10 seconds)

```bash
sudo -u postgres createdb -O user philippines_ecommerce
```

---

### **Step 10: Test Connection** (1-2 seconds)

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

### **Step 11: Run Prisma Migrations** (2-5 minutes)

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

### **Issue: initdb fails**

**Solution:** Check permissions:
```bash
ls -la /var/lib/postgresql/16/
sudo chown postgres:postgres /var/lib/postgresql/16/main
sudo chmod 700 /var/lib/postgresql/16/main
```

---

### **Issue: PostgreSQL still won't start**

**Solution:** Check logs:
```bash
sudo tail -50 /var/log/postgresql/postgresql-16-main.log
```

---

### **Issue: Connection fails after initialization**

**Solution:** Verify user and database:
```bash
sudo -u postgres psql -c "\du"
sudo -u postgres psql -c "\l"
```

---

## ✅ **VERIFICATION CHECKLIST**

- [ ] PostgreSQL stopped
- [ ] Corrupted data backed up
- [ ] New data directory created
- [ ] Database cluster initialized
- [ ] PostgreSQL service started
- [ ] PostgreSQL service running
- [ ] PostgreSQL processes running
- [ ] Database user created
- [ ] Database created
- [ ] Connection test successful
- [ ] Prisma migrations applied

---

## 🎯 **IMMEDIATE ACTION**

### **Run This Command Now:**

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

---

## 📊 **POSTGRESQL COMMANDS**

### **Service Management**

```bash
# Stop service
sudo systemctl stop postgresql

# Start service
sudo systemctl start postgresql

# Restart service
sudo systemctl restart postgresql

# Check status
sudo systemctl status postgresql
```

---

### **Data Directory Management**

```bash
# Check data directory
ls -la /var/lib/postgresql/16/main/

# Check permissions
stat /var/lib/postgresql/16/main/

# Fix permissions
sudo chown postgres:postgres /var/lib/postgresql/16/main
sudo chmod 700 /var/lib/postgresql/16/main
```

---

### **Database Initialization**

```bash
# Initialize database cluster
sudo -u postgres /usr/lib/postgresql/16/bin/initdb -D /var/lib/postgresql/16/main

# Check initialization
ls -la /var/lib/postgresql/16/main/
```

---

## 🚀 **NEXT STEPS**

After PostgreSQL is reinitialized:

1. ✓ PostgreSQL service running
2. ✓ Database cluster initialized
3. ✓ Database user created
4. ✓ Database created
5. ✓ Connection test successful
6. ✓ Run Prisma migrations
7. ⏳ Deploy application

---

**Last Updated:** November 10, 2025  
**Version:** 1.0

---

**Next Command:**
```bash
sudo systemctl stop postgresql && sleep 2 && sudo mv /var/lib/postgresql/16/main /var/lib/postgresql/16/main.backup
```

