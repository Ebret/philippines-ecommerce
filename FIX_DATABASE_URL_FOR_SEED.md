# 🔧 FIX: DATABASE_URL Missing for Seed Script

**Issue:** `npx prisma db seed` fails with "Environment variable not found: DATABASE_URL"

**Status:** ⚠️ REQUIRES ACTION

---

## 🚨 ROOT CAUSE

The `.env.production` file on the VPS is missing the `DATABASE_URL` environment variable. Prisma needs this to connect to the PostgreSQL database.

---

## ✅ SOLUTION

### Step 1: Find Your Database Connection String

First, find your PostgreSQL connection details:

```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Get PostgreSQL connection info
sudo -u postgres psql -c "SELECT version();"

# Check database name
sudo -u postgres psql -l | grep ecommerce
```

### Step 2: Create DATABASE_URL

The format should be:
```
postgresql://username:password@localhost:5432/database_name
```

Example:
```
postgresql://postgres:your_password@localhost:5432/philippines_ecommerce
```

### Step 3: Add to .env.production

```bash
# SSH into VPS
ssh root@109.205.181.119

# Navigate to app directory
cd /var/www/html/ecom/app

# Add DATABASE_URL to .env.production
echo "DATABASE_URL=postgresql://postgres:your_password@localhost:5432/philippines_ecommerce" >> .env.production

# Verify it was added
grep DATABASE_URL .env.production
```

### Step 4: Update ecosystem.config.js (Alternative)

If you prefer to set it in PM2 config:

```javascript
env: {
  NODE_ENV: 'production',
  DATABASE_URL: 'postgresql://postgres:your_password@localhost:5432/philippines_ecommerce',
  NEXTAUTH_SECRET: '...',
  // ... other vars
}
```

Then restart PM2:
```bash
pm2 restart ecosystem.config.js
```

### Step 5: Run Seed Script

```bash
# Now run the seed script
npx prisma db seed

# Or use the comprehensive seed script
npx ts-node prisma/seed-comprehensive-test-accounts.ts
```

---

## 🔍 VERIFY DATABASE CONNECTION

```bash
# Test PostgreSQL connection
psql postgresql://postgres:password@localhost:5432/philippines_ecommerce -c "SELECT COUNT(*) FROM \"User\";"

# Check if users table exists
psql postgresql://postgres:password@localhost:5432/philippines_ecommerce -c "\dt"
```

---

## 📋 TROUBLESHOOTING

### Error: "Connection refused"
- PostgreSQL is not running
- Fix: `sudo systemctl start postgresql`

### Error: "password authentication failed"
- Wrong password
- Fix: Reset PostgreSQL password or check .env.production

### Error: "database does not exist"
- Database not created
- Fix: Create database first: `createdb philippines_ecommerce`

---

## 🎯 NEXT STEPS

1. Add DATABASE_URL to .env.production
2. Restart PM2: `pm2 restart ecosystem.config.js`
3. Run seed script: `npx prisma db seed`
4. Verify accounts created: `npx prisma studio`

---

**Status:** Ready to implement

