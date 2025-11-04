# PostgreSQL Installation & Configuration Guide

**Date:** November 4, 2025  
**Status:** 🔧 INSTALLING POSTGRESQL  
**Version:** 1.0

---

## ⚠️ **ISSUE IDENTIFIED**

PostgreSQL is not installed on the system.

**Error:**
```
Failed to start postgresql.service: Unit postgresql.service not found.
```

**Solution:** Install PostgreSQL server

---

## 🚀 **INSTALLATION STEPS**

### **Step 1: Update Package Manager** (1-2 minutes)

```bash
sudo apt update
```

---

### **Step 2: Install PostgreSQL** (3-5 minutes)

```bash
sudo apt install -y postgresql postgresql-contrib
```

**What it installs:**
- PostgreSQL server
- PostgreSQL client
- PostgreSQL contrib packages

---

### **Step 3: Start PostgreSQL Service** (5-10 seconds)

```bash
sudo service postgresql start
```

**Verify:**
```bash
sudo service postgresql status
```

**Expected Output:**
```
● postgresql.service - PostgreSQL RDBMS
   Loaded: loaded
   Active: active (running)
```

---

### **Step 4: Create Database User** (10-20 seconds)

```bash
sudo -u postgres createuser -P user
```

**When prompted:**
- Enter password: `password` (or your preferred password)
- Confirm password: `password`

---

### **Step 5: Create Database** (5-10 seconds)

```bash
sudo -u postgres createdb -O user philippines_ecommerce
```

**What it does:**
- Creates database named `philippines_ecommerce`
- Sets owner to `user`

---

### **Step 6: Test Connection** (1-2 seconds)

```bash
psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1"
```

**Expected Output:**
```
 ?column?
----------
        1
(1 row)
```

---

## 📋 **COMPLETE INSTALLATION COMMAND**

Copy and paste this entire block:

```bash
# 1. Update package manager
sudo apt update

# 2. Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# 3. Start service
sudo service postgresql start

# 4. Create user
sudo -u postgres createuser -P user

# 5. Create database
sudo -u postgres createdb -O user philippines_ecommerce

# 6. Test connection
psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1"

# 7. Run Prisma migrations
cd /var/www/html/ecom/app && npx prisma migrate deploy
```

---

## 🔧 **DETAILED STEPS**

### **Step 1: Update Package Manager**

```bash
sudo apt update
```

**Expected Output:**
```
Get:1 http://... (various package sources)
Reading package lists... Done
```

---

### **Step 2: Install PostgreSQL**

```bash
sudo apt install -y postgresql postgresql-contrib
```

**Expected Output:**
```
Setting up postgresql-16 ...
Setting up postgresql-contrib-16 ...
Processing triggers for postgresql-common ...
```

**Time:** 3-5 minutes

---

### **Step 3: Start PostgreSQL Service**

```bash
sudo service postgresql start
```

**Verify:**
```bash
sudo service postgresql status
```

**Expected Output:**
```
● postgresql.service - PostgreSQL RDBMS
   Loaded: loaded (/lib/systemd/system/postgresql.service; enabled; vendor preset: enabled)
   Active: active (running) since ...
```

---

### **Step 4: Create Database User**

```bash
sudo -u postgres createuser -P user
```

**When prompted:**
```
Enter password for new role: password
Enter it again: password
```

---

### **Step 5: Create Database**

```bash
sudo -u postgres createdb -O user philippines_ecommerce
```

**Expected Output:**
```
(no output - database created)
```

---

### **Step 6: Test Connection**

```bash
psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1"
```

**Expected Output:**
```
 ?column?
----------
        1
(1 row)
```

---

### **Step 7: Run Prisma Migrations**

```bash
cd /var/www/html/ecom/app && npx prisma migrate deploy
```

**Expected Output:**
```
Prisma schema loaded from prisma/schema.prisma
All migrations have been applied successfully.
```

---

## ✅ **VERIFICATION CHECKLIST**

- [ ] PostgreSQL installed
- [ ] PostgreSQL service running
- [ ] Database user created
- [ ] Database created
- [ ] Connection test successful
- [ ] Prisma migrations applied

---

## 📞 **TROUBLESHOOTING**

### **Issue: "postgresql.service not found"**

**Solution:** Install PostgreSQL:
```bash
sudo apt install -y postgresql postgresql-contrib
```

---

### **Issue: "Connection refused"**

**Solution:** Start PostgreSQL:
```bash
sudo service postgresql start
sudo service postgresql status
```

---

### **Issue: "Password authentication failed"**

**Solution:** Recreate user with correct password:
```bash
sudo -u postgres dropuser user
sudo -u postgres createuser -P user
```

---

### **Issue: "Database does not exist"**

**Solution:** Create database:
```bash
sudo -u postgres createdb -O user philippines_ecommerce
```

---

## 🎯 **IMMEDIATE ACTION**

### **Run This Command Now:**

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

## 📊 **POSTGRESQL COMMANDS**

### **Service Management**

```bash
# Start service
sudo service postgresql start

# Stop service
sudo service postgresql stop

# Restart service
sudo service postgresql restart

# Check status
sudo service postgresql status
```

---

### **User Management**

```bash
# Create user
sudo -u postgres createuser -P username

# Drop user
sudo -u postgres dropuser username

# List users
sudo -u postgres psql -c "\du"
```

---

### **Database Management**

```bash
# Create database
sudo -u postgres createdb -O username database_name

# Drop database
sudo -u postgres dropdb database_name

# List databases
sudo -u postgres psql -c "\l"
```

---

### **Connection Testing**

```bash
# Test connection
psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1"

# Connect to database
psql -h localhost -U user -d philippines_ecommerce
```

---

## 📍 **CONFIGURATION**

### **Database Credentials**

```
Host: localhost
Port: 5432
Username: user
Password: password
Database: philippines_ecommerce
```

**Update in `.env.local`:**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce"
```

---

## 🚀 **NEXT STEPS**

After PostgreSQL is installed and running:

1. ✓ Create database user
2. ✓ Create database
3. ✓ Test connection
4. ✓ Run Prisma migrations
5. ⏳ Deploy application

---

## 📚 **RELATED DOCUMENTATION**

| Document | Purpose |
|----------|---------|
| **PRISMA_MIGRATION_TROUBLESHOOTING.md** | Prisma troubleshooting |
| **QUICK_FIX_PRISMA_POSTGRESQL.md** | Quick fix guide |

---

**Last Updated:** November 4, 2025  
**Version:** 1.0

---

**Next Command:**
```bash
sudo apt update && sudo apt install -y postgresql postgresql-contrib
```

