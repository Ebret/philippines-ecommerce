# 🔧 Fix Database Connection Pooling Issue

**Issue:** `Cannot fetch data from service: fetch failed` during login

**Root Cause:** Database connection pool exhaustion or connection timeout

---

## ✅ SOLUTION

### Step 1: Update DATABASE_URL with Connection Pooling

On VPS, update `.env.production`:

```bash
# Old (without pooling):
DATABASE_URL=postgresql://postgres:password@localhost:5432/philippines_ecommerce

# New (with connection pooling):
DATABASE_URL=postgresql://postgres:password@localhost:5432/philippines_ecommerce?schema=public&connection_limit=5&pool_timeout=10
```

### Step 2: Verify Connection String

```bash
ssh root@109.205.181.119
cd /var/www/html/ecom/app
cat .env.production | grep DATABASE_URL
```

### Step 3: Restart Application

```bash
pm2 restart ecosystem.config.js
sleep 10
pm2 status
```

### Step 4: Test Connection

```bash
# Test database directly
psql postgresql://postgres:password@localhost:5432/philippines_ecommerce -c "SELECT 1;"

# Test application
curl -s https://extremelifeherbal.com/auth/login | grep -i "sign in"
```

---

## 📊 Connection Pooling Parameters

| Parameter | Value | Purpose |
|-----------|-------|---------|
| connection_limit | 5 | Max connections per pool |
| pool_timeout | 10 | Timeout in seconds |
| schema | public | Default schema |

---

## 🔍 Troubleshooting

If still failing:

```bash
# Check PostgreSQL is running
systemctl status postgresql

# Check database exists
psql -U postgres -l | grep philippines

# Check user table
psql postgresql://postgres:password@localhost:5432/philippines_ecommerce -c "SELECT COUNT(*) FROM \"User\";"

# Check PM2 logs
pm2 logs philippines-ecommerce --lines 100
```

---

**Status:** Ready for implementation ✅

