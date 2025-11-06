# PostgreSQL Complete Reinstall & Configuration

**Date:** November 4, 2025  
**Status:** 🔧 COMPLETE POSTGRESQL REINSTALL  
**Version:** 1.0

---

## 🔴 **ISSUE IDENTIFIED**

PostgreSQL is installed but:
- ✗ No proper service file (postgresql-16.service not found)
- ✗ Only template service exists (postgresql@.service)
- ✗ No PostgreSQL server processes running
- ✗ Service misconfigured with ExecStart=/bin/true

**Solution:** Complete reinstall and proper configuration

---

## 🚀 **COMPLETE FIX WORKFLOW**

Copy and paste this entire command block:

```bash
# 1. Remove broken PostgreSQL installation
echo "=== Removing broken PostgreSQL ===" && \
sudo apt remove -y postgresql postgresql-contrib && \
sudo apt autoremove -y && \
sleep 2 && \

# 2. Clean PostgreSQL data
echo "=== Cleaning PostgreSQL data ===" && \
sudo rm -rf /var/lib/postgresql/* && \
sudo rm -rf /etc/postgresql/* && \
sleep 1 && \

# 3. Update package manager
echo "=== Updating package manager ===" && \
sudo apt update && \
sleep 2 && \

# 4. Install PostgreSQL fresh
echo "=== Installing PostgreSQL ===" && \
sudo apt install -y postgresql postgresql-contrib && \
sleep 3 && \

# 5. Start PostgreSQL service
echo "=== Starting PostgreSQL ===" && \
sudo systemctl start postgresql && \
sleep 3 && \

# 6. Check status
echo "=== Checking PostgreSQL status ===" && \
sudo systemctl status postgresql && \
echo "" && \

# 7. Create database user
echo "=== Creating database user ===" && \
sudo -u postgres createuser -P user && \
echo "" && \

# 8. Create database
echo "=== Creating database ===" && \
sudo -u postgres createdb -O user philippines_ecommerce && \
echo "" && \

# 9. Test connection
echo "=== Testing connection ===" && \
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1" && \
echo "" && \

# 10. Run Prisma migrations
echo "=== Running Prisma migrations ===" && \
cd /var/www/html/ecom/app && npx prisma migrate deploy
```

**Time:** ~15-20 minutes

---

## 🔧 **DETAILED STEPS**

### **Step 1: Remove Broken Installation** (2-3 minutes)

```bash
sudo apt remove -y postgresql postgresql-contrib
sudo apt autoremove -y
sleep 2
```

---

### **Step 2: Clean PostgreSQL Data** (5-10 seconds)

```bash
sudo rm -rf /var/lib/postgresql/*
sudo rm -rf /etc/postgresql/*
sleep 1
```

---

### **Step 3: Update Package Manager** (1-2 minutes)

```bash
sudo apt update
sleep 2
```

---

### **Step 4: Install PostgreSQL Fresh** (3-5 minutes)

```bash
sudo apt install -y postgresql postgresql-contrib
sleep 3
```

**Expected Output:**
```
Setting up postgresql-16 ...
Setting up postgresql-contrib-16 ...
Processing triggers for postgresql-common ...
```

---

### **Step 5: Start PostgreSQL Service** (5-10 seconds)

```bash
sudo systemctl start postgresql
sleep 3
```

---

### **Step 6: Check Status** (1-2 seconds)

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

### **Step 7: Create Database User** (10-20 seconds)

```bash
sudo -u postgres createuser -P user
```

**When prompted:**
```
Enter password for new role: password
Enter it again: password
```

---

### **Step 8: Create Database** (5-10 seconds)

```bash
sudo -u postgres createdb -O user philippines_ecommerce
```

---

### **Step 9: Test Connection** (1-2 seconds)

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

### **Step 10: Run Prisma Migrations** (2-5 minutes)

```bash
cd /var/www/html/ecom/app && npx prisma migrate deploy
```

**Expected Output:**
```
Prisma schema loaded from prisma/schema.prisma
All migrations have been applied successfully.
```

---

## 📋 **QUICK REINSTALL (If Above Doesn't Work)**

```bash
# 1. Remove PostgreSQL
sudo apt remove -y postgresql postgresql-contrib
sudo apt autoremove -y

# 2. Clean data
sudo rm -rf /var/lib/postgresql/*
sudo rm -rf /etc/postgresql/*

# 3. Reinstall
sudo apt update
sudo apt install -y postgresql postgresql-contrib

# 4. Start service
sudo systemctl start postgresql
sudo systemctl status postgresql

# 5. Create user and database
sudo -u postgres createuser -P user
sudo -u postgres createdb -O user philippines_ecommerce

# 6. Test
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1"

# 7. Migrate
cd /var/www/html/ecom/app && npx prisma migrate deploy
```

---

## ✅ **VERIFICATION CHECKLIST**

- [ ] PostgreSQL removed
- [ ] PostgreSQL data cleaned
- [ ] PostgreSQL reinstalled
- [ ] PostgreSQL service running
- [ ] Database user created
- [ ] Database created
- [ ] Connection test successful
- [ ] Prisma migrations applied

---

## 📞 **TROUBLESHOOTING**

### **Issue: "Active: active (exited)" still appears**

**Solution:** Check if PostgreSQL processes are running:
```bash
ps aux | grep postgres
```

Should show multiple postgres processes like:
```
postgres   1234  0.0  0.5 ...
postgres   1235  0.0  0.3 ...
```

If not, restart:
```bash
sudo systemctl restart postgresql
sudo systemctl status postgresql
```

---

### **Issue: Connection fails after reinstall**

**Solution:** Verify user and database exist:
```bash
sudo -u postgres psql -c "\du"
sudo -u postgres psql -c "\l"
```

---

### **Issue: Migrations still fail**

**Solution:** Test connection manually:
```bash
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1"
```

---

## 🎯 **IMMEDIATE ACTION**

### **Run This Command Now:**

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
```

---

### **User Management**

```bash
# Create user
sudo -u postgres createuser -P user

# List users
sudo -u postgres psql -c "\du"

# Reset password
sudo -u postgres psql -c "ALTER USER \"user\" WITH PASSWORD 'password';"
```

---

### **Database Management**

```bash
# Create database
sudo -u postgres createdb -O user philippines_ecommerce

# List databases
sudo -u postgres psql -c "\l"

# Drop database
sudo -u postgres psql -c "DROP DATABASE philippines_ecommerce;"
```

---

## 🚀 **NEXT STEPS**

After PostgreSQL is reinstalled:

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
sudo apt remove -y postgresql postgresql-contrib && sudo apt autoremove -y
```

