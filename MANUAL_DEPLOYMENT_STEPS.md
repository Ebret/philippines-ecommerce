# 🚀 MANUAL DEPLOYMENT STEPS - AUTHENTICATION FIX

**Execute these commands on the VPS (109.205.181.119) as root**

---

## STEP 1: Navigate to App Directory

```bash
cd /var/www/html/ecom/app
pwd
```

---

## STEP 2: Pull Latest Changes

```bash
git pull origin feature/relivator-ui-integration
```

**Expected Output:**
```
From github.com:Ebret/philippines-ecommerce
 * branch            feature/relivator-ui-integration -> FETCH_HEAD
Updating ccaa2ca..a7aa78d
Fast-forward
 DEPLOY_AUTH_FIX_FINAL.sh | 86 ++++++++++++++++++++++++++++++++++++++
 1 file changed, 86 insertions(+)
```

---

## STEP 3: Update DATABASE_URL with Connection Pooling

```bash
# Backup original
cp .env.production .env.production.backup

# Edit the file
nano .env.production
```

**Find this line:**
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/philippines_ecommerce
```

**Replace with:**
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/philippines_ecommerce?schema=public&connection_limit=5&pool_timeout=10
```

**Save:** Press `Ctrl+O`, then `Enter`, then `Ctrl+X`

**Verify:**
```bash
grep DATABASE_URL .env.production
```

---

## STEP 4: Install Dependencies

```bash
npm install
```

---

## STEP 5: Build Application

```bash
npm run build
```

**Expected:** Build completes successfully with "✓ Compiled successfully"

---

## STEP 6: Restart PM2

```bash
pm2 restart ecosystem.config.js
sleep 10
pm2 status
```

**Expected:** Status shows "online"

---

## STEP 7: Verify Homepage

```bash
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" https://extremelifeherbal.com
```

**Expected:** HTTP Status: 200

---

## STEP 8: Test Database Connection

```bash
psql postgresql://postgres:password@localhost:5432/philippines_ecommerce -c "SELECT COUNT(*) as user_count FROM \"User\";"
```

**Expected:** Shows user count

---

## STEP 9: Verify Test Accounts

```bash
psql postgresql://postgres:password@localhost:5432/philippines_ecommerce -c "SELECT email, role, status FROM \"User\" WHERE email LIKE '%test.com%' ORDER BY email;"
```

**Expected:**
```
        email         | role  | status
----------------------+-------+--------
 admin@test.com       | ADMIN | ACTIVE
 buyer@test.com       | BUYER | ACTIVE
 seller@test.com      | SELLER| ACTIVE
```

---

## STEP 10: Check PM2 Logs

```bash
pm2 logs philippines-ecommerce --lines 50 --nostream
```

**Look for:** No error messages, connection successful

---

## ✅ DEPLOYMENT COMPLETE!

**Test Accounts:**
- Admin: admin@test.com / Admin123!
- Buyer: buyer@test.com / Buyer123!
- Seller: seller@test.com / Seller123!

**Login URL:** https://extremelifeherbal.com/auth/login

---

## 🧪 TEST LOGIN

1. Go to https://extremelifeherbal.com/auth/login
2. Enter admin@test.com / Admin123!
3. Should redirect to /admin dashboard
4. ✅ No "fetch failed" error

---

**Status:** Ready for testing ✅

