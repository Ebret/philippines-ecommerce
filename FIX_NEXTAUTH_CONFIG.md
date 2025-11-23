# 🔧 FIX NEXTAUTH CONFIGURATION ERROR

**Issue:** NextAuth missing NEXTAUTH_SECRET environment variable  
**Error:** `[next-auth][error][NO_SECRET]`  
**Solution:** Set NEXTAUTH_SECRET in .env.production

---

## 🚀 QUICK FIX (Run on VPS)

```bash
cd /var/www/html/ecom/app

# Step 1: Check current .env.production
cat .env.production | grep NEXTAUTH

# Step 2: Generate a new NEXTAUTH_SECRET if missing
NEXTAUTH_SECRET=$(openssl rand -base64 32)
echo "NEXTAUTH_SECRET=$NEXTAUTH_SECRET"

# Step 3: Add to .env.production
echo "NEXTAUTH_SECRET=$NEXTAUTH_SECRET" >> .env.production

# Step 4: Verify it was added
cat .env.production | grep NEXTAUTH_SECRET

# Step 5: Restart PM2
pm2 restart philippines-ecommerce
sleep 5
pm2 status

# Step 6: Verify deployment
curl -I https://extremelifeherbal.com/
```

---

## 📝 ALTERNATIVE: Manual Setup

If the above doesn't work, manually edit .env.production:

```bash
# Open the file
nano .env.production

# Add this line (if not present):
NEXTAUTH_SECRET=your-secret-key-here

# Generate a proper secret:
openssl rand -base64 32
```

---

## ✅ VERIFICATION

After fixing, verify:

```bash
# Check if NEXTAUTH_SECRET is set
grep NEXTAUTH_SECRET .env.production

# Check PM2 status
pm2 status

# Check logs
pm2 logs philippines-ecommerce --lines 20

# Test homepage
curl -I https://extremelifeherbal.com/

# Test account page (should redirect to login, not error)
curl -I https://extremelifeherbal.com/account/profile
```

---

## 🎯 EXPECTED RESULTS

After fix:
- ✅ No more `[next-auth][error][NO_SECRET]` errors
- ✅ Homepage returns HTTP 200
- ✅ Account pages redirect to login (HTTP 307) instead of error
- ✅ PM2 status shows "online"

---

**Run the quick fix above to resolve the NextAuth configuration!**

