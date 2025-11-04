# PostgreSQL Service Fix & Database Configuration

**Date:** November 4, 2025  
**Status:** 🔧 FIXING POSTGRESQL SERVICE & DATABASE  
**Version:** 1.0

---

## ⚠️ **ISSUES IDENTIFIED**

### **Issue 1: PostgreSQL Service Not Running**
```
Active: active (exited) since Tue 2025-11-04 07:16:19 CET
Process: 34309 ExecStart=/bin/true (code=exited, status=0/SUCCESS)
```

**Problem:** PostgreSQL server process is not running (only wrapper is running)

---

### **Issue 2: Database User Password Unknown**
```
createuser: error: creation of new role failed: ERROR:  role "user" already exists
psql: error: FATAL:  password authentication failed for user "user"
```

**Problem:** User "user" exists but password is unknown

---

### **Issue 3: DATABASE_URL Not Found**
```
Error: Environment variable not found: DATABASE_URL
```

**Problem:** Prisma can't read `.env.local` file

---

## 🚀 **COMPLETE FIX WORKFLOW**

Copy and paste this entire command block:

```bash
# 1. Check if .env.local exists and has DATABASE_URL
echo "=== Checking .env.local ===" && \
cat /var/www/html/ecom/app/.env.local | grep DATABASE_URL && \
echo "" && \

# 2. Stop PostgreSQL
echo "=== Stopping PostgreSQL ===" && \
sudo systemctl stop postgresql && \
sleep 2 && \

# 3. Start PostgreSQL properly
echo "=== Starting PostgreSQL ===" && \
sudo systemctl start postgresql && \
sleep 3 && \

# 4. Check PostgreSQL status
echo "=== PostgreSQL Status ===" && \
sudo systemctl status postgresql && \
echo "" && \

# 5. Reset user password
echo "=== Resetting user password ===" && \
sudo -u postgres psql -c "ALTER USER \"user\" WITH PASSWORD 'password';" && \
echo "" && \

# 6. Test connection
echo "=== Testing connection ===" && \
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1" && \
echo "" && \

# 7. Run Prisma migrations
echo "=== Running Prisma migrations ===" && \
cd /var/www/html/ecom/app && npx prisma migrate deploy
```

**Time:** ~5-10 minutes

---

## 🔧 **DETAILED STEPS**

### **Step 1: Verify .env.local**

```bash
cat /var/www/html/ecom/app/.env.local | grep DATABASE_URL
```

**Expected Output:**
```
DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce"
```

**If not found, create it:**
```bash
cp /var/www/html/ecom/app/.env.production /var/www/html/ecom/app/.env.local
```

---

### **Step 2: Stop PostgreSQL**

```bash
sudo systemctl stop postgresql
sleep 2
```

---

### **Step 3: Start PostgreSQL Properly**

```bash
sudo systemctl start postgresql
sleep 3
```

**Verify:**
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

### **Step 4: Reset User Password**

```bash
sudo -u postgres psql -c "ALTER USER \"user\" WITH PASSWORD 'password';"
```

**Expected Output:**
```
ALTER ROLE
```

---

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

---

### **Step 6: Run Prisma Migrations**

```bash
cd /var/www/html/ecom/app && npx prisma migrate deploy
```

**Expected Output:**
```
Prisma schema loaded from prisma/schema.prisma
All migrations have been applied successfully.
```

---

## 📋 **QUICK FIX (If Above Doesn't Work)**

### **Option A: Reset Everything**

```bash
# 1. Stop PostgreSQL
sudo systemctl stop postgresql

# 2. Drop existing user and database
sudo -u postgres psql -c "DROP DATABASE IF EXISTS philippines_ecommerce;"
sudo -u postgres psql -c "DROP USER IF EXISTS \"user\";"

# 3. Start PostgreSQL
sudo systemctl start postgresql
sleep 3

# 4. Create new user
sudo -u postgres createuser -P user

# 5. Create new database
sudo -u postgres createdb -O user philippines_ecommerce

# 6. Test connection
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1"

# 7. Run migrations
cd /var/www/html/ecom/app && npx prisma migrate deploy
```

---

### **Option B: Check PostgreSQL Logs**

```bash
# View PostgreSQL logs
sudo tail -50 /var/log/postgresql/postgresql-16-main.log

# Or check systemd journal
sudo journalctl -u postgresql -n 50
```

---

## 📞 **TROUBLESHOOTING**

### **Issue: PostgreSQL still shows "exited"**

**Solution:**
```bash
sudo systemctl restart postgresql
sudo systemctl status postgresql
```

### **Issue: "password authentication failed"**

**Solution:** Reset password:
```bash
sudo -u postgres psql -c "ALTER USER \"user\" WITH PASSWORD 'password';"
```

### **Issue: "database does not exist"**

**Solution:** Create database:
```bash
sudo -u postgres createdb -O user philippines_ecommerce
```

### **Issue: Prisma still can't find DATABASE_URL**

**Solution:** Verify .env.local:
```bash
cat /var/www/html/ecom/app/.env.local
```

Should contain:
```
DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce"
```

---

## ✅ **VERIFICATION CHECKLIST**

- [ ] .env.local exists with DATABASE_URL
- [ ] PostgreSQL service running (not exited)
- [ ] PostgreSQL server process running
- [ ] User "user" exists
- [ ] User password is "password"
- [ ] Database "philippines_ecommerce" exists
- [ ] Connection test successful
- [ ] Prisma migrations applied

---

## 🎯 **IMMEDIATE ACTION**

### **Run This Command Now:**

```bash
sudo systemctl stop postgresql && \
sleep 2 && \
sudo systemctl start postgresql && \
sleep 3 && \
sudo systemctl status postgresql
```

Then reset password:

```bash
sudo -u postgres psql -c "ALTER USER \"user\" WITH PASSWORD 'password';"
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
```

---

### **User Management**

```bash
# Reset user password
sudo -u postgres psql -c "ALTER USER \"user\" WITH PASSWORD 'password';"

# List users
sudo -u postgres psql -c "\du"

# Drop user
sudo -u postgres psql -c "DROP USER \"user\";"
```

---

### **Database Management**

```bash
# List databases
sudo -u postgres psql -c "\l"

# Drop database
sudo -u postgres psql -c "DROP DATABASE philippines_ecommerce;"

# Create database
sudo -u postgres createdb -O user philippines_ecommerce
```

---

## 🚀 **NEXT STEPS**

After PostgreSQL is fixed:

1. ✓ PostgreSQL service running
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
sudo systemctl stop postgresql && sleep 2 && sudo systemctl start postgresql && sleep 3 && sudo systemctl status postgresql
```

