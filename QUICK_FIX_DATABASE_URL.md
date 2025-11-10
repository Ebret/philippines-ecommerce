# Quick Fix DATABASE_URL

**Date:** November 10, 2025  
**Status:** 🔧 QUICK FIX  
**Version:** 1.0

---

## ⚡ **ONE-COMMAND FIX**

Copy and paste this entire command:

```bash
sudo tee /var/www/html/ecom/app/.env.local > /dev/null << 'EOF'
DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce"
EOF
cat /var/www/html/ecom/app/.env.local && \
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1" && \
cd /var/www/html/ecom/app && npx prisma migrate deploy
```

**Time:** ~5-10 minutes

---

## 📋 **WHAT THIS DOES**

1. ✓ Creates/updates .env.local file
2. ✓ Sets DATABASE_URL variable
3. ✓ Verifies file content
4. ✓ Tests database connection
5. ✓ Runs Prisma migrations

---

## 🚀 **STEP-BY-STEP**

### **Step 1: Create .env.local**
```bash
sudo tee /var/www/html/ecom/app/.env.local > /dev/null << 'EOF'
DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce"
EOF
```

### **Step 2: Verify File**
```bash
cat /var/www/html/ecom/app/.env.local
```

**Expected Output:**
```
DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce"
```

### **Step 3: Test Connection**
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

### **Step 4: Run Migrations**
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
sudo tee /var/www/html/ecom/app/.env.local > /dev/null << 'EOF'
DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce"
EOF
```

Then verify:

```bash
cat /var/www/html/ecom/app/.env.local
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

### **File not created:**
```bash
sudo tee /var/www/html/ecom/app/.env.local > /dev/null << 'EOF'
DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce"
EOF
```

### **Connection fails:**
```bash
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1"
```

### **Migrations fail:**
```bash
cat /var/www/html/ecom/app/.env.local
grep DATABASE_URL /var/www/html/ecom/app/.env.local
```

---

**For detailed guide:** See `FIX_DATABASE_URL_ENV.md`

**Last Updated:** November 10, 2025

