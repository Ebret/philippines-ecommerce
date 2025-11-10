# Fix Prisma DATABASE_URL Issue

**Date:** November 10, 2025  
**Status:** 🔧 FIXING PRISMA DATABASE_URL  
**Version:** 1.0

---

## 🔴 **ISSUE IDENTIFIED**

Prisma can't find DATABASE_URL even though `.env.local` exists:

```
Error: Prisma schema validation - (get-config wasm)
Error code: P1012
error: Environment variable not found: DATABASE_URL.
```

**Problem:** Prisma needs the environment variable set in the shell environment when running `npx prisma` commands.

---

## 🚀 **SOLUTION: Export DATABASE_URL and Run Migrations**

### **Complete Fix Workflow**

Copy and paste this entire command block:

```bash
# 1. Navigate to app directory
cd /var/www/html/ecom/app && \
echo "=== Current directory ===" && \
pwd && \
echo "" && \

# 2. Verify .env.local exists
echo "=== Verifying .env.local ===" && \
cat .env.local && \
echo "" && \

# 3. Export DATABASE_URL to shell environment
echo "=== Exporting DATABASE_URL ===" && \
export DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce" && \
echo "DATABASE_URL=$DATABASE_URL" && \
echo "" && \

# 4. Verify environment variable is set
echo "=== Verifying environment variable ===" && \
echo "DATABASE_URL=$DATABASE_URL" && \
echo "" && \

# 5. Test connection
echo "=== Testing connection ===" && \
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1" && \
echo "" && \

# 6. Run Prisma migrations
echo "=== Running Prisma migrations ===" && \
npx prisma migrate deploy
```

**Time:** ~5-10 minutes

---

## 🔧 **DETAILED STEPS**

### **Step 1: Navigate to App Directory** (1-2 seconds)

```bash
cd /var/www/html/ecom/app
pwd
```

---

### **Step 2: Verify .env.local Exists** (1-2 seconds)

```bash
cat .env.local
```

**Expected Output:**
```
DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce"
```

---

### **Step 3: Export DATABASE_URL to Shell Environment** (1-2 seconds)

```bash
export DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce"
echo "DATABASE_URL=$DATABASE_URL"
```

**Expected Output:**
```
DATABASE_URL=postgresql://user:password@localhost:5432/philippines_ecommerce
```

---

### **Step 4: Verify Environment Variable** (1-2 seconds)

```bash
echo "DATABASE_URL=$DATABASE_URL"
```

**Expected Output:**
```
DATABASE_URL=postgresql://user:password@localhost:5432/philippines_ecommerce
```

---

### **Step 5: Test Connection** (1-2 seconds)

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

### **Step 6: Run Prisma Migrations** (2-5 minutes)

```bash
npx prisma migrate deploy
```

**Expected Output:**
```
Prisma schema loaded from prisma/schema.prisma
All migrations have been applied successfully.
```

---

## 📋 **WHY THIS WORKS**

### **The Problem**

Prisma reads environment variables in this order:

1. **Shell environment variables** (set with `export`)
2. **`.env.local` file** (in current directory)
3. **`.env` file** (in current directory)

When you run `npx prisma migrate deploy`, it needs to find `DATABASE_URL` in one of these places.

### **The Solution**

By exporting `DATABASE_URL` to the shell environment, Prisma will find it immediately when the command runs.

---

## 📞 **TROUBLESHOOTING**

### **Issue: Still can't find DATABASE_URL**

**Solution:** Make sure you're in the correct directory:
```bash
cd /var/www/html/ecom/app
pwd
```

---

### **Issue: Environment variable not set**

**Solution:** Export it again:
```bash
export DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce"
echo "DATABASE_URL=$DATABASE_URL"
```

---

### **Issue: Connection fails**

**Solution:** Verify credentials:
```bash
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1"
```

---

### **Issue: Migrations still fail**

**Solution:** Check Prisma schema:
```bash
cat prisma/schema.prisma | grep -A 5 "datasource db"
```

---

## ✅ **VERIFICATION CHECKLIST**

- [ ] In correct directory (/var/www/html/ecom/app)
- [ ] .env.local file exists
- [ ] DATABASE_URL exported to shell
- [ ] Environment variable verified
- [ ] Connection test successful
- [ ] Prisma migrations applied

---

## 🎯 **IMMEDIATE ACTION**

### **Run This Command Now:**

```bash
cd /var/www/html/ecom/app && \
export DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce" && \
echo "DATABASE_URL=$DATABASE_URL" && \
npx prisma migrate deploy
```

---

## 📊 **ENVIRONMENT VARIABLE PRIORITY**

Prisma reads environment variables in this order:

1. **Shell environment** (highest priority)
   ```bash
   export DATABASE_URL="..."
   ```

2. **`.env.local` file**
   ```
   DATABASE_URL="..."
   ```

3. **`.env` file**
   ```
   DATABASE_URL="..."
   ```

---

## 🚀 **NEXT STEPS**

After migrations are applied:

1. ✓ DATABASE_URL environment variable set
2. ✓ Connection test successful
3. ✓ Prisma migrations applied
4. ⏳ Deploy application

---

**Last Updated:** November 10, 2025  
**Version:** 1.0

---

**Next Command:**
```bash
cd /var/www/html/ecom/app && export DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce" && npx prisma migrate deploy
```

