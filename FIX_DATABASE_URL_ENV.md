# Fix DATABASE_URL Environment Variable

**Date:** November 10, 2025  
**Status:** 🔧 FIXING DATABASE_URL  
**Version:** 1.0

---

## 🔴 **ISSUE IDENTIFIED**

Prisma can't find the `DATABASE_URL` environment variable:

```
Error: Prisma schema validation - (get-config wasm)
Error code: P1012
error: Environment variable not found: DATABASE_URL.
```

**Problem:** The `.env.local` file doesn't have the `DATABASE_URL` variable set.

---

## 🚀 **SOLUTION: Create/Update .env.local File**

### **Complete Fix Workflow**

Copy and paste this entire command block:

```bash
# 1. Check if .env.local exists
echo "=== Checking .env.local ===" && \
ls -la /var/www/html/ecom/app/.env.local 2>&1 || echo "File does not exist" && \
echo "" && \

# 2. Create/Update .env.local with DATABASE_URL
echo "=== Creating/Updating .env.local ===" && \
sudo tee /var/www/html/ecom/app/.env.local > /dev/null << 'EOF'
DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce"
EOF
echo "" && \

# 3. Verify .env.local
echo "=== Verifying .env.local ===" && \
cat /var/www/html/ecom/app/.env.local && \
echo "" && \

# 4. Test connection
echo "=== Testing connection ===" && \
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1" && \
echo "" && \

# 5. Run Prisma migrations
echo "=== Running Prisma migrations ===" && \
cd /var/www/html/ecom/app && npx prisma migrate deploy
```

**Time:** ~5-10 minutes

---

## 🔧 **DETAILED STEPS**

### **Step 1: Check if .env.local Exists** (1-2 seconds)

```bash
ls -la /var/www/html/ecom/app/.env.local
```

---

### **Step 2: Create/Update .env.local** (5-10 seconds)

```bash
sudo tee /var/www/html/ecom/app/.env.local > /dev/null << 'EOF'
DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce"
EOF
```

---

### **Step 3: Verify .env.local** (1-2 seconds)

```bash
cat /var/www/html/ecom/app/.env.local
```

**Expected Output:**
```
DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce"
```

---

### **Step 4: Test Connection** (1-2 seconds)

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

### **Step 5: Run Prisma Migrations** (2-5 minutes)

```bash
cd /var/www/html/ecom/app && npx prisma migrate deploy
```

**Expected Output:**
```
Prisma schema loaded from prisma/schema.prisma
All migrations have been applied successfully.
```

---

## 📋 **ENVIRONMENT VARIABLE FORMAT**

### **DATABASE_URL Format**

```
postgresql://username:password@host:port/database_name
```

### **For This Setup**

```
postgresql://user:password@localhost:5432/philippines_ecommerce
```

### **Components**

- **username:** `user`
- **password:** `password`
- **host:** `localhost`
- **port:** `5432`
- **database:** `philippines_ecommerce`

---

## 📞 **TROUBLESHOOTING**

### **Issue: .env.local not found**

**Solution:** Create it:
```bash
sudo tee /var/www/html/ecom/app/.env.local > /dev/null << 'EOF'
DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce"
EOF
```

---

### **Issue: Permission denied**

**Solution:** Use sudo:
```bash
sudo tee /var/www/html/ecom/app/.env.local > /dev/null << 'EOF'
DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce"
EOF
```

---

### **Issue: Connection still fails**

**Solution:** Verify credentials:
```bash
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1"
```

---

### **Issue: Prisma still can't find DATABASE_URL**

**Solution:** Verify file exists and has content:
```bash
cat /var/www/html/ecom/app/.env.local
grep DATABASE_URL /var/www/html/ecom/app/.env.local
```

---

## ✅ **VERIFICATION CHECKLIST**

- [ ] .env.local file exists
- [ ] DATABASE_URL variable set
- [ ] DATABASE_URL has correct format
- [ ] Connection test successful
- [ ] Prisma migrations applied

---

## 🎯 **IMMEDIATE ACTION**

### **Run This Command Now:**

```bash
sudo tee /var/www/html/ecom/app/.env.local > /dev/null << 'EOF'
DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce"
EOF
```

Then verify:

```bash
cat /var/www/html/ecom/app/.env.local
```

Then test connection:

```bash
PGPASSWORD=password psql -h localhost -U user -d philippines_ecommerce -c "SELECT 1"
```

Then run migrations:

```bash
cd /var/www/html/ecom/app && npx prisma migrate deploy
```

---

## 📊 **ENVIRONMENT VARIABLES**

### **Required Variables**

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce"
```

### **Optional Variables**

```bash
NODE_ENV=production
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-domain.com
```

---

## 🚀 **NEXT STEPS**

After DATABASE_URL is set:

1. ✓ DATABASE_URL environment variable set
2. ✓ Connection test successful
3. ✓ Run Prisma migrations
4. ⏳ Deploy application

---

**Last Updated:** November 10, 2025  
**Version:** 1.0

---

**Next Command:**
```bash
sudo tee /var/www/html/ecom/app/.env.local > /dev/null << 'EOF'
DATABASE_URL="postgresql://user:password@localhost:5432/philippines_ecommerce"
EOF
```

