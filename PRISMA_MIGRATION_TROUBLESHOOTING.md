# Prisma Migration Troubleshooting

**Date:** November 4, 2025  
**Status:** 🔧 TROUBLESHOOTING PRISMA MIGRATION ISSUES  
**Version:** 1.0

---

## ⚠️ **ISSUES IDENTIFIED**

### **Issue 1: DATABASE_URL Not Found**
```
Error: Environment variable not found: DATABASE_URL
```

**Cause:** Prisma is not reading the `.env.production` file

**Solution:** Prisma needs the `.env.local` file in the app directory

---

### **Issue 2: PostgreSQL Connection Refused**
```
psql: error: connection to server at "localhost" (::1), port 5432 failed
Is the server running on that host and accepting TCP/IP connections?
```

**Cause:** PostgreSQL server is not running

**Solution:** Start PostgreSQL service

---

## 🚀 **SOLUTION: 2-STEP FIX**

### **Step 1: Copy .env.production to .env.local**

Prisma reads from `.env.local` by default, not `.env.production`

```bash
cp /var/www/html/ecom/app/.env.production /var/www/html/ecom/app/.env.local
```

**Verify:**
```bash
cat /var/www/html/ecom/app/.env.local | grep DATABASE_URL
```

---

### **Step 2: Start PostgreSQL Service**

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

## 📋 **COMPLETE FIX WORKFLOW**

Copy and paste this entire block:

```bash
# 1. Copy environment file
cp /var/www/html/ecom/app/.env.production /var/www/html/ecom/app/.env.local

# 2. Verify environment file
cat /var/www/html/ecom/app/.env.local | grep DATABASE_URL

# 3. Start PostgreSQL
sudo service postgresql start

# 4. Verify PostgreSQL is running
sudo service postgresql status

# 5. Test database connection
psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1"

# 6. Run Prisma migrations
cd /var/www/html/ecom/app && npx prisma migrate deploy
```

---

## 🔧 **DETAILED STEPS**

### **Step 1: Copy Environment File**

```bash
cp /var/www/html/ecom/app/.env.production /var/www/html/ecom/app/.env.local
```

**Why:** Prisma looks for `.env.local` by default, not `.env.production`

**Verify:**
```bash
ls -la /var/www/html/ecom/app/.env*
```

**Expected Output:**
```
-rw-r--r-- .env.local
-rw-r--r-- .env.production
```

---

### **Step 2: Start PostgreSQL Service**

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

### **Step 3: Test Database Connection**

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

### **Step 4: Run Prisma Migrations**

```bash
cd /var/www/html/ecom/app && npx prisma migrate deploy
```

**Expected Output:**
```
Prisma schema loaded from prisma/schema.prisma
All migrations have been applied successfully.
```

---

## ⚠️ **IMPORTANT NOTES**

### **Environment File Priority**

Prisma reads environment files in this order:
1. `.env.local` (highest priority)
2. `.env` (default)
3. `.env.production` (NOT read by default)

**Solution:** Copy `.env.production` to `.env.local`

---

### **PostgreSQL Service**

PostgreSQL must be running for migrations to work

**Start Service:**
```bash
sudo service postgresql start
```

**Stop Service:**
```bash
sudo service postgresql stop
```

**Restart Service:**
```bash
sudo service postgresql restart
```

**Check Status:**
```bash
sudo service postgresql status
```

---

## 📞 **TROUBLESHOOTING**

### **Issue: "DATABASE_URL not found" still appears**

**Solution:** Verify `.env.local` exists and has correct content:
```bash
cat /var/www/html/ecom/app/.env.local
```

Should show:
```
DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce"
```

---

### **Issue: "Connection refused" error**

**Solution:** Start PostgreSQL:
```bash
sudo service postgresql start
sudo service postgresql status
```

---

### **Issue: "Authentication failed" error**

**Solution:** Verify database credentials in `.env.local`:
```bash
cat /var/www/html/ecom/app/.env.local | grep DATABASE_URL
```

Update if needed:
```bash
nano /var/www/html/ecom/app/.env.local
```

---

### **Issue: "Database does not exist" error**

**Solution:** Create database:
```bash
sudo -u postgres createdb philippines_ecommerce
```

---

## ✅ **VERIFICATION CHECKLIST**

- [ ] `.env.local` file exists
- [ ] `.env.local` contains DATABASE_URL
- [ ] PostgreSQL service is running
- [ ] Database connection works
- [ ] Prisma migrations complete

---

## 🎯 **IMMEDIATE ACTION**

### **Run This Command Now:**

```bash
cp /var/www/html/ecom/app/.env.production /var/www/html/ecom/app/.env.local && \
sudo service postgresql start && \
sudo service postgresql status
```

---

## 📊 **NEXT STEPS**

### **After Fix:**

1. **Verify environment file:**
   ```bash
   cat /var/www/html/ecom/app/.env.local | grep DATABASE_URL
   ```

2. **Test database connection:**
   ```bash
   psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1"
   ```

3. **Run migrations:**
   ```bash
   cd /var/www/html/ecom/app && npx prisma migrate deploy
   ```

4. **Deploy:**
   ```bash
   /var/www/html/ecom/scripts/deploy.sh
   ```

---

## 📚 **RELATED DOCUMENTATION**

| Document | Purpose |
|----------|---------|
| **NPM_INSTALL_COMPLETE.md** | npm install summary |
| **DEPLOYMENT_GUIDE.md** | Deployment procedures |
| **TROUBLESHOOTING_COMMANDS.md** | General troubleshooting |

---

**Last Updated:** November 4, 2025  
**Version:** 1.0

---

**Next Command:**
```bash
cp /var/www/html/ecom/app/.env.production /var/www/html/ecom/app/.env.local
```

