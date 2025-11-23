# 🔧 COMPLETE AUTHENTICATION FIX GUIDE

**Issue:** `Cannot fetch data from service: fetch failed` during login

**Status:** ✅ READY FOR DEPLOYMENT

---

## 🚀 DEPLOYMENT STEPS

### Step 1: Pull Latest Changes

```bash
ssh root@109.205.181.119
cd /var/www/html/ecom/app
git pull origin feature/relivator-ui-integration
```

### Step 2: Update DATABASE_URL with Connection Pooling

```bash
# Edit .env.production
nano .env.production

# Find the DATABASE_URL line and update it to:
DATABASE_URL=postgresql://postgres:password@localhost:5432/philippines_ecommerce?schema=public&connection_limit=5&pool_timeout=10
```

### Step 3: Install & Build

```bash
npm install
npm run build
```

### Step 4: Restart PM2

```bash
pm2 restart ecosystem.config.js
sleep 10
pm2 status
```

### Step 5: Verify Deployment

```bash
# Test homepage
curl -s -o /dev/null -w "Homepage: %{http_code}\n" https://extremelifeherbal.com

# Test database connection
psql postgresql://postgres:password@localhost:5432/philippines_ecommerce -c "SELECT COUNT(*) FROM \"User\";"
```

---

## 🧪 TEST LOGIN

1. Go to: https://extremelifeherbal.com/auth/login
2. Enter: admin@test.com / Admin123!
3. Should redirect to /admin dashboard
4. ✅ No "fetch failed" error

---

## 📋 WHAT WAS FIXED

✅ Prisma client caching in production  
✅ Error handling in auth callbacks  
✅ Connection pooling configuration  
✅ Graceful shutdown handlers  
✅ Better error logging  

---

**Status:** Ready for deployment ✅

